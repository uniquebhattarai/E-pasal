import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold text-green-700 mt-4">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your payment. Your transaction was completed successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
