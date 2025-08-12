import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/forgot.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { forgotUser, resetUser, verifyUser } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        await forgotUser({ email });
        toast.success("OTP sent to your email");
        setStep(2);
      } else if (step === 2) {
        if (otp.length < 6) {
          toast.error("Please enter full 6-digit OTP");
          return;
        }
        await verifyUser({ email, otp: otp.toString().trim() }); // Calls /verify-reset-otp
        toast.success("OTP verified");
        setStep(3);
      } else if (step === 3) {
        await resetUser({ email, otp, newPassword }); // Calls /reset-password
        toast.success("Password reset successfully");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-password-box" onSubmit={handleFormSubmit}>
        {step === 1 && (
          <>
            <h2>Forgot Password</h2>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2>Verify OTP sent to {email}</h2>
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              {otp
                .split("")
                .concat(new Array(6 - otp.length).fill(""))
                .map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d*$/.test(val)) return;
                      let newOtp = otp.split("");
                      newOtp[i] = val;
                      if (val && i < 5)
                        document.getElementById(`otp-${i + 1}`).focus();
                      setOtp(newOtp.join(""));
                    }}
                    id={`otp-${i}`}
                    style={{
                      width: "40px",
                      height: "40px",
                      fontSize: "24px",
                      textAlign: "center",
                    }}
                  />
                ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Reset Password</h2>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="toggle-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Sending..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
