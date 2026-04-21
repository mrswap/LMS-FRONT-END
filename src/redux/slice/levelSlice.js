import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createLevel = createAsyncThunk(
    "level/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/levels", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllLevels = createAsyncThunk(
    "level/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/levels?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getLevelById = createAsyncThunk(
    "level/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/levels/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateLevelById = createAsyncThunk(
    "level/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/levels/${id}`,
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
export const updateSingleLevelStatus = createAsyncThunk(
    "level/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/levels/${id}/toggle-status`,
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
export const deleteSingleLevel = createAsyncThunk(
    "level/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/levels/${id}`,
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
const levelSlice = createSlice({
    name: "level",
    initialState: {
        levels: [],
        level: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetLevelState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createLevel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createLevel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newLevel = action.payload.data;

                if (!Array.isArray(state.levels)) {
                    state.levels = [];
                }
                state.levels.unshift(newLevel);
            })
            .addCase(createLevel.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllLevels.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllLevels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.levels = action.payload.data;
            })
            .addCase(getAllLevels.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getLevelById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLevelById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.level = action.payload.data;
            })
            .addCase(getLevelById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateLevelById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLevelById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.levels)) {
                    const index = state.levels.findIndex(
                        (l) => l.id === updated.id
                    );
                    if (index !== -1) {
                        state.levels[index] = updated;
                    }
                }
                state.level = updated;
            })
            .addCase(updateLevelById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleLevelStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleLevelStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.levels?.data)) {
                    const index = state.levels.data.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.levels.data[index] = updated;
                    }
                }
            })
            .addCase(updateSingleLevelStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleLevel.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleLevel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.levels)) {
                    state.levels = state.levels.filter(
                        (l) => l.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleLevel.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetLevelState } = levelSlice.actions;
export default levelSlice.reducer;