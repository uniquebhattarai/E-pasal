import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const uploadImageToCloudinary = async (
  file: any,
  folder: string,
  height?: number,
  quality?: number
): Promise<UploadApiResponse> => {
  const options: Record<string, any> = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

export default { uploadImageToCloudinary };
