import {
  axiosInstance,
  setToken,
  setUserId,
  setDisplayName,
  setBoActiveAccounts,
  getUserId,
  handleApiError,
} from "../base/baseApi";

// Helper function to store user data in cookies
const storeUserData = (userData) => {
  if (!userData) return;

  if (userData.user_id) {
    setUserId(userData.user_id);
  }
  if (userData.display_name) {
    setDisplayName(userData.display_name);
  }
  if (userData.bo_active_accounts !== undefined) {
    setBoActiveAccounts(userData.bo_active_accounts);
  }
};

const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/register", {
        display_name: userData.fullName,
        email: userData.email,
        mobile: userData.phone,
        password: userData.password,
      });

      return response.data;
    } catch (error) {
      handleApiError(error, "Registration failed");
    }
  },

  /**
   * Verify OTP for registration, login, or password reset
   * @param {string} userId - User ID
   * @param {string} otp - One-time password
   * @param {string} otpContext - Context (R: Registration, L: Login, F: Forgot Password)
   * @returns {Promise<Object>} Verification response
   */
  verifyOTP: async (userId, otp, otpContext) => {
    try {
      const response = await axiosInstance.post("/verify-otp", {
        user_id: userId,
        otp,
        otp_context: otpContext,
      });

      // Set auth timestamp for all contexts except forgot password
      if (otpContext !== "F") {
        setToken();
      }

      // Store user data from response
      if (response.data.user) {
        storeUserData(response.data.user);
      }

      return response.data;
    } catch (error) {
      handleApiError(error, "Invalid OTP");
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Login response
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/login", {
        mobile: credentials.mobile,
        password: credentials.password,
        remember_me: credentials.remember_me,
        otp_method: credentials.otp_method,
      });

      // Set auth timestamp
      setToken();

      // Store user data from response
      if (response.data.user) {
        storeUserData(response.data.user);
      }

      return response.data;
    } catch (error) {
      handleApiError(error, "Login failed");
    }
  },

  /**
   * Verify login OTP
   * @param {string} otp - One-time password
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Verification response
   */
  verifyLoginOTP: async (otp, userId) => {
    try {
      const response = await axiosInstance.post("/verify-otp", {
        otp,
        user_id: userId,
        otp_context: "L",
      });

      // Set auth timestamp
      setToken();

      // Store user data from response
      if (response.data.user) {
        storeUserData(response.data.user);
      }

      return response.data;
    } catch (error) {
      handleApiError(error, "Invalid OTP");
    }
  },

  /**
   * Request password reset OTP
   * @param {Object} userData - User data (email or mobile)
   * @returns {Promise<Object>} Response with user_id
   */
  forgotPassword: async (userData) => {
    try {
      const requestData = {
        otp_method: userData.otp_method,
        otpContext: "F",
      };

      if (userData.otp_method === "M") {
        requestData.mobile = userData.mobile;
      } else {
        requestData.email = userData.email;
      }

      const response = await axiosInstance.post("/resend-otp", requestData);

      return response.data;
    } catch (error) {
      handleApiError(error, "Forgot Password failed");
    }
  },

  /**
   * Resend OTP
   * @param {Object} userData - User data (email or mobile)
   * @param {string} otpContext - Context (R: Registration, L: Login, F: Forgot Password)
   * @returns {Promise<Object>} Response
   */
  resendOTP: async (userData, otpContext) => {
    try {
      const requestData = {
        otp_method: userData.otp_method || "M",
        otpContext: otpContext,
      };

      if (userData.otp_method === "M") {
        requestData.mobile = userData.mobile;
      } else {
        requestData.email = userData.email;
      }

      const response = await axiosInstance.post("/resend-otp", requestData);

      return response.data;
    } catch (error) {
      handleApiError(error, "Resend OTP failed");
    }
  },

  /**
   * Reset user password
   * @param {Object} data - Reset password data
   * @returns {Promise<Object>} Response
   */
  resetPassword: async (data) => {
    try {
      if (!data.userId) {
        throw new Error("User ID is missing");
      }

      const response = await axiosInstance.post("/reset-password", {
        userId: data.userId,
        pswrd: data.pswrd,
      });

      return response.data;
    } catch (error) {
      handleApiError(error, "Reset Password failed");
    }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await axiosInstance.post("/logout", {});
      // Clear cookies will be handled by clearAuthData() in useAuth hook
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the server request fails, we still want to clear the local token
      // Clear cookies will be handled by clearAuthData() in useAuth hook
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    // Check authentication based on user data, not token
    // (token may be httpOnly and unreadable by JavaScript)
    const userId = getUserId();
    return !!userId;
  },
};

export default authApi;
