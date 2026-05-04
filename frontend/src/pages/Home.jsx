import React, { useState, useEffect } from "react";
import { products } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/CartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

// ── Skeleton card ──────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* image placeholder */}
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        {/* title */}
        <div className="skeleton h-5 w-3/4 rounded-md" />
        {/* description lines */}
        <div className="skeleton h-3.5 w-full rounded-md" />
        <div className="skeleton h-3.5 w-5/6 rounded-md" />
        {/* rating row */}
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-4 rounded-full" />
          <div className="skeleton h-3.5 w-16 rounded-md" />
        </div>
        {/* price */}
        <div className="skeleton h-6 w-24 rounded-md" />
        {/* button */}
        <div className="skeleton h-11 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
function Home() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

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
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddToCart = (item) => {
    if (!token) {
      toast.error("You need to login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {loading ? (
            // Show 8 skeleton cards while loading
            Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <span className="text-5xl font-bold text-green-600">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(item._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        wishlist.has(item._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 text-base">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {item.rating || "4.5"}
                    </span>
                    <span className="text-xs text-gray-400">(120)</span>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-bold text-emerald-600 mb-3">
                    Rs {item.price}
                  </p>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow hover:shadow-lg active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;