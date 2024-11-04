import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState, User } from "../../types/auth.ts";
import { SignUpFormData } from "../../components/auth/forms/SignupForm.tsx";

interface SignupError {
    message: string;
    status: number;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk<
    User,
    SignUpFormData,
    { rejectValue: SignupError }
>('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', userData );
        return response.data.user; //assumes response includes User Object
    } catch (error: any) {
        return rejectWithValue({
            message: error.response?.data?.message || 'Signup failed',
            status: error.response?.status || 500 // Fallback to 500 if no status is available
        });
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Ensure payload is defined before accessing its properties
                    state.error = action.payload.message; // or customize as needed
                    console.error(`Error ${action.payload.status}: ${action.payload.message}`);
                } else {
                    state.error = 'Unexpected error...'; // Fallback error message
                }
            });
    },
});

export const { logout } =  authSlice.actions;
export default authSlice.reducer;