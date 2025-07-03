require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const dbUrl = process.env.ATLAS_DBURL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB connection error:", err));

async function createAdmin() {
  try {
    const existing = await User.findOne({ username: "disha3108" }); // ✅ FIXED HERE
    if (existing) {
      console.log("Admin already exists");
      return process.exit();
    }

    const newAdmin = new User({
      username: "disha3108",
      email: "dishapatidar29@gmail.com",
      isAdmin: true,
      address: "Admin HQ",
      phone: "9993213912",
    });

    await User.register(newAdmin, "disha3112"); // ✅ Hashes password
    console.log("✅ Admin user created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
