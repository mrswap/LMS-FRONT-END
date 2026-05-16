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
    threads: [],
    selectedThread: null,
    messagesByThread: {},
    threadLoading: false,
    messageLoading: false,
    actionLoading: false,
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
    },

    extraReducers: (builder) => {
        builder
            // GET THREADS
            .addCase(getThreads.pending, (state) => {
                state.threadLoading = true;
            })
            .addCase(getThreads.fulfilled, (state, action) => {
                state.threadLoading = false;
                state.threads = action.payload.data.data;
            })
            .addCase(getThreads.rejected, (state) => {
                state.threadLoading = false;
            })

            // GET SINGLE THREAD
            .addCase(getSingleThread.pending, (state) => {
                state.messageLoading = true;
            })
            .addCase(getSingleThread.fulfilled, (state, action) => {
                state.messageLoading = false;
                const thread = action.payload.data;
                state.selectedThread = thread;
                state.messagesByThread[thread.id] = thread.messages;
            })
            .addCase(getSingleThread.rejected, (state) => {
                state.messageLoading = false;
            })

            // RESOLVE THREAD
            .addCase(resolveThread.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(resolveThread.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { threadId, data } = action.payload;

                const threadInList = state.threads.find(t => t.id === threadId);
                if (threadInList) {
                    threadInList.status = "resolved";
                }

                if (state.selectedThread && state.selectedThread.id === threadId) {
                    state.selectedThread.status = "resolved";
                }
            })
            .addCase(resolveThread.rejected, (state) => {
                state.actionLoading = false;
            })

            // REOPEN THREAD
            .addCase(reopenThread.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(reopenThread.fulfilled, (state, action) => {
                state.actionLoading = false;
                const { threadId, data } = action.payload;

                const threadInList = state.threads.find(t => t.id === threadId);
                if (threadInList) {
                    threadInList.status = "reopened";
                }

                if (state.selectedThread && state.selectedThread.id === threadId) {
                    state.selectedThread.status = "reopened";
                }
            })
            .addCase(reopenThread.rejected, (state) => {
                state.actionLoading = false;
            })
    },
});

// ================= EXPORTS =================
export const {
    setSelectedThread,
    addRealtimeMessage,
    addOptimisticMessage,
    removeOptimisticMessage,
} = supportSlice.actions;

export default supportSlice.reducer;