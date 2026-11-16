const Order = require("../models/orders");
const Product = require("../models/product");
const User = require("../models/user");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    let { products, shippingAddress, totalAmount, paymentMethod, paymentStatus } = req.body;

    const user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If products array is not explicitly passed, grab items from user's cart
    if ((!products || products.length === 0) && user.cart && user.cart.length > 0) {
      products = user.cart.map((p) => ({
        product: p._id,
        quantity: 1,
      }));
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided for order",
      });
    }

    let calculatedTotal = 0;
    const formattedProducts = [];

    for (const item of products) {
      const productId = item.product || item._id;
      const qty = item.quantity || 1;
      const productDoc = await Product.findById(productId);
      if (productDoc) {
        calculatedTotal += (productDoc.price || 0) * qty;
        formattedProducts.push({
          product: productDoc._id,
          quantity: qty,
        });
        await Product.findByIdAndUpdate(productDoc._id, {
          $inc: { stock: -qty },
        });
      }
    }

    const finalAmount = totalAmount ? Number(totalAmount) : calculatedTotal;

    const order = await Order.create({
      user: userId,
      products: formattedProducts,
      totalAmount: finalAmount,
      shippingAddress: shippingAddress || {},
      status: "Processing",
      paymentStatus: paymentStatus || "Paid",
      paymentMethod: paymentMethod || "eSewa",
    });

    // Clear cart upon order creation
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "products.product",
        populate: { path: "category" },
      });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while placing order",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product",
        populate: { path: "category" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      orders: orders || [],
      data: orders || [],
    });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user orders",
      error: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate({
        path: "products.product",
        populate: { path: "category" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders: orders || [],
      data: orders || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching orders",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate({
      path: "products.product",
      populate: { path: "category" },
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating order status",
      error: error.message,
    });
  }
};
