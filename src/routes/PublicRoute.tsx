import { Navigate, Outlet } from "react-router-dom";

type PublicRouteProps = {
    isAuthenticated: boolean;
    redirectPath?: string;
};

export function PublicRoute({ isAuthenticated, redirectPath = "/home" }: PublicRouteProps) {
    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
}
