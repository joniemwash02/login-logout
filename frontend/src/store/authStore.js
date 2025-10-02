
import {create} from "zustand"

const API_URL = "http://localhost:5000/api/auth"

const useAuthStore = create((set) => ({
    user: null,// to store user data
    isLoading: false,// to show loading state
    error: null,// to store error messages
    isAuthenticated: false,// to check if user is authenticated
    isCheckingAuth: true,// to check if auth status is being checked
   
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
            console.log(data);
        } catch (error) {
            set({ error: "Something went wrong" });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
