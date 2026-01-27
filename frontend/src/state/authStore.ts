import { create } from "zustand";
import * as api from "@/lib/api";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: false,
    token: null,

    checkAuth: () => {
        const token = localStorage.getItem("access_token");
        set({ isAuthenticated: !!token, token });
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const response = await api.login(email, password);
            localStorage.setItem("access_token", response.access_token);
            set({
                isAuthenticated: true,
                token: response.access_token,
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
            const response = await api.signup(name, email, password);
            localStorage.setItem("access_token", response.access_token);
            set({
                isAuthenticated: true,
                token: response.access_token,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        set({ isAuthenticated: false, token: null });
    },
}));
