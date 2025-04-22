import React, { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { LuCamera } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

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
        </div>
      </div>
    </div>
  );
};

export default PunchInDashboard;
