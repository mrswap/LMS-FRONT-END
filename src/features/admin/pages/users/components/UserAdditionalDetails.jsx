import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAuditLogs } from "../../../../../redux/slice/reportSlice";
import { getAllUserProgress } from "../../../../../redux/slice/reportSlice";
import { getAllAssessmentReports } from "../../../../../redux/slice/reportSlice";
import { resetUserDevice } from "../../../../../redux/slice/userSlice";
import CustomeTable from "../../../common/table/CustomeTable";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import TruncateText from "../../../common/TruncateText";
import {
  FaEnvelope,
  FaDesktop,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaHistory,
  FaGraduationCap,
  FaClipboardList,
  FaMobile,
  FaLaptop,
  FaTablet,
  FaRedoAlt,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { useToast } from "../../../common/toast/ToastContext";

const ITEMS_PER_PAGE = 10;

const UserAdditionalDetails = ({ id }) => {
  console.log("User ID:", id);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("audit");
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const toast = useToast();

  // Get user loading state from user slice
  const { isLoading: userLoading } = useSelector((state) => state.user);

  // Audit Logs State
  const { auditLogs, loadingAuditLogs } = useSelector((state) => state.report);

  // Progress State
  const { userProgress, loadingUserProgress } = useSelector(
    (state) => state.report,
  );

  // Assessment State
  const { assessmentReports, loadingAssessmentReports } = useSelector(
    (state) => state.report,
  );

  // Fetch data when user id changes
  useEffect(() => {
    if (id) {
      // Fetch Audit Logs
      dispatch(getAllAuditLogs({ user_id: id, per_page: 50 }));

      // Fetch User Progress
      dispatch(getAllUserProgress({ user_id: id, per_page: 50 }));

      // Fetch Assessment Reports
      dispatch(getAllAssessmentReports({ user_id: id, per_page: 50 }));
    }
  }, [id, dispatch]);

  // Reset Device Handler
  const handleResetDevice = async () => {
    setIsResetting(true);
    setShowResetModal(false);

    try {
      const result = await dispatch(resetUserDevice(id)).unwrap();
      toast.success(result.message || "Device reset successful!");

      // Optional: Refresh audit logs to show the reset event
      dispatch(getAllAuditLogs({ user_id: id, per_page: 50 }));
    } catch (error) {
      toast.error(error.message || "Failed to reset device");
      console.error("Reset device error:", error);
    } finally {
      setIsResetting(false);
    }
  };

  // ==================== AUDIT LOGS COLUMNS ====================
  const getEventBadgeColor = (event) => {
    switch (event?.toLowerCase()) {
      case "login":
        return "bg-green-100 text-green-700";
      case "profile_viewed":
        return "bg-blue-100 text-blue-700";
      case "reset_device":
        return "bg-red-100 text-red-700";
      case "chapter_viewed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDeviceIcon = (device) => {
    if (!device) return <MdDevices size={14} />;
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("mobile")) return <FaMobile size={14} />;
    if (deviceLower.includes("tablet")) return <FaTablet size={14} />;
    return <FaDesktop size={14} />;
  };

  const auditColumns = [
    {
      header: "Event",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getEventBadgeColor(row?.event)}`}
        >
          {row?.event?.replaceAll("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: "Description",
      render: (row) => (
        <p className="text-gray-700 text-sm">
          <TruncateText text={row?.description || "-"} maxLength={50} />
        </p>
      ),
    },
    {
      header: "IP Address",
      render: (row) => (
        <p className="text-gray-600 text-sm font-mono">{row?.ip || "-"}</p>
      ),
    },
    {
      header: "Device",
      render: (row) => (
        <p className="text-gray-600 text-sm flex items-center gap-1">
          {getDeviceIcon(row?.device)}
          <TruncateText text={row?.device || "-"} maxLength={25} />
        </p>
      ),
    },
    {
      header: "Date & Time",
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm">
            {new Date(row?.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row?.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  // ==================== PROGRESS COLUMNS ====================
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const progressColumns = [
    {
      header: "Level/Module/Chapter",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row?.level || "-"}</p>
          <p className="text-xs text-gray-500">
            {row?.module} → {row?.chapter}
          </p>
        </div>
      ),
    },
    {
      header: "Topic",
      render: (row) => (
        <p className="text-sm text-gray-700">{row?.topic || "-"}</p>
      ),
    },
    {
      header: "Progress",
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Completion</span>
            <span
              className={`text-xs font-semibold ${row?.completion_percentage === 100 ? "text-green-600" : "text-blue-600"}`}
            >
              {row?.completion_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${row?.completion_percentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.completion_status)}`}
        >
          {row?.completion_status || "Not Started"}
        </span>
      ),
    },
    {
      header: "Last Activity",
      render: (row) => (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <FaClock size={12} />
          <span>
            {row?.last_activity_date
              ? new Date(row?.last_activity_date).toLocaleDateString()
              : "-"}
          </span>
        </div>
      ),
    },
  ];

  // ==================== ASSESSMENT COLUMNS ====================
  const getAssessmentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const assessmentColumns = [
    {
      header: "Assessment",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row?.assessment_name}</p>
          <p className="text-xs text-gray-500">{row?.related_name}</p>
        </div>
      ),
    },
    {
      header: "Score",
      render: (row) => (
        <div>
          <p className="text-gray-700 font-medium">
            {row?.score} / {row?.total_questions}
          </p>
          <p className="text-xs text-gray-500">{row?.percentage}%</p>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row?.status?.toLowerCase() === "passed" ? (
            <FaCheckCircle className="text-green-500" size={16} />
          ) : (
            <FaTimesCircle className="text-red-500" size={16} />
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getAssessmentStatusColor(row?.status)}`}
          >
            {row?.status?.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: "Answers",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-xs text-green-600">
            ✓ Correct: {row?.correct_answers}
          </p>
          <p className="text-xs text-red-600">
            ✗ Incorrect: {row?.incorrect_answers}
          </p>
          <p className="text-xs text-gray-500">⊘ Skipped: {row?.skipped}</p>
        </div>
      ),
    },
    {
      header: "Attempt",
      render: (row) => (
        <p className="text-sm text-gray-700">#{row?.attempt_count}</p>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm">
            {new Date(row?.attempt_date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row?.attempt_date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  // ==================== GET DATA FUNCTIONS ====================
  const getAuditData = () => {
    if (auditLogs?.data) return auditLogs.data;
    if (Array.isArray(auditLogs))
      return auditLogs.filter(
        (log) => log?.user_id === id || log?.user?.id === id,
      );
    return [];
  };

  const getProgressData = () => {
    if (userProgress?.data) return userProgress.data;
    if (Array.isArray(userProgress))
      return userProgress.filter((progress) => progress?.user_id === id);
    return [];
  };

  const getAssessmentData = () => {
    if (assessmentReports?.data) return assessmentReports.data;
    if (Array.isArray(assessmentReports))
      return assessmentReports.filter(
        (assessment) => assessment?.user_id === id,
      );
    return [];
  };

  const isLoading = () => {
    if (activeTab === "audit") return loadingAuditLogs;
    if (activeTab === "progress") return loadingUserProgress;
    return loadingAssessmentReports;
  };

  const getCurrentData = () => {
    if (activeTab === "audit") return getAuditData();
    if (activeTab === "progress") return getProgressData();
    return getAssessmentData();
  };

  const getCurrentColumns = () => {
    if (activeTab === "audit") return auditColumns;
    if (activeTab === "progress") return progressColumns;
    return assessmentColumns;
  };

  const getTabCount = () => {
    if (activeTab === "audit") return getAuditData().length;
    if (activeTab === "progress") return getProgressData().length;
    return getAssessmentData().length;
  };

  const tabs = [
    { id: "audit", label: "Audit Logs", icon: <FaHistory size={16} /> },
    { id: "progress", label: "Progress", icon: <FaGraduationCap size={16} /> },
    {
      id: "assessment",
      label: "Assessments",
      icon: <FaClipboardList size={16} />,
    },
  ];

  if (isLoading() && !getCurrentData().length) {
    return (
      <div className="p-6 border border-gray-300 rounded-lg bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        {/* Header with Reset Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <MdDevices className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              User Activity Details
            </h3>
          </div>

          {/* Reset Device Button */}
          <button
            onClick={() => setShowResetModal(true)}
            disabled={isResetting || userLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isResetting || userLoading
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
              }`}
          >
            <FaRedoAlt className={`${isResetting ? "animate-spin" : ""}`} />
            {isResetting ? "Resetting..." : "Reset All Devices"}
          </button>
        </div>

        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}`}
              >
                {getTabCount()}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {getCurrentData().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}{" "}
                found for this user
              </p>
            </div>
          ) : (
            <CustomeTable
              columns={getCurrentColumns()}
              data={getCurrentData()}
              serverSide={false}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Reset User Devices
                </h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This action will log the user out from all devices and
                    active sessions.
                  </p>
                </div>

                <p className="text-gray-700">
                  Are you sure you want to reset devices for this user?
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>User will be logged out from all devices</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>All active sessions will be terminated</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>User will need to login again on all devices</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">
                    This action will be recorded in the audit logs for security
                    purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDevice}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaRedoAlt size={14} />
                Yes, Reset Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAdditionalDetails;
