import { Router } from "express";
import { AddContent, deleteContent, fetchSharedLinkContent, getAllContents, shareBrainLink, UserSignin, UserSignup } from "../../controller/v1/user-controller";
import { userMiddleware } from "../../middleware/user-middleware";

export const Routes = Router()


Routes.post('/signup', UserSignup)
Routes.post('/signin', UserSignin)

Routes.post('/content',userMiddleware,AddContent)

Routes.get('/content',userMiddleware,getAllContents)

Routes.delete('/content/:contentId',userMiddleware,deleteContent)

Routes.post('/brain/share',userMiddleware,shareBrainLink)

Routes.get('/brain/:sharelink',fetchSharedLinkContent)