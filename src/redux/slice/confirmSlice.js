import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let resolveCallback;

export const openConfirm = createAsyncThunk(
    "confirm/openConfirm",
    async (payload) => {
        return new Promise((resolve) => {
            resolveCallback = resolve;
        });
    }
);

const confirmSlice = createSlice({
    name: "confirm",
    initialState: {
        isOpen: false,
        message: "",
    },
    reducers: {
        closeConfirm: (state) => {
            state.isOpen = false;
        },
        setConfirmData: (state, action) => {
            state.isOpen = true;
            state.message = action.payload.message;
        },
    },
});

export const { closeConfirm, setConfirmData } = confirmSlice.actions;
export default confirmSlice.reducer;

// helper
export const resolveConfirm = (result) => {
    if (resolveCallback) {
        resolveCallback(result);
    }
};

export const showConfirm = (data) => async (dispatch) => {
    dispatch(setConfirmData(data));
    return await dispatch(openConfirm()).unwrap();
};