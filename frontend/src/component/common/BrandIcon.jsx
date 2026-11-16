import React from "react";
import ColoredIcon from "../../../public/colored icon.png";
import WhiteLogo from "../../../public/logo.png";
import { useTheme } from "../../context/ThemeContext";

/**
 * E-Pasal Brand Icon component using colored icon.png (light) and logo.png (dark)
 */
export default function BrandIcon({
  size = "md",
  showName = false,
  name = "E-Pasal",
  className = "",
  imageClassName = "",
  nameClassName = "",
}) {
  const { isDark } = useTheme();

  const heightSizes = {
    sm: isDark ? "h-20 -my-5" : "h-8",
    md: isDark ? "h-28 -my-7 sm:h-32 sm:-my-8" : "h-12 sm:h-14",
    lg: isDark ? "h-36 -my-9 sm:h-44 sm:-my-11" : "h-16 sm:h-20",
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
        src={isDark ? WhiteLogo : (ColoredIcon || "/colored icon.png")}
        alt={name}
        className={`${heightClass} w-auto object-contain ${imageClassName}`}
      />
      {showName && (
        <span
          className={`${textSizeClass} font-extrabold text-primary dark:text-white tracking-tight ${nameClassName}`}
        >
          {name}
        </span>
      )}
    </div>
  );
}
