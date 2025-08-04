import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pkLogo from "../assets/pklogo.png";
import { authAPI, punchAPI } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [client_id, setClientId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      // Check user type and redirect accordingly
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        // You can add role-based routing here
        navigate("/userDashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !client_id) {
      setError("Please enter username, password, and client ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authAPI.login({
        id: username,
        password,
        client_id,
      });

      localStorage.setItem("userData", JSON.stringify(response.data));

      // Check for pending punches after login
      try {
        const pendingPunches = await punchAPI.getPendingPunches();
        const punchesArray = Array.isArray(pendingPunches)
          ? pendingPunches
          : [];

        const userPendingPunch = punchesArray.find(
          (punch) =>
            punch.username === response.data.id && punch.status === "PENDING"
        );

        if (userPendingPunch) {
          localStorage.setItem(
            "currentPunch",
            JSON.stringify(userPendingPunch)
          );
          navigate("/PunchInDashboard", { replace: true });
        } else {
          navigate("/userDashboard", { replace: true });
        }
      } catch (punchError) {
        // If punch check fails, still redirect to user dashboard
        console.warn("Failed to check pending punches:", punchError);
        navigate("/userDashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center px-2">
      <div className="flex flex-col justify-center items-center w-full max-w-[700px] py-10 mx-auto px-2 bg-[#ffffff19] md:backdrop-blur-3xl rounded-3xl md:p-10">
        <div className="w-[150px] mb-10">
          <img
            src={pkLogo}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full px-2 gap-5"
        >
          <input
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Client ID"
            value={client_id}
            onChange={(e) => setClientId(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
            disabled={loading}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-blue-600 hover:underline text-sm disabled:opacity-50"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="fixed bottom-3 text-center leading-tight font-bold text-[#fff] text-sm flex justify-center items-center w-full">
        <div>
          Powered By <span className="block">IMC Business Solutions</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
