import axios from "@/lib/axios";
import * as axiosLib from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
};

type AuthTokens = {
    access: string;
    refresh: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    setIsAuthenticated(true);
                } catch (err) {
                    await refreshToken();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const refreshToken = async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setIsAuthenticated(false);
            return false;
        }

        try {
            const response = await axios.post(`/token/refresh/`, {
                refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem("accessToken", access);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            logout();
            return false;
        }
    };

    const login = async (username: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post<AuthTokens>(`/token/`, {
                username,
                password,
            });

            const { access, refresh } = response.data;

            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            setIsAuthenticated(true);
        } catch (err) {
            if (axiosLib.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "Login failed");
            } else {
                setError("An unexpected error occurred");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
