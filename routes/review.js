const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');

// POST a new review
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/products');
    }

    const { rating, comment } = req.body.review;

    // Validate required fields manually to avoid undefined errors
    if (!rating || !comment) {
      req.flash('error', 'Rating and comment are required.');
      return res.redirect(`/products/${product._id}`);
    }

    const newReview = new Review({
      rating,
      comment,
      user: req.user._id
    });
    

    await newReview.save();
    product.reviews.push(newReview);
    await product.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while posting your review.');
    res.redirect('/products');
  }
});
router.post("/products/:id/reviews", async (req, res) => {
  const product = await Product.findById(req.params.id);
  const review = new Review(req.body.review);

  review.user = req.user._id; // ✅ set the logged-in user
  await review.save();

  product.reviews.push(review);
  await product.save();

  req.flash("success", "Review added!");
  res.redirect(`/products/${product._id}`);
});

// DELETE a review
router.delete('/:reviewId', isLoggedIn, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/products/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting review.');
    res.redirect(`/products/${req.params.id}`);
  }
});

module.exports = router;