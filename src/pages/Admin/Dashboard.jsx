import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../components/StatCard";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, projects, getAllProjects, services } = useContext(AdminContext);
  const { backendUrl, formatCurrency } = useContext(AppContext);

  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    projects: 0,
    completedProjects: 0,
    cancelledProjects: 0,
  });

  useEffect(() => {
    if (aToken) {
      getAllProjects();
      fetchDashboardStats();
    }
  }, [aToken]);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      setStats(data);
    } catch (err) {
      console.error("Dashboard stats error:", err.response?.data || err.message);
      toast.error("Failed to fetch dashboard stats");
    }
  };

  const totalServices = services.length || stats.services;
  const totalProjects = projects.length || stats.projects;
  const requestedProjects = projects.filter((p) => p.status === "requested").length;

  // Calculate revenue from completed projects (sum of quotation.amount)
  const revenue = projects
    .filter((p) => p.status === "completed" && p.quotation?.amount)
    .reduce((sum, p) => sum + p.quotation.amount, 0);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Services" value={totalServices} />
        <StatCard title="Projects" value={totalProjects} />
        <StatCard title="Requested" value={requestedProjects} />
        <StatCard title="Completed" value={stats.completedProjects} />
        <StatCard title="Cancelled" value={stats.cancelledProjects} />
        <StatCard title="Revenue" value={formatCurrency(revenue)} />
      </div>
    </div>
  );
};

export default Dashboard;