import { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import {
  FaGlobe,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { LuFilterX } from "react-icons/lu";
import { getAllContentStatus } from "../../../../../redux/slice/reportSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../redux/slice/topicSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const ContentStatusReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    contentStatus: contentStatusReports,
    isLoading: loadingContentStatusReports,
    isError,
    message,
  } = useSelector((state) => state.report);
  const { hasPermission } = usePermission();

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const levelOptions = [
    { value: "All", label: t("contentStatusReport.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "", label: t("contentStatusReport.filters.allStatus") },
    { value: "1", label: t("contentStatusReport.filters.published") },
    { value: "0", label: t("contentStatusReport.filters.draft") },
  ];

  const getModuleOptions = () => {
    if (!selectedLevel || selectedLevel?.value === "All") {
      return [];
    }
    const filteredModules =
      modules?.data?.filter((item) => item.level.id === selectedLevel?.value) ||
      [];
    return filteredModules.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  const getChapterOptions = () => {
    if (
      !selectedModule ||
      selectedModule?.value === "All" ||
      !selectedModule?.value
    ) {
      return [];
    }
    const filteredChapters =
      chapters?.data?.filter(
        (item) => item.module.id === selectedModule?.value,
      ) || [];
    return filteredChapters.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  const getTopicOptions = () => {
    if (
      !selectedChapter ||
      selectedChapter?.value === "All" ||
      !selectedChapter?.value
    ) {
      return [];
    }
    const filteredTopics =
      topics?.data?.filter(
        (item) => item.chapter.id === selectedChapter?.value,
      ) || [];
    return filteredTopics.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  useEffect(() => {
    setSelectedModule(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  }, [selectedLevel]);

  useEffect(() => {
    setSelectedChapter(null);
    setSelectedTopic(null);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  }, [selectedModule]);

  useEffect(() => {
    setSelectedTopic(null);
    setIsTopicsLoaded(false);
  }, [selectedChapter]);

  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  useEffect(() => {
    if (
      isLevelsLoaded &&
      selectedLevel?.value !== "All" &&
      selectedLevel?.value
    ) {
      const loadModules = async () => {
        await dispatch(getAllModules());
        setIsModulesLoaded(true);
      };
      loadModules();
    }
  }, [selectedLevel, isLevelsLoaded, dispatch]);

  useEffect(() => {
    if (isModulesLoaded && selectedModule?.value) {
      const loadChapters = async () => {
        await dispatch(getAllChapters());
        setIsChaptersLoaded(true);
      };
      loadChapters();
    }
  }, [selectedModule, isModulesLoaded, dispatch]);

  useEffect(() => {
    if (isChaptersLoaded && selectedChapter?.value) {
      const loadTopics = async () => {
        await dispatch(getAllTopics());
        setIsTopicsLoaded(true);
      };
      loadTopics();
    }
  }, [selectedChapter, isChaptersLoaded, dispatch]);

  const fetchContentStatusReports = useCallback(
    (overridePage) => {
      const params = {
        page: overridePage ?? page,
        per_page: ITEMS_PER_PAGE,
        ...(search && { search: search }),
        ...(selectedLevel?.value &&
          selectedLevel.value !== "All" && { level_id: selectedLevel.value }),
        ...(selectedModule?.value &&
          selectedModule.value !== "All" && {
            module_id: selectedModule.value,
          }),
        ...(selectedChapter?.value &&
          selectedChapter.value !== "All" && {
            chapter_id: selectedChapter.value,
          }),
        ...(selectedTopic?.value &&
          selectedTopic.value !== "All" && { topic_id: selectedTopic.value }),
        ...(selectedStatus?.value &&
          selectedStatus.value !== "" && { status: selectedStatus.value }),
      };
      dispatch(getAllContentStatus(params));
    },
    [
      dispatch,
      search,
      selectedLevel,
      selectedModule,
      selectedChapter,
      selectedTopic,
      selectedStatus,
      page,
    ],
  );

  useEffect(() => {
    if (!isLevelsLoaded) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchContentStatusReports(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [
    search,
    selectedLevel,
    selectedModule,
    selectedChapter,
    selectedTopic,
    selectedStatus,
    isLevelsLoaded,
    fetchContentStatusReports,
  ]);

  useEffect(() => {
    if (isLevelsLoaded) {
      fetchContentStatusReports(page);
    }
  }, [page, isLevelsLoaded, fetchContentStatusReports]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSelectedLevel(levelOptions[0]);
    setSelectedModule(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedStatus(null);
    setSearch("");
    setPage(1);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
    setIsTopicsLoaded(false);
  };

  const isModuleDisabled = !selectedLevel || selectedLevel?.value === "All";
  const isChapterDisabled = !selectedModule || !selectedModule?.value;
  const isTopicDisabled = !selectedChapter || !selectedChapter?.value;

  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();
  const topicOptions = getTopicOptions();

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

  const getStatusBadgeColor = (status) => {
    if (status?.toLowerCase() === "published") {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  const getLanguageDisplay = (languages) => {
    if (!languages || languages.length === 0) return "-";
    const langMap = {
      hi: t("contentStatusReport.languages.hi"),
      en: t("contentStatusReport.languages.en"),
      te: t("contentStatusReport.languages.te"),
      ta: t("contentStatusReport.languages.ta"),
      ml: t("contentStatusReport.languages.ml"),
      kn: t("contentStatusReport.languages.kn"),
    };
    return languages.map((lang) => langMap[lang] || lang).join(", ");
  };

  const columns = [
    {
      header: t("contentStatusReport.columns.program"),
      render: (row) => (
        <div className="min-w-[120px]">
          <p className="font-semibold text-gray-800">{row?.program || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.level"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">{row?.level || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.module"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">{row?.module || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.chapter"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">{row?.chapter || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.topic"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">{row?.topic || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.lessonName"),
      render: (row) => (
        <div className="min-w-[150px]">
          <p className="font-medium text-gray-800">{row?.lesson_name || "-"}</p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.languages"),
      render: (row) => (
        <div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaGlobe size={12} />
            {getLanguageDisplay(row?.languages)}
          </p>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.status"),
      render: (row) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.content_status)}`}
          >
            {row?.content_status || t("contentStatusReport.filters.draft")}
          </span>
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.publishDate"),
      render: (row) => (
        <div className="min-w-[120px]">
          {row?.publish_date ? (
            <>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaCheckCircle size={12} className="text-green-500" />
                {new Date(row?.publish_date).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(row?.publish_date).toLocaleTimeString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">-</p>
          )}
        </div>
      ),
    },
    {
      header: t("contentStatusReport.columns.lastUpdated"),
      render: (row) => (
        <div className="min-w-[120px]">
          {row?.last_updated ? (
            <>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaEdit size={12} className="text-blue-500" />
                {new Date(row?.last_updated).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(row?.last_updated).toLocaleTimeString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">-</p>
          )}
        </div>
      ),
    },
  ];

  const getTableData = () => {
    if (contentStatusReports?.data) {
      return contentStatusReports.data;
    }
    return contentStatusReports || [];
  };

  const getPaginationData = () => {
    const meta = contentStatusReports?.meta || {};
    return {
      current_page: meta?.current_page || 1,
      last_page: meta?.last_page || 1,
      total: meta?.total || 0,
    };
  };

  if (loadingContentStatusReports && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const pagination = getPaginationData();
  const tableData = getTableData();

  if (!hasPermission("reports.content-status")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("contentStatusReport.title")}</PageTitle>
          <PageSubtitle>{t("contentStatusReport.subtitle")}</PageSubtitle>
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
                placeholder={t("contentStatusReport.searchPlaceholder")}
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
            <div className="w-full sm:w-[48%] lg:w-[180px]">
              <Select
                value={selectedLevel}
                onChange={setSelectedLevel}
                options={levelOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isLoading={!isLevelsLoaded}
                placeholder={t("contentStatusReport.filters.selectLevel")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[180px]">
              <Select
                value={selectedModule}
                onChange={setSelectedModule}
                options={moduleOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isModuleDisabled}
                isLoading={
                  !isModuleDisabled &&
                  !isModulesLoaded &&
                  selectedLevel?.value !== "All"
                }
                placeholder={
                  isModuleDisabled
                    ? t("contentStatusReport.filters.selectLevelFirst")
                    : t("contentStatusReport.filters.selectModule")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[180px]">
              <Select
                value={selectedChapter}
                onChange={setSelectedChapter}
                options={chapterOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isChapterDisabled}
                isLoading={
                  !isChapterDisabled &&
                  !isChaptersLoaded &&
                  selectedModule?.value
                }
                placeholder={
                  isChapterDisabled
                    ? t("contentStatusReport.filters.selectModuleFirst")
                    : t("contentStatusReport.filters.selectChapter")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[180px]">
              <Select
                value={selectedTopic}
                onChange={setSelectedTopic}
                options={topicOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isTopicDisabled}
                isLoading={
                  !isTopicDisabled && !isTopicsLoaded && selectedChapter?.value
                }
                placeholder={
                  isTopicDisabled
                    ? t("contentStatusReport.filters.selectChapterFirst")
                    : t("contentStatusReport.filters.selectTopic")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[150px]">
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("contentStatusReport.filters.selectStatus")}
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
                  {t("contentStatusReport.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={tableData}
            serverSide={true}
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            totalItems={pagination.total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default ContentStatusReport;
