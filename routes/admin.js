const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const {isLoggedIn}=require("../middleware.js");

function isAdmin(req, res, next) {
  //console.log("User object in request:", req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).send("Access Denied");
}
// Admin Dashboard at /admin/
router.get('/',isAdmin, async (req, res) => {
  const products = await Product.find();
  res.render('admin/dashboard', { products });
});

// Show Add Product Form
router.get('/products/add',isLoggedIn, isAdmin, (req, res) => {
  console.log("✅ GET /products/add - Admin verified");
  res.render('admin/addProduct');
});
// Add Product
router.post('/products/add', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    let { name, price, category, section, description, sizes, colors, discount, stock } = req.body;

    sizes = sizes.split(',').map(s => s.trim());
    colors = colors.split(',').map(c => c.trim());
    discount = Number(discount);
    stock = Number(stock);

    const images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));

    const product = new Product({
      name,
      price,
      category,
      section,
      description,
      sizes,
      colors,
      discount,
      stock,
      images
    });

    await product.save();
    res.redirect('/admin');
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).send("Error saving product");
  }
});

// Delete Product
router.post('/products/delete/:id',isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});
router.get('/products/edit/:id',isAdmin,upload.array('images', 5), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render('admin/editProduct', { product });
});

// POST: Update Product
router.post('/products/edit/:id', isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    let { name, price, category, section, description, sizes, colors, discount, stock } = req.body;
    sizes = sizes.split(',').map(s => s.trim());
    colors = colors.split(',').map(c => c.trim());
    discount = Number(discount);
let images = req.files && req.files.length > 0
  ? req.files.map(f => ({
      url: `/uploads/${f.filename}`,
      filename: f.filename
    }))
  : null;

    // Update only the fields provided
    const updatedFields = {
      name,
      price,
      category,
      section,
      description,
      sizes,
      colors,
      discount,
      stock,
    };
    if (images) updatedFields.images = images;

    await Product.findByIdAndUpdate(req.params.id, updatedFields);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
});
router.get('/admin/orders', isAdmin, async (req, res) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.render('admin/orders', { orders });
});

router.post("/update-order-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    order.status = status;
    order.trackingHistory.push({ status });
    await order.save();
    res.redirect("/admin/orders"); // Or send JSON
  } catch (err) {
    res.status(500).send("Error updating status");
  }
});
module.exports = router;