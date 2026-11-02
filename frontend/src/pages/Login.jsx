import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApiConnector } from "../services/ApiConnector";
import { login } from "../services/Api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/AuthSlice";
import { setUser } from "../slices/ProfileSlice";
import { Input, Password, Button } from "../component/common";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnSubmit = async (values, { setSubmitting }) => {
    setServerError("");

    try {
      const response = await ApiConnector("POST", login.LOGIN_API, {
        email: values.email,
        password: values.password,
      });

      // Token is stored in httpOnly cookie set by server.
      // Persist user profile in redux & localStorage.
      dispatch(setToken("cookie"));
      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Invalid email or password.";
      setServerError(errorMsg);
      toast.error("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-2xl shadow-xl border border-border-main p-8">
          <p className="text-3xl text-center text-primary mb-8 font-bold">
            Log in
          </p>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-danger-light text-danger border border-danger-border">
              <p className="text-sm font-medium">{serverError}</p>
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleOnSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email Field */}
                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  icon={Mail}
                  autoComplete="email"
                  required
                />

                {/* Password Field (Separated out) */}
                <div>
                  <Password
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:text-primary-hover transition"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  loadingText="Signing in..."
                  className="mt-2"
                >
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-main"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-card text-text-muted">
                New to our platform?
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <Link to="/signup" className="block">
            <Button variant="outline" fullWidth>
              Create an account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
