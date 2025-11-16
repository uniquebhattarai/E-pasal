import { RiEditBoxLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { userdetails } from "../services/Api"
import { useState, useEffect } from "react"
import { ApiConnector } from "../services/ApiConnector"
 

function IconBtn({ text, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 hover:scale-95 transition-all shadow-md"
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
      const token = JSON.parse(localStorage.getItem("token")); // parse the string to get the actual token


      if (!token) {
        navigate("/login"); // redirect if token not found
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const result = await ApiConnector("GET", userdetails.USER_DETAILS_API, null, headers);

      if (result.data.success) {
        setUser(result.data.data);
      } else {
        console.log("Failed to fetch user:", result.data.message);
      }
    } catch (error) {
      console.log("Could not fetch user", error);
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
      <h1 className="mb-10 text-3xl font-bold text-green-700">My Profile</h1>

      {/* Profile Header */}
      <div className="flex items-center justify-between rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-8 px-12 shadow-md transition hover:shadow-lg">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover ring-2 ring-green-500"
          />
          <div>
            <p className="text-lg font-semibold text-green-900">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="my-10 flex flex-col gap-y-6 rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-8 px-12 shadow-md hover:shadow-lg transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-green-900">About</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-gray-800"
              : "text-gray-400 italic"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write something about yourself..."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="my-10 flex flex-col gap-y-10 rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-8 px-12 shadow-md hover:shadow-lg transition">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-green-900">Personal Details</p>
          <IconBtn text="Edit" onClick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] justify-between">
          {/* Left Column */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-1 text-sm text-gray-500">First Name</p>
              <p className="text-sm font-medium text-green-900">{user?.firstName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-green-900">{user?.email}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Gender</p>
              <p className="text-sm font-medium text-green-900">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-1 text-sm text-gray-500">Last Name</p>
              <p className="text-sm font-medium text-green-900">{user?.lastName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-green-900">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-gray-500">Date Of Birth</p>
              <p className="text-sm font-medium text-green-900">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
