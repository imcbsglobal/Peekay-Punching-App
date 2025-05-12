import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import React, { useState, useEffect } from 'react';
import UserDashboard from './components/UserDashboard';
import { authAPI, punchAPI } from './api';
import Intro from "./components/Intro";
import PunchInDashboard from './components/PunchInDashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = authAPI.isAuthenticated();

  useEffect(() => {
    const checkPunchStatus = async () => {
      if (isAuthenticated) {
        try {
          const userData = JSON.parse(localStorage.getItem("userData"));
          const pendingPunches = await punchAPI.getPendingPunches();
          
          // Handle different response structures
          const punchesArray = Array.isArray(pendingPunches) ? pendingPunches : [];
          
          const userPendingPunch = punchesArray.find(
            punch => punch.username === userData?.id && punch.status === "PENDING"
          );
          
          setIsPunchedIn(!!userPendingPunch);
          
          // Store current punch data in localStorage if exists
          if (userPendingPunch) {
            localStorage.setItem('currentPunch', JSON.stringify(userPendingPunch));
          }
        } catch (error) {
          console.error("Error checking punch status:", error);
          setIsPunchedIn(false);
        }
      }
      setLoading(false); // Important: only after async check completes
    };

    checkPunchStatus();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="text-white text-center h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? isPunchedIn
                ? <Navigate to="/punchInDashboard" replace />
                : <Navigate to="/userDashboard" replace />
              : <Login />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/punchInDashboard" element={<PunchInDashboard />} />
        </Route>

        {/* Fallback for all other routes */}
        <Route
          path="*"
          element={
            isAuthenticated
              ? isPunchedIn
                ? <Navigate to="/punchInDashboard" replace />
                : <Navigate to="/userDashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
