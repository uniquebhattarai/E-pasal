import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiConnector } from "../services/ApiConnector";
import { resetpassword } from "../services/Api";
import { toast } from "react-hot-toast";
import { setLoading } from "../slices/AuthSlice";

function UpdatePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);

    dispatch(setLoading(true));
    try {
      const response = await ApiConnector("POST", resetpassword.RESET_PASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      {loading ? (
        <div className="text-center text-emerald-600 font-semibold">Loading...</div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-emerald-600 text-center mb-4">
            Choose New Password
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Almost done!Enter your new password
          </p>

          <form onSubmit={handleOnSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter your new password"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white outline-none transition duration-200"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/10 cursor-pointer text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm your password"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white outline-none transition duration-200"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/10 cursor-pointer text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-200"
            >
              Reset Password
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-emerald-600 font-semibold hover:underline"
            >
              <BiArrowBack className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
