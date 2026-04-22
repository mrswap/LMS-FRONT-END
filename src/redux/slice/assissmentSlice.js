import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createAssessment = createAsyncThunk(
    "assessment/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/assessments", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllAssessments = createAsyncThunk(
    "assessment/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/assessments?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getAssessmentById = createAsyncThunk(
    "assessment/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/assessments/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateAssessmentById = createAsyncThunk(
    "assessment/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/assessments/${id}`,
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
export const updateSingleAssismentStatus = createAsyncThunk(
    "assessment/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/assessments/${id}/toggle-status`,
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
export const deleteSingleAssessment = createAsyncThunk(
    "assessment/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/assessments/${id}`,
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
const assessmentSlice = createSlice({
    name: "assessment",
    initialState: {
        assessments: [],
        assessment: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetAssessmentState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createAssessment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAssessment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newAssessment = action.payload.data;

                if (!Array.isArray(state.assessments)) {
                    state.assessments = [];
                }
                state.assessments.unshift(newAssessment);
            })
            .addCase(createAssessment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllAssessments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllAssessments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assessments = action.payload.data;
            })
            .addCase(getAllAssessments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getAssessmentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAssessmentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assessment = action.payload;
            })
            .addCase(getAssessmentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateAssessmentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAssessmentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.assessments)) {
                    const index = state.assessments.findIndex(
                        (a) => a.id === updated.id
                    );
                    if (index !== -1) {
                        state.assessments[index] = updated;
                    }
                }
                state.assessment = updated;
            })
            .addCase(updateAssessmentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleAssismentStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleAssismentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                const updated = action.payload?.data;

                if (!updated || !updated.id) return;

                if (state.assessments && Array.isArray(state.assessments.data)) {
                    state.assessments.data = state.assessments.data.map((item) =>
                        item?.id === updated.id
                            ? { ...item, ...updated }
                            : item
                    );
                }
            })
            .addCase(updateSingleAssismentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })


            // ===== DELETE =====
            .addCase(deleteSingleAssessment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleAssessment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.assessments)) {
                    state.assessments = state.assessments.filter(
                        (a) => a.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleAssessment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetAssessmentState } = assessmentSlice.actions;
export default assessmentSlice.reducer;