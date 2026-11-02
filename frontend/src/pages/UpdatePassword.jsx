import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ApiConnector } from "../services/ApiConnector";
import { resetpassword } from "../services/Api";
import { toast } from "react-hot-toast";
import { Password, Button } from "../component/common";

const updatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnSubmit = async (values, { setSubmitting }) => {
    const token = location.pathname.split("/").at(-1);

    try {
      const response = await ApiConnector(
        "POST",
        resetpassword.RESET_PASSWORD_API,
        {
          password: values.password,
          confirmPassword: values.confirmPassword,
          token,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-primary-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-card rounded-2xl shadow-xl border border-border-main p-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-3">
          Choose New Password
        </h1>
        <p className="text-text-muted text-center mb-6 text-sm">
          Almost done! Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={updatePasswordSchema}
          onSubmit={handleOnSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Separated Password Component */}
              <Password
                name="password"
                label="New Password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                required
              />

              {/* Separated Confirm Password Component */}
              <Password
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm your new password"
                autoComplete="new-password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                loadingText="Resetting password..."
                className="mt-4"
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center text-primary font-semibold hover:underline text-sm"
          >
            <BiArrowBack className="mr-1.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
