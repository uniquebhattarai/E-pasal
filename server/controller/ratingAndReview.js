const RatingAndReview = require("../models/ratingAndReview");
const Product = require("../models/product");
const Order = require("../models/order");
const mongoose = require("mongoose");


exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, productId } = req.body;

  
    const purchased = await Order.findOne({
      user: userId,
      "products.product": productId,
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "You must purchase the product before reviewing",
      });
    }

   
    const existingReview = await RatingAndReview.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }


    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      product: productId,
      user: userId,
    });


    await Product.findByIdAndUpdate(
      productId,
      { $push: { ratingAndReviews: ratingReview._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating rating and review",
    });
  }
};


exports.getAverageRating = async (req, res) => {
  try {
    const productId = req.body.productId;

    const result = await RatingAndReview.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;

    return res.status(200).json({
      success: true,
      averageRating,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting average rating",
    });
  }
};


exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: -1 })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "product", select: "name" })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching ratings",
    });
  }
};
