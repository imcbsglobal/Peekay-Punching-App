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
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import AdminConsole from "./AdminConsole";
import { FaUserNurse } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("adminConsole");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("user_name");
    setUserName(storedUsername || "Admin");
  }, []);

  const handleLogout = () => {
    // Clear all auth-related data
    logout();
    localStorage.removeItem("user_name");
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "punchLogs":
        return <PunchLogs />;
      case "users":
        return <UsersList />;
      case "customers":
        return <Customers />;
      case "puncLogs":
        return <PunchLogs />;  
      default:
        return <AdminConsole />;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full">
        <div
          className="absolute md:hidden cursor-pointer z-50 top-3 left-2 text-3xl text-[#fff]"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <MdOutlineArrowDropDownCircle />
        </div>
        {openMenu && (
          <div className="fixed top-0 flex flex-col justify-center items-center left-0 right-0 bottom-0 bg-[#1c1b1b] z-50">
            <div
              className="text-[#fff] absolute top-5 right-5"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <CgClose />
            </div>
            <div className="w-[150px] mb-10">
              <img
                src={pkLogo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-5 items-center justify-center">
              <ul className="flex flex-col w-full gap-4 px-10 text-lg font-semibold text-white">
                <button
                  onClick={() => {
                    setActiveTab("adminConsole");
                    setOpenMenu(!openMenu);
                  }}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <FaUserNurse />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("punchLogs");
                    setOpenMenu(!openMenu);
                  }}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <GrFingerPrint />
                  <span>Punch Logs</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("users");
                    setOpenMenu(!openMenu);
                  }}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <FaUser />
                  <span>Users</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("customers");
                    setOpenMenu(!openMenu);
                  }}
                  className="flex items-center justify-start gap-2 cursor-pointer"
                >
                  <HiUsers />
                  <span>Customers</span>
                </button>
              </ul>

              <button
                onClick={handleLogout}
                className="bottom-10 gap-2  flex justify-end items-center text-[#000000ae] cursor-pointer font-semibold bg-[#ffff] px-10 py-2 rounded-xl hover:bg-gray-100"
              >
                <CiLogout className="font-bold" /> Logout
              </button>
            
            </div>
          </div>
        )}

        <div className="md:flex justify-between gap-10 w-full">
          {/* Admin Navbar */}
          <div className="fixed hidden md:block px-2 pt-10 top-0 bottom-0 left-0 w-[300px] rounded-r-xl bg-[#ffffff1a] border-r border-[#ffffff73] backdrop-blur-2xl">
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
                  onClick={() => setActiveTab("adminConsole")}
                  className={`flex items-center justify-start gap-2 cursor-pointer ${activeTab === "adminConsole" ? "text-[#EEB31B] transition-all duration-300" : ""}`}
                >
                  <FaUserNurse />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab("punchLogs")}
                  className={`flex items-center justify-start gap-2 cursor-pointer ${activeTab === "punchLogs" ? "text-[#EEB31B] transition-all duration-300" : ""}`}
                >
                  <GrFingerPrint />
                  <span>Punch Logs</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center justify-start gap-2 cursor-pointer ${activeTab === "users" ? "text-[#EEB31B] transition-all duration-300" : "" }`}
                >
                  <FaUser />
                  <span>Users</span>
                </button>

                <button
                  onClick={() => setActiveTab("customers")}
                  className={`flex items-center justify-start gap-2 cursor-pointer ${activeTab === "customers" ? "text-[#EEB31B] transition-all duration-300" : "" }`}
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
                <CiLogout className="font-bold" /> Logout
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="md:left-[310px] left-0 px-2 fixed right-0 h-screen overflow-y-auto bg-[#ffffff1a] border-l rounded-l-xl border-[#ffffff73] backdrop-blur-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
