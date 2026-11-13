import React, { useState, useEffect } from "react";
import { products } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../services/cartService";
import { getWishlist, toggleWishlistItem } from "../services/wishlistService";
import { resetWishlist } from "../slices/WishlistSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

// ── Skeleton card ──────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { wishlistIds } = useSelector((state) => state.wishlist);

  const fetchProduct = async () => {
    try {
      const result = await ApiConnector("GET", products.PRODUCTS_API);
      if (result.data.success) {
        setList(result.data.products);
      }
    } catch (error) {
      console.log("Could not fetch products", error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-white px-4 pt-6 pb-24 md:py-8">
      <div className="max-w-7xl mx-auto">
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
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-100 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-44 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                      <span className="text-3xl font-bold text-primary">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => handleToggleWishlist(item)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title={Boolean(token) && wishlistIds.includes(item._id) ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        Boolean(token) && wishlistIds.includes(item._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-xs sm:text-sm group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-[11px] sm:text-xs mb-2 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2 text-xs">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-700">
                      {item.rating || "4.5"}
                    </span>
                    <span className="text-gray-400 text-[10px] sm:text-[11px]">(120)</span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto pt-1 mb-2.5 flex items-baseline gap-1">
                    <span className="text-xs font-semibold text-primary">Rs</span>
                    <span className="text-sm sm:text-base font-bold text-primary tracking-tight">
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
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;