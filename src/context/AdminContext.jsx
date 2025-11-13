import { createContext, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const backendUrl = "http://localhost:4000";

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [notificationLogs, setNotificationLogs] = useState([]); // NEW

  // --- Auth ---
  const loginAdmin = (token) => {
    setAToken(token);
    localStorage.setItem("aToken", token);
  };

  const logoutAdmin = () => {
    setAToken("");
    localStorage.removeItem("aToken");
  };

  // --- Projects ---
  const getAllProjects = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("❌ Error fetching projects:", err.response?.data || err.message);
      setProjects([]);
    }
  };

  const cancelProject = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/project/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === id ? { ...proj, status: "cancelled" } : proj
        )
      );
    } catch (err) {
      console.error("❌ Error cancelling project:", err.response?.data || err.message);
    }
  };

  const completeProject = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/project/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === id ? { ...proj, status: "completed" } : proj
        )
      );
    } catch (err) {
      console.error("❌ Error completing project:", err.response?.data || err.message);
    }
  };

  // --- Quotation Flow ---
  const shareQuotation = async (payload) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/projects/quotation/share`,
        payload,
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj._id === payload.projectId ? { ...proj, ...data.project } : proj
          )
        );
      }
    } catch (err) {
      console.error("❌ Error sharing quotation:", err.response?.data || err.message);
    }
  };

  const approveVisit = async (projectId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/projects/approve-visit`,
        { projectId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj._id === projectId ? { ...proj, ...data.project } : proj
          )
        );
      }
    } catch (err) {
      console.error("❌ Error approving visit:", err.response?.data || err.message);
    }
  };

  const uploadQuotationFile = async (projectId, file) => {
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("quotationFile", file);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/projects/upload-quotation`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj._id === projectId ? { ...proj, quotationFile: data.file } : proj
          )
        );
      }
    } catch (err) {
      console.error("❌ Error uploading quotation file:", err.response?.data || err.message);
    }
  };

  // --- Services ---
  const getAllServices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/service/list`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success && Array.isArray(data.data)) {
        setServices(data.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("❌ Error fetching services:", err.response?.data || err.message);
      setServices([]);
    }
  };

  const deleteService = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/service/${id}`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error("❌ Error deleting service:", err.response?.data || err.message);
    }
  };

  const toggleServiceVisibility = async (id, isActive) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/service/visibility`,
        { serviceId: id, isActive },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      if (data.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === id ? { ...s, isActive } : s))
        );
      }
    } catch (err) {
      console.error("❌ Error toggling service visibility:", err.response?.data || err.message);
    }
  };

  // --- Notifications ---
  const getNotificationLogs = async (filters = {}) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/notify/logs`, {
        headers: { Authorization: `Bearer ${aToken}` },
        params: filters,
      });
      if (data.logs) {
        setNotificationLogs(data.logs);
      } else {
        setNotificationLogs([]);
      }
      return data;
    } catch (err) {
      console.error("❌ Error fetching notification logs:", err.response?.data || err.message);
      setNotificationLogs([]);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        backendUrl,
        aToken,
        loginAdmin,
        logoutAdmin,

        projects,
        getAllProjects,
        cancelProject,
        completeProject,

        shareQuotation,
        approveVisit,
        uploadQuotationFile,

        services,
        getAllServices,
        deleteService,
        toggleServiceVisibility,

        notificationLogs,
        getNotificationLogs, // NEW
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;