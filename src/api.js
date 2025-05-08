// api.js - Frontend API client for IMC Punching System

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://punching.imcbs.com/api",
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
    try {
      const response = await api.get("/punch/pending");
      // console.log("Raw pending punches response:", response);
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data) {
        // If it's not an array but has data, wrap it
        return [response.data];
      }
      
      return [];
    } catch (error) {
      // console.error("Error fetching pending punches:", error);
      throw error;
    }
  },

  // Get completed punches for current user
  getCompletedPunches: async (limit = 10) => {
    const response = await api.get(`/punch/completed?limit=${limit}`);
    return response.data;
  },

  // Record a punch-in
  punchIn: async (punchData) => {
    // For FormData, we can't check fields directly
    if (punchData instanceof FormData) {
      // Verify required fields in FormData
      const requiredFields = ['punchInLocation', 'punchInTime', 'customerName', 'photo'];
      for (const field of requiredFields) {
        if (!punchData.has(field)) {
          throw new Error(`Required field missing: ${field}`);
        }
      }
    } else {
      // Original validation for JSON data
      if (!punchData.punchInLocation || !punchData.punchInTime ||
          !punchData.customerName || !punchData.photo) {
        throw new Error(
          "Required fields missing: punchInLocation, punchInTime, customerName and photo are required"
        );
      }
    }

    const config = {
      headers: {
        'Content-Type': punchData instanceof FormData ? 'multipart/form-data' : 'application/json'
      }
    };

    try {
      const response = await api.post("/punch/punch-in", punchData, config);
      // console.log("Punch-in response:", response);
      
      // Store punch data in localStorage for later reference
      if (response.data) {
        // Extract the punch ID and ensure it's stored in a consistent format
        const punchId = response.data.id || response.data._id || 
                     (response.data.data && (response.data.data.id || response.data.data._id));
        
        // Create normalized data to store
        const punchToStore = {
          ...response.data,
          id: punchId // Ensure ID is accessible at top level
        };
        
        localStorage.setItem('currentPunch', JSON.stringify(punchToStore));
      }
      
      return response.data;
    } catch (error) {
      // console.error("Punch-in API error:", error);
      throw error;
    }
  },

  // Record a punch-out
  punchOut: async (punchData) => {
    // Validate required fields
    if (!punchData.id || !punchData.punchOutLocation || !punchData.punchOutTime) {
      throw new Error(
        "Required fields missing: id, punchOutLocation and punchOutTime are required"
      );
    }

    try {
      const formattedData = {
        id: punchData.id,
        punchOutTime: punchData.punchOutTime,
        punchOutLocation: punchData.punchOutLocation,
        punchOutDate: punchData.punchOutDate || punchAPI.getCurrentTimeISO().split('T')[0]
      };

      // console.log("Sending punch-out data:", formattedData);
      const response = await api.post("/punch/punch-out", formattedData);
      // console.log("Punch-out response:", response);
      
      // Clear stored punch data on successful punch-out
      localStorage.removeItem('currentPunch');
      
      return response.data;
    } catch (error) {
      // console.error("Punch-out API error:", error.response || error);
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
      const storedPunch = localStorage.getItem('currentPunch');
      if (!storedPunch) return null;
      
      const punchData = JSON.parse(storedPunch);
      return punchData;
    } catch (error) {
      // console.error("Error retrieving stored punch data:", error);
      return null;
    }
  }
};

export default {
  auth: authAPI,
  punch: punchAPI,
};