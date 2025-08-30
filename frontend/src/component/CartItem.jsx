import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../slices/CartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();
  console.log("CartItem props:", item);
  

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        

        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-500">Rs {item.price}</p>
        </div>
      </div>
      <button
        onClick={() => dispatch(removeFromCart(item._id))}
        className="bg-red-500 text-white py-1 px-3 rounded-md"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
