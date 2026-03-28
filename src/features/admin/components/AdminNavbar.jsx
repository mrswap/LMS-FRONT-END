// import { FiSearch, FiBell, FiMessageSquare, FiUser } from "react-icons/fi";
// import logo from "../../../assets/admin/AvanteMedicalLogo.png";

// const AdminNavbar = () => {
//   return (
//     <div className="h-16 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] flex items-center justify-between px-6 shadow-lg border-b border-[#003366]">
//       {/* LEFT SIDE (Logo + Search) */}
//       <div className="flex items-center gap-6">
//         {/* Logo */}
//         <div className="flex items-center gap-2 text-white font-semibold text-lg">
//           <img src={logo} alt="Avante Medical Logo" className="h-8" />
//         </div>

//         {/* Search Bar */}
//         <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1.5 w-[350px] shadow-inner">
//           <FiSearch className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search analytics, users or courses..."
//             className="outline-none px-2 py-1 w-full text-sm text-gray-700"
//           />
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex items-center gap-6 text-white">
//         {/* Notification */}
//         <div className="relative cursor-pointer hover:scale-105 transition">
//           <FiBell size={20} />
//           <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
//             1
//           </span>
//         </div>

//         {/* Messages */}
//         <div className="cursor-pointer hover:scale-105 transition">
//           <FiMessageSquare size={20} />
//         </div>

//         {/* Profile */}
//         <div className="flex items-center gap-2 cursor-pointer">
//           <div className="text-right text-sm">
//             <p className="font-medium text-white">Dr. Sarah Chen</p>
//             <p className="text-xs text-gray-300">System Admin</p>
//           </div>
//           <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
//             <FiUser size={16} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminNavbar;

import { FiSearch, FiBell, FiMessageSquare, FiUser } from "react-icons/fi";
import logo from "../../../assets/admin/AvanteMedicalLogo.png";
import { useTranslation } from "react-i18next";

const AdminNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="h-16 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] flex items-center justify-between px-6 shadow-lg border-b border-[#003366]">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <img src={logo} alt="Avante Medical Logo" className="h-8" />
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1.5 w-[350px] shadow-inner">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder={t("navbar.searchPlaceholder")}
            className="outline-none px-2 py-1 w-full text-sm text-gray-700"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 text-white">
        {/* Notifications */}
        <div className="relative cursor-pointer hover:scale-105 transition">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            1
          </span>
        </div>

        {/* Messages */}
        <div className="cursor-pointer hover:scale-105 transition">
          <FiMessageSquare size={20} />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-right text-sm">
            <p className="font-medium text-white">{t("navbar.profileName")}</p>
            <p className="text-xs text-gray-300">{t("navbar.role")}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
            <FiUser size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
