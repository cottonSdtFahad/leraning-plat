# Complete Authentication System Guide

## 🚀 Overview

This learning platform features a **production-ready authentication system** with:

- ✅ **React Hook Form** with Controller for advanced form management
- ✅ **Zod Schema Validation** for type-safe form validation
- ✅ **Custom Error Handling** with beautiful UI feedback
- ✅ **Reusable Components** (FormInput, ErrorMessage)
- ✅ **Loading States** with spinner animations
- ✅ **OTP Verification** with countdown timer
- ✅ **Protected Routes** with automatic redirects
- ✅ **Cookie-based Authentication** with httpOnly security

## 📦 Dependencies

```json
{
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "zod": "^3.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "js-cookie": "^3.x"
}
```

## 📁 Project Structure

```
src/
├── api/
│   ├── base/
│   │   ├── baseApi.js          # Axios instance & interceptors
│   │   └── config.js           # API URLs
│   └── auth/
│       └── authApi.js          # Auth endpoints
├── validations/
│   └── authSchemas.js          # Zod validation schemas
├── components/
│   ├── common/
│   │   ├── FormInput.jsx       # Reusable form input with error handling
│   │   └── ErrorMessage.jsx    # Styled error message component
│   ├── ProtectedRoute.jsx      # Route protection wrapper
│   └── layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── MainLayout.jsx
├── contexts/
│   └── AuthContext.jsx         # Global auth state
└── pages/
    └── AuthenticationPage/
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── VerifyOTPPage.jsx
        ├── ForgotPasswordPage.jsx
        └── ResetPasswordPage.jsx
```

## 🔒 Schema Validation with Zod

### Login Schema

```javascript
loginSchema = z.object({
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[+]?[\d\s-()]+$/, "Invalid mobile number format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  remember_me: z.boolean().optional(),
  otp_method: z.enum(["E", "M"]),
});
```

### Register Schema

```javascript
registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[+]?[\d\s-()]+$/, "Invalid phone number"),
    password: z
      .string()
      .min(6)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

### Benefits of Zod:

- ✅ Type-safe validation
- ✅ Custom error messages
- ✅ Complex validation rules
- ✅ Cross-field validation (password matching)
- ✅ Runtime type checking

## 🎮 React Hook Form Controller

### When to Use Controller?

**Use `register` for:**

- Simple text inputs
- Standard HTML inputs
- No custom onChange logic needed

**Use `Controller` for:**

- Custom components
- Radio buttons / Checkboxes with complex logic
- Third-party UI libraries
- Need precise control over value/onChange

### Example: Radio Button with Controller

```javascript
<Controller
  name="otp_method"
  control={control}
  render={({ field: { onChange, value } }) => (
    <div className="flex space-x-4">
      <label>
        <input
          type="radio"
          value="E"
          checked={value === "E"}
          onChange={() => onChange("E")}
        />
        <span>Email</span>
      </label>
      <label>
        <input
          type="radio"
          value="M"
          checked={value === "M"}
          onChange={() => onChange("M")}
        />
        <span>Mobile</span>
      </label>
    </div>
  )}
/>
```

### Example: OTP Input with Controller

```javascript
<Controller
  name="otp"
  control={control}
  render={({ field: { onChange, value } }) => (
    <input
      type="text"
      maxLength="6"
      value={value}
      onChange={(e) => {
        // Only allow numbers
        const val = e.target.value.replace(/\D/g, "");
        onChange(val);
      }}
      placeholder="000000"
    />
  )}
/>
```

## 🎨 Reusable Components

### FormInput Component

A reusable input component with built-in error handling:

```javascript
<FormInput
  id="email"
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  error={errors.email?.message}
  {...register("email")}
/>
```

**Features:**

- Automatic error styling (red border)
- Label support
- Error message display
- ForwardRef for React Hook Form
- Flexible styling with className prop

### ErrorMessage Component

Displays API errors with icon and styling:

```javascript
<ErrorMessage message={error} />
```

**Features:**

- Only renders when message exists
- Consistent styling across pages
- Icon for visual feedback
- Accessible with ARIA

## 🔐 Form Validation Examples

### 1. Login Page

```javascript
const {
  control,
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    mobile: "",
    password: "",
    remember_me: false,
    otp_method: "E",
  },
});
```

**Validations:**

- Mobile: Required, valid phone format
- Password: Required, min 6 characters
- OTP Method: Enum (E or M)

### 2. Register Page

```javascript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(registerSchema),
});
```

**Validations:**

- Full Name: Required, 2-50 characters
- Email: Required, valid email format
- Phone: Required, valid phone format
- Password: Required, min 6 chars, complexity rules
- Confirm Password: Must match password

### 3. OTP Verification

```javascript
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(otpSchema),
});
```

**Validations:**

- OTP: Required, exactly 6 digits, numbers only

## 🎯 Error Handling Strategy

### 1. Form Validation Errors (Client-Side)

Displayed inline under each field:

```javascript
{
  errors.email && (
    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
  );
}
```

### 2. API Errors (Server-Side)

Displayed at top of form:

```javascript
try {
  const response = await login(data);
  // Handle success
} catch (err) {
  setError(err.message || "Login failed. Please try again.");
}
```

### 3. Network Errors

Caught by axios interceptors:

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 🔄 Loading States

All forms include loading states with spinner:

```javascript
<button type="submit" disabled={loading}>
  {loading ? (
    <>
      <svg className="animate-spin ...">{/* Spinner SVG */}</svg>
      Signing in...
    </>
  ) : (
    "Sign in"
  )}
