import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useCategories } from "../hooks/useCategories";

export default function CategoryMenu() {
  const { backendUrl } = useContext(AppContext);
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <section className="flex flex-col items-center gap-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Explore Our Aluminium Categories
        </h1>
        <p className="text-sm text-gray-500">Loading categories...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center gap-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Explore Our Aluminium Categories
        </h1>
        <p className="text-sm text-red-500">Failed to load categories.</p>
      </section>
    );
  }

  return (
    <section id="categories" className="flex flex-col items-center gap-6 py-16">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center">
        Explore Our Aluminium Categories
      </h1>
      <p className="w-11/12 sm:w-2/3 md:w-1/2 text-center text-sm sm:text-base">
        Browse NAVYANTA’s certified fabrication categories and start your project with confidence.
      </p>

      <div className="flex gap-4 sm:gap-6 lg:gap-10 pt-10 w-full overflow-x-auto scrollbar-hide justify-start sm:justify-center snap-x snap-mandatory scroll-smooth px-4">
        {categories.map((cat, index) => (
          <Link
            to="/services"
            state={{ category: cat }} // ✅ pass category object to Services page
            key={cat._id}
            style={{ animationDelay: `${index * 0.15}s` }}
            className="flex flex-col items-center justify-center w-32 h-44 sm:w-44 sm:h-60 md:w-56 md:h-72 lg:w-64 lg:h-80 flex-shrink-0 snap-center rounded-lg bg-white/5 border border-white/10 transform transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:bg-white/10 hover:border-white/30 animate-fadeIn"
          >
            <img
              src={
                cat.image?.startsWith("/uploads")
                  ? `${backendUrl}${cat.image}`
                  : cat.image
              }
              alt={cat.name}
              className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain mb-4"
            />
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-center">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}