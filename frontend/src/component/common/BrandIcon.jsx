import React from "react";
import ColoredIcon from "../../../public/colored icon.png";

/**
 * E-Pasal Brand Icon component using colored icon.png
 */
export default function BrandIcon({
  size = "md",
  showName = false,
  name = "E-Pasal",
  className = "",
  imageClassName = "",
  nameClassName = "",
}) {
  const heightSizes = {
    sm: "h-8",
    md: "h-12 sm:h-14",
    lg: "h-16 sm:h-20",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const heightClass = heightSizes[size] || heightSizes.md;
  const textSizeClass = textSizes[size] || textSizes.md;

  return (
    <div className={`inline-flex items-center justify-center gap-3 select-none ${className}`}>
      <img
        src={ColoredIcon || "/colored icon.png"}
        alt={name}
        className={`${heightClass} w-auto object-contain ${imageClassName}`}
      />
      {showName && (
        <span
          className={`${textSizeClass} font-extrabold text-primary tracking-tight ${nameClassName}`}
        >
          {name}
        </span>
      )}
    </div>
  );
}
