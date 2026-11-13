import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./slices/AuthSlice";
import { setUser } from "./slices/ProfileSlice";
import { ApiConnector } from "./services/ApiConnector";
import { userdetails } from "./services/Api";

import Navbar from './component/Navbar';
import AuthModal from './component/AuthModal';
import ScrollToTop from './component/ScrollToTop';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import MyProfile from "./pages/MyProfile";
import MyOrders from "./pages/MyOrders";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import PrivateRoute from "./component/PrivateRoute";
import Settings from "./pages/Settings";
import CategoryDetails from "./pages/CategoryDetails";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSucess";
import { getWishlist } from "./services/wishlistService";
import { getCart } from "./services/cartService";
import { resetWishlist, setWishlist } from "./slices/WishlistSlice";
import { resetCart, setCart } from "./slices/CartSlice";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Restore local cache if valid
    const userStr = localStorage.getItem("user");
    let hasLocalUser = false;

    if (userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed && typeof parsed === "object") {
          dispatch(setToken("cookie"));
          dispatch(setUser(parsed));
          hasLocalUser = true;
          getWishlist(dispatch);
          getCart(dispatch);
        }
      } catch (err) {
        console.error("Invalid user JSON in localStorage:", err);
        localStorage.removeItem("user");
      }
    }

    if (!hasLocalUser) {
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(resetWishlist());
      dispatch(resetCart());
      return;
    }

    // 2. Fetch fresh user details using the httpOnly cookie to ensure session is live
    const verifySession = async () => {
      try {
        const response = await ApiConnector("GET", userdetails.USER_DETAILS_API);
        if (response?.data?.success && response.data.data) {
          const freshUser = response.data.data;
          dispatch(setToken("cookie"));
          dispatch(setUser(freshUser));
          localStorage.setItem("user", JSON.stringify(freshUser));
          getWishlist(dispatch);
          getCart(dispatch);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Cookie expired or not logged in
          dispatch(setToken(null));
          dispatch(setUser(null));
          dispatch(resetWishlist());
          dispatch(resetCart());
          localStorage.removeItem("user");
        }
      }
    };

    verifySession();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <AuthModal />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:id" element={<CategoryDetails/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:token" element={<UpdatePassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

         <Route path="/dashboard/*" element={<Dashboard />}>
           <Route path="account" element={<Account />} />
           <Route path="my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
           <Route path="my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
           <Route path="orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
           <Route path="wishlist" element={<Wishlist />} />
           <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
         </Route>

      </Routes>
    </>
  );
}

export default App;
