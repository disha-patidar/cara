const mongoose=require("mongoose");
const Product = require('../models/product');
const { data: sampleProducts } = require('./data');
const MONGO_URL="mongodb://127.0.0.1:27017/cara";
main().then(() =>{
console.log("connected to database");
}).catch((err) =>{
console.log(err);
});
async function main(){
  await mongoose.connect(MONGO_URL);
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