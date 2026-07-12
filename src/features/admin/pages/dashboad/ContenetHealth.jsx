import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContentHealthData,
  clearContentHealth,
} from "../../../../redux/slice/dashboardSlice";
import {
  FiFileText,
  FiClipboard,
  FiAlertCircle,
  FiBookOpen,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiList,
  FiServer,
  FiActivity,
} from "react-icons/fi";

const ContentHealth = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    withoutContent: true,
    quizMissing: true,
    quizWithoutQuestions: true,
    questionsWithoutOptions: true,
    examMissing: true,
    examWithoutQuestions: true,
    moduleQuestionsWithoutOptions: true,
  });

  const {
    contentHealthData,
    contentHealthLoading,
    contentHealthError,
    contentHealthMessage,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getContentHealthData());
    return () => {
      dispatch(clearContentHealth());
    };
  }, [dispatch]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRefresh = () => {
    dispatch(getContentHealthData());
  };

  if (contentHealthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">
          Analyzing content health...
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Please wait while we check everything
        </p>
      </div>
    );
  }

  if (contentHealthError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-12 m-4 text-center shadow-lg">
        <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <FiXCircle className="text-5xl text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-red-700 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">
          {contentHealthMessage || "Unable to load content health data"}
        </p>
        <button
          onClick={handleRefresh}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <FiRefreshCw className="text-lg" />
          Try Again
        </button>
      </div>
    );
  }

  const { data } = contentHealthData || {};
  const { summary, topics, modules } = data || {};

  const totalIssues =
    (summary?.topics_without_content || 0) +
    (summary?.topic_quiz_missing || 0) +
    (summary?.topic_quiz_without_questions || 0) +
    (summary?.module_exam_missing || 0);

  const isHealthy = totalIssues === 0;

  // Summary Cards
  const renderSummaryCards = () => {
    const cards = [
      {
        title: "Topics Without Content",
        value: summary?.topics_without_content || 0,
        icon: FiFileText,
        color: "red",
        gradient: "from-red-500 to-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      },
      {
        title: "Topic Quiz Missing",
        value: summary?.topic_quiz_missing || 0,
        icon: FiClipboard,
        color: "orange",
        gradient: "from-orange-500 to-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
      },
      {
        title: "Quiz Without Questions",
        value: summary?.topic_quiz_without_questions || 0,
        icon: FiAlertCircle,
        color: "yellow",
        gradient: "from-yellow-500 to-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      },
      {
        title: "Module Exam Missing",
        value: summary?.module_exam_missing || 0,
        icon: FiBookOpen,
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-200",
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} border ${card.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold mt-2 text-${card.color}-600`}>
                  {card.value}
                </p>
              </div>
              <div
                className={`bg-gradient-to-br ${card.gradient} rounded-xl p-3 text-white shadow-lg`}
              >
                <card.icon className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({
    icon: Icon,
    title,
    count,
    color,
    section,
    bgColor,
  }) => (
    <div
      className={`${bgColor} px-6 py-4 flex justify-between items-center cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-3">
        <span
          className={`bg-gradient-to-r ${color} text-white px-3 py-1 rounded-full text-sm font-bold min-w-[30px] text-center`}
        >
          {count}
        </span>
        <h3 className={`font-semibold text-${color.split("-")[1]}-700`}>
          {title}
        </h3>
      </div>
      {expandedSections[section] ? (
        <FiChevronDown className={`text-${color.split("-")[1]}-600`} />
      ) : (
        <FiChevronRight className={`text-${color.split("-")[1]}-600`} />
      )}
    </div>
  );

  // Table Component with fixed data mapping
  const DataTable = ({ columns, data, dataKeys }) => {
    // If no data or empty array, show nothing
    if (!data || data.length === 0) {
      return (
        <div className="px-6 py-8 text-center text-gray-500">
          No data available
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr
                key={item.id || item.assessment_id || item.question_id || index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col, idx) => {
                  if (col === "#") {
                    return (
                      <td
                        key={idx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium"
                      >
                        {index + 1}
                      </td>
                    );
                  }

                  // Get the corresponding key for this column
                  const key =
                    dataKeys?.[col] || col.toLowerCase().replace(/ /g, "_");

                  // Get the value from the item
                  let value = item[key];

                  // If value is undefined or null, try to find it with different keys
                  if (value === undefined || value === null) {
                    // Try to find by matching column name with item keys
                    const itemKeys = Object.keys(item);
                    const matchingKey = itemKeys.find(
                      (k) =>
                        k
                          .toLowerCase()
                          .includes(col.toLowerCase().replace(/ /g, "_")) ||
                        col
                          .toLowerCase()
                          .replace(/ /g, "_")
                          .includes(k.toLowerCase()),
                    );
                    if (matchingKey) {
                      value = item[matchingKey];
                    }
                  }

                  // If still undefined, show dash
                  if (value === undefined || value === null) {
                    value = "-";
                  }

                  return (
                    <td
                      key={idx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Topics Section
  const renderTopics = () => {
    const sections = [
      {
        key: "withoutContent",
        title: "Topics Without Content",
        data: topics?.without_content || [],
        color: "from-red-500 to-red-600",
        textColor: "red",
        bgColor: "bg-red-50 hover:bg-red-100",
        columns: ["#", "Topic ID", "Topic Title"],
        dataKeys: {
          "Topic ID": "id",
          "Topic Title": "title",
        },
      },
      {
        key: "quizMissing",
        title: "Topics with Missing Quiz",
        data: topics?.quiz_missing || [],
        color: "from-orange-500 to-orange-600",
        textColor: "orange",
        bgColor: "bg-orange-50 hover:bg-orange-100",
        columns: ["#", "Topic ID", "Topic Title"],
        dataKeys: {
          "Topic ID": "id",
          "Topic Title": "title",
        },
      },
      {
        key: "quizWithoutQuestions",
        title: "Quizzes Without Questions",
        data: topics?.quiz_without_questions || [],
        color: "from-yellow-500 to-yellow-600",
        textColor: "yellow",
        bgColor: "bg-yellow-50 hover:bg-yellow-100",
        columns: [
          "#",
          "Assessment ID",
          "Assessment Title",
          "Topic ID",
          "Topic Title",
        ],
        dataKeys: {
          "Assessment ID": "assessment_id",
          "Assessment Title": "assessment_title",
          "Topic ID": "topic_id",
          "Topic Title": "topic_title",
        },
      },
      {
        key: "questionsWithoutOptions",
        title: "Questions Without Options",
        data: topics?.questions_without_options || [],
        color: "from-purple-500 to-purple-600",
        textColor: "purple",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        columns: ["#", "Question ID", "Question", "Assessment", "Topic"],
        dataKeys: {
          "Question ID": "question_id",
          Question: "question",
          Assessment: "assessment_title",
          Topic: "topic_title",
        },
      },
    ];

    const totalSectionsWithData = sections.filter(
      (s) => s.data.length > 0,
    ).length;

    if (totalSectionsWithData === 0) {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-12 text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FiCheckCircle className="text-5xl text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            All Topics are Healthy!
          </h3>
          <p className="text-green-600">No issues found in any topic section</p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {sections.map((section) => {
          if (section.data.length === 0) return null;
          return (
            <div
              key={section.key}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <SectionHeader
                icon={FiAlertCircle}
                title={section.title}
                count={section.data.length}
                color={section.color}
                section={section.key}
                bgColor={section.bgColor}
              />
              {expandedSections[section.key] && (
                <DataTable
                  columns={section.columns}
                  data={section.data}
                  dataKeys={section.dataKeys}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Modules Section
  const renderModules = () => {
    const sections = [
      {
        key: "examMissing",
        title: "Modules Without Exam",
        data: modules?.exam_missing || [],
        color: "from-red-500 to-red-600",
        textColor: "red",
        bgColor: "bg-red-50 hover:bg-red-100",
        columns: ["#", "Module ID", "Module Title"],
        dataKeys: {
          "Module ID": "id",
          "Module Title": "title",
        },
      },
      {
        key: "examWithoutQuestions",
        title: "Module Exams Without Questions",
        data: modules?.exam_without_questions || [],
        color: "from-yellow-500 to-yellow-600",
        textColor: "yellow",
        bgColor: "bg-yellow-50 hover:bg-yellow-100",
        columns: [
          "#",
          "Assessment ID",
          "Assessment Title",
          "Module ID",
          "Module Title",
        ],
        dataKeys: {
          "Assessment ID": "assessment_id",
          "Assessment Title": "assessment_title",
          "Module ID": "module_id",
          "Module Title": "module_title",
        },
      },
      {
        key: "moduleQuestionsWithoutOptions",
        title: "Module Questions Without Options",
        data: modules?.questions_without_options || [],
        color: "from-purple-500 to-purple-600",
        textColor: "purple",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        columns: ["#", "Question ID", "Question", "Assessment", "Module"],
        dataKeys: {
          "Question ID": "question_id",
          Question: "question",
          Assessment: "assessment_title",
          Module: "module_title",
        },
      },
    ];

    const totalSectionsWithData = sections.filter(
      (s) => s.data.length > 0,
    ).length;

    if (totalSectionsWithData === 0) {
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-12 text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FiCheckCircle className="text-5xl text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            All Modules are Healthy!
          </h3>
          <p className="text-green-600">
            No issues found in any module section
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {sections.map((section) => {
          if (section.data.length === 0) return null;
          return (
            <div
              key={section.key}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <SectionHeader
                icon={FiServer}
                title={section.title}
                count={section.data.length}
                color={section.color}
                section={section.key}
                bgColor={section.bgColor}
              />
              {expandedSections[section.key] && (
                <DataTable
                  columns={section.columns}
                  data={section.data}
                  dataKeys={section.dataKeys}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Health Status Banner */}
      <div
        className={`rounded-2xl p-6 border-2 ${isHealthy ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`rounded-full p-3 ${isHealthy ? "bg-green-100" : "bg-amber-100"}`}
            >
              {isHealthy ? (
                <FiCheckCircle className="text-3xl text-green-600" />
              ) : (
                <FiAlertCircle className="text-3xl text-amber-600" />
              )}
            </div>
            <div>
              <h3
                className={`text-xl font-bold ${isHealthy ? "text-green-700" : "text-amber-700"}`}
              >
                {isHealthy ? "🎉 All Systems Healthy" : "⚠️ Issues Detected"}
              </h3>
              <p
                className={`text-sm ${isHealthy ? "text-green-600" : "text-amber-600"}`}
              >
                {isHealthy
                  ? "Your content is in perfect condition"
                  : `${totalIssues} issue${totalIssues > 1 ? "s" : ""} found that need attention`}
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
          >
            <FiRefreshCw className="text-lg" />
            Refresh
          </button>
        </div>
      </div>

      {renderSummaryCards()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 text-white">
              <FiFileText className="text-lg" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Topics Overview</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Without Content",
                value: summary?.topics_without_content || 0,
                color: "red",
              },
              {
                label: "Quiz Missing",
                value: summary?.topic_quiz_missing || 0,
                color: "orange",
              },
              {
                label: "Quiz Without Questions",
                value: summary?.topic_quiz_without_questions || 0,
                color: "yellow",
              },
              {
                label: "Questions Without Options",
                value: summary?.topic_questions_without_options || 0,
                color: "purple",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-600 text-sm">{item.label}</span>
                <span
                  className={`font-bold text-${item.color}-600 ${item.value === 0 ? "text-green-600" : ""}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2 text-white">
              <FiServer className="text-lg" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Modules Overview
            </h3>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Exam Missing",
                value: summary?.module_exam_missing || 0,
                color: "red",
              },
              {
                label: "Exam Without Questions",
                value: summary?.module_exam_without_questions || 0,
                color: "yellow",
              },
              {
                label: "Questions Without Options",
                value: summary?.module_questions_without_options || 0,
                color: "purple",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-600 text-sm">{item.label}</span>
                <span
                  className={`font-bold text-${item.color}-600 ${item.value === 0 ? "text-green-600" : ""}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen border border-gray-200 p-4 rounded-xl shadow-md">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2.5 text-white shadow-lg">
                <FiActivity className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Content Health
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Monitor content quality and identify issues
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${contentHealthData?.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${contentHealthData?.status ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></span>
              {contentHealthData?.status ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex px-4" role="tablist">
            {[
              { id: "overview", label: "Overview", icon: FiGrid },
              {
                id: "topics",
                label: "Topics",
                icon: FiList,
                badge:
                  (topics?.without_content?.length || 0) +
                  (topics?.quiz_missing?.length || 0) +
                  (topics?.quiz_without_questions?.length || 0),
              },
              {
                id: "modules",
                label: "Modules",
                icon: FiServer,
                badge:
                  (modules?.exam_missing?.length || 0) +
                  (modules?.exam_without_questions?.length || 0),
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 relative ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                role="tab"
              >
                <tab.icon
                  className={`text-lg ${activeTab === tab.id ? "text-blue-600" : ""}`}
                />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "topics" && renderTopics()}
        {activeTab === "modules" && renderModules()}
      </div>
    </div>
  );
};

export default ContentHealth;
