import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

// components/ProtectedRoute.jsx
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import usePermission from "../../../hooks/usePermission";

// // Route permission mapping
// const routePermissions = {
//   "/dashboard": "dashboard.view",

//   "/assign-training": "users.view",
//   "/assign-training/create-user": "users.create",

//   "/programs": "programs.view",
//   "/programs/create-program": "programs.create",

//   "/levels": "levels.view",
//   "/levels/create-level": "levels.create",

//   "/modules": "modules.view",
//   "/modules/create-module": "modules.create",

//   "/chapters": "chapters.view",
//   "/chapters/create-chapter": "chapters.create",

//   "/topics": "topics.view",
//   "/topics/create-topic": "topics.create",

//   "/learning-unit": "content.view",
//   "/learning-unit/create": "content.create",

//   "/media-library": "media.view",
//   "/media-library/create-media": "media.create",

//   "/faq": "faqs.view",
//   "/faq/create": "faqs.create",

//   "/assessment": "assessments.view",
//   "/assessment/create": "assessments.create",

//   "/roles-permission": "roles.view",
//   "/roles-permission/create-role": "roles.create",

//   "/designation": "designations.view",
//   "/designation/create-designation": "designations.create",

//   "/smtp-setting": "smtp.view",

//   "/language": "languages.view",

//   "/system-settings": "site-settings.view",

//   "/certification-settings": "certificate-settings.view",

//   "/contact-us-report": "contacts.view",

//   "/audit-logs-report": "reports.audit",

//   "/profile": null,
//   "/change-password": null,
// };

// const getRequiredPermission = (pathname) => {
//   // Exact match
//   if (routePermissions[pathname] !== undefined) {
//     return routePermissions[pathname];
//   }

//   // Dynamic routes
//   for (const route in routePermissions) {
//     const pattern = route.replace(/:\w+/g, "([^/]+)");
//     const regex = new RegExp(`^${pattern}$`);

//     if (regex.test(pathname)) {
//       return routePermissions[route];
//     }
//   }

//   return null;
// };

// const ProtectedRoute = () => {
//   const { hasPermission } = usePermission();
//   const location = useLocation();

//   const token = localStorage.getItem("token");

//   // Not logged in
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // Current route permission
//   const requiredPermission = getRequiredPermission(location.pathname);

//   // No permission required
//   if (!requiredPermission) {
//     return <Outlet />;
//   }

//   // Permission denied
//   if (!hasPermission(requiredPermission)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // Allowed
//   return <Outlet />;
// };

// export default ProtectedRoute;
