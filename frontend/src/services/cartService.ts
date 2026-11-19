import { ApiConnector } from "./ApiConnector";
import { cartEndpoints } from "./Api";
import {
  setCart,
  addToCartLocal,
  removeFromCartLocal,
  setCartLoading,
  resetCart,
} from "../slices/CartSlice";
import { toast } from "react-hot-toast";
import { Product } from "../types";
import { AppDispatch } from "../store";

export const getCart = async (dispatch: AppDispatch | any): Promise<Product[]> => {
  dispatch(setCartLoading(true));
  try {
    const response = await ApiConnector("GET", cartEndpoints.GET_CART_API);
    if (response?.data?.success && Array.isArray(response.data.cart)) {
      dispatch(setCart(response.data.cart));
      return response.data.cart;
    }
  } catch (error) {
    console.error("Could not fetch cart:", error);
  } finally {
    dispatch(setCartLoading(false));
  }
  return [];
};

export const addItemToCart = async (
  product: Product,
  dispatch: AppDispatch | any,
  token: string | null | undefined,
  onRequireLogin?: () => void
): Promise<boolean> => {
  if (!token) {
    toast.error("Please login to add items to cart");
    if (onRequireLogin) onRequireLogin();
    return false;
  }

  if (!product || !product._id) {
    toast.error("Invalid product");
    return false;
  }

  // Optimistic update
  dispatch(addToCartLocal(product));

  try {
    const response = await ApiConnector(
      "POST",
      cartEndpoints.ADD_TO_CART_API,
      { productId: product._id }
    );

    if (response?.data?.success) {
      toast.success(`${product.name || "Item"} added to cart`);
      if (response.data.cart) {
        dispatch(setCart(response.data.cart));
      }
      return true;
    } else {
      // Revert if server rejected
      dispatch(removeFromCartLocal(product._id));
      toast.error(response?.data?.message || "Failed to add item to cart");
      return false;
    }
  } catch (error: any) {
    // Revert optimistic update
    dispatch(removeFromCartLocal(product._id));
    console.error("Add to cart error:", error);
    toast.error(
      error?.response?.data?.message || "Could not add item to cart"
    );
    return false;
  }
};

export const removeItemFromCart = async (
  productId: string,
  dispatch: AppDispatch | any,
  token?: string | null
): Promise<boolean> => {
  if (!productId) return false;

  // Optimistic update
  dispatch(removeFromCartLocal(productId));

  if (!token) {
    toast.success("Item removed from cart");
    return true;
  }

  try {
    const response = await ApiConnector(
      "POST",
      cartEndpoints.REMOVE_FROM_CART_API,
      { productId }
    );

    if (response?.data?.success) {
      toast.success("Item removed from cart");
      if (response.data.cart) {
        dispatch(setCart(response.data.cart));
      }
      return true;
    } else {
      toast.error(response?.data?.message || "Could not remove item from cart");
      getCart(dispatch);
      return false;
    }
  } catch (error: any) {
    console.error("Cart remove error:", error);
    toast.error(
      error?.response?.data?.message || "Could not remove item from cart"
    );
    getCart(dispatch);
    return false;
  }
};

export const clearUserCart = async (
  dispatch: AppDispatch | any,
  token?: string | null
): Promise<void> => {
  dispatch(resetCart());
  if (token) {
    try {
      await ApiConnector("POST", cartEndpoints.CLEAR_CART_API);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  }
};
