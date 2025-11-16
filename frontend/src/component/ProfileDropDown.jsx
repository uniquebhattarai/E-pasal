import { useRef, useState, useEffect } from "react"
import { User, LogOut, Settings, Package, Heart, ChevronDown } from "lucide-react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

// Redux actions
import { setToken } from "../slices/AuthSlice"
import { setUser } from "../slices/ProfileSlice"
import { resetCart } from "../slices/CartSlice"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!user) return null

  // Logout Function
  const handleLogout = () => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    toast.success("Logged Out")
    navigate("/")
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white text-green-700 font-medium 
                   hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-green-500"
        />
        <span className="hidden sm:block font-semibold">{user?.firstName}</span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Mobile overlay */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 
                          border border-gray-100 overflow-hidden">
            
            {/* User Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.image}
                  alt={user?.firstName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Dashboard/My Profile */}
              <Link
                to="/dashboard/my-profile"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center 
                                group-hover:bg-green-200 transition-colors">
                  <User className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">My Profile</p>
                  <p className="text-xs text-gray-500">View and edit profile</p>
                </div>
              </Link>

              {/* Orders */}
              <Link
                to="/dashboard/orders"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center 
                                group-hover:bg-blue-200 transition-colors">
                  <Package className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">My Orders</p>
                  <p className="text-xs text-gray-500">Track your orders</p>
                </div>
              </Link>

              {/* Wishlist */}
              <Link
                to="/dashboard/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center 
                                group-hover:bg-pink-200 transition-colors">
                  <Heart className="w-4 h-4 text-pink-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Wishlist</p>
                  <p className="text-xs text-gray-500">Your saved items</p>
                </div>
              </Link>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center 
                                group-hover:bg-purple-200 transition-colors">
                  <Settings className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Settings</p>
                  <p className="text-xs text-gray-500">Account preferences</p>
                </div>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-red-600 
                           transition-colors w-full text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center 
                                group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4 text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Logout</p>
                  <p className="text-xs text-red-400">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
