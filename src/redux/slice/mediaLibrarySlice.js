import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createMedia = createAsyncThunk(
    "media/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/media", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllMedia = createAsyncThunk(
    "media/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/media?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getMediaById = createAsyncThunk(
    "media/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/media/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateMediaById = createAsyncThunk(
    "media/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/media/${id}`,
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
export const updateSingleMediaStatus = createAsyncThunk(
    "media/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/media/${id}/toggle-status`,
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
export const deleteSingleMedia = createAsyncThunk(
    "media/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/media/${id}`,
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
const mediaSlice = createSlice({
    name: "media",
    initialState: {
        media: [],
        singleMedia: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetMediaState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createMedia.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newMedia = action.payload.data;

                if (!Array.isArray(state.media)) {
                    state.media = [];
                }
                state.media.unshift(newMedia);
            })
            .addCase(createMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllMedia.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.media = action.payload.data;
            })
            .addCase(getAllMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getMediaById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMediaById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.singleMedia = action.payload;
            })
            .addCase(getMediaById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateMediaById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateMediaById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.media)) {
                    const index = state.media.findIndex(
                        (m) => m.id === updated.id
                    );
                    if (index !== -1) {
                        state.media[index] = updated;
                    }
                }
                state.singleMedia = updated;
            })
            .addCase(updateMediaById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleMediaStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleMediaStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.media)) {
                    const index = state.media.findIndex(
                        (m) => m.id === updated.id
                    );
                    if (index !== -1) {
                        state.media[index] = updated;
                    }
                }
            })
            .addCase(updateSingleMediaStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleMedia.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.media)) {
                    state.media = state.media.filter(
                        (m) => m.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetMediaState } = mediaSlice.actions;
export default mediaSlice.reducer;