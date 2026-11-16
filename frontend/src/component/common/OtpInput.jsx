import React, { useRef, useEffect } from "react";

/**
 * Custom OtpInput component conforming to the project's design standard.
 * Features:
 * - Proper width & height with clean rounded-xl borders
 * - Consistent, even spacing across all slots
 * - Empty placeholder (no dashes)
 * - Automatic focus progression on typing
 * - Backspace jumps to previous box and clears
 * - Full paste handling (splits 6-digit text across all inputs)
 * - Arrow key navigation
 * - Only permits numeric digits
 */
export default function OtpInput({
  value = "",
  onChange,
  numInputs = 6,
  hasError = false,
  disabled = false,
  autoFocus = true,
  className = "",
}) {
  const inputRefs = useRef([]);

  // Ensure value is safe string
  const strVal = String(value || "");

  // Auto focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const setInputValue = (newOtp) => {
    if (onChange) {
      onChange(newOtp);
    }
  };

  const handleChange = (e, index) => {
    const rawVal = e.target.value;
    // Keep only numeric characters
    const digitsOnly = rawVal.replace(/\D/g, "");

    if (!digitsOnly) {
      // Cleared
      const otpArr = strVal.split("");
      otpArr[index] = "";
      setInputValue(otpArr.join(""));
      return;
    }

    // If typing single digit
    const digit = digitsOnly.slice(-1);
    const otpArr = strVal.split("");
    // Pad to length
    while (otpArr.length < numInputs) {
      otpArr.push("");
    }
    otpArr[index] = digit;
    const newOtp = otpArr.slice(0, numInputs).join("");
    setInputValue(newOtp);

    // Auto advance to next slot
    if (index < numInputs - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const currentVal = strVal[index] || "";
      if (!currentVal && index > 0 && inputRefs.current[index - 1]) {
        // Move to previous and clear it
        e.preventDefault();
        const otpArr = strVal.split("");
        otpArr[index - 1] = "";
        setInputValue(otpArr.join(""));
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < numInputs - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain");
    const digitsOnly = pasted.replace(/\D/g, "").slice(0, numInputs);
    if (!digitsOnly) return;

    setInputValue(digitsOnly);

    // Focus slot after the last filled digit
    const nextIndex = Math.min(digitsOnly.length, numInputs - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-3 sm:gap-4 md:gap-4.5 w-full ${className}`}
      onPaste={handlePaste}
    >
      {Array.from({ length: numInputs }).map((_, idx) => {
        const char = strVal[idx] || "";
        const isFilled = Boolean(char);

        return (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={char}
            disabled={disabled}
            placeholder=""
            aria-label={`Digit ${idx + 1}`}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onFocus={(e) => e.target.select()}
            className={`w-[46px] h-[54px] sm:w-[50px] sm:h-[58px] md:w-[52px] md:h-[60px] shrink-0 text-center !text-xl sm:!text-2xl font-bold rounded-xl border outline-none transition duration-150 select-none
              ${
                hasError
                  ? "border-danger bg-danger-light/30 text-danger focus:border-danger focus:ring-2 focus:ring-danger-ring"
                  : isFilled
                  ? "border-primary bg-primary-light/10 text-primary focus:border-primary focus:ring-2 focus:ring-primary-ring shadow-2xs"
                  : "border-border-input bg-bg-input text-text-main focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary-ring"
              }
              ${disabled ? "bg-bg-disabled text-text-light cursor-not-allowed" : "cursor-text"}
            `}
          />
        );
      })}
    </div>
  );
}
