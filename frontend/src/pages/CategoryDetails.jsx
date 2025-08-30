import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiConnector } from "../services/ApiConnector";
import { categoryproducts } from "../services/Api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/CartSlice"; // your slice
import { toast } from "react-hot-toast";

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
      setLoading(false);
    } catch (error) {
      console.log("Could not fetch category details", error);
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

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      {category && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center text-green-600">{category.name}</h1>
          <p className="text-gray-700 text-center mb-6">{category.description}</p>

          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <div className="h-40 w-full bg-gray-100 rounded-md flex items-center justify-center mb-4 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 text-lg">
                        {product.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                  <p className="text-green-600 font-bold mt-2">Rs {product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-colors"
                    
                  >
                     Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products available in this category yet.</p>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryDetails;
