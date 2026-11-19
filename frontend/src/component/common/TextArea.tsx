import React, { useContext, forwardRef, TextareaHTMLAttributes } from "react";
import { useField, FormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | false | null;
  touched?: boolean;
  helperText?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

/**
 * Base TextArea element utilizing base.css theme tokens
 */
const BaseTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      rows = 4,
      required = false,
      disabled = false,
      error,
      touched = false,
      helperText,
      wrapperClassName = "",
      labelClassName = "",
      inputClassName = "",
      ...restProps
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(touched && error);

    return (
      <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-xs sm:text-sm font-medium transition-colors duration-200 ${
              hasError ? "text-danger" : "text-text-main"
            } ${labelClassName}`}
          >
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full p-3 text-text-main placeholder:text-text-placeholder placeholder:text-xs text-xs sm:text-sm border rounded-xl transition duration-200 outline-none resize-y
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

BaseTextArea.displayName = "BaseTextArea";

/**
 * Formik-connected TextArea wrapper
 */
const FormikTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const [field, meta] = useField(props.name || "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <BaseTextArea
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

FormikTextArea.displayName = "FormikTextArea";

/**
 * Dedicated TextArea Component.
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const formikContext = useContext(FormikContext);

  if (formikContext && props.name) {
    return <FormikTextArea ref={ref} {...props} />;
  }

  return (
    <BaseTextArea
      ref={ref}
      {...props}
      touched={props.touched ?? (props.error ? true : false)}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
