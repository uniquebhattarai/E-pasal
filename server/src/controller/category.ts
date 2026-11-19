import { Response } from "express";
import Category from "../models/category";
import { uploadImageToCloudinary } from "../utils/imageUploader";
import { AuthenticatedRequest } from "../types";

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const folderName = process.env.FOLDER_NAME || "unique";
      const image = await uploadImageToCloudinary(req.files.image, folderName);
      imageUrl = image.secure_url;
    }

    const CategoryDetails = await Category.create({
      name: name,
      description: description,
      image: imageUrl,
    });
    console.log(CategoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
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
    const allCategories = await Category.find(
      {},
      { name: true, description: true, image: true }
    );
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

    const selectedCategory = await Category.findById(id)
      .populate("products")
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
