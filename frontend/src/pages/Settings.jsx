import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { FiUpload, FiTrash2 } from "react-icons/fi"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { setUser } from "../slices/ProfileSlice"
import { logoutUser } from "../services/authService"
import { ApiConnector } from "../services/ApiConnector"
import {
  updatedisplaypicture,
  updateprofile,
  changepassword,
  deleteprofile,
} from "../services/Api"
import { ChevronLeft } from "lucide-react"
import { Button } from "../component/common"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function Settings() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ---------- Profile Picture ----------
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const fileInputRef = useRef(null)

  const handleClick = () => fileInputRef.current.click()
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }
  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => setPreviewSource(reader.result)
  }

  const handleFileUpload = async () => {
    if (!imageFile) return
    setLoading(true)
    const toastId = toast.loading("Uploading...")
    try {
      const formData = new FormData()
      formData.append("displayPicture", imageFile)

      // Cookie is sent automatically via withCredentials — no Authorization header needed
      const response = await ApiConnector(
        "put",
        updatedisplaypicture.UPDATE_DISPLAY_PICTURE_API,
        formData,
        { "Content-Type": "multipart/form-data" }
      )

      if (!response.success) throw new Error(response.message)
      dispatch(setUser(response.data))
      toast.success("Display Picture Updated Successfully")
    } catch (error) {
      toast.error(error?.message || "Could not update display picture")
      console.log(error)
    }
    toast.dismiss(toastId)
    setLoading(false)
  }

  useEffect(() => {
    if (imageFile) previewFile(imageFile)
  }, [imageFile])

  // ---------- Edit Profile ----------
  // Two separate form instances — profile and password have independent state
  const { register, handleSubmit, reset } = useForm()
  const { register: registerPwd, handleSubmit: handleSubmitPwd } = useForm()
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
        gender: user?.additionalDetails?.gender || "",
        contactNumber: user?.additionalDetails?.contactNumber || "",
        about: user?.additionalDetails?.about || "",
      })
    }
  }, [user, reset])

  const submitProfileForm = async (data) => {
    const toastId = toast.loading("Updating profile...")
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        additionalDetails: {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          contactNumber: data.contactNumber,
          about: data.about,
        },
      }

      // Cookie is sent automatically via withCredentials — no Authorization header needed
      const response = await ApiConnector(
        "put",
        updateprofile.UPDATE_PROFILE_API,
        payload
      )

      if (!response.success) throw new Error(response.message)

      const userDetails = response.updatedUserDetails
      if (userDetails?.image && userDetails.image.includes("dicebear.com")) {
        userDetails.image = null
      }

      dispatch(setUser(userDetails))
      toast.success("Profile Updated Successfully")
    } catch (error) {
      toast.error(error?.message || "Could not update profile")
      console.log(error)
    }
    toast.dismiss(toastId)
  }

  // ---------- Update Password ----------
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const submitPasswordForm = async (data) => {
    const toastId = toast.loading("Updating password...")
    try {
      // Cookie is sent automatically via withCredentials — no Authorization header needed
      const response = await ApiConnector(
        "post",
        changepassword.CHANGE_PASSWORD_API,
        data
      )

      if (!response.success) throw new Error(response.message)
      toast.success("Password Changed Successfully")
    } catch (error) {
      toast.error(error?.message || "Could not change password")
      console.log(error)
    }
    toast.dismiss(toastId)
  }

  // ---------- Delete Account ----------
  const handleLogout = async () => {
    await logoutUser(dispatch, navigate)
  }

  const handleDeleteAccount = async () => {
    const toastId = toast.loading("Deleting account...")
    try {
      // Cookie is sent automatically via withCredentials — no Authorization header needed
      const response = await ApiConnector(
        "delete",
        deleteprofile.DELETE_PROFILE_API
      )

      if (!response.success) throw new Error(response.message)
      toast.success("Profile Deleted Successfully")
      handleLogout()
    } catch (error) {
      toast.error(error?.message || "Could not delete profile")
      console.log(error)
    }
    toast.dismiss(toastId)
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      {/* Mobile Fixed/Sticky Top Bar */}
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
          Settings
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      <div className="px-3.5 sm:px-6 md:px-0 py-3 sm:py-5 md:py-0 space-y-4">
        <h1 className="hidden md:block text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Settings
        </h1>

        {/* Profile Picture */}
      <div className="flex items-center gap-x-4 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
        {previewSource || (user?.image && !user.image.includes("dicebear.com")) ? (
          <img
            src={previewSource || user.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#0c61f6]"
          />
        ) : (
          <div className="aspect-square w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-2xs ring-2 ring-[#0c61f6]">
            {`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() || "U"}
          </div>
        )}
        <div className="space-y-1.5">
          <p className="text-xs sm:text-[13px] font-semibold text-gray-900">Change Profile Picture</p>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <Button
              type="button"
              onClick={handleClick}
              disabled={loading}
              size="sm"
              variant="outline"
              className="!py-1 !px-2.5 !text-xs"
            >
              Select
            </Button>
            <Button
              type="button"
              onClick={handleFileUpload}
              loading={loading}
              loadingText="Uploading..."
              size="sm"
              rightIcon={FiUpload}
              className="!py-1 !px-2.5 !text-xs"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSubmit(submitProfileForm)}
        className="space-y-3 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition"
      >
        <h2 className="text-xs sm:text-[13px] font-semibold text-gray-900">Edit Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          />
          <select
            {...register("gender")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Contact Number"
          {...register("contactNumber")}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
        />
        <textarea
          rows={3}
          placeholder="About"
          {...register("about")}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
        />
        <Button type="submit" variant="primary" size="sm" className="!py-1.5 !px-3 !text-xs">
          Update Profile
        </Button>
      </form>

      {/* Update Password Form */}
      <form
        onSubmit={handleSubmitPwd(submitPasswordForm)}
        className="space-y-3 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition"
      >
        <h2 className="text-xs sm:text-[13px] font-semibold text-gray-900">Change Password</h2>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            {...registerPwd("oldPassword")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          />
          <span
            className="absolute right-2.5 top-2 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
          </span>
        </div>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            {...registerPwd("newPassword")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-800 focus:border-[#0c61f6] focus:ring-1 focus:ring-[#0c61f6]/30 outline-none"
          />
          <span
            className="absolute right-2.5 top-2 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
          </span>
        </div>
        <Button type="submit" variant="primary" size="sm" className="!py-1.5 !px-3 !text-xs">
          Change Password
        </Button>
      </form>

      {/* Delete Account */}
      <div className="flex gap-x-3.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <FiTrash2 className="text-base text-red-600" />
        </div>
        <div className="flex flex-col space-y-1">
          <h2 className="text-xs sm:text-[13px] font-semibold text-red-700">Delete Account</h2>
          <p className="text-[11px] text-red-600/80">
            This action is permanent and will remove all your data. Please
            proceed carefully.
          </p>
          <button
            type="button"
            className="w-fit cursor-pointer text-xs font-semibold text-red-600 hover:underline pt-0.5"
            onClick={handleDeleteAccount}
          >
            I want to delete my account
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}
