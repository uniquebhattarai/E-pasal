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
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../services/authService";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

function SidebarRow({ to, icon: Icon, bgColor, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 w-full px-3 py-2.5 transition-colors duration-150 group text-left cursor-pointer ${
          isActive
            ? "bg-gray-100/90 text-gray-900 font-bold"
            : "hover:bg-gray-50/80 text-gray-700 font-medium"
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
              isActive ? "text-gray-900 font-bold" : "text-gray-700 group-hover:text-gray-900"
            }`}
          >
            {label}
          </span>
          <ChevronRight
            size={13}
            className={`transition-all ml-auto shrink-0 ${
              isActive
                ? "text-gray-900 translate-x-0.5"
                : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5"
            }`}
            strokeWidth={isActive ? 2 : 1.6}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser(dispatch, navigate);
  };

  const isAdmin = user?.accountType === "Admin" || user?.role === "admin";

  return (
    <>
      <aside className="hidden md:flex w-60 lg:w-64 flex-col gap-3 shrink-0 select-none sticky top-20 self-start">
        
        {/* ── User Info Card ── */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {user?.image && !user.image.includes("dicebear.com") ? (
                <img
                  src={user.image}
                  alt={user?.firstName || "Profile"}
                  className="w-9 h-9 rounded-full border border-gray-100 object-cover shadow-2xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-[11px] font-bold shadow-2xs">
                  {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "My Account"}
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {user?.email || "Signed in"}
              </p>
            </div>
          </div>
        </div>

        {/* ── PROFILE INFO ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">
            Profile Info
          </p>
          <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden divide-y divide-gray-100 shadow-2xs">
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">
            Orders & Activity
          </p>
          <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden divide-y divide-gray-100 shadow-2xs">
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
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">
              Admin Management
            </p>
            <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden divide-y divide-gray-100 shadow-2xs">
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">
            Settings & More
          </p>
          <div className="rounded-xl border border-gray-200/80 bg-white overflow-hidden divide-y divide-gray-100 shadow-2xs">
            <SidebarRow
              to="/dashboard/settings"
              icon={SettingsIcon}
              bgColor="bg-[#6366F1]"
              label="Settings"
            />
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 hover:bg-red-50/70 active:bg-red-100/60 transition-colors duration-150 group text-left cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-150">
                <LogOut size={13.5} className="text-white" strokeWidth={2.2} />
              </span>
              <span className="text-xs sm:text-[12.5px] font-semibold text-red-600 flex-1 leading-none group-hover:text-red-700 transition-colors">
                Logout
              </span>
              <ChevronRight
                size={13}
                className="text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
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
