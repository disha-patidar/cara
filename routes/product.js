const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const { data: sampleProducts } = require("../init/data.js");
const Review = require("../models/review");
const { isLoggedIn }=require("../middleware.js");
// Sample product route
router.get("/product/sample", (req, res) => {
  const product = sampleProducts[0];
  res.render("product", { product,currentUser: req.user });
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
router.post('/products/:id/reviews', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  const review = new Review({
    rating: req.body.review.rating,
    comment: req.body.review.comment,
    user: req.user._id, // ✅ assign logged-in user
    username: req.user.username // ✅ optional, for display
  });

  product.reviews.push(review);
  await review.save();
  await product.save();

  res.redirect(`/products/${product._id}`);
});

// Safe: Get product by ID
router.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: { path: 'user' }
    });

  res.render('product', { product });
});

// ✅ Middleware to check if current user is the review author
const isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).send("Review not found");
  }
  if (!review.user.equals(req.user._id)) {
    return res.status(403).send("You are not authorized to delete this review.");
  }
  next();
};


// DELETE /products/:id/reviews/:reviewId
router.delete('/products/:productId/reviews/:reviewId',isReviewAuthor,async (req, res) => {
  const { productId, reviewId } = req.params;
  try {
    await Product.findByIdAndUpdate(productId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/products/${productId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting review');
  }
});
module.exports = router;