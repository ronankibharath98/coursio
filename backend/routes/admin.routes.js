import express from 'express';
import { getAdminCourses, refreshAccessToken, signout, signup, singin } from '../controllers/admin.controller.js';
import { adminIsAuthenticated } from '../middleware/adminAuthenticated.js';

const adminRouter = express.Router();

adminRouter.route('/signup').post(signup);
adminRouter.route('/signin').post(singin);
adminRouter.route('/signout').post(signout);
adminRouter.route('/refreshAccessToken').post(refreshAccessToken)
adminRouter.route('/allCourses').get(adminIsAuthenticated, getAdminCourses);
adminRouter.route('/course/bulk').get();



export default adminRouter;

