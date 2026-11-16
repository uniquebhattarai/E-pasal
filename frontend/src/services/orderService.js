import { ApiConnector } from "./ApiConnector";
import { orderEndpoints } from "./Api";
import { toast } from "react-hot-toast";

export const getUserOrders = async () => {
  try {
    const response = await ApiConnector("GET", orderEndpoints.GET_USER_ORDERS_API);
    if (response?.data?.success) {
      return response.data.orders || response.data.data || [];
    }
  } catch (error) {
    console.error("Fetch orders error:", error);
    toast.error(error?.response?.data?.message || "Failed to load order history");
  }
  return [];
};

export const placeOrder = async (orderData = {}) => {
  try {
    const response = await ApiConnector(
      "POST",
      orderEndpoints.PLACE_ORDER_API,
      orderData
    );
    if (response?.data?.success) {
      return response.data.order;
    } else {
      toast.error(response?.data?.message || "Failed to place order");
      return null;
    }
  } catch (error) {
    console.error("Place order error:", error);
    toast.error(error?.response?.data?.message || "Could not place order");
    return null;
  }
};

