import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart } from "../services/cartService";
import { Trash2 } from "lucide-react";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="flex items-center justify-between p-3 sm:p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center space-x-3 sm:space-x-3.5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain p-1 rounded-lg bg-gray-50 border border-gray-100"
          />
        ) : (
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold text-base">
            {item.name?.charAt(0) || "P"}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs font-bold text-primary mt-0.5">
            Rs {item.price}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => removeItemFromCart(item._id, dispatch, token)}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer"
        aria-label="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    </div>
  );
}

export default CartItem;
