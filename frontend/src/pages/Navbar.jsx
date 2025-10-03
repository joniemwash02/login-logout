import React, { useState, useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import LoadingPage from "./LoadingPage";
import { ToastContainer, toast } from "react-toastify";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right" });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully", { position: "top-right" });
      navigate("/login");
    } catch (err) {
      toast.error("Failed to log out", { position: "top-right" });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">MyApp</div>

      {/* Hamburger menu */}
      <div className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Nav Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        {isAuthenticated ? (
          <li><button onClick={handleLogout}>Logout</button></li>
        ) : (
          <li><Link to="/login" className="login-btn">Login</Link></li>
        )}
      </ul>
      <ToastContainer />
    </nav>
  );
}
