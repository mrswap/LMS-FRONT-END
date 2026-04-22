import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= GET =======================
export const getSmtp = createAsyncThunk(
    "smtp/get",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/setting/smtp",
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

// ======================= UPDATE =======================
export const updateSmtp = createAsyncThunk(
    "smtp/update",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/smtp",
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

// ======================= SEND MAIL =======================
export const sendTestMail = createAsyncThunk(
    "smtp/sendMail",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/smtp/test",
                data,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Send mail failed" }
            );
        }
    }
);

// ======================= SLICE =======================
const smtpSlice = createSlice({
    name: "smtp",
    initialState: {
        smtp: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetSmtpState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // GET
            .addCase(getSmtp.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSmtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.smtp = action.payload.data;
            })
            .addCase(getSmtp.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // UPDATE
            .addCase(updateSmtp.fulfilled, (state, action) => {
                state.smtp = action.payload;
                state.isSuccess = true;
            })

            // SEND MAIL
            .addCase(sendTestMail.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.message = action.payload.message;
            });
    },
});

export const { resetSmtpState } = smtpSlice.actions;
export default smtpSlice.reducer;