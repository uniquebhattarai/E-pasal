import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiConnector } from "../services/ApiConnector";
import { categoryproducts } from "../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/CartSlice";
import { toast } from "react-hot-toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";

// ── Skeleton card ──────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="p-3.5 space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-5 w-20 rounded mt-1" />
        <div className="skeleton h-8 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

// ── Header skeleton ─────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div className="text-center mb-8 space-y-2">
      <div className="skeleton h-7 w-48 rounded-lg mx-auto" />
      <div className="skeleton h-3.5 w-72 rounded-md mx-auto" />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const fetchCategoryDetails = async () => {
    try {
      const result = await ApiConnector(
        "GET",
        `${categoryproducts.PRODUCTS_API}/${id}`
      );
      setCategory(result.data.data.selectedCategory);
    } catch (error) {
      console.log("Could not fetch category details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const handleAddToCart = (product) => {
    if (!token) {
      toast.error("You need to login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(product));
  };

  return (
    <div className="min-h-screen bg-white px-4 pt-6 pb-24 md:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/category")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Categories
        </button>

        {/* Header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
          category && (
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{category.name}</h1>
              <p className="text-gray-500 mt-1.5 text-xs sm:text-sm max-w-lg mx-auto">{category.description}</p>
            </div>
          )
        )}

        {/* Products grid: 1 in a row on mobile, 2 in a row on tab view, 4 on desktop */}
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : category?.products?.length > 0 ? (
            category.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="h-40 sm:h-44 w-full bg-gray-50 overflow-hidden relative flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <span className="text-3xl font-bold text-green-500">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-2 line-clamp-2 leading-relaxed font-normal">
                    {product.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-auto pt-1 mb-2.5 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-emerald-700">Rs</span>
                    <span className="text-sm sm:text-base font-bold text-emerald-600 tracking-tight">
                      {product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No products in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;
