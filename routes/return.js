const express = require("express");
const router = express.Router();
const ReturnRequest = require("../models/returnRequest");
const Order = require("../models/order");
const { isLoggedIn } = require("../middleware");

// Submit return request
router.post("/request", isLoggedIn, async (req, res) => {
  const { orderId, reason } = req.body;
  const order = await Order.findById(orderId);

  if (!order || order.user.toString() !== req.user._id.toString()) {
    req.flash("error", "Invalid request");
    return res.redirect("/orders");
  }

  const returnRequest = new ReturnRequest({
    orderId,
    userId: req.user._id,
    reason
  });

  await returnRequest.save();
  order.returnStatus = "Pending";
  await order.save();

  req.flash("success", "Return request submitted");
  res.redirect(`/orders/${orderId}`);
});

module.exports = router;