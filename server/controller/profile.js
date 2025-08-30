const Profile = require("../models/profile");
const Order = require("../models/orders");
const Product = require("../models/product");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");


exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;

    const userDetails = await User.findById(req.user.id);
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
      userDetails.additionalDetails = profile._id;
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

    const updatedUserDetails = await User.findById(req.user.id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    await Profile.findByIdAndDelete(user.additionalDetails);

   
    await Product.updateMany(
      { reviews: userId },
      { $pull: { reviews: userId } }
    );

    await Order.deleteMany({ user: userId }); 

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot delete user",
      error: error.message,
    });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.shopDashboard = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });

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

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
