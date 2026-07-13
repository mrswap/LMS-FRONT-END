import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./features/admin/routes/AdminRoutes";
import GlobalConfirmModal from "./features/admin/common/GlobalConfirmModal";
import Loader from "./features/admin/common/Loader";
import PublicRoute from "./features/admin/routes/PublicRoute";

// 🔥 Lazy auth pages
const Login = lazy(() => import("./features/admin/pages/auth/Login"));
const ForgotPassword = lazy(
  () => import("./features/admin/pages/auth/ForgotPassword"),
);
const CheckEmail = lazy(() => import("./features/admin/pages/auth/CheckEmail"));
const ResetPassword = lazy(
  () => import("./features/admin/pages/auth/ResetPassword"),
);

const App = () => {
  return (
    <>
      {/* 🔥 Suspense yaha wrap karega sab routes ko */}
      <Suspense
        fallback={
          <div>
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          {AdminRoutes}
        </Routes>
      </Suspense>

      <GlobalConfirmModal />
    </>
  );
};

export default App;
