import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from '../slices/AuthSlice'
import ProfileReducer from '../slices/ProfileSlice'
import CartReducer from '../slices/CartSlice'
import WishlistReducer from '../slices/WishlistSlice'

const rootReducer = combineReducers({
    auth:AuthReducer,
    profile:ProfileReducer,
    cart:CartReducer,
    wishlist:WishlistReducer
})

export default rootReducer