import React, { useEffect } from 'react'
import logo from "../assets/logo.png"
import pktext from "../assets/pk text.png"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3500); // 3 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#2c2d2f] flex flex-col justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <div className='w-[100px] mb-3 logoAnim'>
          <img src={logo} alt="Logo" className='w-full h-full object-contain' />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 1, duration: 1, ease: "easeInOut" } }}
          className='text-[#fff] text-3xl font-bold IntroFont w-[200px]'>
          <img src={pktext} alt="Text" />
        </motion.div>
      </div>
    </div>
  )
}

export default Intro
