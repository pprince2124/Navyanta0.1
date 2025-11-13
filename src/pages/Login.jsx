// src/pages/Login.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mode, setMode] = useState("signup"); // "signup" or "login"
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (mode === "signup") {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          mobile,
          password,
        });
        data = res.data;
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          mobile,
          password,
        });
        data = res.data;
      }

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token); // ✅ triggers redirect effect
        toast.success(mode === "signup" ? "Account created!" : "Login successful!");
        navigate("/"); // ✅ immediate redirect after login/signup
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect guard (backup)
  useEffect(() => {
    if (token && token !== "false" && token !== "") {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-700 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {mode === "signup" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {mode === "signup" ? "sign up" : "log in"} to book an appointment
        </p>

        {mode === "signup" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-gray-300 rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Mobile Number</p>
          <input
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            className="border border-gray-300 rounded w-full p-2 mt-1"
            type="tel"
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit mobile"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-300 rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : mode === "signup"
            ? "Create account"
            : "Login"}
        </button>

        {mode === "signup" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setMode("login")}
              className="text-blue-600 underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            New user?{" "}
            <span
              onClick={() => setMode("signup")}
              className="text-blue-600 underline cursor-pointer"
            >
              Create account
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;