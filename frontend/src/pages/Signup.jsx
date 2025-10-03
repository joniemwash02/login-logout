import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  // Show error toast whenever `error` updates
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right" });
    }
  }, [error]);

  // Show success toast when user is signed up
  useEffect(() => {
    if (user) {
      toast.success("Signup successful! Please verify your email.", {
        position: "top-right",
        autoClose: 2000,
      });

      // Delay navigation so user can see the toast
      const timer = setTimeout(() => {
        navigate("/verify-email");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(name, email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="signup-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      {/* Toast container for showing notifications */}
  
    </div>
  );
}
