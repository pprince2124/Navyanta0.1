import React, { useContext } from "react";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments"; // ✅ still named this, but shows projects
import AddService from "./pages/Admin/AddService";
import AllServices from "./pages/Admin/AllServices";
import AdminNotificationLogs from "./pages/Admin/AdminNotificationLogs"; // NEW

// Auth
import Login from "./pages/Login";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="bg-[#0f1117] min-h-screen flex flex-col">
      <ToastContainer />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* ✅ renamed route to projects */}
            <Route path="/admin/appointments" element={<AllAppointments />} />

            <Route path="/admin/add-service" element={<AddService />} />
            <Route path="/admin/all-services" element={<AllServices />} />

            {/* NEW Notifications route */}
            <Route path="/admin/notifications" element={<AdminNotificationLogs />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;