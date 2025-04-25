// api.js - Frontend API client for IMC Punching System

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://peekayuser.imcbs.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token to all authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (id, password) => {
    const response = await api.post("/auth/login", { id, password });
    // Store token after successful login
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    // Add any additional logout logic here
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

// Punch system API endpoints
export const punchAPI = {
  // Get customers for dropdown list
  getCustomers: async () => {
    const response = await api.get("/punch/customers");
    return response.data;
  },

  // Get pending punches for current user
  getPendingPunches: async () => {
    const response = await api.get("/punch/pending");
    return response.data;
  },

  // Get completed punches for current user
  getCompletedPunches: async (limit = 10) => {
    const response = await api.get(`/punch/completed?limit=${limit}`);
    return response.data;
  },

  // Record a punch-in
  punchIn: async (punchData) => {
    // Validate required fields
    if (!punchData.punchInLocation || !punchData.punchInTime) {
      throw new Error(
        "Required fields missing: punchInLocation and punchInTime are required"
      );
    }

    const formattedData = {
      punchInTime: punchData.punchInTime,
      punchInLocation: punchData.punchInLocation,
      // Optional fields
      customerName: punchData.customerName || null,
      photo: punchData.photo || null,
    };

    const response = await api.post("/punch/punch-in", formattedData);
    return response.data;
  },

  // Record a punch-out
  punchOut: async (punchData) => {
    // Validate required fields
    if (
      !punchData.id ||
      !punchData.punchOutLocation ||
      !punchData.punchOutTime ||
      !punchData.customerName
    ) {
      throw new Error(
        "Required fields missing: id, punchOutLocation, punchOutTime, and customerName are required"
      );
    }

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append("id", punchData.id);
    formData.append("punchOutTime", punchData.punchOutTime);
    formData.append("punchOutLocation", punchData.punchOutLocation);
    formData.append("customerName", punchData.customerName);
    
    // Add photo file if available
    if (punchData.file) {
      formData.append("photo", punchData.file);
    }

    // Custom config for multipart/form-data
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };

    // Make the API call with FormData
    try {
      const response = await api.post("/punch/punch-out", formData, config);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
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
};

export default {
  auth: authAPI,
  punch: punchAPI,
};