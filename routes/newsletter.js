const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber"); // Mongoose model

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.redirect("/?subscribed=empty");
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.redirect("/?subscribed=exists");
    }

    await Subscriber.create({ email });
    res.redirect("/?subscribed=success");
  } catch (err) {
    console.error(err);
    res.redirect("/?subscribed=error");
  }
});

module.exports = router;
