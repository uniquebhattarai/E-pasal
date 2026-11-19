const RENDER_BACKEND_URL = "https://e-pasal-backend.onrender.com/api/v1";

// Resolve base URL dynamically for local dev, LAN testing, and production (Vercel -> Render)
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_BASE_URL;

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // 1. Localhost development
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return envUrl || "http://localhost:3069/api/v1";
    }

    // 2. Testing on mobile phone via LAN Wi-Fi (e.g. 192.168.x.x, 10.x.x.x, 172.x.x.x)
    const isPrivateIp = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
    if (isPrivateIp) {
      if (envUrl && envUrl.includes("localhost")) {
        return envUrl.replace("localhost", hostname);
      }
      return `http://${hostname}:3069/api/v1`;
    }

    // 3. Deployed / Production (Vercel, etc.)
    if (envUrl && envUrl.startsWith("http")) {
      // If localhost URL was accidentally used in production, fall back to Render
      if (envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
        return RENDER_BACKEND_URL;
      }
      return envUrl;
    }

    // Default production backend on Render
    return RENDER_BACKEND_URL;
  }

  return envUrl || RENDER_BACKEND_URL;
};

const BASE_URL = getBaseUrl();

// User Auth
export const login = {
  LOGIN_API: BASE_URL + "/auth/login",
};

export const refreshToken = {
  REFRESH_TOKEN_API: BASE_URL + "/auth/refresh-token",
};

export const logout = {
  LOGOUT_API: BASE_URL + "/auth/logout",
};

export const signUp = {
  SIGNUP_API: BASE_URL + "/auth/signup",
};

export const sendOtp = {
  VERIFY_OTP: BASE_URL + "/auth/sendotp",
};

export const categories = {
  CATEGORIES_API: BASE_URL + "/categories/showAllCategories",
};

export const changepassword = {
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
};

// Reset Password
export const resetpasswordtoken = {
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/auth/reset-password-token",
};

export const resetpassword = {
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
};

// Profile
export const updatedisplaypicture = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
};

export const updateprofile = {
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  UPDATE_PROFILE_HEADER_API: BASE_URL + "/profile/updateProfileHeader",
  UPDATE_ABOUT_API: BASE_URL + "/profile/updateAbout",
  UPDATE_PERSONAL_DETAILS_API: BASE_URL + "/profile/updatePersonalDetails",
};

export const deleteprofile = {
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

export const userdetails = {
  USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
};

// Products & Categories
export const products = {
  PRODUCTS_API: BASE_URL + "/products/getAllProducts",
};

export const categoryproducts = {
  PRODUCTS_API: BASE_URL + "/categories/categoryPageDetails",
};

export const wishlistEndpoints = {
  GET_WISHLIST_API: BASE_URL + "/profile/getWishlist",
  TOGGLE_WISHLIST_API: BASE_URL + "/profile/toggleWishlist",
};

export const cartEndpoints = {
  GET_CART_API: BASE_URL + "/profile/getCart",
  ADD_TO_CART_API: BASE_URL + "/profile/addToCart",
  REMOVE_FROM_CART_API: BASE_URL + "/profile/removeFromCart",
  CLEAR_CART_API: BASE_URL + "/profile/clearCart",
};

export const orderEndpoints = {
  GET_USER_ORDERS_API: BASE_URL + "/orders/myOrders",
  PLACE_ORDER_API: BASE_URL + "/orders/placeOrder",
  GET_ALL_ORDERS_API: BASE_URL + "/orders/getAllOrders",
  UPDATE_ORDER_STATUS_API: BASE_URL + "/orders/updateOrderStatus",
};

export const paymentEndpoints = {
  PAYMENT_INIT_API: BASE_URL + "/payment/init",
};
