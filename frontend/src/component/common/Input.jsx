import React, { useContext, forwardRef } from "react";
import { useField, FormikContext } from "formik";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Base input field element utilizing base.css theme tokens
 */
const BaseInput = forwardRef(
  (
    {
      id,
      name,
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      onKeyDown,
      required = false,
      disabled = false,
      icon: Icon,
      rightIcon: RightIcon,
      error,
      touched = false,
      helperText,
      reserveErrorSpace = false,
      wrapperClassName = "",
      labelClassName = "",
      inputClassName = "",
      autoComplete,
      ...restProps
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(touched && error);

    const handleNumberKeyDown = (e) => {
      if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
        e.preventDefault();
      }
      if (onKeyDown) onKeyDown(e);
    };

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
          {/* Left Icon */}
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-light">
              {React.isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
          )}

          {/* Actual Input */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={handleNumberKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className={`w-full py-2.5 text-text-main placeholder:text-text-placeholder placeholder:text-xs text-sm border rounded-xl transition duration-200 outline-none
              ${Icon ? "pl-11" : "pl-4"}
              ${RightIcon ? "pr-11" : "pr-4"}
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

          {/* Right Icon */}
          {RightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light">
              {React.isValidElement(RightIcon) ? (
                RightIcon
              ) : (
                <RightIcon className="w-5 h-5" />
              )}
            </div>
          )}
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

BaseInput.displayName = "BaseInput";

/**
 * Formik-connected Input wrapper
 */
const FormikInput = forwardRef((props, ref) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (e) => {
    field.onChange(e);
    if (props.onChange) {
      props.onChange(e, helpers);
    }
  };

  return (
    <BaseInput
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

FormikInput.displayName = "FormikInput";

/**
 * Standard Input component.
 * Integrates with Formik when inside a Formik form and supplied a `name`.
 * Works standalone if outside Formik.
 */
const Input = forwardRef((props, ref) => {
  const formikContext = useContext(FormikContext);

  if (formikContext && props.name) {
    return <FormikInput ref={ref} {...props} />;
  }

  return (
    <BaseInput
      ref={ref}
      {...props}
      touched={props.touched ?? (props.error ? true : false)}
    />
  );
});

Input.displayName = "Input";

export default Input;
