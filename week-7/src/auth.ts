import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

export function auth(req: Request, res:Response, next: NextFunction) {
    const token = req.headers.authorization

    const response = jwt.verify(token!, process.env.JWT_SECRET!)

    if (response) {
        // @ts-ignore
        req.userId = token.userId
        next()
    }
    else {
        res.status(403).send({
            message: "unauthorized"
        })
    }
}
export const ComparePassword = async (password:string,hashedPassword:string)=>{
    const compassword = await bcrypt.compare(password,hashedPassword)
    return compassword
}