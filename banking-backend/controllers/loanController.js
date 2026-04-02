const Loan = require("../models/Loan");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Apply for a loan
// @route   POST /api/loans/apply
// @access  Private
const applyLoan = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { amount, interestRate, durationMonths } = req.body;

    if (!amount || !interestRate || !durationMonths) {
      return res.status(400).json({ message: "Please provide amount, interest rate, and duration in months." });
    }

    if (
      isNaN(amount) || isNaN(interestRate) || isNaN(durationMonths) ||
      amount <= 0 || interestRate <= 0 || durationMonths <= 0
    ) {
      return res.status(400).json({ message: "All loan inputs must be numbers greater than 0." });
    }

    // Round values for consistent storage
    const roundedAmount = Math.round(amount);
    const totalInterest = (roundedAmount * interestRate * durationMonths) / (100 * 12);
    const totalRepayment = roundedAmount + totalInterest;
    const monthlyPayment = totalRepayment / durationMonths;

    // Check if a loan with same details already exists for this user
    const existingLoan = await Loan.findOne({
      userId,
      amount: roundedAmount,
      interestRate,
      durationMonths,
    });

    if (existingLoan) {
      return res.status(409).json({
        message: "You have already applied for this loan.",
        loan: existingLoan,
      });
    }

    const loan = new Loan({
      userId,
      amount: roundedAmount,
      interestRate,
      durationMonths,
      totalRepayment: Math.round(totalRepayment),
      monthlyPayment: Math.round(monthlyPayment),
      status: "pending",
    });

    await loan.save();

    res.status(201).json({
      message: "Loan application submitted successfully.",
      loan,
    });
  } catch (error) {
    console.error("Loan Application Error:", error);
    res.status(500).json({ message: "Internal server error while applying for loan.", error: error.message });
  }
};

// @desc    Recommend loan based on user's credit/debit history
// @route   GET /api/loans/recommend
// @access  Private
const recommendLoan = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const transactions = await Transaction.find({ userId });

    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach(txn => {
      if (txn.type === "CR") {
        totalCredit += txn.amount;
      } else if (txn.type === "DR") {
        totalDebit += txn.amount;
      }
    });

    const netBalance = totalCredit - totalDebit;

    let recommendation = {
      eligible: false,
      recommendedAmount: 0,
      recommendedInterest: null,
      recommendedDuration: null,
      message: "Insufficient credit history for loan eligibility",
      alreadyApplied: false,
    };

    if (totalCredit >= 10000 && netBalance >= 5000) {
      const recommendedAmount = Math.round(netBalance * 2);
      const recommendedInterest = 10;
      const recommendedDuration = 12;

      // Check if already applied for the recommended loan
      const existingApplication = await Loan.findOne({
        userId,
        amount: recommendedAmount,
        durationMonths: recommendedDuration,
        interestRate: recommendedInterest,
      });

      const alreadyApplied = !!existingApplication;

      recommendation = {
        eligible: true,
        recommendedAmount,
        recommendedInterest,
        recommendedDuration,
        message: "Eligible for a personal loan",
        alreadyApplied,
      };
    }

    res.json(recommendation);
  } catch (error) {
    console.error("Loan recommendation failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  applyLoan,
  recommendLoan,
};
