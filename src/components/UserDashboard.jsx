import React from "react";
import pkLogo from "../assets/pklogo.png";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

const UserDashboard = () => {
  return (
    <div className="h-screen w-full px-2 relative overflow-hidden">
      <div className="flex items-center justify-between pt-5">
        <a href="/login">
          <div className="text-[#fff] text-3xl cursor-pointer">
            <FaAngleLeft />
          </div>
        </a>
        <a href="/">
          <div className="text-[#fff] text-3xl cursor-pointer">
            <RiLogoutBoxLine />
          </div>
        </a>
      </div>
      <div className="flex flex-col justify-center items-center w-full px-2">
        <div className="w-[150px] mb-5 pt-28">
          <img src={pkLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="text-[#fff] font-semibold mb-6 w-full flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffffff1d]">
          <span className=" bg-[#ffffff30] rounded-full p-2 text-xl">
            <FaUser />
          </span>{" "}
          Hi, Sajith Thomas
        </div>
        <div className="flex justify-between gap-5">
          <div className="">
            <a href="/PunchInDashboard">
              <button className="px-10 py-2 rounded-3xl bg-[#fff] text-[#3fab00] border border-[#3fab00] font-bold cursor-pointer">
                Punch In
              </button>
            </a>
          </div>
          <div>
            <button className="px-10 py-2 rounded-3xl bg-[#fff] font-bold border text-[#f00] border-[#ab0000] cursor-pointer">
              Exit
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 text-center leading-tight font-bold text-[#fff] text-sm flex justify-center items-center w-full">
        <div>
          Powered By <span className="block">IMC Business Solutions</span>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
