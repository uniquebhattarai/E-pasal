import React from "react";
import Logo from "../../public/colored icon.png";
import WhiteLogo from "../../public/logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import ProfileDropDown from "./ProfileDropDown";
import { openAuthModal } from "../slices/AuthSlice";
import { Button, ThemeToggle } from "./common";
import { useIsMobile } from "../hooks/useMobile";
import { useTheme } from "../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";

function Navbar() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();

  const token = useAppSelector((state) => state.auth.token);
  const { user } = useAppSelector((state) => state.profile);
  const { totalItems } = useAppSelector((state) => state.cart);

  const isAccountPage = location.pathname.startsWith("/dashboard");
  const isCartPage = location.pathname === "/cart";
  const isCategoryDetailsPage = location.pathname.startsWith("/category/");
  const hideBottomNav = isCartPage && Boolean(token) && totalItems > 0;

  const navLinks = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "category", label: "Category", href: "/category", icon: LayoutGrid },
  ];

  return (
    <>
      {/* ── TOP NAVBAR ─────────────────────────────────────────── */}
      <nav className={`bg-white dark:bg-[#171717] border-b-0 md:border-b border-border-main dark:border-[#2e2e2e] shadow-none md:shadow-xs relative md:sticky md:top-0 z-40 ${(isAccountPage || isCartPage || isCategoryDetailsPage) ? "hidden md:block" : ""}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={isDark ? WhiteLogo : Logo}
                className={`w-auto object-contain ${isDark
                  ? "h-[84px] sm:h-[102px] md:h-[124px] -my-[30px] sm:-my-[37px] md:-my-[46px] -ml-[10px] sm:-ml-[13px] md:-ml-[16px]"
                  : "h-6 sm:h-7 md:h-8"
                  } dark:h-[84px] dark:sm:h-[102px] dark:md:h-[124px] dark:-my-[30px] dark:sm:-my-[37px] dark:md:-my-[46px] dark:-ml-[10px] dark:sm:-ml-[13px] dark:md:-ml-[16px]`}
                alt="Logo"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-x-1.5 font-medium">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.id}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition ${isActive
                          ? "bg-primary-light text-primary dark:text-white dark:bg-white/10 font-semibold"
                          : "text-text-muted hover:bg-primary-light hover:text-primary dark:hover:bg-white/5 dark:hover:text-white"
                        }`
                      }
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" />}
                      <span>{link.label}</span>
                    </NavLink>
                  </li>
                );
              })}

              {/* Cart link placed just right of Category */}
              {(!user || user.accountType !== "Admin") && (
                <li>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition ${isActive
                        ? "bg-primary-light text-primary dark:text-white dark:bg-white/10 font-semibold"
                        : "text-text-muted hover:bg-primary-light hover:text-primary dark:hover:bg-white/5 dark:hover:text-white"
                      }`
                    }
                    aria-label="Cart"
                  >
                    <span className="relative flex items-center">
                      <ShoppingCart className="w-4 h-4 shrink-0" />
                      {Boolean(token) && totalItems > 0 && (
                        <span className={`absolute -top-2 -right-2.5 flex items-center justify-center ${totalItems > 9 ? "min-w-[17px] px-1 h-[17px]" : "w-[17px] h-[17px]"} aspect-square bg-gradient-primary text-white text-[9.5px] font-bold rounded-full shadow-xs leading-none animate-bounce`}>
                          {totalItems}
                        </span>
                      )}
                    </span>
                    <span>Cart</span>
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-2.5 text-text-main">
              <ThemeToggle size="md" />

              {/* Auth */}
              {token ? (
                <ProfileDropDown />
              ) : (
                <Button
                  size="sm"
                  onClick={() => dispatch(openAuthModal("login"))}
                >
                  Log in
                </Button>
              )}
            </div>

            {/* Mobile Top Right Section */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle size="sm" />

              {!token && (
                <Button
                  size="sm"
                  onClick={() => dispatch(openAuthModal("login"))}
                  className="text-xs px-3 py-1"
                >
                  Log in
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ───────────────────────── */}
      {isMobile && !hideBottomNav && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#171717] border-t border-border-main dark:border-[#2e2e2e] shadow-[0_-2px_10px_rgba(0,0,0,0.2)] px-2 py-1 flex items-center justify-around pb-[max(0.25rem,env(safe-area-inset-bottom))] transition-colors duration-200"
        >
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 transition ${isActive
                ? "text-primary dark:text-white font-semibold"
                : "text-text-muted hover:text-primary dark:hover:text-white"
              }`
            }
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
          </NavLink>

          {/* Category */}
          <NavLink
            to="/category"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 transition ${isActive
                ? "text-primary dark:text-white font-semibold"
                : "text-text-muted hover:text-primary dark:hover:text-white"
              }`
            }
          >
            <LayoutGrid className="w-5 h-5 shrink-0" />
            <span className="text-[11px] mt-0.5 tracking-tight">Category</span>
          </NavLink>

          {/* Wishlist (Mobile only) */}
          <NavLink
            to="/dashboard/wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 transition ${isActive || location.pathname === "/dashboard/wishlist" || location.pathname === "/wishlist"
                ? "text-primary dark:text-white font-semibold"
                : "text-text-muted hover:text-primary dark:hover:text-white"
              }`
            }
          >
            <Heart className="w-5 h-5 shrink-0" />
            <span className="text-[11px] mt-0.5 tracking-tight">Wishlist</span>
          </NavLink>

          {/* Cart */}
          {(!user || user.accountType !== "Admin") && (
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center flex-1 py-1.5 transition ${isActive
                  ? "text-primary dark:text-white font-semibold"
                  : "text-text-muted hover:text-primary dark:hover:text-white"
                }`
              }
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 shrink-0" />
                {Boolean(token) && totalItems > 0 && (
                  <span className={`absolute -top-1.5 -right-2.5 flex items-center justify-center ${totalItems > 9 ? "min-w-[17px] px-1 h-[17px]" : "w-[17px] h-[17px]"} aspect-square bg-gradient-primary text-white text-[9.5px] font-bold rounded-full shadow-xs leading-none animate-bounce`}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">Cart</span>
            </NavLink>
          )}

          {/* Profile / Account */}
          <NavLink
            to="/dashboard/account"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 transition ${isActive || location.pathname.startsWith("/dashboard")
                ? "text-primary dark:text-white font-semibold"
                : "text-text-muted hover:text-primary dark:hover:text-white"
              }`
            }
          >
            {token && user?.image && !user.image.includes("dicebear.com") ? (
              <img
                src={user.image}
                alt={user?.firstName || "Profile"}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            ) : token ? (
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#5891f8] to-[#0c61f6] flex items-center justify-center text-[9px] font-bold text-white shrink-0 select-none">
                {`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U"}
              </span>
            ) : (
              <User className="w-5 h-5 shrink-0" />
            )}
            <span className="text-[11px] mt-0.5 tracking-tight">Account</span>
          </NavLink>
        </nav>
      )}
    </>
  );
}

export default Navbar;
