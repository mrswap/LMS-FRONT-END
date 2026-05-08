import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../../../redux/slice/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBook,
  FaLayerGroup,
  FaTh,
  FaFileAlt,
  FaQuestionCircle,
  FaChartLine,
  FaChartBar,
  FaCalendarAlt,
  FaEye,
  FaBolt,
  FaExclamationTriangle,
  FaSpinner,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaGraduationCap,
} from "react-icons/fa";
import { MdDashboard, MdPieChart } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import {
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageLayout,
  PageSubtitle,
  PageTitle,
} from "../../common/layout";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dashboardData, isLoading, isError, message } = useSelector(
    (state) => state.dashboard,
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getDashboardData());
    setTimeout(() => setRefreshing(false), 500);
  };

  if (isLoading) return <Loader />;

  if (isError) return <Error message={message} />;

  const data = dashboardData || {};
  const overview = data.overview || {};
  const funnel = data.learning_funnel || {};
  const engagement = data.engagement || {};
  const pipeline = data.publishing_pipeline || {};
  const assessment = data.assessment_analytics || {};
  const programAnalytics = data.program_analytics || [];
  const riskIndicators = data.risk_indicators || {};

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {value?.toLocaleString() || 0}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <FaArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <FaArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span
                className={`text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const PublishingCard = ({
    title,
    published,
    draft,
    unpublished,
    icon: Icon,
  }) => {
    const total = published + draft + unpublished;
    const publishedPercent = total > 0 ? (published / total) * 100 : 0;
    const draftPercent = total > 0 ? (draft / total) * 100 : 0;
    const unpublishedPercent = total > 0 ? (unpublished / total) * 100 : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-700">{title}</h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {t("dashboard.total")}: {total}
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-600">{t("dashboard.published")}</span>
              <span className="font-semibold text-gray-700">{published}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${publishedPercent}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-yellow-600">{t("dashboard.draft")}</span>
              <span className="font-semibold text-gray-700">{draft}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${draftPercent}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">
                {t("dashboard.unpublished")}
              </span>
              <span className="font-semibold text-gray-700">{unpublished}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gray-400 rounded-full h-2 transition-all duration-500"
                style={{ width: `${unpublishedPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("dashboard.title")}</PageTitle>
          <PageSubtitle>{t("dashboard.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
          >
            <FaSyncAlt
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="text-sm">{t("dashboard.refresh")}</span>
          </button>
        </PageHeaderRight>
      </PageHeader>
      <PageBody>
        <div className="text-right text-xs text-gray-400 mb-6">
          {t("dashboard.lastUpdated")}: {new Date().toLocaleString()}
        </div>

        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartBar className="w-5 h-5 text-gray-600" />
            {t("dashboard.overview")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <StatCard
              title={t("dashboard.totalUsers")}
              value={overview.total_users}
              icon={FaUsers}
              color="bg-blue-500"
            />
            <StatCard
              title={t("dashboard.activeUsers")}
              value={overview.active_users}
              icon={FaUserCheck}
              color="bg-green-500"
            />
            <StatCard
              title={t("dashboard.totalPrograms")}
              value={overview.total_programs}
              icon={FaBook}
              color="bg-purple-500"
            />
            <StatCard
              title={t("dashboard.totalModules")}
              value={overview.total_modules}
              icon={FaLayerGroup}
              color="bg-indigo-500"
            />
            <StatCard
              title={t("dashboard.totalChapters")}
              value={overview.total_chapters}
              icon={FaTh}
              color="bg-pink-500"
            />
            <StatCard
              title={t("dashboard.totalTopics")}
              value={overview.total_topics}
              icon={FaFileAlt}
              color="bg-orange-500"
            />
            <StatCard
              title={t("dashboard.totalContents")}
              value={overview.total_contents}
              icon={FaEye}
              color="bg-teal-500"
            />
            <StatCard
              title={t("dashboard.totalAssessments")}
              value={overview.total_assessments}
              icon={FaQuestionCircle}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Learning Funnel & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Learning Funnel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaGraduationCap className="w-5 h-5 text-gray-600" />
              {t("dashboard.learningFunnel")}
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: t("dashboard.notStarted"),
                  value: funnel.not_started_users,
                  color: "bg-gray-400",
                  textColor: "text-gray-600",
                },
                {
                  label: t("dashboard.started"),
                  value: funnel.started_users,
                  color: "bg-blue-500",
                  textColor: "text-blue-600",
                },
                {
                  label: t("dashboard.inProgress"),
                  value: funnel.in_progress_users,
                  color: "bg-yellow-500",
                  textColor: "text-yellow-600",
                },
                {
                  label: t("dashboard.completed"),
                  value: funnel.completed_users,
                  color: "bg-green-500",
                  textColor: "text-green-600",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className={`font-semibold ${item.textColor}`}>
                      {item.value?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} rounded-full h-2 transition-all duration-500`}
                      style={{
                        width: `${(item.value / Math.max(1, overview.total_users)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <GiProgression className="w-5 h-5 text-gray-600" />
              {t("dashboard.engagementMetrics")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.dailyActive")}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {engagement.daily_active_users?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.weeklyActive")}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {engagement.weekly_active_users?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <FaCalendarAlt className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.monthlyActive")}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {engagement.monthly_active_users?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <FaEye className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.contentReadsToday")}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {engagement.content_reads_today?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Pipeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBolt className="w-5 h-5 text-gray-600" />
            {t("dashboard.publishingPipeline")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <PublishingCard
              title={t("dashboard.programs")}
              published={pipeline.programs?.published || 0}
              draft={pipeline.programs?.draft || 0}
              unpublished={pipeline.programs?.unpublished || 0}
              icon={FaBook}
            />
            <PublishingCard
              title={t("dashboard.levels")}
              published={pipeline.levels?.published || 0}
              draft={pipeline.levels?.draft || 0}
              unpublished={pipeline.levels?.unpublished || 0}
              icon={FaLayerGroup}
            />
            <PublishingCard
              title={t("dashboard.modules")}
              published={pipeline.modules?.published || 0}
              draft={pipeline.modules?.draft || 0}
              unpublished={pipeline.modules?.unpublished || 0}
              icon={FaTh}
            />
            <PublishingCard
              title={t("dashboard.chapters")}
              published={pipeline.chapters?.published || 0}
              draft={pipeline.chapters?.draft || 0}
              unpublished={pipeline.chapters?.unpublished || 0}
              icon={FaFileAlt}
            />
            <PublishingCard
              title={t("dashboard.topics")}
              published={pipeline.topics?.published || 0}
              draft={pipeline.topics?.draft || 0}
              unpublished={pipeline.topics?.unpublished || 0}
              icon={FaQuestionCircle}
            />
            <PublishingCard
              title={t("dashboard.contents")}
              published={pipeline.contents?.published || 0}
              draft={pipeline.contents?.draft || 0}
              unpublished={pipeline.contents?.unpublished || 0}
              icon={FaEye}
            />
          </div>
        </div>

        {/* Assessment Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MdPieChart className="w-5 h-5 text-gray-600" />
              {t("dashboard.assessmentAnalytics")}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.totalAttempts")}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {assessment.total_attempts?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.passRate")}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {assessment.pass_rate || 0}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.avgScore")}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {assessment.avg_score || 0}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  {t("dashboard.topicQuizAvg")}
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {assessment.topic_quiz_avg || 0}%
                </p>
              </div>
            </div>

            {assessment.most_failed_assessments &&
              assessment.most_failed_assessments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                    {t("dashboard.mostFailedAssessments")}
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {assessment.most_failed_assessments
                      .slice(0, 5)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-600 font-medium">
                            {item.title} ({item.type})
                          </span>
                          <span className="text-red-600 font-semibold">
                            {item.fail_count} {t("dashboard.fails")}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>

          {/* Risk Indicators */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="w-5 h-5 text-gray-600" />
              {t("dashboard.riskIndicators")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <FaUserTimes className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    {t("dashboard.inactiveUsers")}
                  </span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {riskIndicators.inactive_users_7_days?.toLocaleString() || 0}
                </span>
              </div>

              {riskIndicators.programs_with_high_drafts &&
                riskIndicators.programs_with_high_drafts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">
                      {t("dashboard.programsWithHighDrafts")}
                    </h3>
                    <div className="space-y-2">
                      {riskIndicators.programs_with_high_drafts.map(
                        (program, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm p-2 bg-yellow-50 rounded border border-yellow-100"
                          >
                            <span className="text-gray-600 font-medium">
                              {program.title}
                            </span>
                            <span className="text-yellow-600 font-semibold">
                              {program.draft_levels_count}{" "}
                              {t("dashboard.drafts")}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Program Analytics */}
        {programAnalytics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="w-5 h-5 text-gray-600" />
              {t("dashboard.programAnalytics")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programAnalytics.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {program.title}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("dashboard.activeLearners")}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {program.learning?.active_learners?.toLocaleString() ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("dashboard.completionRate")}
                      </span>
                      <span className="font-semibold text-green-600">
                        {program.learning?.completion_rate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-500">
                        {t("dashboard.avgScore")}
                      </span>
                      <span className="font-semibold text-purple-600">
                        {program.assessment?.avg_score || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">
                        {t("dashboard.totalAttempts")}
                      </span>
                      <span className="font-semibold text-orange-600">
                        {program.assessment?.total_attempts?.toLocaleString() ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageBody>
    </PageLayout>
  );
};

export default Dashboard;
