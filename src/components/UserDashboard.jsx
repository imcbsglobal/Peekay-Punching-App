import React, { useState, useEffect, useRef } from "react";
import pkLogo from "../assets/pklogo.png";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI, punchAPI } from "../api";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion"
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const UserDashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [openConfirmPunchIn, setOpenConfirmPunchIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const filteredCustomers = customers.filter((customer) =>
    
    (customer.name || customer.customerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  // console.log("Customer Address",customers.customer)


  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.id) {
      setUserName(userData.id);
    }

    // Fetch customers
    const fetchCustomers = async () => {
      try {
        const response = await punchAPI.getCustomers();
        // console.log("Customers List",response)
        const customersArray = Array.isArray(response) ? response : 
                           Array.isArray(response.data) ? response.data : [];
        setCustomers(customersArray);
      } catch (error) {
        alert("Failed to load customers. Please try again.");
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  // Camera effects and functions (same as PunchInDashboard)
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
        video: { facingMode: { exact: facingMode } },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;
      } catch (fallbackErr) {
        alert("Failed to access camera. Please check browser permissions.");
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

  const handlePunchIn = async () => {
    try {
      if (!selectedCustomer || !capturedImage) {
        alert("Please select a customer and take a photo before punching in");
        return;
      }
  
      const location = await punchAPI.getCurrentLocation();
      const locationString = `${location.latitude},${location.longitude}`;
      const currentTime = punchAPI.getCurrentTimeISO();
      const currentDate = currentTime.split('T')[0];
      
      // Create FormData object
      const formData = new FormData();
      formData.append('punchInTime', currentTime);
      formData.append('punchInLocation', locationString);
      formData.append('customerName', selectedCustomer);
      formData.append('photo', capturedImage.file);
      formData.append('punchDate', currentDate);
      formData.append('status', 'IN');
  
      // Verify all required fields are present
      if (!currentTime || !locationString || !selectedCustomer || !capturedImage.file) {
        throw new Error("All required fields must be filled");
      }
  
      const response = await punchAPI.punchIn(formData);
      
      if (response && response.data) {
        localStorage.setItem('currentPunch', JSON.stringify(response.data));
      } else {
        localStorage.setItem('currentPunch', JSON.stringify(response));
      }
  
      navigate("/PunchInDashboard", { replace: true });
    } catch (error) {
      // console.error("Punch-in failed:", error);
      alert(error.message || "Failed to punch in. Please try again.");
    }
  };

  const handleLogout = () => {
    authAPI.logout(); // Clear localStorage/session
    navigate("/login", { replace: true });
    window.location.reload(); // Prevent blank page issue
  };
  

  return (
    <div className="h-screen w-full px-2 relative overflow-x-hidden">
      <div className="flex items-center justify-between pt-5">
        <a href="/login">
          <div className="text-[#fff] text-3xl cursor-pointer">
            <FaAngleLeft />
          </div>
        </a>
        <div
          onClick={handleLogout}
          className="text-[#fff] text-3xl cursor-pointer"
        >
          <RiLogoutBoxLine />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full px-2 max-w-[700px] mx-auto">
        <div className="w-[150px] mb-5 pt-10">
          <img src={pkLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="text-[#fff] font-semibold w-full flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff1d]">
          <span className=" bg-[#ffffff30] rounded-full p-2 text-xl">
            <FaUser />
          </span>{" "}
          Hi, {userName || "User"}
        </div>
      </div>

      <div className="max-w-[700px] mx-auto">
        {/* Add Customer Selection */}
        <div className="flex mt-5 flex-col md:flex-row justify-center items-center gap-5 mb-5 w-full px-4">
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

        {/* Add Photo Capture */}
        <div className="flex justify-end items-center gap-5 w-full px-3 mb-5">
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
            className="mt-5 w-full max-w-md mb-3"
          >
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-sm">Preview:</h3>
                <button
                  onClick={() => {
                    if (capturedImage.url)
                      URL.revokeObjectURL(capturedImage.url);
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

        {/* Camera Modal (same as PunchInDashboard) */}
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
        <div className="flex justify-between px-4 w-full gap-5 mb-16">
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

      
      <div className="fixed bottom-3 text-center leading-tight font-bold text-[#fff] text-sm flex justify-center items-center w-full">
        <div>
          Powered By <span className="block">IMC Business Solutions</span>
        </div>
      </div>
      {/* Confirm PunchIn */}
      {openConfirmPunchIn && (
        <motion.div className="fixed top-0 bottom-0 left-0 right-0 bg-[#00000060] backdrop-blur-xl flex flex-col justify-center items-center px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.9, ease: "backInOut" },
            }}
            className="max-w-[600px] w-full h-[150px] bg-[#fff2] rounded-3xl"
          >
            <div
              className="absolute right-5 pt-5 text-[#fff]"
              onClick={() => setOpenConfirmPunchIn(!openConfirmPunchIn)}
            >
              <IoMdClose />
            </div>
            <div className="text-[#fff] font-bold pt-5 text-center mb-5">
              Are you sure want to Punch In
            </div>
            <div className="flex justify-center items-center gap-10">
              <button
                className="px-5 py-2 bg-[#1faa00] rounded-md text-[#fff] font-semibold"
                onClick={handlePunchIn}
              >
                Punch In
              </button>
              <button
                className="bg-[#f00] px-5 py-2 font-semibold rounded-md text-[#fff]"
                onClick={() => setOpenConfirmPunchIn(!openConfirmPunchIn)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserDashboard;