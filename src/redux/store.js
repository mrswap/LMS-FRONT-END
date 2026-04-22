import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import programReducer from "./slice/programSlice";
import levelReducer from "./slice/levelSlice";
import moduleReducer from "./slice/moduleSlice";
import chapterReducer from "./slice/chapterSlice";
import topicReducer from "./slice/topicSlice";
import userReducer from "./slice/userSlice";
import confirmReducer from "./slice/confirmSlice"
import mediaLibraryReducer from "./slice/mediaLibrarySlice"
import rolesReducer from "./slice/rolesSlice"
import designationReducer from "./slice/designationSlice"
import smtpReducer from "./slice/smtpSlice"
import faqReducer from "./slice/faqSlice"
import unitBuilderReducer from "./slice/unitBuilderSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        program: programReducer,
        level: levelReducer,
        module: moduleReducer,
        chapter: chapterReducer,
        topic: topicReducer,
        confirm: confirmReducer,
        media: mediaLibraryReducer,
        role: rolesReducer,
        designation: designationReducer,
        smtp: smtpReducer,
        faq: faqReducer,
        content: unitBuilderReducer
    },
}); 