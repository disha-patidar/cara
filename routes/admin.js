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
router.post('/products/add',isAdmin,upload.single('image'),  async (req, res) => {
let { name, price, category,section, description,sizes,colors,discount, stock } = req.body;
 sizes = sizes.split(',').map(s => s.trim());   // 🔥 convert to array
colors = colors.split(',').map(c => c.trim()); // 🔥 convert to array
discount = Number(discount);  
const image = req.file ? `/uploads/${req.file.filename}` : '';

await Product.create({ name, price, category,section, description, sizes,colors,discount, image, stock });
res.redirect('/admin');
});

// Delete Product
router.post('/products/delete/:id',isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});
router.get('/products/edit/:id',isAdmin,upload.single('image'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render('admin/editProduct', { product });
});

// POST: Update Product
router.post('/products/edit/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    let { name, price, category, section, description, sizes, colors, discount, stock } = req.body;
    sizes = sizes.split(',').map(s => s.trim());
    colors = colors.split(',').map(c => c.trim());
    discount = Number(discount);

    let image = req.file ? `/uploads/${req.file.filename}` : null;

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
    if (image) updatedFields.image = image;

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
module.exports = router;