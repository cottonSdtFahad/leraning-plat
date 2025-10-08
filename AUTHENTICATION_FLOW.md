# Authentication Flow Documentation

## Overview

This document describes the complete authentication flow for the learning platform, including registration, login, and password reset processes.

---

## 🔐 Authentication Flows

### 1. Registration Flow

```
┌─────────────┐
│   Register  │ User fills registration form
│    Page     │ (Name, Email, Phone, Password)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │ Validates data, creates user
│  API Call   │ Sends OTP to email/phone
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     OTP     │ User enters 4-digit OTP
│ Verification│ Context: "R" (Registration)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login Page  │ Success message displayed
│             │ "Registration successful!"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   User      │ Enters credentials
│   Login     │ (Mobile + Password)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     OTP     │ User enters 4-digit OTP
│ Verification│ Context: "L" (Login)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │ User successfully logged in
│   / Home    │
└─────────────┘
```

**Step-by-step:**
1. User fills registration form with Name, Email, Phone, Password
2. Frontend sends data to `/register` endpoint
3. Backend creates user and sends OTP
4. User redirected to OTP verification page (Context: "R")
5. User enters OTP received
6. After successful verification → redirected to Login page with success message
7. User logs in with credentials (mobile + password)
8. Backend validates and sends login OTP
9. User redirected to OTP verification page (Context: "L")
10. After successful OTP verification → redirected to Dashboard/Home

---

### 2. Login Flow

```
┌─────────────┐
│ Login Page  │ User enters credentials
│             │ (Mobile, Password, OTP Method)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │ Validates credentials
│  API Call   │ Sends OTP to email/mobile
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     OTP     │ User enters 4-digit OTP
│ Verification│ Context: "L" (Login)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │ User successfully logged in
│   / Home    │
└─────────────┘
```

**Step-by-step:**
1. User enters mobile number and password
2. User selects OTP method (Email or Mobile)
3. Frontend sends data to `/login` endpoint
4. Backend validates credentials and sends OTP
5. User redirected to OTP verification page (Context: "L")
6. User enters OTP received
7. After successful verification → redirected to Dashboard/Home

---

### 3. Forgot Password Flow

```
┌─────────────┐
│   Forgot    │ User enters email or mobile
│  Password   │ Selects OTP method
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │ Validates user exists
│  API Call   │ Sends OTP for password reset
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     OTP     │ User enters 4-digit OTP
│ Verification│ Context: "F" (Forgot Password)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Reset     │ User enters new password
│  Password   │ and confirms it
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login Page  │ Success message displayed
│             │ "Password reset successful!"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   User      │ Enters new credentials
│   Login     │ (Mobile + New Password)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     OTP     │ User enters 4-digit OTP
│ Verification│ Context: "L" (Login)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │ User successfully logged in
│   / Home    │
└─────────────┘
```

**Step-by-step:**
1. User navigates to Forgot Password page
2. User enters email or mobile number
3. User selects OTP method (Email or Mobile)
4. Frontend sends data to `/resend-otp` endpoint
5. Backend validates and sends OTP
6. User redirected to OTP verification page (Context: "F")
7. User enters OTP received
8. After successful verification → redirected to Reset Password page
9. User enters new password and confirms it
10. Frontend sends data to `/reset-password` endpoint
11. After successful reset → redirected to Login page with success message
12. User logs in with new credentials
13. Backend validates and sends login OTP
14. User redirected to OTP verification page (Context: "L")
15. After successful OTP verification → redirected to Dashboard/Home

---

## 🔑 OTP Contexts

The system uses different OTP contexts to handle various scenarios:

| Context | Code | Description | Next Step After Verification |
|---------|------|-------------|------------------------------|
| Registration | `R` | OTP sent after user registration | Redirect to Login Page |
| Login | `L` | OTP sent after login credentials validated | Redirect to Dashboard/Home |
| Forgot Password | `F` | OTP sent for password reset verification | Redirect to Reset Password Page |

---

## 📋 Form Fields

### Registration Form
- **Full Name** (required, 2-50 characters)
- **Email** (required, valid email format)
- **Phone Number** (required, with country code selector)
  - Country flag and dial code displayed
  - Bangladesh (+88) is default
- **Password** (required, min 6 chars, must contain uppercase, lowercase, number)
- **Confirm Password** (required, must match password)

### Login Form
- **Mobile Number** (required, with country code selector)
- **Password** (required, min 6 characters)
- **Remember Me** (optional checkbox)
- **OTP Method** (Email or Mobile)

### Forgot Password Form
- **OTP Method** (Email or Mobile)
- **Email** or **Mobile** (based on OTP method selected)

### OTP Verification Form
- **OTP** (required, exactly 4 digits, numbers only)
- **Resend OTP** button (enabled after 30 second countdown)

### Reset Password Form
- **New Password** (required, min 6 chars, must contain uppercase, lowercase, number)
- **Confirm New Password** (required, must match password)

---

## 🔒 Security Features

### ✅ Implemented Security Measures

1. **Cookie-based Authentication**
   - HTTP-only cookies for token storage
   - SameSite: Strict
   - Secure flag in production (HTTPS)
   - 7-day expiration

2. **Form Validation**
   - Client-side validation with Zod
   - Server-side validation (backend)
   - Real-time error feedback

3. **Password Requirements**
   - Minimum 6 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - Password visibility toggle

