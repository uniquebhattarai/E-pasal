import React from "react";
import Logo from "../../public/colored icon.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import ProfileDropDown from "../component/ProfileDropDown";
import { openAuthModal } from "../slices/AuthSlice";
import { Button } from "./common";
import { useIsMobile } from "../hooks/useMobile";

function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  // Call custom hook for viewport check
  const isMobile = useIsMobile();

  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const { wishlistIds } = useSelector((state) => state.wishlist);

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
      <nav className={`bg-white border-b border-border-main shadow-xs sticky top-0 z-40 ${(isAccountPage || isCartPage || isCategoryDetailsPage) ? "hidden md:block" : ""}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">

            {/* Logo: small on mobile view, normal on desktop */}
            <Link to="/" className="flex items-center">
              <img
                src={Logo}
                className="h-6 sm:h-7 md:h-8 w-auto object-contain"
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
                        `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition ${
                          isActive
                            ? "bg-primary-light text-primary font-semibold"
                            : "text-text-muted hover:bg-primary-light hover:text-primary"
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
                      `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition ${
                        isActive
                          ? "bg-primary-light text-primary font-semibold"
                          : "text-text-muted hover:bg-primary-light hover:text-primary"
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
            <div className="hidden md:flex items-center gap-4 text-text-main">
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

            {/* Mobile Top Right Section (replaces hamburger button) */}
            <div className="flex md:hidden items-center gap-3">
              {/* Only show Log in button when not logged in. Cart & Profile are in bottom nav */}
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
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-main shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around pb-[max(0.25rem,env(safe-area-inset-bottom))]"
        >
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1.5 transition ${
              isActive
                ? "text-primary font-semibold"
                : "text-text-muted hover:text-primary"
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
            `flex flex-col items-center justify-center flex-1 py-1.5 transition ${
              isActive
                ? "text-primary font-semibold"
                : "text-text-muted hover:text-primary"
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
            `flex flex-col items-center justify-center flex-1 py-1.5 transition ${
              isActive || location.pathname === "/dashboard/wishlist" || location.pathname === "/wishlist"
                ? "text-primary font-semibold"
                : "text-text-muted hover:text-primary"
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
              `relative flex flex-col items-center justify-center flex-1 py-1.5 transition ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-text-muted hover:text-primary"
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
            `flex flex-col items-center justify-center flex-1 py-1.5 transition ${
              isActive || location.pathname.startsWith("/dashboard")
                ? "text-primary font-semibold"
                : "text-text-muted hover:text-primary"
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
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-[9px] font-bold text-white shrink-0 select-none">
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
