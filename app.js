require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session"); 
const Product = require("./models/product");
const User = require("./models/user.js");
const Order = require("./models/order.js");
// adjust path
const contactRoutes = require('./routes/contact');
const Review = require("./models/review.js");
const userRoutes=require("./routes/user.js");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product.js");
const bodyParser = require("body-parser");
const newsletterRoutes = require("./routes/newsletter");

const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');


const passport = require("passport");
const LocalStrategy = require("passport-local");
const adminRoutes = require('./routes/admin');
const multer = require('multer');
const { storage }=require("./cloudConfig.js");
const upload=multer({storage});

// Create database
const MONGO_URL = "mongodb://127.0.0.1:27017/cara";
main().then(() => {
  console.log("connected to database");
}).catch((err) => {
  console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static('public/uploads'));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use(express.json());



const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the User model
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});
app.use(productRoutes);
app.use("/", userRoutes);
app.use("/cart", cartRoutes);
app.use('/products/:id/reviews', reviewRoutes);

app.use(contactRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', require('./routes/admin')); 
app.use("/checkout", checkoutRoutes);
app.use("/order", orderRoutes);

app.use(newsletterRoutes);
app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render('product',{product}); // ya koi view render karo
});
app.get('/', (req, res) => {
  res.render('home');
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.get('/shop', (req, res) => {
  res.render('/shop', { product });
});
app.get("/cart", (req, res) => {
  res.render("cart", { cartItems: [] }); // Actual items will be injected from localStorage in client
});
app.get("/about",(req,res)=>{
res.render("about");
});
app.get("/wishlist", (req, res) => {
  res.render("wishlist");
});
app.get("/order",(req,res)=>{
res.render("success");
});
app.get("/privacy",(req,res)=>{
res.render("privacy");
});
app.get("/terms",(req,res)=>{
res.render("terms");
});
app.get("/refund",(req,res)=>{
res.render("refund");
});
app.get("/blog",(req,res)=>{
res.render("blog");
});
app.get("/contact",(req,res)=>{
res.render("contact");
});
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  next();
});
app.use((req, res, next) => {
  console.log("req.user in global middleware:", req.user);
  next();
});

app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).send("Product not found");

    res.render("product", { product });
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});
app.listen(5000, () => {
  console.log("App is listening to the port 5000");
});