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
      {/* {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-2">Session Expiring</h2>
            <p className="text-sm text-gray-600 mb-4">
              You will be logged out due to inactivity.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetTimer();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Continue
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )} */}

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
