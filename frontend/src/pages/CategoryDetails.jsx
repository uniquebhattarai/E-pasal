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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-3.5 w-full rounded-md" />
        <div className="skeleton h-3.5 w-5/6 rounded-md" />
        <div className="skeleton h-5 w-24 rounded-md" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ── Header skeleton ─────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <div className="text-center mb-10 space-y-3">
      <div className="skeleton h-8 w-48 rounded-lg mx-auto" />
      <div className="skeleton h-4 w-72 rounded-md mx-auto" />
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
  const { token } = useSelector((state) => state.auth);

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
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10">
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
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
              <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">{category.description}</p>
            </div>
          )
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : category?.products?.length > 0 ? (
            category.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Image */}
                <div className="h-44 w-full bg-gray-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <span className="text-4xl font-bold text-green-500">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 text-base">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-emerald-600 mb-3">
                    Rs {product.price}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
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
              <p className="text-lg font-medium">No products in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDetails;
