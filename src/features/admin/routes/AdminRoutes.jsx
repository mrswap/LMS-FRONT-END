// import { Route, Navigate } from "react-router-dom";
// import AdminLayout from "../layout/AdminLayout";
// import Dashboard from "../pages/dashboad/Dashboard";
// import Users from "../pages/users/Users";
// import LanguageSettings from "../pages/language/LanguageSettings";
// import WorkInProgress from "./ModuleProgress";
// import CreateUser from "../pages/users/components/CreateUser";
// import UserDetails from "../pages/users/components/UserDetails";
// import Levels from "../pages/curriculum/level/Levels";
// import CreateLevel from "../pages/curriculum/level/components/CreateLevel";
// import LevelDetails from "../pages/curriculum/level/components/LevelDetails";
// import Module from "../pages/curriculum/module/Module";
// import CreateModule from "../pages/curriculum/module/components/CreateModule";
// import ModuleDetails from "../pages/curriculum/module/components/ModuleDetails";
// import Chapter from "../pages/curriculum/chapter/Chapter";
// import CreateChapter from "../pages/curriculum/chapter/components/CreateChapter";
// import ChapterDetails from "../pages/curriculum/chapter/components/ChapterDetails";
// import CreateTopic from "../pages/curriculum/topic/components/CreateTopic";
// import Topics from "../pages/curriculum/topic/Topics";
// import TopicDetails from "../pages/curriculum/topic/components/TopicDetails";
// import Programs from "../pages/training-program/program/Programs";
// import CreateProgram from "../pages/training-program/program/components/CreateProgram";
// import ProgramDetails from "../pages/training-program/program/components/ProgramDetails";
// import ProtectedRoute from "./ProtectedRoute";
// import Profile from "../pages/auth/Profile";
// import ChangePassword from "../pages/auth/ChangePassword";
// import MediaLibrary from "../pages/content-management/media-library/MediaLibrary";
// import CreateMediaLibrary from "../pages/content-management/media-library/components/CreateMediaLibrary";
// import MediaLibraryDetails from "../pages/content-management/media-library/components/MediaLibraryDetails";
// import RolesAndPermission from "../pages/settings/roles-permission/RolesAndPermission";
// import CreateRole from "../pages/settings/roles-permission/components/CreateRole";
// import RoleDetails from "../pages/settings/roles-permission/components/RoleDetails";
// import Designation from "../pages/settings/designation/Designation";
// import CreateDesignation from "../pages/settings/designation/components/CreateDesignation";
// import DesignationDetails from "../pages/settings/designation/components/DesignationDetails";
// import SmtpSettings from "../pages/settings/smtp/SMTP";
// import Faqs from "../pages/content-management/faq/Faqs";
// import CreateFaq from "../pages/content-management/faq/components/CreateFaq";
// import FaqDetails from "../pages/content-management/faq/components/FaqDetails";
// import LearningUnitBuilder from "../pages/content-management/learning-unit-builder/LearningUnitBuilder";
// import CreateLearningUnitBuilder from "../pages/content-management/learning-unit-builder/components/CreateLearningUnitBuilder";
// import SingleLearningUnitBuilderDetails from "../pages/content-management/learning-unit-builder/components/SingleLearningUnitBuilderDetails";
// import Assissment from "../pages/assessment-management/quiz-topic/assessment/Assissment";
// import CreateAssessment from "../pages/assessment-management/quiz-topic/assessment/components/CreateAssessment";
// import AssissmentDetails from "../pages/assessment-management/quiz-topic/assessment/components/AssissmentDetails";
// import Question from "../pages/assessment-management/quiz-topic/question/Question";
// import CreateQuestion from "../pages/assessment-management/quiz-topic/question/components/CreateQuestion";
// import QuestionDetails from "../pages/assessment-management/quiz-topic/question/components/QuestionDetails";
// import Option from "../pages/assessment-management/quiz-topic/option/Option";
// import CreateOption from "../pages/assessment-management/quiz-topic/option/components/CreateOption";
// import OptionDetails from "../pages/assessment-management/quiz-topic/option/components/OptionDetails";
// import ExamAssessment from "../pages/assessment-management/exam-level/assessment/ExamAssessment";
// import CreateExamAssessment from "../pages/assessment-management/exam-level/assessment/components/CreateExamAssessment";
// import ExamAssessmentDetails from "../pages/assessment-management/exam-level/assessment/components/ExamAssessmentDetails";

// const AdminRoutes = (
//   <Route element={<ProtectedRoute />}>
//     <Route path="/" element={<AdminLayout />}>
//       {/*  Default redirect */}
//       <Route index element={<Navigate to="/dashboard" replace />} />

//       {/* Routes */}
//       <Route path="dashboard" element={<Dashboard />} />
//       <Route path="change-password" element={<ChangePassword />} />

