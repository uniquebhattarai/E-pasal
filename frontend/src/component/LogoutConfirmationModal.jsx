import React, { useEffect } from "react";
import { LogOut } from "lucide-react";

export default function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        onClick={onClose}
      />

      {/* Sheet / Modal (slides up from bottom on mobile, centered on desktop/tablet) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border-t sm:border border-gray-100 animate-slideUp sm:animate-scaleIn pb-8 sm:pb-6"
      >
        {/* Grab Handle (visible on mobile) */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

        {/* Warning Icon & Text */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <LogOut size={22} strokeWidth={2.2} />
          </div>
          <h3 id="logout-confirm-title" className="text-base sm:text-lg font-bold text-gray-900">
            Log Out of E-pasal?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            Are you sure you want to log out? You will need to sign back in to access your profile and orders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm transition cursor-pointer active:scale-[0.98] text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer active:scale-[0.98] text-center whitespace-nowrap"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

