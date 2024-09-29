import express from 'express'

const purchaseRouter = express.Router();


purchaseRouter.route('/purchase-catelouge').get();



export default purchaseRouter;