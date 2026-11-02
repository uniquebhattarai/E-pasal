import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <p
      className={`text-xs font-medium text-danger mt-1.5 flex items-center gap-1.5 animate-fadeIn ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-danger" />
      <span>{message}</span>
    </p>
  );
};

export default ErrorMessage;
