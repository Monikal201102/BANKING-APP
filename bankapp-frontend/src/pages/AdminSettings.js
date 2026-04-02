import React, { useState } from 'react';
import axios from '../api/axios';

const AdminSettings = () => {
  const adminEmail = localStorage.getItem('adminEmail') || '';
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('⚠️ Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('❌ New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('⚠️ New password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/admin/change-password', {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(res.data.message || '✅ Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || '❌ Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="mb-4">🔐 Admin Settings</h3>

      <div className="mb-4 p-3 border rounded bg-light">
        <p className="mb-0"><strong>Email:</strong> <span className="text-primary">{adminEmail}</span></p>
      </div>

      <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label fw-semibold">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            className="form-control"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label fw-semibold">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
