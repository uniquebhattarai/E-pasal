import React, { useState } from "react";
import { Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApiConnector } from "../services/ApiConnector";
import { sendOtp } from "../services/Api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSignupData } from "../slices/AuthSlice";
import { Input, Password, Button } from "../component/common";

const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

function Signup() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnSubmit = async (values, { setSubmitting }) => {
    setServerError("");
    dispatch(setSignupData({ ...values }));

    try {
      const response = await ApiConnector("POST", sendOtp.VERIFY_OTP, {
        email: values.email,
      });

      if (response.data.success) {
        toast.success("OTP sent to your email.");
        navigate("/verify-email");
      } else {
        const errorMsg = response.data.message || "Failed to send OTP";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send OTP, please try again";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-2xl shadow-xl border border-border-main p-8">
          <p className="text-3xl text-center text-primary mb-8 font-bold">
            Create Account
          </p>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-danger-light text-danger border border-danger-border">
              <p className="text-sm font-medium">{serverError}</p>
            </div>
          )}

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signupSchema}
            onSubmit={handleOnSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="First name"
                    icon={User}
                    required
                  />
                  <Input
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Last name"
                    icon={User}
                    required
                  />
                </div>

                {/* Email */}
                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  icon={Mail}
                  autoComplete="email"
                  required
                />

                {/* Separated Password Field */}
                <Password
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />

                {/* Separated Confirm Password Field */}
                <Password
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  loadingText="Signing up..."
                  className="mt-6"
                >
                  Sign Up
                </Button>

                {/* Sign in link */}
                <div className="text-center pt-2">
                  <span className="text-text-muted text-sm">
                    Already have an account?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    Log in
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Signup;
