import React from "react";
import { FaBell } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // 👈 import assets

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="w-full h-16 bg-gray-900 flex items-center justify-between px-6 shadow-md">
      {/* Left: Logo + Brand */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        <img
          src={assets.nvlogo}
          alt="Navyanta Logo"
          className="h-10 w-10 object-contain"
        />
        <span className="text-xl font-bold text-primary tracking-wide">
          NAVYANTA
        </span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <input
          type="text"
          placeholder="Search services, users..."
          className="w-full max-w-md px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 text-white">
        <button className="relative hover:text-primary">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-2 bg-red-500 text-xs rounded-full px-1">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
          <span className="hidden sm:block">Admin</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 hover:text-red-400"
          >
            <MdLogout size={20} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;