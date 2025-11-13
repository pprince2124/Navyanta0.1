import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="text-white">

      {/* Header */}
      <div className="text-center text-2xl pt-10">
        <p>CONTACT <span className="font-semibold">US</span></p>
      </div>

      {/* Contact Section */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px] rounded-lg"
          src={assets.contact}
          alt="Contact Navyanta"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg">OUR OFFICE</p>
          <p className="text-gray-300">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-300">
            Tel: (415) 555-0132 <br /> Email: contact@navyanta.com
          </p>

          <p className="font-semibold text-lg">CAREERS AT NAVYANTA</p>
          <p className="text-gray-300">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-white px-8 py-3 text-sm rounded hover:bg-primary hover:border-primary hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

    </div>
  )
}

export default Contact