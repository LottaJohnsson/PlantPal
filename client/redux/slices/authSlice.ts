import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {response} from "express";

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string
}

const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    error: ''
};


export const loginUserR = createAsyncThunk(
    "loginUser",
    async (user: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/login', user);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);



export const registerUserR = createAsyncThunk(
    'registerUser',
    async (user: LoginPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/register', user);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const logoutUserR = createAsyncThunk(
    'logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Login user reducers
        builder.addCase(loginUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(loginUserR.fulfilled, (state: AuthState) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = '';
        });
        builder.addCase(loginUserR.rejected, (state: AuthState, action: PayloadAction<any>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload?.message || 'Something went wrong';
        });

        // Register user reducers
        builder.addCase(registerUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(registerUserR.fulfilled, (state: AuthState) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = '';
        });
        builder.addCase(registerUserR.rejected, (state: AuthState, action: PayloadAction<any>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload.message || 'Something went wrong';
        });

        // Logout user reducer
        builder.addCase(logoutUserR.pending, (state: AuthState) => {
            state.loading = true;
        });
        builder.addCase(logoutUserR.fulfilled, (state: AuthState) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.error = '';
        });
        builder.addCase(logoutUserR.rejected, (state: AuthState, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload.message || 'Something went wrong';
        });
    },
});

export default authSlice.reducer;
