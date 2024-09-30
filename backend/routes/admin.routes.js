import express from 'express';
import { signout, signup, singin } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.route('/signup').post(signup);
adminRouter.route('/signin').post(singin);
adminRouter.route('/signout').post(signout);
adminRouter.route('/course').post();
adminRouter.route('/course').put();
adminRouter.route('/course/bulk').get();



export default adminRouter;

