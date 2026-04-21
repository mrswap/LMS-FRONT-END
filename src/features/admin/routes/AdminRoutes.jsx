import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/dashboad/Dashboard";
import Users from "../pages/users/Users";
import LanguageSettings from "../pages/language/LanguageSettings";
import WorkInProgress from "./ModuleProgress";
import CreateUser from "../pages/users/components/CreateUser";
import UserDetails from "../pages/users/components/UserDetails";
import Levels from "../pages/curriculum/level/Levels";
import CreateLevel from "../pages/curriculum/level/components/CreateLevel";
import LevelDetails from "../pages/curriculum/level/components/LevelDetails";
import Module from "../pages/curriculum/module/Module";
import CreateModule from "../pages/curriculum/module/components/CreateModule";
import ModuleDetails from "../pages/curriculum/module/components/ModuleDetails";
import Chapter from "../pages/curriculum/chapter/Chapter";
import CreateChapter from "../pages/curriculum/chapter/components/CreateChapter";
import ChapterDetails from "../pages/curriculum/chapter/components/ChapterDetails";
import CreateTopic from "../pages/curriculum/topic/components/CreateTopic";
import Topics from "../pages/curriculum/topic/Topics";
import TopicDetails from "../pages/curriculum/topic/components/TopicDetails";
import Programs from "../pages/training-program/program/Programs";
import CreateProgram from "../pages/training-program/program/components/CreateProgram";
import ProgramDetails from "../pages/training-program/program/components/ProgramDetails";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/auth/Profile";
import ChangePassword from "../pages/auth/ChangePassword";
import MediaLibrary from "../pages/content-management/media-library/MediaLibrary";
import CreateMediaLibrary from "../pages/content-management/media-library/components/CreateMediaLibrary";
import MediaLibraryDetails from "../pages/content-management/media-library/components/MediaLibraryDetails";
import RolesAndPermission from "../pages/settings/roles-permission/RolesAndPermission";
import CreateRole from "../pages/settings/roles-permission/components/CreateRole";
import RoleDetails from "../pages/settings/roles-permission/components/RoleDetails";
import Designation from "../pages/settings/designation/Designation";
import CreateDesignation from "../pages/settings/designation/components/CreateDesignation";
import DesignationDetails from "../pages/settings/designation/components/DesignationDetails";
import SmtpSettings from "../pages/settings/smtp/SMTP";
import Faqs from "../pages/content-management/faq/Faqs";
import CreateFaq from "../pages/content-management/faq/components/CreateFaq";
import FaqDetails from "../pages/content-management/faq/components/FaqDetails";
import LearningUnitBuilder from "../pages/content-management/learning-unit-builder/LearningUnitBuilder";
import CreateLearningUnitBuilder from "../pages/content-management/learning-unit-builder/components/CreateLearningUnitBuilder";
import LearningUnitBuilderDetails from "../pages/content-management/learning-unit-builder/components/LearningUnitBuilderDetails";
import SingleLearningUnitBuilderDetails from "../pages/content-management/learning-unit-builder/components/SingleLearningUnitBuilderDetails";

const AdminRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<AdminLayout />}>
      {/*  Default redirect */}
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* Routes */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="change-password" element={<ChangePassword />} />

      {/* profile */}
      <Route path="profile" element={<Profile />} />

      {/* program */}
      <Route path="programs" element={<Programs />} />
      <Route path="programs/create-program" element={<CreateProgram />} />
      <Route path="programs/program-details/:id" element={<ProgramDetails />} />

      {/* user */}
      <Route path="assign-training" element={<Users />} />
      <Route path="assign-training/create-user" element={<CreateUser />} />
      <Route
        path="assign-training/user-details/:id"
        element={<UserDetails />}
      />

      {/* levels */}
      <Route path="levels" element={<Levels />} />
      <Route path="levels/create-level" element={<CreateLevel />} />
      <Route path="levels/level-details/:id" element={<LevelDetails />} />

      {/* module */}
      <Route path="modules" element={<Module />} />
      <Route path="modules/create-module" element={<CreateModule />} />
      <Route path="modules/module-details/:id" element={<ModuleDetails />} />

      {/* chapter */}
      <Route path="chapters" element={<Chapter />} />
      <Route path="chapters/create-chapter" element={<CreateChapter />} />
      <Route path="chapters/chapter-details/:id" element={<ChapterDetails />} />

      {/* topics */}
      <Route path="topics" element={<Topics />} />
      <Route path="topics/create-topic" element={<CreateTopic />} />
      <Route path="topics/topic-details/:id" element={<TopicDetails />} />

      {/* learning-unit */}
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
        path="learning-unit/:id"
        element={<LearningUnitBuilderDetails />}
      />

      {/* media-library */}
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

      {/* roles-permission */}
      <Route path="roles-permission" element={<RolesAndPermission />} />
      <Route path="roles-permission/create-role" element={<CreateRole />} />
      <Route
        path="roles-permission/role-details/:id"
        element={<RoleDetails />}
      />

      {/* designation */}
      <Route path="designation" element={<Designation />} />
      <Route
        path="designation/create-designation"
        element={<CreateDesignation />}
      />
      <Route
        path="designation/designation-details/:id"
        element={<DesignationDetails />}
      />

      {/* smpt */}
      <Route path="smtp-setting" element={<SmtpSettings />} />

      {/* language */}
      <Route path="language" element={<LanguageSettings />} />

      <Route path="*" element={<WorkInProgress />} />
    </Route>
  </Route>
);

export default AdminRoutes;
