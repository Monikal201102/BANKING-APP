const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  totalRepayment: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Loan", loanSchema);
