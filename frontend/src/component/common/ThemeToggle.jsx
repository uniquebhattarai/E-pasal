import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({
  variant = "icon", // "icon" | "pill" | "select"
  className = "",
  size = "md",
}) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const currentIconSize = iconSizes[size] || 18;

  // Icon-only button (perfect for Navbar / Header)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        className={`relative inline-flex items-center justify-center rounded-xl p-2
          text-gray-600 hover:text-primary hover:bg-gray-100/80
          dark:text-gray-300 dark:hover:text-primary dark:hover:bg-[#202020]
          transition-all duration-200 active:scale-95 cursor-pointer
          border-0 outline-none focus:outline-none
          ${sizeClasses[size] || sizeClasses.md} ${className}`}
      >
        <span className="sr-only">Toggle theme</span>
        <Sun
          size={currentIconSize}
          className={`transform transition-all duration-300 absolute ${isDark
            ? "rotate-0 scale-100 opacity-100 text-amber-400"
            : "-rotate-90 scale-0 opacity-0"
            }`}
        />
        <Moon
          size={currentIconSize}
          className={`transform transition-all duration-300 absolute ${isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-gray-700"
            }`}
        />
      </button>
    );
  }

  // 3-option Segmented Pill (perfect for Settings page)
  if (variant === "pill") {
    const options = [
      { id: "light", label: "Light", icon: Sun },
      { id: "system", label: "System", icon: Monitor },
      { id: "dark", label: "Dark", icon: Moon },
    ];

    return (
      <div
        role="group"
        aria-label="Theme options"
        className={`inline-flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-[#2e2e2e] ${className}`}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${isActive
                ? "bg-white dark:bg-[#171717] text-primary dark:text-primary shadow-2xs border border-gray-200/80 dark:border-[#2e2e2e]"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <Icon size={14} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return null;
}
