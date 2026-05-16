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
import assissmentReducer from "./slice/assissmentSlice"
import assessmentQuestionReducer from "./slice/assessmentQuestionSlice"
import assessmentOptionReducer from "./slice/assessmentOptionSlice"
import systemSettingReducer from "./slice/systemSettingSlice"
import contactReducer from "./slice/contactSlice"
import reportReducer from "./slice/reportSlice"
import certificateSettingReducer from "./slice/certificateSettingSlice"
import dashboardReducer from "./slice/dashboardSlice"
import commonReducer from "./slice/commonSlice"
import notificationsReducer from "./slice/notificationSlicer"
import supportReducer from "./slice/supportSlice";
import bulkReducer from "./slice/bulkUploadSlicer"

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
        content: unitBuilderReducer,
        assessment: assissmentReducer,
        question: assessmentQuestionReducer,
        option: assessmentOptionReducer,
        systemSetting: systemSettingReducer,
        contact: contactReducer,
        report: reportReducer,
        certificateSettings: certificateSettingReducer,
        dashboard: dashboardReducer,
        common: commonReducer,
        notification: notificationsReducer,
        support: supportReducer,
        bulk: bulkReducer
    },
}); 