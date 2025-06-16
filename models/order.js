const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
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
  paymentMethod: String,
  total: String,
  status: { type: String, default: "Placed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);