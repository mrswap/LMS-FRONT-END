import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE OPTION =======================
export const createOption = createAsyncThunk(
    "assessmentOption/create",
    async ({ questionId, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/assessments/questions/${questionId}/options`,
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create option failed" }
            );
        }
    }
);

// ======================= GET ALL OPTIONS =======================
export const getAllOptions = createAsyncThunk(
    "assessmentOption/getAll",
    async (questionId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/assessments/questions/${questionId}/options`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch options failed" }
            );
        }
    }
);

// ======================= GET OPTION BY ID =======================
export const getOptionById = createAsyncThunk(
    "assessmentOption/getById",
    async (optionId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/assessments/options/${optionId}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch option failed" }
            );
        }
    }
);

// ======================= UPDATE OPTION =======================
export const updateOption = createAsyncThunk(
    "assessmentOption/update",
    async ({ questionId, optionId, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/assessments/options/${optionId}`,
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Update option failed" }
            );
        }
    }
);

// ======================= DELETE OPTION =======================
export const deleteOption = createAsyncThunk(
    "assessmentOption/delete",
    async (optionId, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/assessments/options/${optionId}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Delete option failed" }
            );
        }
    }
);

// ======================= SLICE =======================
const optionSlice = createSlice({
    name: "assessmentOption",
    initialState: {
        options: [],
        option: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetOptionState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        clearOptions: (state) => {
            state.options = [];
            state.option = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE OPTION =====
            .addCase(createOption.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOption.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                if (!Array.isArray(state.options)) {
                    state.options = [];
                }
                state.options.unshift(action.payload);
            })
            .addCase(createOption.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL OPTIONS =====
            .addCase(getAllOptions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOptions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.options = action.payload;
            })
            .addCase(getAllOptions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET OPTION BY ID =====
            .addCase(getOptionById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOptionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.option = action.payload;
            })
            .addCase(getOptionById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE OPTION =====
            .addCase(updateOption.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOption.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                const index = state.options.findIndex(
                    (opt) => opt.id === updated.id
                );
                if (index !== -1) {
                    state.options[index] = updated;
                }

                state.option = updated;
            })
            .addCase(updateOption.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE OPTION =====
            .addCase(deleteOption.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOption.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.options = state.options.filter(
                    (opt) => opt.id !== action.meta.arg.optionId
                );

                state.message = action.payload.message;
            })
            .addCase(deleteOption.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetOptionState, clearOptions } = optionSlice.actions;
export default optionSlice.reducer;