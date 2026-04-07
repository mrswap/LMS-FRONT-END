// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../app/axios";

// export const loginUser = createAsyncThunk(
//     "auth/loginUser",
//     async (userData, thunkAPI) => {
//         try {
//             const res = await axiosInstance.post("/login", userData);
//             // console.log("Login Response:", res.data);
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Something went wrong" }
//             );
//         }
//     }
// );

// const authSlice = createSlice({
//     name: "auth",
//     initialState: {
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
//             });
//     },
// });

// export const { resetState, logout } = authSlice.actions;
// export default authSlice.reducer;



// working user profile

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


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/login", userData);
            // console.log("Login Response:", res.data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/forgot-password", userData);
            // console.log("Login Response:", res.data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/reset-password", userData, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/change-password", userData, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
);

export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/profile", getAuthConfig());
            // console.log(res.data)
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch profile" }
            );
        }
    }
);


// ✏️ UPDATE PROFILE
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (updatedData, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/profile", updatedData, getAuthConfig());
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to update profile" }
            );
        }
    }
);

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
        logout: (state) => {
            state.user = null;
            state.isSuccess = false;

            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            // Login 
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

            //  GET PROFILE
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

            //  UPDATE PROFILE
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
            });
    },
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;