import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

// ======================= GET ALL CONTACTS =======================
export const getAllContacts = createAsyncThunk(
    "contact/getAll",
    async (params, thunkAPI) => {
        try {
            const query = new URLSearchParams(params).toString();
            const res = await axiosInstance.get(`/setting/contacts?${query}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch contacts failed" }
            );
        }
    }
);

// ======================= MARK AS SEEN =======================
export const markAsSeen = createAsyncThunk(
    "contact/markSeen",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/contacts/${id}/mark-seen`,
                {},
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Mark as seen failed" }
            );
        }
    }
);

// ======================= MARK AS UNSEEN =======================
export const markAsUnseen = createAsyncThunk(
    "contact/markUnseen",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/setting/contacts/${id}/mark-unseen`,
                {},
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Mark as unseen failed" }
            );
        }
    }
);

// ======================= GET SINGLE CONTACT =======================
export const getSingleContact = createAsyncThunk(
    "contact/getSingle",
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/setting/contacts/${id}`, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Fetch contact failed" }
            );
        }
    }
);

// ======================= CONTACT SLICE =======================
const contactSlice = createSlice({
    name: "contact",
    initialState: {
        contacts: [],
        contact: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetContactState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        // Manual update for single contact status (optional)
        updateContactStatus: (state, action) => {
            const { id, isSeen } = action.payload;
            const contact = state.contacts.find(c => c.id === id);
            if (contact) {
                contact.isSeen = isSeen;
            }
            if (state.contact?.id === id) {
                state.contact.isSeen = isSeen;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            // ===== GET ALL CONTACTS =====
            .addCase(getAllContacts.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.contacts = action.payload;
                state.message = action.payload.message || "";
            })
            .addCase(getAllContacts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== GET SINGLE CONTACT =====
            .addCase(getSingleContact.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getSingleContact.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.contact = action.payload.data;
                state.message = action.payload.message || "";
            })
            .addCase(getSingleContact.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== MARK AS SEEN =====
            .addCase(markAsSeen.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(markAsSeen.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                // Update the contact in contacts array
                const updatedContact = action.payload.data;
                if (updatedContact) {
                    const index = state.contacts.findIndex(c => c.id === updatedContact.id);
                    if (index !== -1) {
                        state.contacts[index] = updatedContact;
                    }
                    if (state.contact?.id === updatedContact.id) {
                        state.contact = updatedContact;
                    }
                }
            })
            .addCase(markAsSeen.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            // ===== MARK AS UNSEEN =====
            .addCase(markAsUnseen.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(markAsUnseen.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;

                // Update the contact in contacts array
                const updatedContact = action.payload.data;
                if (updatedContact) {
                    const index = state.contacts.findIndex(c => c.id === updatedContact.id);
                    if (index !== -1) {
                        state.contacts[index] = updatedContact;
                    }
                    if (state.contact?.id === updatedContact.id) {
                        state.contact = updatedContact;
                    }
                }
            })
            .addCase(markAsUnseen.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetContactState, updateContactStatus } = contactSlice.actions;
export default contactSlice.reducer;