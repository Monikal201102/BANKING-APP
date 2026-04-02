import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/transactions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch transactions:", err);
        alert("⚠️ Unauthorized. Please login again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center text-primary mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="alert alert-info text-center">No transactions found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount (₹)</th>
                <th>Method</th>
                <th>Description</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span
                      className={`badge ${
                        tx.type === 'CR' ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {tx.type === 'CR' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className="fw-bold text-end">{tx.amount.toFixed(2)}</td>
                  <td>{tx.method || 'N/A'}</td>
                  <td>{tx.description || '-'}</td>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
