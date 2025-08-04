// api.js - Frontend API client for IMC Punching System

import axios from "axios";

// Base URL configuration
const API_BASE =
  import.meta.env.VITE_API_URL || "https://punching.imcbs.com/api";

// Token storage keys
const TOKEN_KEY = "token";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token to all authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear stored token and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
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

// Auth API endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    // Store token after successful login
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },

  forgotPassword: (data) => api.post("/api/auth/forgot-password", data),

  verifyOTP: (data) => api.post("/api/auth/verify-otp", data),

  resetPassword: ({ token, newPassword }) =>
    api.patch(`/auth/reset-password?token=${encodeURIComponent(token)}`, {
      password: newPassword,
    }),

  logout: () => {
    logout();
  },

  isAuthenticated: () => {
    return isAuthenticated();
  },
};

// Admin API endpoints
export const adminAPI = {
  getProfile: () => api.get("/admin/profile"),

  updatePassword: ({ currentPassword, newPassword }) =>
    api.patch("/admin/update-password", { currentPassword, newPassword }),
};

// Punch system API endpoints
export const punchAPI = {
  // Get customers for dropdown list
  getCustomers: async () => {
    const response = await api.get("/api/punch/customers");
    console.log("data is", response);
    return response.data;
  },

  // Get pending punches for current user
  getPendingPunches: async () => {
    try {
      const response = await api.get("/api/punch/pending");

      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else if (response.data) {
        // If it's not an array but has data, wrap it
        return [response.data];
      }

      return [];
    } catch (error) {
      throw error;
    }
  },

  // Get completed punches for current user
  getCompletedPunches: async (limit = 10) => {
    const response = await api.get(`/api/punch/completed?limit=${limit}`);
    return response.data;
  },

  // Record a punch-in
  punchIn: async (punchData) => {
    // For FormData, we can't check fields directly
    if (punchData instanceof FormData) {
      // Verify required fields in FormData
      const requiredFields = [
        "punchInLocation",
        "punchInTime",
        "customerName",
        "photo",
      ];
      for (const field of requiredFields) {
        if (!punchData.has(field)) {
          throw new Error(`Required field missing: ${field}`);
        }
      }
    } else {
      // Original validation for JSON data
      if (
        !punchData.punchInLocation ||
        !punchData.punchInTime ||
        !punchData.customerName ||
        !punchData.photo
      ) {
        throw new Error(
          "Required fields missing: punchInLocation, punchInTime, customerName and photo are required"
        );
      }
    }

    const config = {
      headers: {
        "Content-Type":
          punchData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    };

    try {
      const response = await api.post("/api/punch/punch-in", punchData, config);

      // Store punch data in localStorage for later reference
      if (response.data) {
        // Extract the punch ID and ensure it's stored in a consistent format
        const punchId =
          response.data.id ||
          response.data._id ||
          (response.data.data &&
            (response.data.data.id || response.data.data._id));

        // Create normalized data to store
        const punchToStore = {
          ...response.data,
          id: punchId, // Ensure ID is accessible at top level
        };

        localStorage.setItem("currentPunch", JSON.stringify(punchToStore));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Record a punch-out
  punchOut: async (punchData) => {
    // Validate required fields
    if (
      !punchData.id ||
      !punchData.punchOutLocation ||
      !punchData.punchOutTime
    ) {
      throw new Error(
        "Required fields missing: id, punchOutLocation and punchOutTime are required"
      );
    }

    try {
      const formattedData = {
        id: punchData.id,
        punchOutTime: punchData.punchOutTime,
        punchOutLocation: punchData.punchOutLocation,
        punchOutDate:
          punchData.punchOutDate || punchAPI.getCurrentTimeISO().split("T")[0],
      };

      const response = await api.post("/api/punch/punch-out", formattedData);

      // Clear stored punch data on successful punch-out
      localStorage.removeItem("currentPunch");

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current location coordinates
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  },

  // Helper to format current time in the required format for the API
  getCurrentTimeISO: () => {
    // Returns current time in ISO format with Asia/Kolkata timezone offset
    const now = new Date();
    // Format: YYYY-MM-DDTHH:MM:SS+05:30
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .replace("Z", "+05:30");
  },

  // Format a standard date object to ISO with India timezone
  formatTimeISO: (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date)) {
      throw new Error("Invalid date object");
    }
    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      .toISOString()
      .replace("Z", "+05:30");
  },

  // Format location object to string
  formatLocation: (location) => {
    if (!location || !location.latitude || !location.longitude) {
      throw new Error("Invalid location object");
    }
    return `${location.latitude},${location.longitude}`;
  },

  // Format seconds to readable time
  formatTimeSpent: (seconds) => {
    if (!seconds || isNaN(seconds)) return "N/A";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  },

  // Get punch data from localStorage
  getCurrentPunchData: () => {
    try {
      const storedPunch = localStorage.getItem("currentPunch");
      if (!storedPunch) return null;

      const punchData = JSON.parse(storedPunch);
      return punchData;
    } catch (error) {
      return null;
    }
  },
};

// Data API endpoints (for compatibility with admin features)
export const dataAPI = {
  getUsers: () => api.get("/data/users"),
  getMasterData: () => api.get("/data/master"),
  getPunchRecords: () => api.get("/data/punch-records"),
};

// Default export with organized API groups
export default {
  auth: authAPI,
  admin: adminAPI,
  punch: punchAPI,
  data: dataAPI,
};
