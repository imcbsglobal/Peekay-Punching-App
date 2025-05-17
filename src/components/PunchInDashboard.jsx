import React, { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { punchAPI, authAPI } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineAvTimer } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";


const PunchInDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [currentPunchData, setCurrentPunchData] = useState(null);
  const navigate = useNavigate();

  // Prevent navigation when the component mounts
  useEffect(() => {
    // Block navigation using History API
    window.history.pushState(null, "", window.location.href);

    // Handle popstate (back/forward buttons)
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    // Handle beforeunload (page refresh/close)
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Check for pending punches and redirect if none found
  useEffect(() => {
    const verifyPunchStatus = async () => {
      try {
        setLoading(true);
        
        // First check localStorage for existing punch data
        const storedPunch = localStorage.getItem('currentPunch');
        if (storedPunch) {
          const punchData = JSON.parse(storedPunch);
          setCurrentPunchData(punchData);
          console.log("Current Punch Data", currentPunchData)
          return;
        }

        // If no stored punch, verify with server
        const pendingPunches = await punchAPI.getPendingPunches();
        const punchesArray = Array.isArray(pendingPunches) ? pendingPunches : [];
        
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userPendingPunch = punchesArray.find(
          punch => punch.username === userData?.id && punch.status === "PENDING"
        );

        if (!userPendingPunch) {
          navigate("/userDashboard", { replace: true });
          return;
        }
        
        // Store and set the punch data
        localStorage.setItem('currentPunch', JSON.stringify(userPendingPunch));
        setCurrentPunchData(userPendingPunch);
      } catch (error) {
        // console.error("Error verifying punch status:", error);
        alert("Failed to load punch data. Please try again.");
        navigate("/userDashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyPunchStatus();
  }, [navigate]);

  const handlePunchOut = async () => {
    try {
      if (!currentPunchData) {
        throw new Error("No valid punch-in data found. Cannot punch out.");
      }
      
      // Extract ID from data, checking multiple possible locations
      const punchId = currentPunchData.id || currentPunchData._id;
      
      if (!punchId) {
        // console.error("Invalid punch data:", currentPunchData);
        throw new Error("No valid punch ID found. Cannot punch out.");
      }

      setLoading(true);
      
      const location = await punchAPI.getCurrentLocation();
      const locationString = punchAPI.formatLocation(location);
      const currentTime = punchAPI.getCurrentTimeISO();
      const currentDate = currentTime.split('T')[0];

      const punchOutData = {
        id: punchId,
        punchOutLocation: locationString,
        punchOutTime: currentTime,
        punchOutDate: currentDate,
      };

      // console.log("Sending punch-out data:", punchOutData);
      const response = await punchAPI.punchOut(punchOutData);
      // console.log("Punch-out response:", response);
      
      alert("Punch out successful!");
      navigate("/userDashboard", { replace: true });
    } catch (error) {
      // console.error("Punch-out failed:", error);
      alert(`Punch-out failed: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center px-2 bg-gray-900">
      <div className="max-w-md w-full mx-auto bg-gray-800 py-10 px-8 rounded-3xl flex flex-col justify-center items-center shadow-2xl border border-gray-700">
        {/* <div className="absolute -top-10 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-800">
          <FiLogOut className="text-white text-2xl" />
        </div> */}
        
        <h1 className="text-4xl text-white text-center font-bold mb-6 mt-4">
          Punch Out
        </h1>
        
        <div className="w-full p-4 bg-gray-900 rounded-xl mb-6 border border-gray-700">
          <div className="text-center text-gray-400 text-sm mb-2 flex items-center gap-2 justify-center">
            <FaUserAlt className="text-red-500"/>
            <span>Selected Customer</span>
          </div>
          <span className="block text-center font-semibold text-xl text-white">
            {currentPunchData?.customer_name || "N/A"}
          </span>
        </div>
        
        <div className="w-full p-4 bg-gray-900 rounded-xl mb-8 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm text-center justify-center mb-2">
            <MdOutlineAvTimer className="text-red-500 text-lg"/>
            <span>Punch In Time</span>
          </div>
          <span className="text-xl text-white text-center font-semibold flex items-center justify-center gap-2">
            <IoMdTime className="text-red-500" />
            {currentPunchData?.punch_in_time
              ? new Date(currentPunchData.punch_in_time).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }
                )
              : "N/A"}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : currentPunchData ? (
          <button
            className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg transform transition-transform duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-2 shadow-md"
            onClick={handlePunchOut}
            disabled={loading}
          >
            <FiLogOut className="text-xl" />
            Punch Out Now
          </button>
        ) : (
          <p className="text-white bg-gray-700 px-4 py-2 rounded-lg">No active punch-in found.</p>
        )}
        
        <div className="mt-8 text-xs text-gray-500">
          Make sure to punch out before closing the tab.
        </div>
      </div>
    </div>
  );
};

export default PunchInDashboard;