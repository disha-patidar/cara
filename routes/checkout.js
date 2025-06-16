const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { isLoggedIn }=require("../middleware.js");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// GET Checkout Page
router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log("Final cart total amount:", totalAmount);

  res.render("checkout", {
    amount: totalAmount,
    razorpayKey: process.env.RAZORPAY_KEY_ID
  });
});
router.post('/checkout/create-order', async (req, res) => {
  const amount = req.body.amount;
  console.log("Final cart total amount:", amount); // ✅ now you’ll see the correct value
});
// POST Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const amount = 50000; // ₹500 in paise
  const options = {
    amount,
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// POST Verify Payment Signature
/*router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Save order to DB here
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
router.post('/checkout/verify-payment', async (req, res) => {
  // after successful Razorpay verification
  if (true) {
    const { name, email, phone, address, city, state, zip, amount, cart } = req.body;

    const newOrder = new Order({
      user: req.user?._id || null, // if user is logged in
      items: cart,
      amount,
      address: `${address}, ${city}, ${state} - ${zip}`,
    });

    await newOrder.save();

    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});*/

router.post("/checkout/verify-payment", async (req, res) => {
  try {
    // ✅ Payment was successful — save order
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Optional: verify Razorpay signature here using crypto

    // ✅ Get details from frontend — use session or send in body
    const { name, email, phone, address, city, postalCode, cart, total, paymentMethod } = req.body;

    const newOrder = new Order({
      user: { name, email, phone },
      address: { address, city, postalCode },
      cart,
      total,
      paymentMethod,
    });

    await newOrder.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ success: false, error: "Order creation failed" });
  }
});
// GET Order Success Page
router.get('/order-success', (req, res) => {
  res.render('order-success', { flash: { success: "Your order has been placed!" } });
});

module.exports = router;