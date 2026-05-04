import React from "react";
import { useSelector } from "react-redux";
import CartItem from "../component/CartItem";
import EsewaCheckout from "../component/EsewaCheckout";
import {Link} from 'react-router-dom'

function Cart() {
  const { cart } = useSelector((state) => state.cart);

  const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="p-6">
      {cart.length > 0 ? (
        <div className="space-y-4">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">
              Total: Rs {totalAmount}
            </p>
            {/* orderId is now generated fresh inside EsewaCheckout on every click */}
            <EsewaCheckout totalAmount={totalAmount} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-4">Cart Empty</h1>
          <Link to={"/"}>
            <button className="bg-green-600 text-white py-2 px-4 rounded-md">
              Shop Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
