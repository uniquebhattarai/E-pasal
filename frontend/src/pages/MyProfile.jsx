import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RiEditBoxLine } from "react-icons/ri";
import { ChevronLeft, Camera, Upload } from "lucide-react";
import { userdetails } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import { Button, Modal } from "../component/common";
import {
  updateAboutService,
  updatePersonalDetailsService,
  updateProfileHeaderService,
  updateDisplayPictureService,
} from "../services/profileService";

function IconBtn({ text, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-gradient-primary hover:opacity-90 px-2.5 py-1 text-[11px] font-semibold text-white active:scale-95 transition shadow-2xs cursor-pointer"
    >
      {children}
      {text}
    </button>
  );
}

function formattedDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const GENDERS = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const reduxUser = useSelector((state) => state.profile.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Modals
  const [editHeaderOpen, setEditHeaderOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [headerForm, setHeaderForm] = useState({ firstName: "", lastName: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [aboutText, setAboutText] = useState("");

  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  const fetchUser = async () => {
    try {
      const result = await ApiConnector("GET", userdetails.USER_DETAILS_API);
      if (result.data?.success && result.data?.data) {
        setUser(result.data.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Could not fetch user", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const currentUser = user || reduxUser;

  // Handlers for opening edit modals
  const handleOpenEditHeader = () => {
    setHeaderForm({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
    setImageFile(null);
    setImagePreview(currentUser?.image && !currentUser.image.includes("dicebear.com") ? currentUser.image : null);
    setEditHeaderOpen(true);
  };

  const handleOpenEditAbout = () => {
    setAboutText(currentUser?.additionalDetails?.about || "");
    setEditAboutOpen(true);
  };

  const handleOpenEditPersonal = () => {
    const rawDob = currentUser?.additionalDetails?.dateOfBirth;
    let formattedDob = "";
    if (rawDob) {
      try {
        formattedDob = new Date(rawDob).toISOString().split("T")[0];
      } catch (e) {
        formattedDob = "";
      }
    }

    setPersonalForm({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      contactNumber: currentUser?.additionalDetails?.contactNumber || "",
      gender: currentUser?.additionalDetails?.gender || "",
      dateOfBirth: formattedDob,
    });
    setEditPersonalOpen(true);
  };

  // Image file change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save Handlers
  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (imageFile) {
        const picRes = await updateDisplayPictureService(imageFile, dispatch);
        if (picRes.success && picRes.user) setUser(picRes.user);
      }
      const res = await updateProfileHeaderService(headerForm, dispatch);
      if (res.success) {
        if (res.user) setUser(res.user);
        setEditHeaderOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateAboutService(aboutText, dispatch);
      if (res.success) {
        if (res.user) setUser(res.user);
        setEditAboutOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updatePersonalDetailsService(personalForm, dispatch);
      if (res.success) {
        if (res.user) setUser(res.user);
        setEditPersonalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return <p className="text-gray-400 p-4">Loading profile...</p>;
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      {/* Mobile Fixed/Sticky Top Bar matching reference */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#171717] border-b border-gray-200/90 dark:border-[#2e2e2e] h-14 flex items-center justify-between px-4 md:hidden">
        <button
          type="button"
          onClick={() => navigate("/dashboard/account")}
          className="w-8 h-8 -ml-1 flex items-center justify-start text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-[#cbd5e1] transition cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 text-center flex-1 tracking-tight">
          Manage Profile
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      {/* Profile Page Content */}
      <div className="px-3.5 sm:px-6 md:px-0 py-3 sm:py-5 md:py-0 space-y-3.5">
        {/* Desktop Title */}
        <h1 className="hidden md:block text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          My Profile
        </h1>

        {/* ── 1. Profile Header Card ── */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] p-3.5 sm:p-4 shadow-2xs transition hover:shadow-xs">
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
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {currentUser?.firstName + " " + (currentUser?.lastName || "")}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-[#94a3b8] mt-0.5 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <IconBtn text="Edit" onClick={handleOpenEditHeader}>
            <RiEditBoxLine />
          </IconBtn>
        </div>

        {/* ── 2. About Section Card ── */}
        <div className="flex flex-col gap-y-2.5 rounded-xl border border-gray-100 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex w-full items-center justify-between">
            <p className="text-xs sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100">About</p>
            <IconBtn text="Edit" onClick={handleOpenEditAbout}>
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <p
            className={`${
              currentUser?.additionalDetails?.about
                ? "text-gray-700 dark:text-[#cbd5e1]"
                : "text-gray-400 dark:text-[#64748b] italic"
            } text-xs font-normal`}
          >
            {currentUser?.additionalDetails?.about ?? "Write something about yourself..."}
          </p>
        </div>

        {/* ── 3. Personal Details Card ── */}
        <div className="flex flex-col gap-y-3 rounded-xl border border-gray-100 dark:border-[#2e2e2e] bg-white dark:bg-[#202020] p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition">
          <div className="flex w-full items-center justify-between">
            <p className="text-xs sm:text-[13px] font-semibold text-gray-900 dark:text-gray-100">Personal Details</p>
            <IconBtn text="Edit" onClick={handleOpenEditPersonal}>
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 max-w-lg">
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">First Name</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">{currentUser?.firstName || "—"}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">Last Name</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">{currentUser?.lastName || "—"}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">Email</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200 truncate">{currentUser?.email || "—"}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">Phone Number</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">
                {currentUser?.additionalDetails?.contactNumber ?? "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">Gender</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">
                {currentUser?.additionalDetails?.gender ?? "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] text-gray-400 dark:text-[#94a3b8] font-medium">Date Of Birth</p>
              <p className="text-xs sm:text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">
                {formattedDate(currentUser?.additionalDetails?.dateOfBirth) ?? "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: Edit Profile Header ── */}
      <Modal
        isOpen={editHeaderOpen}
        onClose={() => !saving && setEditHeaderOpen(false)}
        title="Edit Profile Header"
        size="sm"
      >
        <form onSubmit={handleSaveHeader} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center gap-2 pt-1 pb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5891f8] to-[#0c61f6] flex items-center justify-center text-white text-xl font-bold shadow-xs">
                  {`${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`.toUpperCase() || "U"}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Camera size={20} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Upload size={12} />
              Change Photo
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              value={headerForm.firstName}
              onChange={(e) => setHeaderForm({ ...headerForm, firstName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={headerForm.lastName}
              onChange={(e) => setHeaderForm({ ...headerForm, lastName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#2e2e2e]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => setEditHeaderOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 2: Edit About ── */}
      <Modal
        isOpen={editAboutOpen}
        onClose={() => !saving && setEditAboutOpen(false)}
        title="Edit About You"
        size="md"
      >
        <form onSubmit={handleSaveAbout} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Tell something about yourself
            </label>
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Write a brief bio, interests, or anything you'd like to share..."
              className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] p-3 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary resize-y"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#2e2e2e]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => setEditAboutOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save About"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 3: Edit Personal Details ── */}
      <Modal
        isOpen={editPersonalOpen}
        onClose={() => !saving && setEditPersonalOpen(false)}
        title="Edit Personal Details"
        size="md"
      >
        <form onSubmit={handleSavePersonal} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={personalForm.firstName}
                onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={personalForm.lastName}
                onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Contact / Phone Number
            </label>
            <input
              type="tel"
              value={personalForm.contactNumber}
              onChange={(e) => setPersonalForm({ ...personalForm, contactNumber: e.target.value })}
              placeholder="e.g. +977 9800000000"
              className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                value={personalForm.gender}
                onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary cursor-pointer"
              >
                <option value="">Select Gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Date Of Birth
              </label>
              <input
                type="date"
                value={personalForm.dateOfBirth}
                onChange={(e) => setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-white dark:bg-[#171717] px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#2e2e2e]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={() => setEditPersonalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
