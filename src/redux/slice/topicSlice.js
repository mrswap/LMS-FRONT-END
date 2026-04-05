import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";

// 🔹 Common Header Function
const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": "en",
        },
    };
};

// ======================= CREATE =======================
export const createTopic = createAsyncThunk(
    "topic/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/topics", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllTopics = createAsyncThunk(
    "topic/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/topics?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getTopicById = createAsyncThunk(
    "topic/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/topics/${id}`, getAuthConfig());
            console.log("response", res.data);

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateTopicById = createAsyncThunk(
    "topic/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/topics/${id}`,
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
export const updateSingleTopicStatus = createAsyncThunk(
    "topic/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/topics/${id}/toggle-status`,
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
export const deleteSingleTopic = createAsyncThunk(
    "topic/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/topics/${id}`,
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
const topicSlice = createSlice({
    name: "topic",
    initialState: {
        topics: [],
        topic: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetTopicState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createTopic.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newTopic = action.payload.data;

                if (!Array.isArray(state.topics)) {
                    state.topics = [];
                }
                state.topics.unshift(newTopic);
            })
            .addCase(createTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllTopics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTopics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.topics = action.payload.data;
            })
            .addCase(getAllTopics.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getTopicById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTopicById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.topic = action.payload.data;
            })
            .addCase(getTopicById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateTopicById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTopicById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;


                if (Array.isArray(state.topics)) {
                    const index = state.topics.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.topics[index] = updated;
                    }
                }
                state.topic = updated;
            })
            .addCase(updateTopicById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleTopicStatus.pending, (state) => {
                state.isLoading = true;
            })
            // ===== UPDATE STATUS =====
            .addCase(updateSingleTopicStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.topics?.data)) {
                    const index = state.topics.data.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.topics.data[index] = updated;
                    }
                }
            })
            .addCase(updateSingleTopicStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleTopic.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.topics)) {
                    state.topics = state.topics.filter(
                        (t) => t.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetTopicState } = topicSlice.actions;
export default topicSlice.reducer;