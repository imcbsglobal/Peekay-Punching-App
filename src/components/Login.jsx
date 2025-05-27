<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pkLogo from "../assets/pklogo.png";
import { login, isAuthenticated } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/AdminDashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await login({ username, password });
      
      // Store username in localStorage along with the token
      if (response) {
        localStorage.setItem('user_name', username);
        navigate("/AdminDashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid username or password");
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pkLogo from "../assets/pklogo.png";
import { authAPI, punchAPI } from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [client_id, setCient_Id] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await authAPI.login(username, password,client_id);
      localStorage.setItem("userData", JSON.stringify(response.data));
      
      // Check for pending punches after login
      const pendingPunches = await punchAPI.getPendingPunches();
      const punchesArray = Array.isArray(pendingPunches) ? pendingPunches : [];
      
      const userPendingPunch = punchesArray.find(
        punch => punch.username === response.data.id && punch.status === "PENDING"
      );
      
      if (userPendingPunch) {
        localStorage.setItem('currentPunch', JSON.stringify(userPendingPunch));
        navigate('/punchInDashboard', { replace: true });
      } else {
        navigate('/userDashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center px-2">
<<<<<<< HEAD
      <div className="flex flex-col justify-center items-center w-full max-w-[700px] mx-auto px-2 md:bg-[#ffffff19] md:backdrop-blur-3xl rounded-3xl md:p-10">
=======
      <div className="flex flex-col justify-center items-center w-full max-w-[700px] py-10 mx-auto px-2 bg-[#ffffff19] md:backdrop-blur-3xl rounded-3xl md:p-10">
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
        <div className="w-[150px] mb-10">
          <img src={pkLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col w-full px-2 gap-5">
          <input
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
          />
<<<<<<< HEAD
=======
          <input
            type="text"
            placeholder="client id"
            value={client_id}
            onChange={(e) => setCient_Id(e.target.value)}
            className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"
          />
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
            <button
              type="submit"
              disabled={loading}
<<<<<<< HEAD
              className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer w-full md:w-auto"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
=======
              className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer w-full md:w-auto disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {/* <button
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
              type="button"
              onClick={() => navigate("/reset-password")}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
<<<<<<< HEAD
            </button>
=======
            </button> */}
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
          </div>
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
