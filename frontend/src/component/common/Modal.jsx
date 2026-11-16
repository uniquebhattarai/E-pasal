import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[95vw] md:max-w-4xl",
};

const smSizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-[95vw] md:max-w-4xl",
};

/**
 * Common Reusable Modal Component
 * Accessible, portal-based, handles ESC, backdrop clicks, and body scroll lock.
 */
const Modal = ({
  isOpen = false,
  visible,
  onClose,
  title,
  subtitle,
  children,
  headerContent,
  footer,
  footerContent,
  size = "md",
  showCloseButton = true,
  hasCross = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = "",
  bodyClassName = "",
  fullScreenOnMobile = false,
}) => {
  const isModalOpen = Boolean(isOpen || visible);
  const showCross = Boolean(showCloseButton && hasCross);
  const modalContentRef = useRef(null);

  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEsc && e.key === "Escape" && onClose) {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Handle overlay backdrop click
  const handleOverlayClick = (e) => {
    if (
      closeOnOverlayClick &&
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target) &&
      onClose
    ) {
      onClose();
    }
  };

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  if (!isModalOpen || typeof document === "undefined") {
    return null;
  }

  const maxWidthClass = fullScreenOnMobile
    ? `max-w-none ${smSizeClasses[size] || smSizeClasses.md}`
    : (sizeClasses[size] || sizeClasses.md);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 flex items-center justify-center animate-fadeIn ${
        fullScreenOnMobile
          ? "p-0 sm:p-4 bg-bg-card sm:bg-transparent overflow-hidden"
          : "p-4"
      }`}
    >
      {/* Plain dim backdrop. Hidden on mobile when fullScreenOnMobile is active. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-black/65 ${fullScreenOnMobile ? "hidden sm:block" : ""}`}
      />
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidthClass} bg-bg-card flex flex-col no-scrollbar ${
          fullScreenOnMobile
            ? `h-[100dvh] sm:max-h-[95vh] border-0 sm:border sm:border-border-main rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden ${
                className.includes("sm:h-") ? "" : "sm:h-auto"
              }`
            : "border border-border-main rounded-2xl shadow-2xl overflow-hidden max-h-[95vh]"
        } ${className}`}
      >
        {/* Close "X" Button */}
        {showCross && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={`absolute z-10 p-1.5 rounded-full text-text-light hover:text-text-main hover:bg-bg-disabled transition duration-150 focus:outline-none cursor-pointer ${
              fullScreenOnMobile ? "hidden sm:block sm:top-3.5 sm:right-3.5" : "top-3.5 right-3.5"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Custom Header Content */}
        {headerContent && (
          <div className="pt-5 px-5 sm:px-6">{headerContent}</div>
        )}

        {/* Standard Header */}
        {!headerContent && (title || subtitle) && (
          <div className="pt-5 px-5 sm:px-6 text-center">
            {title && (
              <h3 className="text-lg sm:text-xl font-bold text-text-main tracking-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div
          data-modal-body
          className={`overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${bodyClassName || "p-5 sm:p-6"}`}
        >
          {children}
        </div>

        {/* Optional Footer */}
        {(footer || footerContent) && (
          <div className="px-6 py-4 bg-bg-input border-t border-border-main flex items-center justify-end gap-3">
            {footer || footerContent}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

