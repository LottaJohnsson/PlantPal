import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    currentUser?: User | null;
    loading: boolean;
    error?: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    loading: false,
    error: null,
};

// Async action to login user
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (
        {email, password}: { email: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await axios.post('/auth/login', {email, password});
            if (response.data.loggedIn) {
                return {email};
            }
            return rejectWithValue('Login failed');
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            );
        }
    }
);

// Async action to register user
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (
        {email, password}: { email: string; password: string },
        {rejectWithValue}
    ) => {
        try {
            const response = await axios.post('/auth/register', {
                email,
                password,
            });
            if (response.data.registered) {
                return {email};
            }
            return rejectWithValue('Registration failed');
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

// Async action to logout user
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {rejectWithValue}) => {
        try {
            await axios.post('/auth/logout');
            // No payload needed on successful logout
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Logout failed'
            );
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Login user reducers
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.currentUser = action.payload;
            state.error = null;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

        // Register user reducers
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.currentUser = action.payload;
            state.error = null;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload as string;
        });

        // Logout user reducer
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default authSlice.reducer;
