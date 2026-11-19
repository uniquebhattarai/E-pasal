import Profile from "./profile.model";
import User from "./user.model";
import Order from "../orders/order.model";
import Product from "../products/product.model";
import { uploadImageToCloudinary } from "../../utils/imageUploader";

export interface UpdateProfileInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: string;
  gender?: string;
}

export const updateProfile = async (input: UpdateProfileInput) => {
  const { userId, firstName, lastName, dateOfBirth, about, contactNumber, gender } = input;

  const userDetails = await User.findById(userId);
  if (!userDetails) {
    const error: any = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
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

  return updatedUserDetails;
};

export const updateProfileHeader = async (
  userId: string,
  firstName?: string,
  lastName?: string,
  displayPicture?: any
) => {
  const userDetails = await User.findById(userId);
  if (!userDetails) {
    const error: any = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
  }

  if (firstName) userDetails.firstName = firstName;
  if (lastName !== undefined) userDetails.lastName = lastName;

  if (displayPicture) {
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

  return updatedUserDetails;
};

export const updateAbout = async (userId: string, about: any) => {
  const userDetails = await User.findById(userId);
  if (!userDetails) {
    const error: any = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
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

  return updatedUserDetails;
};

export const updatePersonalDetails = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    contactNumber?: string;
    gender?: string;
  }
) => {
  const { firstName, lastName, dateOfBirth, contactNumber, gender } = data;

  const userDetails = await User.findById(userId);
  if (!userDetails) {
    const error: any = new Error("User not found. Invalid or expired token.");
    error.statusCode = 404;
    throw error;
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

  return updatedUserDetails;
};

export const deleteAccount = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await Profile.findByIdAndDelete(user.additionalDetails);
  await Product.updateMany({ reviews: userId }, { $pull: { reviews: userId } });
  await Order.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);

  return { message: "User account deleted successfully" };
};

export const getUserDetails = async (userId: string) => {
  const userDetails = await User.findById(userId)
    .select("-password -cart -wishlist")
    .populate("additionalDetails")
    .exec();

  if (userDetails && userDetails.image && userDetails.image.includes("dicebear.com")) {
    userDetails.image = null;
    await User.findByIdAndUpdate(userId, { image: null });
  }

  return userDetails;
};

export const updateDisplayPicture = async (userId: string, displayPicture: any) => {
  if (!displayPicture) {
    const error: any = new Error("No image file uploaded");
    error.statusCode = 400;
    throw error;
  }

  const folderName = process.env.FOLDER_NAME || "unique";
  const image = await uploadImageToCloudinary(displayPicture, folderName, 1000, 1000);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { image: image.secure_url },
    { new: true }
  ).select("-password");

  return updatedUser;
};

export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate({
      path: "products.product",
      populate: { path: "category" },
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

export const shopDashboard = async (userId: string) => {
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

  return dashboardData;
};

export const toggleWishlist = async (userId: string, productId: string) => {
  if (!productId) {
    const error: any = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
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

  return {
    isWishlisted,
    wishlist: updatedUser ? updatedUser.wishlist : [],
  };
};

export const getWishlist = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    populate: {
      path: "category",
    },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.wishlist || [];
};

export const addToCart = async (userId: string, productId: string) => {
  if (!productId) {
    const error: any = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const cart = user.cart || [];
  const isInCart = cart.some(
    (id) => id.toString() === productId.toString()
  );

  if (isInCart) {
    return { added: false, message: "Item is already in cart", cart: [] };
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

  return {
    added: true,
    message: "Item added to cart",
    cart: updatedUser ? updatedUser.cart : [],
  };
};

export const removeFromCart = async (userId: string, productId: string) => {
  if (!productId) {
    const error: any = new Error("Product ID is required");
    error.statusCode = 400;
    throw error;
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

  return updatedUser ? updatedUser.cart : [];
};

export const getCart = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "cart",
    populate: {
      path: "category",
    },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user.cart || [];
};

export const clearCart = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
  return [];
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
