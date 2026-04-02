// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

 // ✅ Updated: Fetch user info from /auth/me to include lastLogin
useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
    }
  };
  fetchUser();
}, []);


  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted.slice(0, 3)); // Show latest 3
      } catch (err) {
        console.error("❌ Failed to fetch transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h2 className="text-primary">👋 Welcome back, {user?.name || "Customer"}!</h2>
        <p className="text-muted">Here's a quick look at your account activity.</p>
      </div>

      {/* Account Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-light p-4 shadow-sm">
            <h5>💳 Current Balance</h5>
            <h3 className="text-success">₹{user?.balance?.toLocaleString() || "0.00"}</h3>
            <p className="text-muted">As of today</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-light p-4 shadow-sm">
            <h5>📅 Last Login</h5>
            <p>{user?.lastLogin ? formatDateTime(user.lastLogin) : "No login data"}</p>
            <p className="text-muted">From Bangalore, India</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row text-center mb-5">
        <div className="col-md-3">
          <Link to="/deposit" className="btn btn-success w-100">Deposit</Link>
        </div>
        <div className="col-md-3">
          <Link to="/withdraw" className="btn btn-warning w-100">Withdraw</Link>
        </div>
        <div className="col-md-3">
          <Link to="/transactions" className="btn btn-info w-100">Transactions</Link>
        </div>
        <div className="col-md-3">
          <Link to="/loan" className="btn btn-primary w-100">Loan Recommendation</Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card shadow p-4">
        <h5 className="mb-3">🧾 Recent Transactions</h5>

        {transactions.length === 0 ? (
          <p className="text-muted">No transactions found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.description || "Bank Transaction"}</td>
                  <td>{tx.type}</td>
                  <td className={`text-end ${tx.type === 'Credit' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'Credit' ? '+' : '-'} ₹{tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
