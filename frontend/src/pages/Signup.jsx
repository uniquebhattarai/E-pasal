import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {  sendOtp, signUp } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { setSignupData } from "../slices/AuthSlice";
import { toast } from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(setSignupData({ ...formData }));

    try {

      const response = await ApiConnector("POST", sendOtp.VERIFY_OTP, {
        email, 
      });

      if (response.data.success) {
        toast.success("OTP sent to your email.");
        navigate("/verify-email"); // redirect to OTP verification page
      } else {
        toast.error(response.data.message || "Failed to send otp");
      }
    } catch (error) {
      console.error("Send OTP error:", error.response?.data || error.message);
      toast.error("Failed to send OTP, please try again");
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-green-600 text-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
    
          <div className="flex gap-4">
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="First Name"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Last Name"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>

          {/* Email */}
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Email Address"
            className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />

       
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Password"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 cursor-pointer text-gray-200"
            >
              {showPassword ? <AiOutlineEyeInvisible fontSize={22} /> : <AiOutlineEye fontSize={22} />}
            </span>
          </div>


          <div className="relative">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 cursor-pointer text-gray-200"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={22} /> : <AiOutlineEye fontSize={22} />}
            </span>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-yellow-400 py-2 font-semibold text-green-900 hover:bg-yellow-300 transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
