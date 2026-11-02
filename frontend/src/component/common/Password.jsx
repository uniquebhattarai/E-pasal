import React, { useState, useContext, forwardRef } from "react";
import { useField, FormikContext } from "formik";
import { Lock, Eye, EyeOff } from "lucide-react";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Base Password field element with visibility toggle
 */
const BasePassword = forwardRef(
  (
    {
      id,
      name,
      label,
      placeholder = "Enter your password",
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      icon: Icon = Lock,
      error,
      touched = false,
      helperText,
      reserveErrorSpace = false,
      wrapperClassName = "",
      labelClassName = "",
      inputClassName = "",
      autoComplete = "current-password",
      ...restProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name;
    const hasError = Boolean(touched && error);

    return (
      <div className={`w-full flex flex-col ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-xs sm:text-sm font-medium mb-1 transition-colors duration-200 ${
              hasError ? "text-danger" : "text-text-main"
            } ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative w-full">
          {/* Left Icon (Lock by default) */}
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-light">
              {React.isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
          )}

          {/* Password Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className={`w-full py-2.5 text-text-main placeholder:text-text-placeholder text-sm border rounded-xl transition duration-200 outline-none
              ${Icon ? "pl-11" : "pl-4"} pr-11
              ${
                hasError
                  ? "border-danger bg-danger-light/30 focus:border-danger focus:ring-2 focus:ring-danger-ring"
                  : "border-border-input bg-bg-input focus:bg-bg-input-focus focus:border-primary focus:ring-2 focus:ring-primary-ring"
              }
              ${
                disabled
                  ? "bg-bg-disabled text-text-light border-border-main cursor-not-allowed"
                  : ""
              }
              ${inputClassName}`}
            {...restProps}
          />

          {/* Visibility Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition p-1 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error message or helper text */}
        {reserveErrorSpace ? (
          <div className="min-h-[14px] mt-1 flex items-start">
            {hasError ? (
              <ErrorMessage message={error} />
            ) : helperText ? (
              <p className="text-[11px] text-text-muted">{helperText}</p>
            ) : null}
          </div>
        ) : hasError ? (
          <div className="mt-1">
            <ErrorMessage message={error} />
          </div>
        ) : helperText ? (
          <p className="text-[11px] text-text-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

BasePassword.displayName = "BasePassword";

/**
 * Formik-connected Password wrapper
 */
const FormikPassword = forwardRef((props, ref) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (e) => {
    field.onChange(e);
    if (props.onChange) {
      props.onChange(e, helpers);
    }
  };

  return (
    <BasePassword
      ref={ref}
      {...field}
      {...props}
      value={field.value}
      onChange={handleChange}
      onBlur={field.onBlur}
      error={props.error || meta.error}
      touched={props.touched !== undefined ? props.touched : meta.touched}
    />
  );
});

FormikPassword.displayName = "FormikPassword";

/**
 * Dedicated Password Component.
 * Integrates with Formik when inside a Formik form and supplied a `name`.
 * Manages visibility toggle internally.
 */
const Password = forwardRef((props, ref) => {
  const formikContext = useContext(FormikContext);

  if (formikContext && props.name) {
    return <FormikPassword ref={ref} {...props} />;
  }

  return (
    <BasePassword
      ref={ref}
      {...props}
      touched={props.touched ?? (props.error ? true : false)}
    />
  );
});

Password.displayName = "Password";

export default Password;

