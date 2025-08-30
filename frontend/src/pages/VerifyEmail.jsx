import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();

    const { accountType, firstName, lastName, email, password, confirmPassword } =
      signupData;

    try {
      const response = await ApiConnector("POST", signUp.SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (response.data.success) {
        toast.success(" Account created successfully!");
        navigate("/login"); 
      } else {
        toast.error(response.data.message || " Verification failed");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(" Something went wrong during signup");
    }
  };

  const handleResendOtp = async () => {
  if (!signupData?.email) return;

  try {
    const response = await ApiConnector("POST",sendOtp.VERIFY_OTP,{
        email:signupData.email, 
      });
    if (response.data.success) {
      toast.success("OTP sent successfully!");
    } else {
      toast.error(response.data.message || "Failed to send OTP");
    }
  } catch (err) {
    toast.error("Error sending OTP. Try again.");
    console.error(err);
  }
};

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 bg-gray-50">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-center text-gray-900">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-center mt-2">
            We've sent a 6-digit verification code to your email. Enter it below
            to activate your account.
          </p>

          {/* OTP Form */}
          <form onSubmit={handleVerifyAndSignup} className="mt-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="w-12 h-12 lg:w-14 lg:h-14 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900 text-center outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                />
              )}
              containerStyle={{ justifyContent: "space-between", gap: "0 8px" }}
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-green-700 transition-all duration-200 shadow-md"
            >
              Verify Email
            </button>
          </form>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/signup">
              <p className="text-gray-600 flex items-center gap-x-2 hover:text-green-600 transition">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              type="button"
              className="flex items-center text-green-600 font-medium gap-x-2 hover:underline"
              onClick={handleResendOtp}
            >
              <RxCountdownTimer /> Resend Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
