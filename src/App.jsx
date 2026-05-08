// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import AdminRoutes from "./features/admin/routes/AdminRoutes";
// import Login from "./features/admin/pages/auth/Login";
// import LoginTest from "./features/admin/pages/auth/TestAllField";
// import ForgotPassword from "./features/admin/pages/auth/ForgotPassword";
// import CheckEmail from "./features/admin/pages/auth/CheckEmail";
// import GlobalConfirmModal from "./features/admin/common/GlobalConfirmModal";
// import ResetPassword from "./features/admin/pages/auth/ResetPassword";

// const App = () => {
//   return (
//     <>
//       <Routes>
//         <Route path="/test" element={<LoginTest />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/check-email" element={<CheckEmail />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         {AdminRoutes}
//       </Routes>
//       <GlobalConfirmModal />
//     </>
//   );
// };

// export default App;

import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./features/admin/routes/AdminRoutes";
import GlobalConfirmModal from "./features/admin/common/GlobalConfirmModal";
import Loader from "./features/admin/common/Loader";

// 🔥 Lazy auth pages
const Login = lazy(() => import("./features/admin/pages/auth/Login"));
const LoginTest = lazy(
  () => import("./features/admin/pages/auth/TestAllField"),
);
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
          <Route path="/test" element={<LoginTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {AdminRoutes}
        </Routes>
      </Suspense>

      <GlobalConfirmModal />
    </>
  );
};

export default App;
