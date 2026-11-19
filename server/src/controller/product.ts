import { Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import { uploadImageToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../types";

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const folderName = process.env.FOLDER_NAME || "unique";
      const image = await uploadImageToCloudinary(req.files.image, folderName);
      imageUrl = image.secure_url;
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      createdBy: req.user?.id,
    });

    await Category.findByIdAndUpdate(category, {
      $push: { products: newProduct._id },
    });

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error while creating product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const products = await Product.find().populate("category", "name description");

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId)
      .populate("category")
      .populate("createdBy", "firstName lastName email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .exec();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description, price, categoryId } = req.body;

    let updatedData: any = { name, description, price };
    if (categoryId) updatedData.category = categoryId;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const folderName = process.env.FOLDER_NAME || "unique";
      const uploadedImage = await uploadImageToCloudinary(image, folderName, 500, 500);
      updatedData.image = uploadedImage.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const products = await Product.find({
      name: { $regex: keyword as string, $options: "i" },
    }).populate("category", "name");

    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const filterProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    let filter: any = {};

    if (categoryId) filter.category = categoryId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    const products = await Product.find(filter).populate("category", "name");
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
