import { useRef, useState, useEffect } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

// Import your actions
import { setToken } from "../slices/AuthSlice"
import { setUser } from "../slices/ProfileSlice"
import { resetCart } from "../slices/CartSlice"

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // close dropdown on outside click
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

  // ✅ logout function
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
    <button className="relative" onClick={() => setOpen((prev) => !prev)}>
      <div className="flex items-center gap-x-2">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[34px] rounded-full object-cover border-2 border-green-600"
        />
        <AiOutlineCaretDown className="text-sm text-white" />
      </div>

      {open && (
        <div
          ref={ref}
          className="absolute top-[118%] right-0 z-[1000] divide-y divide-green-700 rounded-md border border-green-700 bg-green-600 text-white shadow-lg"
        >
          {/* Dashboard */}
          <Link
            to="/dashboard/my-profile"
            onClick={() => setOpen(false)}
          >
            <div className="flex w-full items-center gap-x-2 py-2 px-4 text-sm hover:bg-green-700 transition-colors">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="flex w-full items-center gap-x-2 py-2 px-4 text-sm cursor-pointer hover:bg-green-700 transition-colors"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  )
}
