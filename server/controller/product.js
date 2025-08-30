const Product = require("../models/product");
const Category = require("../models/category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.createProduct = async (req, res) => {
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
      const image = await uploadImageToCloudinary(
        req.files.image,
        process.env.FOLDER_NAME
      );
      imageUrl = image.secure_url;
    }


    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
      createdBy: req.user.id, // shopkeeper/admin
    });


    await Category.findByIdAndUpdate(category, {
      $push: { products: newProduct._id },
    });

    return res.status(200).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating product",
      error: error.message,
    });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name description")

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProductDetails = async (req, res) => {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .exec();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    let updatedData = { name, description, price };
    if (categoryId) updatedData.category = categoryId;

    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadedImage = await uploadImageToCloudinary(image, process.env.FOLDER_NAME, 500, 500);
      updatedData.image = uploadedImage.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ success: false, message: "Keyword is required" });
    }

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" }
    }).populate("category", "name");

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.filterProducts = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    let filter = {};

    if (categoryId) filter.category = categoryId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(filter).populate("category", "name");
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  };