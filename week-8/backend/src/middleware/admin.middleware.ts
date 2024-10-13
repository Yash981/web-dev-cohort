import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// export const adminMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers.authorization;

//   const response = jwt.verify(token!, process.env.ADMIN_JWT_SECRET!);
//   if (response) {
//     // @ts-ignore
//     req.userId = response.id;
//     next();
//   } else {
//     res.status(403).send({
//       message: "unauthorized",
//     });
//   }
// };
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.ADMIN_JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }
    //@ts-ignore
    req.userId = decoded.id; // You can access this in your routes
    next();
  });
};
