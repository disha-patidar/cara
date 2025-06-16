const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password!
  isAdmin: { type: Boolean, default: false },
  address: String,
  phone: String,
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});

module.exports = { reviewSchema };