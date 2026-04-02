import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">📊 Registered Users</h3>
        <span className="badge bg-primary fs-6">{users.length} Users</span>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading users...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <div className="alert alert-warning">No users found.</div>
      ) : (
        <div className="table-responsive shadow-sm border rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">👤 Name</th>
                <th scope="col">📧 Email</th>
                <th scope="col">💰 Balance</th>
                <th scope="col">📅 Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge bg-success">₹ {user.balance.toFixed(2)}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
