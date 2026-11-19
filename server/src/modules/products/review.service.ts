import RatingAndReview from "./review.model";
import Product from "./product.model";
import Order from "../orders/order.model";
import mongoose from "mongoose";

export interface CreateRatingInput {
  userId: string;
  productId: string;
  rating: number;
  review: string;
}

export const createRating = async (input: CreateRatingInput) => {
  const { userId, productId, rating, review } = input;

  const purchased = await Order.findOne({
    user: userId,
    "products.product": productId,
  });

  if (!purchased) {
    const error: any = new Error("You must purchase the product before reviewing");
    error.statusCode = 403;
    throw error;
  }

  const existingReview = await RatingAndReview.findOne({
    user: userId,
    product: productId,
  });

  if (existingReview) {
    const error: any = new Error("You have already reviewed this product");
    error.statusCode = 403;
    throw error;
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

  return ratingReview;
};

export const getAverageRating = async (productId: string) => {
  const result = await RatingAndReview.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } },
  ]);

  const averageRating = result.length > 0 ? result[0].averageRating : 0;
  return averageRating;
};

export const getAllRatingReview = async () => {
  const allReviews = await RatingAndReview.find({})
    .sort({ rating: -1 })
    .populate({ path: "user", select: "firstName lastName email image" })
    .populate({ path: "product", select: "name" })
    .exec();

  return allReviews;
};

export default {
  createRating,
  getAverageRating,
  getAllRatingReview,
};
