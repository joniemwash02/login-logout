import { create } from "zustand";

const API_URL = "http://localhost:5000/api/auth";

const useAuthStore = create((set) => ({
  user: null, // to store user data
  isLoading: false, // to show loading state
  error: null, // to store error messages
  isAuthenticated: false, // to check if user is authenticated
  isCheckingAuth: true, // to check if auth status is being checked

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // if backend returns error status
        throw new Error(data.message || "Signup failed");
      }

      // success
      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
      });
    } catch (error) {
      // show error properly
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-email?code=${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle wrong credentials or server errors
        throw new Error(data.message || "Login failed");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: data.user,
      });

      return true; // return success so you can navigate after
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
      });
      return false; // return failure
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false, // ✅ make sure to stop the checking state
        isLoading: false,
        error: error.message,
      });
    }
  },
}));

export default useAuthStore;
