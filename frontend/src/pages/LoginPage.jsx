import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
export default function LoginPage() {
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right" });
    }
  }, [error]);

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
       toast.success("Login successful!", { position: "top-right" });
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-btn">
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button type="button" className="forgot-password-btn">
            Forgot Password?
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
     
    </div>
  );
}
