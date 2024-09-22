import { Request, Response } from "express";
import { courseModel, purchaseModel } from "../db/schema";
import { authMiddleware } from "../middleware/user.middleware";

const { Router } = require("express");
const CourseRoutes = Router();
CourseRoutes.get(
  "/purchase",
  authMiddleware,
  async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.userId;
    const courseId = req.body.courseId;
    const courses = await purchaseModel.find({
      userId,
      courseId,
    });

    res.status(200).send({
      message: "You have successfully purchased this course",
    });
  }
);

CourseRoutes.get('/preview',async(req:Request,res:Response)=>{
   const allCourses = await courseModel.find()
   res.status(200).send({
    allCourses
   })

})
export default CourseRoutes;
