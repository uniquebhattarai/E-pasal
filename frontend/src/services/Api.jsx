// Resolve base URL dynamically so mobile devices on the same Wi-Fi connect seamlessly
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_BASE_URL;

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // When accessing from a phone/tablet on local Wi-Fi (not localhost / 127.0.0.1)
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      if (envUrl && envUrl.includes("localhost")) {
        return envUrl.replace("localhost", hostname);
      }
      return "/api/v1";
    }
  }

  return envUrl || "/api/v1";
};

const BASE_URL = getBaseUrl();


//user
export const login ={
    LOGIN_API:BASE_URL+"/auth/login"
}

export const logout = {
    LOGOUT_API: BASE_URL + "/auth/logout"
}

export const signUp ={
    SIGNUP_API:BASE_URL+"/auth/signup"
}

export const sendOtp={
    VERIFY_OTP:BASE_URL+"/auth/sendotp"
}

export const categories ={
    CATEGORIES_API:BASE_URL+"/categories/showAllCategories"
}

export const changepassword={
    CHANGE_PASSWORD_API:BASE_URL+"/auth/changepassword"
}

//reset password
export const resetpasswordtoken ={
    RESET_PASSWORD_TOKEN_API:BASE_URL+"/auth/reset-password-token"
}
export const resetpassword ={
    RESET_PASSWORD_API:BASE_URL+"/auth/reset-password"
}


//Profile
export const updatedisplaypicture={
    UPDATE_DISPLAY_PICTURE_API:BASE_URL+"/profile/updateDisplayPicture"
}
export const updateprofile={
    UPDATE_PROFILE_API:BASE_URL+"/profile/updateProfile"
}

export const deleteprofile={
    DELETE_PROFILE_API:BASE_URL+"/profile/deleteProfile"
}
export const userdetails={
    USER_DETAILS_API:BASE_URL+"/profile/getUserDetails"
}


export const products ={
    PRODUCTS_API:BASE_URL+"/products/getAllProducts"
}

export const categoryproducts ={
    PRODUCTS_API:BASE_URL+"/categories/categoryPageDetails"
}

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
