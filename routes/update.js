const express = require("express");
const router = express.Router();
const Order = require("../models/order");

router.post("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    order.status = status;
    order.trackingHistory.push({ status });
    await order.save();
    res.redirect("/admin/orders"); // Or send JSON
  } catch (err) {
    res.status(500).send("Error updating status");
  }
});
module.exports = router;