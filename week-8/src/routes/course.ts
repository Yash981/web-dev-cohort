import { Request, Response } from "express";
import { courseModel } from "../db/schema";

const { Router } = require('express');
const CourseRoutes = Router();
CourseRoutes.get('/courses',(req : Request,res:Response)=>{
        const username = req.body.username
        const password = req.body.password
    
        return res.status(200).send({
            "Welcome":'Yashwanth',
        })
    })
    
    CourseRoutes.post('//purchase',(req:Request,res:Response)=>{
        const username = req.body.username
        const password = req.body.password
    
        return res.status(200).send({
            "Welcome":'Yashwanth',
        })
    })

export default CourseRoutes