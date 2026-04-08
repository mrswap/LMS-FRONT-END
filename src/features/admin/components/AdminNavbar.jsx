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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../../../redux/slice/authSlice";
import { useToast } from "../common/toast/ToastContext";

const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { profile } = useSelector((state) => state.auth);

  console.log("profile", profile);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/login");
  };

  // ✅ Outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

        {/* Messages
        <div className="hidden sm:block cursor-pointer hover:scale-105 transition">
          <FiMessageSquare size={18} />
        </div> */}

        {/* PROFILE */}
        <div ref={dropdownRef} className="relative">
          {/* CLICK AREA */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <div className="hidden sm:block text-right text-sm leading-tight">
              <p className="font-medium text-white text-xs sm:text-sm">
                {profile?.name || "User"}
              </p>

              <p className="text-[10px] sm:text-xs text-blue-200">
                {profile?.role || "Role"}
              </p>
            </div>

            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white/30">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
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
                {t("navbar.profile")}
              </div>

              <div
                onClick={() => {
                  navigate("/change-password");
                  setProfileOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {t("navbar.changePassword")}
              </div>

              {/* Logout */}
              <div
                onClick={() => {
                  handleLogout();
                  setProfileOpen(false);
                }}
                className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
              >
                {t("navbar.logout")}
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
