import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopServices = () => {
  const navigate = useNavigate();
  const { services, loading, backendUrl } = useContext(AppContext);

  if (loading) return <p>Loading...</p>;

  // ✅ Safely slice the first 10 services
  const top = Array.isArray(services) ? services.slice(0, 10) : [];

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h1 className="text-3xl font-medium">Top Services to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted aluminium services.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 px-3 sm:px-0">
        {top.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              // ✅ Pass categoryId instead of slug
              navigate("/services", { state: { categoryId: item.categoryRef?._id } });
              scrollTo(0, 0);
            }}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img
              className="bg-[#EAEFFF] w-full h-40 object-cover"
              src={`${backendUrl}${item.image}`}
              alt={item.name}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <p className="w-2 h-2 rounded-full bg-green-500"></p>
                <p>Certified</p>
              </div>
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">
                {item.categoryRef?.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/services");
          scrollTo(0, 0);
        }}
        aria-label="View all services"
        className="bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  );
};

export default TopServices;