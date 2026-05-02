import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= GET CERTIFICATE VARIABLES =======================
export const getCertificateVariables = createAsyncThunk(
    "certificateSettings/getVariables",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(
                `/setting/certificate-settings/variables${query ? `?${query}` : ""}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch certificate variables failed" }
            );
        }
    }
);

// ======================= GET CERTIFICATE SETTINGS =======================
export const getCertificateSettings = createAsyncThunk(
    "certificateSettings/getSettings",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(
                `/setting/certificate-settings${query ? `?${query}` : ""}`,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch certificate settings failed" }
            );
        }
    }
);

// ======================= POST CERTIFICATE SETTINGS =======================
export const postCertificateSettings = createAsyncThunk(
    "certificateSettings/postSettings",
    async (settingsData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/certificate-settings`,
                settingsData,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Save certificate settings failed" }
            );
        }
    }
);

// ======================= CERTIFICATE SETTINGS SLICE =======================
const certificateSettingsSlice = createSlice({
    name: "certificateSettings",
    initialState: {
        variables: [],           // Store certificate variables
        variablesLoading: false,
        variablesError: false,
        variablesMessage: "",

        settings: null,          // Store current certificate settings
        settingsLoading: false,
        settingsError: false,
        settingsSuccess: false,
        settingsMessage: "",

        isSaving: false,         // For POST operation
        saveSuccess: false,
        saveError: false,
        saveMessage: "",
    },

    reducers: {
        resetCertificateSettingsState: (state) => {
            // Reset settings states
            state.settingsLoading = false;
            state.settingsError = false;
            state.settingsSuccess = false;
            state.settingsMessage = "";

            // Reset save states
            state.isSaving = false;
            state.saveSuccess = false;
            state.saveError = false;
            state.saveMessage = "";

            // Reset variables states (optional)
            state.variablesLoading = false;
            state.variablesError = false;
            state.variablesMessage = "";
        },

        clearSaveStatus: (state) => {
            state.saveSuccess = false;
            state.saveError = false;
            state.saveMessage = "";
        },

        clearVariables: (state) => {
            state.variables = [];
            state.variablesMessage = "";
        },

        clearSettings: (state) => {
            state.settings = null;
            state.settingsMessage = "";
        },
    },

    extraReducers: (builder) => {
        builder
            // ===== GET CERTIFICATE VARIABLES =====
            .addCase(getCertificateVariables.pending, (state) => {
                state.variablesLoading = true;
                state.variablesError = false;
                state.variablesMessage = "";
            })
            .addCase(getCertificateVariables.fulfilled, (state, action) => {
                state.variablesLoading = false;
                state.variables = action.payload;
                state.variablesMessage = action.payload.message;
            })
            .addCase(getCertificateVariables.rejected, (state, action) => {
                state.variablesLoading = false;
                state.variablesError = true;
                state.variablesMessage = action.payload?.message;
            })

            // ===== GET CERTIFICATE SETTINGS =====
            .addCase(getCertificateSettings.pending, (state) => {
                state.settingsLoading = true;
                state.settingsError = false;
                state.settingsSuccess = false;
                state.settingsMessage = "";
            })
            .addCase(getCertificateSettings.fulfilled, (state, action) => {
                state.settingsLoading = false;
                state.settingsSuccess = true;
                state.settings = action.payload;
                state.settingsMessage = action.payload.message || "";
            })
            .addCase(getCertificateSettings.rejected, (state, action) => {
                state.settingsLoading = false;
                state.settingsError = true;
                state.settingsMessage = action.payload?.message;
            })

            // ===== POST CERTIFICATE SETTINGS =====
            .addCase(postCertificateSettings.pending, (state) => {
                state.isSaving = true;
                state.saveSuccess = false;
                state.saveError = false;
                state.saveMessage = "";
            })
            .addCase(postCertificateSettings.fulfilled, (state, action) => {
                state.isSaving = false;
                state.saveSuccess = true;
                state.saveMessage = action.payload.message || "Settings saved successfully";

                // Optionally update the settings with the response data
                if (action.payload.data) {
                    state.settings = action.payload.data;
                }
            })
            .addCase(postCertificateSettings.rejected, (state, action) => {
                state.isSaving = false;
                state.saveError = true;
                state.saveMessage = action.payload?.message || "Failed to save settings";
            });
    },
});

export const {
    resetCertificateSettingsState,
    clearSaveStatus,
    clearVariables,
    clearSettings
} = certificateSettingsSlice.actions;

export default certificateSettingsSlice.reducer;