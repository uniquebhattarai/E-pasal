import React, { useEffect, useState } from "react";
import { ApiConnector } from "../services/ApiConnector";
import { categories } from "../services/Api";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Tag } from "lucide-react";

// ── Skeleton card ──────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="skeleton h-36 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-5 w-2/3 rounded-md" />
        <div className="skeleton h-3.5 w-full rounded-md" />
        <div className="skeleton h-3.5 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function Category() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const result = await ApiConnector("GET", categories.CATEGORIES_API);
      setList(result.data.data);
    } catch (error) {
      console.log("Could not fetch Category", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 pt-6 pb-24 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Grid: 1 in a row on mobile, 2 in a row on tab view, 4 on desktop */}
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/category/${item._id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 cursor-pointer"
              >
                {/* Image */}
                <div className="h-32 sm:h-36 w-full bg-gray-50 overflow-hidden relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <Tag className="w-8 h-8 text-green-500 opacity-60" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-3 sm:p-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-gray-500 text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-400">
              <p className="text-sm font-medium">No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
