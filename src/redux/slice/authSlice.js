// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../app/axios";
// import { getAuthConfig } from "../../utils/authConfig";

// export const loginUser = createAsyncThunk(
//     "auth/loginUser",
//     async (userData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/login", userData);
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Something went wrong" }
//             );
//         }
//     }
// );

// export const forgotPassword = createAsyncThunk(
//     "auth/forgotPassword",
//     async (userData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/forgot-password", userData);
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Something went wrong" }
//             );
//         }
//     }
// );

// export const resetPassword = createAsyncThunk(
//     "auth/resetPassword",
//     async (userData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/reset-password", userData, getAuthConfig());
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Something went wrong" }
//             );
//         }
//     }
// );

// export const changePassword = createAsyncThunk(
//     "auth/changePassword",
//     async (userData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/change-password", userData, getAuthConfig());
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Something went wrong" }
//             );
//         }
//     }
// );

// export const getProfile = createAsyncThunk(
//     "auth/getProfile",
//     async (_, thunkAPI) => {
//         try {
//             const res = await axiosInstance.get("/profile", getAuthConfig());
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Failed to fetch profile" }
//             );
//         }
//     }
// );


// //  UPDATE PROFILE
// export const updateProfile = createAsyncThunk(
//     "auth/updateProfile",
//     async (updatedData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/profile", updatedData, getAuthConfig());
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Failed to update profile" }
//             );
//         }
//     }
// );

// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         profile: null,
//         user: null,
//         isLoading: false,
//         isError: false,
//         isSuccess: false,
//         message: "",
//     },
//     reducers: {
//         resetState: (state) => {
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = false;
//             state.message = "";
//         },
//         logout: (state) => {
//             state.user = null;
//             state.isSuccess = false;

//             localStorage.removeItem("token");
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Login 
//             .addCase(loginUser.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.user = action.payload.user;
//                 state.message = action.payload.message;

//                 localStorage.setItem("token", action.payload.token);
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload?.message;
//             })

//             //  GET PROFILE
//             .addCase(getProfile.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProfile.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.profile = action.payload.data;
//             })
//             .addCase(getProfile.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload?.message;
//             })

//             //  UPDATE PROFILE
//             .addCase(updateProfile.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(updateProfile.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.profile = action.payload.data;
//                 state.message = action.payload.message;
//             })
//             .addCase(updateProfile.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload?.message;
//             });
//     },
// });

// export const { resetState, logout } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

/* ===========================
   LOGIN USER
=========================== */
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/login", userData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

/* ===========================
   LOGOUT USER
=========================== */
export const logout = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/logout",
                {},
                getAuthConfig()
            );

            localStorage.removeItem("token");

            return res.data;
        } catch (error) {
            // Logout even if API fails
            localStorage.removeItem("token");

            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Logout failed" }
            );
        }
    }
);

/* ===========================
   FORGOT PASSWORD
=========================== */
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/forgot-password", userData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

/* ===========================
   RESET PASSWORD
=========================== */
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/reset-password",
                userData,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

/* ===========================
   CHANGE PASSWORD
=========================== */
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/change-password",
                userData,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

/* ===========================
   GET PROFILE
=========================== */
export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/profile", getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch profile" }
            );
        }
    }
);

/* ===========================
   UPDATE PROFILE
=========================== */
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (updatedData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/profile",
                updatedData,
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to update profile" }
            );
        }
    }
);

/* ===========================
   SLICE
=========================== */
const authSlice = createSlice({
    name: "auth",

    initialState: {
        profile: null,
        user: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        resetState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },

    extraReducers: (builder) => {
        builder

            /* ===== LOGIN ===== */
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.message = action.payload.message;

                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== LOGOUT ===== */
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.profile = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = action.payload?.message || "Logged out successfully";
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.profile = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = action.payload?.message || "Logged out";
            })

            /* ===== GET PROFILE ===== */
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.profile = action.payload.data;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== UPDATE PROFILE ===== */
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.profile = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== FORGOT PASSWORD ===== */
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== RESET PASSWORD ===== */
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== CHANGE PASSWORD ===== */
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            });
    },
});

export const { resetState } = authSlice.actions;

export default authSlice.reducer;