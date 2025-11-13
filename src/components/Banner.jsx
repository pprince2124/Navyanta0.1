import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className="flex rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 
                    bg-gradient-to-r from-primary to-gray-800">
      
      {/* Left Side */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white">
          <p className="font-extrabold">Build With Certified Experts</p>
          <p className="mt-4 font-light">Trusted Aluminium Fabrication Services</p>
        </div>
        <button 
          onClick={() => { navigate('/login'); scrollTo(0, 0) }}
          className="bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 
                     hover:scale-105 hover:shadow-lg transition-all duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Right Side */}
      <div className="hidden md:block md:w-1/2 relative">
  <img
    className="w-[120%] absolute bottom-0 right-0"
    src={assets.banner}
    alt="Aluminium Fabrication"
  />
</div>
    </div>
  )
}

export default Banner