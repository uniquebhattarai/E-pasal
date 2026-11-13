import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

import { ApiConnector } from "../../services/ApiConnector";
import { login } from "../../services/Api";
import { setToken } from "../../slices/AuthSlice";
import { setUser } from "../../slices/ProfileSlice";
import { getWishlist } from "../../services/wishlistService";
import { getCart } from "../../services/cartService";
import {
  loginSchema,
  loginInitialValues,
} from "../../validations/authValidation";
import { Input, Password, Checkbox, Button } from "../common";

export default function LoginForm({ onSuccess, onSwitch, onError, onClose }) {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    onError("");
    try {
      const response = await ApiConnector("POST", login.LOGIN_API, {
        email: values.email,
        password: values.password,
      });

      if (response?.data?.success) {
        const userData = response.data.user;
        dispatch(setToken("cookie"));
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));

        // Fetch user's cart and wishlist independently via dedicated endpoints
        getCart(dispatch);
        getWishlist(dispatch);

        toast.success("Logged in successfully!");
        onSuccess();
      } else {
        const errorMsg =
          response?.data?.message || "Invalid email or password.";
        onError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Invalid email or password.";
      onError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={loginInitialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1 min-h-0 flex flex-col h-full">
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={Mail}
            autoComplete="email"
            required
            reserveErrorSpace
          />

          <Password
            id="login-password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            reserveErrorSpace
          />

          <div className="flex items-center justify-between text-xs pt-0.5">
            <Checkbox id="login-rememberMe" name="rememberMe" label="Remember Me" />
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="text-primary hover:text-primary-hover font-semibold transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Bottom block: Login button, Or divider, and Sign up link placed at the bottom via mt-auto */}
          <div className="mt-auto pt-4 sm:pt-6">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              loadingText="Signing in..."
            >
              Login
            </Button>

            <Divider />

            <div className="text-center pt-0.5 sm:pt-1 text-sm text-text-muted">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onSwitch("signup")}
                className="text-primary font-bold hover:underline cursor-pointer transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function Divider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border-main"></span>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-3 bg-bg-card text-text-muted font-medium">Or</span>
      </div>
    </div>
  );
}
