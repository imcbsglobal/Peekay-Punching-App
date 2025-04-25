import React, { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { punchAPI, authAPI } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"

const PunchInDashboard = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPunchData, setCurrentPunchData] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    (customer.name || customer.customerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );




  useEffect(() => {
    const handleBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
  
    // Disable back button navigation
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);
  
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);
  

  // Fetch customers and current punch data on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await punchAPI.getCustomers();
        // Ensure we're working with an array
        const customersArray = Array.isArray(response) ? response : 
                             Array.isArray(response.data) ? response.data : 
                             [];
        setCustomers(customersArray);
      } catch (error) {
        // console.error("Failed to fetch customers:", error);
        setDebugInfo(prev => prev + "\nFailed to fetch customers: " + JSON.stringify(error));
        alert("Failed to load customers. Please try again.");
        setCustomers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    // Get current punch data from localStorage
    const storedPunchData = localStorage.getItem('currentPunch');
    
    if (storedPunchData) {
      try {
        const parsedData = JSON.parse(storedPunchData);
        setCurrentPunchData(parsedData);
        setDebugInfo("Current punch data: " + JSON.stringify(parsedData));
        
        // Check if we have an ID
        if (!parsedData || (!parsedData.id && !parsedData._id)) {
          setDebugInfo(prev => prev + "\nNo ID found in punch data");
        }
      } catch (e) {
        setDebugInfo("Error parsing stored punch data: " + e.message);
        alert("Error parsing stored punch data. Please punch in again.");
        navigate("/userDashboard");
      }
    } else {
      setDebugInfo("No stored punch data found");
      alert("No active punch-in found. Please punch in first.");
      navigate("/userDashboard");
    }

    fetchCustomers();
  }, [navigate]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

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
      // console.error("Camera error:", err);
      setDebugInfo(prev => prev + "\nCamera error: " + err.message);
      
      // Try without exact facingMode constraint
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        streamRef.current = stream;
      } catch (fallbackErr) {
        alert("Failed to access camera. Please check browser permissions.");
        setDebugInfo(prev => prev + "\nFallback camera error: " + fallbackErr.message);
      }
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
  
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      // Create a File object from the blob
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(blob);
      
      setCapturedImage({
        url: imageUrl,
        file: file
      });
      
      setShowCamera(false);
    }, "image/jpeg", 0.8);
  };

  const handlePunchOut = async () => {
    try {
      if (!selectedCustomer || !capturedImage) {
        alert("Please select a customer and take a photo before punching out");
        return;
      }
  
      // Extract the punch ID from stored data
      const punchId = currentPunchData?.id || currentPunchData?.data?.id || 
                     currentPunchData?._id || currentPunchData?.data?._id;
      
      if (!punchId) {
        // console.error("No punch ID found:", currentPunchData);
        setDebugInfo(prev => prev + "\nNo punch ID found in: " + JSON.stringify(currentPunchData));
        alert("Invalid punch data. Please punch in again.");
        navigate("/userDashboard");
        return;
      }
  
      const location = await punchAPI.getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;
      const currentTime = punchAPI.getCurrentTimeISO();
  
      setLoading(true);
      setDebugInfo(prev => prev + "\nSending punch-out with ID: " + punchId);
      // console.log("Sending punch-out data with image file");
  
      // Create the data object for punch out
      const punchOutData = {
        id: punchId,
        customerName: selectedCustomer,
        file: capturedImage.file,
        punchOutLocation: locationString,
        punchOutTime: currentTime
      };
  
      const response = await punchAPI.punchOut(punchOutData);
      // console.log("Punch-out response:", response);
      
      // Clear the punch data from localStorage after successful punch out
      localStorage.removeItem('currentPunch');
      
      alert("Punch out successful!");
      navigate("/userDashboard");
    } catch (error) {
      console.error("Punch-out failed:", error);
      setDebugInfo(prev => prev + "\nPunch-out error: " + (error.message || JSON.stringify(error)));
      
      if (error.response?.data?.message) {
        alert(`Failed to punch out: ${error.response.data.message}`);
      } else {
        alert("Failed to punch out. Please try again.");
      }
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
      <div className="flex items-center justify-between pt-5">
        <a
          href="/userDashboard"
          className="text-white hidden text-3xl cursor-pointer"
        >
          <FaAngleLeft />
        </a>
        <div
          onClick={handleLogout}
          className="text-white text-3xl hidden cursor-pointer"
        >
          <RiLogoutBoxLine />
        </div>
      </div>

      <div className="px-2">
        <div className="flex px-2 flex-col justify-center items-center bg-[#ffffff18] py-10 rounded-3xl backdrop-blur-2xl border border-[#ffffff96]">
          <h2 className="pt-10 text-white font-bold mb-10 text-3xl">
            Punch Out
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-5 w-full px-4">
            <div className="text-white whitespace-nowrap hidden md:block">
              Customer :
            </div>
            <div className="relative w-full md:w-auto min-w-[200px]">
              <div
                className="w-full px-8 py-2 bg-white rounded-3xl cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedCustomer || "Select a customer"}
              </div>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-10">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border-b outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id || customer._id}
                          onClick={() => {
                            setSelectedCustomer(
                              customer.name ||
                                customer.customerName ||
                                "Unnamed Customer"
                            );
                            setDropdownOpen(false);
                            setSearchTerm("");
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {customer.name ||
                            customer.customerName ||
                            "Unnamed Customer"}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No matching customers
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-5 w-full px-3">
            <div className="text-white">Image :</div>
            <div
              onClick={() => setShowCamera(true)}
              className="bg-white flex items-center cursor-pointer gap-3 py-2 px-10 rounded-3xl"
            >
              Take a Photo <LuCamera />
            </div>
          </div>

          {/* Image Preview */}
          {capturedImage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 1, delay: 0.2, ease: "backInOut" },
              }}
              className="mt-5 w-full max-w-md"
            >
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white text-sm">Preview:</h3>
                  <button
                    onClick={() => {
                      // Clean up the object URL
                      if (capturedImage.url) {
                        URL.revokeObjectURL(capturedImage.url);
                      }
                      setCapturedImage(null);
                    }}
                    className="text-white text-lg hover:text-gray-300"
                  >
                    <IoClose />
                  </button>
                </div>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img
                    src={capturedImage.url}
                    alt="Captured"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Punch Button */}
          <div className="flex w-full justify-end items-center mt-5 px-2">
            <button
              onClick={handlePunchOut}
              disabled={!selectedCustomer || !capturedImage || loading}
              className={`px-10 py-2 cursor-pointer rounded-3xl font-bold text-white bg-red-600 ${
                !selectedCustomer || !capturedImage || loading
                  ? "opacity-50"
                  : ""
              }`}
            >
              {loading ? "Processing..." : "Punch Out"}
            </button>
          </div>

          {/* Debug Info */}
          {/* {debugInfo && (
          <div className="mt-8 p-3 bg-gray-800 text-xs text-white rounded w-full max-w-md overflow-auto" style={{maxHeight: '150px'}}>
            <pre>{debugInfo}</pre>
          </div>
        )} */}
        </div>
      </div>
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed left-0 right-0 top-0 bottom-0 inset-0 bg-black flex items-center justify-center z-50  backdrop-blur-2xl w-full">
          <div className="bg-gray-800 p-4 rounded-lg w-full relative h-[100vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">
                {facingMode === "user" ? "Front Camera" : "Back Camera"}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setFacingMode((prev) =>
                      prev === "user" ? "environment" : "user"
                    )
                  }
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

            <div className="flex justify-center">
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
    </div>
  );
};

export default PunchInDashboard;