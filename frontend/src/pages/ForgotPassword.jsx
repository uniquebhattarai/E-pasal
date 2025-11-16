import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/AuthSlice";
import { ApiConnector } from "../services/ApiConnector";
import { resetpasswordtoken } from "../services/Api";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const response = await ApiConnector(
        "POST",
        resetpasswordtoken.RESET_PASSWORD_TOKEN_API,
        { email }
      );
      toast.success("Reset email sent successfully!");
      setEmailSent(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email. Please try again.");
    }

    dispatch(setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-emerald-600 text-center mb-6">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {emailSent
              ? `We have sent a password reset email to ${email}`
              : "Please enter your valid email to reset your password"}
          </p>

          {!emailSent && (
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition duration-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          )}

          {emailSent && (
            <div className="text-center mt-6">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200"
              >
                Resend Email
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
