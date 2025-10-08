import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../api/auth/authApi";
import {
  getUserId,
  getDisplayName,
  getBoActiveAccounts,
  clearAuthData,
  isAuthTokenExpired,
} from "../api/base/baseApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount and restore user data from cookies
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userId = getUserId();
        const displayName = getDisplayName();
        const boActiveAccounts = getBoActiveAccounts();

        // Check if token exists and is not expired
        if (userId && !isAuthTokenExpired()) {
          setUser({
            user_id: userId,
            display_name: displayName,
            bo_active_accounts: boActiveAccounts,
          });
          setIsAuthenticated(true);
        } else {
          // Token expired or doesn't exist, clear everything
          clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const verifyOTP = async (userId, otp, otpContext) => {
    try {
      const response = await authApi.verifyOTP(userId, otp, otpContext);

      if (response.user && otpContext !== "F") {
        setUser(response.user);
        setIsAuthenticated(true);
      }

      return response;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const forgotPassword = async (userData) => {
    try {
      const response = await authApi.forgotPassword(userData);
      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await authApi.resetPassword(data);
      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const resendOTP = async (userData, otpContext) => {
    try {
      const response = await authApi.resendOTP(userData, otpContext);
      return response;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    verifyOTP,
    logout,
    forgotPassword,
    resetPassword,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
