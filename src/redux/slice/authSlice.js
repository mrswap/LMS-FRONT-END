import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/login", userData);
            // console.log("Login Response:", res.data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers: {
        resetState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        logout: (state) => {
            state.user = null;
            state.isSuccess = false;

            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.message = action.payload.message;

                localStorage.setItem("token", action.payload.token);
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;