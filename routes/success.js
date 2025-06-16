const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // adjust path if different

// ✅ Order Success Page Route
router.get('/order/success', async (req, res) => {
  const { orderId } = req.query;

  try {
    // 1. Validate order ID
    if (!orderId) {
      return res.status(400).send('Missing order ID.');
    }

    // 2. Mark order as paid (if using manual update — if not already done by payment webhook)
    await Order.findByIdAndUpdate(orderId, {
      status: 'paid',
      paidAt: new Date()
    });

    // 3. Render confirmation page
    res.render('order-success', { orderId });

  } catch (error) {
    console.error('Error processing success route:', error);
    res.status(500).send('Something went wrong while confirming your order.');
  }
});

module.exports = router;