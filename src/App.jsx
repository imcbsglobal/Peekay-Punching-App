import Intro from "./components/Intro"
import GetLicense from "./components/GetLicense"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import UserDashboard from "./components/UserDashboard"
import PunchInDashboard from "./components/PunchInDashboard"

function App() {
 

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Intro/>}/>
      <Route path="/getLicense" element={<GetLicense/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/userDashboard" element={<UserDashboard/>}/>
      <Route path="/PunchInDashboard" element={<PunchInDashboard/>}/>
    </Routes>
   </Router>
  )
}

export default App
