import { Response } from "express";
import RatingAndReview from "../models/ratingAndReview";
import Product from "../models/product";
import Order from "../models/orders";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../types";

export const createRating = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { rating, review, productId } = req.body;

    const purchased = await Order.findOne({
      user: userId,
      "products.product": productId,
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "You must purchase the product before reviewing",
      });
    }

    const existingReview = await RatingAndReview.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      product: productId,
      user: userId,
    });

    await Product.findByIdAndUpdate(
      productId,
      { $push: { ratings: { user: userId, rating, review } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating rating and review",
    });
  }
};

export const getAverageRating = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const productId = req.body.productId;

    const result = await RatingAndReview.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;

    return res.status(200).json({
      success: true,
      averageRating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting average rating",
    });
  }
};

export const getAllRatingReview = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: -1 })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "product", select: "name" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching ratings",
    });
  }
};
