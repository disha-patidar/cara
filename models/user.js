const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
   isAdmin: {
    type: Boolean,
    default: false
  },
  address: String,
  phone: String,
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

// This will automatically add username, hash, salt, and authentication methods
userSchema.plugin(passportLocalMongoose);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;