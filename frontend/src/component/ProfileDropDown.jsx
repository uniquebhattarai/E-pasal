import { useRef, useState, useEffect } from "react"
import { CircleUserRound, LogOut, Settings, Package, Heart, ChevronDown, ChevronRight, ShieldCheck } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser } from "../services/authService"
import LogoutConfirmationModal from "./LogoutConfirmationModal"

/* ── Avatar with initials fallback ───────────────────────────────────────── */
function Avatar({ src, firstName = "", lastName = "", size = "sm" }) {
  const [err, setErr] = useState(false)
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U"
  const dim = size === "lg" ? "w-9 h-9 text-xs" : "w-7 h-7 text-[11px]"

  return !src || err || src.includes("dicebear.com") ? (
    <span
      className={`${dim} rounded-full bg-gradient-to-br from-violet-500 to-purple-700 
                  flex items-center justify-center font-bold text-white flex-shrink-0 select-none shadow-xs`}
    >
      {initials}
    </span>
  ) : (
    <img
      src={src}
      alt={firstName}
      onError={() => setErr(true)}
      className={`${dim} rounded-full object-cover flex-shrink-0 shadow-xs`}
    />
  )
}

/* ── Single menu row ─────────────────────────────────────────────────────── */
function Row({ to, icon: Icon, bgColor, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3.5 py-2.5
                 hover:bg-gray-50/80 transition-colors duration-150 group"
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${bgColor} shadow-xs group-hover:scale-105 transition-transform duration-150`}
      >
        <Icon size={15} className="text-white" strokeWidth={2} />
      </span>
      <span className="text-[13px] font-semibold text-gray-800 flex-1 leading-none group-hover:text-gray-900 transition-colors">
        {label}
      </span>
      <ChevronRight
        size={14}
        className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
        strokeWidth={1.8}
      />
    </Link>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ProfileDropdown() {
  const { user }  = useSelector((s) => s.profile)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const close = () => setOpen(false)

  const handleLogout = async () => {
    setShowLogoutModal(false)
    await logoutUser(dispatch, navigate)
  }

  const isAdmin = user?.accountType === "Admin" || user?.role === "admin"

  return (
    <div className="relative" ref={ref}>

      {/* ── Trigger ── */}
      <button
        id="profile-dropdown-trigger"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 py-1 px-1.5 rounded-lg
                   hover:bg-gray-100/70 transition-colors duration-150 cursor-pointer"
      >
        <Avatar src={user?.image} firstName={user?.firstName || "U"} lastName={user?.lastName || ""} size="sm" />
        <span className="hidden sm:block text-sm font-medium text-gray-800 leading-none">
          {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Account"}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={close} />

          <div
            id="profile-dropdown-menu"
            className="absolute right-0 mt-3 w-64 z-50
                       bg-white rounded-2xl overflow-hidden
                       shadow-[0_12px_45px_rgba(0,0,0,0.12)]
                       border border-gray-100"
            style={{ animation: "slideDown .2s cubic-bezier(.22,1,.36,1) both" }}
          >

            {/* header */}
            <div className="px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Avatar
                    src={user?.image}
                    firstName={user?.firstName || "U"}
                    lastName={user?.lastName || ""}
                    size="lg"
                  />
                  {/* online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 
                                   rounded-full border-2 border-white shadow-xs" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 truncate leading-tight">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "My Account"}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {user?.email || "Signed in"}
                  </p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold
                                     bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full border border-violet-100">
                      <ShieldCheck size={9} /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* horizontal line under header */}
            <div className="h-px bg-gray-100" />

            {/* menu items with horizontal line between each */}
            <div className="divide-y divide-gray-100">
              <Row
                to="/dashboard/my-profile"
                icon={CircleUserRound}
                bgColor="bg-[#1877F2]"
                label="My Profile"
                onClick={close}
              />
              <Row
                to="/dashboard/my-orders"
                icon={Package}
                bgColor="bg-[#9333EA]"
                label="My Orders"
                onClick={close}
              />
              <Row
                to="/dashboard/wishlist"
                icon={Heart}
                bgColor="bg-[#F43F5E]"
                label="Wishlist"
                onClick={close}
              />
              <Row
                to="/dashboard/settings"
                icon={Settings}
                bgColor="bg-[#6366F1]"
                label="Settings"
                onClick={close}
              />
              <button
                onClick={() => {
                  close()
                  setShowLogoutModal(true)
                }}
                className="flex items-center gap-3 w-full px-3.5 py-2.5
                           hover:bg-red-50/70 transition-colors duration-150 group cursor-pointer text-left"
              >
                <span className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center
                                  flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-150">
                  <LogOut size={15} className="text-white" strokeWidth={2} />
                </span>
                <span className="text-[13px] font-semibold text-red-600 flex-1 leading-none group-hover:text-red-700 transition-colors">
                  Logout
                </span>
                <ChevronRight
                  size={14}
                  className="text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all ml-auto shrink-0"
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>
        </>
      )}

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </div>
  )
}
