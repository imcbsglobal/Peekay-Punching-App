<<<<<<< HEAD
import Intro from "./components/Intro"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import UserDashboard from "./components/UserDashboard"
import PunchInDashboard from "./components/PunchInDashboard"
import AdminDashboard from "./components/Admin/AdminDashboard"
import PunchLogs from "./components/Admin/PunchLogs"
import api from "./api"
import ResetPassword from "./components/Admin/ResetPassword"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
 
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Intro/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/userDashboard" element={<UserDashboard/>}/>
      <Route path="/PunchInDashboard" element={<PunchInDashboard/>}/>
      <Route element={<ProtectedRoute />}>
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          {/* Add more protected routes here */}
        </Route>
      <Route path="/PunchLogs" element={<PunchLogs/>}/>
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
   </Router>
  )
}

export default App
=======
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
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
