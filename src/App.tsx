import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import AccountSettings from "./pages/AccountSettings";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import { AuthLayout } from "./routes/AuthLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { useAppSelector } from "./store/hooks";

function App() {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const theme = useAppSelector((state) => state.theme.mode);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/settings" element={<AccountSettings />} />
                </Route>

                <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
