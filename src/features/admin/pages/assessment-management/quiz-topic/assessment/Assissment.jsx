import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../../common/table/CustomeTable";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTopics,
  updateSingleTopicStatus,
} from "../../../../../../redux/slice/topicSlice";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import TruncateText from "../../../../common/TruncateText";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import StatusToggle from "../../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import {
  getAllAssessments,
  updateSingleAssismentStatus,
} from "../../../../../../redux/slice/assissmentSlice";

const ITEMS_PER_PAGE = 10;

const Assissment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assessments, isLoading, isError, message } = useSelector(
    (state) => state.assessment,
  );

  const { chapters } = useSelector((state) => state.chapter);
  const { modules } = useSelector((state) => state.module);
  const { levels } = useSelector((state) => state.level);
  const { topics } = useSelector((state) => state.topic);

  // States for sequential loading
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const levelOption = [
    { value: "All", label: t("quizAssessment.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: t("quizAssessment.filters.allStatus") },
    { value: "1", label: t("quizAssessment.filters.active") },
    { value: "0", label: t("quizAssessment.filters.inactive") },
  ];

  const [level, setLevel] = useState(levelOption[0]);
  const [module, setModule] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [topic, setTopic] = useState(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const getModuleOptions = () => {
    if (!level || level?.value === "All") {
      return [];
    }
    const filteredModules =
      modules?.data?.filter((item) => item.level?.id === level?.value) || [];
    return filteredModules.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  const getChapterOptions = () => {
    if (!module || module?.value === "All" || !module?.value) {
      return [];
    }
    const filteredChapters =
      chapters?.data?.filter((item) => item.module?.id === module?.value) || [];
    return filteredChapters.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  const getTopicOptions = () => {
    if (!chapter || chapter?.value === "All" || !chapter?.value) {
      return [];
    }
    const filteredTopics =
      topics?.data?.filter((item) => item.chapter?.id === chapter?.value) || [];
    return filteredTopics.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  useEffect(() => {
    setModule(null);
    setChapter(null);
    setTopic(null);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  }, [level]);

  useEffect(() => {
    setChapter(null);
    setTopic(null);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  }, [module]);

  useEffect(() => {
    setTopic(null);
    setIsTopicsLoaded(false);
  }, [chapter]);

  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  useEffect(() => {
    if (isLevelsLoaded && level?.value !== "All" && level?.value) {
      const loadModules = async () => {
        await dispatch(getAllModules());
        setIsModulesLoaded(true);
      };
      loadModules();
    }
  }, [level, isLevelsLoaded, dispatch]);

  useEffect(() => {
    if (isModulesLoaded && module?.value) {
      const loadChapters = async () => {
        await dispatch(getAllChapters());
        setIsChaptersLoaded(true);
      };
      loadChapters();
    }
  }, [module, isModulesLoaded, dispatch]);

  useEffect(() => {
    if (isChaptersLoaded && chapter?.value) {
      const loadTopics = async () => {
        await dispatch(getAllTopics());
        setIsTopicsLoaded(true);
      };
      loadTopics();
    }
  }, [chapter, isChaptersLoaded, dispatch]);

  const fetchAssissments = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value !== "All" ? level?.value : "",
      chapter_id: chapter?.value || "",
      topic_id: topic?.value || "",
      module_id: module?.value || "",
      status: status?.value !== "All" ? status?.value : "",
      type: "topic",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllAssessments(params));
  };

  useEffect(() => {
    if (!isLevelsLoaded) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchAssissments(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, level, module, chapter, topic, status, isLevelsLoaded]);

  useEffect(() => {
    if (isLevelsLoaded) {
      fetchAssissments(page);
    }
  }, [page, isLevelsLoaded]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setLevel(levelOption[0]);
    setModule(null);
    setChapter(null);
    setTopic(null);
    setStatus(statusOptions[0]);
    setSearch("");
    setPage(1);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      fontSize: "14px",
      backgroundColor: state.isDisabled ? "#F1F5F9" : "#F8FAFC",
      opacity: state.isDisabled ? 0.6 : 1,
    }),
  };

  const columns = [
    {
      header: t("quizAssessment.list.columns.title"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizAssessment.list.columns.type"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.type} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizAssessment.list.columns.level"),
      render: (row) => (
        <p className="text-gray-800 text-sm">
          {row?.hierarchy?.level?.title || "-"}
        </p>
      ),
    },
    {
      header: t("quizAssessment.list.columns.module"),
      render: (row) => (
        <p className="text-gray-800 text-sm">
          {row?.hierarchy?.module?.title || "-"}
        </p>
      ),
    },
    {
      header: t("quizAssessment.list.columns.chapter"),
      render: (row) => (
        <p className="text-gray-800 text-sm">
          {row?.hierarchy?.chapter?.title || "-"}
        </p>
      ),
    },
    {
      header: t("quizAssessment.list.columns.topic"),
      render: (row) => (
        <p className="text-gray-800 text-sm">
          {row?.hierarchy?.topic?.title || "-"}
        </p>
      ),
    },
    {
      header: t("quizAssessment.list.columns.questionCount"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.questions_count} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizAssessment.list.columns.totalMark"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.total_marks} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizAssessment.list.columns.passingScore"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.passing_score} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("quizAssessment.list.columns.duration"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {row.estimated_duration ?? 0} mins
        </span>
      ),
    },
    {
      header: t("quizAssessment.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            try {
              await dispatch(
                updateSingleAssismentStatus({ id: row.id, status: newStatus }),
              ).unwrap();
              await fetchAssissments(1);
            } catch (err) {
              console.error("Toggle failed:", err);
            }
          }}
        />
      ),
    },
    {
      header: t("quizAssessment.list.columns.actions"),
      render: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`${row.id}`)}
            className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
          >
            <FaEye />
          </button>
          <button
            onClick={() => navigate(`/assessment-question/${row.id}`)}
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
          >
            {t("quizAssessment.questions")}
          </button>
        </div>
      ),
    },
  ];

  const isModuleDisabled = !level || level?.value === "All";
  const isChapterDisabled = !module || !module?.value;
  const isTopicDisabled = !chapter || !chapter?.value;
  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();
  const topicOptions = getTopicOptions();

  if (isLoading && !assessments?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("quizAssessment.list.quizTitle")}</PageTitle>
          <PageSubtitle>{t("quizAssessment.list.quizSubtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("quizAssessment.actions.addNewQuiz")}
          </Link>
        </PageHeaderRight>
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
                placeholder={t("quizAssessment.list.searchPlaceholder")}
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
                value={level}
                onChange={setLevel}
                options={levelOption}
                styles={customSelectStyles}
                isSearchable={false}
                isLoading={!isLevelsLoaded}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={module}
                onChange={setModule}
                options={moduleOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isModuleDisabled}
                isLoading={
                  !isModuleDisabled &&
                  !isModulesLoaded &&
                  level?.value !== "All"
                }
                placeholder={
                  isModuleDisabled
                    ? t("quizAssessment.filters.selectLevelFirst")
                    : t("quizAssessment.filters.selectModule")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={chapter}
                onChange={setChapter}
                options={chapterOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isChapterDisabled}
                isLoading={
                  !isChapterDisabled && !isChaptersLoaded && module?.value
                }
                placeholder={
                  isChapterDisabled
                    ? t("quizAssessment.filters.selectModuleFirst")
                    : t("quizAssessment.filters.selectChapter")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={topic}
                onChange={setTopic}
                options={topicOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isTopicDisabled}
                isLoading={
                  !isTopicDisabled && !isTopicsLoaded && chapter?.value
                }
                placeholder={
                  isTopicDisabled
                    ? t("quizAssessment.filters.selectChapterFirst")
                    : t("quizAssessment.filters.selectTopic")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={status}
                onChange={setStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
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
                  {t("quizAssessment.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={assessments?.data || []}
            serverSide={true}
            currentPage={assessments?.current_page || 1}
            totalPages={assessments?.last_page || 1}
            totalItems={assessments?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Assissment;
