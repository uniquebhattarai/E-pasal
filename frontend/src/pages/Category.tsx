import React, { useEffect, useState } from "react";
import { ApiConnector } from "../services/ApiConnector";
import { categories } from "../services/Api";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Tag, RefreshCw } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Category as CategoryType } from "../types";

// ── Skeleton card ──────────────────────────────────────────────
function CategorySkeleton() {
  return (
    <div className="bg-white dark:bg-[#202020] rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-[#2e2e2e]">
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
  const [list, setList] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    <div className="min-h-screen bg-white dark:bg-[#171717] px-4 pt-6 pb-24 md:py-8 transition-colors duration-200">
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
                className="bg-white dark:bg-[#202020] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 dark:border-[#2e2e2e] cursor-pointer"
              >
                {/* Image */}
                <div className="h-32 sm:h-36 w-full bg-gray-50 dark:bg-[#141414] overflow-hidden relative flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-[#262626] dark:to-[#1a1a1a]">
                      <Tag className="w-8 h-8 text-primary opacity-60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-3 sm:p-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-[#64748b] group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-gray-500 dark:text-[#94a3b8] text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center px-4 py-10 sm:py-16">
              <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center -my-2 shrink-0">
                <DotLottieReact src="/no-data.lottie" loop autoplay />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                No categories found
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-[#94a3b8] max-w-sm mb-4 leading-relaxed">
                Backend is hosted on Render free tier and may take 30–50s to wake up on first load.
              </p>
              <button
                type="button"
                onClick={fetchCategory}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
