import { z } from "zod";

// Common validation patterns
const phoneRegex = /^[\d\s-()]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Login Schema
export const loginSchema = z.object({
  country_code: z.string().optional(),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(phoneRegex, "Invalid mobile number format")
    .min(4, "Mobile number must be at least 4 digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember_me: z.boolean().optional(),
  otp_method: z.enum(["E", "M"], {
    required_error: "Please select an OTP method",
  }),
});

// Register Schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    country_code: z.string().optional(),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Invalid phone number format")
      .min(4, "Phone number must be at least 4 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase, one lowercase, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Forgot Password Schema
export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    country_code: z.string().optional(),
    mobile: z
      .string()
      .regex(phoneRegex, "Invalid mobile number format")
      .min(4, "Mobile number must be at least 4 digits")
      .optional()
      .or(z.literal("")),
    otp_method: z.enum(["E", "M"]),
  })
  .refine(
    (data) => {
      if (data.otp_method === "E") {
        return data.email && data.email.length > 0;
      } else {
        return data.mobile && data.mobile.length > 0;
      }
    },
    {
      message: "Please provide your email or mobile number",
      path: ["email"], // This will be dynamically updated
    }
  );

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase, one lowercase, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// OTP Verification Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});
