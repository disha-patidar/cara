const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Assuming user is logged in and we get their ID from session or JWT
router.get("/tracking", async (req, res) => {
  try {
    const userId = req.session.userId; // or however you store user info
    const order = await Order.findOne({ userId }).sort({ createdAt: -1 });
    if (!order) return res.status(404).send("No order found");
    res.render("user/order-tracking", { order });
  } catch (err) {
    res.status(500).send("Error loading tracking page");
  }
});

module.exports = router;