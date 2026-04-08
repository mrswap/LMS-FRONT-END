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

      {/* language */}
      <Route path="language" element={<LanguageSettings />} />

      <Route path="*" element={<WorkInProgress />} />
    </Route>
  </Route>
);

export default AdminRoutes;
