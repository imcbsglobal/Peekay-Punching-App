import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { punchAPI, authAPI } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PunchInDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [currentPunchData, setCurrentPunchData] = useState(null);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This properly blocks browser back button navigation
    const handleBack = (e) => {
      e.preventDefault();
      // Instead of silently blocking, show a confirmation dialog
      setShowBackConfirmation(true);
      // Push current URL to history stack to maintain the block
      window.history.pushState(null, "", window.location.href);
    };
  
    // Add the current URL to history stack to enable popstate to work
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
  
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  useEffect(() => {
    // Get current punch data from localStorage
    const storedPunchData = localStorage.getItem('currentPunch');
    
    if (storedPunchData) {
      try {
        const parsedData = JSON.parse(storedPunchData);
        setCurrentPunchData(parsedData);
      } catch (e) {
        alert("Error parsing stored punch data. Please punch in again.");
        navigate("/UserDashboard", { replace: true });
      }
    } else {
      alert("No active punch-in found. Please punch in first.");
      navigate("/UserDashboard", { replace: true });
    }
  }, [navigate]);

  const handlePunchOut = async () => {
    try {
      // Extract the punch ID from stored data
      const punchId = currentPunchData?.id || currentPunchData?.data?.id || 
                     currentPunchData?._id || currentPunchData?.data?._id;
      
      if (!punchId) {
        alert("Invalid punch data. Please punch in again.");
        navigate("/userDashboard");
        return;
      }
  
      const location = await punchAPI.getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;
      const currentTime = punchAPI.getCurrentTimeISO();
      const currentDate = currentTime.split('T')[0];
  
      setLoading(true);
  
      const punchOutData = {
        id: punchId,
        punchOutLocation: locationString,
        punchOutTime: currentTime,
        punchOutDate: currentDate
      };
  
      const response = await punchAPI.punchOut(punchOutData);
      
      localStorage.removeItem('currentPunch');
      alert("Punch out successful!");
      navigate("/userDashboard");
    } catch (error) {
      console.error("Punch-out failed:", error);
      if (error.response?.data?.message) {
        alert(`Failed to punch out: ${error.response.data.message}`);
      } else {
        alert("Failed to punch out. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const attemptBackToUserDashboard = () => {
    setShowBackConfirmation(true);
  };

  const cancelBackAttempt = () => {
    setShowBackConfirmation(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  // Calculate time elapsed since punch-in (if data available)
  const calculateElapsedTime = () => {
    if (!currentPunchData) return "00:00:00";
    
    const punchInTime = currentPunchData?.punchInTime || 
                        currentPunchData?.data?.punchInTime;
    
    if (!punchInTime) return "00:00:00";
    
    const startTime = new Date(punchInTime);
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime - startTime;
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedMilliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  // Update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentPunchData]);

  return (
    <div className="overflow-x-hidden h-screen">
      <div className="flex items-center justify-between pt-5 px-4">
        <div
          onClick={attemptBackToUserDashboard}
          className="text-white text-3xl cursor-pointer"
        >
          <FaAngleLeft />
        </div>
        <div
          onClick={handleLogout}
          className="text-white text-3xl cursor-pointer"
        >
          <RiLogoutBoxLine />
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex flex-col justify-center items-center bg-[#ffffff18] py-10 rounded-3xl backdrop-blur-2xl border border-[#ffffff96]">
          <h2 className="pt-5 text-white font-bold mb-4 text-3xl">
            Currently Punched In
          </h2>
          
          {/* Customer information */}
          <div className="text-white text-center mb-8">
            <div className="text-lg font-medium">
              {currentPunchData?.customerName || currentPunchData?.data?.customerName || "Customer"}
            </div>
            <div className="text-sm opacity-80">
              Punched in at: {new Date(currentPunchData?.punchInTime || currentPunchData?.data?.punchInTime || Date.now()).toLocaleTimeString()}
            </div>
          </div>
          
          {/* Timer display */}
          <div className="bg-[#ffffff30] px-6 py-3 rounded-xl mb-8">
            <div className="text-white text-center">
              <div className="text-sm">Time Elapsed</div>
              <div className="text-2xl font-bold font-mono">{elapsedTime}</div>
            </div>
          </div>

          {/* Punch Button */}
          <div className="flex w-full justify-center items-center mt-5 px-6">
            <button
              onClick={handlePunchOut}
              disabled={loading}
              className={`px-10 py-3 cursor-pointer rounded-3xl font-bold text-white bg-red-600 ${
                loading ? "opacity-50" : "hover:bg-red-700"
              } transition-colors`}
            >
              {loading ? "Processing..." : "Punch Out"}
            </button>
          </div>
          
          {/* Guidance text */}
          <div className="text-white text-sm mt-8 text-center px-4 opacity-80">
            You need to punch out before you can return to the dashboard
          </div>
        </div>
      </div>

      {/* Back confirmation modal */}
      {showBackConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-sm"
          >
            <h3 className="font-bold text-lg mb-4">Active Punch-In Session</h3>
            <p className="mb-6">
              You must punch out before returning to the dashboard. Would you like to punch out now?
            </p>
            <div className="flex justify-between">
              <button 
                onClick={cancelBackAttempt}
                className="px-4 py-2 bg-gray-200 rounded-md font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handlePunchOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium"
              >
                Punch Out Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PunchInDashboard;