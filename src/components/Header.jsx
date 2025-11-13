import React from "react"
import { assets } from "../assets/assets"

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-primary via-blue-700 to-primary 
                       overflow-hidden relative text-white">
      {/* Switch to 12-column grid for more control */}
      <div className="grid md:grid-cols-12 gap-10 px-6 md:px-16 lg:px-24 py-20 items-center">
        
        {/* Left: Text (wider, bigger font) */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start 
                        text-center md:text-left gap-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-lobster font-extrabold leading-tight drop-shadow-lg">
            Precision in Every Frame <br /> Excellence in Every Project
          </h1>

          <div className="flex flex-col items-center md:items-start gap-6 text-base md:text-lg font-light max-w-xl">
            <img className="w-32 drop-shadow-md" src={assets.group_profiles} alt="Fabrication Experts" />
            <p>
              Partner with certified aluminium specialists delivering seamless,
              transparent, and high‑quality fabrication services tailored to your vision.
            </p>
          </div>

          <a
            href="#services"
            className="flex items-center gap-3 bg-white text-primary font-semibold 
                       px-10 py-4 rounded-full text-base md:text-lg
                       hover:scale-105 hover:shadow-xl hover:bg-gray-100 
                       transition-all duration-300"
          >
            Start Your Project
            <img className="w-4 animate-bounce" src={assets.arrow_icon} alt="Arrow Icon" />
          </a>
        </div>

        {/* Right: Hero Image + Floating Cards (slightly narrower) */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          <img
            className="w-[100%] md:w-[85%] rounded-xl shadow-2xl"
            src={assets.header1}
            alt="Aluminium Fabrication"
          />

          {/* Floating Cards */}
          <div className="absolute -top-12 -left-12 bg-purple-600 text-white px-6 py-5 rounded-2xl shadow-xl animate-float">
            <p className="text-xl md:text-2xl font-bold">11.17 days</p>
            <p className="text-sm md:text-base opacity-80">Avg Completion</p>
          </div>

          <div className="absolute bottom-0 -left-16 bg-white text-black px-6 py-5 rounded-2xl shadow-xl animate-float flex flex-col items-center">
            <img src={assets.qr_code} alt="QR" className="w-14 h-14 mb-2" />
            <p className="text-sm md:text-base">Scan for Quote</p>
          </div>

          <div className="absolute -top-14 right-0 bg-emerald-500 text-white px-6 py-5 rounded-2xl shadow-xl animate-float">
            <p className="text-xl md:text-2xl font-bold">500+</p>
            <p className="text-sm md:text-base opacity-80">Specialists</p>
          </div>

          <div className="absolute bottom-0 right-0 bg-cyan-500 text-white px-6 py-5 rounded-2xl shadow-xl animate-float">
            <p className="text-xl md:text-2xl font-bold">2k+</p>
            <p className="text-sm md:text-base opacity-80">Users Worldwide</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header