import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import HomePage from "./pages/LandingPage/HomePage";
import CoursesPage from "./pages/LandingPage/CoursesPage";

// Auth Pages
import LoginPage from "./pages/AuthenticationPage/LoginPage";
import RegisterPage from "./pages/AuthenticationPage/RegisterPage";
import VerifyOTPPage from "./pages/AuthenticationPage/VerifyOTPPage";
import ForgotPasswordPage from "./pages/AuthenticationPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/AuthenticationPage/ResetPasswordPage";

// Protected Pages
import TestsPage from "./pages/LandingPage/TestsPage";
import ProfilePage from "./pages/LandingPage/ProfilePage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        {/* Routes with Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes - accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />

          {/* Protected Routes - require authentication */}
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <TestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes - without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
