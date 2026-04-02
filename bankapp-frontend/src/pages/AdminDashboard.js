// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import ViewUsers from './ViewUsers';
import MonitorTransactions from './MonitorTransactions';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
  const adminEmail = localStorage.getItem("adminEmail");
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <ViewUsers />;
      case 'transactions':
        return <MonitorTransactions />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="card border-primary shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">📊 View Users</h5>
                  <p className="card-text flex-grow-1">See a list of registered users and their details.</p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setActiveTab('users')}
                  >
                    Go to Users
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-success shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-success">💸 Monitor Transactions</h5>
                  <p className="card-text flex-grow-1">Track deposits and withdrawals by users.</p>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => setActiveTab('transactions')}
                  >
                    Go to Transactions
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-dark shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">🔐 Admin Settings</h5>
                  <p className="card-text flex-grow-1">Manage admin credentials and preferences.</p>
                  <button
                    className="btn btn-dark mt-2"
                    onClick={() => setActiveTab('settings')}
                  >
                    Go to Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="text-muted">Welcome, <strong>{adminEmail || "Admin"}</strong> 👋</p>
      </div>

      <div className="mb-4">
        <ul className="nav nav-pills justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              🏠 Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 View Users
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              💰 Transactions
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </li>
        </ul>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
