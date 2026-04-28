import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import axiosCommonInstance from "../../app/axiosCommon";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= GET SITE SETTINGS =======================
export const getSiteSettings = createAsyncThunk(
    "siteSettings/get",
    async (_, thunkAPI) => {
        try {
            const res = await axiosCommonInstance.get(
                "/common/site/settings"
                // getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch failed" }
            );
        }
    }
);

// ======================= UPDATE SITE SETTINGS =======================
export const updateSiteSettings = createAsyncThunk(
    "siteSettings/update",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/setting/site",
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

// ======================= SLICE =======================
const siteSettingSlice = createSlice({
    name: "siteSettings",
    initialState: {
        settings: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetSiteSettingsState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            // ===== GET =====
            .addCase(getSiteSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSiteSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.settings = action.payload.data;
            })
            .addCase(getSiteSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== UPDATE =====
            .addCase(updateSiteSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSiteSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                // updated settings directly replace
                state.settings = action.payload;
            })
            .addCase(updateSiteSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetSiteSettingsState } = siteSettingSlice.actions;
export default siteSettingSlice.reducer;