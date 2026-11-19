import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
