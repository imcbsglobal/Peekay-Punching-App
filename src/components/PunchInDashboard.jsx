import React, { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { punchAPI, authAPI } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"

const PunchInDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [currentPunchData, setCurrentPunchData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
        const pendingPunches = await punchAPI.getPendingPunches();
        if (!pendingPunches || pendingPunches.length === 0) {
          navigate("/userDashboard", { replace: true });
        } else {
          setCurrentPunchData(pendingPunches[0]);
        }
      } catch (error) {
        console.error("Error verifying punch status:", error);
      }
    };

    verifyPunchStatus();
  }, [navigate]);

  const handlePunchOut = async () => {
    try {
      if (!currentPunchData) {
        alert("No active punch-in found");
        navigate("/userDashboard", { replace: true });
        return;
      }

      const location = await punchAPI.getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;
      const currentTime = punchAPI.getCurrentTimeISO();
      const currentDate = currentTime.split('T')[0];
  
      setLoading(true);
  
      const punchOutData = {
        id: currentPunchData.id || currentPunchData._id,
        punchOutLocation: locationString,
        punchOutTime: currentTime,
        punchOutDate: currentDate
      };
  
      await punchAPI.punchOut(punchOutData);
      alert("Punch out successful!");
      navigate("/userDashboard", { replace: true });
    } catch (error) {
      console.error("Punch-out failed:", error);
      alert(error.response?.data?.message || "Failed to punch out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  return (
    <div className="overflow-x-hidden h-screen">
      {/* Remove or disable back buttons in the UI */}
      <div className="flex items-center justify-between pt-5">
        {/* Remove or disable back button */}
      </div>

      <div className="px-2">
        <div className="flex px-2 flex-col justify-center items-center bg-[#ffffff18] py-10 rounded-3xl backdrop-blur-2xl border border-[#ffffff96]">
          <h2 className="pt-10 text-white font-bold mb-10 text-3xl">
            Punch Out
          </h2>

          {/* Punch Button - simplified */}
          <div className="flex w-full justify-end items-center mt-5 px-2">
            <button
              onClick={handlePunchOut}
              disabled={loading}
              className={`px-10 py-2 cursor-pointer rounded-3xl font-bold text-white bg-red-600 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Processing..." : "Punch Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchInDashboard;