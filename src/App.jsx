import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import React,{useState, useEffect} from 'react';
import UserDashboard from './components/UserDashboard';
import { authAPI,punchAPI } from './api';
import Intro from "./components/Intro"
import PunchInDashboard from './components/PunchInDashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const isAuthenticated = authAPI.isAuthenticated();

  useEffect(() => {
    const checkPunchStatus = async () => {
      if (isAuthenticated) {
        try {
          const userData = JSON.parse(localStorage.getItem("userData"));
          const pendingPunches = await punchAPI.getPendingPunches();
          
          // Check if there are pending punches for the current user
          const userPendingPunch = pendingPunches.data.find(
            punch => punch.username === userData.id && punch.status === "PENDING"
          );
          
          setIsPunchedIn(!!userPendingPunch);
        } catch (error) {
          console.error("Error checking punch status:", error);
          setIsPunchedIn(false);
        }
      }
    };

    checkPunchStatus();
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro/>}/>
        <Route path="/login" element={
          isAuthenticated
            ? isPunchedIn
              ? <Navigate to="/punchInDashboard" replace />
              : <Navigate to="/userDashboard" replace />
            : <Login />
        } />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/punchInDashboard" element={<PunchInDashboard />} />
        </Route>
        
        {/* Default redirect */}
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