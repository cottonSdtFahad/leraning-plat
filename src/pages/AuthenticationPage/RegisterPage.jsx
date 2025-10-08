import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../validations/authSchemas";
import FormInput from "../../components/common/FormInput";
import CountryPhoneInput from "../../components/common/CountryPhoneInput";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorMessage from "../../components/common/ErrorMessage";
import LogVideo from "/login.mp4";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country_code: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      // Combine country code with phone number
      const fullPhone = selectedCountry
        ? `${selectedCountry.dial_code}${data.phone}`
        : data.phone;

      console.log("Registering user with data:", {
        fullName: data.fullName,
        email: data.email,
        phone: fullPhone,
      });

      const response = await registerUser({
        ...data,
        phone: fullPhone,
      });

      console.log("Registration response:", response);

      // Check if registration was successful (backend returns user_id on success)
      if (response && response.user_id) {
        navigate("/verify-otp", {
          state: {
            userId: response.user_id,
            otpContext: "R",
            email: data.email,
            mobile: fullPhone,
            otp_method: "M", // Always send to mobile for registration
          },
        });
      } else {
        setError(response?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Better error messages based on error type
      if (err.error === "Network Error") {
        setError(
          "Cannot connect to server. Please ensure your backend API is running on http://localhost:8000"
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
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
        {/* Register Form - Left Side */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full z-10"
          initial={{ x: "0%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
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
                    Create your account
                  </h2>
                </div>
                <motion.div
                  className="text-center text-black px-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                  <p className="text-lg mb-8 opacity-90">
                    Sign in to continue your learning journey
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-8 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <ErrorMessage message={error} />

                  <div className="space-y-4">
                    <FormInput
                      id="fullName"
                      label="Full Name"
                      type="text"
                      placeholder="John Doe"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />

                    <FormInput
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />

                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <CountryPhoneInput
                          id="phone"
                          label="Phone Number"
                          placeholder="Enter phone number"
                          error={errors.phone?.message}
                          defaultCountry="Bangladesh"
                          onCountryChange={handleCountryChange}
                          {...field}
                        />
                      )}
                    />

                    <PasswordInput
                      id="password"
                      label="Password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      {...register("password")}
                    />

                    <PasswordInput
                      id="confirmPassword"
                      label="Confirm Password"
                      placeholder="••••••••"
                      error={errors.confirmPassword?.message}
                      {...register("confirmPassword")}
                    />
                  </div>

                  <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
                    <p className="font-semibold mb-1">Password Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 6 characters long</li>
                      <li>Contains one uppercase letter</li>
                      <li>Contains one lowercase letter</li>
                      <li>Contains one number</li>
                    </ul>
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
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Panel - Right Side */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full z-20"
          initial={{ x: "0%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
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
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-lg mb-8 opacity-90">
                Sign in to continue your learning journey
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