4. **OTP Security**
   - 4-digit numeric OTP
   - 30-second resend cooldown
   - Context-specific verification
   - Single-use tokens

5. **Session Management**
   - Automatic token expiration (24 hours)
   - Unauthorized (401) auto-redirect to login
   - Clear auth data on logout

6. **Input Validation**
   - Phone number format validation
   - Email format validation
   - XSS prevention (React auto-escaping)
   - SQL injection prevention (backend parameterized queries)

---

## 🎨 UI/UX Features

### Enhanced User Experience

1. **Country Phone Input**
   - Searchable country dropdown
   - Country flags displayed
   - Auto-formatted dial codes
   - Bangladesh default (+88)

2. **Password Visibility Toggle**
   - Eye icon to show/hide password
   - React Icons (FiEye / FiEyeOff)
   - Accessible with screen readers

3. **Loading States**
   - Animated spinners during API calls
   - Disabled buttons prevent double submission
   - Visual feedback for all actions

4. **Success Messages**
   - Green notification on registration success
   - Success message on password reset
   - Dismissible alerts

5. **Error Handling**
   - Inline field errors
   - API error messages displayed
   - Network error detection
   - User-friendly error messages

6. **Form Components**
   - Reusable FormInput component
   - Reusable PasswordInput component
   - Reusable CountryPhoneInput component
   - Reusable ErrorMessage component
   - Consistent styling with Tailwind CSS

---

## 🛠️ Technical Implementation

### Key Technologies

- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Integration layer
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **React Icons** - Icon library
- **Tailwind CSS** - Styling

### File Structure

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
│   │   ├── FormInput.jsx       # Basic input component
│   │   ├── PasswordInput.jsx   # Password with toggle
│   │   ├── CountryPhoneInput.jsx # Phone with country selector
│   │   └── ErrorMessage.jsx    # Error display
│   └── ProtectedRoute.jsx      # Route protection
├── contexts/
│   └── AuthContext.jsx         # Auth state management
├── pages/
│   └── AuthenticationPage/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── VerifyOTPPage.jsx
│       ├── ForgotPasswordPage.jsx
│       └── ResetPasswordPage.jsx
└── data/
    └── countries.js            # Country data with flags
```

---

## 🧪 Testing Checklist

### Registration
- [ ] All fields required validation
- [ ] Email format validation
- [ ] Phone number validation
- [ ] Password complexity validation
- [ ] Password match validation
- [ ] Country selector works
- [ ] OTP sent successfully
- [ ] OTP verification works
- [ ] Redirect to login after OTP
- [ ] Success message displayed

### Login
- [ ] Mobile number required
- [ ] Password required
- [ ] OTP method selection works
- [ ] Remember me functionality
- [ ] OTP sent successfully
- [ ] OTP verification works
- [ ] Redirect to home after OTP
- [ ] Invalid credentials error

### Forgot Password
- [ ] Email/Mobile validation
- [ ] OTP method toggle works
- [ ] Dynamic field display
- [ ] OTP sent successfully
- [ ] OTP verification works
- [ ] Redirect to reset password

### Reset Password
- [ ] Password requirements enforced
- [ ] Password match validation
- [ ] Password visibility toggle
- [ ] Reset successful
- [ ] Redirect to login
- [ ] Success message displayed

### OTP Verification
- [ ] 4-digit validation
- [ ] Numbers only accepted
- [ ] Context message displayed
- [ ] Resend countdown works
- [ ] Resend OTP works
- [ ] Invalid OTP error
- [ ] Correct redirect per context

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot connect to server"**
- **Solution**: Ensure backend API is running on `http://localhost:8000`
- Check `VITE_API_URL` in `.env` file

**Issue: "OTP not received"**
- **Solution**: Check backend email/SMS configuration
- Verify user email/phone in database
- Check backend logs for errors

**Issue: "Registration successful but not redirecting to OTP page"**
- **Solution**: Backend should return `user_id` in response
- Check console logs for response structure
- Verify navigation state is passed correctly

**Issue: "Form validation not working"**
- **Solution**: Check Zod schema matches field names
- Verify React Hook Form resolver is configured
- Check console for validation errors

---

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/register` | Register new user | `{ display_name, email, mobile, password }` | `{ message, user_id }` |
| POST | `/login` | Login user | `{ mobile, password, remember_me, otp_method }` | `{ user_id, requires_otp }` |
| POST | `/verify-otp` | Verify OTP | `{ user_id, otp, otp_context }` | `{ message, user }` |
| POST | `/resend-otp` | Resend OTP | `{ otp_method, email/mobile, otpContext }` | `{ message, user_id }` |
| POST | `/reset-password` | Reset password | `{ userId, pswrd }` | `{ message }` |
| POST | `/logout` | Logout user | `{}` | `{ message }` |

---

## 🎯 Best Practices

### Development
1. Always use environment variables for API URLs
2. Log API responses during development
3. Handle both success and error cases
4. Provide user-friendly error messages
5. Clear sensitive data on logout

### Security
1. Never log sensitive data (passwords, tokens)
2. Use HTTPS in production
3. Implement rate limiting on backend
4. Validate all inputs (client + server)
5. Use httpOnly cookies for tokens

### UX
1. Show loading states for all async operations
2. Provide clear success/error feedback
3. Allow password visibility toggle
4. Implement form auto-focus
5. Add keyboard navigation support

---

**Version:** 2.0.0  
**Last Updated:** October 2025  
**Status:** ✅ Production Ready

