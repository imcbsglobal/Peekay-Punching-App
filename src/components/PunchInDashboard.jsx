import React, { useState, useRef } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const PunchInDashboard = () => {
  const [punchIn, setPunchIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setShowCamera(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageDataURL = canvas.toDataURL("image/png");
      setCapturedImage(imageDataURL);
      stopCamera();
    }
  };

  return (
    <div className="overflow-hidden px-2 h-screen">
      <div className="flex items-center justify-between pt-5 w-full">
        <a href="/userDashboard">
          <div className="text-white text-3xl cursor-pointer">
            <FaAngleLeft />
          </div>
        </a>
        <a href="/">
          <div className="text-white text-3xl cursor-pointer">
            <RiLogoutBoxLine />
          </div>
        </a>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="pt-10 text-white font-bold mb-10 text-3xl">Punch In</div>
        <div className="flex justify-center items-center gap-5 mb-10">
          <div className="text-white">Customer : </div>
          <div>
            <select name="" id="" className="px-8 py-2 rounded-3xl bg-white outline-none border-none cursor-pointer">
              <option value="" selected disabled>Select Customer</option>
              <option value="">Customer 1</option>
              <option value="">Customer 2</option>
              <option value="">Customer 3</option>
              <option value="">Customer 4</option>
            </select>
          </div>
          <div className="text-white text-2xl cursor-pointer"><FaDownload/></div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <div className="text-white">Image : </div>
          <div 
            onClick={startCamera} 
            className="bg-white flex items-center cursor-pointer gap-3 py-2 px-10 rounded-3xl"
          >
            Take a Photo <span><LuCamera/></span>
          </div>
        </div>
        
        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-medium">Take a Photo</h3>
                <button 
                  onClick={stopCamera} 
                  className="text-white text-2xl hover:text-gray-300"
                >
                  <IoClose />
                </button>
              </div>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={capturePhoto}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Image Preview Section */}
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
            </div>
          </div>
        )}
        
        <div className="flex w-full justify-end items-center mt-10 px-2">
          {punchIn ? (
            <button 
              onClick={() => setPunchIn(!punchIn)} 
              className="px-10 py-2 cursor-pointer rounded-3xl bg-red-600 font-bold text-white"
            >
              Punch Out
            </button>
          ) : (
            <button 
              onClick={() => setPunchIn(!punchIn)} 
              className="px-10 py-2 cursor-pointer rounded-3xl bg-green-600 font-bold text-white"
            >
              Punch In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PunchInDashboard;