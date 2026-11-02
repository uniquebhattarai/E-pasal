import React from "react";
import { useSelector } from "react-redux";
import CartItem from "../component/CartItem";
import EsewaCheckout from "../component/EsewaCheckout";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../component/common";

function Cart() {
  const { cart } = useSelector((state) => state.cart);

  const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition"
              title="Back to products"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-2.5">
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900 pb-2.5 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="py-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      Rs {totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between mb-4">
                  <span className="text-xs sm:text-sm font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-600">
                    Rs {totalAmount}
                  </span>
                </div>

                <EsewaCheckout totalAmount={totalAmount} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
              Your cart is empty
            </h2>
            <p className="text-xs text-gray-500 mb-4 max-w-sm">
              Looks like you haven't added anything to your cart yet. Explore our
              products and discover great deals!
            </p>
            <Link to="/">
              <Button variant="primary" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
