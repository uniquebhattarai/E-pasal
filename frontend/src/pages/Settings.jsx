import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { FiUpload, FiTrash2 } from "react-icons/fi"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { setUser } from "../slices/ProfileSlice"
import { setToken } from "../slices/AuthSlice"
import { resetCart } from "../slices/CartSlice"
import { ApiConnector } from "../services/ApiConnector"
import {
  updatedisplaypicture,
  updateprofile,
  changepassword,
  deleteprofile,
} from "../services/Api"
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

      const userImage =
        response.updatedUserDetails.image ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${response.updatedUserDetails.firstName} ${response.updatedUserDetails.lastName}`

      dispatch(setUser({ ...response.updatedUserDetails, image: userImage }))
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
  const handleLogout = () => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
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
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>

      {/* Profile Picture */}
      <div className="flex items-center gap-x-5 rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500"
        />
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-gray-900">Change Profile Picture</p>
          <div className="flex gap-2.5">
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
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSubmit(submitProfileForm)}
        className="space-y-3.5 rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition"
      >
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">Edit Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <select
            {...register("gender")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
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
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
        />
        <textarea
          rows={3}
          placeholder="About"
          {...register("about")}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
        />
        <Button type="submit" variant="primary" size="sm">
          Update Profile
        </Button>
      </form>

      {/* Update Password Form */}
      <form
        onSubmit={handleSubmitPwd(submitPasswordForm)}
        className="space-y-3.5 rounded-xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition"
      >
        <h2 className="text-sm sm:text-base font-semibold text-gray-900">Change Password</h2>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            {...registerPwd("oldPassword")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
          </span>
        </div>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            {...registerPwd("newPassword")}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-xs sm:text-sm text-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
          </span>
        </div>
        <Button type="submit" variant="primary" size="sm">
          Change Password
        </Button>
      </form>

      {/* Delete Account */}
      <div className="flex gap-x-4 rounded-xl border border-red-200 bg-red-50/70 p-5 sm:p-6 shadow-sm hover:shadow-md transition">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <FiTrash2 className="text-lg text-red-600" />
        </div>
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-xs sm:text-sm font-semibold text-red-700">Delete Account</h2>
          <p className="text-xs text-red-600/80">
            This action is permanent and will remove all your data. Please
            proceed carefully.
          </p>
          <button
            type="button"
            className="w-fit cursor-pointer text-xs font-semibold text-red-600 hover:underline pt-1"
            onClick={handleDeleteAccount}
          >
            I want to delete my account
          </button>
        </div>
      </div>
    </div>
  )
}
