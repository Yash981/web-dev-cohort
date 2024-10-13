import express from 'express';
import CourseRoutes from './routes/course';
import userRouter from './routes/user';
import adminRouter from './routes/admin';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true , // Allow credentials (cookies, authorization headers, etc.)
}))
app.use(express.json())
app.use(cookieParser());


app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/courses',CourseRoutes)



async function main() {
    await mongoose.connect("mongodb://localhost:27017/week-8");
    app.listen(9001, () => {
        console.log('Server is running on port 9001');
    });
}
main()
