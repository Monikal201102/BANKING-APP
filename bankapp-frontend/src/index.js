import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { UserAuthProvider } from './context/UserAuthContext';
import { AdminAuthProvider } from "./context/AdminAuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserAuthProvider>
      <AdminAuthProvider>
      <App />
      </AdminAuthProvider>
    </UserAuthProvider>
  </React.StrictMode>
);
