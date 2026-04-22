import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= CREATE =======================
export const createFaq = createAsyncThunk(
    "faq/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/faqs", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllFaqs = createAsyncThunk(
    "faq/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/faqs?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getFaqById = createAsyncThunk(
    "faq/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/faqs/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE STATUS =======================
export const updateSingleFaqStatus = createAsyncThunk(
    "faq/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/faqs/${id}/toggle-status`,
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

// ======================= UPDATE =======================
export const updateFaqById = createAsyncThunk(
    "faq/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/faqs/${id}`,
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

// ======================= DELETE =======================
export const deleteSingleFaq = createAsyncThunk(
    "faq/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/faqs/${id}`,
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
const faqSlice = createSlice({
    name: "faq",
    initialState: {
        faqs: [],
        faq: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetFaqState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createFaq.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createFaq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newFaq = action.payload.data;
                state.faqs.unshift(newFaq);
            })
            .addCase(createFaq.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllFaqs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllFaqs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.faqs = action.payload.data;
            })
            .addCase(getAllFaqs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getFaqById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.faq = action.payload.data;
            })

            // ===== UPDATE =====
            .addCase(updateFaqById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                const index = state.faqs.findIndex(
                    (f) => f.id === updated.id
                );
                if (index !== -1) {
                    state.faqs[index] = updated;
                }

                state.faq = updated;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleFaqStatus.pending, (state) => {
                state.isLoading = true;
            })
            // ===== UPDATE STATUS =====
            .addCase(updateSingleFaqStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.faqs?.data)) {
                    const index = state.faqs.data.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.faqs.data[index] = updated;
                    }
                }
            })
            .addCase(updateSingleFaqStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleFaq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                // state.faqs = state.faqs.filter(
                //     (f) => f.id !== action.meta.arg
                // );

                if (Array.isArray(state.faqs)) {
                    state.faqs = state.faqs.filter(
                        (t) => t.id !== action.meta.arg
                    );
                }

                state.message = action.payload.message;
            });
    },
});

export const { resetFaqState } = faqSlice.actions;
export default faqSlice.reducer;