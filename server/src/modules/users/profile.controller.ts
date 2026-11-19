import { Response } from "express";
import profileService from "./profile.service";
import { AuthenticatedRequest } from "../../types";

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const updatedUserDetails = await profileService.updateProfile({
      userId,
      ...req.body,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateProfileHeader = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { firstName, lastName } = req.body;
    const displayPicture = req.files?.displayPicture;

    const updatedUserDetails = await profileService.updateProfileHeader(
      userId,
      firstName,
      lastName,
      displayPicture
    );

    return res.json({
      success: true,
      message: "Profile header updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update profile header",
      error: error.message,
    });
  }
};

export const updateAbout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { about } = req.body;
    const updatedUserDetails = await profileService.updateAbout(userId, about);

    return res.json({
      success: true,
      message: "About section updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update about section",
      error: error.message,
    });
  }
};

export const updatePersonalDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const updatedUserDetails = await profileService.updatePersonalDetails(userId, req.body);

    return res.json({
      success: true,
      message: "Personal details updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: "Failed to update personal details",
      error: error.message,
    });
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const result = await profileService.deleteAccount(userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Cannot delete user",
      error: error.message,
    });
  }
};

export const getUserDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userDetails = await profileService.getUserDetails(userId);

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDisplayPicture = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const displayPicture = req.files?.displayPicture;
    const updatedUser = await profileService.updateDisplayPicture(userId, displayPicture);

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await profileService.getUserOrders(userId);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders || [],
      data: orders || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const shopDashboard = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const dashboardData = await profileService.shopDashboard(userId!);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.body;
    const result = await profileService.toggleWishlist(userId, productId);

    return res.status(200).json({
      success: true,
      message: result.isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      inWishlist: !result.isWishlisted,
      wishlist: result.wishlist,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to toggle wishlist",
    });
  }
};

export const getWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const wishlist = await profileService.getWishlist(userId);

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch wishlist",
    });
  }
};

export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.body;
    const result = await profileService.addToCart(userId, productId);

    if (!result.added) {
      return res.status(200).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      cart: result.cart,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to add item to cart",
    });
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.body;
    const cart = await profileService.removeFromCart(userId, productId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to remove item from cart",
    });
  }
};

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const cart = await profileService.getCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch cart",
    });
  }
};

export const clearCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const cart = await profileService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};

export default {
  updateProfile,
  updateProfileHeader,
  updateAbout,
  updatePersonalDetails,
  deleteAccount,
  getUserDetails,
  updateDisplayPicture,
  getUserOrders,
  shopDashboard,
  toggleWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
};
