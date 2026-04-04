// import { Outlet } from "react-router-dom";
// import AdminNavbar from "../components/AdminNavbar";
// import AdminSidebar from "../components/AdminSidebar";

// const AdminLayout = () => {
//   return (
//     <div className="h-screen flex flex-col">
//       {/* Top Navbar */}
//       <AdminNavbar />

//       {/* Sidebar + Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <AdminSidebar />

//         {/* Main Content */}
//         <div className="flex-1 p-6 bg-white overflow-auto custom-scrollbar">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Navbar — passes toggle handler */}
      <AdminNavbar
        onMenuToggle={() => setSidebarOpen((p) => !p)}
        isSidebarOpen={sidebarOpen}
      />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar — handles both desktop (static) and mobile (drawer) */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white custom-scrollbar">
          {/* Inner padding — slightly tighter on mobile */}
          <div className="p-4 sm:p-5 lg:p-6 min-h-full ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
