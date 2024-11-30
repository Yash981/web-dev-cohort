import { Router } from "express";
import { AddContent, deleteContent, fetchSharedLinkContent, getAllContents, shareBrainLink, UserLogout, UserSignin, UserSignup } from "../../controller/v1/user-controller";
import multer from 'multer';
const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { userMiddleware } from "../../middleware/user-middleware";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      //@ts-ignore
      folder: 'brainly',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    }
  });
  const upload = multer({ storage: storage,limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  } });
export const Routes = Router()


Routes.post('/signup', UserSignup)
Routes.post('/signin', UserSignin)

Routes.post('/content',userMiddleware,upload.single('image'),AddContent)

Routes.get('/content',userMiddleware,getAllContents)

Routes.delete('/content/:contentId',userMiddleware,deleteContent)

Routes.post('/brain/share',userMiddleware,shareBrainLink)

Routes.get('/brain/:sharelink',fetchSharedLinkContent)
//change
Routes.get('/logout',UserLogout)