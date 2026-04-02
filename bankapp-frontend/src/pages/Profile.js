import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    upiId: "",
    upiPin: "",
    chequeNumber: "",
    neftReferenceId: "", // ✅ updated key
    currentUpiPin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          upiId: res.data.upiId || "",
          upiPin: "",
          chequeNumber: res.data.chequeNumber || "",
          neftReferenceId: res.data.neftReferenceId || "", // ✅ updated key
          currentUpiPin: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        alert("Failed to load user profile.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.currentUpiPin) {
      alert("Please enter your current UPI PIN to authorize changes.");
      return;
    }

    const token = localStorage.getItem("authToken");

    // Prepare only the updated fields
    const payload = {
      currentUpiPin: formData.currentUpiPin,
    };
    if (formData.upiId) payload.upiId = formData.upiId;
    if (formData.upiPin) payload.upiPin = formData.upiPin;
    if (formData.chequeNumber) payload.chequeNumber = formData.chequeNumber;
    if (formData.neftReferenceId) payload.neftReferenceId = formData.neftReferenceId; // ✅ updated key

    try {
      const res = await axios.put("/users/update-payment-info", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Payment info updated successfully.");
      setUser((prev) => ({
        ...prev,
        ...res.data,
      }));
      setEditing(false);
      setFormData({
        ...formData,
        upiPin: "",
        currentUpiPin: "",
      });
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    setFormData({
      upiId: user.upiId || "",
      upiPin: "",
      chequeNumber: user.chequeNumber || "",
      neftReferenceId: user.neftReferenceId || "", // ✅ updated key
      currentUpiPin: "",
    });
    setEditing(false);
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">👤 My Profile</h2>

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <hr />
        <h5 className="mt-4">💳 Saved Payment Methods</h5>

        {!editing ? (
          <div>
            <p>
              <strong>UPI ID:</strong> {user.upiId || "Not set"}
            </p>
            <p>
              <strong>UPI PIN:</strong> {user.upiPin ? "******" : "Not set"}
            </p>
            <p>
              <strong>Cheque Number:</strong> {user.chequeNumber || "Not set"}
            </p>
            <p>
              <strong>NEFT/IMPS Ref ID:</strong> {user.neftReferenceId || "Not set"} {/* ✅ updated */}
            </p>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => setEditing(true)}
            >
              Edit Payment Info
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-3">
            <div className="mb-2">
              <label>Current UPI PIN (required)</label>
              <input
                type="password"
                name="currentUpiPin"
                className="form-control"
                value={formData.currentUpiPin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                className="form-control"
                value={formData.upiId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>New UPI PIN</label>
              <input
                type="password"
                name="upiPin"
                className="form-control"
                value={formData.upiPin}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Cheque Number</label>
              <input
                type="text"
                name="chequeNumber"
                className="form-control"
                value={formData.chequeNumber}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>NEFT/IMPS Ref ID</label>
              <input
                type="text"
                name="neftReferenceId" // ✅ updated name
                className="form-control"
                value={formData.neftReferenceId}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
