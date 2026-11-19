import React from "react";
import { removeItemFromCart } from "../services/cartService";
import { Trash2 } from "lucide-react";
import { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";

export interface CartItemProps {
  item: Product;
}

function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  return (
    <div className="flex items-center justify-between p-3 sm:p-3.5 bg-white dark:bg-[#202020] rounded-xl border border-gray-100 dark:border-[#2e2e2e] shadow-sm hover:shadow transition-all">
      <div className="flex items-center space-x-3 sm:space-x-3.5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain p-1 rounded-lg bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#2e2e2e]"
          />
        ) : (
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-blue-50 dark:bg-[#282828] text-primary flex items-center justify-center font-bold text-base">
            {item.name?.charAt(0) || "P"}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs font-bold text-primary dark:text-white mt-0.5">
            Rs {item.price}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => removeItemFromCart(item._id, dispatch, token)}
        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition font-medium cursor-pointer"
        aria-label="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    </div>
  );
}

export default CartItem;
