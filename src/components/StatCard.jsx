import React from "react";

const StatCard = ({ title, value, icon: Icon, color = "text-primary" }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition-transform">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full bg-gray-800 ${color}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;