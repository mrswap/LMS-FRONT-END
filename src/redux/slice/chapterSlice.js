import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createChapter = createAsyncThunk(
    "chapter/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/chapters", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllChapters = createAsyncThunk(
    "chapter/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/chapters?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getChapterById = createAsyncThunk(
    "chapter/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/chapters/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateChapterById = createAsyncThunk(
    "chapter/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/chapters/${id}`,
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
export const updateSingleChapterStatus = createAsyncThunk(
    "chapter/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/chapters/${id}/toggle-status`,
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
export const deleteSingleChapter = createAsyncThunk(
    "chapter/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/chapters/${id}`,
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
const chapterSlice = createSlice({
    name: "chapter",
    initialState: {
        chapters: [],
        chapter: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetChapterState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createChapter.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createChapter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newChapter = action.payload.data;

                if (!Array.isArray(state.chapters)) {
                    state.chapters = [];
                }
                state.chapters.unshift(newChapter);
            })
            .addCase(createChapter.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllChapters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllChapters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chapters = action.payload.data;
            })
            .addCase(getAllChapters.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getChapterById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getChapterById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chapter = action.payload.data;
            })
            .addCase(getChapterById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateChapterById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateChapterById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.chapters)) {
                    const index = state.chapters.findIndex(
                        (c) => c.id === updated.id
                    );
                    if (index !== -1) {
                        state.chapters[index] = updated;
                    }
                }
                state.chapter = updated;
            })
            .addCase(updateChapterById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleChapterStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleChapterStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.chapters?.data)) {
                    const index = state.chapters.data.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.chapters.data[index] = updated;
                    }
                }
            })
            .addCase(updateSingleChapterStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleChapter.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleChapter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.chapters)) {
                    state.chapters = state.chapters.filter(
                        (c) => c.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleChapter.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetChapterState } = chapterSlice.actions;
export default chapterSlice.reducer;