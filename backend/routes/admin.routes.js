import express from 'express';
import { addCourse, refreshAccessToken, signout, signup, singin } from '../controllers/admin.controller.js';
import { adminIsAuthenticated } from '../middleware/adminAuthenticated.js';

const adminRouter = express.Router();

adminRouter.route('/signup').post(signup);
adminRouter.route('/signin').post(singin);
adminRouter.route('/signout').post(signout);
adminRouter.route('/refreshAccessToken').post(refreshAccessToken)
adminRouter.route('/course').post(adminIsAuthenticated, addCourse);
adminRouter.route('/course').put();
adminRouter.route('/course/bulk').get();



export default adminRouter;

