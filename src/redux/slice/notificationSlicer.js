import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

/* ===========================
   GET ALL NOTIFICATIONS
=========================== */
export const getAllNotifications = createAsyncThunk(
    "notification/getAllNotifications",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const url = query ? `/notifications?${query}` : "/notifications";
            const res = await axiosInstance.get(url, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch notifications" }
            );
        }
    }
);

/* ===========================
   MARK NOTIFICATION AS READ
=========================== */
export const markNotificationAsRead = createAsyncThunk(
    "notification/markNotificationAsRead",
    async (notificationId, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/notifications/read/${notificationId}`,
                {},
                getAuthConfig()
            );
            // Get current state to check if notification was unread
            const state = thunkAPI.getState();
            const notification = state.notification.notifications.find(n => n.id === notificationId);
            const wasUnread = notification && !notification.is_read;

            return {
                data: res.data.data,
                notificationId: notificationId,
                message: res.data.message,
                wasUnread: wasUnread  // Send this info
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to mark notification as read" }
            );
        }
    }
);

/* ===========================
   GET UNREAD COUNT
=========================== */
export const getUnreadCount = createAsyncThunk(
    "notification/getUnreadCount",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/notifications/unread-count",
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch unread count" }
            );
        }
    }
);

/* ===========================
   MARK ALL NOTIFICATIONS AS READ
=========================== */
export const markAllAsRead = createAsyncThunk(
    "notification/markAllAsRead",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/notifications/read-all",
                {},
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to mark all as read" }
            );
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 20,
            total: 0
        },
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers: {
        resetNotificationState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.pagination = {
                current_page: 1,
                last_page: 1,
                per_page: 20,
                total: 0
            };
        },
        // Remove decrementUnreadCount from here if you're using it in component
        // Or keep it but don't call it from component
        resetUnreadCount: (state) => {
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotifications.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload.data || [];
                if (action.payload) {
                    state.pagination = {
                        current_page: action.payload.current_page || 1,
                        last_page: action.payload.last_page || 1,
                        per_page: action.payload.per_page || 20,
                        total: action.payload.total || 0
                    };
                }
                state.message = action.payload.message || "Notifications fetched successfully";
            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Failed to fetch notifications";
            })

            .addCase(markNotificationAsRead.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message || "Notification marked as read";

                // Update notification in array
                const updatedNotification = action.payload.data;
                if (updatedNotification && state.notifications.length > 0) {
                    const index = state.notifications.findIndex(
                        n => n.id === updatedNotification.id
                    );
                    if (index !== -1) {
                        const wasUnread = !state.notifications[index].is_read;
                        state.notifications[index] = updatedNotification;

                        // ✅ Sirf tabhi decrement karo jab actually unread tha
                        if (wasUnread && state.unreadCount > 0) {
                            state.unreadCount -= 1;
                        }
                    }
                }
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Failed to mark notification as read";
            })

            .addCase(getUnreadCount.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.unreadCount = action.payload?.unread_count || 0;
                state.message = action.payload?.message || "Unread count fetched";
            })
            .addCase(getUnreadCount.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Failed to fetch unread count";
            })

            .addCase(markAllAsRead.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(markAllAsRead.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message || "All notifications marked as read";

                if (state.notifications && state.notifications.length > 0) {
                    state.notifications.forEach(notification => {
                        notification.is_read = true;
                        notification.read_at = new Date().toISOString();
                    });
                }

                state.unreadCount = 0;
            })
            .addCase(markAllAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || "Failed to mark all as read";
            });
    },
});

export const {
    resetNotificationState,
    clearNotifications,
    resetUnreadCount
} = notificationSlice.actions;

export default notificationSlice.reducer;