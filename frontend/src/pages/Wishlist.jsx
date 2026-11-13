import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Trash2 } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getWishlist, removeWishlistItem } from "../services/wishlistService";
import { addToCart } from "../slices/CartSlice";
import { openAuthModal } from "../slices/AuthSlice";
import { Button } from "../component/common";

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      getWishlist(dispatch);
    }
  }, [token, dispatch]);

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const handleRemove = (productId) => {
    removeWishlistItem(productId, dispatch);
  };

  if (!token) {
    return (
      <div className="w-full max-w-[1000px] mx-auto pb-12">
        {/* Mobile Fixed/Sticky Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
            Wishlist
          </h1>
          <div className="w-8" aria-hidden="true" />
        </header>

        <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center -my-2 shrink-0">
            <DotLottieReact
              src="/no-data.lottie"
              loop
              autoplay
            />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Login to view your wishlist
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-5">
            Please log in to your account to view and manage your saved items.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      {/* Mobile Fixed/Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/dashboard/account")}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
          Wishlist
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      <div className="px-3.5 sm:px-6 md:px-0 py-3 sm:py-5 md:py-0 space-y-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            My Wishlist
          </h1>
          <span className="text-xs text-gray-500 font-medium">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-3 space-y-3 shadow-2xs"
              >
                <div className="skeleton h-36 w-full rounded-lg" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12">
            <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center -my-2 shrink-0">
              <DotLottieReact
                src="/no-data.lottie"
                loop
                autoplay
              />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-5">
              Explore our products and tap the heart icon on any product to save
              it to your wishlist!
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => navigate("/")}
            >
              Explore Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Product Image & Remove Button */}
                <div className="relative h-40 w-full bg-gray-50 overflow-hidden flex items-center justify-center p-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                      <span className="text-3xl font-bold text-primary">
                        {item.name?.charAt(0) || "P"}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-2xs hover:bg-rose-50 hover:text-rose-500 text-gray-400 transition cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Price</span>
                      <span className="text-xs sm:text-sm font-bold text-primary">
                        Rs {item.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center gap-1.5 bg-gradient-primary text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-2xs hover:opacity-95 active:scale-95 transition cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

