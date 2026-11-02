import React, { useContext, forwardRef } from "react";
import { useField, FormikContext } from "formik";
import ErrorMessage from "./ErrorMessage.jsx";

/**
 * Base Checkbox element utilizing base.css theme tokens
 */
const BaseCheckbox = forwardRef(
  (
    {
      id,
      name,
      label,
      checked,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      error,
      touched = false,
      helperText,
      wrapperClassName = "",
      labelClassName = "",
      checkboxClassName = "",
      ...restProps
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(touched && error);

    return (
      <div className={`flex flex-col space-y-1 ${wrapperClassName}`}>
        <label
          htmlFor={inputId}
          className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium ${
            hasError ? "text-danger" : "text-text-main"
          } ${labelClassName}`}
        >
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
            checked={Boolean(checked)}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={`w-4 h-4 rounded border-border-input text-primary focus:ring-2 focus:ring-primary-ring transition duration-150 cursor-pointer ${checkboxClassName}`}
            {...restProps}
          />
          <span>
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </span>
        </label>

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

BaseCheckbox.displayName = "BaseCheckbox";

/**
 * Formik-connected Checkbox wrapper
 */
const FormikCheckbox = forwardRef((props, ref) => {
  const [field, meta, helpers] = useField({
    name: props.name,
    type: "checkbox",
  });

  const handleChange = (e) => {
    field.onChange(e);
    if (props.onChange) {
      props.onChange(e, helpers);
    }
  };

  return (
    <BaseCheckbox
      ref={ref}
      {...field}
      {...props}
      checked={field.checked}
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

