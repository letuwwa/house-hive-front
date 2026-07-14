import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth.js";

function extractErrorMessage(err) {
    return err.response?.data?.detail || err.message || "Something went wrong";
}

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const user = await authApi.getMe();
            return user;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authApi.login(credentials);
            return data; // { user, tokens }
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await authApi.register(payload);
            return data; // { user, tokens }
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
            return null;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

const authSlice = createSlice({
    name: "auth",

    initialState: {
        user: null,
        accessToken: null,
        loading: true,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

        .addCase(getMe.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        })

        .addCase(getMe.rejected, (state) => {
            state.user = null;
            state.accessToken = null;
            state.loading = false;
        })

        .addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.tokens.access_token;
        })

        .addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.tokens.access_token;
        })

        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.accessToken = null;
        });
    }
});

export default authSlice.reducer;