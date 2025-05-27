import React, { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
<<<<<<< HEAD

const PunchInDashboard = () => {
  const [punchIn, setPunchIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera when showCamera becomes true
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showCamera, facingMode]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: facingMode },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Failed to access camera. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const imageDataURL = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageDataURL);
    setShowCamera(false);
  };

  return (
    <div className="overflow-hidden px-2 h-screen">
      <div className="flex items-center justify-between pt-5 w-full">
        <a href="/userDashboard" className="text-white text-3xl cursor-pointer">
          <FaAngleLeft />
        </a>
        <a href="/" className="text-white text-3xl cursor-pointer">
          <RiLogoutBoxLine />
        </a>
      </div>

      <div className="flex flex-col justify-center items-center">
        <h2 className="pt-10 text-white font-bold mb-10 text-3xl">Punch In</h2>

        <div className="flex justify-center items-center gap-5 mb-10">
          <div className="text-white">Customer :</div>
          <select className="px-8 py-2 rounded-3xl bg-white outline-none border-none cursor-pointer">
            <option value="" selected disabled>Select Customer</option>
            <option>Customer 1</option>
            <option>Customer 2</option>
            <option>Customer 3</option>
            <option>Customer 4</option>
          </select>
          <div className="text-white text-2xl cursor-pointer"><FaDownload /></div>
        </div>

        <div className="flex justify-center items-center gap-5">
          <div className="text-white">Image :</div>
          <div
            onClick={() => setShowCamera(true)}
            className="bg-white flex items-center cursor-pointer gap-3 py-2 px-10 rounded-3xl"
          >
            Take a Photo <LuCamera />
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg w-full relative h-[100vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-medium">
                  {facingMode === "user" ? "Front Camera" : "Back Camera"}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFacingMode((prev) =>
                      prev === "user" ? "environment" : "user"
                    )}
                    className="text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    Switch Camera
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    className="text-white text-2xl hover:text-gray-300"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover bg-black rounded-lg"
                style={{
                  transform: facingMode === "user" ? "scaleX(-1)" : "none",
                }}
              />

              <div className=" flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center gap-2 absolute z-50 bottom-10"
                >
                  <LuCamera /> Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {capturedImage && (
          <div className="mt-6 w-full max-w-md">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-sm">Preview:</h3>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="text-white text-lg hover:text-gray-300"
                >
                  <IoClose />
                </button>
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href={capturedImage}
                  download="photo.jpg"
                  className="text-white bg-blue-500 px-4 py-1 rounded-md hover:bg-blue-600"
                >
                  Download Image
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Punch Button */}
        <div className="flex w-full justify-end items-center mt-10 px-2">
          <button
            onClick={() => setPunchIn(!punchIn)}
            className={`px-10 py-2 cursor-pointer rounded-3xl font-bold text-white ${punchIn ? "bg-red-600" : "bg-green-600"}`}
          >
            {punchIn ? "Punch Out" : "Punch In"}
          </button>
=======
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
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default PunchInDashboard;
=======
export default PunchInDashboard;
>>>>>>> 1036023994783d47007bf4f7a3f587251f636550
