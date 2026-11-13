import React, { useState } from "react";
import ColoredIcon from "../../public/colored icon.png";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

import { closeAuthModal, setAuthModalMode } from "../slices/AuthSlice";
import { Modal } from "./common";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import VerifyEmailForm from "./auth/VerifyEmailForm";

export default function AuthModal() {
  const dispatch = useDispatch();
  const isAuthOpen = useSelector((state) => state.auth.authModal?.isOpen);
  const mode = useSelector((state) => state.auth.authModal?.mode) || "login";
  const signupData = useSelector((state) => state.auth.signupData);
  const [serverError, setServerError] = useState("");

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isVerifyEmail = mode === "verify-email";

  const handleClose = () => {
    setServerError("");
    dispatch(closeAuthModal());
  };

  const handleSwitchMode = (targetMode) => {
    setServerError("");
    dispatch(setAuthModalMode(targetMode));
  };

  const handleMobileBack = () => {
    if (isVerifyEmail) {
      handleSwitchMode("signup");
    } else {
      handleClose();
    }
  };

  const getHeaderTitle = () => {
    if (isVerifyEmail) return "Verify Your Email";
    if (isLogin) return "Please login to your account to continue.";
    return "Please create your account to continue.";
  };

  const getHeaderSubtitle = () => {
    if (isVerifyEmail) {
      return (
        <span className="flex flex-col items-center">
          <span>We've sent a 6-digit verification code to</span>
          <span className="font-semibold text-gradient-primary break-all sm:break-normal mt-0.5">
            {signupData?.email || "your email"}
          </span>
        </span>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={Boolean(isAuthOpen)}
      onClose={handleClose}
      size="md"
      fullScreenOnMobile
      className="sm:h-[660px]"
      bodyClassName="px-3 sm:px-5 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:py-7 flex-1 flex flex-col justify-start min-h-0 overflow-hidden relative"
    >
      <div className="flex flex-col flex-1 w-full min-h-0 h-full">
        {/* Top-left Back Arrow for Verify Email (visible on desktop & mobile) */}
        {isVerifyEmail ? (
          <>
            {/* Desktop Back Arrow */}
            <button
              type="button"
              onClick={() => handleSwitchMode("signup")}
              aria-label="Back to Signup"
              className="hidden sm:block absolute top-3.5 right-auto left-4 z-20 p-1.5 rounded-full text-text-light hover:text-text-main hover:bg-bg-disabled active:scale-95 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.8]" />
            </button>

            {/* Mobile Header Bar with edge-to-edge bottom border */}
            <div className="sm:hidden -mx-3 -mt-[max(0.5rem,env(safe-area-inset-top))] px-3 h-13 min-h-[52px] flex items-center justify-between border-b border-border-main shrink-0 bg-white">
              <button
                type="button"
                onClick={() => handleSwitchMode("signup")}
                aria-label="Back to Signup"
                className="p-1 -ml-1 text-text-main hover:text-primary active:scale-95 transition cursor-pointer rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>
              <h3 className="font-bold text-base text-text-main tracking-tight text-center flex-1">
                Verify Your Email
              </h3>
              <div className="w-7" aria-hidden="true" />
            </div>
          </>
        ) : (
          /* Mobile Top Navigation with Back Arrow for Login / Signup */
          <div className="sm:hidden flex items-center shrink-0 mb-1 -ml-1">
            <button
              type="button"
              onClick={handleMobileBack}
              aria-label="Go back"
              className="p-1 -ml-1 text-text-main hover:text-primary active:scale-95 transition cursor-pointer rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div
          className={`mb-2 sm:mb-4 shrink-0 ${
            isVerifyEmail ? "text-center pt-2 sm:pt-4" : "text-left"
          }`}
        >
          {/* Logo is hidden inside verify-email view */}
          {!isVerifyEmail && (
            <img
              src={ColoredIcon || "/colored icon.png"}
              alt="E-Pasal"
              className="h-6 sm:h-7 w-auto object-contain mx-auto mb-1.5"
            />
          )}

          <h3
            className={`font-semibold text-text-main tracking-tight transition-colors duration-150 ${
              isVerifyEmail
                ? "hidden sm:block text-base sm:text-lg text-center font-bold"
                : "text-sm sm:text-base text-left"
            }`}
          >
            {getHeaderTitle()}
          </h3>

          {getHeaderSubtitle() && (
            <div className="text-xs sm:text-sm text-text-muted mt-1.5 sm:mt-2 text-center max-w-sm mx-auto leading-relaxed">
              {getHeaderSubtitle()}
            </div>
          )}
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-2 p-2.5 rounded-xl bg-danger-light text-danger border border-danger-border text-xs sm:text-sm font-medium shrink-0 animate-fadeIn">
            {serverError}
          </div>
        )}

        {/* Form area: seamlessly replaces content in-place with smooth fade animation */}
        <div
          key={mode}
          className="flex-1 min-h-0 -mx-1 px-1 flex flex-col overflow-hidden animate-fadeIn"
        >
          {isVerifyEmail ? (
            <VerifyEmailForm
              onSuccess={handleClose}
              onClose={handleClose}
              onSwitch={(target) => handleSwitchMode(target)}
              onError={setServerError}
            />
          ) : isLogin ? (
            <LoginForm
              onSuccess={handleClose}
              onClose={handleClose}
              onSwitch={() => handleSwitchMode("signup")}
              onError={setServerError}
            />
          ) : (
            <SignupForm
              onSuccess={handleClose}
              onClose={handleClose}
              onSwitch={(target) => handleSwitchMode(target || "login")}
              onError={setServerError}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
