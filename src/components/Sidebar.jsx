import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaPlusCircle,
  FaListAlt,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Appointments", path: "/admin/appointments", icon: <FaCalendarCheck /> },
    { name: "Add Service", path: "/admin/add-service", icon: <FaPlusCircle /> },
    { name: "All Services", path: "/admin/all-services", icon: <FaListAlt /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell /> }, // NEW
  ];

  return (
    <div className="h-screen w-64 bg-gray-950 text-gray-300 flex flex-col border-r border-gray-800">
      {/* Logo / Brand */}
      <div className="p-6 text-2xl font-bold text-white tracking-wide border-b border-gray-800">
        NAVYANTA Admin
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;