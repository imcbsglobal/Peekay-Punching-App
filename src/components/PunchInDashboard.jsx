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
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center px-2">
      <div className="max-w-[700px] mx-auto bg-[#ffffff1c] py-10 px-10 rounded-3xl flex flex-col justify-center items-center">
        <h1 className="text-4xl text-[#fff] text-center font-semibold mb-2">Punch Out</h1>

        {loading ? (
          <p>Loading...</p>
        ) : currentPunchData ? (
          <div className="punch-card">
            <button
              className="btn-primary px-6 py-2 bg-[#f00] text-[#fff] rounded-lg font-semibold"
              onClick={handlePunchOut}
              disabled={loading}
            >
              {loading ? "Processing..." : "Punch Out Now"}
            </button>
          </div>
        ) : (
          <p>No active punch-in found.</p>
        )}
      </div>
    </div>
  );
};

export default PunchInDashboard;