import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const VerificationEmailPage = () => {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { verifyEmail, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (val, index) => {
    if (/^[0-9]?$/.test(val)) {
      const newValues = [...values];
      newValues[index] = val;
      setValues(newValues);

      // Move to next input if digit is typed
      if (val && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Go back if pressing backspace on empty field
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right" });
    }
  }, [error]);

  const handleSubmit = async () => {
    const code = values.join("");
    if (code.length < 6) {
      toast.warning("Please enter all 6 digits.", { position: "top-right" });
      return;
    }
    if (isLoading) return; // Prevent multiple submissions

    const result = await verifyEmail(code);

    // ✅ Only show success if verifyEmail succeeds
    if (!isLoading && !error) {
      toast.success("Email verified successfully, You can now login!", { position: "top-right" });
    }
    navigate("/login");
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Verify Your Email</h2>
        <p className="verify-subtitle">
          Please enter the 6-digit code we sent to your email address.
        </p>

        <div className="code-inputs">
          {values.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <button className="verify-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </button>

        <p className="resend-text">
          Didn’t receive the code? <a href="#">Resend</a>
        </p>
      </div>

      {/* Toast container */}
    
    </div>
  );
};

export default VerificationEmailPage;
