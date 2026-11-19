import { Response } from "express";
import Profile from "../models/profile";
import Order from "../models/orders";
import Product from "../models/product";
import User from "../models/user";
import { uploadImageToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../types";

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found. Invalid or expired token.",
      });
    }

    let profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      profile = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      });
      userDetails.additionalDetails = profile._id as any;
      await userDetails.save();
    }

    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    await userDetails.save();

    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.about = about || profile.about;
    profile.contactNumber = contactNumber || profile.contactNumber;
    profile.gender = gender || profile.gender;
    await profile.save();

    const updatedUserDetails = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails")
      .exec();

    if (
      updatedUserDetails &&
      updatedUserDetails.image &&
      updatedUserDetails.image.includes("dicebear.com")
    ) {
      updatedUserDetails.image = null;
      await User.findByIdAndUpdate(userId, { image: null });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
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
    const { firstName, lastName } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found. Invalid or expired token.",
      });
    }

    if (firstName) userDetails.firstName = firstName;
    if (lastName !== undefined) userDetails.lastName = lastName;

    if (req.files && req.files.displayPicture) {
      const displayPicture = req.files.displayPicture;
      const folderName = process.env.FOLDER_NAME || "unique";
      const image = await uploadImageToCloudinary(displayPicture, folderName, 1000, 1000);
      userDetails.image = image.secure_url;
    }

    await userDetails.save();

    const updatedUserDetails = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails")
      .exec();

    if (
      updatedUserDetails &&
      updatedUserDetails.image &&
      updatedUserDetails.image.includes("dicebear.com")
    ) {
      updatedUserDetails.image = null;
      await User.findByIdAndUpdate(userId, { image: null });
    }

    return res.json({
      success: true,
      message: "Profile header updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
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
    const { about } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found. Invalid or expired token.",
      });
    }

    let profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      profile = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: typeof about === "string" ? about : null,
        contactNumber: null,
      });
      userDetails.additionalDetails = profile._id as any;
      await userDetails.save();
    } else {
      profile.about = typeof about === "string" ? about : profile.about;
      await profile.save();
    }

    const updatedUserDetails = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails")
      .exec();

    if (
      updatedUserDetails &&
      updatedUserDetails.image &&
      updatedUserDetails.image.includes("dicebear.com")
    ) {
      updatedUserDetails.image = null;
      await User.findByIdAndUpdate(userId, { image: null });
    }

    return res.json({
      success: true,
      message: "About section updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
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
    const { firstName, lastName, dateOfBirth, contactNumber, gender } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found. Invalid or expired token.",
      });
    }

    if (firstName) userDetails.firstName = firstName;
    if (lastName !== undefined) userDetails.lastName = lastName;
    await userDetails.save();

    let profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      profile = await Profile.create({
        gender: gender || null,
        dateOfBirth: dateOfBirth || null,
        about: null,
        contactNumber: contactNumber || null,
      });
      userDetails.additionalDetails = profile._id as any;
      await userDetails.save();
    } else {
      if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
      if (contactNumber !== undefined) profile.contactNumber = contactNumber;
      if (gender !== undefined) profile.gender = gender;
      await profile.save();
    }

    const updatedUserDetails = await User.findById(userId)
      .select("-password")
      .populate("additionalDetails")
      .exec();

    if (
      updatedUserDetails &&
      updatedUserDetails.image &&
      updatedUserDetails.image.includes("dicebear.com")
    ) {
      updatedUserDetails.image = null;
      await User.findByIdAndUpdate(userId, { image: null });
    }

    return res.json({
      success: true,
      message: "Personal details updated successfully",
      data: updatedUserDetails,
      updatedUserDetails,
    });
  } catch (error: any) {
    return res.status(500).json({
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(user.additionalDetails);
    await Product.updateMany({ reviews: userId }, { $pull: { reviews: userId } });
    await Order.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Cannot delete user",
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

    const userDetails = await User.findById(userId)
      .select("-password -cart -wishlist")
      .populate("additionalDetails")
      .exec();

    if (userDetails && userDetails.image && userDetails.image.includes("dicebear.com")) {
      userDetails.image = null;
      await User.findByIdAndUpdate(userId, { image: null });
    }

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
    const displayPicture = req.files?.displayPicture;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!displayPicture) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(displayPicture, folderName, 1000, 1000);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
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

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product",
        populate: { path: "category" },
      })
      .sort({ createdAt: -1 });

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
    const products: any[] = await Product.find({ createdBy: userId });

    const dashboardData = products.map((product) => {
      const totalOrders = product.orders?.length || 0;
      const totalRevenue = totalOrders * product.price;

      return {
        _id: product._id,
        name: product.name,
        totalOrders,
        totalRevenue,
      };
    });

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------- Wishlist Handlers ----------
export const toggleWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wishlist = user.wishlist || [];
    const isWishlisted = wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    let updatedUser: any;
    if (isWishlisted) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true }
      ).populate("wishlist");
    }

    return res.status(200).json({
      success: true,
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      inWishlist: !isWishlisted,
      wishlist: updatedUser.wishlist,
    });
  } catch (error: any) {
    return res.status(500).json({
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

    const user = await User.findById(userId).populate({
      path: "wishlist",
      populate: {
        path: "category",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: user.wishlist || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch wishlist",
    });
  }
};

// ---------- Cart Handlers ----------
export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = user.cart || [];
    const isInCart = cart.some(
      (id) => id.toString() === productId.toString()
    );

    if (isInCart) {
      return res.status(200).json({
        success: false,
        message: "Item is already in cart",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { cart: productId } },
      { new: true }
    ).populate({
      path: "cart",
      populate: {
        path: "category",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: updatedUser ? updatedUser.cart : [],
    });
  } catch (error: any) {
    return res.status(500).json({
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
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: productId } },
      { new: true }
    ).populate({
      path: "cart",
      populate: {
        path: "category",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedUser ? updatedUser.cart : [],
    });
  } catch (error: any) {
    return res.status(500).json({
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

    const user = await User.findById(userId).populate({
      path: "cart",
      populate: {
        path: "category",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: user.cart || [],
    });
  } catch (error: any) {
    return res.status(500).json({
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

    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: [],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};
