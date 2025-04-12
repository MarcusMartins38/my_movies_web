import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    isAuthenticated: boolean;
    redirectPath?: string;
};

export function ProtectedRoute({ isAuthenticated, redirectPath = "/login" }: ProtectedRouteProps) {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
