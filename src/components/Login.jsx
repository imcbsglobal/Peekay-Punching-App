import React from "react";
import pkLogo from "../assets/pklogo.png";

const Login = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center px-2">
      <div className="flex flex-col justify-center items-center w-full px-2">
        <div className="w-[150px] mb-24">
          <img src={pkLogo} alt="" className="w-full h-full object-contain" />
        </div>
        <form action="" className="flex flex-col w-full px-2 gap-5">
            <input type="text" placeholder="User Name" className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"/>
            <input type="password" placeholder="Password" className="bg-[#fff] px-5 py-2 rounded-3xl border-none outline-none"/>
            
        </form>
        <div className="flex items-center justify-center mt-5">
             <a href="/userDashboard"><button className="px-10 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer">Login</button></a>
            </div>
      </div>
    </div>
  );
};

export default Login;
