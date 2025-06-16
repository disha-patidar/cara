const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cartItems: cart });
});

router.post("/", (req, res) => {
  const { id, name, size, color, price, discount } = req.body;

  if (!id || !name || !size || !color || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Initialize cart in session if not present
  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push({ id, name, size, color, price, discount });

  res.json({ message: "Added to cart", cart: req.session.cart });
});
module.exports=router;