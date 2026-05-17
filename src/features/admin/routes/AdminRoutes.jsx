import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import Staff from "../pages/users/Staff";
import AdminSupportPage from "../pages/AdminSupportPage";
import BulkUpload from "../pages/curriculum/bulk-upload/BulkUpload";
import CreateBulkUpload from "../pages/curriculum/bulk-upload/components/CreateBulkUpload";
import BulkUploadDetails from "../pages/curriculum/bulk-upload/components/BulkUploadDetails";
import BulkUpload2 from "../pages/curriculum/bulk-upload/BulkUpload2";
import BulkUpload1 from "../pages/curriculum/bulk-upload/BulkUpload1";
import CreateBulkUpload1 from "../pages/curriculum/bulk-upload/components/CreateBulkUpload1";
import CreateBulkUpload2 from "../pages/curriculum/bulk-upload/components/CreateBulkUpload2";

const Certificate = lazy(() => import("../pages/certificate/Certificate"));
const Notification = lazy(() => import("../common/noitification/Notification"));

const NotificationDetail = lazy(
  () => import("../common/noitification/NotificatinDetails"),
);

const SingleMediaPreview = lazy(
  () =>
    import("../pages/content-management/media-library/components/SingleMediaPreview"),
);

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

const CertificationSetting = lazy(
  () => import("../pages/settings/certification-setting/CertificationSetting"),
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

const SingleContentPreview = lazy(
  () =>
    import("../pages/content-management/learning-unit-builder/components/SingleContentPreview"),
);

const BulkLearningUnitBuilderDetails = lazy(
  () =>
    import("../pages/content-management/learning-unit-builder/components/BulkLearningUnitBuilderDetails"),
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

const QuizFeedback = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/feedback/QuizFeedback"),
);
const ExamFeedback = lazy(
  () =>
    import("../pages/assessment-management/exam-level/feedback/ExamFeedback"),
);
const Contact = lazy(
  () => import("../pages/reports-administration/contact-us/Contact"),
);
const ContactDetails = lazy(
  () =>
    import("../pages/reports-administration/contact-us/components/ContactDetails"),
);
const AuditLogsReport = lazy(
  () => import("../pages/reports-administration/audit-logs/AuditLogsReport"),
);
const UserProgressReport = lazy(
  () =>
    import("../pages/reports-administration/user-progress/UserProgressReport"),
);
const AssessmentReport = lazy(
  () => import("../pages/reports-administration/assessment/AssessmentReport"),
);
const ContentStatusReport = lazy(
  () =>
    import("../pages/reports-administration/content-status/ContentStatusReport"),
);
const CertificationReport = lazy(
  () =>
    import("../pages/reports-administration/certification/CertificationReport"),
);
const FeedbackDetails = lazy(
  () =>
    import("../pages/assessment-management/quiz-topic/feedback/components/FeedbackDetails"),
);
const ExamFeedbackDetails = lazy(
  () =>
    import("../pages/assessment-management/exam-level/feedback/components/ExamFeedbackDetails"),
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
    {/* Support */}
    {/* <Route path="chat-bot" element={<AdminSupportPage />} /> */}
    <Route path="/" element={<AdminLayout />}>
      {/* Default redirect */}
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/notifications/:id" element={<NotificationDetail />} />

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
      <Route path="staff" element={<Staff />} />
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
      <Route
        path="learning-unit/bulk/:id"
        element={<BulkLearningUnitBuilderDetails />}
      />

      {/* Bulk upload */}
      <Route path="bulk-upload" element={<BulkUpload />} />
      <Route path="bulk-upload1" element={<BulkUpload1 />} />
      <Route path="bulk-upload2" element={<BulkUpload2 />} />
      <Route path="bulk-upload/create" element={<CreateBulkUpload />} />
      <Route path="bulk-upload1/create" element={<CreateBulkUpload1 />} />
      <Route path="bulk-upload2/create" element={<CreateBulkUpload2 />} />
      <Route path="bulk-upload/:id" element={<BulkUploadDetails />} />
      <Route path="bulk-upload1/:id" element={<BulkUploadDetails />} />
      <Route path="bulk-upload2/:id" element={<BulkUploadDetails />} />

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
      <Route
        path="learning-unit/preview/:topicId/:contentId"
        element={<SingleContentPreview />}
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
      <Route
        path="media-library/preview/:id"
        element={<SingleMediaPreview />}
      />

      {/* FAQ */}
      <Route path="faq" element={<Faqs />} />
      <Route path="faq/create" element={<CreateFaq />} />
      <Route path="faq/:id" element={<FaqDetails />} />

      {/* Exam Level */}
      <Route path="exam-level" element={<ExamAssessment />} />
      <Route path="exam-feedback" element={<ExamFeedback />} />
      <Route path="exam-feedback/:id" element={<ExamFeedbackDetails />} />
      <Route path="exam-level/create-exam" element={<CreateExamAssessment />} />
      <Route
        path="exam-level/exam-details/:assessmentId"
        element={<ExamAssessmentDetails />}
      />

      {/* Assessment */}
      <Route path="assessment" element={<Assissment />} />
      <Route path="assessment-feedback" element={<QuizFeedback />} />
      <Route path="assessment-feedback/:id" element={<FeedbackDetails />} />
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

      {/* Certificate */}
      <Route path="certificate/:id" element={<Certificate />} />

      {/* Settings */}
      <Route path="certification-settings" element={<CertificationSetting />} />
      <Route path="roles-permission" element={<RolesAndPermission />} />
      <Route path="roles-permission/create-role" element={<CreateRole />} />
      <Route
        path="roles-permission/role-details/:id"
        element={<RoleDetails />}
      />
      <Route path="designation" element={<Designation />} />
      <Route
        path="designation/create-designation"
        element={<CreateDesignation />}
      />
      <Route
        path="designation/designation-details/:id"
        element={<DesignationDetails />}
      />
      <Route path="smtp-setting" element={<SmtpSettings />} />
      <Route path="language" element={<LanguageSettings />} />
      <Route path="system-settings" element={<SystemSetting />} />

      {/* Reports */}
      <Route path="contact-us-report" element={<Contact />} />
      <Route path="contact-us-report/:id" element={<ContactDetails />} />
      <Route path="audit-logs-report" element={<AuditLogsReport />} />
      <Route path="user-progress-report" element={<UserProgressReport />} />
      <Route path="assessment-report" element={<AssessmentReport />} />
      <Route path="content-status-report" element={<ContentStatusReport />} />
      <Route path="certification-report" element={<CertificationReport />} />

      <Route path="support" element={<AdminSupportPage />} />

      {/* Fallback */}
      <Route path="*" element={<WorkInProgress />} />
    </Route>
  </Route>
);

export default AdminRoutes;
