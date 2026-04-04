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
export const createModule = createAsyncThunk(
    "module/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/modules", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllModules = createAsyncThunk(
    "module/getAll",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/modules", getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getModuleById = createAsyncThunk(
    "module/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/modules/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateModuleById = createAsyncThunk(
    "module/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/modules/${id}`,
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
export const updateSingleModuleStatus = createAsyncThunk(
    "module/updateStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(
                `/modules/${id}/status`,
                { status },
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
export const deleteSingleModule = createAsyncThunk(
    "module/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/modules/${id}`,
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
const moduleSlice = createSlice({
    name: "module",
    initialState: {
        modules: [],
        module: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetModuleState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createModule.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createModule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newModule = action.payload.data;

                if (!Array.isArray(state.modules)) {
                    state.modules = [];
                }
                state.modules.unshift(newModule);
            })
            .addCase(createModule.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllModules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllModules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.modules = action.payload.data;
            })
            .addCase(getAllModules.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getModuleById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getModuleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.module = action.payload.data;
            })
            .addCase(getModuleById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateModuleById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateModuleById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.modules)) {
                    const index = state.modules.findIndex(
                        (m) => m.id === updated.id
                    );
                    if (index !== -1) {
                        state.modules[index] = updated;
                    }
                }
                state.module = updated;
            })
            .addCase(updateModuleById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleModuleStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleModuleStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;
                const index = state.modules.findIndex(
                    (m) => m.id === updated.id
                );
                if (index !== -1) {
                    state.modules[index] = updated;
                }
            })
            .addCase(updateSingleModuleStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleModule.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleModule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.modules)) {
                    state.modules = state.modules.filter(
                        (m) => m.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleModule.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetModuleState } = moduleSlice.actions;
export default moduleSlice.reducer;