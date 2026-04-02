import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useUserAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState(""); // ✅ New: to store error messages
  const [success, setSuccess] = useState(""); // ✅ New: to store success messages

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error when typing
    setSuccess(""); // Clear success when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("❌ Password must be at least 6 characters");
      return;
    }

    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      setSuccess("✅ Registration successful!");
      setTimeout(() => navigate("/dashboard"), 1500); // Redirect after short delay
    } catch (err) {
      console.error("🚨 Registration Error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center text-primary mb-4">Create Your Bank Account</h2>

            {/* ✅ Error Message */}
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            {/* ✅ Success Message */}
            {success && (
              <div className="alert alert-success text-center" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-control" value={form.confirmPassword} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <span style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }} onClick={() => navigate("/login")}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
