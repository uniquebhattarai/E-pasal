import { Response } from "express";
import reviewService from "./review.service";
import { AuthenticatedRequest } from "../../types";

export const createRating = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { rating, review, productId } = req.body;

    const ratingReview = await reviewService.createRating({
      userId,
      productId,
      rating,
      review,
    });

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error: any) {
    console.error("createRating error:", error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while creating rating and review",
    });
  }
};

export const getAverageRating = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const productId = req.body.productId;
    const averageRating = await reviewService.getAverageRating(productId);

    return res.status(200).json({
      success: true,
      averageRating,
    });
  } catch (error: any) {
    console.error("getAverageRating error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while getting average rating",
    });
  }
};

export const getAllRatingReview = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const allReviews = await reviewService.getAllRatingReview();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error: any) {
    console.error("getAllRatingReview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while fetching ratings",
    });
  }
};

export default {
  createRating,
  getAverageRating,
  getAllRatingReview,
};
