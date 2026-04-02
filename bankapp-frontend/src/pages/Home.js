import React from 'react';
import '../styles/home.css';
import bankBg from '../assets/my-bank.png';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section d-flex align-items-center justify-content-center text-white"
        style={{
          backgroundImage: `url(${bankBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          position: 'relative',
        }}
      >
        <div
          className="overlay position-absolute w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', top: 0, left: 0, zIndex: 1 }}
        />
        <div className="text-center position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-3 fw-bold">Welcome to 🏦My Bank</h1>
          <p className="lead fs-5 mt-3">
            Your one-stop solution for smart banking, personalized loans, and secure transactions.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
            <Link to="/admin/login" className="btn btn-outline-warning btn-lg">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row text-center mb-5">
          <h2 className="text-primary fw-bold">Why Choose My Bank?</h2>
          <p className="text-muted">We make digital banking simple, secure, and smart.</p>
        </div>
        <div className="row text-dark">
          <div className="col-md-6 mb-4">
            <h5>💰 Instant Deposits & Withdrawals</h5>
            <p>Seamlessly manage your funds with fast and reliable transaction processing.</p>
          </div>
          <div className="col-md-6 mb-4">
            <h5>📈 Real-Time Account Tracking</h5>
            <p>Track your balance, credits, and spending habits in real-time.</p>
          </div>
          <div className="col-md-6 mb-4">
            <h5>🏦 Smart Loan Recommendations</h5>
            <p>Get customized loan suggestions based on your financial behavior.</p>
          </div>
          <div className="col-md-6 mb-4">
            <h5>🔒 Secure & Reliable</h5>
            <p>We use advanced encryption and fraud detection for your safety.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
