const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const Order = require("../models/order");
const { isLoggedIn } = require("../middleware");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/checkout', isLoggedIn, (req, res) => {
  const amount = 499;
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  res.render('checkout', { amount, razorpayKey });
});

router.post("/place-order", isLoggedIn, async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_rcptid_11"
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Order creation failed");
  }
});
router.get('/my-orders', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    const orders = await Order.find({
      $or: [
        { user: userId },
        { 'customerDetails.email': userEmail }
      ]
    }).sort({ createdAt: -1 });

    res.render('my-orders', { orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Server error");
  }
});
router.post('/request-return/:id', isLoggedIn, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Optional: Check if already returned
    if (order.returnStatus) {
      return res.status(400).send("Return already requested");
    }

    // Update order with return request
    order.returnStatus = "Pending";
    await order.save();

    res.redirect("/order/my-orders");
  } catch (err) {
    console.error("Return request failed:", err);
    res.status(500).send("Server error");
  }
});

router.get("/details/:id", isLoggedIn, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send("Order not found");
  res.render("order-details", { order });
});
module.exports = router;