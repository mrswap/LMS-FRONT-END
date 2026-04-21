import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createRole = createAsyncThunk(
    "roles/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/roles",
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
export const getAllRoles = createAsyncThunk(
    "roles/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(
                `/setting/roles?${query}`,
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
export const getRoleById = createAsyncThunk(
    "roles/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/setting/roles/${id}`,
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
export const updateRoleById = createAsyncThunk(
    "roles/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/roles/${id}`,
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
export const updateSingleRoleStatus = createAsyncThunk(
    "roles/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/roles/${id}/toggle-status`,
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
export const deleteSingleRole = createAsyncThunk(
    "roles/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/setting/roles/${id}`,
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
const rolesSlice = createSlice({
    name: "roles",
    initialState: {
        roles: [],
        role: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetRolesState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newRole = action.payload;

                if (!Array.isArray(state.roles)) {
                    state.roles = [];
                }
                state.roles.unshift(newRole);
            })
            .addCase(createRole.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllRoles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.roles = action.payload;
            })
            .addCase(getAllRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getRoleById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRoleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.role = action.payload;
            })
            .addCase(getRoleById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateRoleById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateRoleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.roles)) {
                    const index = state.roles.findIndex(
                        (r) => r.id === updated.id
                    );
                    if (index !== -1) {
                        state.roles[index] = updated;
                    }
                }
                state.role = updated;
            })
            .addCase(updateRoleById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleRoleStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleRoleStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.roles)) {
                    const index = state.roles.findIndex(
                        (r) => r.id === updated.id
                    );
                    if (index !== -1) {
                        state.roles[index] = updated;
                    }
                }
            })
            .addCase(updateSingleRoleStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.roles)) {
                    state.roles = state.roles.filter(
                        (r) => r.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleRole.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetRolesState } = rolesSlice.actions;
export default rolesSlice.reducer;