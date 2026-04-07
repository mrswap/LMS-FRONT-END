import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// 🔹 Common Header Function
// const getAuthConfig = () => {
//     const token = localStorage.getItem("token");

//     return {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": "en",
//         },
//     };
// };

// ======================= CREATE =======================
export const createProgram = createAsyncThunk(
    "program/create",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/programs", data, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Create failed" }
            );
        }
    }
);

// ======================= GET ALL =======================
export const getAllPrograms = createAsyncThunk(
    "program/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/programs?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= GET BY ID =======================
export const getProgramById = createAsyncThunk(
    "program/getById",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/programs/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch by id failed" }
            );
        }
    }
);

// ======================= UPDATE =======================
export const updateProgramById = createAsyncThunk(
    "program/updateById",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/programs/${id}`,
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
export const updateSingleProgramStatus = createAsyncThunk(
    "program/updateStatus",
    async ({ id }, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/programs/${id}/toggle-status`,
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
export const deleteSingleProgram = createAsyncThunk(
    "program/delete",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(
                `/programs/${id}`,
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
const programSlice = createSlice({
    name: "program",
    initialState: {
        programs: [],
        program: null,

        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetProgramState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== CREATE =====
            .addCase(createProgram.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProgram.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const newProgram = action.payload.data;

                if (!Array.isArray(state.programs)) {
                    state.programs = [];
                }
                state.programs.unshift(newProgram);
            })
            .addCase(createProgram.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET ALL =====
            .addCase(getAllPrograms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPrograms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.programs = action.payload.data;
            })
            .addCase(getAllPrograms.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET BY ID =====
            .addCase(getProgramById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProgramById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.program = action.payload.data;
            })
            .addCase(getProgramById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateProgramById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProgramById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.programs)) {
                    const index = state.programs.findIndex(
                        (p) => p.id === updated.id
                    );
                    if (index !== -1) {
                        state.programs[index] = updated;
                    }
                }
                state.program = updated;
            })
            .addCase(updateProgramById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE STATUS =====
            .addCase(updateSingleProgramStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSingleProgramStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                const updated = action.payload.data;

                if (Array.isArray(state.programs?.data)) {
                    const index = state.programs.data.findIndex(
                        (t) => t.id === updated.id
                    );
                    if (index !== -1) {
                        state.programs.data[index] = updated;
                    }
                }
            })
            .addCase(updateSingleProgramStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== DELETE =====
            .addCase(deleteSingleProgram.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSingleProgram.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                if (Array.isArray(state.programs)) {
                    state.programs = state.programs.filter(
                        (p) => p.id !== action.meta.arg
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(deleteSingleProgram.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetProgramState } = programSlice.actions;
export default programSlice.reducer;