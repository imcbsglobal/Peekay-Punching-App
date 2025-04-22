import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api";
import { GrFingerPrint } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import pkLogo from "../../assets/pklogo.png";
import PunchLogs from "./PunchLogs";
import UsersList from "./UsersList";
import Customers from "./Customers";
import { CiLogout } from "react-icons/ci";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("punchLogs");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('user_name');
    setUserName(storedUsername || 'Admin');
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data
    logout();
    localStorage.removeItem('user_name');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "punchLogs":
        return <PunchLogs />;
      case "users":
        return <UsersList />;
      case "customers":
        return <Customers />;
      default:
        return <PunchLogs />;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full">
        <div className="flex justify-between gap-10 w-full">
          {/* Admin Navbar */}
          <div className="fixed px-2 pt-10 top-0 bottom-0 left-0 w-[300px] rounded-r-xl bg-[#ffffff1a] border-r border-[#ffffff73] backdrop-blur-2xl">
            <div className="flex justify-center items-center mb-5">
              <div className="w-[150px] ">
                <img
                  src={pkLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap mb-10 text-[#fff] px-2 py-2 bg-[#ffffff37] rounded-full shadow">
              <FaUser className="p-1 rounded-full bg-[#fff] text-2xl text-[#00000086]" />
              <span>{userName}</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <ul className="flex flex-col w-full gap-4 px-10 text-lg font-semibold text-white">
                <button
                  onClick={() => setActiveTab("punchLogs")}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <GrFingerPrint />
                  <span>Punch Logs</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <FaUser />
                  <span>Users</span>
                </button>

                <button
                  onClick={() => setActiveTab("customers")}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <HiUsers />
                  <span>Customers</span>
                </button>
              </ul>
            </div>
            {/* Bottom Side */}
            <div className="w-full flex justify-end">
              <button
                onClick={handleLogout}
                className="bottom-10 gap-2 absolute flex justify-end items-center text-[#000000ae] cursor-pointer font-semibold bg-[#ffff] px-10 py-2 rounded-xl hover:bg-gray-100"
              >
                <CiLogout className="font-bold"/> Logout
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="left-[310px] px-2 fixed right-0 h-screen overflow-y-auto bg-[#ffffff1a] border-l rounded-l-xl border-[#ffffff73] backdrop-blur-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
