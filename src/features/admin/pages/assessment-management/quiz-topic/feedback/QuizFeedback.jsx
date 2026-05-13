import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../../common/table/CustomeTable";
import { FaStar, FaRegStar, FaUser, FaEye } from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import TruncateText from "../../../../common/TruncateText";
import { getAllAssessmentFeedbacks } from "../../../../../../redux/slice/assissmentSlice";
import { getAllUsers } from "../../../../../../redux/slice/userSlice";
import { getAllAssessments } from "../../../../../../redux/slice/assissmentSlice";
import { LuFilterX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import usePermission from "../../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const QuizFeedback = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assessmentFeedbacks, isLoading, isError, message } = useSelector(
    (state) => state.assessment,
  );

  const { users } = useSelector((state) => state.user);
  const { topics } = useSelector((state) => state.topic);
  const { assessments } = useSelector((state) => state.assessment);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [topic, setTopic] = useState(null);
  const { hasPermission } = usePermission();

  const userOptions = [
    { value: "", label: t("quizFeedback.filters.allUsers") },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  const topicOptions = [
    { value: "", label: t("quizFeedback.filters.alltopics") },
    ...(topics?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const assessmentOptions = [
    { value: "", label: t("quizFeedback.filters.allAssessments") },
    ...(assessments?.data?.map((assessment) => ({
      value: assessment.id,
      label: assessment.title,
      type: assessment.type,
    })) || []),
  ];

  const ratingOptions = [
    { value: "all", label: t("quizFeedback.filters.allRatings") },
    { value: "5", label: t("quizFeedback.filters.fiveStars") },
    { value: "4", label: t("quizFeedback.filters.fourStars") },
    { value: "3", label: t("quizFeedback.filters.threeStars") },
    { value: "2", label: t("quizFeedback.filters.twoStars") },
    { value: "1", label: t("quizFeedback.filters.oneStar") },
  ];

  useEffect(() => {
    dispatch(getAllUsers({ limit: 100 }));
    dispatch(getAllAssessments());
    dispatch(getAllTopics());
  }, [dispatch]);

  // Fetch feedbacks with all filters
  const fetchFeedbacks = (overridePage) => {
    const params = {
      search: search || "",
      limit: ITEMS_PER_PAGE,
      page: overridePage ?? page,
      user_id: selectedUser?.value || "",
      rating: selectedRating?.value || "",
      assessment_id: selectedAssessment?.value || "",
      topic_id: topic?.value || "",
      type: "topic",
      //   level_id: selectedLevel?.value !== "all" ? selectedLevel?.value : "",
    };

    dispatch(getAllAssessmentFeedbacks(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchFeedbacks(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedUser, selectedAssessment, selectedRating, topic]);

  useEffect(() => {
    fetchFeedbacks(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSelectedUser(null);
    setSelectedAssessment(null);
    setSelectedRating(null);
    setTopic(null);
    setSearch("");
    setPage(1);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline-block" />);
      } else {
        stars.push(
          <FaRegStar key={i} className="text-gray-300 inline-block" />,
        );
      }
    }
    return stars;
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
    }),
  };

  const columns = [
    {
      header: t("quizFeedback.columns.user"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.user?.name || "-"} maxLength={25} />
          </p>
          <p className="text-xs text-gray-500">
            <TruncateText text={row?.user?.email || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizFeedback.columns.assessment"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.assessment?.title || "-"} maxLength={25} />
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {row?.assessment?.type || t("quizFeedback.quiz")}
          </p>
        </div>
      ),
    },
    {
      header: t("quizFeedback.columns.scorePercentage"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">
            {t("quizFeedback.score")}: {row?.attempt?.score || 0}
          </p>
          <p className="text-xs text-gray-500">
            {t("quizFeedback.percentage")}: {row?.attempt?.percentage || "0"}%
          </p>
        </div>
      ),
    },
    {
      header: t("quizFeedback.columns.rating"),
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex gap-0.5">{renderStarRating(row.rating)}</div>
          <span className="text-sm font-semibold text-gray-700">
            {row.rating}/5
          </span>
        </div>
      ),
    },
    {
      header: t("quizFeedback.columns.date"),
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm">
            {new Date(row.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      header: t("quizFeedback.columns.actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`${row.id}`)}
            className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
            title={t("quizFeedback.actions.viewDetails")}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !assessmentFeedbacks?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("feedbacks.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("quizFeedback.title")}</PageTitle>
          <PageSubtitle>{t("quizFeedback.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight />
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="w-full">
            <div
              className="flex items-center bg-gray-50 border border-gray-200 
              hover:border-blue-500 focus-within:border-blue-500
              rounded-xl px-4 py-2.5 transition-all"
            >
              <FiSearch className="text-gray-400 text-base" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("quizFeedback.searchPlaceholder")}
                className="bg-transparent outline-none px-3 text-sm w-full placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={userOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder={t("quizFeedback.filters.filterByUser")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedAssessment}
                onChange={setSelectedAssessment}
                options={assessmentOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder={t("quizFeedback.filters.filterByAssessment")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedRating}
                onChange={setSelectedRating}
                options={ratingOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("quizFeedback.filters.filterByRating")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={topic}
                onChange={setTopic}
                options={topicOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("quizFeedback.filters.filterByTopic")}
              />
            </div>

            <div className="ml-auto flex items-center h-[40px]">
              <div className="relative group">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer
                  text-gray-500 hover:text-white hover:bg-red-500 transition-all"
                >
                  <LuFilterX size={18} />
                </button>
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-2 py-1 text-xs rounded-md bg-gray-800 text-white
                  opacity-0 group-hover:opacity-100 transition-all duration-200
                  whitespace-nowrap pointer-events-none"
                >
                  {t("quizFeedback.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={assessmentFeedbacks?.data || []}
            serverSide={true}
            currentPage={assessmentFeedbacks?.current_page || 1}
            totalPages={assessmentFeedbacks?.last_page || 1}
            totalItems={assessmentFeedbacks?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default QuizFeedback;
