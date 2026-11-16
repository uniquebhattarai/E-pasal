import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { Mail, Copy, Check } from "lucide-react";
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

const DEMO_EMAIL = "cool99691@gmail.com";
const DEMO_PASSWORD = "Password@123";

export default function LoginForm({ onSuccess, onSwitch, onError, onClose }) {
  const dispatch = useDispatch();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldName) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedField(fieldName);
      toast.success(`${fieldName === "email" ? "Email" : "Password"} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy");
    }
  };

  const handleAutoFill = (setFieldValue) => {
    setFieldValue("email", DEMO_EMAIL);
    setFieldValue("password", DEMO_PASSWORD);
    toast.success("Demo credentials filled!");
  };

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
      {({ isSubmitting, setFieldValue }) => (
        <Form className="flex-1 min-h-0 flex flex-col h-full overflow-y-auto no-scrollbar">
          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={Mail}
            autoComplete="email"
            required
            labelClassName="text-xs mb-0.5 sm:mb-1"
            inputClassName="py-2 sm:py-2.5 text-xs sm:text-sm"
          />

          <Password
            id="login-password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            labelClassName="text-xs mb-0.5 sm:mb-1"
            inputClassName="py-2 sm:py-2.5 text-xs sm:text-sm"
            wrapperClassName="mt-1 sm:mt-1.5"
          />

          <div className="flex items-center justify-between text-xs pt-1.5 sm:pt-2">
            <Checkbox id="login-rememberMe" name="rememberMe" label="Remember Me" />
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="text-primary hover:text-primary-hover font-semibold transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Demo Credentials Box for CV / Portfolio Reviewers */}
          <div className="mt-3 sm:mt-3.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-50/90 dark:bg-[#1c1c1e] border border-slate-200/80 dark:border-[#2f2f32] transition-colors">
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200/70 dark:border-[#2b2b2e]">
              <span className="text-[10px] sm:text-[11px] font-semibold text-text-muted dark:text-neutral-400 uppercase tracking-wider">
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={() => handleAutoFill(setFieldValue)}
                className="text-[11px] sm:text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            <div className="space-y-0.5">
              {/* Email row */}
              <div className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-slate-100/80 dark:hover:bg-[#252528] transition group">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className="text-[11px] text-text-muted dark:text-neutral-400 w-14 shrink-0 font-medium">
                    Email
                  </span>
                  <span className="text-[11px] font-medium text-text-main dark:text-neutral-200 truncate select-all">
                    {DEMO_EMAIL}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_EMAIL, "email")}
                  title="Copy demo email"
                  aria-label="Copy demo email"
                  className="p-1 rounded text-text-muted hover:text-primary hover:bg-slate-200/60 dark:hover:bg-[#333] transition cursor-pointer shrink-0 ml-1.5"
                >
                  {copiedField === "email" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Password row */}
              <div className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-slate-100/80 dark:hover:bg-[#252528] transition group">
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <span className="text-[11px] text-text-muted dark:text-neutral-400 w-14 shrink-0 font-medium">
                    Password
                  </span>
                  <span className="text-[11px] font-medium text-text-main dark:text-neutral-200 truncate select-all">
                    {DEMO_PASSWORD}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(DEMO_PASSWORD, "password")}
                  title="Copy demo password"
                  aria-label="Copy demo password"
                  className="p-1 rounded text-text-muted hover:text-primary hover:bg-slate-200/60 dark:hover:bg-[#333] transition cursor-pointer shrink-0 ml-1.5"
                >
                  {copiedField === "password" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom block: Login button, Or divider, and Sign up link */}
          <div className="mt-2 sm:mt-auto pt-1 sm:pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              loadingText="Signing in..."
              className="py-2 sm:py-2.5 text-xs sm:text-sm"
            >
              Login
            </Button>

            <Divider />

            <div className="text-center pt-0 text-xs sm:text-sm text-text-muted">
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
    <div className="relative my-2 sm:my-3.5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border-main"></span>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-2.5 bg-bg-card text-text-muted font-medium">Or</span>
      </div>
    </div>
  );
}
