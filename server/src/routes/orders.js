import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { customer, items, total } = req.body;
  if (!customer?.name || !customer?.email || !customer?.address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Customer details and at least one item are required.' });
  }
  try {
    if (Order.db.readyState === 1) {
      const order = await Order.create({ customer, items, total });
      return res.status(201).json({ message: 'Order created', orderId: order._id });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create order', error: error.message });
  }
  res.status(201).json({ message: 'Order received in demo mode', orderId: `TREND-${Date.now()}` });
});

export default router;