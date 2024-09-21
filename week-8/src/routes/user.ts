const { Router } = require("express");
import { Request, Response } from "express";
import { userModel } from "../db/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userMiddleware, { ComparePassword } from "../middleware/user";
const saltRounds = 10;

const userRouter = Router();
userRouter.post("/signup", userMiddleware, async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailExist = await userModel.findOne({
    email,
  });
  if(emailExist){
    return res.status(400).send({message:"Email already exist please login or use another email"})
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await userModel.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return res.status(200).send({
    Welcome: firstName + " " + lastName,
  });
});
userRouter.post("/signin", userMiddleware,async  (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password

  const response = await userModel.findOne({
    email
  })
  if(!response || !response?.password){
    return res.status(403).send({message:"Invalid username or password"})
  }

  const checkPassword = await ComparePassword(password,response.password)
  if(!checkPassword){
    return res.status(403).send({message:"Invalid username or password"})
  }
  if(response){
    const token = jwt.sign({
      id: response._id.toString()
    },
    process.env.JWT_SECRET!)

    return res.status(200).send({
      token
    })
  } else {
    return res.status(403).send({message:"Invalid username or password"})
  }
  
});
userRouter.get("/purchases", (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  return res.status(200).send({
    Welcome: "Yashwanth",
  });
});

export default userRouter;
