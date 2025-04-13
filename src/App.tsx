import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountSettings from "./pages/AccountSettings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { useAppSelector } from "./store/hooks";

function App() {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
