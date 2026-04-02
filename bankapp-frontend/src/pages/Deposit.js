import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [method, setMethod] = useState("Cash");
  const [upiId, setUpiId] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [userNeftRef, setUserNeftRef] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserNeftRef(res.data.neftReferenceId || "");
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };
    fetchUserData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    if (method === "UPI" && (!upiId || !upiPin)) {
      alert("Please enter both UPI ID and UPI PIN.");
      return;
    }
    if (method === "Cheque" && !chequeNumber) {
      alert("Please enter the Cheque Number.");
      return;
    }
    if (method === "NEFT/IMPS") {
      if (!userNeftRef) {
        alert("Please update your NEFT Reference ID in your profile before depositing via NEFT/IMPS.");
        return;
      }
      if (!referenceId) {
        alert("Please enter the Transaction Reference ID.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        type: "CR",
        amount: parseFloat(amount),
        description,
        method,
        date: customDate
          ? new Date(new Date(customDate).setHours(new Date().getHours(), new Date().getMinutes()))
          : new Date(),

      };

      if (method === "UPI") {
        payload.upiId = upiId;
        payload.upiPin = upiPin;
      } else if (method === "Cheque") {
        payload.chequeNumber = chequeNumber;
      } else if (method === "NEFT/IMPS") {
        payload.referenceId = referenceId;
      }

      await axios.post("/transactions", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Deposit successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("❌ Deposit failed:", err);
      alert("Deposit failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center text-success mb-4">💰 Deposit Funds</h2>

            <form onSubmit={handleDeposit}>
              <div className="mb-3">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Salary, Transfer, Bonus"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Deposit Method</label>
                <select
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="NEFT/IMPS">NEFT/IMPS</option>
                </select>
              </div>

              {method === "UPI" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">UPI ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">UPI PIN</label>
                    <input
                      type="password"
                      className="form-control"
                      value={upiPin}
                      onChange={(e) => setUpiPin(e.target.value)}
                      placeholder="Enter UPI PIN"
                    />
                  </div>
                </>
              )}

              {method === "Cheque" && (
                <div className="mb-3">
                  <label className="form-label">Cheque Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value)}
                    placeholder="Enter Cheque Number"
                  />
                </div>
              )}

              {method === "NEFT/IMPS" && (
                <div className="mb-3">
                  <label className="form-label">Transaction Reference ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="Enter Reference ID"
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Date (optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>

              <button className="btn btn-success w-100" type="submit">
                Deposit Now
              </button>
            </form>

            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
