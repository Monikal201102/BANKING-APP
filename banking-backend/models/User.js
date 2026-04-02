const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
    upiId: {
      type: String,
      default: null,
    },
    upiPin: {
      type: String, // stored as plain text now
      default: null,
    },
    chequeNumber: {
      type: String,
      default: null,
    },
    neftReferenceId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash only the password
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // ❌ Do NOT hash upiPin anymore
    next();
  } catch (err) {
    return next(err);
  }
});

// Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// UPI PIN comparison (plain string check now)
userSchema.methods.matchUpiPin = async function (enteredPin) {
  return this.upiPin === enteredPin;
};

module.exports = mongoose.model("User", userSchema);