//       {/* profile */}
//       <Route path="profile" element={<Profile />} />

//       {/* program */}
//       <Route path="programs" element={<Programs />} />
//       <Route path="programs/create-program" element={<CreateProgram />} />
//       <Route path="programs/program-details/:id" element={<ProgramDetails />} />

//       {/* user */}
//       <Route path="assign-training" element={<Users />} />
//       <Route path="assign-training/create-user" element={<CreateUser />} />
//       <Route
//         path="assign-training/user-details/:id"
//         element={<UserDetails />}
//       />

//       {/* levels */}
//       <Route path="levels" element={<Levels />} />
//       <Route path="levels/create-level" element={<CreateLevel />} />
//       <Route path="levels/level-details/:id" element={<LevelDetails />} />

//       {/* module */}
//       <Route path="modules" element={<Module />} />
//       <Route path="modules/create-module" element={<CreateModule />} />
//       <Route path="modules/module-details/:id" element={<ModuleDetails />} />

//       {/* chapter */}
//       <Route path="chapters" element={<Chapter />} />
//       <Route path="chapters/create-chapter" element={<CreateChapter />} />
//       <Route path="chapters/chapter-details/:id" element={<ChapterDetails />} />

//       {/* topics */}
//       <Route path="topics" element={<Topics />} />
//       <Route path="topics/create-topic" element={<CreateTopic />} />
//       <Route path="topics/topic-details/:id" element={<TopicDetails />} />

//       {/* learning-unit */}
//       <Route path="learning-unit" element={<LearningUnitBuilder />} />
//       <Route
//         path="learning-unit/create"
//         element={<CreateLearningUnitBuilder />}
//       />
//       <Route
//         path="learning-unit/single/:id"
//         element={<SingleLearningUnitBuilderDetails />}
//       />
//       {/* <Route
//         path="learning-unit/:id"
//         element={<LearningUnitBuilderDetails />}
//       /> */}

//       {/* media-library */}
//       <Route path="media-library" element={<MediaLibrary />} />
//       <Route
//         path="media-library/create-media"
//         element={<CreateMediaLibrary />}
//       />
//       <Route
//         path="media-library/media-details/:id"
//         element={<MediaLibraryDetails />}
//       />

//       {/* FAQ */}
//       <Route path="faq" element={<Faqs />} />
//       <Route path="faq/create" element={<CreateFaq />} />
//       <Route path="faq/:id" element={<FaqDetails />} />

//       {/* roles-permission */}
//       <Route path="roles-permission" element={<RolesAndPermission />} />
//       <Route path="roles-permission/create-role" element={<CreateRole />} />
//       <Route
//         path="roles-permission/role-details/:id"
//         element={<RoleDetails />}
//       />

//       {/* assessment-exam-level */}
//       <Route path="exam-level" element={<ExamAssessment />} />
//       <Route path="exam-level/create-exam" element={<CreateExamAssessment />} />
//       <Route
//         path="exam-level/exam-details/:assessmentId"
//         element={<ExamAssessmentDetails />}
//       />

//       {/* assessment-quize-topic */}
//       <Route path="assessment" element={<Assissment />} />
//       <Route path="assessment/create" element={<CreateAssessment />} />
//       <Route path="assessment/:assessmentId" element={<AssissmentDetails />} />

//       {/* assesment-quize-question */}
//       <Route path="assessment-question/:assessmentId" element={<Question />} />
//       <Route
//         path="assessment-question/:assessmentId/create"
//         element={<CreateQuestion />}
//       />
//       <Route
//         path="assessment-question/:assessmentId/create/:questionId"
//         element={<QuestionDetails />}
//       />

//       {/* assesment-quize-question-answer */}
//       <Route
//         path="assessment-question-option/:assessmentId/:questionId"
//         element={<Option />}
//       />
//       <Route
//         path="assessment-question-option/:assessmentId/:questionId/create"
//         element={<CreateOption />}
//       />
//       <Route
//         path="assessment-question-option/:assessmentId/:questionId/option-details/:optionId"
//         element={<OptionDetails />}
//       />

//       {/* designation */}
//       <Route path="designation" element={<Designation />} />
//       <Route
//         path="designation/create-designation"
//         element={<CreateDesignation />}
//       />
//       <Route
//         path="designation/designation-details/:id"
//         element={<DesignationDetails />}
//       />

//       {/* smpt */}
//       <Route path="smtp-setting" element={<SmtpSettings />} />

//       {/* language */}
//       <Route path="language" element={<LanguageSettings />} />

//       <Route path="*" element={<WorkInProgress />} />
//     </Route>
//   </Route>
// );

// export default AdminRoutes;

import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";

