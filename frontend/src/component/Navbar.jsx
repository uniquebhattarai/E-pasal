import React, { useState } from "react";
import Logo from "../../public/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import {
  Menu,
  X,
} from "lucide-react";
import ProfileDropDown from "../component/ProfileDropDown";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { id: "home", label: "Home", href: "/" },
    { id: "category", label: "Category", href: "/category" },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} width={150} height={40} alt="Logo" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-x-6 font-medium text-white">
            {navLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-white text-green-700 shadow-md"
                        : "hover:bg-green-500"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6 text-white">

            {/* Cart */}
            {user && user.accountType !== "Admin" && (
              <Link to="/cart" className="relative">
                <FaCartShopping className="text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-yellow-400 text-green-900 text-xs font-bold rounded-full shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {token ? (
              <ProfileDropDown />
            ) : (
              <>
                <Link to="/login">
                  <button className="border border-green-700 bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-white bg-green-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-900">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white"
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
          <div className="md:hidden bg-green-700 py-4 rounded-lg mt-2">
            <ul className="flex flex-col gap-2 text-white text-lg">

              {navLinks.map((link) => (
                <li key={link.id} className="px-4">
                  <NavLink
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block w-full px-3 py-2 rounded-md ${
                        isActive ? "bg-white text-green-700" : "hover:bg-green-500"
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
                <div className="flex flex-col gap-2 mt-3 px-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-white text-green-700 px-4 py-2 rounded-lg font-semibold">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-green-900 text-white px-4 py-2 rounded-lg font-semibold">
                      Sign up
                    </button>
                  </Link>
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
