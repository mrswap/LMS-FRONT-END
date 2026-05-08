import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createUser = createAsyncThunk(
    "user/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/users", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllUsers = createAsyncThunk(
    "user/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/users?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getUserById = createAsyncThunk(
    "user/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/users/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateUserById = createAsyncThunk(
    "user/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/users/${id}`,
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
export const updateSingleUserStatus = createAsyncThunk(
    "user/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/users/${id}/toggle-status`,
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
export const deleteSingleUser = createAsyncThunk(
    "user/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/users/${id}`,
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

// Add this to your existing userSlice.js file

// ======================= RESET DEVICE =======================
export const resetUserDevice = createAsyncThunk(
    "user/resetDevice",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/users/${id}/reset-device`,
                {},
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Device reset failed" }
            );
        }
    }
);

// ======================= SLICE =======================
const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        user: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetUserState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newUser = action.payload;

                if (!Array.isArray(state.users)) {
                    state.users = [];
                }
                state.users.unshift(newUser);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users = action.payload.data;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.users)) {
                    const index = state.users.findIndex(
                        (u) => u.id === updated.id
                    );
                    if (index !== -1) {
                        state.users[index] = updated;
                    }
                }
                state.user = updated;
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleUserStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleUserStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                // const updated = action.payload.data;

                // if (Array.isArray(state.users?.data)) {
                //     const index = state.users.data.findIndex(
                //         (t) => t.id === updated.id
                //     );
                //     if (index !== -1) {
                //         state.users.data[index] = updated;
                //     }
                // }
            })
            .addCase(updateSingleUserStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.users)) {
                    state.users = state.users.filter(
                        (u) => u.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })


            // ===== RESET DEVICE =====
            .addCase(resetUserDevice.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetUserDevice.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                // // Optional: You can update user state or add any additional logic
                // if (state.user) {
                //     // If you want to clear any device-related info from user state
                //     state.user.devices_logged_in = 0; // Example property
                // }
            })
            .addCase(resetUserDevice.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });

    },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;