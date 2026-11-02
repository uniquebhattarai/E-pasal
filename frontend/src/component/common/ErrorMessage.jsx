import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, className = "", showIcon = false }) => {
  if (!message) return null;

  return (
    <p
      className={`text-[11px] font-normal text-danger flex items-center gap-1 animate-fadeIn leading-tight ${className}`}
    >
      {showIcon && <AlertCircle className="w-3 h-3 shrink-0 text-danger" />}
      <span className="truncate">{message}</span>
    </p>
  );
};

export default ErrorMessage;
