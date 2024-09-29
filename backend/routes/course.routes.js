import express from 'express';

const courseRouter = express.Router();

courseRouter.route('/course-catalogue').get()
courseRouter.route('/favourite').get()
courseRouter.route('/cart').get()
courseRouter.route('/purchases').get()

export default courseRouter;