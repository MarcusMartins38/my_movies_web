import axios from "axios";

const api = axios.create({
    baseURL: "http://0.0.0.0:3000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response.data?.code === "token_not_valid" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("Refresh token not found");

                const res = await api.post("/token/refresh/", { refresh: refreshToken });
                const newAccessToken = res.data.access;

                localStorage.setItem("accessToken", newAccessToken);
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
