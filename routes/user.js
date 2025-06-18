const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const Order = require('../models/order');
const { isLoggedIn,saveRedirectUrl }=require("../middleware.js");
const userController=require("../controllers/users.js");

router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(userController.login));

router.get("/logout",userController.logout);

router.get("/my-orders", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ "user.email": req.user.email }).sort({ createdAt: -1 });
    res.render("myOrders", { orders });
  } catch (err) {
    console.error("❌ Error fetching user's orders:", err);
    res.status(500).send("Error loading orders.");
  }
});
module.exports=router;