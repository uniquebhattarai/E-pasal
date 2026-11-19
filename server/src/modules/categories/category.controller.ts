import { Response } from "express";
import categoryService from "./category.service";
import { AuthenticatedRequest } from "../../types";

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description } = req.body;
    const imageFile = req.files?.image;

    await categoryService.createCategory({
      name,
      description,
      imageFile,
    });

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const showAllCategories = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const allCategories = await categoryService.showAllCategories();
    return res.status(200).json({
      success: true,
      message: "All tags returned successfully",
      data: allCategories,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const categoryPageDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const selectedCategory = await categoryService.getCategoryPageDetails(id);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
      },
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createCategory,
  showAllCategories,
  categoryPageDetails,
};
