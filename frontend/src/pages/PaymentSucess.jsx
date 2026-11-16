import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserCart } from "../services/cartService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    clearUserCart(dispatch, token);
  }, [dispatch, token]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-emerald-700 mt-4 tracking-tight">Payment Successful!</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
          Thank you for your payment. Your transaction was completed successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-gradient-primary text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow hover:opacity-95 active:scale-95 transition cursor-pointer"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
