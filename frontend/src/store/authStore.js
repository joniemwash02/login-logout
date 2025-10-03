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
  login: async (email, password)=>{
    set({ isLoading: true, error: null })
    try {
      const response =await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message || "Login failed");
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
  }
}));

export default useAuthStore;
