const mongoose = require("mongoose");
const Product = require("../models/product");
const { data: sampleProducts } = require("./data");
const dbUrl = process.env.ATLAS_DBURL;
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}
const initDB = async () => {
  try {
    await Product.deleteMany(); // Optional: Clear existing products
    await Product.insertMany(sampleProducts);
    console.log("Sample products inserted successfully");
  } catch (err) {
    console.error("Error inserting products:", err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
