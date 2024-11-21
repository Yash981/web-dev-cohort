import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../controller/v1/user-controller";
export const userMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    const token = req.headers.authorization
    if(!token){
        res.status(401).json({
            message:"Authentication Required"
        })
        return;
    }
    try {
        const decoded = jwt.verify(token as string,JWT_SECRET) as { id: string}
        console.log(decoded,'decoded')
        //@ts-ignore
        req.user = {id:decoded.userid};
        next()
    } catch (error) {
        console.log(error,'errorrr')
        res.status(400).json({
            message: 'Invalid Token'
        })
    }
}