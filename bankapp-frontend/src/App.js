import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import LoanRecommendation from './pages/LoanRecommendation';
import NotFound from './pages/NotFound';
import Profile from "./pages/Profile";
import SecureRoute from './components/SecureRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/base.css';
import './styles/navbar.css';
import './styles/form.css';
import './styles/buttons.css';
import './styles/home.css';
import './styles/footer.css';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard'; // add this at the top



function App() {
   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('✅ Received Token:', token);
    } else {
      console.log('❌ No token found');
    }
  }, []); // This ensures the log runs only once on initial render

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<SecureRoute><Dashboard /></SecureRoute>} />
        <Route path="/deposit" element={<SecureRoute><Deposit /></SecureRoute>} />
        <Route path="/withdraw" element={<SecureRoute><Withdraw /></SecureRoute>} />
        <Route path="/transactions" element={<SecureRoute><Transactions /></SecureRoute>} />
        <Route path="/loan" element={<SecureRoute><LoanRecommendation /></SecureRoute>} />
        <Route path="/profile" element={<SecureRoute><Profile /></SecureRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
