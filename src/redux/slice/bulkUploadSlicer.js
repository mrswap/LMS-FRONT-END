import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================================================
// CREATE BULK UPLOAD
// ======================================================

export const createBulkUpload = createAsyncThunk(
    "bulkUpload/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/payload",
                data,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Create bulk upload failed",
                }
            );
        }
    }
);

// ======================================================
// GET ALL BULK UPLOADS
// ======================================================

export const getAllBulkUploads = createAsyncThunk(
    "bulkUpload/getAll",
    async (params = {}, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();

            const res = await axiosInstance.get(
                `/bulk-upload?${query}`,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Fetch bulk uploads failed",
                }
            );
        }
    }
);

// ======================================================
// GET BULK UPLOAD BY ID
// ======================================================

export const getBulkUploadById = createAsyncThunk(
    "bulkUpload/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/bulk-upload/${id}`,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Fetch bulk upload failed",
                }
            );
        }
    }
);

// ======================================================
// UPDATE BULK UPLOAD
// ======================================================

export const updateBulkUpload = createAsyncThunk(
    "bulkUpload/update",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/bulk-upload/${id}`,
                data,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Update bulk upload failed",
                }
            );
        }
    }
);

// ======================================================
// BULK UPDATE BULK UPLOADS
// ======================================================

export const bulkUpdateBulkUploads = createAsyncThunk(
    "bulkUpload/bulkUpdate",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/bulk-upload/bulk-update",
                data,
                getAuthConfig()
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: "Bulk update failed",
                }
            );
        }
    }
);

// ======================================================
// SLICE
// ======================================================

const bulkUploadSlice = createSlice({
    name: "bulkUpload",

    initialState: {
        bulkUploads: [],
        bulkUpload: null,

        isLoading: false,
        isSuccess: false,
        isError: false,

        message: "",
    },

    reducers: {
        resetBulkUploadState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder;

        // ======================================================
        // CREATE
        // ======================================================

        builder
            .addCase(createBulkUpload.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(createBulkUpload.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.message = action.payload.message;

                // const newBulkUpload = action.payload.data;

                // if (!Array.isArray(state.bulkUploads)) {
                //     state.bulkUploads = [];
                // }

                // state.bulkUploads.unshift(newBulkUpload);
            })

            .addCase(createBulkUpload.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });

        // ======================================================
        // GET ALL
        // ======================================================

        builder
            .addCase(getAllBulkUploads.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getAllBulkUploads.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.bulkUploads = action.payload.data;
            })

            .addCase(getAllBulkUploads.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });

        // ======================================================
        // GET BY ID
        // ======================================================

        builder
            .addCase(getBulkUploadById.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(getBulkUploadById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.bulkUpload = action.payload.data;
            })

            .addCase(getBulkUploadById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });

        // ======================================================
        // UPDATE
        // ======================================================

        builder
            .addCase(updateBulkUpload.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(updateBulkUpload.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.message = action.payload.message;

                const updatedBulkUpload = action.payload.data;

                if (Array.isArray(state.bulkUploads)) {
                    const index = state.bulkUploads.findIndex(
                        (item) => item.id === updatedBulkUpload.id
                    );

                    if (index !== -1) {
                        state.bulkUploads[index] = updatedBulkUpload;
                    }
                }

                state.bulkUpload = updatedBulkUpload;
            })

            .addCase(updateBulkUpload.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });

        // ======================================================
        // BULK UPDATE
        // ======================================================

        builder
            .addCase(bulkUpdateBulkUploads.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(bulkUpdateBulkUploads.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.message = action.payload.message;

                if (action.payload.data) {
                    state.bulkUploads = action.payload.data;
                }
            })

            .addCase(bulkUpdateBulkUploads.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

                state.message = action.payload?.message;
            });
    },
});

export const { resetBulkUploadState } = bulkUploadSlice.actions;

export default bulkUploadSlice.reducer;