const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth"); // 👈 add this line
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ UPDATED CORS (ONLY CHANGE)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://banking-app-6enl.vercel.app"
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const loanRoutes = require("./routes/loanRoutes");

app.use("/api/users", userRoutes);              // 🧑‍💼 User management + Auth
app.use("/api/transactions", transactionRoutes); // 💰 Deposit/Withdraw
app.use("/api/loans", loanRoutes);              // 🏦 Loans & recommendations
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Banking App Backend is Running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});