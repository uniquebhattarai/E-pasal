import React, { forwardRef } from "react";

const variants = {
  primary:
    "bg-primary hover:bg-primary-hover active:bg-primary-active text-white shadow-md hover:shadow-lg focus:ring-primary-ring",
  secondary:
    "border-2 border-primary text-primary hover:bg-primary-light active:bg-primary-subtle focus:ring-primary-ring",
  outline:
    "border-2 border-primary text-primary hover:bg-primary-light active:bg-primary-subtle focus:ring-primary-ring",
  danger:
    "bg-danger hover:bg-danger-hover active:bg-danger-active text-white shadow-md hover:shadow-lg focus:ring-danger-ring",
  dangerOutline:
    "border-2 border-danger text-danger hover:bg-danger-light active:bg-danger-light/80 focus:ring-danger-ring",
  ghost:
    "text-text-muted hover:bg-bg-disabled active:bg-border-main focus:ring-border-main",
};

const sizes = {
  sm: "py-2 px-3 text-sm rounded-lg",
  md: "py-3 px-5 text-base rounded-xl",
  lg: "py-3.5 px-6 text-lg rounded-xl",
};

const Button = forwardRef(
  (
    {
      children,
      title,
      type = "button",
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      isLoading,
      loadingText,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      onClick,
      ...restProps
    },
    ref
  ) => {
    const isButtonLoading = Boolean(loading || isLoading);
    const isButtonDisabled = disabled || isButtonLoading;

    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        onClick={onClick}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 select-none
          ${fullWidth ? "w-full" : "w-auto"}
          ${variantClasses}
          ${sizeClasses}
          ${
            isButtonDisabled
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "cursor-pointer active:scale-[0.99]"
          }
          ${className}`}
        {...restProps}
      >
        {/* Loading Spinner */}
        {isButtonLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2.5 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText || "Loading..."}</span>
          </>
        ) : (
          <>
            {LeftIcon && (
              <span className="mr-2 inline-flex items-center">
                {React.isValidElement(LeftIcon) ? (
                  LeftIcon
                ) : (
                  <LeftIcon className="w-5 h-5" />
                )}
              </span>
            )}
            <span>{title || children}</span>
            {RightIcon && (
              <span className="ml-2 inline-flex items-center">
                {React.isValidElement(RightIcon) ? (
                  RightIcon
                ) : (
                  <RightIcon className="w-5 h-5" />
                )}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
