import React, { useEffect } from "react";
import { Sun, Moon, Smartphone, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { ThemeMode } from "../../types";

export interface ThemeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeBottomSheet({ isOpen, onClose }: ThemeBottomSheetProps) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options: { id: ThemeMode; label: string; icon: React.ElementType; iconBg: string }[] = [
    {
      id: "light",
      label: "Light Mode",
      icon: Sun,
      iconBg: "bg-[#06b6d4]",
    },
    {
      id: "dark",
      label: "Dark Mode",
      icon: Moon,
      iconBg: "bg-[#8b5cf6]",
    },
    {
      id: "system",
      label: "System Default",
      icon: Smartphone,
      iconBg: "bg-[#3b82f6]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Card */}
      <div
        className="relative z-10 w-full sm:max-w-[420px] bg-white dark:bg-[#1e1e1e] rounded-t-2xl sm:rounded-2xl shadow-2xl px-4 pt-2.5 pb-6 sm:p-6 border-t sm:border border-gray-100 dark:border-[#2e2e2e] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        {/* Desktop Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="hidden sm:flex absolute top-4 right-4 w-7 h-7 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#282828] transition cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Mobile Grab Handle */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-[#4a4a4a] rounded-full mx-auto mb-2.5 sm:hidden" />

        {/* Title & Subtitle */}
        <h3
          id="theme-modal-title"
          className="text-base sm:text-[17px] font-bold text-[#0c61f6] dark:text-[#3b82f6] text-center tracking-tight"
        >
          Select a Theme
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#94a3b8] text-center mt-0.5 mb-3.5 sm:mb-4">
          You can change theme from system settings
        </p>

        {/* Theme Options */}
        <div className="space-y-2 sm:space-y-2.5">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                }}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gray-100/90 dark:bg-[#282828] border-gray-300 dark:border-[#444444] shadow-2xs"
                    : "bg-gray-50/60 dark:bg-[#242424] border-gray-200/70 dark:border-[#303030] hover:bg-gray-100/70 dark:hover:bg-[#282828]"
                }`}
              >
                {/* Left Icon & Label */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span
                    className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs ${opt.iconBg}`}
                  >
                    <Icon size={15} strokeWidth={2.2} />
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-gray-900 dark:text-white">
                    {opt.label}
                  </span>
                </div>

                {/* Right Radio Indicator */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-[1.5px] border-[#0c61f6] dark:border-[#3b82f6]"
                      : "border-[1.5px] border-gray-300 dark:border-[#525252]"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#0c61f6] dark:bg-[#3b82f6]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
