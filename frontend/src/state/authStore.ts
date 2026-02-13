import { create } from "zustand";
import * as api from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface User {
    name: string;
    email: string;
    sub: string; // user_id
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    googleLogin: (googleToken: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: false,
    token: null,
    user: null,

    checkAuth: () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                set({ isAuthenticated: true, token, user: decoded });
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("access_token");
                set({ isAuthenticated: false, token: null, user: null });
            }
        } else {
            set({ isAuthenticated: false, token: null, user: null });
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await api.login(email, password);
            localStorage.setItem("access_token", response.access_token);
            const decoded = jwtDecode<User>(response.access_token);
            set({
                isAuthenticated: true,
                token: response.access_token,
                user: decoded,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
            // Just create the account, don't automatically log in
            await api.signup(name, email, password);
            // Don't store token or set authentication state
            // User must explicitly log in after signup
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    googleLogin: async (googleToken: string) => {
        set({ isLoading: true });
        try {
            const response = await api.googleAuth(googleToken);
            localStorage.setItem("access_token", response.access_token);
            const decoded = jwtDecode<User>(response.access_token);
            set({
                isAuthenticated: true,
                token: response.access_token,
                user: decoded,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        set({ isAuthenticated: false, token: null, user: null });
    },
}));

