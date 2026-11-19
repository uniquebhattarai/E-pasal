import { Response } from "express";
import productService from "./product.service";
import { AuthenticatedRequest } from "../../types";

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description, price, category } = req.body;
    const imageFile = req.files?.image;

    const newProduct = await productService.createProduct({
      name,
      description,
      price,
      category,
      userId: req.user?.id,
      imageFile,
    });

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error while creating product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const products = await productService.getAllProducts();
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
    const product = await productService.getProductDetails(productId);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
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
    const product = await productService.getProductById(req.params.id);
    return res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description, price, categoryId } = req.body;
    const imageFile = req.files?.image;

    const updatedProduct = await productService.updateProduct(req.params.id, {
      name,
      description,
      price,
      categoryId,
      imageFile,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const searchProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { keyword } = req.query;
    const products = await productService.searchProducts(keyword as string);
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const filterProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    const products = await productService.filterProducts({
      categoryId: categoryId as string,
      minPrice: minPrice as string,
      maxPrice: maxPrice as string,
    });
    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
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
