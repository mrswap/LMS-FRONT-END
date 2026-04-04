// import { useState } from "react";
// import {
//   FiSearch,
//   FiBell,
//   FiMessageSquare,
//   FiUser,
//   FiMenu,
//   FiX,
// } from "react-icons/fi";
// import logo from "../../../assets/admin/AvanteMedicalLogo.png";
// import { useTranslation } from "react-i18next";

// const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
//   const { t } = useTranslation();
//   const [searchOpen, setSearchOpen] = useState(false);

//   return (
//     <div className="h-14 sm:h-16 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] flex items-center justify-between px-3 sm:px-6 shadow-lg border-b border-[#1d3d8a] z-50 relative">
//       {/* LEFT SIDE */}
//       <div className="flex items-center gap-2 sm:gap-4">
//         {/* Hamburger — visible on mobile/tablet */}
//         <button
//           className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition"
//           onClick={onMenuToggle}
//         >
//           {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>

//         {/* Logo */}
//         <div className="flex items-center gap-2 text-white font-semibold text-base sm:text-lg">
//           <img src={logo} alt="Logo" className="h-7 sm:h-8" />
//         </div>

//         {/* Search — desktop always visible */}
//         <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1.5 w-56 lg:w-[300px] xl:w-[350px] shadow-inner">
//           <FiSearch className="text-gray-400 shrink-0" />
//           <input
//             type="text"
//             placeholder={t("navbar.searchPlaceholder") || "Search..."}
//             className="outline-none px-2 py-0.5 w-full text-sm text-gray-700 bg-transparent"
//           />
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex items-center gap-3 sm:gap-5 text-white">
//         {/* Mobile search toggle */}
//         <button
//           className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition"
//           onClick={() => setSearchOpen((p) => !p)}
//         >
//           <FiSearch size={18} />
//         </button>

//         {/* Notifications */}
//         <div className="relative cursor-pointer hover:scale-105 transition">
//           <FiBell size={18} className="sm:w-5 sm:h-5" />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full">
//             1
//           </span>
//         </div>

//         {/* Messages — hide on very small screens */}
//         <div className="hidden sm:block cursor-pointer hover:scale-105 transition">
//           <FiMessageSquare size={18} />
//         </div>

//         {/* Profile */}
//         <div className="flex items-center gap-2 cursor-pointer">
//           <div className="hidden sm:block text-right text-sm leading-tight">
//             <p className="font-medium text-white text-xs sm:text-sm">
//               {t("navbar.profileName") || "Admin User"}
//             </p>
//             <p className="text-[10px] sm:text-xs text-blue-200">
//               {t("navbar.role") || "Administrator"}
//             </p>
//           </div>
//           <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
//             <FiUser size={14} />
//           </div>
//         </div>
//       </div>

//       {/* Mobile search dropdown */}
//       {searchOpen && (
//         <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg px-4 py-3 z-50">
//           <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
//             <FiSearch className="text-gray-400 shrink-0" />
//             <input
//               type="text"
//               autoFocus
//               placeholder="Search..."
//               className="outline-none w-full text-sm text-gray-700"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminNavbar;

import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import logo from "../../../assets/admin/AvanteMedicalLogo.png";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slice/authSlice";
import { useToast } from "../common/toast/ToastContext";

const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-14 sm:h-16 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] flex items-center justify-between px-3 sm:px-6 shadow-lg border-b border-[#1d3d8a] z-50 relative">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hamburger */}
        <button
          className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 transition"
          onClick={onMenuToggle}
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-semibold text-base sm:text-lg">
          <img src={logo} alt="Logo" className="h-7 sm:h-8" />
        </div>

        {/* Search Desktop */}
        <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1.5 w-56 lg:w-[300px] xl:w-[350px] shadow-inner">
          <FiSearch className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={t("navbar.searchPlaceholder") || "Search..."}
            className="outline-none px-2 py-0.5 w-full text-sm text-gray-700 bg-transparent"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 sm:gap-5 text-white">
        {/* Mobile Search */}
        <button
          className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition"
          onClick={() => setSearchOpen((p) => !p)}
        >
          <FiSearch size={18} />
        </button>

        {/* Notifications */}
        <div className="relative cursor-pointer hover:scale-105 transition">
          <FiBell size={18} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            1
          </span>
        </div>

        {/* Messages */}
        <div className="hidden sm:block cursor-pointer hover:scale-105 transition">
          <FiMessageSquare size={18} />
        </div>

        {/* PROFILE */}
        <div
          ref={dropdownRef}
          className="flex items-center gap-2 cursor-pointer relative"
          onClick={() => setProfileOpen((prev) => !prev)}
        >
          <div className="hidden sm:block text-right text-sm leading-tight">
            <p className="font-medium text-white text-xs sm:text-sm">
              {t("navbar.profileName") || "Admin User"}
            </p>
            <p className="text-[10px] sm:text-xs text-blue-200">
              {t("navbar.role") || "Administrator"}
            </p>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <FiUser size={14} />
          </div>

          {/* DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
              {/* Profile */}
              <div
                onClick={() => {
                  navigate("/profile");
                  setProfileOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </div>

              {/* Divider */}
              <div className="border-t my-1"></div>

              {/* Logout */}
              <div
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg px-4 py-3 z-50">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="outline-none w-full text-sm text-gray-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
