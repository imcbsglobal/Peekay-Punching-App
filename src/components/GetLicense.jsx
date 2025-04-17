import React from 'react'
import pkLogo from "../assets/pklogo.png"

const GetLicense = () => {
  return (
    <div className='h-screen w-full px-2 flex justify-center'>
      <div className='flex flex-col justify-center items-center w-full px-2'>
        <div className='w-[150px] mb-24'>
            <img src={pkLogo} alt="" className='w-full h-full object-contain'/>
        </div>
        <input type="text" placeholder='License' className='mb-5 px-7 py-2 w-full border-none outline-none rounded-3xl bg-[#fff]'/>
        <div className='flex justify-end w-full'>
            <a href="/login"><button className='px-8 py-2 rounded-3xl bg-[#fff] font-bold cursor-pointer'>Get License</button></a>
        </div>
      </div>
    </div>
  )
}

export default GetLicense
