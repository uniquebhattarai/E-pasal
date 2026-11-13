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

export const getCart = async (dispatch) => {
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
  product,
  dispatch,
  token,
  onRequireLogin
) => {
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
      // Revert if server rejected (e.g. item already in cart)
      dispatch(removeFromCartLocal(product._id));
      toast.error(response?.data?.message || "Failed to add item to cart");
      return false;
    }
  } catch (error) {
    // Revert optimistic update
    dispatch(removeFromCartLocal(product._id));
    console.error("Add to cart error:", error);
    toast.error(
      error?.response?.data?.message || "Could not add item to cart"
    );
    return false;
  }
};

export const removeItemFromCart = async (productId, dispatch, token) => {
  if (!productId) return;

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
  } catch (error) {
    console.error("Cart remove error:", error);
    toast.error(
      error?.response?.data?.message || "Could not remove item from cart"
    );
    getCart(dispatch);
    return false;
  }
};

export const clearUserCart = async (dispatch, token) => {
  dispatch(resetCart());
  if (token) {
    try {
      await ApiConnector("POST", cartEndpoints.CLEAR_CART_API);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  }
};

