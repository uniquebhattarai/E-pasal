import Category from "./category.model";
import { uploadImageToCloudinary } from "../../utils/imageUploader";

export interface CreateCategoryInput {
  name: string;
  description?: string;
  imageFile?: any;
}

export const createCategory = async (input: CreateCategoryInput) => {
  const { name, description, imageFile } = input;

  if (!name) {
    const error: any = new Error("All fields are required");
    error.statusCode = 404;
    throw error;
  }

  let imageUrl = "";
  if (imageFile) {
    const folderName = process.env.FOLDER_NAME || "unique";
    const image = await uploadImageToCloudinary(imageFile, folderName);
    imageUrl = image.secure_url;
  }

  const categoryDetails = await Category.create({
    name,
    description,
    image: imageUrl,
  });

  return categoryDetails;
};

export const showAllCategories = async () => {
  const allCategories = await Category.find(
    {},
    { name: true, description: true, image: true }
  );
  return allCategories;
};

export const getCategoryPageDetails = async (categoryId: string) => {
  const selectedCategory = await Category.findById(categoryId)
    .populate("products")
    .exec();

  if (!selectedCategory) {
    const error: any = new Error("Data Not Found");
    error.statusCode = 404;
    throw error;
  }

  return selectedCategory;
};

export default {
  createCategory,
  showAllCategories,
  getCategoryPageDetails,
};
