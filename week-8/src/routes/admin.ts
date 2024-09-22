import { Router } from "express";
import { adminModel, courseModel } from "../db/schema";
import { adminMiddleware } from "../middleware/admin.middleware";
import { ComparePassword } from "../middleware/user.middleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

  await adminModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return res.status(200).send({
    message: "Admin created successfully",
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
    // Do cookie logic
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});
adminRouter.post("/course", adminMiddleware, async (req, res) => {
  // @ts-ignore
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

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
adminRouter.put("/course", async (req, res) => {
  // @ts-ignore
  const adminId = req.userId as any;
  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.findByIdAndUpdate(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title,
      description,
      imageUrl,
      price,
    }
  );
  res.status(200).send({
    message: "Course updated successfully",
    courseId: course?._id,
  });
});
adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
    // @ts-ignore
    const adminId = req.userId
  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.status(200).send({
    courses,
  });
});
export default adminRouter;
