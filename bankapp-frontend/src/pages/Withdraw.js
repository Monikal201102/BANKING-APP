import React, { useState } from "react";
import axios from "../api/axios";

const Withdraw = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientUpiId: "",
    yourUpiPin: "",
    recipientNeftReferenceId: "",
    description: "", // ✅ Added description field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return false;
    }

    if (!formData.recipientName.trim()) {
      alert("Please enter Recipient Name.");
      return false;
    }

    if (method === "UPI") {
      if (!formData.recipientUpiId.trim()) {
        alert("Please enter Recipient UPI ID.");
        return false;
      }
      if (!formData.yourUpiPin.trim()) {
        alert("Please enter Your UPI PIN.");
        return false;
      }
    } else if (method === "NEFT/IMPS") {
      if (!formData.recipientNeftReferenceId.trim()) {
        alert("Please enter Recipient NEFT/IMPS Reference ID.");
        return false;
      }
      if (!formData.yourUpiPin.trim()) {
        alert("Please enter Your UPI PIN.");
        return false;
      }
    }

    return true;
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const payload = {
        amount: Number(amount),
        method,
        recipientName: formData.recipientName,
        yourUpiPin: formData.yourUpiPin,
        description: formData.description, // ✅ Include in payload
        ...(method === "UPI" && { recipientUpiId: formData.recipientUpiId }),
        ...(method === "NEFT/IMPS" && {
          recipientNeftReferenceId: formData.recipientNeftReferenceId,
        }),
      };

      const token = localStorage.getItem("authToken");
      console.log("🔐 Token:", token);

      const res = await axios.post("/transactions/withdraw", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || "Withdrawal successful!");
      setAmount("");
      setFormData({
        recipientName: "",
        recipientUpiId: "",
        yourUpiPin: "",
        recipientNeftReferenceId: "",
        description: "", // ✅ Reset
      });
    } catch (err) {
      console.error("❌ Withdrawal failed:", err);
      alert(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Withdraw Funds</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleWithdraw}>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Withdrawal Method</label>
          <select
            className="form-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="NEFT/IMPS">NEFT/IMPS</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Recipient Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.recipientName}
            onChange={(e) =>
              setFormData({ ...formData, recipientName: e.target.value })
            }
            required
          />
        </div>

        {method === "UPI" && (
          <>
            <div className="mb-3">
              <label className="form-label">Recipient UPI ID</label>
              <input
                type="text"
                className="form-control"
                value={formData.recipientUpiId}
                onChange={(e) =>
                  setFormData({ ...formData, recipientUpiId: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Your UPI PIN</label>
              <input
                type="password"
                className="form-control"
                value={formData.yourUpiPin}
                onChange={(e) =>
                  setFormData({ ...formData, yourUpiPin: e.target.value })
                }
                required
              />
            </div>
          </>
        )}

        {method === "NEFT/IMPS" && (
          <>
            <div className="mb-3">
              <label className="form-label">Recipient Reference ID</label>
              <input
                type="text"
                className="form-control"
                value={formData.recipientNeftReferenceId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recipientNeftReferenceId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Your UPI PIN</label>
              <input
                type="password"
                className="form-control"
                value={formData.yourUpiPin}
                onChange={(e) =>
                  setFormData({ ...formData, yourUpiPin: e.target.value })
                }
                required
              />
            </div>
          </>
        )}

        {/* ✅ Description field added */}
        <div className="mb-3">
          <label className="form-label">Description (optional)</label>
          <input
            type="text"
            className="form-control"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="E.g. Rent transfer, bill payment, etc."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
