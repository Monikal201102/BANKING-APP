const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["CR", "DR"], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    method: { type: String, required: true },
    upiId: { type: String },         // sender's or deposit UPI ID
    upiPin: { type: String },        // sender's or deposit UPI PIN (if stored, though sensitive)
    chequeNumber: { type: String },
    neftReferenceId: { type: String },  // renamed from referenceId
    date: { type: Date, default: Date.now },  // transaction date

    // New recipient object for withdrawals (or transfers)
    recipient: {
      upiId: { type: String, default: null },
      neftReferenceId: { type: String, default: null },
      name: { type: String, default: null },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Transaction", transactionSchema);
