import express from 'express';
import { TodosModel, UserModel } from './db';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { auth } from './auth';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect('mongodb://localhost:27017/')

const app = express();
app.use(express.json())


app.post('/week-7/signup',async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    await UserModel.create({
        username,
        password,
        email
    })
    res.send("Welcome " + username);
})

app.post('/week-7/signin',async (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const response = await UserModel.findOne({
        email,
        password
    })

    if(response){
        const token = jwt.sign({
            id: response._id.toString()
        },process.env.JWT_SECRET!)

        res.send({
            token
        })
    }else{
        res.status(403).send({
            message:"Invalid username or password"
        })
    }

})

app.get('/week-7/todos',auth,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId

    const response = await TodosModel.find({
        userId
    })

    res.json(response)
    
})
app.post('/week-7/todos',auth,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId
    const title = req.body.title
    const description = req.body.description
    const done = req.body.done

    await TodosModel.create({
        userId,
        title,
        description,
        done
    })
    res.status(200).send("Todo created successfully")

    
})

app.listen(3000, () => console.log("server is running"));