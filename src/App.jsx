import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import { authAPI } from './api';
import Intro from "./components/Intro"
import PunchInDashboard from './components/PunchInDashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const isAuthenticated = authAPI.isAuthenticated();
  const isPunchedIn = !!localStorage.getItem("currentPunch");
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Intro/>}/> */}
        {/* Public routes */}
        <Route path="/" element={<Intro/>}/>
        <Route path="/login" element={
          authAPI.isAuthenticated()
            ? localStorage.getItem("currentPunch")
              ? <Navigate to="/punchInDashboard" replace />
              : <Navigate to="/userDashboard" replace />
            : <Login />
          } 
        />
        
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/userDashboard" element={<UserDashboard />} />
          {/* Add more protected routes here */}
          <Route path="/punchInDashboard" element={<PunchInDashboard />} />
        </Route>
        
        {/* Default redirect */}
        {/* <Route path="*" element={
          authAPI.isAuthenticated() ? <Navigate to="/userDashboard" replace /> : <Navigate to="/login" replace />
        } /> */}
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