const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const { isLoggedIn }=require("../middleware.js");
const razorpay = new Razorpay({
  key_id: "YOUR_TEST_KEY_ID",
  key_secret: "YOUR_TEST_SECRET"
});
router.get('/checkout', isLoggedIn,(req, res) => {
  const amount = 499;
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  res.render('checkout', { amount, razorpayKey });
});
router.post("/place-order",isLoggedIn, async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay works with paise
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

module.exports = router;