import React, { useState } from "react";
import GreenIcon from "../../public/greenicon.png";
import { useDispatch, useSelector } from "react-redux";

import { closeAuthModal, setAuthModalMode } from "../slices/AuthSlice";
import { Modal } from "./common";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";

// Fixed content height shared by login & signup (taller than the signup form's natural
// height), so the modal never changes size when switching modes.
const MODAL_CONTENT_HEIGHT = "h-[630px]";

export default function AuthModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.auth.authModal?.isOpen);
  const mode = useSelector((state) => state.auth.authModal?.mode) || "login";
  const [serverError, setServerError] = useState("");

  const isLogin = mode === "login";

  const handleClose = () => {
    setServerError("");
    dispatch(closeAuthModal());
  };

  const handleSwitchMode = (newMode) => {
    setServerError("");
    dispatch(setAuthModalMode(newMode));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      bodyClassName="px-5 py-6 sm:px-6 sm:py-7"
    >
      <div className={`flex flex-col ${MODAL_CONTENT_HEIGHT}`}>
        {/* Brand Header */}
        <div className="text-left mb-5 shrink-0">
          <img
            src={GreenIcon || "/greenicon.png"}
            alt="E-Pasal"
            className="h-6 sm:h-7 w-auto object-contain mx-auto mb-2"
          />
          <h3 className="text-sm sm:text-base font-semibold text-text-main tracking-tight text-left">
            {isLogin
              ? "Please login to your account to continue."
              : "Please create your account to continue."}
          </h3>
        </div>

        {/* Server Error Message */}
        {serverError && (
          <div className="mb-3 p-3 rounded-xl bg-danger-light text-danger border border-danger-border text-sm font-medium shrink-0">
            {serverError}
          </div>
        )}

        {/* Form area: takes the remaining fixed height. Padding/negative margin
            keeps input focus rings from being clipped by the scroll container. */}
        <div className="flex-1 min-h-0 -mx-1 px-1 overflow-y-auto no-scrollbar flex flex-col">
          <div className="flex-1 flex flex-col">
          {isLogin ? (
            <LoginForm
              onSuccess={handleClose}
              onClose={handleClose}
              onSwitch={handleSwitchMode}
              onError={setServerError}
            />
          ) : (
            <SignupForm
              onSuccess={handleClose}
              onSwitch={handleSwitchMode}
              onError={setServerError}
            />
          )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
