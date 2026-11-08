import React from "react";
import Logo from "../../public/greenicon.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  User,
} from "lucide-react";
import ProfileDropDown from "../component/ProfileDropDown";
import { openAuthModal } from "../slices/AuthSlice";
import { Button } from "./common";
import { useIsMobile } from "../hooks/useMobile";

function Navbar() {
  const dispatch = useDispatch();
  // Call custom hook for viewport check
  const isMobile = useIsMobile();

  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const navLinks = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "category", label: "Category", href: "/category", icon: LayoutGrid },
  ];

  return (
    <>
      {/* ── TOP NAVBAR ─────────────────────────────────────────── */}
      <nav className="bg-white md:border-b md:border-border-main md:shadow-sm md:sticky md:top-0 md:z-40">
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
            </ul>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4 text-text-main">
              {/* Cart */}
              {(!user || user.accountType !== "Admin") && (
                <Link to="/cart" className="relative p-1">
                  <FaCartShopping className="text-xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 bg-yellow-400 text-green-900 text-[10px] font-bold rounded-full shadow animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

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
              {/* Cart in mobile header */}
              {(!user || user.accountType !== "Admin") && (
                <Link to="/cart" className="relative p-1 text-text-main" aria-label="Cart">
                  <FaCartShopping className="text-xl text-primary" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 bg-yellow-400 text-green-900 text-[10px] font-bold rounded-full shadow">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth button or Profile in mobile header */}
              {token ? (
                <ProfileDropDown />
              ) : (
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
      {isMobile && (
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
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 bg-yellow-400 text-green-900 text-[10px] font-bold rounded-full shadow">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Cart</span>
          </NavLink>
        )}

        {/* Profile */}
        {token ? (
          <NavLink
            to="/dashboard/my-profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1.5 transition ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-text-muted hover:text-primary"
              }`
            }
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={() => dispatch(openAuthModal("login"))}
            className="flex flex-col items-center justify-center flex-1 py-1.5 text-text-muted hover:text-primary transition cursor-pointer"
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
          </button>
        )}
      </nav>
    )}
  </>
  );
}

export default Navbar;
