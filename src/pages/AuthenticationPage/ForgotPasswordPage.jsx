import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import { forgotPasswordSchema } from "../../validations/authSchemas";
import FormInput from "../../components/common/FormInput";
import CountryPhoneInput from "../../components/common/CountryPhoneInput";
import ErrorMessage from "../../components/common/ErrorMessage";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      country_code: "",
      mobile: "",
      email: "",
      otp_method: "E",
    },
  });

  const otp_method = watch("otp_method");

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);

    try {
      // Combine country code with mobile number if using mobile OTP
      const fullMobile =
        data.otp_method === "M" && selectedCountry
          ? `${selectedCountry.dial_code}${data.mobile}`
          : data.mobile;

      const response = await forgotPassword({
        ...data,
        mobile: fullMobile,
      });

      console.log("Forgot password response:", response);

      // Check if request was successful (backend returns user_id on success)
      if (response && response.user_id) {
        navigate("/verify-otp", {
          state: {
            userId: response.user_id,
            otpContext: "F",
            email: data.email,
            mobile: fullMobile,
            otp_method: data.otp_method, // E or M based on user choice
          },
        });
      } else {
        setError(response?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your details to receive a password reset OTP
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage message={error} />

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
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="M"
                      checked={value === "M"}
                      onChange={() => onChange("M")}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mobile</span>
                  </label>
                </div>
              )}
            />
          </div>

          {otp_method === "E" ? (
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          ) : (
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
          )}

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
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
