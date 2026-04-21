import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createBulkContent = createAsyncThunk(
    "content/create",
    async ({ topicId, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/content-topics/${topicId}/contents/bulk`,
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
export const getAllContents = createAsyncThunk(
    "content/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/contents?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getContentById = createAsyncThunk(
    "content/getById",
    async ({ topicId, id }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/content-topics/${topicId}/contents/${id}`,
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
export const updateSingleContentById = createAsyncThunk(
    "content/updateById",
    async ({ topicId, id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/content-topics/${topicId}/contents/${id}`,
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
export const updateSingleContentStatus = createAsyncThunk(
    "content/updateStatus",
    async ({ topicId, id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/content-topics/${topicId}/contents/${id}/toggle-status`,
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
export const deleteSingleContent = createAsyncThunk(
    "content/delete",
    async ({ topicId, id }, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/content-topics/${topicId}/contents/${id}`,
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
const unitBuilderSlice = createSlice({
    name: "content",
    initialState: {
        contents: [],
        content: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetContentState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createBulkContent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBulkContent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newContent = action.payload.data;

                if (!Array.isArray(state.contents)) {
                    state.contents = [];
                }
                state.contents.unshift(newContent);
            })
            .addCase(createBulkContent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllContents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllContents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.contents = action.payload.data;
            })
            .addCase(getAllContents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getContentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getContentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.content = action.payload.data;
            })
            .addCase(getContentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateSingleContentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleContentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.contents)) {
                    const index = state.contents.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.contents[index] = updated;
                    }
                }
                state.content = updated;
            })
            .addCase(updateSingleContentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleContentStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleContentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload?.data;

                if (Array.isArray(state.contents)) {
                    const index = state.contents.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.contents[index] = updated;
                    }
                }
            })
            .addCase(updateSingleContentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleContent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleContent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.contents)) {
                    state.contents = state.contents.filter(
                        (t) => t.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleContent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetContentState } = unitBuilderSlice.actions;
export default unitBuilderSlice.reducer;