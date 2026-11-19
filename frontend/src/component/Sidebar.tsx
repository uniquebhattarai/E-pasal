import React, { useState } from "react";
import {
  CircleUserRound,
  Package,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Users,
  Plus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";

interface SidebarRowProps {
  to: string;
  icon: React.ElementType;
  bgColor: string;
  label: string;
}

function SidebarRow({ to, icon: Icon, bgColor, label }: SidebarRowProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 w-full px-3 py-2.5 transition-colors duration-150 group text-left cursor-pointer ${
          isActive
            ? "bg-gray-100/90 dark:bg-[#282828] text-gray-900 dark:text-white font-bold"
            : "hover:bg-gray-50/80 dark:hover:bg-[#232323] text-gray-700 dark:text-[#cbd5e1] font-medium"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                        ${bgColor} shadow-2xs group-hover:scale-105 transition-transform duration-150`}
          >
            <Icon size={13.5} className="text-white" strokeWidth={2.2} />
          </span>
          <span
            className={`text-xs sm:text-[12.5px] flex-1 leading-none transition-colors ${
              isActive ? "text-gray-900 dark:text-white font-bold" : "text-gray-700 dark:text-[#cbd5e1] group-hover:text-gray-900 dark:group-hover:text-white"
            }`}
          >
            {label}
          </span>
          <ChevronRight
            size={13}
            className={`transition-all ml-auto shrink-0 ${
              isActive
                ? "text-gray-900 dark:text-white translate-x-0.5"
                : "text-gray-400 dark:text-[#64748b] group-hover:text-gray-600 dark:group-hover:text-[#94a3b8] group-hover:translate-x-0.5"
            }`}
            strokeWidth={isActive ? 2 : 1.6}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.profile);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser(dispatch, navigate);
  };

  const isAdmin = user?.accountType === "Admin" || (user as any)?.role === "admin";

  return (
    <>
      <aside className="hidden md:flex w-60 lg:w-64 flex-col gap-3 shrink-0 select-none sticky top-20 self-start">
        {/* ── User Info Card ── */}
        <div className="rounded-xl border border-gray-200/80 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] p-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {user?.image && !user.image.includes("dicebear.com") ? (
                <img
                  src={user.image}
                  alt={user?.firstName || "Profile"}
                  className="w-9 h-9 rounded-full border border-gray-100 dark:border-[#2e2e2e] object-cover shadow-2xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5891f8] to-[#0c61f6] flex items-center justify-center text-white text-[11px] font-bold shadow-2xs">
                  {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#202020] shadow-2xs" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "My Account"}
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-[#94a3b8] mt-0.5 truncate">
                {user?.email || "Signed in"}
              </p>
            </div>
          </div>
        </div>

        {/* ── PROFILE INFO ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider px-1 mb-1.5">
            Profile Info
          </p>
          <div className="rounded-xl border border-gray-200/80 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] overflow-hidden divide-y divide-gray-100 dark:divide-[#2e2e2e] shadow-2xs">
            <SidebarRow
              to="/dashboard/my-profile"
              icon={CircleUserRound}
              bgColor="bg-[#1877F2]"
              label="My Profile"
            />
          </div>
        </div>

        {/* ── ORDERS & ACTIVITY ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider px-1 mb-1.5">
            Orders & Activity
          </p>
          <div className="rounded-xl border border-gray-200/80 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] overflow-hidden divide-y divide-gray-100 dark:divide-[#2e2e2e] shadow-2xs">
            <SidebarRow
              to="/dashboard/my-orders"
              icon={Package}
              bgColor="bg-[#9333EA]"
              label="My Orders"
            />
            <SidebarRow
              to="/dashboard/wishlist"
              icon={Heart}
              bgColor="bg-[#F43F5E]"
              label="Wishlist"
            />
          </div>
        </div>

        {/* ── ADMIN MANAGEMENT (if Admin) ── */}
        {isAdmin && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider px-1 mb-1.5">
              Admin Management
            </p>
            <div className="rounded-xl border border-gray-200/80 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] overflow-hidden divide-y divide-gray-100 dark:divide-[#2e2e2e] shadow-2xs">
              <SidebarRow
                to="/dashboard/admin"
                icon={LayoutDashboard}
                bgColor="bg-blue-600"
                label="Dashboard"
              />
              <SidebarRow
                to="/dashboard/manage-users"
                icon={Users}
                bgColor="bg-violet-600"
                label="Manage Users"
              />
              <SidebarRow
                to="/dashboard/add-product"
                icon={Plus}
                bgColor="bg-teal-600"
                label="Add Product"
              />
            </div>
          </div>
        )}

        {/* ── SETTINGS & MORE ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider px-1 mb-1.5">
            Settings & More
          </p>
          <div className="rounded-xl border border-gray-200/80 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] overflow-hidden divide-y divide-gray-100 dark:divide-[#2e2e2e] shadow-2xs">
            <SidebarRow
              to="/dashboard/settings"
              icon={SettingsIcon}
              bgColor="bg-[#6366F1]"
              label="Settings"
            />
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-red-50/70 dark:hover:bg-red-950/30 active:bg-red-100/60 dark:active:bg-red-950/50 transition-colors duration-150 group text-left cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-150">
                <LogOut size={13.5} className="text-white" strokeWidth={2.2} />
              </span>
              <span className="text-xs sm:text-[12.5px] font-semibold text-red-600 dark:text-red-400 flex-1 leading-none group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                Logout
              </span>
              <ChevronRight
                size={13}
                className="text-red-300 dark:text-red-500/60 group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
                strokeWidth={1.6}
              />
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
