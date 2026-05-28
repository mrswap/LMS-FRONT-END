import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAuditLogs } from "../../../../../redux/slice/reportSlice";
import { getAllUserProgress } from "../../../../../redux/slice/reportSlice";
import { getAllAssessmentReports } from "../../../../../redux/slice/reportSlice";
import { getAllCertifications } from "../../../../../redux/slice/reportSlice";
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
  FaQuestionCircle,
  FaFileAlt,
  FaCertificate,
  FaCalendarAlt,
  FaIdCard,
  FaPercent,
} from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import { useToast } from "../../../common/toast/ToastContext";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const UserAdditionalDetails = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("audit");
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const toast = useToast();
  const { hasPermission } = usePermission();

  const {
    isLoading: userLoading,
    isError,
    message,
  } = useSelector((state) => state.user);
  const { auditLogs, loadingAuditLogs } = useSelector((state) => state.report);
  const { userProgress, loadingUserProgress } = useSelector(
    (state) => state.report,
  );
  const { assessmentReports, loadingAssessmentReports } = useSelector(
    (state) => state.report,
  );
  const { certifications, loadingCertifications } = useSelector(
    (state) => state.report,
  );

  const [quizAssessments, setQuizAssessments] = useState([]);
  const [examAssessments, setExamAssessments] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingExam, setLoadingExam] = useState(false);
  const [userCertifications, setUserCertifications] = useState([]);
  const [loadingUserCertifications, setLoadingUserCertifications] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getAllAuditLogs({ user_id: id }));
      dispatch(getAllUserProgress({ user_id: id }));
      fetchQuizAssessments();
      fetchExamAssessments();
      fetchUserCertifications();
    }
  }, [id, dispatch]);

  const fetchQuizAssessments = async () => {
    setLoadingQuiz(true);
    try {
      const response = await dispatch(
        getAllAssessmentReports({
          user_id: id,
          type: "topic",
        }),
      ).unwrap();
      setQuizAssessments(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching quiz assessments:", error);
      setQuizAssessments([]);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const fetchExamAssessments = async () => {
    setLoadingExam(true);
    try {
      const response = await dispatch(
        getAllAssessmentReports({
          user_id: id,
          type: "module",
        }),
      ).unwrap();
      setExamAssessments(response?.data?.data || []);
    } finally {
      setLoadingExam(false);
    }
  };

  const fetchUserCertifications = async () => {
    setLoadingUserCertifications(true);
    try {
      const response = await dispatch(
        getAllCertifications({
          user_id: id,
        }),
      ).unwrap();
      setUserCertifications(response?.data?.data || []);
    } finally {
      setLoadingUserCertifications(false);
    }
  };

  const handleResetDevice = async () => {
    setIsResetting(true);
    setShowResetModal(false);

    try {
      const result = await dispatch(resetUserDevice(id)).unwrap();
      toast.success(result.message || t("userAdditionalDetails.resetSuccess"));
      dispatch(getAllAuditLogs({ user_id: id, per_page: 50 }));
    } catch (error) {
      toast.error(error.message || t("userAdditionalDetails.resetFailed"));
      console.error("Reset device error:", error);
    } finally {
      setIsResetting(false);
    }
  };

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
      header: t("userAdditionalDetails.audit.event"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getEventBadgeColor(row?.event)}`}
        >
          {row?.event?.replaceAll("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: t("userAdditionalDetails.audit.description"),
      render: (row) => (
        <p className="text-gray-700 text-sm">
          <TruncateText text={row?.description || "-"} maxLength={25} />
        </p>
      ),
    },
    {
      header: t("userAdditionalDetails.audit.ipAddress"),
      render: (row) => (
        <p className="text-gray-600 text-sm font-mono">{row?.ip || "-"}</p>
      ),
    },
    {
      header: t("userAdditionalDetails.audit.device"),
      render: (row) => (
        <p className="text-gray-600 text-sm flex items-center gap-1">
          {getDeviceIcon(row?.device)}
          <TruncateText text={row?.device || "-"} maxLength={25} />
        </p>
      ),
    },
    {
      header: t("userAdditionalDetails.audit.dateTime"),
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
      header: t("userAdditionalDetails.progress.level"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.level || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.progress.module"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.module || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.progress.chapter"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.chapter || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.progress.topic"),
      render: (row) => (
        <p className="text-sm text-gray-700">
          <TruncateText text={row?.topic || "-"} maxLength={25} />
        </p>
      ),
    },
    {
      header: t("userAdditionalDetails.progress.progress"),
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">
              {t("userAdditionalDetails.progress.completion")}
            </span>
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
      header: t("userAdditionalDetails.progress.status"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.completion_status)}`}
        >
          {row?.completion_status ||
            t("userAdditionalDetails.progress.notStarted")}
        </span>
      ),
    },
    {
      header: t("userAdditionalDetails.progress.lastActivity"),
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
      header: t("userAdditionalDetails.assessment.assessment"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.assessment_name} maxLength={25} />
          </p>
          <p className="text-xs text-gray-500">
            <TruncateText text={row?.related_name} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.assessment.score"),
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
      header: t("userAdditionalDetails.assessment.status"),
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
      header: t("userAdditionalDetails.assessment.answers"),
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-xs text-green-600">
            ✓ {t("userAdditionalDetails.assessment.correct")}:{" "}
            {row?.correct_answers}
          </p>
          <p className="text-xs text-red-600">
            ✗ {t("userAdditionalDetails.assessment.incorrect")}:{" "}
            {row?.incorrect_answers}
          </p>
          <p className="text-xs text-gray-500">
            ⊘ {t("userAdditionalDetails.assessment.skipped")}: {row?.skipped}
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.assessment.attempt"),
      render: (row) => (
        <p className="text-sm text-gray-700">#{row?.attempt_count}</p>
      ),
    },
    {
      header: t("userAdditionalDetails.assessment.date"),
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
    {
      header: t("userAdditionalDetails.assessment.action"),
      render: (row) => {
        const certificateAvailable =
          row?.status?.toLowerCase()?.trim() === "passed" &&
          row?.passed_attempt_id;

        return (
          <div>
            {certificateAvailable ? (
              <button
                onClick={() =>
                  navigate(`/certificate/${row?.passed_attempt_id}`)
                }
                className="px-3 py-1 text-xs font-semibold cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
              >
                {t("userAdditionalDetails.assessment.viewCertificate")}
              </button>
            ) : (
              <span className="text-xs text-gray-400 italic">—</span>
            )}
          </div>
        );
      },
    },
  ];

  const getCertificationStatusBadgeColor = (status) => {
    if (status?.toLowerCase() === "active") {
      return "bg-green-100 text-green-700";
    }
    return "bg-red-100 text-red-700";
  };

  const getCertificationStatusIcon = (status) => {
    if (status?.toLowerCase() === "active") {
      return <FaCheckCircle className="text-green-500" />;
    }
    return <FaTimesCircle className="text-red-500" />;
  };

  const getTypeBadgeColor = (type) => {
    if (type?.toLowerCase() === "topic") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-purple-100 text-purple-700";
  };

  const certificationColumns = [
    {
      header: t("userAdditionalDetails.certification.certificateId"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800 flex items-center gap-2">
            <FaCertificate className="text-blue-500" />
            {row?.certificate_id || "-"}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FaIdCard size={10} />
            {t("userAdditionalDetails.certification.id")}: {row?.certificate_id}
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.certification.type"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(row?.type)}`}
        >
          {row?.type?.toUpperCase() || "-"}
        </span>
      ),
    },
    {
      header: t("userAdditionalDetails.certification.topicModule"),
      render: (row) => (
        <p className="font-medium text-gray-800">
          {row?.type === "topic"
            ? row?.topic
            : row?.type === "module"
              ? row?.module
              : "-"}
        </p>
      ),
    },
    {
      header: t("userAdditionalDetails.certification.percentage"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <FaPercent className="text-gray-400" size={12} />
          <p className="text-sm text-gray-600">{row?.percentage || 0}%</p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.certification.issueDate"),
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <FaCalendarAlt size={12} />
            {row?.certificate_issue_date
              ? new Date(row?.certificate_issue_date).toLocaleDateString()
              : "-"}
          </p>
          <p className="text-xs text-gray-400">
            {row?.certificate_issue_date
              ? new Date(row?.certificate_issue_date).toLocaleTimeString()
              : "-"}
          </p>
        </div>
      ),
    },
    {
      header: t("userAdditionalDetails.certification.status"),
      render: (row) => (
        <div className="flex items-center gap-2">
          {getCertificationStatusIcon(row?.certificate_status)}
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getCertificationStatusBadgeColor(row?.certificate_status)}`}
          >
            {row?.certificate_status?.toUpperCase() || "-"}
          </span>
        </div>
      ),
    },
  ];

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

  const getQuizData = () => {
    return quizAssessments;
  };

  const getExamData = () => {
    return examAssessments;
  };

  const getCertificationData = () => {
    return userCertifications;
  };

  const isLoading = () => {
    if (activeTab === "audit") return loadingAuditLogs;
    if (activeTab === "progress") return loadingUserProgress;
    if (activeTab === "quizassessment") return loadingQuiz;
    if (activeTab === "examassessment") return loadingExam;
    if (activeTab === "certification") return loadingUserCertifications;
    return loadingAssessmentReports;
  };

  const getCurrentData = () => {
    if (activeTab === "audit") return getAuditData();
    if (activeTab === "progress") return getProgressData();
    if (activeTab === "quizassessment") return getQuizData();
    if (activeTab === "examassessment") return getExamData();
    if (activeTab === "certification") return getCertificationData();
    return [];
  };

  const getCurrentColumns = () => {
    if (activeTab === "audit") return auditColumns;
    if (activeTab === "progress") return progressColumns;
    if (activeTab === "certification") return certificationColumns;
    return assessmentColumns;
  };

  const tabs = [
    {
      id: "audit",
      label: t("userAdditionalDetails.tabs.auditLogs"),
      icon: <FaHistory size={16} />,
    },
    {
      id: "progress",
      label: t("userAdditionalDetails.tabs.progress"),
      icon: <FaGraduationCap size={16} />,
    },
    {
      id: "quizassessment",
      label: t("userAdditionalDetails.tabs.quizAssessment"),
      icon: <FaQuestionCircle size={16} />,
    },
    {
      id: "examassessment",
      label: t("userAdditionalDetails.tabs.examAssessment"),
      icon: <FaFileAlt size={16} />,
    },
    {
      id: "certification",
      label: t("userAdditionalDetails.tabs.certifications"),
      icon: <FaCertificate size={16} />,
    },
  ];

  if (isLoading() && !getCurrentData().length) {
    return (
      <div className="p-6 border border-gray-300 rounded-lg bg-white">
        <Loader />
      </div>
    );
  }

  if (isError) return <Error message={message} />;

  return (
    <>
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <MdDevices className="text-blue-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {t("userAdditionalDetails.userActivityDetails")}
            </h3>
          </div>

          {hasPermission("users.reset-device") && (
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
              {isResetting
                ? t("userAdditionalDetails.resetting")
                : t("userAdditionalDetails.resetAllDevices")}
            </button>
          )}
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          {getCurrentData().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                {t("userAdditionalDetails.noDataFound")}{" "}
                {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}
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

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("userAdditionalDetails.modal.title")}
                </h3>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ {t("userAdditionalDetails.modal.warning")}
                  </p>
                </div>

                <p className="text-gray-700">
                  {t("userAdditionalDetails.modal.confirmMessage")}
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>{t("userAdditionalDetails.modal.effect1")}</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>{t("userAdditionalDetails.modal.effect2")}</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="mt-1">
                      <FaCheckCircle size={12} className="text-red-500" />
                    </div>
                    <p>{t("userAdditionalDetails.modal.effect3")}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">
                    {t("userAdditionalDetails.modal.auditNote")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("userAdditionalDetails.modal.cancel")}
              </button>
              <button
                onClick={handleResetDevice}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FaRedoAlt size={14} />
                {t("userAdditionalDetails.modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAdditionalDetails;
