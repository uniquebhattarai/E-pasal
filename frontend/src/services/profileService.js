import { ApiConnector } from "./ApiConnector";
import { updateprofile, updatedisplaypicture } from "./Api";
import { setUser } from "../slices/ProfileSlice";
import { toast } from "react-hot-toast";

/**
 * Update the About section of the profile.
 */
export const updateAboutService = async (about, dispatch) => {
  const toastId = toast.loading("Updating about section...");
  try {
    const response = await ApiConnector("PUT", updateprofile.UPDATE_ABOUT_API, { about });
    if (!response.data?.success && !response?.success) {
      throw new Error(response.data?.message || response?.message || "Failed to update about");
    }

    const updatedUser = response.data?.data || response.data?.updatedUserDetails || response?.data;
    if (updatedUser) {
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    toast.success("About updated successfully");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update about error:", error);
    toast.error(error.response?.data?.message || error.message || "Could not update about");
    return { success: false, error };
  } finally {
    toast.dismiss(toastId);
  }
};

/**
 * Update Personal Details (First Name, Last Name, Phone Number, Gender, Date of Birth).
 */
export const updatePersonalDetailsService = async (details, dispatch) => {
  const toastId = toast.loading("Updating personal details...");
  try {
    const response = await ApiConnector("PUT", updateprofile.UPDATE_PERSONAL_DETAILS_API, details);
    if (!response.data?.success && !response?.success) {
      throw new Error(response.data?.message || response?.message || "Failed to update personal details");
    }

    const updatedUser = response.data?.data || response.data?.updatedUserDetails || response?.data;
    if (updatedUser) {
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    toast.success("Personal details updated successfully");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update personal details error:", error);
    toast.error(error.response?.data?.message || error.message || "Could not update personal details");
    return { success: false, error };
  } finally {
    toast.dismiss(toastId);
  }
};

/**
 * Update Profile Header (Name and/or Display Picture).
 */
export const updateProfileHeaderService = async (formDataOrData, dispatch) => {
  const toastId = toast.loading("Updating profile header...");
  try {
    const isFormData = formDataOrData instanceof FormData;
    const response = await ApiConnector(
      "PUT",
      updateprofile.UPDATE_PROFILE_HEADER_API,
      formDataOrData,
      isFormData ? { "Content-Type": "multipart/form-data" } : {}
    );

    if (!response.data?.success && !response?.success) {
      throw new Error(response.data?.message || response?.message || "Failed to update profile header");
    }

    const updatedUser = response.data?.data || response.data?.updatedUserDetails || response?.data;
    if (updatedUser) {
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    toast.success("Profile header updated successfully");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Update profile header error:", error);
    toast.error(error.response?.data?.message || error.message || "Could not update profile header");
    return { success: false, error };
  } finally {
    toast.dismiss(toastId);
  }
};

/**
 * Upload / Update Display Picture.
 */
export const updateDisplayPictureService = async (imageFile, dispatch) => {
  const toastId = toast.loading("Uploading picture...");
  try {
    const formData = new FormData();
    formData.append("displayPicture", imageFile);

    const response = await ApiConnector(
      "PUT",
      updatedisplaypicture.UPDATE_DISPLAY_PICTURE_API,
      formData,
      { "Content-Type": "multipart/form-data" }
    );

    if (!response.data?.success && !response?.success) {
      throw new Error(response.data?.message || response?.message || "Failed to upload picture");
    }

    const updatedUser = response.data?.data || response.data?.updatedUserDetails || response?.data;
    if (updatedUser) {
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    toast.success("Profile picture updated successfully");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Upload picture error:", error);
    toast.error(error.response?.data?.message || error.message || "Could not upload picture");
    return { success: false, error };
  } finally {
    toast.dismiss(toastId);
  }
};
