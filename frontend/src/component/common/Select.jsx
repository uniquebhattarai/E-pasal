import React, { useContext, forwardRef } from "react";
import { useField, FormikContext } from "formik";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Base Select element utilizing base.css theme tokens
 */
const BaseSelect = forwardRef(
  (
    {
      id,
      name,
      label,
      placeholder = "Select an option",
      options = [],
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      touched = false,
      helperText,
      wrapperClassName = "",
      labelClassName = "",
      selectClassName = "",
      ...restProps
    },
    ref
  ) => {
    const selectId = id || name;
    const hasError = Boolean(touched && error);

    return (
      <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={`block text-sm font-semibold transition-colors duration-200 ${
              hasError ? "text-danger" : "text-text-main"
            } ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        {/* Select element */}
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`w-full py-3 px-4 text-text-main text-sm md:text-base border rounded-xl transition duration-200 outline-none cursor-pointer
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
            ${selectClassName}`}
          {...restProps}
        >
          {placeholder && (
            <option value="" disabled className="text-text-placeholder">
              {placeholder}
            </option>
          )}
          {options.map((opt, idx) => {
            const optValue = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={idx} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>

        {/* Error message or helper text */}
        {hasError ? (
          <ErrorMessage message={error} />
        ) : helperText ? (
          <p className="text-xs text-text-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";

/**
 * Formik-connected Select wrapper
 */
const FormikSelect = forwardRef((props, ref) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (e) => {
    field.onChange(e);
    if (props.onChange) {
      props.onChange(e, helpers);
    }
  };

  return (
    <BaseSelect
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

FormikSelect.displayName = "FormikSelect";

/**
 * Dedicated Select / Dropdown Component.
 * Integrates with Formik when inside a Formik form and supplied a `name`.
 */
const Select = forwardRef((props, ref) => {
  const formikContext = useContext(FormikContext);

  if (formikContext && props.name) {
    return <FormikSelect ref={ref} {...props} />;
  }

  return (
    <BaseSelect
      ref={ref}
      {...props}
      touched={props.touched ?? (props.error ? true : false)}
    />
  );
});

Select.displayName = "Select";

export default Select;

