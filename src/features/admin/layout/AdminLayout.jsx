import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-white overflow-auto custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
