import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pkLogo from "../../assets/pklogo.png";
import { forgotPassword, verifyOTP, resetPassword } from "../../api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Username/Email, 2: OTP, 3: New Password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError("Please enter both username and email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await forgotPassword({ username, email });
      if (response && response.token) {
        setToken(response.token); // Some APIs might return a temporary token
      }
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP sent to your email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await verifyOTP({ username, otp });
      if (response && response.token) {
        setToken(response.token); // Update token if a new one is provided
      }
      setStep(3); // Move to new password step
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await resetPassword({ token, newPassword });
      // Success - redirect to login or dashboard
      navigate("/AdminDashboard");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center px-2">
      <div className="flex flex-col justify-center items-center w-full max-w-[700px] mx-auto px-2 md:bg-[#ffffff19] md:backdrop-blur-3xl rounded-3xl md:p-10">
        <div className="w-[150px] mb-10">
          <img src={pkLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-[#fff]">Reset Password</h2>
            <form onSubmit={handleRequestOTP} className="flex flex-col w-full px-2 gap-5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
              />
              <div className="flex items-center justify-between mt-5 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-2 rounded-3xl bg-gray-200 font-bold cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
            <p className="text-center mb-4">
              We've sent a one-time password (OTP) to your email. Please enter it below.
            </p>
            <form onSubmit={handleVerifyOTP} className="flex flex-col w-full px-2 gap-5">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
              />
              <div className="flex items-center justify-between mt-5 gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 rounded-3xl bg-gray-200 font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Set New Password</h2>
            <form onSubmit={handleResetPassword} className="flex flex-col w-full px-2 gap-5">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
              />
              <div className="flex items-center justify-between mt-5 gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 rounded-3xl bg-gray-200 font-bold cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;