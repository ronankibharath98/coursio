import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { addCourse, applyCourse, getAllCourses, updateCourse } from '../controllers/course.controllers.js';
import { adminIsAuthenticated } from '../middleware/adminAuthenticated.js';

const courseRouter = express.Router();

// user protected routes to get courses and apply/purchase to course
courseRouter.route('/courseCatalogue').get(isAuthenticated, getAllCourses)
courseRouter.route('/apply/:id').post(isAuthenticated, applyCourse)

//admin protected routes to add and update courses
courseRouter.route('/addCourse').post(adminIsAuthenticated, addCourse);
courseRouter.route('/updateCourse/:id').put(adminIsAuthenticated, updateCourse);
courseRouter.route('/cart').get()
courseRouter.route('/purchases').get()

export default courseRouter;