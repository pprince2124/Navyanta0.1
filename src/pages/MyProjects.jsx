import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProjects = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const prevStatuses = useRef({}); // track previous statuses

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1])] +
      " " +
      dateArray[2]
    );
  };

  // Fetch user projects
  const getUserProjects = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newProjects = data.projects.reverse();

      // Compare with previous statuses for toast notifications
      newProjects.forEach((proj) => {
        const prevStatus = prevStatuses.current[proj._id];
        if (proj.status === "advance_paid" && prevStatus !== "advance_paid") {
          toast.success("Advance payment confirmed — materials are being assembled");
        }
        if (proj.status === "scheduled" && prevStatus !== "scheduled") {
          toast.info("Your project has been scheduled");
        }
        if (proj.status === "completed" && prevStatus !== "completed") {
          toast.success("Final payment confirmed — project completed!");
        }
        // update ref
        prevStatuses.current[proj._id] = proj.status;
      });

      setProjects(newProjects);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Cancel project
  const cancelProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to cancel this project?")) return;
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/projects/cancel",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Accept quotation
  const acceptQuotation = async (projectId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/projects/accept-quotation",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Complete project (final payment) — optional if you keep Stripe
  const completeProjectStripe = async (projectId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/projects/complete",
        { projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserProjects();
    }
  }, [token]);

  // Status color mapping
  const statusColors = {
    requested: "text-gray-500 border-gray-500",
    quotation_shared: "text-purple-500 border-purple-500",
    quotation_accepted: "text-blue-500 border-blue-500",
    advance_paid: "text-green-500 border-green-500",   // ✅ new stage
    scheduled: "text-orange-500 border-orange-500",
    in_progress: "text-yellow-500 border-yellow-500",
    completed: "text-green-600 border-green-600",      // ✅ final stage
    cancelled: "text-red-500 border-red-500",
  };

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My Projects
      </p>
      <div>
        {projects.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            {/* Service Image */}
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={
                  item.serviceRef?.image
                    ? `${backendUrl}${item.serviceRef.image}`
                    : assets.placeholder
                }
                alt={item.serviceRef?.name}
              />
            </div>

            {/* Service Details */}
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.serviceRef?.name}
              </p>
              <p>{item.serviceRef?.categoryRef?.name}</p>
              <p className="mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.projectDate)} | {item.slotTime}
              </p>

              {/* Quotation Details */}
              {item.quotationFile && (
                <div className="mt-2 text-sm space-y-1">
                  <p>
                    <strong>Quotation File:</strong>{" "}
                    <a
                      href={`${backendUrl}${item.quotationFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View PDF
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {/* Status badge */}
              <button
                className={`sm:min-w-48 py-2 border rounded ${statusColors[item.status]}`}
              >
                {item.status.replace("_", " ").toUpperCase()}
              </button>

              {/* Accept Quotation */}
              {item.status === "quotation_shared" && !item.quotationAccepted && (
                <button
                  onClick={() => acceptQuotation(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  Accept Quotation
                </button>
              )}

              {/* Advance Paid confirmation */}
              {item.status === "advance_paid" && (
                <p className="text-green-600 text-xs font-medium">
                  Advance Payment Confirmed — Materials are being assembled
                </p>
              )}

              {/* Completed confirmation */}
              {item.status === "completed" && (
                <p className="text-green-700 text-xs font-medium">
                  Final Payment Confirmed — Project Completed
                </p>
              )}

              {/* Pay Final (if you keep Stripe for final payment) */}
              {item.status === "in_progress" && !item.paymentCompleted && (
                <button
                  onClick={() => completeProjectStripe(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
                >
                  <img
                    className="max-w-20 max-h-5"
                    src={assets.stripe_logo}
                    alt="Stripe"
                  />
                  Pay Final
                </button>
              )}

              {/* Cancel option */}
              {item.status !== "completed" && item.status !== "cancelled" && (
                <button
                  onClick={() => cancelProject(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Project
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProjects;