import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

/* ===========================
   GET DASHBOARD DATA
=========================== */
export const getDashboardData = createAsyncThunk(
    "dashboard/getDashboardData",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/dashboard",
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch dashboard data" }
            );
        }
    }
);

/* ===========================
   SLICE
=========================== */
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboardData: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            /* ===== GET DASHBOARD DATA ===== */
            .addCase(getDashboardData.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dashboardData = action.payload;
                state.message = action.payload.message;
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetDashboardState, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;