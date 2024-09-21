import express from 'express';
import CourseRoutes from './routes/course';
import userRouter from './routes/user';
import adminRouter from './routes/admin';
import dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();

const app = express();
app.use(express.json())


app.use('/api/v1/user',userRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/course',CourseRoutes)



async function main() {
    await mongoose.connect("mongodb://localhost:27017/week-8");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}
main()
