import axios from "axios";
import Cookies from "js-cookie";
import { API_URL, API_URL_ADM, API_URL_IMG } from "./config";

// Export API URLs for use in other modules
export { API_URL, API_URL_ADM, API_URL_IMG };

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token management
export const getAuthToken = () => {
  // Read the 'token' cookie set by the server (via Set-Cookie header)
  // Note: If server sets httpOnly cookie, this will return undefined
  // That's OK - the browser still sends it automatically with withCredentials: true
  return Cookies.get("token");
};

export const getUserId = () => Cookies.get("user_id");
export const getDisplayName = () => Cookies.get("display_name");
export const getBoActiveAccounts = () => {
  const storedValue = Cookies.get("bo_active_accounts");
  if (!storedValue) return 0;
  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error("Error parsing boActiveAccounts:", error);
    return 0;
  }
};

// Check if user is authenticated by checking if we have user data
export const isAuthenticated = () => {
  // Don't rely on reading the token (it may be httpOnly)
  // Instead, check if we have user data in cookies
  const userId = getUserId();
  const timestamp = Cookies.get("authTokenTimestamp");
  return !!(userId && timestamp);
};

// Auth storage management
export const setAuthTimestamp = () => {
  // The server sets 'token' cookie via Set-Cookie header (httpOnly, secure)
  // We only set the timestamp for expiration tracking
  const isProduction = window.location.protocol === "https:";
  Cookies.set("authTokenTimestamp", Date.now().toString(), {
    expires: 7,
    path: "/",
    sameSite: "strict",
    secure: isProduction,
  });
};

// Keep setToken for backward compatibility (just calls setAuthTimestamp)
export const setToken = () => setAuthTimestamp();

// Cookie configuration helper
const getCookieConfig = () => ({
  expires: 7,
  path: "/",
  sameSite: "strict",
  secure: window.location.protocol === "https:",
});

export const setUserId = (userId) =>
  Cookies.set("user_id", userId, getCookieConfig());

export const setDisplayName = (displayName) =>
  Cookies.set("display_name", displayName, getCookieConfig());

export const setBoActiveAccounts = (boActiveAccounts) => {
  Cookies.set(
    "bo_active_accounts",
    JSON.stringify(boActiveAccounts),
    getCookieConfig()
  );
};

// Clear all auth data
export const clearAuthData = () => {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("authTokenTimestamp", { path: "/" });
  Cookies.remove("user_id", { path: "/" });
  Cookies.remove("display_name", { path: "/" });
  Cookies.remove("bo_active_accounts", { path: "/" });
};

// Token expiration check
export const isAuthTokenExpired = () => {
  const timestamp = Cookies.get("authTokenTimestamp");
  if (!timestamp) return true;

  const tokenAge = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  return tokenAge > maxAge;
};

// Request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or unauthorized access
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw (
    error.response?.data || { message: defaultMessage, error: error.message }
  );
};
