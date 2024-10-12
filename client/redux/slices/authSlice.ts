import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {response} from "express";

interface User {
    email: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthState {
    isAuthenticated: boolean;
    currentUser?: User | null;
    loading: boolean;
    error: string
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    loading: false,
    error: ''
};


export const loginUserR = createAsyncThunk(
    "loginUser",
    (user: LoginPayload) => {
        return axios
            .post('/auth/login', user)
            .then(response => response.data)
    }
)


export const registerUserR = createAsyncThunk(
    'registerUser',
    (user: LoginPayload) => {
        return axios
            .post('/auth/register', user)
            .then(response => response.data)
    }
)


export const logoutUserR = createAsyncThunk(
    'logout',
    () => {
        return axios.post('/auth/logout').then(response => response.data)
    }
)


// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(loginUserR.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.currentUser = action.payload;
            state.error = '';
        });
        builder.addCase(loginUserR.rejected, (state: AuthState, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.error.message || 'Something went wrong';
        });

        // Register user reducers
        builder.addCase(registerUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(registerUserR.fulfilled, (state: AuthState, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.currentUser = action.payload;
            state.error = '';
        });
        builder.addCase(registerUserR.rejected, (state: AuthState, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.error.message || 'Something went wrong';
        });

        // Logout user reducer
        builder.addCase(logoutUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(logoutUserR.fulfilled, (state: AuthState) => {
            console.log("success");
            state.isAuthenticated = false;
            state.currentUser = null;
            state.loading = false;
            state.error = '';
        });
        builder.addCase(logoutUserR.rejected, (state: AuthState, action) => {
            console.log("fail");
            state.loading = false;
            state.error = action.error.message || 'Something went wrong';
        });
    },
});

export default authSlice.reducer;
