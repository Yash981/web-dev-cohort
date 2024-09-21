import express from "express";
import { TodosModel, UserModel } from "./db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { auth, ComparePassword } from "./auth";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { z } from "zod";
const saltRounds = 10;
dotenv.config();

mongoose.connect("mongodb://localhost:27017/");

const app = express();
app.use(express.json());

//user sign up
app.post("/week-7/signup", async (req, res) => {
  const inputValidation = z
    .object({
      username: z.string().min(3),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine((val) => /[a-z]/.test(val), {
          message: "Password must contain at least one lowercase letter",
        })
        .refine((val) => /[A-Z]/.test(val), {
          message: "Password must contain at least one uppercase letter",
        })
        .refine((val) => /[0-9]/.test(val), {
          message: "Password must contain at least one digit",
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: "Password must contain at least one special character",
        }),
      email: z.string().email(),
    })
    .strict();

  const validationResult = inputValidation.safeParse(req.body);

  if (!validationResult.success) {
    return res
      .status(400)
      .send({ message: validationResult.error.issues[0].message });
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const emailExist = await UserModel.findOne({
    email,
  });

  if (emailExist) {
    return res
      .status(409)
      .send({
        message: "Email already exist please login or use another email",
      });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await UserModel.create({
    username,
    password: hashedPassword,
    email,
  });
  res.send("Welcome " + username);
});

// user login
app.post("/week-7/signin", async (req, res) => {
  const inputValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
  });

  const validationResult = inputValidation.safeParse(req.body);
  if (!validationResult.success)
    return res
      .status(400)
      .send({ message: validationResult.error.issues[0].message });

  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email,
  });
  if (!response || !response?.password) {
    return res.status(403).send({ message: "Invalid username or password" });
  }
  const checkPassword = await ComparePassword(password, response.password);

  if (!checkPassword) {
    return res.status(403).send("Invalid username or password");
  }
  if (response) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      process.env.JWT_SECRET!
    );

    res.send({
      token,
    });
  } else {
    res.status(403).send({
      message: "Invalid username or password",
    });
  }
});

// get all todos
app.get("/week-7/todos", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  console.log(userId, "useeerid");
  const response = await TodosModel.find({
    userId,
  });

  res.json(response);
});

// create todo
app.post("/week-7/todos", auth, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  const done = req.body.done;
  if (!title || typeof done !== "boolean") {
    return res.status(400).send({ message: "Invalid request body" });
  }
  await TodosModel.create({
    userId,
    title,
    description,
    done,
    timestamp: Date.now(),
  });
  res.status(200).send("Todo created successfully");
});

// update todo
app.patch("/week-7/todos/update", auth, async (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const done = req.body.done;
  await TodosModel.updateOne(
    {
      _id: id,
    },
    {
      title,
      description,
      done,
    }
  );
  res.status(200).send("Todo updated successfully");
});
//delete todo
app.delete("/week-7/todos/delete", auth, async (req, res) => {
  const id = req.body.id;
  await TodosModel.deleteOne({
    _id: id,
  });
  res.status(200).send("Todo deleted successfully");
});
app.listen(3000, () => console.log("server is running"));
