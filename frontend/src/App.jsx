import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./slices/AuthSlice";
import { setUser } from "./slices/ProfileSlice";

import Navbar from './component/Navbar';
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
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./component/PrivateRoute";
import Settings from "./pages/Settings";
import CategoryDetails from "./pages/CategoryDetails";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSucess";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Clear invalid token/user
    if (!token || !user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setToken(null));
      dispatch(setUser(null));
    } else {
      dispatch(setToken(JSON.parse(token)));
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <>
      <div className='bg-green-600 border-b-[1px] border-b-green-700'>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:id" element={<CategoryDetails/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:token" element={<UpdatePassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
  
        

         <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
         <Route path="my-profile" element={<MyProfile />} />
         <Route path="settings" element={<Settings />} />
          </Route>

      </Routes>
    </>
  );
}

export default App;
