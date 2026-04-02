import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const MonitorTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get('/admin/transactions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">💸 All Transactions</h3>
        <span className="badge bg-primary fs-6">{transactions.length} Transactions</span>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="alert alert-warning">No transactions found.</div>
      ) : (
        <div className="table-responsive shadow-sm border rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">👤 User</th>
                <th scope="col">📧 Email</th>
                <th scope="col">🔄 Type</th>
                <th scope="col">💵 Amount</th>
                <th scope="col">💳 Method</th>
                <th scope="col">📅 Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={txn._id}>
                  <td>{index + 1}</td>
                  <td>{txn.userId?.name || 'N/A'}</td>
                  <td>{txn.userId?.email || 'N/A'}</td>
                  <td>
                    <span className={`badge ${txn.type === 'CR' ? 'bg-success' : 'bg-danger'}`}>
                      {txn.type === 'CR' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td>₹ {txn.amount.toFixed(2)}</td>
                  <td>{txn.method || '—'}</td>
                  <td>{new Date(txn.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonitorTransactions;
