import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../validations/authSchemas";
import FormInput from "../../components/common/FormInput";
import CountryPhoneInput from "../../components/common/CountryPhoneInput";
import PasswordInput from "../../components/common/PasswordInput";
import ErrorMessage from "../../components/common/ErrorMessage";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
    </div>
  );
};

export default RegisterPage;
