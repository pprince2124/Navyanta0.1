import React, { useEffect, useState, useContext } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useServices } from "../hooks/useServices";
import ServiceCardSkeleton from "../components/ui/ServiceCardSkeleton";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
// import assets from "../assets";

const Services = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AppContext);

  // Initial category from router state or query string
  const initialCategoryId =
    location.state?.categoryId || searchParams.get("categoryId") || null;

  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

  // Booking state
  const [bookingService, setBookingService] = useState(null);
  const [projectDate, setProjectDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [directPurchase, setDirectPurchase] = useState(false);

  // Always required details
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");

  // Fetch categories
  const { data: categories, isLoading: catLoading } = useCategories();

  // Fetch services filtered by category
  const { data, isLoading, isError } = useServices({
    categoryId: selectedCategoryId,
  });

  const items = data?.items || [];

  // Auto‑select first category if none chosen
  useEffect(() => {
    if (!selectedCategoryId && categories?.length > 0) {
      const firstId = categories[0]._id;
      setSelectedCategoryId(firstId);
      setSearchParams({ categoryId: firstId });
    }
  }, [categories, selectedCategoryId, setSearchParams]);

  // Handle booking submit
  const handleBookProject = async (e) => {
    e.preventDefault();
    if (!bookingService) {
      toast.error("No service selected");
      return;
    }
    try {
      const payload = {
        serviceRef: bookingService._id,
        projectDate,
        slotTime,
        address,
        contactNo,
        directPurchase,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/user/projects/book`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed header
      );

      if (data.success) {
        toast.success("Project request created");
        setBookingService(null);
        setProjectDate("");
        setSlotTime("");
        setDirectPurchase(false);
        setAddress("");
        setContactNo("");
        navigate("/my-projects");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r pr-4">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        {catLoading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-2">
            {categories?.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat._id);
                    setSearchParams({ categoryId: cat._id });
                  }}
                  aria-current={selectedCategoryId === cat._id ? "true" : undefined}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategoryId === cat._id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main panel */}
      <main className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {categories?.find((c) => c._id === selectedCategoryId)?.name ||
              "Select a Category"}
          </h1>
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            Failed to load services. Please try again.
          </div>
        )}

        {!isLoading && !isError && selectedCategoryId && (
          <>
            {items.length === 0 ? (
              <div className="rounded-md border bg-gray-50 p-8 text-center text-gray-600">
                No services found for this category.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((service) => (
                  <div
                    key={service._id}
                    className="group rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-md bg-gray-50">
                      {service.image ? (
                        <img
                          src={`${backendUrl}${service.image}`} // ✅ use backendUrl
                          alt={service.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {service.shortDescription}
                      </p>
                      <button
                        onClick={() => setBookingService(service)}
                        className="mt-3 w-full rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        Book Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

       
        {/* Inline booking modal/form */}
       
                 {/* Inline booking modal/form */}
        {bookingService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Book Project: {bookingService.name}
              </h2>
              <form onSubmit={handleBookProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Date</label>
                  <input
                    type="date"
                    value={projectDate}
                    onChange={(e) => setProjectDate(e.target.value)}
                    required
                    className="mt-1 w-full rounded border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Time</label>
                  <input
                    type="time"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                    required
                    className="mt-1 w-full rounded border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="mt-1 w-full rounded border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    required
                    className="mt-1 w-full rounded border-gray-300 text-gray-900"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="directPurchase"
                    type="checkbox"
                    checked={directPurchase}
                    onChange={(e) => setDirectPurchase(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="directPurchase" className="ml-2 text-sm text-gray-900">
                    Direct Purchase (skip quotation)
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setBookingService(null)}
                    className="rounded-md border px-4 py-2 text-sm text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Services;