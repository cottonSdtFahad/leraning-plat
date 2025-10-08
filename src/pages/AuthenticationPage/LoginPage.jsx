import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../validations/authSchemas";
import CountryPhoneInput from "../../components/common/CountryPhoneInput";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import LogVideo from "/login.mp4";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || ""
  );
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      country_code: "",
      mobile: "",
      password: "",
      remember_me: false,
      otp_method: "E",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Combine country code with mobile number
      const fullMobile = selectedCountry
        ? `${selectedCountry.dial_code}${data.mobile}`
        : data.mobile;

      console.log("Logging in with mobile:", fullMobile);

      const response = await login({
        ...data,
        mobile: fullMobile,
      });

      console.log("Login response:", response);

      // Check if login was successful (backend returns user_id on success)
      if (response && response.user_id) {
        // Always redirect to OTP verification page after successful login
        navigate("/verify-otp", {
          state: {
            userId: response.user_id,
            otpContext: "L",
            email: response.email || response.user?.email, // Get email from response
            mobile: fullMobile,
            otp_method: data.otp_method, // Use selected OTP method (E or M)
            from: location.state?.from?.pathname || "/",
          },
        });
      } else {
        setError(
          response?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      // Better error messages based on error type
      if (err.error === "Network Error") {
        setError(
          "Cannot connect to server. Please ensure your backend API is running on http://localhost:8000"
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setValue("country_code", country.dial_code);
  };

  return (
    <div className="">
      <div className="relative w-full h-screen bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Video Panel - Left Side */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full z-20"
          initial={{ x: "0%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={LogVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center text-white px-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">New Here?</h1>
              <p className="text-lg mb-8 opacity-90">
                Sign up and discover a great learning experience
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Login Form - Right Side */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full z-10"
          initial={{ x: "0%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="h-full flex items-center justify-center bg-white">
            <motion.div
              className="w-full max-w-md px-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-full space-y-6">
                <div>
                  <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                  </h2>
                </div>
                <motion.div
                  className="text-center text-black px-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h1 className="text-4xl font-bold mb-4">New Here?</h1>
                  <p className="text-lg mb-8 opacity-90">
                    Sign up and discover a great learning experience
                  </p>
                  <Link
                    to="/register"
                    className="inline-block px-8 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-blue-600 transition-colors"
                  >
                    Create Account
                  </Link>
                </motion.div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {successMessage && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            {successMessage}
                          </p>
                        </div>
                        <div className="ml-auto pl-3">
                          <button
                            type="button"
                            onClick={() => setSuccessMessage("")}
                            className="inline-flex text-green-400 hover:text-green-500"
                          >
                            <span className="sr-only">Dismiss</span>
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <ErrorMessage message={error} />

                  <div className="space-y-4">
                    <Controller
                      name="mobile"
                      control={control}
                      render={({ field }) => (
                        <CountryPhoneInput
                          id="mobile"
                          label="Mobile Number"
                          placeholder="Enter mobile number"
                          error={errors.mobile?.message}
                          defaultCountry="Bangladesh"
                          onCountryChange={handleCountryChange}
                          {...field}
                        />
                      )}
                    />
                    <PasswordInput
                      id="password"
                      label="Password"
                      placeholder="Enter password"
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Controller
                        name="remember_me"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <input
                              id="remember_me"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={value}
                              onChange={onChange}
                            />
                            <label
                              htmlFor="remember_me"
                              className="ml-2 block text-sm text-gray-900"
                            >
                              Remember me
                            </label>
                          </>
                        )}
                      />
                    </div>

                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP Method
                    </label>
                    <Controller
                      name="otp_method"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="E"
                              checked={value === "E"}
                              onChange={() => onChange("E")}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Email
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="M"
                              checked={value === "M"}
                              onChange={() => onChange("M")}
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Mobile
                            </span>
                          </label>
                        </div>
                      )}
                    />
                    {errors.otp_method && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.otp_method.message}
                      </p>
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
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
