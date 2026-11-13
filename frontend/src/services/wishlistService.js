import { ApiConnector } from "./ApiConnector";
import { wishlistEndpoints } from "./Api";
import {
  setWishlist,
  toggleWishlistLocal,
  removeFromWishlistLocal,
  setWishlistLoading,
} from "../slices/WishlistSlice";
import { toast } from "react-hot-toast";

export const getWishlist = async (dispatch) => {
  dispatch(setWishlistLoading(true));
  try {
    const response = await ApiConnector(
      "GET",
      wishlistEndpoints.GET_WISHLIST_API
    );
    if (response?.data?.success) {
      dispatch(setWishlist(response.data.data));
    }
  } catch (error) {
    console.log("Could not fetch wishlist", error);
  } finally {
    dispatch(setWishlistLoading(false));
  }
};

export const toggleWishlistItem = async (
  product,
  dispatch,
  token,
  onRequireLogin
) => {
  if (!token) {
    toast.error("Please login to use wishlist");
    if (onRequireLogin) onRequireLogin();
    return false;
  }

  const productId = typeof product === "string" ? product : product._id;

  // Optimistic update
  dispatch(toggleWishlistLocal(product));

  try {
    const response = await ApiConnector(
      "POST",
      wishlistEndpoints.TOGGLE_WISHLIST_API,
      { productId }
    );

    if (response?.data?.success) {
      if (response.data.inWishlist) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
      if (response.data.wishlist) {
        dispatch(setWishlist(response.data.wishlist));
      }
      return true;
    } else {
      // Revert if server failed
      dispatch(toggleWishlistLocal(product));
      toast.error(response?.data?.message || "Failed to update wishlist");
      return false;
    }
  } catch (error) {
    // Revert
    dispatch(toggleWishlistLocal(product));
    console.error("Wishlist error:", error);
    toast.error(error?.response?.data?.message || "Could not update wishlist");
    return false;
  }
};

export const removeWishlistItem = async (productId, dispatch) => {
  dispatch(removeFromWishlistLocal(productId));
  try {
    const response = await ApiConnector(
      "POST",
      wishlistEndpoints.TOGGLE_WISHLIST_API,
      { productId }
    );
    if (response?.data?.success) {
      toast.success("Removed from wishlist");
      if (response.data.wishlist) {
        dispatch(setWishlist(response.data.wishlist));
      }
    } else {
      toast.error("Could not remove from wishlist");
      getWishlist(dispatch);
    }
  } catch (error) {
    console.error("Wishlist remove error:", error);
    toast.error("Could not remove from wishlist");
    getWishlist(dispatch);
  }
};

