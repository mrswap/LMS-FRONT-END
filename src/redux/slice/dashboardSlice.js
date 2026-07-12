// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../app/axios";
// import { getAuthConfig } from "../../utils/authConfig";

// /* ===========================
//    GET DASHBOARD DATA
// =========================== */
// export const getDashboardData = createAsyncThunk(
//     "dashboard/getDashboardData",
//     async (_, thunkAPI) => {
//         try {
//             const res = await axiosInstance.get(
//                 "/dashboard",
//                 getAuthConfig()
//             );
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Failed to fetch dashboard data" }
//             );
//         }
//     }
// );

// /* ===========================
//    SLICE
// =========================== */
// const dashboardSlice = createSlice({
//     name: "dashboard",
//     initialState: {
//         dashboardData: null,
//         isLoading: false,
//         isError: false,
//         isSuccess: false,
//         message: "",
//     },
//     reducers: {
//     },
//     extraReducers: (builder) => {
//         builder
//             /* ===== GET DASHBOARD DATA ===== */
//             .addCase(getDashboardData.pending, (state) => {
//                 state.isLoading = true;
//                 state.isError = false;
//                 state.isSuccess = false;
//             })
//             .addCase(getDashboardData.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.dashboardData = action.payload;
//                 state.message = action.payload.message;
//             })
//             .addCase(getDashboardData.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload?.message;
//             });
//     },
// });

// export const { resetDashboardState, clearDashboard } = dashboardSlice.actions;
// export default dashboardSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../app/axios";
// import { getAuthConfig } from "../../utils/authConfig";

// /* ===========================
//    GET DASHBOARD DATA
// =========================== */
// export const getDashboardData = createAsyncThunk(
//     "dashboard/getDashboardData",
//     async (_, thunkAPI) => {
//         try {
//             const res = await axiosInstance.get(
//                 "/dashboard",
//                 getAuthConfig()
//             );
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Failed to fetch dashboard data" }
//             );
//         }
//     }
// );

// /* ===========================
//    GET CONTENT HEALTH DATA
// =========================== */
// export const getContentHealthData = createAsyncThunk(
//     "dashboard/getContentHealthData",
//     async (_, thunkAPI) => {
//         try {
//             const res = await axiosInstance.get(
//                 "/dashboard/content-health",
//                 getAuthConfig()
//             );
//             return res.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || { message: "Failed to fetch content health data" }
//             );
//         }
//     }
// );

// /* ===========================
//    SLICE
// =========================== */
// const dashboardSlice = createSlice({
//     name: "dashboard",
//     initialState: {
//         dashboardData: null,
//         contentHealthData: null,
//         isLoading: false,
//         isError: false,
//         isSuccess: false,
//         message: "",
//         contentHealthLoading: false,
//         contentHealthError: false,
//         contentHealthMessage: "",
//     },
//     reducers: {
//         resetDashboardState: (state) => {
//             state.dashboardData = null;
//             state.contentHealthData = null;
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = false;
//             state.message = "";
//             state.contentHealthLoading = false;
//             state.contentHealthError = false;
//             state.contentHealthMessage = "";
//         },
//         clearDashboard: (state) => {
//             state.dashboardData = null;
//             state.contentHealthData = null;
//         },
//         clearContentHealth: (state) => {
//             state.contentHealthData = null;
//             state.contentHealthMessage = "";
//             state.contentHealthError = false;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             /* ===== GET DASHBOARD DATA ===== */
//             .addCase(getDashboardData.pending, (state) => {
//                 state.isLoading = true;
//                 state.isError = false;
//                 state.isSuccess = false;
//             })
//             .addCase(getDashboardData.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.dashboardData = action.payload;
//                 state.message = action.payload.message;
//             })
//             .addCase(getDashboardData.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload?.message;
//             })

//             /* ===== GET CONTENT HEALTH DATA ===== */
//             .addCase(getContentHealthData.pending, (state) => {
//                 state.contentHealthLoading = true;
//                 state.contentHealthError = false;
//             })
//             .addCase(getContentHealthData.fulfilled, (state, action) => {
//                 state.contentHealthLoading = false;
//                 state.contentHealthData = action.payload;
//                 state.contentHealthMessage = action.payload.message || "Content health data fetched successfully";
//             })
//             .addCase(getContentHealthData.rejected, (state, action) => {
//                 state.contentHealthLoading = false;
//                 state.contentHealthError = true;
//                 state.contentHealthMessage = action.payload?.message || "Failed to fetch content health data";
//             });
//     },
// });

// export const { resetDashboardState, clearDashboard, clearContentHealth } = dashboardSlice.actions;
// export default dashboardSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axios";
import { getAuthConfig } from "../../utils/authConfig";

/* ===========================
   GET DASHBOARD DATA
=========================== */
export const getDashboardData = createAsyncThunk(
    "dashboard/getDashboardData",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/dashboard",
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch dashboard data" }
            );
        }
    }
);

/* ===========================
   GET CONTENT HEALTH DATA (INITIAL SERVICE)
=========================== */
export const getContentHealthData = createAsyncThunk(
    "dashboard/getContentHealthData",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/dashboard/content-health",
                getAuthConfig()
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { message: "Failed to fetch content health data" }
            );
        }
    }
);

/* ===========================
   SLICE
=========================== */
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboardData: null,
        contentHealthData: null,  // 👈 Sirf ye ek initial service
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
        contentHealthLoading: false,
        contentHealthError: false,
        contentHealthMessage: "",
    },
    reducers: {
        resetDashboardState: (state) => {
            state.dashboardData = null;
            state.contentHealthData = null;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
            state.contentHealthLoading = false;
            state.contentHealthError = false;
            state.contentHealthMessage = "";
        },
        clearDashboard: (state) => {
            state.dashboardData = null;
            state.contentHealthData = null;
        },
        clearContentHealth: (state) => {
            state.contentHealthData = null;
            state.contentHealthMessage = "";
            state.contentHealthError = false;
        }
    },
    extraReducers: (builder) => {
        builder
            /* ===== GET DASHBOARD DATA ===== */
            .addCase(getDashboardData.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dashboardData = action.payload;
                state.message = action.payload.message;
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message;
            })

            /* ===== GET CONTENT HEALTH DATA (INITIAL SERVICE) ===== */
            .addCase(getContentHealthData.pending, (state) => {
                state.contentHealthLoading = true;
                state.contentHealthError = false;
            })
            .addCase(getContentHealthData.fulfilled, (state, action) => {
                state.contentHealthLoading = false;
                state.contentHealthData = action.payload;  // 👈 Initial service data store
                state.contentHealthMessage = action.payload.message || "Content health data fetched successfully";
            })
            .addCase(getContentHealthData.rejected, (state, action) => {
                state.contentHealthLoading = false;
                state.contentHealthError = true;
                state.contentHealthMessage = action.payload?.message || "Failed to fetch content health data";
            });
    },
});

export const { resetDashboardState, clearDashboard, clearContentHealth } = dashboardSlice.actions;
export default dashboardSlice.reducer;