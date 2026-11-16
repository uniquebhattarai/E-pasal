import React, { useState, useEffect } from "react";
import { products } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../services/cartService";
import { getWishlist, toggleWishlistItem } from "../services/wishlistService";
import { resetWishlist } from "../slices/WishlistSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star, RefreshCw } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// ── Skeleton card ──────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-[#202020] rounded-xl shadow-sm border border-gray-100 dark:border-[#2e2e2e] overflow-hidden flex flex-col justify-between">
      {/* image placeholder */}
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="p-3.5 space-y-2.5">
        {/* title */}
        <div className="skeleton h-4 w-3/4 rounded" />
        {/* description lines */}
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        {/* rating row */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="skeleton h-3 w-3 rounded-full" />
          <div className="skeleton h-3 w-12 rounded" />
        </div>
        {/* price */}
        <div className="skeleton h-5 w-20 rounded mt-1" />
        {/* button */}
        <div className="skeleton h-8 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function Home() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { wishlistIds } = useSelector((state) => state.wishlist);

  const fetchProduct = async (silent = false) => {
    if (!silent) {
      setIsRetrying(true);
    }
    try {
      const result = await ApiConnector("GET", products.PRODUCTS_API);
      if (result?.data?.success && Array.isArray(result?.data?.products)) {
        setList(result.data.products);
      }
    } catch (error) {
      console.log("Could not fetch products", error);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    if (token) {
      getWishlist(dispatch);
    } else {
      dispatch(resetWishlist());
    }
  }, [token, dispatch]);

  // Detect slow loading (Render cold start)
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setIsSlowLoading(true);
      }, 2500);
    } else {
      setIsSlowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Auto-retry polling every 8s if backend is still spinning up on Render
  useEffect(() => {
    let retryTimer;
    if (!loading && list.length === 0) {
      retryTimer = setTimeout(() => {
        fetchProduct(true);
      }, 8000);
    }
    return () => clearTimeout(retryTimer);
  }, [loading, list.length]);

  const handleToggleWishlist = (item) => {
    toggleWishlistItem(item, dispatch, token, () => {
      navigate("/login");
    });
  };

  const handleAddToCart = (item) => {
    addItemToCart(item, dispatch, token, () => {
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#171717] px-4 pt-6 pb-24 md:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Render Free Tier Warmup Notification during loading */}
        {isSlowLoading && (
          <div className="mb-4 sm:mb-5 p-3 rounded-xl bg-blue-50/90 dark:bg-[#1c2230] border border-blue-200/80 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 flex items-center gap-2.5 text-xs sm:text-sm animate-fadeIn">
            <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-primary" />
            <p className="leading-relaxed">
              <span className="font-semibold">Waking up backend server...</span> Hosted on Render free tier, the initial cold start takes approximately 30–50s.
            </p>
          </div>
        )}

        {/* Grid: 1 in a row on mobile, 2 in a row on tab view, 4 on desktop */}
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading ? (
            // Show 8 skeleton cards while loading
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-[#202020] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 dark:border-[#2e2e2e] flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 w-full bg-gray-50 dark:bg-[#141414] overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-[#262626] dark:to-[#1a1a1a]">
                      <span className="text-3xl font-bold text-primary">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => handleToggleWishlist(item)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 dark:bg-[#202020]/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title={Boolean(token) && wishlistIds.includes(item._id) ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${Boolean(token) && wishlistIds.includes(item._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-400"
                        }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1 text-xs sm:text-sm group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 dark:text-[#94a3b8] text-[11px] sm:text-xs mb-2 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-[#cbd5e1]">
                      {item.rating || "4.5"}
                    </span>
                    <span className="text-gray-400 dark:text-[#64748b] text-[10px] sm:text-[11px]">(120)</span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto pt-1 mb-2.5 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-primary dark:text-white">Rs</span>
                    <span className="text-sm sm:text-base font-bold text-primary dark:text-white tracking-tight">
                      {item.price}
                    </span>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-primary hover:opacity-95 active:scale-[0.98] text-white py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            /* Render Free Tier Warmup & Empty State with Lottie */
            <div className="col-span-full flex flex-col items-center justify-center text-center px-4 py-10 sm:py-16">
              <div className="w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center -my-3 shrink-0">
                <DotLottieReact
                  src="/no-data.lottie"
                  loop
                  autoplay
                />
              </div>

              <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                Server is waking up...
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-[#94a3b8] max-w-md mb-2 leading-relaxed">
                The backend is deployed on Render's free tier. After a period of inactivity, the server spins down and may take <span className="font-semibold text-gray-900 dark:text-white">30–50 seconds</span> to restart.
              </p>

              <p className="text-xs text-gray-500 dark:text-[#64748b] max-w-md mb-6 leading-relaxed">
                Thank you for your patience! Products will load automatically once the server is awake.
              </p>

              <button
                type="button"
                onClick={() => fetchProduct(false)}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                {isRetrying ? "Connecting to server..." : "Retry Connection"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;