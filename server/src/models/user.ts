import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Customer", "Admin", "Instructor"],
    default: "Customer",
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "profile",
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  token: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
