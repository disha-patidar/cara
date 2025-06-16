const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review'); //

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Children', 'Makeup'],
  },
  category: {
    type: String,
    required: true,
    trim: true, // e.g. "Shirts", "Shoes", "Lipstick"
  },
  brand: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0, // as percentage (e.g., 10 = 10%)
    min: 0,
    max: 100,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sizes: [
    {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    },
  ],
  colors: [String], // e.g. ["Red", "Blue", "Black"]
  images: [
    {
      type: String, // URL to image
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
   reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
});
productSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
