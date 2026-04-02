const Transaction = require("../models/Transaction");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// ✅ Create a new transaction and update balance
const createTransaction = asyncHandler(async (req, res) => {
  console.log("➡️  Create Transaction called");

  const {
    type,
    amount,
    description,
    method,
    date,
    upiId,
    upiPin,
    chequeNumber,
    referenceId,
  } = req.body;

  console.log("📥 Request Body:", req.body);

  // Validate amount, type, and method explicitly
  if (typeof amount !== "number" || amount <= 0 || !type || !method) {
    return res
      .status(400)
      .json({ message: "Valid amount, type, and method are required." });
  }

  if (!["CR", "DR"].includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type." });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  console.log("👤 User fetched:", user.email);
  console.log("💳 Method:", method);

  // 🔒 Only validate payment info for credit transactions
  if (type === "CR") {
    if (method === "UPI") {
      if (!upiId || !upiPin) {
        return res.status(400).json({ message: "UPI ID and PIN are required." });
      }

      if (!user.upiId || !user.upiPin) {
        return res
          .status(400)
          .json({ message: "Please set UPI ID and PIN from your profile first." });
      }

      if (upiId !== user.upiId || upiPin !== user.upiPin) {
        return res
          .status(400)
          .json({ message: "UPI ID or PIN mismatch with saved details." });
      }
    }

    if (method === "Cheque") {
      if (!chequeNumber) {
        return res
          .status(400)
          .json({ message: "Cheque number is required." });
      }

      if (!user.chequeNumber) {
        return res
          .status(400)
          .json({ message: "Please set your Cheque Number from profile first." });
      }

      if (chequeNumber !== user.chequeNumber) {
        return res
          .status(400)
          .json({ message: "Cheque number mismatch with saved details." });
      }
    }

   if (method === "NEFT/IMPS") {
  if (!referenceId) {
    return res
      .status(400)
      .json({ message: "Reference ID is required." });
  }

  if (!user.neftReferenceId) {
    return res
      .status(400)
      .json({ message: "Please set your NEFT Reference ID from profile first." });
  }

  if (referenceId !== user.neftReferenceId) {
    return res
      .status(400)
      .json({ message: "Reference ID mismatch with saved details." });
  }
}

  }

  // 🏦 Update balance
  if (type === "CR") {
    user.balance += parseFloat(amount);
    console.log(`💰 Balance increased: +${amount}`);
  } else if (type === "DR") {
    if (user.balance < amount) {
      console.log("❌ Insufficient balance");
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= parseFloat(amount);
    console.log(`💸 Balance decreased: -${amount}`);
  }

  // 💾 Save transaction - only add method-specific fields for credit txns
  const transaction = new Transaction({
    userId: user._id,
    type,
    amount,
    description,
    method,
    date: date ? new Date(date) : new Date(), // Ensures correct parsing
    ...(type === "CR" && method === "UPI" && { upiId }),
    ...(type === "CR" && method === "Cheque" && { chequeNumber }),
    ...(type === "CR" && method === "NEFT/IMPS" && { referenceId }),
  });

  user.updatedAt = new Date();
  await transaction.save();
  await user.save();

  console.log("✅ Transaction saved");
  res.status(201).json({ message: "Transaction successful", transaction });
});

// ✅ Get all transactions
const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { type } = req.query;

  if (type && !["CR", "DR"].includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type filter" });
  }

  const filter = { userId };
  if (type) filter.type = type;

  const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
  res.status(200).json(transactions);
});

// ✅ Get transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.status(200).json(transaction);
});

// ✅ Get transaction summary
const getTransactionSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const transactions = await Transaction.find({ userId });

  const summary = transactions.reduce(
    (acc, txn) => {
      if (txn.type === "CR") acc.totalCredit += txn.amount;
      else if (txn.type === "DR") acc.totalDebit += txn.amount;
      return acc;
    },
    { totalCredit: 0, totalDebit: 0 }
  );

  const netBalance = summary.totalCredit - summary.totalDebit;
  res.status(200).json({ ...summary, netBalance });
});

// ✅ Recommend loan
const recommendLoan = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const transactions = await Transaction.find({ userId });
  if (!transactions.length) {
    return res.status(404).json({ message: "No transaction history found" });
  }

  let totalCredit = 0;
  let totalDebit = 0;

  transactions.forEach((tx) => {
    if (tx.type === "CR") totalCredit += tx.amount;
    else if (tx.type === "DR") totalDebit += tx.amount;
  });

  let recommendedAmount =
    totalCredit > totalDebit
      ? totalCredit * 0.5
      : Math.max((totalCredit - totalDebit) * 0.25, 1000);
  let recommendedInterest = totalCredit > totalDebit ? 8 : 15;
  let recommendedDuration = 12;

  res.status(200).json({
    message: "Loan recommendation generated successfully",
    recommendation: {
      recommendedAmount: Math.round(recommendedAmount),
      recommendedInterest,
      recommendedDuration,
      financialSummary: { totalCredit, totalDebit },
    },
  });
});

const withdrawFunds = asyncHandler(async (req, res) => {
  const {
    amount,
    method,
    recipientUpiId,
    recipientNeftReferenceId,
    recipientName,
    yourUpiPin,
    description, // <-- Accept description
  } = req.body;

  // Validate required fields
  if (!amount || !method) {
    return res
      .status(400)
      .json({ message: "Amount and withdrawal method are required." });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance." });
  }

  // 🔒 Method-specific validations
  if (method === "UPI") {
    if (!recipientUpiId || !yourUpiPin) {
      return res.status(400).json({
        message: "Recipient UPI ID and your UPI PIN are required for UPI withdrawal.",
      });
    }

    if (yourUpiPin !== user.upiPin) {
      return res.status(400).json({ message: "Invalid UPI PIN." });
    }
  }

  if (method === "NEFT/IMPS") {
    if (!recipientNeftReferenceId || !yourUpiPin) {
      return res.status(400).json({
        message: "Recipient NEFT Reference ID and your UPI PIN are required for NEFT/IMPS withdrawal.",
      });
    }

    if (yourUpiPin !== user.upiPin) {
      return res.status(400).json({ message: "Invalid UPI PIN." });
    }
  }

  // 💸 Deduct balance
  user.balance -= amount;
  user.updatedAt = new Date();
  await user.save();

  // 📝 Save transaction with description
  const transaction = new Transaction({
    userId: user._id,
    type: "DR",
    amount,
    method,
    description: description || `Withdrawal via ${method}`, // <-- Save description or fallback
    date: new Date(),
    recipient: {
      upiId: recipientUpiId || null,
      neftReferenceId: recipientNeftReferenceId || null,
      name: recipientName || null,
      userId: null,
    },
  });

  await transaction.save();

  res.status(201).json({ message: "Withdrawal successful", transaction });
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionSummary,
  recommendLoan,
  withdrawFunds,  // <--- add this line
};
