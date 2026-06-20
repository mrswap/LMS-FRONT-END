import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================================================
// CREATE AUTOMATED IMPORT
// ======================================================

export const createAutomatedImport = createAsyncThunk(
    "automated/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/imports/html",
                data,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Create automated import failed",
                }
            );
        }
    }
);

// ======================================================
// GET ALL IMPORT LOGS
// ======================================================

export const getAllImportLogs = createAsyncThunk(
    "automated/getAllLogs",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(
                `/setting/imports/logs?${query}`,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Fetch import logs failed",
                }
            );
        }
    }
);

// ======================================================
// SLICE
// ======================================================

const automatedSlicer = createSlice({
    name: "automated",

    initialState: {
        importLogs: [],

        isLoading: false,
        isSuccess: false,
        isError: false,

        message: "",
    },

    reducers: {
        resetAutomatedState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ======================================================
            // CREATE AUTOMATED IMPORT
            // ======================================================

            .addCase(createAutomatedImport.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })

            .addCase(createAutomatedImport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })

            .addCase(createAutomatedImport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ======================================================
            // GET ALL IMPORT LOGS
            // ======================================================

            .addCase(getAllImportLogs.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getAllImportLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.importLogs = action.payload.data || [];
            })

            .addCase(getAllImportLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });
    },
});

export const { resetAutomatedState } = automatedSlicer.actions;

export default automatedSlicer.reducer;