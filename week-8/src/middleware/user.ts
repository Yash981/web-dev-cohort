import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.path==='/signup'){
        const Inputvalidation = z
            .object({
                email: z.string().email(),
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
                firstName: z.string().min(3),
                lastName: z.string().min(3),
            })
            .strict();
        const validationResult = Inputvalidation.safeParse(req.body);
        if (!validationResult.success) {
            return res
                .status(400)
                .send({ message: validationResult.error.issues[0].message });
        }
    } else if(req.path==='/signin'){
        const Inputvalidation = z
            .object({
                email: z.string().email(),
                password: z.string().min(8).max(20),
            })
            .strict();
        const validationResult = Inputvalidation.safeParse(req.body);
        if (!validationResult.success) {
            return res
                .status(400)
                .send({ message: validationResult.error.issues[0].message });
        }
    } else {
        const Inputvalidation = z
            .object({
                email: z.string().email(),
                password: z.string().min(8).max(20),
            })
            .strict();
        const validationResult = Inputvalidation.safeParse(req.body);
        if (!validationResult.success) {
            return res
                .status(400)
                .send({ message: validationResult.error.issues[0].message });
        }
        const token = req.headers.authorization;
        if(!token){
            return res.status(403).send({message:"unauthorized"})
        }
        const response = jwt.verify(token, process.env.JWT_SECRET!);
        if (response) {
            // @ts-ignore
            req.userId = token.userId;
        } else {
            res.status(403).send({message:"unauthorized"})
        }
    }
    next();
};
export default userMiddleware;


export const ComparePassword = async (password:string,hashedPassword:string)=>{
    const compassword = await bcrypt.compare(password,hashedPassword)
    return compassword
}