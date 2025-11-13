const StatCard = ({ bg, icon, value, label, textColor = "text-white" }) => {
  return (
    <div
      className={`w-40 p-4 rounded-xl shadow-lg animate-float ${bg} ${textColor} flex flex-col items-center`}
    >
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  )
}