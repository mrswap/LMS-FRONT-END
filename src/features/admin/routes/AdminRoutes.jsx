import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/dashboad/Dashboard";
import Users from "../pages/users/Users";
import LanguageSettings from "../pages/language/LanguageSettings";
import WorkInProgress from "./ModuleProgress";
import CreateUser from "../pages/users/components/CreateUser";
import UserDetails from "../pages/users/components/UserDetails";
import Levels from "../pages/level/Levels";
import CreateLevel from "../pages/level/components/CreateLevel";

const AdminRoutes = (
  <Route path="/" element={<AdminLayout />}>
    {/*  Default redirect */}
    <Route index element={<Navigate to="/dashboard" replace />} />

    {/* Routes */}
    <Route path="dashboard" element={<Dashboard />} />

    {/* user */}
    <Route path="assign-training" element={<Users />} />
    <Route path="assign-training/create-user" element={<CreateUser />} />
    <Route path="assign-training/user-details" element={<UserDetails />} />

    {/* levels */}
    <Route path="levels" element={<Levels />} />
    <Route path="levels/create-level" element={<CreateLevel />} />

    <Route path="language" element={<LanguageSettings />} />

    <Route path="*" element={<WorkInProgress />} />
  </Route>
);

export default AdminRoutes;
