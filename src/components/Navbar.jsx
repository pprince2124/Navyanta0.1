import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userData, backendUrl } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(""); // reset token
    navigate("/login");
  };

  // ✅ Helper to resolve image URL
  const getImageUrl = (img) => {
    if (!img) return assets.default_avatar;
    return img.startsWith("http") ? img : `${backendUrl}/${img}`;
  };

  return (
    <nav className="w-full bg-gradient-to-r from-primary via-blue-700 to-primary text-white sticky top-0 z-50">
      <div className="flex items-center justify-between py-4 px-6 md:px-16 lg:px-24">
        
        {/* Logo + Brand */}
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
          <img
            className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl shadow-primary/40 animate-pulse"
            src={assets.nvlogo}
            alt="NAVYANTA Logo"
          />
          <h1 className="text-2xl md:text-3xl font-lobster tracking-wide drop-shadow-lg">
            NAVYANTA
          </h1>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          {["HOME", "SERVICES", "ABOUT", "CONTACT"].map((item, i) => (
            <NavLink
              key={i}
              to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                isActive ? "font-bold underline" : "group relative"
              }
            >
              <li>{item}</li>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {token && userData ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  src={getImageUrl(userData?.image)}
                  alt="User"
                />
                <span className="font-medium">{userData.name}</span>
                <img className="w-3" src={assets.dropdown_icon} alt="Dropdown" />
              </div>
              {showDropdown && (
                <div className="absolute top-12 right-0 w-48 bg-white text-black rounded-lg shadow-lg py-2">
                  <p onClick={() => navigate("/my-profile")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</p>
                  <p onClick={() => navigate("/my-projects")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Projects</p>
                  <p onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</p>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="hidden md:block bg-white text-primary px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Login / Signup
            </NavLink>
          )}

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setShowMenu(true)}
            src={assets.menu_icon}
            alt="Menu"
            className="w-6 md:hidden cursor-pointer"
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-64 
                      bg-gradient-to-b from-primary via-blue-700 to-primary 
                      text-white shadow-lg transform transition-transform duration-300 
                      ${showMenu ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.nvlogo} className="w-14" alt="NAVYANTA Logo" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7 cursor-pointer"
              alt="Close"
            />
          </div>

          {/* User Info in Mobile Menu */}
          {token && userData && (
            <div className="flex flex-col items-center mt-4">
              <img
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
                src={getImageUrl(userData?.image)}
                alt="User"
              />
              <p className="mt-2 font-medium">{userData.name}</p>
              <button
                onClick={logout}
                className="mt-2 bg-white text-primary px-4 py-1 rounded-full"
              >
                Logout
              </button>
            </div>
          )}

          <ul className="flex flex-col items-center gap-6 mt-6 text-lg font-medium">
            {["HOME", "SERVICES", "ABOUT", "CONTACT"].map((item, i) => (
              <NavLink
                key={i}
                onClick={() => setShowMenu(false)}
                to={item === "HOME" ? "/" : `/${item.toLowerCase()}`}
              >
                <p className="px-4 py-2">{item}</p>
              </NavLink>
            ))}
            {!token && (
              <NavLink
                to="/login"
                onClick={() => setShowMenu(false)}
                className="mt-6 bg-white text-primary px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition"
              >
                Login / Signup
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;