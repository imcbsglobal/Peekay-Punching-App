import React from "react";
import pkLogo from "../assets/pklogo.png";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";

const UserDashboard = () => {
  return (
    <div className="h-screen w-full px-2 relative overflow-hidden">
        <div className="flex items-center justify-between pt-5">
            <a href="/login"><div className="text-[#fff] text-3xl cursor-pointer"><FaAngleLeft/></div></a>
            <a href="/"><div className="text-[#fff] text-3xl cursor-pointer"><RiLogoutBoxLine/></div></a>
        </div>
      <div className="flex flex-col justify-center items-center w-full px-2">
        <div className="w-[150px] mb-5 pt-28">
          <img src={pkLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="text-[#fff] font-semibold mb-10">Hi, Sajith Thomas</div>
        <div className="mb-20">
            <button className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer">Punch In</button>
        </div>
        <div>
            <button className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer">Exit</button>
        </div>
      </div>
      <div className="absolute bottom-3 text-center leading-tight font-bold text-[#fff] text-sm flex justify-center items-center w-full">
        <div>Powered By <span className="block">IMC Business Solutions</span></div>
      </div>
    </div>
  );
};

export default UserDashboard;
