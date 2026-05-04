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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/category/${item._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer"
              >
                {/* Image */}
                <div className="h-36 w-full bg-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <Tag className="w-10 h-10 text-green-500 opacity-60" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-base group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No categories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
