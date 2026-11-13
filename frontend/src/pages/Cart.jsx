import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../component/CartItem";
import EsewaCheckout from "../component/EsewaCheckout";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "../component/common";
import { openAuthModal } from "../slices/AuthSlice";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { cart } = useSelector((state) => state.cart);
  const isEmpty = cart.length === 0;

  const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Mobile Fixed/Sticky Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
            Cart
          </h1>
          <div className="w-8" aria-hidden="true" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center -my-2 shrink-0">
            <DotLottieReact
              src="/no-data.lottie"
              loop
              autoplay
            />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Login to view your cart
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-5 max-w-sm">
            Please log in to your account to view your saved items and checkout.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => dispatch(openAuthModal("login"))}
          >
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Mobile Fixed/Sticky Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
            Cart
          </h1>
          <div className="w-8" aria-hidden="true" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center -my-2 shrink-0">
            <DotLottieReact
              src="/no-data.lottie"
              loop
              autoplay
            />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Your cart is empty
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-5 max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore our
            products and discover great deals!
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 md:pb-12">
      {/* Mobile Fixed/Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
          Cart
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-3 sm:pt-4 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-2.5">
            {cart.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-20 self-start">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900">
                  Order Summary
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>

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
                <span className="text-sm sm:text-base font-bold text-primary">
                  Rs {totalAmount}
                </span>
              </div>

              {/* Desktop Checkout Button */}
              <div className="hidden md:block">
                <EsewaCheckout totalAmount={totalAmount} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500 font-medium">Total</span>
            <span className="text-base sm:text-lg font-bold text-primary tracking-tight">
              Rs {totalAmount}
            </span>
          </div>
          <div className="flex-1 max-w-[200px]">
            <EsewaCheckout totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