// 🔥 Lazy imports
const Dashboard = lazy(() => import("../pages/dashboad/Dashboard"));
const Users = lazy(() => import("../pages/users/Users"));
const LanguageSettings = lazy(
  () => import("../pages/language/LanguageSettings"),
);
const WorkInProgress = lazy(() => import("./ModuleProgress"));
const CreateUser = lazy(() => import("../pages/users/components/CreateUser"));
const UserDetails = lazy(() => import("../pages/users/components/UserDetails"));

const Levels = lazy(() => import("../pages/curriculum/level/Levels"));
const CreateLevel = lazy(
  () => import("../pages/curriculum/level/components/CreateLevel"),
);
const LevelDetails = lazy(
  () => import("../pages/curriculum/level/components/LevelDetails"),
);

const Module = lazy(() => import("../pages/curriculum/module/Module"));
const CreateModule = lazy(
  () => import("../pages/curriculum/module/components/CreateModule"),
);
const ModuleDetails = lazy(
  () => import("../pages/curriculum/module/components/ModuleDetails"),
);

const Chapter = lazy(() => import("../pages/curriculum/chapter/Chapter"));
const CreateChapter = lazy(
  () => import("../pages/curriculum/chapter/components/CreateChapter"),
);
const ChapterDetails = lazy(
  () => import("../pages/curriculum/chapter/components/ChapterDetails"),
);

const Topics = lazy(() => import("../pages/curriculum/topic/Topics"));
const CreateTopic = lazy(
  () => import("../pages/curriculum/topic/components/CreateTopic"),
);
const TopicDetails = lazy(
  () => import("../pages/curriculum/topic/components/TopicDetails"),
);

const Programs = lazy(
  () => import("../pages/training-program/program/Programs"),
);
const CreateProgram = lazy(
  () => import("../pages/training-program/program/components/CreateProgram"),
);
const ProgramDetails = lazy(
  () => import("../pages/training-program/program/components/ProgramDetails"),
);

const Profile = lazy(() => import("../pages/auth/Profile"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword"));

const MediaLibrary = lazy(
  () => import("../pages/content-management/media-library/MediaLibrary"),
);
const CreateMediaLibrary = lazy(
  () =>
    import("../pages/content-management/media-library/components/CreateMediaLibrary"),
);
const MediaLibraryDetails = lazy(
  () =>
    import("../pages/content-management/media-library/components/MediaLibraryDetails"),
);

const RolesAndPermission = lazy(
  () => import("../pages/settings/roles-permission/RolesAndPermission"),
);
const CreateRole = lazy(
  () => import("../pages/settings/roles-permission/components/CreateRole"),
);
const RoleDetails = lazy(
  () => import("../pages/settings/roles-permission/components/RoleDetails"),
);

const Designation = lazy(
  () => import("../pages/settings/designation/Designation"),
);
const CreateDesignation = lazy(
  () => import("../pages/settings/designation/components/CreateDesignation"),
);
const DesignationDetails = lazy(
  () => import("../pages/settings/designation/components/DesignationDetails"),
);

const SmtpSettings = lazy(() => import("../pages/settings/smtp/SMTP"));
const SystemSetting = lazy(
  () => import("../pages/settings/system-settings/SystemSetting"),
);

const Faqs = lazy(() => import("../pages/content-management/faq/Faqs"));
const CreateFaq = lazy(
  () => import("../pages/content-management/faq/components/CreateFaq"),
);
const FaqDetails = lazy(
  () => import("../pages/content-management/faq/components/FaqDetails"),
);

const LearningUnitBuilder = lazy(
  () =>
    import("../pages/content-management/learning-unit-builder/LearningUnitBuilder"),
);
const CreateLearningUnitBuilder = lazy(
  () =>
    import("../pages/content-management/learning-unit-builder/components/CreateLearningUnitBuilder"),
);
const SingleLearningUnitBuilderDetails = lazy(
  () =>
    import("../pages/content-management/learning-unit-builder/components/SingleLearningUnitBuilderDetails"),
);

const Assissment = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/assessment/Assissment"),
);
const CreateAssessment = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/assessment/components/CreateAssessment"),
);
const AssissmentDetails = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/assessment/components/AssissmentDetails"),
);

const Question = lazy(
  () => import("../pages/assessment-management/quiz-topic/question/Question"),
);
const CreateQuestion = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/question/components/CreateQuestion"),
);
const QuestionDetails = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/question/components/QuestionDetails"),
);

const Option = lazy(
  () => import("../pages/assessment-management/quiz-topic/option/Option"),
);
const CreateOption = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/option/components/CreateOption"),
);
const OptionDetails = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/option/components/OptionDetails"),
);

