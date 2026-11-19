import Order from "./order.model";
import Product from "../products/product.model";
import User from "../users/user.model";

export interface PlaceOrderInput {
  userId: string;
  products?: any[];
  shippingAddress?: any;
  totalAmount?: number | string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export const placeOrder = async (input: PlaceOrderInput) => {
  const { userId, shippingAddress, totalAmount, paymentMethod, paymentStatus } = input;
  let { products } = input;

  const user = await User.findById(userId).populate("cart");
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // If products array is not explicitly passed, grab items from user's cart
  if ((!products || products.length === 0) && user.cart && user.cart.length > 0) {
    products = (user.cart as any[]).map((p: any) => ({
      product: p._id,
      quantity: 1,
    }));
  }

  if (!products || products.length === 0) {
    const error: any = new Error("No products provided for order");
    error.statusCode = 400;
    throw error;
  }

  let calculatedTotal = 0;
  const formattedProducts: any[] = [];

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

  const populatedOrder = await Order.findById(order._id).populate({
    path: "products.product",
    populate: { path: "category" },
  });

  return populatedOrder;
};

export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate({
      path: "products.product",
      populate: { path: "category" },
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .populate({
      path: "products.product",
      populate: { path: "category" },
    })
    .sort({ createdAt: -1 });

  return orders || [];
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    const error: any = new Error("Invalid status value");
    error.statusCode = 400;
    throw error;
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
    const error: any = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedOrder;
};

export default {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
