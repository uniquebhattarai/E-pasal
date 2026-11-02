import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { sendOtp, signUp } from "../services/Api";
import { ApiConnector } from "../services/ApiConnector";
import toast from "react-hot-toast";
import { Button } from "../component/common";
import { openAuthModal } from "../slices/AuthSlice";

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
        toast.success("Account created successfully!");
        dispatch(openAuthModal("login"));
        navigate("/"); 
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
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-gray-500 text-center mt-1.5 text-xs sm:text-sm">
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
                  className="w-12 h-12 lg:w-14 lg:h-14 border border-border-input rounded-lg text-lg font-semibold text-text-main text-center outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
              containerStyle={{ justifyContent: "space-between", gap: "0 8px" }}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-6"
            >
              Verify Email
            </Button>
          </form>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                dispatch(openAuthModal("signup"));
                navigate("/");
              }}
              className="text-text-muted flex items-center gap-x-2 hover:text-primary transition cursor-pointer"
            >
              <BiArrowBack /> Back To Signup
            </button>
            <button
              type="button"
              className="flex items-center text-primary font-medium gap-x-2 hover:underline"
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
