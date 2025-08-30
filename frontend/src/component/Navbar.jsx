import Logo from "../../public/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropDown from "../component/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <nav className="flex justify-between items-center h-14 max-w-6xl mx-auto">
      {/* Logo */}
      <NavLink to="/">
        <div className="ml-5">
          <img src={Logo} width={160} height={42} loading="lazy" />
        </div>
      </NavLink>

      {/* Menu */}
      <ul className="flex gap-x-6 font-medium text-slate-100">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-300" : "text-slate-100"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              isActive ? "text-yellow-300" : "text-slate-100"
            }
          >
            Category
          </NavLink>
        </li>
      </ul>

      {/* Right section */}
      <div className="flex items-center font-medium text-slate-100 mr-5 space-x-6">
        {/* Cart */}
        {user && user.accountType !== "Admin" && (
          <Link to="/cart" className="relative">
            <FaCartShopping className="text-2xl" />
            {totalItems > 0 && <span
            className="absolute -top-2 -right-2 flex items-center justify-center
                   w-5 h-5 rounded-full bg-white text-yellow-600 text-xs font-bold
                   animate-bounce shadow-md"
            >{totalItems}</span>}
          </Link>
        )}

        {/* Login / Signup or Profile Dropdown */}
        {token ? (
          <ProfileDropDown />
        ) : (
          <>
            <Link to="/login">
              <button className="border border-green-700 bg-green-800 px-3 py-1 rounded-xl">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="border border-green-700 bg-green-800 px-3 py-1 rounded-xl">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
