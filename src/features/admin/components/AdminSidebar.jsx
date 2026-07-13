import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiGrid,
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiFileText,
  FiClipboard,
  FiBarChart2,
  FiGlobe,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import usePermission from "../../../hooks/usePermission";
import { MdOutlineContactSupport } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slice/authSlice";
import { useToast } from "../common/toast/ToastContext";

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { hasPermission } = usePermission();
  const toast = useToast();

  const { settings, isLoading: settingsLoading } = useSelector(
    (state) => state.systemSetting,
  );

  const [openParent, setOpenParent] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});

  const handleLogout = () => {
    dispatch(logout());
    toast.success(t("navbar.logoutSuccess"));
    navigate("/login");
  };

  const navItems = [
    { icon: FiGrid, label: t("sidebar.dashboard"), path: "/dashboard" },

    {
      icon: FiUsers,
      label: t("sidebar.userManagement"),
      permission: "users.view",
      children: [
        { label: t("sidebar.sales-trainee"), path: "/assign-training" },
        { label: t("sidebar.staff"), path: "/staff" },
      ],
    },

    {
      icon: FiBookOpen,
      label: t("sidebar.trainingPrograms"),
      permission: "programs.view",
      children: [{ label: t("sidebar.programList"), path: "/programs" }],
    },

    {
      icon: FiLayers,
      label: t("sidebar.curriculumManagement"),
      permissions: [
        "levels.view",
        "modules.view",
        "chapters.view",
        "topics.view",
      ],
      children: [
        {
          label: t("sidebar.levels"),
          path: "/levels",
          permission: "levels.view",
        },
        {
          label: t("sidebar.modules"),
          path: "/modules",
          permission: "modules.view",
        },
        {
          label: t("sidebar.chapters"),
          path: "/chapters",
          permission: "chapters.view",
        },
        {
          label: t("sidebar.topics"),
          path: "/topics",
          permission: "topics.view",
        },
      ],
    },

    {
      icon: FiFileText,
      label: t("sidebar.contentManagement"),
      permissions: ["content.view", "faqs.view", "media.view", "imports.logs"],
      children: [
        {
          label: t("sidebar.learningUnitBuilder"),
          path: "/learning-unit",
          permission: "content.view",
        },
        {
          label: t("sidebar.automatedContentImporter"),
          path: "/automated-content-importer",
          permission: "imports.logs",
        },
        {
          label: t("sidebar.mediaLibrary"),
          path: "/media-library",
          permission: "media.view",
        },
        { label: t("sidebar.faq"), path: "/faq", permission: "faqs.view" },
      ],
    },

    {
      icon: FiClipboard,
      label: t("sidebar.assessmentManagement"),
      permissions: ["assessments.view", "feedbacks.view"],
      children: [
        {
          label: t("sidebar.quizForTopic"),
          path: "/assessment",
          permission: "assessments.view",
        },
        {
          label: t("sidebar.quizFeedback"),
          path: "/assessment-feedback",
          permission: "feedbacks.view",
        },
        // {
        //   label: t("sidebar.examForLevel"),
        //   path: "/exam-level",
        //   permission: "assessments.view",
        // },
        // {
        //   label: t("sidebar.examFeedback"),
        //   path: "/exam-feedback",
        //   permission: "feedbacks.view",
        // },
        {
          label: t("sidebar.automatedAssessmentImporter"),
          path: "/automated-assessment-importer",
          permission: "assessments.view",
        },
        {
          label: t("sidebar.moduleExamAssessment"),
          path: "/exam-module",
          permission: "assessments.view",
        },
        {
          label: t("sidebar.moduleExamFeedback"),
          path: "/exam-module-feedback",
          permission: "feedbacks.view",
        },
      ],
    },

    {
      icon: FiBarChart2,
      label: t("sidebar.reportsAdministration"),
      permissions: [
        "contacts.view",
        "reports.audit",
        "reports.progress",
        "reports.assessment",
        "reports.content-status",
        "reports.certifications",
      ],
      children: [
        {
          label: t("sidebar.contactUs"),
          path: "/contact-us-report",
          permission: "contacts.view",
        },
        {
          label: t("sidebar.auditLogsReport"),
          path: "/audit-logs-report",
          permission: "reports.audit",
        },
        {
          label: t("sidebar.userProgressReport"),
          path: "/user-progress-report",
          permission: "reports.progress",
        },
        {
          label: t("sidebar.assessmentReport"),
          path: "/assessment-report",
          permission: "reports.assessment",
        },
        {
          label: t("sidebar.contentStatusReport"),
          path: "/content-status-report",
          permission: "reports.content-status",
        },
        {
          label: t("sidebar.certificationReport"),
          path: "/certification-report",
          permission: "reports.certifications",
        },
      ],
    },

    {
      icon: IoSettingsOutline,
      label: t("sidebar.settings"),
      permissions: [
        "certificate-settings.view",
        "roles.view",
        "designations.view",
        "smtp.view",
        "site-settings.view",
      ],
      children: [
        {
          label: t("sidebar.certificationSetting"),
          path: "/certification-settings",
          permission: "certificate-settings.view",
        },
        {
          label: t("sidebar.rolesPermission"),
          path: "/roles-permission",
          permission: "roles.view",
        },
        {
          label: t("sidebar.designation"),
          path: "/designation",
          permission: "designations.view",
        },
        {
          label: t("sidebar.smtpSetting"),
          path: "/smtp-setting",
          permission: "smtp.view",
        },
        {
          label: t("sidebar.systemSettings"),
          path: "/system-settings",
          permission: "site-settings.view",
        },
      ],
    },

    {
      icon: FiGlobe,
      label: t("sidebar.multiLanguage"),
      permission: "languages.view",
      path: "/language",
    },

    {
      icon: MdOutlineContactSupport,
      label: t("sidebar.support"),
      permission: "support.view",
      path: "/support",
    },
  ];

  const filterMenus = (menus) => {
    return menus
      .filter((item) => {
        // single permission
        if (item.permission) {
          return hasPermission(item.permission);
        }

        // multiple permissions
        if (item.permissions) {
          return item.permissions.some((permission) =>
            hasPermission(permission),
          );
        }

        return true;
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterMenus(item.children) : undefined,
      }));
  };

  const filteredMenus = filterMenus(navItems);

  const getFirstChildPath = (item) => {
    if (!item.children) return item.path;

    let current = item.children[0];

    while (current.children) {
      current = current.children[0];
    }

    return current.path;
  };

  const findParents = (items, path, parents = []) => {
    for (const item of items) {
      if (item.path === path) return parents;

      if (item.children) {
        const result = findParents(item.children, path, [
          ...parents,
          item.label,
        ]);

        if (result) return result;
      }
    }

    return null;
  };

  useEffect(() => {
    const parents = findParents(navItems, location.pathname) || [];

    setOpenParent(parents[0] || null);

    const submenuState = {};
    parents.slice(1).forEach((item) => {
      submenuState[item] = true;
    });

    setOpenSubMenus(submenuState);
  }, [location.pathname]);

  const toggleMenu = (label, level) => {
    if (level === 0) {
      setOpenParent((prev) => (prev === label ? null : label));
      setOpenSubMenus({});
      return;
    }

    setOpenSubMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleClick = (item, level) => {
    if (item.children) {
      toggleMenu(item.label, level);
      navigate(getFirstChildPath(item));
      return;
    }

    navigate(item.path);
  };

  const getPaddingClass = (level) =>
    ["pl-4", "pl-10", "pl-14", "pl-18"][level] || "pl-4";

  const getTreeLineLeft = (level) =>
    ["left-7", "left-7", "left-11", "left-15"][level] || "left-7";

  const renderMenu = (items, level = 0) => {
    return items.map((item, index) => {
      const isOpen =
        level === 0 ? openParent === item.label : openSubMenus[item.label];

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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          w-[256px] bg-[#ECEFF4] border-r border-gray-200 flex flex-col shadow-lg
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo Section - Only visible when sidebar is open on mobile or on desktop */}
        <div className="p-4 border-b border-gray-200 flex justify-center items-center lg:hidden ">
          <div className="flex items-center justify-center">
            {/* <img
              src={settings?.company_logo || ""}
              alt="Logo"
              className="w-[130px] sm:w-[130px] h-[64px] object-cover "
            /> */}
            {settings?.company_logo && (
              <img
                src={settings.company_logo}
                alt="Logo"
                className="w-[130px] sm:w-[130px] h-[64px] object-cover"
              />
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto hide-scrollbar">
          {renderMenu(filteredMenus)}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => handleLogout()}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
          >
            <FiLogOut size={18} />
            {t("sidebar.logout")}
          </button>
        </div>
        <style>{`
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
