// src/api.js

import axios from "axios";

// Base URL from VITE env var
const API_BASE = import.meta.env.VITE_API_URL || "https://peekayapi.imcbs.com";

// Token storage keys
const TOKEN_KEY = "auth_token";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap data or handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Optional: Redirect to login page
      window.location.href = "/";
    }
    
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Auth token management
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// ----------------- Auth API -----------------
export const login = async ({ username, password }) => {
  const response = await api.post("/api/v1/auth/login", { username, password });
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
};

export const forgotPassword = ({ username, email }) =>
  api.post("/api/v1/auth/forgot-password", { username, email });

export const verifyOTP = ({ username, otp }) =>
  api.post("/api/v1/auth/verify-otp", { username, otp });

export const resetPassword = ({ token, newPassword }) =>
  api.patch(`/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`, {
    password: newPassword,
  });

// ----------------- Admin API -----------------
// Requires auth token header (added automatically by interceptor)
export const getProfile = () => api.get("/api/v1/admin/profile");

export const updateAdminPassword = ({ currentPassword, newPassword }) =>
  api.patch("/api/v1/admin/update-password", { currentPassword, newPassword });

// ----------------- Data API -----------------
// Fetch user data, master data, and punch records for the current client
export const getUsers = () => api.get("/api/v1/data/users");

export const getMasterData = () => api.get("/api/v1/data/master");

export const getPunchRecords = () => api.get("/api/v1/data/punch-records");

// Default export of axios instance, if you need to call other endpoints directly
export default api;