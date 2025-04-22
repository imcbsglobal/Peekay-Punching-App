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
