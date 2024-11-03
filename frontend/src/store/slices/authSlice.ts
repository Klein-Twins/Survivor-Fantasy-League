import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState, User } from "../../types/auth.ts";


const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk<
    User,
    { email: string; password: string; username: string },
    { rejectValue: string }
>('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', userData );
        console.log(response);
        return response.data.user; //assumes response includes User Object
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Signup failed');
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
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { logout } =  authSlice.actions;
export default authSlice.reducer;