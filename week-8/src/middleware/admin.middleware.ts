import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  const response = jwt.verify(token!, process.env.ADMIN_JWT_SECRET!);

  if (response) {
    // @ts-ignore
    req.userId = token.userId;
    next();
  } else {
    res.status(403).send({
      message: "unauthorized",
    });
  }
};