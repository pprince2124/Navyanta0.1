import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { loginAdmin, aToken } = useContext(AdminContext);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (aToken || localStorage.getItem("aToken")) {
      navigate("/admin/dashboard");
    }
  }, [aToken, navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        mobile: identifier, // backend expects 'mobile'
        password,
      });

      if (data.token) {
        loginAdmin(data.token);
        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg bg-black text-white">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">Admin</span> Login
        </p>

        <div className="w-full">
          <p>Mobile (Admin)</p>
          <input
            onChange={(e) => setIdentifier(e.target.value)}
            value={identifier}
            className="border border-gray-700 rounded w-full p-2 mt-1 bg-gray-800 text-white"
            type="text"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-700 rounded w-full p-2 mt-1 bg-gray-800 text-white"
            type="password"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base hover:bg-primary-dark">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;