const ExamAssessment = lazy(
  () =>
    import("../pages/assessment-management/exam-level/assessment/ExamAssessment"),
);
const CreateExamAssessment = lazy(
  () =>
    import("../pages/assessment-management/exam-level/assessment/components/CreateExamAssessment"),
);
const ExamAssessmentDetails = lazy(
  () =>
    import("../pages/assessment-management/exam-level/assessment/components/ExamAssessmentDetails"),
);

const AdminRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<AdminLayout />}>
      {/* Default redirect */}
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard */}
      <Route path="dashboard" element={<Dashboard />} />

      {/* Profile */}
      <Route path="profile" element={<Profile />} />
      <Route path="change-password" element={<ChangePassword />} />

      {/* Programs */}
      <Route path="programs" element={<Programs />} />
      <Route path="programs/create-program" element={<CreateProgram />} />
      <Route path="programs/program-details/:id" element={<ProgramDetails />} />

      {/* Users */}
      <Route path="assign-training" element={<Users />} />
      <Route path="assign-training/create-user" element={<CreateUser />} />
      <Route
        path="assign-training/user-details/:id"
        element={<UserDetails />}
      />

      {/* Levels */}
      <Route path="levels" element={<Levels />} />
      <Route path="levels/create-level" element={<CreateLevel />} />
      <Route path="levels/level-details/:id" element={<LevelDetails />} />

      {/* Modules */}
      <Route path="modules" element={<Module />} />
      <Route path="modules/create-module" element={<CreateModule />} />
      <Route path="modules/module-details/:id" element={<ModuleDetails />} />

      {/* Chapters */}
      <Route path="chapters" element={<Chapter />} />
      <Route path="chapters/create-chapter" element={<CreateChapter />} />
      <Route path="chapters/chapter-details/:id" element={<ChapterDetails />} />

      {/* Topics */}
      <Route path="topics" element={<Topics />} />
      <Route path="topics/create-topic" element={<CreateTopic />} />
      <Route path="topics/topic-details/:id" element={<TopicDetails />} />

      {/* Learning Unit */}
      <Route path="learning-unit" element={<LearningUnitBuilder />} />
      <Route
        path="learning-unit/create"
        element={<CreateLearningUnitBuilder />}
      />
      <Route
        path="learning-unit/single/:id"
        element={<SingleLearningUnitBuilderDetails />}
      />

      {/* Media */}
      <Route path="media-library" element={<MediaLibrary />} />
      <Route
        path="media-library/create-media"
        element={<CreateMediaLibrary />}
      />
      <Route
        path="media-library/media-details/:id"
        element={<MediaLibraryDetails />}
      />

      {/* FAQ */}
      <Route path="faq" element={<Faqs />} />
      <Route path="faq/create" element={<CreateFaq />} />
      <Route path="faq/:id" element={<FaqDetails />} />

      {/* Roles */}
      <Route path="roles-permission" element={<RolesAndPermission />} />
      <Route path="roles-permission/create-role" element={<CreateRole />} />
      <Route
        path="roles-permission/role-details/:id"
        element={<RoleDetails />}
      />

      {/* Exam Level */}
      <Route path="exam-level" element={<ExamAssessment />} />
      <Route path="exam-level/create-exam" element={<CreateExamAssessment />} />
      <Route
        path="exam-level/exam-details/:assessmentId"
        element={<ExamAssessmentDetails />}
      />

      {/* Assessment */}
      <Route path="assessment" element={<Assissment />} />
      <Route path="assessment/create" element={<CreateAssessment />} />
      <Route path="assessment/:assessmentId" element={<AssissmentDetails />} />

      {/* Questions */}
      <Route path="assessment-question/:assessmentId" element={<Question />} />
      <Route
        path="assessment-question/:assessmentId/create"
        element={<CreateQuestion />}
      />
      <Route
        path="assessment-question/:assessmentId/create/:questionId"
        element={<QuestionDetails />}
      />

      {/* Options */}
      <Route
        path="assessment-question-option/:assessmentId/:questionId"
        element={<Option />}
      />
      <Route
        path="assessment-question-option/:assessmentId/:questionId/create"
        element={<CreateOption />}
      />
      <Route
        path="assessment-question-option/:assessmentId/:questionId/option-details/:optionId"
        element={<OptionDetails />}
      />

      {/* Designation */}
      <Route path="designation" element={<Designation />} />
      <Route
        path="designation/create-designation"
        element={<CreateDesignation />}
      />
      <Route
        path="designation/designation-details/:id"
        element={<DesignationDetails />}
      />

      {/* Settings */}
      <Route path="smtp-setting" element={<SmtpSettings />} />
      <Route path="language" element={<LanguageSettings />} />
      <Route path="system-settings" element={<SystemSetting />} />

      {/* Fallback */}
      <Route path="*" element={<WorkInProgress />} />
    </Route>
  </Route>
);

export default AdminRoutes;
