import { useRef, useState, useEffect } from "react"
import { User, LogOut, Settings, Package, Heart, ChevronDown, ShieldCheck } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import { setToken } from "../slices/AuthSlice"
import { setUser } from "../slices/ProfileSlice"
import { resetCart } from "../slices/CartSlice"

/* ── Avatar with initials fallback ───────────────────────────────────────── */
function Avatar({ src, firstName = "", lastName = "", size = "sm" }) {
  const [err, setErr] = useState(false)
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U"
  const dim = size === "lg" ? "w-11 h-11 text-sm" : "w-8 h-8 text-xs"

  return !src || err ? (
    <span
      className={`${dim} rounded-full bg-gradient-to-br from-violet-500 to-purple-700 
                  flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
    >
      {initials}
    </span>
  ) : (
    <img
      src={src}
      alt={firstName}
      onError={() => setErr(true)}
      className={`${dim} rounded-full object-cover flex-shrink-0`}
    />
  )
}

/* ── Single menu row ─────────────────────────────────────────────────────── */
function Row({ to, icon: Icon, color, label, sub, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                 hover:bg-gray-50 transition-colors duration-150 group"
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${color} group-hover:scale-110 transition-transform duration-150`}
      >
        <Icon size={15} />
      </span>
      <span className="min-w-0">
        <p className="text-[13px] font-semibold text-gray-800 leading-tight">{label}</p>
        <p className="text-[11px] text-gray-400 leading-tight">{sub}</p>
      </span>
    </Link>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ProfileDropdown() {
  const { user }  = useSelector((s) => s.profile)
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!user) return null

  const close = () => setOpen(false)

  const handleLogout = () => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged out successfully!")
    navigate("/")
    close()
  }

  const isAdmin = user?.accountType === "Admin" || user?.role === "admin"

  return (
    <div className="relative" ref={ref}>

      {/* ── Trigger ── */}
      <button
        id="profile-dropdown-trigger"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 p-1 pr-2.5 rounded-full
                   bg-white/15 hover:bg-white/25 backdrop-blur-sm
                   border border-white/20 hover:border-white/40
                   transition-all duration-200"
      >
        <Avatar src={user?.image} firstName={user?.firstName} lastName={user?.lastName} size="sm" />
        <span className="hidden sm:block text-sm font-semibold text-white">
          {user?.firstName}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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
                       shadow-[0_8px_40px_rgba(0,0,0,0.18)]
                       border border-gray-100"
            style={{ animation: "slideDown .2s cubic-bezier(.22,1,.36,1) both" }}
          >

            {/* header */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar
                    src={user?.image}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    size="lg"
                  />
                  {/* online dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 
                                   rounded-full border-2 border-gray-950" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-black truncate leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold
                                     bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={9} /> Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* menu */}
            <div className="p-2 space-y-0.5">
              <Row
                to="/dashboard/my-profile"
                icon={User}
                color="bg-emerald-100 text-emerald-700"
                label="My Profile"
                sub="View and edit profile"
                onClick={close}
              />
              <Row
                to="/dashboard/orders"
                icon={Package}
                color="bg-blue-100 text-blue-700"
                label="My Orders"
                sub="Track your orders"
                onClick={close}
              />
              <Row
                to="/dashboard/wishlist"
                icon={Heart}
                color="bg-rose-100 text-rose-600"
                label="Wishlist"
                sub="Your saved items"
                onClick={close}
              />
              <Row
                to="/dashboard/settings"
                icon={Settings}
                color="bg-violet-100 text-violet-700"
                label="Settings"
                sub="Account preferences"
                onClick={close}
              />
            </div>

            {/* divider + logout */}
            <div className="px-2 pb-2">
              <div className="h-px bg-gray-100 mb-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                           hover:bg-red-50 transition-colors duration-150 group"
              >
                <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center
                                  flex-shrink-0 group-hover:scale-110 transition-transform duration-150">
                  <LogOut size={15} />
                </span>
                <span className="text-left">
                  <p className="text-[13px] font-semibold text-red-600 leading-tight">Logout</p>
                  <p className="text-[11px] text-red-400 leading-tight">Sign out of your account</p>
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </div>
  )
}
