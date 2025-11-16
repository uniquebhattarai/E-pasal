import React, { useState, useEffect } from "react";
import { products } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/CartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

function Home() {
  const [list, setList] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  const fetchProduct = async () => {
    try {
      const result = await ApiConnector("GET", products.PRODUCTS_API);
      if (result.data.success) {
        setList(result.data.products);
      } else {
        console.log("Failed to fetch products:", result.message);
      }
    } catch (error) {
      console.log("Could not fetch product", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
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
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <span className="text-4xl font-bold text-green-600">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(item._id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlist.has(item._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {item.rating || "4.5"}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      (120 reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-2xl font-bold text-green-600">
                    Rs {item.price}
                  </p>

                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10 text-lg">
              No products found.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Home;
 