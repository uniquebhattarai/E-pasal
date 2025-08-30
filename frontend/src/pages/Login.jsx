import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { ApiConnector } from "../services/ApiConnector";
import { login } from "../services/Api";
import {toast} from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { setToken } from "../slices/AuthSlice";
import { setUser } from "../slices/ProfileSlice";


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
   const dispatch = useDispatch();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =  await ApiConnector("POST",login.LOGIN_API,{email,password});

      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));

      
      localStorage.setItem("token",JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));
       console.log("Login success:", response.data);
       toast.success("Logged in successfull");
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error("Login failed ,please try again later")
    }
    console.log("Login submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-green-600 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4 text-white">
          {/* Email */}
          <label className="w-full">
            <p className="mb-1 text-sm font-medium">
              Email Address <sup className="text-red-200">*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </label>

          {/* Password */}
          <label className="relative w-full">
            <p className="mb-1 text-sm font-medium">
              Password <sup className="text-red-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-lg border border-white bg-transparent px-3 py-2 pr-10 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-200"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={22} />
              ) : (
                <AiOutlineEye fontSize={22} />
              )}
            </span>
            <Link to="/forgot-password">
              <p className="mt-2 text-xs text-yellow-200 hover:underline">
                Forgot Password?
              </p>
            </Link>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 rounded-lg bg-yellow-400 py-2 font-semibold text-green-900 hover:bg-yellow-300 transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-gray-100">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-200 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
