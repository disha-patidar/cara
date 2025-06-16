const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const { data: sampleProducts } = require("../init/data.js");

// Sample product route
router.get("/product/sample", (req, res) => {
  const product = sampleProducts[0];
  res.render("product", { product });
});

// All products listing
router.get("/listing", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("listing", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product listings");
  }
});

// Safe: Get product by ID
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid product ID.");
    return res.redirect("/listing");
     res.render("product", { product,currUser: req.user }); 
  }

  const product = await Product.findById(id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "username"
    }
  });

  if (!product) {
    req.flash("error", "Product not found.");
    return res.redirect("/listing");
  }

  res.render("product", { product });
});


module.exports = router;