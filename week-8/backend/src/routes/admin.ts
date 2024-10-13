import { Router } from "express";
import { adminModel, courseModel } from "../db/schema";
import { adminMiddleware } from "../middleware/admin.middleware";
import { ComparePassword } from "../middleware/user.middleware";
import multer from 'multer';
const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //@ts-ignore
    folder: 'course_selling',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  }
});

const upload = multer({ storage: storage });

const saltRounds = 10;
const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const admin = await adminModel.findOne({
    email,
  });
  if (admin) {
    return res.status(400).send({
      message: "Admin already exist",
    });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newAdminUser = await adminModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  const token = jwt.sign(
    { id: newAdminUser._id.toString() },
    process.env.ADMIN_JWT_SECRET!,
  );
  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  return res.status(200).send({
    message: "Admin created successfully",
    profile: newAdminUser,
    token,
  });
});
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email,
  });
  if (!admin || !admin?.password) {
    return res.status(403).send({ message: "Invalid username or password" });
  }

  const checkPassword = await ComparePassword(password, admin.password);
  if (!checkPassword) {
    return res.status(403).send({ message: "Invalid username or password" });
  }
  if (admin) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.ADMIN_JWT_SECRET!
    );
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" }); // Set secure to true in production
    // Do cookie logic
    res.json({
      token: token,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      isAdmin: admin.isAdmin,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});
adminRouter.post("/course", adminMiddleware, upload.single('image'), async (req, res) => {
  // @ts-ignore
  const adminId = req.userId;

  const { title, description,  price } = req.body;
  if (!req.file) {
    return res.status(400).send({ message: "No image file provided" });
  }
  const imageUrl = req.file.path; // This is the Cloudinary URL of the uploaded image
  const course = await courseModel.create({
    title,
    description,
    price,
    imageUrl,
    creatorId: adminId,
  });
  res.status(200).send({
    message: "Course created successfully",
    course: course._id,
  });
});
adminRouter.put("/course", adminMiddleware,upload.single('image'),async (req, res) => {
  // @ts-ignore
  const adminId = req.userId as any;
  const { title, description, price, courseId } = req.body;

  let imageUrl = req.body.imageUrl;
  if (req.file) {
    // If a new image is uploaded, update the imageUrl with the new file's path
    imageUrl = req.file.path; // Cloudinary or file storage URL for the uploaded image
  }
  console.log(title, description, imageUrl, price, courseId, adminId);
  try {
    const course = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        imageUrl,
        price,
      },
      { new: true } // Return the updated document
    );

    if (!course) {
      return res.status(404).send({ message: "Course not found or unauthorized" });
    }

    res.status(200).send({
      message: "Course updated successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).send({ message: "Server error" });
  }
});
adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  // @ts-ignore
  const adminId = req.userId;
  console.log(adminId, 'adminId');

  try {
      const admin = await adminModel.findById(adminId);
      const courses = await courseModel.find({ creatorId: adminId });
      
      if (courses.length === 0) {
          return res.status(200).send({
              message: "No courses found for this admin",
              isAdmin: admin?.isAdmin, // Include isAdmin in the response

          });
      }

      return res.status(200).send({
          courses,
          isAdmin: admin?.isAdmin, // Include isAdmin in the response
      });
  } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).send({
          message: "Error fetching courses",
      });
  }
});
adminRouter.post('/logout', (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.status(200).send({ message: 'Logout successful' });
});

export default adminRouter;
