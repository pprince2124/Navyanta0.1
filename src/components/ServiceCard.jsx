import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ServiceCard({ service }) {
  const {
    _id,
    name,
    slug,
    image,
    shortDescription,
    categoryRef,
    hasPricing,
    pricingOptions = [],
  } = service;

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  const primaryPrice =
    hasPricing && pricingOptions.length ? pricingOptions[0] : null;

  // Build full image URL
  const backendUrlEnv = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = image ? `${backendUrlEnv}${image}` : null;

  // Direct booking handler (prototype)
  const handleBookProject = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/projects/book",
        {
          serviceRef: _id,
          projectDate: new Date().toISOString().split("T")[0], // placeholder date
          slotTime: "10:00", // placeholder slot
          directPurchase: true,
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Project request created");
        navigate("/my-projects");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to book project");
    }
  };

  return (
    <div className="group rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {categoryRef?.name && (
          <span className="absolute left-2 top-2 rounded bg-white/80 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur">
            {categoryRef.name}
          </span>
        )}
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
          {name}
        </h3>
        {shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {shortDescription}
          </p>
        )}
        {primaryPrice && (
          <p className="mt-2 text-sm font-medium text-gray-900">
            {primaryPrice.currency || "INR"} {primaryPrice.amount}{" "}
            <span className="text-xs text-gray-500">{primaryPrice.unit}</span>
          </p>
        )}

        {/* Book Project button */}
        <button
          onClick={handleBookProject}
          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md bg-black text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Book Project
        </button>
      </div>
    </div>
  );
}