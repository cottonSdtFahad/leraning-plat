import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { otpSchema } from "../../validations/authSchemas";
import ErrorMessage from "../../components/common/ErrorMessage";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();

  const { userId, otpContext, email, mobile, otp_method, from } =
    location.state || {};

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!userId || !otpContext) {
      navigate("/login");
      return;
    }

    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, userId, otpContext, navigate]);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await verifyOTP(userId, data.otp, otpContext);

      console.log("OTP verification response:", response);

      // Check if OTP verification was successful
      // Backend returns message starting with "OTP verified successfully"
      const isSuccess =
        response &&
        (response.success ||
          response.user ||
          (response.message &&
            response.message
              .toLowerCase()
              .includes("otp verified successfully")));

      if (isSuccess) {
        console.log("OTP verified successfully, redirecting...", {
          otpContext,
          from,
        });

        // Handle different OTP contexts
        switch (otpContext) {
          case "R": // Registration - redirect to login page
            navigate("/login", {
              state: {
                message: "Registration successful! Please login to continue.",
              },
            });
            break;
          case "F": // Forgot Password - redirect to reset password page
            navigate("/reset-password", { state: { userId } });
            break;
          case "L": {
            // Login - redirect to home or intended page
            const redirectTo = from || "/";
            console.log("Redirecting to:", redirectTo);
            navigate(redirectTo, { replace: true });
            break;
          }
          default:
            navigate("/");
        }
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");

    try {
      const userData = {
        email: email,
        mobile: mobile,
        otp_method: otp_method || "M", // Use passed otp_method or default to "E"
      };

      console.log("Resending OTP with:", userData);

      await resendOTP(userData, otpContext);

      setResendTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const getContextMessage = () => {
    switch (otpContext) {
      case "R":
        return "Registration";
      case "L":
        return "Login";
      case "F":
        return "Password Reset";
      default:
        return "Verification";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {otp_method === "M"
              ? "Enter the OTP sent to your mobile"
              : "Enter the OTP sent to your email"}
          </p>
          <p className="mt-1 text-center text-sm font-medium text-gray-700">
            {otp_method === "M" ? mobile : email}
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Context: {getContextMessage()}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={error} />

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter 4-digit OTP
            </label>
            <Controller
              name="otp"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  id="otp"
                  type="text"
                  maxLength="4"
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.otp ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest`}
                  placeholder="0000"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    onChange(val);
                  }}
                />
              )}
            />

            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>

          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Resend OTP in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
