import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  Package,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Sun,
  Moon,
} from "lucide-react";
import { userdetails } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { logoutUser } from "../services/authService";
import { openAuthModal } from "../slices/AuthSlice";
import LogoutConfirmationModal from "../component/LogoutConfirmationModal";
import { useTheme } from "../context/ThemeContext";
import { ThemeBottomSheet } from "../component/common";
import { User } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";

interface MenuRowProps {
  icon: React.ElementType;
  bgColor: string;
  label: string;
  onClick: () => void;
}

function MenuRow({ icon: Icon, bgColor, label, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 sm:gap-3.5 w-full px-3.5 sm:px-4 py-2.5 sm:py-3
                 hover:bg-gray-50/80 dark:hover:bg-[#262626] active:bg-gray-100/70 dark:active:bg-[#282828] transition-colors duration-150 group text-left cursor-pointer"
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${bgColor} shadow-xs group-hover:scale-105 transition-transform duration-150`}
      >
        <Icon size={15} className="text-white" strokeWidth={2} />
      </span>
      <span className="text-[13px] sm:text-[13.5px] font-semibold text-gray-800 dark:text-gray-200 flex-1 leading-none group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        {label}
      </span>
      <ChevronRight
        size={14}
        className="text-gray-400 dark:text-[#64748b] group-hover:text-gray-600 dark:group-hover:text-[#94a3b8] group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
        strokeWidth={1.8}
      />
    </button>
  );
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const reduxUser = useAppSelector((state) => state.profile.user);
  const token = useAppSelector((state) => state.auth.token);
  const { theme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fetchUser = async () => {
    if (!token) return;
    try {
      const result = await ApiConnector("GET", userdetails.USER_DETAILS_API);
      if (result.data.success) {
        setUser(result.data.data);
      }
    } catch (error) {
      console.log("Could not fetch user", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const currentUser = user || reduxUser;

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser(dispatch, navigate);
  };

  const handleProtectedAction = (path: string) => {
    if (!token) {
      dispatch(openAuthModal("login"));
      return;
    }
    navigate(path);
  };

  return (
    <div className="pb-12 w-full max-w-xl sm:max-w-2xl mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4">
      {/* Top Left Title */}
      <h1 className="text-sm font-semibold text-gray-700 dark:text-white mb-2.5 px-0.5 tracking-tight">
        Account
      </h1>

      {/* ── Top User Card ── */}
      {token ? (
        <div className="rounded-2xl border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] px-3.5 sm:px-4 py-3 shadow-xs mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentUser?.image && !currentUser.image.includes("dicebear.com") ? (
                <img
                  src={currentUser.image}
                  alt={currentUser?.firstName || "Profile"}
                  className="w-10 h-10 rounded-full border border-gray-100 dark:border-[#2e2e2e] shadow-xs object-cover bg-white dark:bg-[#171717]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5891f8] to-[#0c61f6] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {`${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#202020] shadow-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[13.5px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
                {currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() : "My Account"}
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-[#94a3b8] mt-0.5 truncate">
                {currentUser?.email || "Signed in"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-100/90 dark:border-[#2e2e2e] bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-white dark:from-[#202020] dark:via-[#202020]/90 dark:to-[#202020] p-4 shadow-xs mb-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
            <UserIcon size={24} strokeWidth={2.2} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Let's get started
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => dispatch(openAuthModal("login"))}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#282828] text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#333333] active:scale-95 transition shadow-2xs cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => dispatch(openAuthModal("signup"))}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-primary text-white text-xs font-semibold hover:opacity-95 active:scale-95 transition shadow-2xs cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Menu Card ── */}
      <div className="rounded-2xl border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] overflow-hidden divide-y divide-gray-100 dark:divide-[#2e2e2e] shadow-xs mb-3">
        <MenuRow
          icon={CircleUserRound}
          bgColor="bg-[#1877F2]"
          label="My Profile"
          onClick={() => handleProtectedAction("/dashboard/my-profile")}
        />
        <MenuRow
          icon={Package}
          bgColor="bg-[#9333EA]"
          label="My Orders"
          onClick={() => handleProtectedAction("/dashboard/my-orders")}
        />
        <MenuRow
          icon={Heart}
          bgColor="bg-[#F43F5E]"
          label="Wishlist"
          onClick={() => navigate("/dashboard/wishlist")}
        />
        <MenuRow
          icon={SettingsIcon}
          bgColor="bg-[#6366F1]"
          label="Settings"
          onClick={() => handleProtectedAction("/dashboard/settings")}
        />

        {/* Theme row */}
        <button
          type="button"
          onClick={() => setShowThemeSheet(true)}
          className="flex items-center gap-3 sm:gap-3.5 w-full px-3.5 sm:px-4 py-2.5 sm:py-3
                     hover:bg-gray-50/80 dark:hover:bg-[#262626] active:bg-gray-100/70 dark:active:bg-[#282828] transition-colors duration-150 group text-left cursor-pointer"
        >
          <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-500/10 dark:bg-amber-400/15 text-amber-500 dark:text-amber-400 shadow-xs group-hover:scale-105 transition-transform duration-150">
            {resolvedTheme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-[13px] sm:text-[13.5px] font-semibold text-gray-800 dark:text-gray-200 leading-none group-hover:text-gray-900 dark:group-hover:text-white transition-colors block">
              Theme
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#94a3b8] mt-0.5 block leading-tight">
              {theme === "system" ? "System Default" : theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <ChevronRight
            size={14}
            className="text-gray-400 dark:text-[#64748b] group-hover:text-gray-600 dark:group-hover:text-[#94a3b8] group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
            strokeWidth={1.8}
          />
        </button>

        {token && (
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 sm:gap-3.5 w-full px-3.5 sm:px-4 py-2.5 sm:py-3
                       hover:bg-red-50/70 dark:hover:bg-red-950/30 active:bg-red-100/60 dark:active:bg-red-950/50 transition-colors duration-150 group text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center
                              flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-150">
              <LogOut size={15} className="text-white" strokeWidth={2} />
            </span>
            <span className="text-[13px] sm:text-[13.5px] font-semibold text-red-600 dark:text-red-400 flex-1 leading-none group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
              Logout
            </span>
            <ChevronRight
              size={14}
              className="text-red-300 dark:text-red-500/60 group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
              strokeWidth={1.8}
            />
          </button>
        )}
      </div>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <ThemeBottomSheet
        isOpen={showThemeSheet}
        onClose={() => setShowThemeSheet(false)}
      />
    </div>
  );
}
