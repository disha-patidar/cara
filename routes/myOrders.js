const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { isLoggedIn } = require('../middleware');

// Show user's orders
router.get('/myOrders', isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('orders', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch orders.");
  }
});
router.get('/my-orders', isLoggedIn, async (req, res) => {
  console.log("🔍 Logged in user:", req.user); // DEBUG

  const userEmail = req.user.email;
  const orders = await Order.find({ 'user.email': userEmail }).sort({ createdAt: -1 });

  console.log("🛒 Orders Found:", orders.length); // DEBUG
  res.render('my-orders', { orders });
});

module.exports = router;