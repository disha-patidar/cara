const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected, Refunded
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);