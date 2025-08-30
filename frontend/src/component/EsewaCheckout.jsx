import React, { useState } from "react";
import axios from "axios";

const EsewaCheckout = ({ totalAmount, orderId }) => {
  const [loading, setLoading] = useState(false);
  
   const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

  const handlePayment = async () => {
    console.log("Checkout called with:", totalAmount, orderId);

    if (!totalAmount || !orderId) {
      alert("Payment data missing! Make sure totalAmount and orderId are provided.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${VITE_BASE_URL}/payment/init`, {
        amount: totalAmount,
        transaction_uuid: orderId,
        success_url: `${VITE_FRONTEND_URL}/payment-success`,
        failure_url: `${VITE_FRONTEND_URL}/payment-failure`,
        tax_amount: 0,
        product_delivery_charge: 0,
        product_service_charge: 0,
      });

      if (data.success) {
        // Dynamically create a form and submit to eSewa
          console.log("Submitting to eSewa with these fields:", data.fields);
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
      console.error(err);
      alert("Error connecting to backend: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className={`bg-green-600 text-white py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay with eSewa"}
    </button>
  );
};

export default EsewaCheckout;
