import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./features/admin/routes/AdminRoutes";
import Login from "./features/admin/pages/auth/Login";
import LoginTest from "./features/admin/pages/auth/TestAllField";
import ForgotPassword from "./features/admin/pages/auth/ForgotPassword";
import CheckEmail from "./features/admin/pages/auth/CheckEmail";
// import ChangePassword from "./features/admin/pages/auth/ChangePassword";
// import ModuleProgress from "./features/admin/routes/ModuleProgress";
import GlobalConfirmModal from "./features/admin/common/GlobalConfirmModal";
import ResetPassword from "./features/admin/pages/auth/ResetPassword";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/test" element={<LoginTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/change-password" element={<ChangePassword />} /> */}
        {AdminRoutes}
      </Routes>
      <GlobalConfirmModal />
    </>
  );
};

export default App;
