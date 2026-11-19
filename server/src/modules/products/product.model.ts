import mongoose, { Schema } from "mongoose";
import { IProduct } from "../../types";

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  brand: { type: String },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
    },
  ],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
