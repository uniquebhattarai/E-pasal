const BASE_URL = import.meta.env.VITE_BASE_URL

export const categories ={
    CATEGORIES_API:BASE_URL+"/categories/showAllCategories"
}

export const login ={
    LOGIN_API:BASE_URL+"/auth/login"
}

export const signUp ={
    SIGNUP_API:BASE_URL+"/auth/signup"
}

export const resetpasswordtoken ={
    RESET_PASSWORD_TOKEN_API:BASE_URL+"/auth/reset-password-token"
}
export const resetpassword ={
    RESET_PASSWORD_API:BASE_URL+"/auth/reset-password"
}

export const sendOtp={
    VERIFY_OTP:BASE_URL+"/auth/sendotp"
}

export const updatedisplaypicture={
    UPDATE_DISPLAY_PICTURE_API:BASE_URL+"/profile/updateDisplayPicture"
}
export const updateprofile={
    UPDATE_PROFILE_API:BASE_URL+"/profile/updateProfile"
}
export const changepassword={
    CHANGE_PASSWORD_API:BASE_URL+"/auth/changepassword"
}
export const deleteprofile={
    DELETE_PROFILE_API:BASE_URL+"/profile/deleteProfile"
}


export const products ={
    PRODUCTS_API:BASE_URL+"/products/getAllProducts"
}

export const categoryproducts ={
    PRODUCTS_API:BASE_URL+"/categories/categoryPageDetails"
}
