import Order from '../models/orderModel.js';

// Submit new deal request
export const placeOrderOffer = async (req, res) => {
    const { crop_id, offer_price, quantity_kg } = req.body;
    const buyer_id = req.user.id; // Pulled from the verified buyer token payload

    if (!crop_id || !offer_price || !quantity_kg) {
        return res.status(400).json({ message: 'Missing offer parameter attributes.' });
    }

    try {
        const orderId = await Order.create({ crop_id, buyer_id, offer_price, quantity_kg });
        res.status(201).json({ message: 'Deal proposal submitted to producer node.', orderId });
    } catch (error) {
        res.status(500).json({ message: 'Error processing contract offer.', error: error.message });
    }
};

// Retrieve data context indices matching user profiles
export const getMyOrders = async (req, res) => {
    try {
        let orderRegistry;
       
        if (req.user.role === 'buyer') {
            orderRegistry = await Order.findByBuyerId(req.user.id);
        } else if (req.user.role === 'farmer') {
            orderRegistry = await Order.findIncomingByFarmerId(req.user.id);
        } else {
            return res.status(403).json({ message: 'Unauthorized role action.' });
        }

        res.status(200).json(orderRegistry);
    } catch (error) {
        res.status(500).json({ message: 'Error listing contract parameters.', error: error.message });
    }
};

// Accept or Decline pending transactions
export const respondToOffer = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body; // Expects 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid target evaluation state.' });
    }

    try {
        // Option: we could verify here if the crop matches the farmer id, but keeping it direct:
        const modified = await Order.updateStatus(orderId, status);
        if (modified === 0) return res.status(404).json({ message: 'Contract node target mismatch.' });

        res.status(200).json({ message: `Contract successfully updated to state: ${status}.` });
    } catch (error) {
        res.status(500).json({ message: 'Error deciding contract state transaction.', error: error.message });
    }
};