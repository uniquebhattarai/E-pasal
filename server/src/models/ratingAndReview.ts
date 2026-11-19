import mongoose, { Schema } from "mongoose";
import { IRatingAndReview } from "../types";

const ratingAndReviewSchema = new Schema<IRatingAndReview>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
    index: true,
  },
});

export const RatingAndReview = mongoose.model<IRatingAndReview>(
  "ratingAndReview",
  ratingAndReviewSchema
);
export default RatingAndReview;
