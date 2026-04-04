import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import programReducer from "./slice/programSlice";
import levelReducer from "./slice/levelSlice";
import moduleReducer from "./slice/moduleSlice";
import chapterReducer from "./slice/chapterSlice";
import topicReducer from "./slice/topicSlice";
import userReducer from "./slice/userSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        program: programReducer,
        level: levelReducer,
        module: moduleReducer,
        chapter: chapterReducer,
        topic: topicReducer
    },
});