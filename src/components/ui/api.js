// src/lib/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api", 
  // e.g. http://localhost:4000/api
});