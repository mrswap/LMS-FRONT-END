import { useEffect } from "react";
import {
  FaStar,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaChartLine,
  FaRegStar,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import { getAssessmentFeedbackById } from "../../../../../../../redux/slice/assissmentSlice";
import Loader from "../../../../../common/Loader";
import Error from "../../../../../common/Error";
import { PageBody, PageLayout } from "../../../../../common/layout";

const ModuleExamFeedbackDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { singleFeedback, isLoading, isError, message } = useSelector(
    (state) => state.assessment,
  );

  const feedbackData = singleFeedback?.data || singleFeedback;

  useEffect(() => {
    dispatch(getAssessmentFeedbackById(id));
  }, [dispatch, id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400" size={18} />
        ) : (
          <FaRegStar key={i} className="text-gray-300" size={18} />
        ),
      );
    }
    return stars;
  };

  const getScoreColor = (percentage) => {
    const score = parseFloat(percentage);
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: t("examFeedback.breadcrumb.list"), path: "/exam-feedback" },
          { label: t("examFeedback.breadcrumb.details") },
        ]}
      />

      <PageBody>
        {feedbackData && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {feedbackData.assessment?.title ||
                      t("examFeedback.details.feedbackDetails")}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("examFeedback.details.assessmentType")}:{" "}
                    <span className="capitalize">
                      {feedbackData.assessment?.type}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(feedbackData.rating)}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    ({feedbackData.rating}/5)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t("examFeedback.details.userInformation")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FaUser size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("examFeedback.details.name")}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {feedbackData.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("examFeedback.details.email")}
                      </p>
                      <p className="text-sm text-gray-800">
                        {feedbackData.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t("examFeedback.details.assessmentDetails")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MdQuiz size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("examFeedback.details.assessmentId")}
                      </p>
                      <p className="text-sm text-gray-800">
                        #{feedbackData.assessment?.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChartLine size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("examFeedback.details.status")}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          feedbackData.attempt?.status === "passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t(
                          `examFeedback.status.${feedbackData.attempt?.status || "na"}`,
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGraduationCap size={14} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("examFeedback.details.score")}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {feedbackData.attempt?.score} /{" "}
                        {feedbackData.attempt?.total_score || 100}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded ${getScoreColor(
                        feedbackData.attempt?.percentage,
                      )}`}
                    >
                      <FaChartLine size={12} />
                      <p className="text-sm font-medium">
                        {feedbackData.attempt?.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t("examFeedback.details.review")}
                </h3>
                <div className="bg-gray-50 px-4 py-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    {feedbackData.review || t("examFeedback.noReview")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={14} />
                    <span>
                      {new Date(feedbackData.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock size={14} />
                    <span>
                      {new Date(feedbackData.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageBody>
    </PageLayout>
  );
};

export default ModuleExamFeedbackDetails;
