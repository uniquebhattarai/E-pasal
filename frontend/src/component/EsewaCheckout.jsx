import React, { useState } from "react";
import axios from "axios";


const EsewaCheckout = ({ totalAmount }) => {
  const [loading, setLoading] = useState(false);

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const handlePayment = async () => {
    if (!totalAmount) {
      alert("Payment data missing! Make sure totalAmount is provided.");
      return;
    }


    const transaction_uuid = `epsl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    
    const envUrl = (import.meta.env.VITE_FRONTEND_URL || "").trim().replace(/\/$/, "");
    const origin = window.location.origin.replace(/\/$/, "");

   
    const isSafeUrl = (url) => url.startsWith("https://");


    let baseUrl;
    if (isSafeUrl(envUrl)) {
      baseUrl = envUrl;
    } else if (isSafeUrl(origin)) {
      baseUrl = origin;
    } else {
      // Local dev: localhost or http — eSewa won't accept these, use production URL
      baseUrl = "https://e-pasal-two.vercel.app";
    }

    const successUrl = `${baseUrl}/payment-success`;
    const failureUrl = `${baseUrl}/payment-failure`;

  

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${VITE_BASE_URL}/payment/init`,
        {
          amount: totalAmount,
          transaction_uuid,
          success_url: successUrl,
          failure_url: failureUrl,
          tax_amount: 0,
          product_delivery_charge: 0,
          product_service_charge: 0,
        },
        { withCredentials: true }
      );

      if (data.success) {
        console.log("[eSewa] Submitting form to:", data.formUrl);

        // Dynamically create a form and POST to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.formUrl;

        for (const key in data.fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.fields[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Failed to initialize payment: " + data.message);
      }
    } catch (err) {
      console.error("[eSewa] Error:", err);
      alert(
        "Error connecting to backend: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow hover:shadow-lg transition-all duration-200 active:scale-95 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Processing..." : "Pay with eSewa"}
    </button>
  );
};

export default EsewaCheckout;
