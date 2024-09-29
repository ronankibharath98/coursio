import express from "express";
import { signup, singin } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route('/signup').post(signup)
userRouter.route('/signin').post(singin)
userRouter.route('/signout').post()


export default userRouter;
