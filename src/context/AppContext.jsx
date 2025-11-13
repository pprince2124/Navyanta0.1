import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  // Environment variables
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Month labels for date formatting
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // Format slot/project date
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    if (slotDate.includes("_")) {
      const [day, month, year] = slotDate.split("_");
      return `${day} ${months[Number(month) - 1]} ${year}`;
    }
    return new Date(slotDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format currency consistently
  const formatCurrency = (amount) => {
    if (amount == null) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency === "₹" ? "INR" : currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // --- NEW Utilities ---

  // Status color mapping for badges
  const statusColors = {
    SENT: "warning",
    DELIVERED: "success",
    FAILED: "error",
    APPROVED: "info",
    COMPLETED: "success",
    CANCELLED: "error",
  };

  // Empty state message generator
  const emptyStateMessage = (entity) => `No ${entity} found.`;

  // Toast wrappers
  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  // DateTime formatter
  const formatDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
    formatCurrency,

    // NEW
    statusColors,
    emptyStateMessage,
    notifySuccess,
    notifyError,
    formatDateTime,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;