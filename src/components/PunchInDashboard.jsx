import React,{useState} from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { LuCamera } from "react-icons/lu";

const PunchInDashboard = () => {
    const[ punchIn, setPunchIn ] = useState(false)
  return (
    <div className="overflow-hidden px-2 h-screen">
        <div className="flex items-center justify-between pt-5 w-full">
          <a href="/userDashboard">
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
      <div className="flex flex-col justify-center items-center">
        <div className="pt-10 text-[#fff] font-bold mb-10 text-3xl">Punch In</div>
        <div className="flex justify-center items-center gap-5 mb-10">
            <div className="text-[#fff]">Customer : </div>
            <div>
                <select name="" id="" className="px-8 py-2 rounded-3xl bg-[#fff] outline-none border-none cursor-pointer">
                    <option value="" selected disabled>Select Customer</option>
                    <option value="">Customer 1</option>
                    <option value="">Customer 2</option>
                    <option value="">Customer 3</option>
                    <option value="">Customer 4</option>
                </select>
            </div>
            <div className="text-[#fff] text-2xl cursor-pointer"><FaDownload/></div>
        </div>
        <div className="flex justify-center items-center gap-5">
            <div className="text-[#fff]">Image : </div>
            <div className="bg-[#fff] flex items-center cursor-pointer gap-3 py-2 px-10 rounded-3xl">Take a Photo <span><LuCamera/></span></div>
        </div>
        <div className="flex w-full justify-end items-center mt-[300px] px-2">
          {punchIn ? 
          <button onClick={() => setPunchIn(!punchIn)} className="px-10 py-2 cursor-pointer rounded-3xl bg-[#ff0000] font-bold">Punch Out</button>
           : 
           <button onClick={() => setPunchIn(!punchIn)} className="px-10 py-2 cursor-pointer rounded-3xl bg-[#10be00] font-bold">Punch In</button>
        }
            
        </div>
      </div>
    </div>
  );
};

export default PunchInDashboard;
