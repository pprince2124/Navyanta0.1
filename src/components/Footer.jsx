import React from 'react'
import { assets } from '../assets/assets'
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        {/* Brand + About */}
        <div>
          <img className="mb-5 w-40" src={assets.group_profiles} alt="Navyanta Logo" />
          <p className="w-full md:w-2/3 text-gray-200 leading-6">
            NAVYANTA is your trusted platform for certified aluminium fabrication
            services. We deliver precision, transparency, and premium quality in
            every project — from design to installation.
          </p>

          {/* Social Media */}
          <div className="flex gap-4 mt-6 text-white text-xl">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-xl font-medium mb-5 text-white">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-200">
            <li><a href="/" className="hover:text-cyan-300 transition">Home</a></li>
            <li><a href="/about" className="hover:text-cyan-300 transition">About Us</a></li>
            <li><a href="/services" className="hover:text-cyan-300 transition">Services</a></li>
            <li><a href="/privacy" className="hover:text-cyan-300 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-medium mb-5 text-white">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-200">
            <li><a href="tel:+91-9876543210" className="hover:text-cyan-300 transition">+91‑98765‑43210</a></li>
            <li><a href="mailto:contact@navyanta.com" className="hover:text-cyan-300 transition">contact@navyanta.com</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-primary via-blue-700 to-primary">
        <hr className="border-gray-600" />
        <p className="py-5 text-sm text-center text-gray-200">
          © {new Date().getFullYear()} NAVYANTA — All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer