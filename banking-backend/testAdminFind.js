const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
}, { collection: "admins" });

const Admin = mongoose.model("Admin", adminSchema);

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await Admin.findOne({ email: "admin@gmail.com" });
    if (admin) {
      console.log("Admin found:", admin);
    } else {
      console.log("Admin NOT found");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

test();
