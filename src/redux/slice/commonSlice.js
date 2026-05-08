import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

/* ===========================
   UPDATE PUBLISH STATUS (COMMON API)
=========================== */
export const updatePublishStatus = createAsyncThunk(
    "common/updatePublishStatus",
    async ({ id, type, publish_status }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/publish-status/update",
                { type, id, publish_status },
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to update publish status" }
            );
        }
    }
);

/* ===========================
   COMMON SLICE
=========================== */
const commonSlice = createSlice({
    name: "common",
    initialState: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
        updatedPost: null,
    },
    reducers: {
        resetCommonState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
            state.updatedPost = null;
        },
        clearCommonMessage: (state) => {
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updatePublishStatus.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = "";
            })
            .addCase(updatePublishStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
                state.updatedPost = action.payload?.data;
            })
            .addCase(updatePublishStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetCommonState, clearCommonMessage } = commonSlice.actions;
export default commonSlice.reducer;