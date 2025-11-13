import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const AllServices = () => {
  const { services, getAllServices, aToken, backendUrl, deleteService } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllServices();
  }, [aToken]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Services</h2>

      {services.length === 0 ? (
        <p className="text-gray-500">No services found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* Image */}
              <img
                src={`${backendUrl}${service.image}`} // ✅ clean and reliable
                alt={service.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              {/* Info */}
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-500">
                {service.categoryRef?.name || "No category"}
              </p>

              <p className="mt-2 font-medium text-indigo-600">
                {service.pricingOptions?.[0]?.amount}{" "}
                {service.pricingOptions?.[0]?.currency} /{" "}
                {service.pricingOptions?.[0]?.unit}
              </p>

              {/* Actions */}
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  onClick={() => deleteService(service._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                >
                  Delete
                </button>
                <button
                  className={`flex-1 ${
                    service.isActive
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white py-1 px-3 rounded-md text-sm`}
                >
                  {service.isActive ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllServices;