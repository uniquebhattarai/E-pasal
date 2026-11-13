import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiConnector } from "../services/ApiConnector";
import { categoryproducts } from "../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../services/cartService";
import { getWishlist, toggleWishlistItem } from "../services/wishlistService";
import { resetWishlist } from "../slices/WishlistSlice";
import { toast } from "react-hot-toast";
import { ShoppingCart, Heart, ChevronLeft } from "lucide-react";

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
    <div className="mb-4 sm:mb-5 space-y-1.5 text-left">
      <div className="skeleton h-6 w-36 rounded-md" />
      <div className="skeleton h-3.5 w-64 rounded-md" />
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
  const { wishlistIds } = useSelector((state) => state.wishlist);

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
    if (token) {
      getWishlist(dispatch);
    } else {
      dispatch(resetWishlist());
    }
  }, [id, token, dispatch]);

  const handleToggleWishlist = (product) => {
    toggleWishlistItem(product, dispatch, token, () => {
      navigate("/login");
    });
  };

  const handleAddToCart = (product) => {
    addItemToCart(product, dispatch, token, () => {
      navigate("/login");
    });
  };

  return (
    <div className="bg-white min-h-[calc(100dvh-4rem)] md:min-h-0 pb-24 md:pt-4 md:pb-6">
      {/* Mobile Fixed/Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/category")}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
          aria-label="Back to Categories"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight truncate px-2">
          {category?.name || ""}
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-3.5 sm:pt-4 md:pt-0">
        {/* Desktop Header */}
        <div className="hidden md:block">
          {loading ? (
            <HeaderSkeleton />
          ) : (
            category && (
              <div className="mb-4 sm:mb-5 text-left">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-gray-500 mt-0.5 text-xs sm:text-[13px] max-w-2xl">
                    {category.description}
                  </p>
                )}
              </div>
            )
          )}
        </div>

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
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <span className="text-3xl font-bold text-primary">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title={Boolean(token) && wishlistIds.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        Boolean(token) && wishlistIds.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-xs sm:text-sm group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-2 line-clamp-2 leading-relaxed font-normal">
                    {product.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-auto pt-1 mb-2.5 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-primary">Rs</span>
                    <span className="text-sm sm:text-base font-bold text-primary tracking-tight">
                      {product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-primary hover:opacity-95 active:scale-[0.98] text-white py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
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
