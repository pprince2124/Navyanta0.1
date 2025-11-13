import React, { useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, projects, cancelProject, getAllProjects } = useContext(AdminContext);
  const { backendUrl, formatCurrency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllProjects();
    }
  }, [aToken]);

  // Approve visit
  const approveVisit = async (projectId) => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/projects/approve-visit`,
        { projectId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      toast.success("Visit approved successfully");
      getAllProjects();
    } catch (err) {
      console.error("Approve visit error:", err.response?.data || err.message);
      toast.error("Failed to approve visit");
    }
  };

  // Share quotation file
  const shareQuotationFile = async (projectId, file) => {
    try {
      if (!file) {
        toast.warning("Please select a PDF file");
        return;
      }
      const formData = new FormData();
      formData.append("quotationFile", file);
      formData.append("projectId", projectId);

      await axios.post(
        `${backendUrl}/api/admin/projects/share-quotation-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      toast.success("Quotation shared successfully");
      getAllProjects();
    } catch (err) {
      console.error("Share quotation error:", err.response?.data || err.message);
      toast.error("Failed to share quotation");
    }
  };

  // Confirm advance payment
  const confirmPayment = async (projectId) => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/projects/confirm-payment`,
        { projectId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      toast.success("Advance payment confirmed");
      getAllProjects();
    } catch (err) {
      console.error("Confirm payment error:", err.response?.data || err.message);
      toast.error("Failed to confirm payment");
    }
  };

  // Confirm final payment
  const confirmFinalPayment = async (projectId) => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/projects/confirm-final-payment`,
        { projectId },
        { headers: { Authorization: `Bearer ${aToken}` } }
      );
      toast.success("Final payment confirmed. Project marked as completed");
      getAllProjects();
    } catch (err) {
      console.error("Confirm final payment error:", err.response?.data || err.message);
      toast.error("Failed to confirm final payment");
    }
  };

  return (
    <div className="w-full max-w-6xl m-5 text-white">
      <p className="mb-3 text-lg font-semibold">All Projects</p>

      <div className="bg-gray-900 border border-gray-700 rounded text-sm max-h-[80vh] overflow-y-scroll">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr_1fr_2fr] py-3 px-6 border-b border-gray-700 sticky top-0 bg-gray-800 text-gray-300">
          <p>#</p>
          <p>Customer</p>
          <p>Service</p>
          <p>Date & Time</p>
          <p>Address / Contact</p>
          <p>Amount</p>
          <p>Status / Action</p>
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No projects found.</p>
        ) : (
          projects.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_2fr_1fr_2fr] items-center text-gray-300 py-3 px-6 border-b border-gray-700 hover:bg-gray-800 transition-colors"
            >
              {/* Index */}
              <p className="max-sm:hidden">{index + 1}</p>

              {/* Customer */}
              <div className="flex items-center gap-2">
                <img
                  src={item.customerRef?.image}
                  className="w-8 h-8 rounded-full object-cover bg-gray-700"
                  alt={item.customerRef?.name}
                />
                <p>{item.customerRef?.name}</p>
              </div>

              {/* Service */}
              <p>{item.serviceRef?.name}</p>

              {/* Date & Time */}
              <p>
                {item.projectDate}, {item.slotTime}
              </p>

              {/* Address / Contact */}
              <div>
                <p>{item.address}</p>
                <p className="text-xs text-gray-400">{item.contactNo}</p>
              </div>

              {/* Amount */}
              <p>
                {item.quotation?.amount
                  ? formatCurrency(item.quotation.amount)
                  : "-"}
              </p>

              {/* Status / Action */}
              <div className="flex flex-col gap-2">
                {item.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.status === "completed" ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : item.status === "quotation_shared" ? (
                  <p className="text-purple-400 text-xs font-medium">Quotation Shared</p>
                ) : item.status === "quotation_accepted" ? (
                  <>
                    <p className="text-blue-400 text-xs font-medium">Quotation Accepted</p>
                    {!item.advancePaid && (
                      <button
                        onClick={() => confirmPayment(item._id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Mark Payment Accepted
                      </button>
                    )}
                  </>
                ) : item.status === "advance_paid" ? (
                  <>
                    <p className="text-green-400 text-xs font-medium">Advance Paid</p>
                    {!item.paymentCompleted && (
                      <button
                        onClick={() => confirmFinalPayment(item._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Mark Final Payment Received
                      </button>
                    )}
                  </>
                ) : item.status === "scheduled" ? (
                  <p className="text-orange-400 text-xs font-medium">Scheduled</p>
                ) : (
                  <>
                    {/* Approve Visit */}
                    {!item.visitApproved && (
                      <button
                        onClick={() => approveVisit(item._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                      >
                        Approve Visit
                      </button>
                    )}

                    {/* Upload Quotation PDF */}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => shareQuotationFile(item._id, e.target.files[0])}
                      className="text-xs text-gray-400"
                    />

                    {/* View Quotation PDF */}
                    {item.quotationFile && (
                      <a
                        href={`${backendUrl}${item.quotationFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs underline"
                      >
                        View Quotation PDF
                      </a>
                    )}

                    {/* Cancel Project */}
                    <img
                      onClick={() => cancelProject(item._id)}
                      className="w-6 cursor-pointer hover:opacity-80"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllAppointments;