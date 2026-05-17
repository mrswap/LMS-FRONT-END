import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ================= GET THREADS =================
export const getThreads = createAsyncThunk(
    "support/getThreads",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/support?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// ================= GET SINGLE THREAD =================
export const getSingleThread = createAsyncThunk(
    "support/getSingleThread",
    async (threadId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/support/${threadId}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// ================= SEND REPLY =================
export const sendReply = createAsyncThunk(
    "support/sendReply",
    async ({ threadId, formData }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/support/${threadId}/reply`,
                formData,
                getAuthConfig("multipart/form-data")
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// ================= RESOLVE THREAD =================
export const resolveThread = createAsyncThunk(
    "support/resolveThread",
    async (threadId, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/support/${threadId}/resolve`,
                {},
                getAuthConfig()
            );
            return { threadId, data: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// ================= REOPEN THREAD =================
export const reopenThread = createAsyncThunk(
    "support/reopenThread",
    async (threadId, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/support/${threadId}/reopen`,
                {},
                getAuthConfig()
            );
            return { threadId, data: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// ================= INITIAL STATE =================
const initialState = {
    threads: {
        data: [],      // Actual threads array
        current_page: 1,
        last_page: 1,
        total: 0
    },
    selectedThread: null,
    messagesByThread: {},
    threadLoading: false,
    messageLoading: false,
    actionLoading: false,
    error: null
};

// ================= SLICE =================
const supportSlice = createSlice({
    name: "support",
    initialState,
    reducers: {
        setSelectedThread: (state, action) => {
            state.selectedThread = action.payload;
        },

        addRealtimeMessage: (state, action) => {
            const message = action.payload;
            const threadId = message.thread_id;

            if (!state.messagesByThread[threadId]) {
                state.messagesByThread[threadId] = [];
            }

            const exists = state.messagesByThread[threadId].find(
                (msg) => msg.id === message.id
            );

            if (!exists) {
                state.messagesByThread[threadId].push(message);
            }
        },

        addOptimisticMessage: (state, action) => {
            const message = action.payload;
            const threadId = message.thread_id;

            if (!state.messagesByThread[threadId]) {
                state.messagesByThread[threadId] = [];
            }

            state.messagesByThread[threadId].push(message);
        },

        removeOptimisticMessage: (state, action) => {
            const tempId = action.payload;

            Object.keys(state.messagesByThread).forEach((threadId) => {
                state.messagesByThread[threadId] = state.messagesByThread[threadId].filter(
                    (msg) => msg.tempId !== tempId
                );
            });
        },

        clearFilters: (state) => {
            // This will be handled by component, just resetting state
            state.threads.data = [];
        }
    },

    extraReducers: (builder) => {
        builder
            // GET THREADS
            .addCase(getThreads.pending, (state) => {
                state.threadLoading = true;
                state.error = null;
            })
            .addCase(getThreads.fulfilled, (state, action) => {
                state.threadLoading = false;
                // Check if response has pagination structure
                if (action.payload?.data?.data) {
                    // If API returns paginated response
                    state.threads.data = action.payload.data.data;
                    state.threads.current_page = action.payload.data.current_page || 1;
                    state.threads.last_page = action.payload.data.last_page || 1;
                    state.threads.total = action.payload.data.total || 0;
                } else if (Array.isArray(action.payload?.data)) {
                    // If API returns direct array
                    state.threads.data = action.payload.data;
                } else if (Array.isArray(action.payload)) {
                    // If response is directly array
                    state.threads.data = action.payload;
                } else {
                    state.threads.data = [];
                }
            })
            .addCase(getThreads.rejected, (state, action) => {
                state.threadLoading = false;
                state.error = action.payload?.message || "Failed to fetch threads";
                state.threads.data = [];
            })

            // GET SINGLE THREAD
            .addCase(getSingleThread.pending, (state) => {
                state.messageLoading = true;
                state.error = null;
            })
            .addCase(getSingleThread.fulfilled, (state, action) => {
                state.messageLoading = false;
                const thread = action.payload?.data;
                if (thread) {
                    state.selectedThread = thread;
                    state.messagesByThread[thread.id] = thread.messages || [];
                }
            })
            .addCase(getSingleThread.rejected, (state, action) => {
                state.messageLoading = false;
                state.error = action.payload?.message || "Failed to fetch thread";
            })

            // SEND REPLY
            .addCase(sendReply.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(sendReply.fulfilled, (state, action) => {
                state.actionLoading = false;
                const newMessage = action.payload?.data;
                if (newMessage && state.selectedThread) {
                    if (!state.messagesByThread[state.selectedThread.id]) {
                        state.messagesByThread[state.selectedThread.id] = [];
                    }
                    state.messagesByThread[state.selectedThread.id].push(newMessage);
                }
            })
            .addCase(sendReply.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload?.message || "Failed to send reply";
            })

            // RESOLVE THREAD
            .addCase(resolveThread.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(resolveThread.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { threadId } = action.payload;

                // Update in threads list
                const threadIndex = state.threads.data.findIndex(t => t.id === threadId);
                if (threadIndex !== -1) {
                    state.threads.data[threadIndex].status = "resolved";
                }

                // Update selected thread if open
                if (state.selectedThread && state.selectedThread.id === threadId) {
                    state.selectedThread.status = "resolved";
                }
            })
            .addCase(resolveThread.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload?.message || "Failed to resolve thread";
            })

            // REOPEN THREAD
            .addCase(reopenThread.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(reopenThread.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { threadId } = action.payload;

                // Update in threads list
                const threadIndex = state.threads.data.findIndex(t => t.id === threadId);
                if (threadIndex !== -1) {
                    state.threads.data[threadIndex].status = "open";
                }

                // Update selected thread if open
                if (state.selectedThread && state.selectedThread.id === threadId) {
                    state.selectedThread.status = "open";
                }
            })
            .addCase(reopenThread.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload?.message || "Failed to reopen thread";
            });
    },
});

// ================= EXPORTS =================
export const {
    setSelectedThread,
    addRealtimeMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
    clearFilters,
} = supportSlice.actions;

export default supportSlice.reducer;