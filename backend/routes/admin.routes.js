import express from 'express';
import { signup } from '../controllers/user.controller.js';

const adminRouter = express.Router();

adminRouter.route('/signup').post(signup);
adminRouter.route('/signin').post()
adminRouter.route('/dashboard').get();
adminRouter.route('/add-course').post();
adminRouter.route('update-course').post();



export default adminRouter;

