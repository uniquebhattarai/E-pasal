import React, { useState, useEffect } from "react";
import { products } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/CartSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const { token } = useSelector((state) => state.auth);
   const { cart } = useSelector((state) => state.cart); 

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

  const handleAddToCart = (item) => {
    console.log("Clicked Add to Cart for:", item.name);
    if (!token) {
      toast.error("You need to login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.length > 0 ? (
          list.map((item) => (
            <div
              key={item._id}
              className="bg-green-50 text-gray-700 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-40 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <span className="text-gray-500 text-lg">{item.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              <p className="text-yellow-600 font-bold mt-2">Rs {item.price}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-colors"

              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
