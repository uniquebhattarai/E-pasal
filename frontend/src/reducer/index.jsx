import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from '../slices/AuthSlice'
import ProfileReducer from '../slices/ProfileSlice'
import CartReducer from '../slices/CartSlice'

const rootReducer = combineReducers({
    auth:AuthReducer,
    profile:ProfileReducer,
    cart:CartReducer
})

export default rootReducer