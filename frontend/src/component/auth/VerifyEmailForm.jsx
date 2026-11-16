import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { ApiConnector } from "../../services/ApiConnector";
import { sendOtp, signUp } from "../../services/Api";
import { Button, OtpInput } from "../common";

export default function VerifyEmailForm({ onSuccess, onSwitch, onError }) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const { signupData } = useSelector((state) => state.auth);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!signupData) {
      toast.error("Signup data missing. Please sign up again.");
      onSwitch("signup");
      return;
    }

    onError("");
    setIsSubmitting(true);

    const {
      accountType = "Customer",
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    try {
      const response = await ApiConnector("POST", signUp.SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (response?.data?.success) {
        toast.success("Account created successfully! Please login.");
        // Smoothly transition to login view in the same modal
        onSwitch("login");
      } else {
        const errorMsg = response?.data?.message || "Verification failed";
        onError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMsg =
        error.response?.data?.message || "Verification failed. Please try again.";
      onError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    if (!signupData?.email) {
      toast.error("Email address not found");
      return;
    }

    setIsResending(true);
    onError("");
    try {
      const response = await ApiConnector("POST", sendOtp.VERIFY_OTP, {
        email: signupData.email,
      });

      if (response?.data?.success) {
        toast.success("New OTP sent to your email!");
        setResendTimer(60);
      } else {
        toast.error(response?.data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error(err.response?.data?.message || "Error resending OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleVerify}
      className="flex-1 min-h-0 flex flex-col justify-between h-full pt-1 sm:pt-3"
    >
      <div className="space-y-3.5 pt-3 sm:pt-4">
        {/* Custom Project-Standard OTP Input with generous gaps and clean empty slots */}
        <div className="w-full flex justify-center">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            autoFocus
            disabled={isSubmitting}
          />
        </div>

        {/* Resend text placed DIRECTLY BELOW the OTP input field */}
        <p className="text-center text-xs sm:text-sm text-text-muted pt-1">
          Didn't receive OTP?{" "}
          {resendTimer > 0 ? (
            <span className="text-primary font-semibold">
              Resend it in {formatTimer(resendTimer)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-primary font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </p>
      </div>

      {/* Bottom action block: Verify Email button pinned via mt-auto */}
      <div className="mt-auto pt-4 sm:pt-6 pb-1">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          loadingText="Verifying..."
          disabled={otp.length < 6}
        >
          Verify Email
        </Button>
      </div>
    </form>
  );
}
