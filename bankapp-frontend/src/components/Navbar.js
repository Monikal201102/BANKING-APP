import React from "react"; 
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { user, logout } = useUserAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          🏦 My Bank
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {!user && (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item mx-2">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/profile" className="btn btn-outline-secondary">My Profile</Link>
                </li>
                <li className="nav-item mx-2">
                  <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;