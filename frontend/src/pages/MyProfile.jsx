import { RiEditBoxLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { userdetails } from "../services/Api"
import { useState, useEffect } from "react"
import { ApiConnector } from "../services/ApiConnector"
 

function IconBtn({ text, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95 transition shadow-sm cursor-pointer"
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
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {

      const result = await ApiConnector("GET", userdetails.USER_DETAILS_API);

      if (result.data.success) {
        setUser(result.data.data);
      } else {
        console.log("Failed to fetch user:", result.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("Could not fetch user", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser()
  }, [])

  if (!user) {
    return <p className="text-gray-400">Loading profile...</p>
  }

  return (
    <>
      <h1 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>

      {/* Profile Header */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center gap-x-3.5">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="my-6 flex flex-col gap-y-4 rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm sm:text-base font-semibold text-gray-900">About</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-gray-700"
              : "text-gray-400 italic"
          } text-xs sm:text-sm font-normal`}
        >
          {user?.additionalDetails?.about ?? "Write something about yourself..."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="my-6 flex flex-col gap-y-6 rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm sm:text-base font-semibold text-gray-900">Personal Details</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-lg">
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">First Name</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">{user?.firstName}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">Last Name</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">{user?.lastName}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">Email</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">Phone Number</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {user?.additionalDetails?.contactNumber ?? "Not specified"}
            </p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">Gender</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {user?.additionalDetails?.gender ?? "Not specified"}
            </p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400 font-medium">Date Of Birth</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              {formattedDate(user?.additionalDetails?.dateOfBirth) ?? "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
