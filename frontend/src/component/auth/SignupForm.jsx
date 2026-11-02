import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import { ApiConnector } from "../../services/ApiConnector";
import { sendOtp } from "../../services/Api";
import { setSignupData } from "../../slices/AuthSlice";
import {
  signupSchema,
  signupInitialValues,
} from "../../validations/authValidation";
import { Input, Password, Checkbox, Button } from "../common";

export default function SignupForm({ onSuccess, onSwitch, onError }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    onError("");
    dispatch(
      setSignupData({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
    );

    try {
      const response = await ApiConnector("POST", sendOtp.VERIFY_OTP, {
        email: values.email,
      });

      if (response.data.success) {
        toast.success("OTP sent to your email.");
        onSuccess();
        navigate("/verify-email");
      } else {
        const errorMsg = response.data.message || "Failed to send OTP";
        onError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to send OTP, please try again";
      onError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={signupInitialValues}
      validationSchema={signupSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex-1 flex flex-col gap-1">
          <Input
            id="signup-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={Mail}
            autoComplete="email"
            required
            reserveErrorSpace
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="signup-firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="First name"
              icon={User}
              required
              reserveErrorSpace
            />
            <Input
              id="signup-lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Last name"
              icon={User}
              required
              reserveErrorSpace
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Password
              id="signup-password"
              name="password"
              label="Password"
              placeholder="Enter password"
              autoComplete="new-password"
              required
              reserveErrorSpace
            />
            <Password
              id="signup-confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm password"
              autoComplete="new-password"
              required
              reserveErrorSpace
            />
          </div>

          <div className="pt-0.5">
            <Checkbox
              id="signup-acceptTerms"
              name="acceptTerms"
              label="I accept the Terms & Conditions and Privacy Policy"
              required
              reserveErrorSpace
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            loadingText="Signing up..."
            className="mt-2.5"
          >
            Sign Up
          </Button>

          <div className="mt-auto">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-main"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-bg-card text-text-muted font-medium">Or</span>
              </div>
            </div>

            <div className="text-center pt-1 text-sm text-text-muted">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onSwitch("login")}
                className="text-primary font-bold hover:underline cursor-pointer transition"
              >
                Log in
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
