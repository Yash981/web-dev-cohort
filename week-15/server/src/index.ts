import express from 'express'
import { Routes } from './routes/v1'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import multer from 'multer';

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true ,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']

}))
app.use(express.json());


app.use(cookieParser());
app.use('/api/v1',Routes)
app.listen(9000,()=>{
    console.log('server is listening at 9000')
})