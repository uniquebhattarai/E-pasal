import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-700 mt-4">Payment Failed</h1>
        <p className="mt-2 text-gray-600">
          Oops! Something went wrong with your transaction. Please try again or contact support.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
