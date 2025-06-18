/*const express = require('express');
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
router.get("/",isLoggedIn, (req, res) => {
  const cart = req.session.cart || [];
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log("Final cart total amount:", totalAmount);

  res.render("checkout", {
    amount: totalAmount,
    razorpayKey: process.env.RAZORPAY_KEY_ID
  });
});
router.post('/checkout/create-order',isLoggedIn, async (req, res) => {
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
router.post("/checkout/verify-payment",isLoggedIn, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const { name, email, phone, address, city, postalCode, cart, total, paymentMethod } = req.body;

    const newOrder = new Order({
      user: { name, email, phone },
      address: { address, city, postalCode },
      cart,
      total,
      paymentMethod,
       razorpayPaymentId: razorpay_payment_id,
         razorpayOrderId: razorpay_order_id,     // optional
  paymentStatus: "paid",                  // optional field
  paidAt: new Date(),  
    });

    await newOrder.save();
 const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourshopemail@gmail.com',
        pass: 'your-app-password' // NOT your normal Gmail password
      }
    });
router.post("/checkout/place-cod-order", isLoggedIn, async (req, res) => {
  try {
    const { name, email, phone, address, city, postalCode, cart, total, paymentMethod } = req.body;

    const newOrder = new Order({
      user: { name, email, phone },
      address: { address, city, postalCode },
      cart,
      total,
      paymentMethod,
      paymentStatus: "cod",
      paidAt: null
    });

    await newOrder.save();

    // ✅ You can send mail to admin here too
    res.json({ success: true });
  } catch (err) {
    console.error("COD order failed:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// GET Order Success Page
router.get('/success', (req, res) => {
  res.render('success', { flash: { success: "Your order has been placed!" } });
});
    const mailOptions = {
      from: 'yourshopemail@gmail.com',
      to: 'adminemail@example.com', // Admin's email
      subject: `🛒 New Order Received from ${name}`,
      html: `
        <h2>New Order Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${postalCode}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <h4>Items:</h4>
        <ul>
          ${cart.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
        </ul>
      `
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.error("Error verifying payment or sending mail:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


module.exports = router;*/

const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');  // ✅ Add this
const Order = require('../models/order');  // ✅ Make sure this path is correct
const { isLoggedIn } = require("../middleware.js");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// GET Checkout Page
router.get("/", isLoggedIn, (req, res) => {
  const cart = req.session.cart || [];
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render("checkout", {
    amount: totalAmount,
    razorpayKey: process.env.RAZORPAY_KEY_ID
  });
});

// ✅ Create Razorpay Order
router.post('/create-order', async (req, res) => {
  const amount = parseInt(req.body.amount) * 100;

  const options = {
    amount,
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Verify Razorpay Payment
router.post("/verify-payment", isLoggedIn, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      cart,
      total,
      paymentMethod
    } = req.body;
const userId = req.user._id;
    const newOrder = new Order({
        user:{ _id: req.user._id,
           name: req.user.name,
  email: req.user.email,
  phone: req.user.phone
        }, 
    customerDetails: { name, email, phone },
      address: { address, city, postalCode },
      cart,
      total,
      paymentMethod,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: "paid",
      paidAt: new Date()
    });
const savedOrder = await newOrder.save();
console.log("Order saved with ID:", savedOrder._id);
   

    // Send Email to Admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourshopemail@gmail.com',
        pass: 'your-app-password' // use app password, not Gmail password
      }
    });

    const mailOptions = {
      from: 'yourshopemail@gmail.com',
      to: 'adminemail@example.com',
      subject: `🛒 New Online Payment Order from ${name}`,
      html: `
        <h2>New Paid Order</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}, ${city}, ${postalCode}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <h4>Items:</h4>
        <ul>
          ${cart.map(item => `<li>${item.name} x ${item.quantity}</li>`).join("")}
        </ul>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ✅ COD Order Route
// ✅ Order Success Page

router.post("/place-cod-order", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      cart,
      totalAmount,
      total,
    } = req.body;
const userId = req.user._id;

    const newOrder = new Order({
      user:{ _id: req.user._id,
           name: req.user.name,
  email: req.user.email,  // ✅ Not from form
  phone: req.user.phone
        }, 
      customerDetails: { name, email, phone },
      address: { address, city, postalCode },
      cart,
      totalAmount,
      total,
      paymentMethod: "Cash On Delivery",
      trackingHistory: [{ status: "Placed" }],
      status: "Placed",
    });
const savedOrder = await newOrder.save();
console.log("✅ Order saved with ID:", savedOrder._id);
 

    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.error("COD Order Error:", err);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});
router.get("/success", (req, res) => {
  res.render("success", { flash: { success: "Your order has been placed!" } });
});

module.exports = router;

/*     */