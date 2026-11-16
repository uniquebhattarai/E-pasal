import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApiConnector } from "../services/ApiConnector";
import { resetpasswordtoken } from "../services/Api";
import { toast } from "react-hot-toast";
import { Input, Button } from "../component/common";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmailAddress, setSentEmailAddress] = useState("");

  const handleOnSubmit = async (values, { setSubmitting }) => {
    try {
      await ApiConnector(
        "POST",
        resetpasswordtoken.RESET_PASSWORD_TOKEN_API,
        { email: values.email }
      );
      toast.success("Reset email sent successfully!");
      setSentEmailAddress(values.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-2xl shadow-xl border border-border-main p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-primary text-center mb-2 tracking-tight">
            {emailSent ? "Check Your Email" : "Reset Your Password"}
          </h1>
          <p className="text-text-muted text-center mb-5 text-xs sm:text-sm">
            {emailSent
              ? `We have sent a password reset email to ${sentEmailAddress}`
              : "Please enter your registered email address to receive password reset instructions"}
          </p>

          {!emailSent ? (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleOnSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    icon={Mail}
                    autoComplete="email"
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isSubmitting}
                    loadingText="Sending reset link..."
                  >
                    Reset Password
                  </Button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="space-y-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setEmailSent(false)}
              >
                Resend Email
              </Button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline text-sm inline-block"
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
