import { setToken } from "../slices/AuthSlice";
import { setUser } from "../slices/ProfileSlice";
import { resetCart } from "../slices/CartSlice";
import { resetWishlist } from "../slices/WishlistSlice";
import { ApiConnector } from "./ApiConnector";
import { logout as logoutEndpoint } from "./Api";
import { toast } from "react-hot-toast";

/**
 * Perform a clean, reliable logout:
 * 1. Instruct the server to expire and clear the httpOnly `token` cookie.
 * 2. Clear local auth/user states from Redux and localStorage.
 * 3. Provide user feedback and redirect to home.
 */
export const logoutUser = async (dispatch, navigate) => {
  try {
    await ApiConnector("POST", logoutEndpoint.LOGOUT_API);
  } catch (error) {
    console.error("Server logout error:", error);
  } finally {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    dispatch(resetWishlist());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    if (navigate) {
      navigate("/");
    }
  }
};

