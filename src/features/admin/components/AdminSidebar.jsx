import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiGrid,
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiFileText,
  FiClipboard,
  FiAward,
  FiBarChart2,
  FiGlobe,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openParent, setOpenParent] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});

  const navItems = [
    { icon: FiGrid, label: t("sidebar.dashboard"), path: "/dashboard" },

    {
      icon: FiUsers,
      label: t("sidebar.userManagement"),
      children: [
        { label: t("sidebar.assignTrainingProgram"), path: "/assign-training" },
      ],
    },

    {
      icon: FiBookOpen,
      label: t("sidebar.trainingPrograms"),
      children: [
        { label: t("sidebar.programList"), path: "/programs" },
        // { label: t("sidebar.createProgram"), path: "/create-program" },
        // { label: t("sidebar.programAssignment"), path: "/program-assignment" },
      ],
    },

    {
      icon: FiLayers,
      label: t("sidebar.curriculumManagement"),
      children: [
        { label: t("sidebar.levels"), path: "/levels" },
        { label: t("sidebar.modules"), path: "/modules" },
        { label: t("sidebar.chapters"), path: "/chapters" },
        { label: t("sidebar.topics"), path: "/topics" },
        // { label: t("sidebar.bulkImport"), path: "/bulk-import" },
      ],
    },

    {
      icon: FiFileText,
      label: t("sidebar.contentManagement"),
      children: [
        { label: t("sidebar.learningUnitBuilder"), path: "/learning-unit" },
        {
          label: t("sidebar.interactiveContent"),
          path: "/interactive-content",
        },
        { label: t("sidebar.mediaLibrary"), path: "/media-library" },
      ],
    },

    {
      icon: FiClipboard,
      label: t("sidebar.assessmentManagement"),
      children: [
        { label: t("sidebar.quizForTopic"), path: "/quiz-topic" },
        { label: t("sidebar.examForLevel"), path: "/exam-level" },
        { label: t("sidebar.faq"), path: "/faq" },
      ],
    },

    {
      icon: FiAward,
      label: t("sidebar.trainingCertification"),
      children: [
        { label: t("sidebar.trainingAssignment"), path: "/training-assign" },
        { label: t("sidebar.progressTracker"), path: "/progress" },
        { label: t("sidebar.certification"), path: "/certification" },
      ],
    },

    {
      icon: FiBarChart2,
      label: t("sidebar.reportsAdministration"),
      children: [
        { label: t("sidebar.topResult"), path: "/top-result" },
        {
          label: t("sidebar.reportsAnalytics"),
          children: [
            { label: t("sidebar.userAnalytics"), path: "/user-analytics" },
            {
              label: t("sidebar.trainingAnalytics"),
              path: "/training-analytics",
            },
            {
              label: t("sidebar.performanceReports"),
              path: "/performance-reports",
            },
            {
              label: t("sidebar.completionReports"),
              path: "/completion-reports",
            },
          ],
        },
        { label: t("sidebar.rolesPermission"), path: "/roles-permission" },
        { label: t("sidebar.systemSettings"), path: "/system-settings" },
      ],
    },

    {
      icon: FiGlobe,
      label: t("sidebar.multiLanguage"),
      path: "/language",
    },
  ];

  const getFirstChildPath = (item) => {
    if (!item.children) return item.path;
    let current = item.children[0];
    while (current.children) current = current.children[0];
    return current.path;
  };

  const findParents = (items, path, parents = []) => {
    for (let item of items) {
      if (item.path === path) return parents;
      if (item.children) {
        const res = findParents(item.children, path, [...parents, item.label]);
        if (res) return res;
      }
    }
  };

  useEffect(() => {
    const parents = findParents(navItems, location.pathname) || [];
    setOpenParent(parents[0] || null);

    const subObj = {};
    parents.slice(1).forEach((p) => (subObj[p] = true));
    setOpenSubMenus(subObj);
  }, [location.pathname]);

  const toggleParent = (item) => {
    setOpenParent((prev) => (prev === item.label ? null : item.label));
    setOpenSubMenus({});
  };

  const toggleSubMenu = (label) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleClick = (item, level) => {
    if (item.children) {
      if (level === 0) toggleParent(item);
      else toggleSubMenu(item.label);

      navigate(getFirstChildPath(item));
    } else {
      navigate(item.path);
    }
  };

  const getPaddingClass = (level) => {
    return ["pl-4", "pl-10", "pl-14", "pl-18"][level] || "pl-4";
  };

  const getTreeLineLeft = (level) => {
    return ["left-7", "left-7", "left-11", "left-15"][level] || "left-7";
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item, index) => {
      const isParentOpen = openParent === item.label;
      const isSubOpen = openSubMenus[item.label];
      const isOpen = level === 0 ? isParentOpen : isSubOpen;

      const paddingClass = getPaddingClass(level);
      const treeLineLeft = getTreeLineLeft(level);

      if (item.children) {
        return (
          <div
            key={index}
            className={`mb-1 rounded-lg overflow-hidden ${
              isOpen ? "bg-[#2563EB]" : ""
            }`}
          >
            {/* Parent */}
            <div
              onClick={() => handleClick(item, level)}
              className={`flex items-center justify-between cursor-pointer transition-all duration-200
              ${level === 0 ? "px-4 py-2" : `${paddingClass} py-1`}
              ${
                isOpen
                  ? "text-white"
                  : level > 0
                    ? "text-gray-100 hover:text-white hover:bg-blue-500"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {level === 0 && item.icon && <item.icon size={18} />}
                <span className="text-[13px]">{item.label}</span>
              </div>
              <FiChevronRight
                className={`transition-all duration-300 ${
                  isOpen ? "rotate-90 text-white" : "text-gray-400"
                }`}
              />
            </div>

            {/* Children */}
            {isOpen && (
              <div className="relative pb-1">
                {level === 0 && (
                  <span className="absolute top-0 h-full w-px bg-white/40 left-7"></span>
                )}
                {renderMenu(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={index}
          onClick={() => handleClick(item, level)}
          className={`relative cursor-pointer transition-all duration-200
          ${level === 0 ? "px-4 flex items-center gap-3 py-2" : `${paddingClass} py-0`}
          ${
            location.pathname === item.path
              ? "bg-[#2563EB] text-white rounded-lg"
              : level > 0
                ? "text-gray-100 hover:text-white hover:bg-blue-500"
                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          {level === 0 && item.icon && <item.icon size={18} />}

          {level > 0 && (
            <span
              className={`absolute top-0 h-full w-px bg-white/40 ${treeLineLeft}`}
            ></span>
          )}

          <span className="text-[13px]">{item.label}</span>
        </div>
      );
    });
  };

  return (
    // <div className="w-[256px] bg-[#ECEFF4] border-r border-gray-200 flex flex-col h-full shadow-lg">
    //   {/* Menu */}
    //   <nav className="flex-1 p-3 overflow-y-auto hide-scrollbar">
    //     {renderMenu(navItems)}
    //   </nav>

    //   {/* Logout */}
    //   <div className="border-t border-gray-200 p-4">
    //     <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg">
    //       <FiLogOut size={18} />
    //       {t("sidebar.logout")}
    //     </button>
    //   </div>
    // </div>

    <>
      {/* 🔲 Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 📦 Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          w-[256px] bg-[#ECEFF4] border-r border-gray-200 flex flex-col shadow-lg
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Menu */}
        <nav className="flex-1 p-3 overflow-y-auto hide-scrollbar">
          {renderMenu(navItems)}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg">
            <FiLogOut size={18} />
            {t("sidebar.logout")}
          </button>
        </div>

        {/* Scrollbar */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .hide-scrollbar-track {
            background: #e2e8f0;
          }
          .hide-scrollbar-thumb {
            background: #cbd5e1;
          }
        `}</style>
      </div>
    </>
  );
};

export default AdminSidebar;

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiGrid,
//   FiUsers,
//   FiBookOpen,
//   FiLayers,
//   FiFileText,
//   FiClipboard,
//   FiAward,
//   FiBarChart2,
//   FiGlobe,
//   FiLogOut,
//   FiChevronRight,
// } from "react-icons/fi";

// const AdminSidebar = ({ isOpen, onClose }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [openParent, setOpenParent] = useState(null);
//   const [openSubMenus, setOpenSubMenus] = useState({});

//   const navItems = [
//     { icon: FiGrid, label: t("sidebar.dashboard"), path: "/dashboard" },

//     {
//       icon: FiUsers,
//       label: t("sidebar.userManagement"),
//       children: [
//         { label: t("sidebar.assignTrainingProgram"), path: "/assign-training" },
//       ],
//     },

//     {
//       icon: FiBookOpen,
//       label: t("sidebar.trainingPrograms"),
//       children: [
//         { label: t("sidebar.programList"), path: "/program-list" },
//         { label: t("sidebar.createProgram"), path: "/create-program" },
//         { label: t("sidebar.programAssignment"), path: "/program-assignment" },
//       ],
//     },

//     {
//       icon: FiLayers,
//       label: t("sidebar.curriculumManagement"),
//       children: [
//         { label: t("sidebar.levels"), path: "/levels" },
//         { label: t("sidebar.modules"), path: "/modules" },
//         { label: t("sidebar.chapters"), path: "/chapters" },
//         { label: t("sidebar.topics"), path: "/topics" },
//         { label: t("sidebar.bulkImport"), path: "/bulk-import" },
//       ],
//     },

//     {
//       icon: FiFileText,
//       label: t("sidebar.contentManagement"),
//       children: [
//         { label: t("sidebar.learningUnitBuilder"), path: "/learning-unit" },
//         {
//           label: t("sidebar.interactiveContent"),
//           path: "/interactive-content",
//         },
//         { label: t("sidebar.mediaLibrary"), path: "/media-library" },
//       ],
//     },

//     {
//       icon: FiClipboard,
//       label: t("sidebar.assessmentManagement"),
//       children: [
//         { label: t("sidebar.quizForTopic"), path: "/quiz-topic" },
//         { label: t("sidebar.examForLevel"), path: "/exam-level" },
//         { label: t("sidebar.faq"), path: "/faq" },
//       ],
//     },

//     {
//       icon: FiAward,
//       label: t("sidebar.trainingCertification"),
//       children: [
//         { label: t("sidebar.trainingAssignment"), path: "/training-assign" },
//         { label: t("sidebar.progressTracker"), path: "/progress" },
//         { label: t("sidebar.certification"), path: "/certification" },
//       ],
//     },

//     {
//       icon: FiBarChart2,
//       label: t("sidebar.reportsAdministration"),
//       children: [
//         { label: t("sidebar.topResult"), path: "/top-result" },
//         {
//           label: t("sidebar.reportsAnalytics"),
//           children: [
//             { label: t("sidebar.userAnalytics"), path: "/user-analytics" },
//             {
//               label: t("sidebar.trainingAnalytics"),
//               path: "/training-analytics",
//             },
//             {
//               label: t("sidebar.performanceReports"),
//               path: "/performance-reports",
//             },
//             {
//               label: t("sidebar.completionReports"),
//               path: "/completion-reports",
//             },
//           ],
//         },
//         { label: t("sidebar.rolesPermission"), path: "/roles-permission" },
//         { label: t("sidebar.systemSettings"), path: "/system-settings" },
//       ],
//     },

//     {
//       icon: FiGlobe,
//       label: t("sidebar.multiLanguage"),
//       path: "/language",
//     },
//   ];

//   const getFirstChildPath = (item) => {
//     if (!item.children) return item.path;
//     let current = item.children[0];
//     while (current.children) current = current.children[0];
//     return current.path;
//   };

//   const findParents = (items, path, parents = []) => {
//     for (let item of items) {
//       if (item.path === path) return parents;
//       if (item.children) {
//         const res = findParents(item.children, path, [...parents, item.label]);
//         if (res) return res;
//       }
//     }
//   };

//   useEffect(() => {
//     const parents = findParents(navItems, location.pathname) || [];
//     setOpenParent(parents[0] || null);

//     const subObj = {};
//     parents.slice(1).forEach((p) => (subObj[p] = true));
//     setOpenSubMenus(subObj);
//   }, [location.pathname]);

//   const toggleParent = (item) => {
//     setOpenParent((prev) => (prev === item.label ? null : item.label));
//     setOpenSubMenus({});
//   };

//   const toggleSubMenu = (label) => {
//     setOpenSubMenus((prev) => ({
//       ...prev,
//       [label]: !prev[label],
//     }));
//   };

//   const handleClick = (item, level) => {
//     if (item.children) {
//       if (level === 0) toggleParent(item);
//       else toggleSubMenu(item.label);
//       navigate(getFirstChildPath(item));
//     } else {
//       navigate(item.path);
//     }
//   };

//   const getPaddingClass = (level) => {
//     return ["pl-4", "pl-10", "pl-14", "pl-18"][level] || "pl-4";
//   };

//   const getTreeLineLeft = (level) => {
//     return ["left-7", "left-7", "left-11", "left-15"][level] || "left-7";
//   };

//   // Smooth animation variants for submenu
//   const subMenuVariants = {
//     hidden: {
//       opacity: 0,
//       height: 0,
//       transition: {
//         duration: 0.25,
//         ease: "easeInOut",
//       },
//     },
//     visible: {
//       opacity: 1,
//       height: "auto",
//       transition: {
//         duration: 0.3,
//         ease: "easeOut",
//       },
//     },
//   };

//   const renderMenu = (items, level = 0) => {
//     return items.map((item, index) => {
//       const isParentOpen = openParent === item.label;
//       const isSubOpen = openSubMenus[item.label];
//       const isOpen = level === 0 ? isParentOpen : isSubOpen;
//       const isActive = location.pathname === item.path;

//       const paddingClass = getPaddingClass(level);
//       const treeLineLeft = getTreeLineLeft(level);

//       if (item.children) {
//         return (
//           <div key={index} className="mb-1">
//             {/* Parent Item */}
//             <div
//               onClick={() => handleClick(item, level)}
//               className={`flex items-center justify-between cursor-pointer select-none
//               ${level === 0 ? "px-4 py-2" : `${paddingClass} py-1.5`}
//               ${
//                 isOpen
//                   ? "bg-[#2563EB] text-white rounded-lg"
//                   : level > 0
//                     ? "text-gray-700 hover:bg-gray-100 rounded-lg"
//                     : "text-gray-700 hover:bg-gray-100 rounded-lg"
//               } transition-colors duration-200`}
//             >
//               <div className="flex items-center gap-3">
//                 {level === 0 && item.icon && <item.icon size={18} />}
//                 <span className="text-[13px] font-medium">{item.label}</span>
//               </div>
//               <motion.div
//                 animate={{ rotate: isOpen ? 90 : 0 }}
//                 transition={{ duration: 0.25, ease: "easeInOut" }}
//               >
//                 <FiChevronRight size={16} />
//               </motion.div>
//             </div>

//             {/* Children with smooth animation */}
//             <AnimatePresence>
//               {isOpen && (
//                 <motion.div
//                   variants={subMenuVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="hidden"
//                   className="relative overflow-hidden"
//                 >
//                   {level === 0 && (
//                     <span className="absolute top-0 h-full w-px bg-gray-300 left-7"></span>
//                   )}
//                   <div className="pt-1 pb-1">
//                     {renderMenu(item.children, level + 1)}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         );
//       }

//       return (
//         <div
//           key={index}
//           onClick={() => handleClick(item, level)}
//           className={`relative cursor-pointer select-none transition-colors duration-200
//           ${level === 0 ? "px-4 flex items-center gap-3 py-2" : `${paddingClass} py-1.5`}
//           ${
//             isActive
//               ? "bg-[#2563EB] text-white rounded-lg"
//               : level > 0
//                 ? "text-gray-700 hover:bg-gray-100 rounded-lg"
//                 : "text-gray-700 hover:bg-gray-100 rounded-lg"
//           }`}
//         >
//           {level === 0 && item.icon && <item.icon size={18} />}

//           {level > 0 && (
//             <span
//               className={`absolute top-0 h-full w-px bg-gray-300 ${treeLineLeft}`}
//             ></span>
//           )}

//           <span className="text-[13px] font-medium">{item.label}</span>
//         </div>
//       );
//     });
//   };

//   return (
//     <>
//       {/* Overlay — mobile ke liye */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed lg:static top-0 left-0 z-50 h-full
//           w-[256px] bg-[#ECEFF4] border-r border-gray-200 flex flex-col
//           transform transition-transform duration-300
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         {/* Menu */}
//         <nav className="flex-1 p-3 overflow-y-auto hide-scrollbar">
//           {renderMenu(navItems)}
//         </nav>

//         {/* Logout */}
//         <div className="border-t border-gray-200 p-4">
//           <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
//             <FiLogOut size={18} />
//             {t("sidebar.logout")}
//           </button>
//         </div>

//         {/* Scrollbar styling */}
//         <style jsx>{`
//           .hide-scrollbar::-webkit-scrollbar {
//             width: 4px;
//           }
//           .hide-scrollbar::-webkit-scrollbar-track {
//             background: #e2e8f0;
//             border-radius: 4px;
//           }
//           .hide-scrollbar::-webkit-scrollbar-thumb {
//             background: #cbd5e1;
//             border-radius: 4px;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// };

// export default AdminSidebar;
