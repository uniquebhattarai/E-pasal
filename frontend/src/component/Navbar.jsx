import React, { useState } from "react";
import Logo from "../../public/greenicon.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import {
  Menu,
  X,
} from "lucide-react";
import ProfileDropDown from "../component/ProfileDropDown";
import { openAuthModal } from "../slices/AuthSlice";
import { Button } from "./common";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { id: "home", label: "Home", href: "/" },
    { id: "category", label: "Category", href: "/category" },
  ];

  return (
    <nav className="bg-white border-b border-border-main shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} className="h-8 w-auto object-contain" alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-x-1.5 font-medium">
            {navLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition ${
                      isActive
                        ? "bg-primary-light text-primary font-semibold"
                        : "text-text-muted hover:bg-primary-light hover:text-primary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4 text-text-main">

            {/* Cart */}
            {user && user.accountType !== "Admin" && (
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-text-main"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border border-border-main py-4 rounded-lg mt-2 mb-3 shadow-sm">
            <ul className="flex flex-col gap-2 text-text-main text-base">

              {navLinks.map((link) => (
                <li key={link.id} className="px-4">
                  <NavLink
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md ${
                        isActive ? "bg-primary-light text-primary font-semibold" : "hover:bg-primary-light"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {/* Cart in Mobile */}
              {user && user.accountType !== "Admin" && (
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative px-4 flex items-center gap-3 py-2"
                >
                  <FaCartShopping className="text-2xl" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-auto flex items-center justify-center w-5 h-5 bg-yellow-400 text-green-900 text-xs font-bold rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth Buttons */}
              {!token && (
                <div className="mt-3 px-4">
                  <Button
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      dispatch(openAuthModal("login"));
                    }}
                  >
                    Log in
                  </Button>
                </div>
              )}

              {/* Profile Dropdown in mobile */}
              {token && (
                <div className="px-4 mt-2">
                  <ProfileDropDown mobile />
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
