import express from 'express';
import { placeOrderOffer, getMyOrders, respondToOffer } from '../controllers/orderController.js';
import {authenticateToken} from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.use(authenticateToken); // Protect all order workflows

orderRouter.post('/', placeOrderOffer);          // POST /api/orders (Buyers submit)
orderRouter.get('/', getMyOrders);               // GET /api/orders (Farmers/Buyers view)
orderRouter.put('/:orderId/status', respondToOffer); // PUT /api/orders/5/status (Farmers moderate)

export default orderRouter;