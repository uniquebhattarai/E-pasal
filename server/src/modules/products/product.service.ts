import Product from "./product.model";
import Category from "../categories/category.model";
import { uploadImageToCloudinary } from "../../utils/imageUploader";

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  userId?: string;
  imageFile?: any;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  imageFile?: any;
}

export const createProduct = async (input: CreateProductInput) => {
  const { name, description, price, category, userId, imageFile } = input;

  if (!name || !price || !category) {
    const error: any = new Error("Name, price, and category are required");
    error.statusCode = 400;
    throw error;
  }

  let imageUrl = "";
  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(imageFile, folderName);
    imageUrl = image.secure_url;
  }

  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    image: imageUrl,
    createdBy: userId,
  });

  await Category.findByIdAndUpdate(category, {
    $push: { products: newProduct._id },
  });

  return newProduct;
};

export const getAllProducts = async () => {
  const products = await Product.find().populate("category", "name description");
  return products;
};

export const getProductDetails = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("category")
    .populate("createdBy", "firstName lastName email");

  if (!product) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const getProductById = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("category", "name")
    .exec();

  if (!product) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const updateProduct = async (productId: string, input: UpdateProductInput) => {
  const { name, description, price, categoryId, imageFile } = input;

  let updatedData: any = { name, description, price };
  if (categoryId) updatedData.category = categoryId;

  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const uploadedImage = await uploadImageToCloudinary(imageFile, folderName, 500, 500);
    updatedData.image = uploadedImage.secure_url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, {
    new: true,
  });

  if (!updatedProduct) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    const error: any = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }
  return { message: "Product deleted successfully" };
};

export const searchProducts = async (keyword: string) => {
  if (!keyword) {
    const error: any = new Error("Keyword is required");
    error.statusCode = 400;
    throw error;
  }

  const products = await Product.find({
    name: { $regex: keyword, $options: "i" },
  }).populate("category", "name");

  return products;
};

export const filterProducts = async (filters: {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  const { categoryId, minPrice, maxPrice } = filters;
  let filter: any = {};

  if (categoryId) filter.category = categoryId;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const products = await Product.find(filter).populate("category", "name");
  return products;
};

export default {
  createProduct,
  getAllProducts,
  getProductDetails,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterProducts,
};