</button>
```

**Benefits:**

- Visual feedback during API calls
- Prevents duplicate submissions
- Professional user experience

## 📋 Complete Feature List

### ✅ Login Page

- Schema validation with Zod
- Controller for radio buttons
- Remember me checkbox
- OTP method selection
- Loading state with spinner
- Error handling (form + API)
- Redirect after login

### ✅ Register Page

- All fields validated
- Password strength requirements shown
- Password confirmation matching
- Real-time validation feedback
- Beautiful error messages
- FormInput components

### ✅ Forgot Password Page

- Dynamic field based on OTP method
- Conditional validation (email OR mobile)
- Controller for radio selection
- Back to login link

### ✅ Reset Password Page

- Password complexity validation
- Password confirmation
- Requirements display
- Session validation (userId check)

### ✅ OTP Verification Page

- 6-digit numeric only input
- Controller for custom onChange
- Resend OTP with countdown
- Auto-redirect based on context
- Clear error messages

## 🚦 Form Submission Flow

```
1. User fills form
   ↓
2. Client-side validation (Zod)
   ↓ (if valid)
3. Loading state activated
   ↓
4. API call (axios)
   ↓
5. Success: Navigate to next page
   OR
   Error: Display error message
   ↓
6. Loading state deactivated
```

## 🎨 UX Enhancements

### 1. Password Requirements Display

Shows requirements before user types:

```javascript
<div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
  <p className="font-semibold mb-1">Password Requirements:</p>
  <ul className="list-disc list-inside space-y-1">
    <li>At least 6 characters long</li>
    <li>Contains one uppercase letter</li>
    <li>Contains one lowercase letter</li>
    <li>Contains one number</li>
  </ul>
</div>
```

### 2. OTP Countdown Timer

Visual feedback for resend:

```javascript
{
  !canResend ? (
    <p>Resend OTP in {resendTimer}s</p>
  ) : (
    <button onClick={handleResendOTP}>Resend OTP</button>
  );
}
```

### 3. Loading Spinners

Professional loading indicators:

```javascript
<svg className="animate-spin h-5 w-5">{/* Tailwind animate-spin */}</svg>
```

## 🔍 Debugging Tips

### Check Form Errors

```javascript
console.log("Form Errors:", errors);
```

### Watch Form Values

```javascript
const watchedValues = watch();
console.log("Current Values:", watchedValues);
```

### Validation Schema Testing

```javascript
try {
  loginSchema.parse(formData);
  console.log("Valid!");
} catch (error) {
  console.log("Validation Errors:", error.errors);
}
```

## 📊 Performance Optimizations

1. **React Hook Form** - Minimizes re-renders
2. **Zod** - Fast runtime validation
3. **Controller** - Only re-renders controlled component
4. **memo** - Could be added to FormInput for large forms
5. **Lazy Loading** - Auth pages loaded only when needed

## 🧪 Testing Checklist

### Login

- [ ] Valid credentials login
- [ ] Invalid credentials error
- [ ] Empty fields validation
- [ ] Remember me functionality
- [ ] OTP method selection
- [ ] Loading state display
- [ ] Redirect to intended page

### Register

- [ ] All fields required
- [ ] Email format validation
- [ ] Phone format validation
- [ ] Password complexity check
- [ ] Password confirmation match
- [ ] API error handling
- [ ] Redirect to OTP page

### OTP Verification

- [ ] 6-digit validation
- [ ] Numbers only input
- [ ] Resend OTP countdown
- [ ] Resend OTP functionality
- [ ] Invalid OTP error
- [ ] Context-based redirect

### Forgot/Reset Password

- [ ] Email/Mobile validation
- [ ] OTP method toggle
- [ ] Password requirements
- [ ] Password confirmation
- [ ] Success redirect to login

## 🔐 Security Best Practices

✅ **Implemented:**

- HTTP-only cookies for tokens
- CSRF protection (SameSite)
- Input validation (client + server)
- Password complexity requirements
- Secure flag in production
- XSS prevention (React escaping)
- 401 auto-redirect

## 📚 Additional Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Hookform Resolvers](https://github.com/react-hook-form/resolvers)

---

**Version:** 2.0.0  
**Last Updated:** October 2025  
**Status:** ✅ Production Ready
