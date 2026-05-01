import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= GET ALL AUDIT LOGS =======================
export const getAllAuditLogs = createAsyncThunk(
    "reports/getAllAuditLogs",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/reports/audit-logs?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch audit logs failed" }
            );
        }
    }
);

// ======================= GET ALL USER PROGRESS =======================
export const getAllUserProgress = createAsyncThunk(
    "reports/getAllUserProgress",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/reports/user-progress?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch user progress failed" }
            );
        }
    }
);

// ======================= GET ALL ASSESSMENT REPORTS =======================
export const getAllAssessmentReports = createAsyncThunk(
    "reports/getAllAssessmentReports",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/reports/assessment-report?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch assessment reports failed" }
            );
        }
    }
);

// ======================= GET ALL CONTENT STATUS =======================
export const getAllContentStatus = createAsyncThunk(
    "reports/getAllContentStatus",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/reports/content-status?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch content status failed" }
            );
        }
    }
);

// ======================= GET ALL CERTIFICATIONS =======================
export const getAllCertifications = createAsyncThunk(
    "reports/getAllCertifications",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/reports/certifications?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch certifications failed" }
            );
        }
    }
);

// ======================= REPORTS SLICE =======================
const reportsSlice = createSlice({
    name: "reports",
    initialState: {
        auditLogs: [],
        userProgress: [],
        assessmentReports: [],
        contentStatus: [],
        certifications: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
        // Separate loading states for individual reports if needed
        loadingAuditLogs: false,
        loadingUserProgress: false,
        loadingAssessmentReports: false,
        loadingContentStatus: false,
        loadingCertifications: false,
    },

    reducers: {
        resetReportsState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        clearAllReports: (state) => {
            state.auditLogs = [];
            state.userProgress = [];
            state.assessmentReports = [];
            state.contentStatus = [];
            state.certifications = [];
        },
    },

    extraReducers: (builder) => {
        builder
            // ===== GET ALL AUDIT LOGS =====
            .addCase(getAllAuditLogs.pending, (state) => {
                state.loadingAuditLogs = true;
                state.isError = false;
            })
            .addCase(getAllAuditLogs.fulfilled, (state, action) => {
                state.loadingAuditLogs = false;
                state.isSuccess = true;
                state.auditLogs = action.payload;
                state.message = action.payload.message || "";
            })
            .addCase(getAllAuditLogs.rejected, (state, action) => {
                state.loadingAuditLogs = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL USER PROGRESS =====
            .addCase(getAllUserProgress.pending, (state) => {
                state.loadingUserProgress = true;
                state.isError = false;
            })
            .addCase(getAllUserProgress.fulfilled, (state, action) => {
                state.loadingUserProgress = false;
                state.isSuccess = true;
                state.userProgress = action.payload.data;
                state.message = action.payload.message || "";
            })
            .addCase(getAllUserProgress.rejected, (state, action) => {
                state.loadingUserProgress = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL ASSESSMENT REPORTS =====
            .addCase(getAllAssessmentReports.pending, (state) => {
                state.loadingAssessmentReports = true;
                state.isError = false;
            })
            .addCase(getAllAssessmentReports.fulfilled, (state, action) => {
                state.loadingAssessmentReports = false;
                state.isSuccess = true;
                state.assessmentReports = action.payload.data;
                state.message = action.payload.message || "";
            })
            .addCase(getAllAssessmentReports.rejected, (state, action) => {
                state.loadingAssessmentReports = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL CONTENT STATUS =====
            .addCase(getAllContentStatus.pending, (state) => {
                state.loadingContentStatus = true;
                state.isError = false;
            })
            .addCase(getAllContentStatus.fulfilled, (state, action) => {
                state.loadingContentStatus = false;
                state.isSuccess = true;
                state.contentStatus = action.payload.data;
                state.message = action.payload.message || "";
            })
            .addCase(getAllContentStatus.rejected, (state, action) => {
                state.loadingContentStatus = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL CERTIFICATIONS =====
            .addCase(getAllCertifications.pending, (state) => {
                state.loadingCertifications = true;
                state.isError = false;
            })
            .addCase(getAllCertifications.fulfilled, (state, action) => {
                state.loadingCertifications = false;
                state.isSuccess = true;
                state.certifications = action.payload.data;
                state.message = action.payload.message || "";
            })
            .addCase(getAllCertifications.rejected, (state, action) => {
                state.loadingCertifications = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetReportsState, clearAllReports } = reportsSlice.actions;
export default reportsSlice.reducer;