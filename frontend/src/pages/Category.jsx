import React, { useEffect, useState } from "react";
import { ApiConnector } from "../services/ApiConnector";
import { categories } from "../services/Api";
import { useNavigate } from "react-router-dom";

function Category() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const result = await ApiConnector("GET", categories.CATEGORIES_API);
      setList(result.data.data);
    } catch (error) {
      console.log("Could not fetch Category");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/category/${item._id}`)} 
            className="bg-green-50 text-green-600 text-center rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="h-32 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center">
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
            <p className="text-gray-700 text-sm mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
