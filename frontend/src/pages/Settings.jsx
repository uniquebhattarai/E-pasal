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

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function Settings() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
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

      const response = await ApiConnector(
        "put",
        updatedisplaypicture.UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
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
  const { register, handleSubmit, reset } = useForm()
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

      const response = await ApiConnector(
        "put",
        updateprofile.UPDATE_PROFILE_API,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
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
      const response = await ApiConnector(
        "post",
        changepassword.CHANGE_PASSWORD_API,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
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
      const response = await ApiConnector(
        "delete",
        deleteprofile.DELETE_PROFILE_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
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
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-green-700">Settings</h1>

      {/* Profile Picture */}
      <div className="flex items-center gap-x-6 rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-8 shadow-md hover:shadow-lg transition">
        <img
          src={previewSource || user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-20 rounded-full object-cover ring-2 ring-green-500"
        />
        <div className="space-y-3">
          <p className="font-semibold text-green-900">Change Profile Picture</p>
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={loading}
              className="rounded-md bg-green-600 px-5 py-2 text-white font-semibold shadow hover:bg-green-700"
            >
              Select
            </button>
            <button
              type="button"
              onClick={handleFileUpload}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-green-600 px-5 py-2 text-white font-semibold shadow hover:bg-green-700"
            >
              {loading ? "Uploading..." : "Upload"} <FiUpload />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form
        onSubmit={handleSubmit(submitProfileForm)}
        className="space-y-4 rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-green-900">Edit Profile</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName")}
            className="w-1/2 rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName")}
            className="w-1/2 rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <input
          type="date"
          {...register("dateOfBirth")}
          className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <select
          {...register("gender")}
          className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        >
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Contact Number"
          {...register("contactNumber")}
          className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <textarea
          placeholder="About"
          {...register("about")}
          className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <button
          type="submit"
          className="rounded-md bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>

      {/* Update Password Form */}
      <form
        onSubmit={handleSubmit(submitPasswordForm)}
        className="space-y-4 rounded-2xl border border-green-300 bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-green-900">Change Password</h2>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            {...register("oldPassword")}
            className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            {...register("newPassword")}
            className="w-full rounded-md border border-gray-300 bg-white/70 p-2 text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        <button
          type="submit"
          className="rounded-md bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
        >
          Change Password
        </button>
      </form>

      {/* Delete Account */}
      <div className="flex gap-x-5 rounded-2xl border border-red-300 bg-red-50/90 backdrop-blur-sm p-8 shadow-md hover:shadow-lg transition">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <FiTrash2 className="text-2xl text-red-500" />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-red-700">Delete Account</h2>
          <p className="text-sm text-red-600">
            This action is permanent and will remove all your data. Please
            proceed carefully.
          </p>
          <button
            type="button"
            className="w-fit cursor-pointer font-medium text-red-600 hover:underline"
            onClick={handleDeleteAccount}
          >
            I want to delete my account
          </button>
        </div>
      </div>
    </div>
  )
}
