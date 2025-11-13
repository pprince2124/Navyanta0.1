// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // ✅ Use env variable for production
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ✅ Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ✅ Profile state (safe defaults to avoid null errors)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "Not Selected",
    dob: "",
    image: null,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ Service/category state
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  // ✅ Centralized logout helper
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData({
      name: "",
      email: "",
      phone: "",
      address: { line1: "", line2: "" },
      gender: "Not Selected",
      dob: "",
      image: null,
    });
    delete axios.defaults.headers.common["Authorization"];
  };

  // Keep localStorage + axios in sync
  useEffect(() => {
    if (token && token !== "false" && token !== "") {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadUserProfileData();
    } else {
      logout();
    }
  }, [token]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/category/list`);
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      toast.error("Failed to load categories");
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/service/list`);
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      toast.error("Failed to load services");
    }
  };

  // ✅ Profile fetch with auto-logout on 401
  const loadUserProfileData = async () => {
    try {
      setLoadingProfile(true);
      const { data } = await axios.get(`${backendUrl}/api/user/profile`);
      if (data.success) {
        setUserData(data.userData);
      }
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
      if (err.response?.status === 401) {
        logout();
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        logout,
        loadUserProfileData,
        categories,
        services,
        fetchCategories,
        fetchServices,
        loadingProfile, // expose loading flag
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;