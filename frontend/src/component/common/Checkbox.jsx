import React, { useContext, forwardRef } from "react";
import { useField, FormikContext } from "formik";
import { Check } from "lucide-react";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Base Checkbox element with custom theme styling (Theme Green, no browser blue).
 */
const BaseCheckbox = forwardRef(
  (
    {
      id,
      name,
      label,
      checked = true,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      touched = false,
      helperText,
      reserveErrorSpace = false,
      wrapperClassName = "",
      labelClassName = "",
      boxClassName = "",
      ...restProps
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(touched && error);
    const isChecked = Boolean(checked);

    return (
      <div className={`flex flex-col ${wrapperClassName}`}>
        <label
          htmlFor={inputId}
          className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-medium ${hasError ? "text-danger" : "text-text-main"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${labelClassName}`}
        >
          {/* Hidden native input for keyboard accessibility & events */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className="sr-only peer"
            {...restProps}
          />

          {/* Custom Styled Checkbox Box (Theme Green: bg-primary, border-primary) */}
          <span
            aria-hidden="true"
            className={`w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center shrink-0 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-ring
              ${isChecked
                ? "bg-primary border-primary text-white shadow-xs"
                : hasError
                  ? "border-danger bg-white hover:border-danger"
                  : "border-border-input bg-white hover:border-primary"
              }
              ${disabled ? "bg-bg-disabled border-border-main" : ""}
              ${boxClassName}`}
          >
            {isChecked && (
              <Check className="w-3 h-3 text-white stroke-[3] animate-fadeIn" />
            )}
          </span>

          {/* Label Text */}
          {label && (
            <span className="leading-tight">
              {label}
              {required && <span className="text-danger ml-0.5">*</span>}
            </span>
          )}
        </label>

        {/* Error message or helper text */}
        {reserveErrorSpace ? (
          <div className="min-h-[14px] mt-0.5 flex items-start">
            {hasError ? (
              <ErrorMessage message={error} />
            ) : helperText ? (
              <p className="text-[11px] text-text-muted">{helperText}</p>
            ) : null}
          </div>
        ) : hasError ? (
          <div className="mt-0.5">
            <ErrorMessage message={error} />
          </div>
        ) : helperText ? (
          <p className="text-[11px] text-text-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

BaseCheckbox.displayName = "BaseCheckbox";

/**
 * Formik-connected Checkbox wrapper
 */
const FormikCheckbox = forwardRef((props, ref) => {
  const [field, meta, helpers] = useField({
    name: props.name,
    type: "checkbox",
  });

  const isChecked = Boolean(field.value);

  const handleChange = (e) => {
    const nextVal = e.target.checked;
    helpers.setValue(nextVal);
    helpers.setTouched(true);
    if (props.onChange) {
      props.onChange(e, helpers);
    }
  };

  // Exclude value from field to prevent Formik multi-checkbox array bug
  // eslint-disable-next-line no-unused-vars
  const { value, ...fieldRest } = field;

  return (
    <BaseCheckbox
      ref={ref}
      id={props.id || props.name}
      {...fieldRest}
      {...props}
      checked={isChecked}
      onChange={handleChange}
      onBlur={field.onBlur}
      error={props.error || meta.error}
      touched={props.touched !== undefined ? props.touched : meta.touched}
    />
  );
});

FormikCheckbox.displayName = "FormikCheckbox";

/**
 * Dedicated Checkbox Component.
 * Integrates with Formik when inside a Formik form and supplied a `name`.
 */
const Checkbox = forwardRef((props, ref) => {
  const formikContext = useContext(FormikContext);

  if (formikContext && props.name) {
    return <FormikCheckbox ref={ref} {...props} />;
  }

  return (
    <BaseCheckbox
      ref={ref}
      {...props}
      touched={props.touched ?? (props.error ? true : false)}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
