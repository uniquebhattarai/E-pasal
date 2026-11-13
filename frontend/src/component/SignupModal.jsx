import React, { useState } from "react";
import ColoredIcon from "../../public/colored icon.png";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

import { closeAuthModal, openAuthModal } from "../slices/AuthSlice";
import { Modal } from "./common";
import SignupForm from "./auth/SignupForm";

export default function SignupModal() {
  const dispatch = useDispatch();
  const isAuthOpen = useSelector((state) => state.auth.authModal?.isOpen);
  const mode = useSelector((state) => state.auth.authModal?.mode) || "login";
  const [serverError, setServerError] = useState("");

  const isOpen = Boolean(isAuthOpen && mode === "signup");

  const handleClose = () => {
    setServerError("");
    dispatch(closeAuthModal());
  };

  const handleSwitchToLogin = () => {
    setServerError("");
    dispatch(openAuthModal("login"));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      fullScreenOnMobile
      bodyClassName="px-5 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-7 flex-1 flex flex-col justify-start min-h-0 overflow-hidden"
    >
      <div className="flex flex-col flex-1 w-full min-h-0">
        {/* Mobile Top Navigation with Back Arrow */}
        <div className="sm:hidden flex items-center shrink-0 mb-1 -ml-1">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Go back"
            className="p-1 -ml-1 text-text-main hover:text-primary active:scale-95 transition cursor-pointer rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-left mb-2 sm:mb-5 shrink-0">
          <img
            src={ColoredIcon || "/colored icon.png"}
            alt="E-Pasal"
            className="h-6 sm:h-7 w-auto object-contain mx-auto mb-1.5"
          />
          <h3 className="text-sm sm:text-base font-semibold text-text-main tracking-tight text-left">
            Please create your account to continue.
          </h3>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-2 p-2.5 rounded-xl bg-danger-light text-danger border border-danger-border text-xs sm:text-sm font-medium shrink-0">
            {serverError}
          </div>
        )}

        {/* Form area: natural content-driven height */}
        <div className="flex-1 min-h-0 -mx-1 px-1 flex flex-col overflow-hidden">
          <SignupForm
            onSuccess={handleClose}
            onSwitch={handleSwitchToLogin}
            onError={setServerError}
          />
        </div>
      </div>
    </Modal>
  );
}

