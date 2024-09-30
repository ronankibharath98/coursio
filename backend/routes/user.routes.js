import express from "express";
import { signout, signup, singin } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const userRouter = express.Router();

userRouter.route('/signup').post( signup )
userRouter.route('/signin').post( singin )
userRouter.route('/signout').post( isAuthenticated, signout)


export default userRouter;
