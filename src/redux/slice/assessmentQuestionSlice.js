import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE QUESTION =======================
export const createQuestion = createAsyncThunk(
    "assessmentQuestion/create",
    async ({ assessmentId, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(`/assessments/${assessmentId}/questions`, data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create question failed" }
            );
        }
    }
);

// ======================= GET ALL QUESTIONS =======================
export const getAllQuestions = createAsyncThunk(
    "assessmentQuestion/getAll",
    async ({ assessmentId, params }, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/assessments/${assessmentId}/questions?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch questions failed" }
            );
        }
    }
);

// ======================= GET QUESTION BY ID =======================
export const getQuestionById = createAsyncThunk(
    "assessmentQuestion/getById",
    async (questionId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/assessments/${questionId}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch question by id failed" }
            );
        }
    }
);

// ======================= UPDATE QUESTION =======================
export const updateQuestionById = createAsyncThunk(
    "assessmentQuestion/updateById",
    async ({ assessmentId, questionId, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/assessments/${assessmentId}/questions/${questionId}`,
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Update question failed" }
            );
        }
    }
);



// ======================= DELETE QUESTION =======================
export const deleteQuestion = createAsyncThunk(
    "assessmentQuestion/delete",
    async ({ assessmentId, questionId }, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/assessments/questions/${questionId}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Delete question failed" }
            );
        }
    }
);

// ======================= SLICE =======================
const assessmentQuestionSlice = createSlice({
    name: "assessmentQuestion",
    initialState: {
        questions: [],
        question: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetQuestionState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        clearQuestions: (state) => {
            state.questions = [];
            state.question = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE QUESTION =====
            .addCase(createQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newQuestion = action.payload;

                if (!Array.isArray(state.questions)) {
                    state.questions = [];
                }
                state.questions.unshift(newQuestion);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL QUESTIONS =====
            .addCase(getAllQuestions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = action.payload;
            })
            .addCase(getAllQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET QUESTION BY ID =====
            .addCase(getQuestionById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuestionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.question = action.payload;
            })
            .addCase(getQuestionById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE QUESTION =====
            .addCase(updateQuestionById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateQuestionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload;

                if (Array.isArray(state.questions)) {
                    const index = state.questions.findIndex(
                        (q) => q.id === updated.id
                    );
                    if (index !== -1) {
                        state.questions[index] = updated;
                    }
                }
                state.question = updated;
            })
            .addCase(updateQuestionById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE QUESTION =====
            .addCase(deleteQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.questions)) {
                    state.questions = state.questions.filter(
                        (q) => q.id !== action.meta.arg.questionId
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetQuestionState, clearQuestions } = assessmentQuestionSlice.actions;
export default assessmentQuestionSlice.reducer;