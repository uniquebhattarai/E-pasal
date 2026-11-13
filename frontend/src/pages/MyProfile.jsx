import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RiEditBoxLine } from "react-icons/ri"
import { ChevronLeft } from "lucide-react"
import { userdetails } from "../services/Api"
import { ApiConnector } from "../services/ApiConnector"

function IconBtn({ text, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-gradient-primary hover:opacity-90 px-2.5 py-1 text-[11px] font-semibold text-white active:scale-95 transition shadow-2xs cursor-pointer"
    >
      {children}
      {text}
    </button>
  )
}

function formattedDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function MyProfile() {
  const [user, setUser] = useState(null)
  const reduxUser = useSelector((state) => state.profile.user)
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const result = await ApiConnector("GET", userdetails.USER_DETAILS_API)
      if (result.data.success) {
        setUser(result.data.data)
      } else {
        console.log("Failed to fetch user:", result.data.message)
        navigate("/login")
      }
    } catch (error) {
      console.log("Could not fetch user", error)
      navigate("/login")
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const currentUser = user || reduxUser

  if (!currentUser) {
    return <p className="text-gray-400 p-4">Loading profile...</p>
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      {/* Mobile Fixed/Sticky Top Bar matching reference */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200/90 h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/dashboard/account")}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 hover:text-gray-600 transition cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 text-center flex-1 tracking-tight">
          Manage Profile
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      {/* Profile Page Content */}
      <div className="px-3.5 sm:px-6 md:px-0 py-3 sm:py-5 md:py-0 space-y-3.5">
        {/* Desktop Title */}
        <h1 className="hidden md:block text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          My Profile
        </h1>

        {/* Profile Header */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs transition hover:shadow-xs">
        <div className="flex items-center gap-x-3">
          {currentUser?.image && !currentUser.image.includes("dicebear.com") ? (
            <img
              src={currentUser.image}
              alt={`profile-${currentUser?.firstName}`}
              className="aspect-square w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#0c61f6]"
            />
          ) : (
            <div className="aspect-square w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#5891f8] to-[#0c61f6] flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-2xs ring-2 ring-[#0c61f6]">
              {`${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
              {currentUser?.firstName + " " + (currentUser?.lastName || "")}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{currentUser?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="flex flex-col gap-y-2.5 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-xs sm:text-[13px] font-semibold text-gray-900">About</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            currentUser?.additionalDetails?.about
              ? "text-gray-700"
              : "text-gray-400 italic"
          } text-xs font-normal`}
        >
          {currentUser?.additionalDetails?.about ?? "Write something about yourself..."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="flex flex-col gap-y-3 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-xs sm:text-[13px] font-semibold text-gray-900">Personal Details</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 max-w-lg">
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">First Name</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800">{currentUser?.firstName || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">Last Name</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800">{currentUser?.lastName || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">Email</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 truncate">{currentUser?.email || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">Phone Number</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800">
              {currentUser?.additionalDetails?.contactNumber ?? "Not specified"}
            </p>
          </div>
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">Gender</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800">
              {currentUser?.additionalDetails?.gender ?? "Not specified"}
            </p>
          </div>
          <div>
            <p className="mb-0.5 text-[11px] text-gray-400 font-medium">Date Of Birth</p>
            <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800">
              {formattedDate(currentUser?.additionalDetails?.dateOfBirth) ?? "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
