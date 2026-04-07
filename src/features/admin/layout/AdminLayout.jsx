import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { useDispatch } from "react-redux";
import useIdleTimeout from "../../../hooks/useIdleTimeout";
import { logout } from "../../../redux/slice/authSlice";
import SessionModal from "../common/SessionModal";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const { showModal, setShowModal, resetTimer } = useIdleTimeout(
    handleLogout,
    // 10 * 1000,
  );

  return (
    <>
      <SessionModal
        open={showModal}
        onContinue={() => {
          setShowModal(false);
          resetTimer();
        }}
        onLogout={handleLogout}
      />
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
    </>
  );
};

export default AdminLayout;
