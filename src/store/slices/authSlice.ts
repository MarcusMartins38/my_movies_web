import api from "@/lib/axios";
import { UpdateUserData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type User = {
    username: string;
    email: string;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/token/", { username, password });
            return {
                accessToken: res.data.access,
                refreshToken: res.data.refresh,
            };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.detail || "Login failed");
        }
    },
);

export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async () => {
    const res = await api.get("/users/me/");
    return res.data;
});

export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (userData: UpdateUserData, { rejectWithValue }) => {
        try {
            const res = await api.patch("/users/me/", userData);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Failed to update profile");
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
