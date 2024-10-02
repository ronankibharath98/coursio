import express from 'express'
import { adminIsAuthenticated } from '../middleware/adminAuthenticated.js';
import { getEnrollments } from '../controllers/purchase.controller.js';

const purchaseRouter = express.Router();


purchaseRouter.route('/enrollments/:id').get(adminIsAuthenticated, getEnrollments);



export default purchaseRouter;