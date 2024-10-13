import { Router } from "express";
import { Request, Response } from "express";
import { courseModel, purchaseModel, userModel } from "../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  authMiddleware,
  ComparePassword,
  validateInput,
} from "../middleware/user.middleware";
const saltRounds = 10;

const userRouter = Router();
//signup user
userRouter.post(
  "/signup",
  validateInput,
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const emailExist = await userModel.findOne({
      email,
    });
    if (emailExist) {
      return res.status(409).send({
        message: "Email already exists. please login or use another email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const token = jwt.sign(
      { id: newUser._id.toString() },
      process.env.USER_JWT_SECRET!,
    );
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return res.status(201).send({
      profile: newUser,
      token
    });
  }
);
//signin user
userRouter.post(
  "/signin",
  validateInput,
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const response = await userModel.findOne({
      email,
    });
    if (!response || !response?.password) {
      return res.status(403).send({ message: "Invalid username or password" });
    }

    const checkPassword = await ComparePassword(password, response.password);
    if (!checkPassword) {
      return res.status(403).send({ message: "Invalid username or password" });
    }
    if (response) {
      const token = jwt.sign(
        { id: response._id.toString() },
        process.env.USER_JWT_SECRET! 
      );
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      //do cookies logic
      return res.status(200).send({
        token,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      });

    } else {
      return res.status(403).send({ message: "Invalid username or password" });
    }
  }
);

//get profile
userRouter.get(
  "/profile",
  authMiddleware,
  async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId;

    if (!userId) {
      return res.status(403).send({ message: "User not found" });
    }
    const response = await userModel.findById(userId);

    if (!response) {
      return res.status(403).send({ message: "User not found" });
    }
    console.log(response);
    return res.status(200).send({ profile: response });
  }
);
//update profile
userRouter.put("/profile", authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    return res.status(403).send({ message: "User not found" });
  }
  const { firstName, lastName,password } = req.body;
  const updatedData : any = {};

  if(firstName){
    updatedData.firstName = firstName
  }
  if(lastName){
    updatedData.lastName = lastName
  }
  if(password){
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    updatedData.password = hashedPassword
  }

  const response = await userModel.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });
  return res.status(200).send({
    profile: response,
  });
});
interface AuthenticatedRequest extends Request {
  userId?: string;
}
//purchased ones
userRouter.get("/purchases", authMiddleware, async function(req:AuthenticatedRequest, res) {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
      userId,
  });

  const coursesData = await courseModel.find({
      _id: { $in: purchases.map((purchase) => purchase.courseId) },
  })

  res.json({
      purchases,
      coursesData
  })
})
userRouter.post('/logout', (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  res.status(200).send({ message: "Logout successful" });
})
export default userRouter;
