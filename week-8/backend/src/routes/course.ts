import { Request, Response } from "express";
import { courseModel, purchaseModel } from "../db/schema";
import { authMiddleware } from "../middleware/user.middleware";
import { Router } from "express";
import  jwt  from "jsonwebtoken";
const CourseRoutes = Router();
CourseRoutes.post(
  "/purchase",
  authMiddleware,
  async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId;
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(400).send({ message: "Course Id is required" });
    }
    try {
      const existingPurchase = await purchaseModel.findOne({
        userId,
        courseId,
      });
      if (existingPurchase) {
        return res.status(409).send({ message: "Course already purchased" });
      }
      const newPurchase = new purchaseModel({
        userId,
        courseId,
      });
      await newPurchase.save();
      res.status(201).send({
        message: "Course purchased successfully",
        purchase: newPurchase,
      });
    } catch (error) {
      console.error("Error purchasing course:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

CourseRoutes.get("/preview", async (req:Request ,  res: Response) => {
  const allCourses = await courseModel.find();
  
  res.status(200).send({
    allCourses,
  });
});
export default CourseRoutes;
