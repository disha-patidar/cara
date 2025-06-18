const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Important for linking to user
    required: true
  },
   customerDetails: {
    name: String,
    email: String,
    phone: String,
  },
  address: {
    address: String,
    city: String,
    postalCode: String,
  },
  cart: [
    {
      name: String,
      price: Number,
      discount: Number,
      size: String,
      color: String,
      quantity: { type: Number, default: 1 },
    },
  ],
    totalAmount: Number,
  status: {
    type: String,
    enum: ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
    default: "Placed",
  },
  trackingHistory: [
    {
      status: String,
      date: { type: Date, default: Date.now },
    },
  ],
  paymentMethod: String,
  total: String,
  createdAt: { type: Date, default: Date.now },
returnStatus: {
  type: String,
  enum: ["Pending", "Approved", "Rejected", null],
  default: null
},
razorpayPaymentId: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);