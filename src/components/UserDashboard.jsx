import React, { useState, useEffect } from "react";
import pkLogo from "../assets/pklogo.png";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI, punchAPI } from "../api";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion"


const UserDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [openConfirmPunchIn, setOpenConfirmPunchIn] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  const handlePunchIn = async () => {
    try {
      // Get location and format it correctly
      const location = await punchAPI.getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;
      const currentTime = punchAPI.getCurrentTimeISO();
      
      const punchInData = {
        punchInLocation: locationString,
        punchInTime: currentTime,
        status: "IN"
      };

      // console.log("Sending punch-in data:", punchInData);

      // Call the API to punch in
      const response = await punchAPI.punchIn(punchInData);
      // console.log("Punch-in response:", response);
      
      // Store the complete response data or specifically extract the ID
      if (response && response.data) {
        localStorage.setItem('currentPunch', JSON.stringify(response.data));
      } else {
        localStorage.setItem('currentPunch', JSON.stringify(response));
      }

      navigate("/PunchInDashboard");
    } catch (error) {
      console.error("Punch-in failed:", error);
      if (error.response?.data?.message) {
        alert(`Failed to punch in: ${error.response.data.message}`);
      } else {
        alert("Failed to punch in. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen w-full px-2 relative overflow-hidden">
      <div className="flex items-center justify-between pt-5">
        <a href="/login">
          <div className="text-[#fff] text-3xl cursor-pointer">
            <FaAngleLeft />
          </div>
        </a>
        <div onClick={handleLogout} className="text-[#fff] text-3xl cursor-pointer">
          <RiLogoutBoxLine />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full px-2">
        <div className="w-[150px] mb-5 pt-28">
          <img src={pkLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="text-[#fff] font-semibold mb-6 w-full flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff1d]">
          <span className=" bg-[#ffffff30] rounded-full p-2 text-xl">
            <FaUser />
          </span>{" "}
          Hi, {userName || "User"}
        </div>
        <div className="flex justify-between w-full gap-5">
          <div className="">
            <button 
              onClick={() => setOpenConfirmPunchIn(!openConfirmPunchIn)}
              className="px-10 py-2 rounded-3xl bg-[#fff] text-[#3fab00] border border-[#3fab00] font-bold cursor-pointer"
            >
              Punch In
            </button>
          </div>
          <div>
            <button 
              onClick={handleLogout}
              className="px-10 py-2 rounded-3xl bg-[#fff] font-bold border text-[#f00] border-[#ab0000] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 text-center leading-tight font-bold text-[#fff] text-sm flex justify-center items-center w-full">
        <div>
          Powered By <span className="block">IMC Business Solutions</span>
        </div>
      </div>
      {/* Confirm PunchIn */}
      {openConfirmPunchIn && (
        <motion.div 
        className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000060] backdrop-blur-xl flex flex-col justify-center items-center px-2">
        <motion.div
        initial={{opacity:0, scale:0}}
        animate={{scale:1,opacity:1,transition:{duration:.9,ease:"backInOut"}}}
        className="max-w-[600px] w-full h-[150px] bg-[#fff2] rounded-3xl">
          <div className="absolute right-5 pt-5 text-[#fff]" onClick={() => setOpenConfirmPunchIn(!openConfirmPunchIn)}><IoMdClose/></div>
          <div className="text-[#fff] font-bold pt-5 text-center mb-5">Are you sure want to Punch In</div>
          <div className="flex justify-center items-center gap-10">
            <button className="px-5 py-2 bg-[#1faa00] rounded-md text-[#fff] font-semibold" onClick={handlePunchIn}>Punch In</button>
            <button className="bg-[#f00] px-5 py-2 font-semibold rounded-md text-[#fff]" onClick={() => setOpenConfirmPunchIn(!openConfirmPunchIn)}>Cancel</button>
          </div>
        </motion.div>
      </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;