import { Request } from "express";
import { Document, Types } from "mongoose";

export interface IUserAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  accountType: "Customer" | "Admin" | "Instructor";
  address?: IUserAddress;
  additionalDetails: Types.ObjectId;
  wishlist: Types.ObjectId[];
  cart: Types.ObjectId[];
  image?: string | null;
  createdAt: Date;
  token?: string | null;
  resetPasswordExpires?: Date | null;
}

export interface IProfile extends Document {
  gender?: string | null;
  dateOfBirth?: string | null;
  about?: string | null;
  contactNumber?: number | null;
}

export interface IRatingItem {
  user?: Types.ObjectId;
  rating?: number;
  review?: string;
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  brand?: string;
  ratings: IRatingItem[];
  averageRating: number;
  createdAt: Date;
  category: Types.ObjectId;
  createdBy?: Types.ObjectId;
}

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  products: Types.ObjectId[];
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: string;
  shippingAddress?: IUserAddress;
  createdAt: Date;
}

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

export interface IRatingAndReview extends Document {
  user: Types.ObjectId;
  rating: number;
  review: string;
  product: Types.ObjectId;
}

export interface AuthJwtPayload {
  email: string;
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
  files?: any;
}
