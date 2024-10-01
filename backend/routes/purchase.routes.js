import express from 'express'

const purchaseRouter = express.Router();


purchaseRouter.route('/purchaseCatelouge').get();



export default purchaseRouter;