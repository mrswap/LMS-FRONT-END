import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createDesignation = createAsyncThunk(
    "designation/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/designations",
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllDesignation = createAsyncThunk(
    "designation/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(
                `/setting/designations?${query}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getDesignationById = createAsyncThunk(
    "designation/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/setting/designations/${id}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateDesignationById = createAsyncThunk(
    "designation/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/designations/${id}`,
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Update failed" }
            );
        }
    }
);

// ======================= UPDATE STATUS =======================
export const updateSingleDesignationStatus = createAsyncThunk(
    "designation/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/designations/${id}/toggle-status`,
                {},
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Status update failed" }
            );
        }
    }
);

// ======================= DELETE =======================
export const deleteSingleDesignation = createAsyncThunk(
    "designation/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/setting/designations/${id}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Delete failed" }
            );
        }
    }
);

// ======================= SLICE =======================
const designationSlice = createSlice({
    name: "designation",
    initialState: {
        designations: [],
        designation: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetDesignationState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createDesignation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createDesignation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newItem = action.payload;

                if (!Array.isArray(state.designations)) {
                    state.designations = [];
                }
                state.designations.unshift(newItem);
            })
            .addCase(createDesignation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllDesignation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllDesignation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.designations = action.payload.data;
            })
            .addCase(getAllDesignation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getDesignationById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDesignationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.designation = action.payload.data;
            })
            .addCase(getDesignationById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateDesignationById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateDesignationById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.designations)) {
                    const index = state.designations.findIndex(
                        (r) => r.id === updated.id
                    );
                    if (index !== -1) {
                        state.designations[index] = updated;
                    }
                }
                state.designation = updated;
            })
            .addCase(updateDesignationById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleDesignationStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleDesignationStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.designations)) {
                    const index = state.designations.findIndex(
                        (r) => r.id === updated.id
                    );
                    if (index !== -1) {
                        state.designations[index] = updated;
                    }
                }
            })
            .addCase(updateSingleDesignationStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleDesignation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleDesignation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.designations)) {
                    state.designations = state.designations.filter(
                        (r) => r.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleDesignation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetDesignationState } = designationSlice.actions;
export default designationSlice.reducer;