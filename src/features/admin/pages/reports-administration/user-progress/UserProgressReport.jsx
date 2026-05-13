import { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { FaEnvelope, FaClock, FaLock, FaUnlockAlt } from "react-icons/fa";
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
import { getAllUserProgress } from "../../../../../redux/slice/reportSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../redux/slice/topicSlice";
import { getAllUsers } from "../../../../../redux/slice/userSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";
import TruncateText from "../../../common/TruncateText";

const ITEMS_PER_PAGE = 10;

const UserProgressReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userProgress, loadingUserProgress, isError, message } = useSelector(
    (state) => state.report,
  );

  const { hasPermission } = usePermission();

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);
  const { users } = useSelector((state) => state.user);

  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const levelOptions = [
    { value: "All", label: t("userProgressReport.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "", label: t("userProgressReport.filters.allStatus") },
    { value: "completed", label: t("userProgressReport.filters.completed") },
    { value: "in_progress", label: t("userProgressReport.filters.inProgress") },
    { value: "not_started", label: t("userProgressReport.filters.pending") },
  ];

  const userOptions = [
    { value: "All", label: t("userProgressReport.filters.allUsers") },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
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
    dispatch(getAllUsers());
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

  const fetchUserProgress = useCallback(
    (overridePage) => {
      const params = {
        page: overridePage ?? page,
        per_page: ITEMS_PER_PAGE,
        ...(search && { search: search }),
        ...(selectedUser?.value &&
          selectedUser.value !== "All" && { user_id: selectedUser.value }),
        ...(selectedStatus?.value &&
          selectedStatus.value !== "all" && {
            status: selectedStatus.value,
          }),
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
      };
      dispatch(getAllUserProgress(params));
    },
    [
      dispatch,
      search,
      selectedUser,
      selectedStatus,
      selectedLevel,
      selectedModule,
      selectedChapter,
      selectedTopic,
      page,
    ],
  );

  useEffect(() => {
    if (!isLevelsLoaded) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchUserProgress(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [
    search,
    selectedUser,
    selectedStatus,
    selectedLevel,
    selectedModule,
    selectedChapter,
    selectedTopic,
    isLevelsLoaded,
    fetchUserProgress,
  ]);

  useEffect(() => {
    if (isLevelsLoaded) {
      fetchUserProgress(page);
    }
  }, [page, isLevelsLoaded, fetchUserProgress]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSelectedLevel(levelOptions[0]);
    setSelectedModule(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setSelectedUser(null);
    setSelectedStatus(statusOptions[0]);
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
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage === 100) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const columns = [
    {
      header: t("userProgressReport.columns.userDetails"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">
              <TruncateText text={row?.user_name} maxLength={25} />
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaEnvelope size={10} />
              <TruncateText text={row?.email} maxLength={25} />
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.level"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">
            <TruncateText text={row?.level || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.module"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">
            <TruncateText text={row?.module || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.chapter"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">
            <TruncateText text={row?.chapter || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.topic"),
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-700">
            <TruncateText text={row?.topic || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.progress"),
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">
              {t("userProgressReport.completion")}
            </span>
            <span
              className={`text-xs font-semibold ${getPercentageColor(row?.completion_percentage)}`}
            >
              {row?.completion_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${row?.completion_percentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.status"),
      render: (row) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.completion_status)}`}
          >
            {row?.completion_status}
          </span>
          <div className="flex items-center gap-1 mt-1">
            {row?.is_unlocked ? (
              <FaUnlockAlt
                className="text-green-500 text-xs"
                title={t("userProgressReport.unlocked")}
              />
            ) : (
              <FaLock
                className="text-red-500 text-xs"
                title={t("userProgressReport.locked")}
              />
            )}
            <span className="text-xs text-gray-400">
              {row?.is_unlocked
                ? t("userProgressReport.unlocked")
                : t("userProgressReport.locked")}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("userProgressReport.columns.lastActivity"),
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <FaClock size={12} />
            <span>
              {row?.last_activity_date
                ? new Date(row?.last_activity_date).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const getTableData = () => {
    if (userProgress?.data) {
      return userProgress.data;
    }
    return userProgress || [];
  };

  const getPaginationData = () => {
    return {
      current_page: userProgress?.current_page || 1,
      last_page: userProgress?.last_page || 1,
      total: userProgress?.total || 0,
    };
  };

  if (loadingUserProgress && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const pagination = getPaginationData();
  const tableData = getTableData();

  if (!hasPermission("reports.progress")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("userProgressReport.title")}</PageTitle>
          <PageSubtitle>{t("userProgressReport.subtitle")}</PageSubtitle>
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
                placeholder={t("userProgressReport.searchPlaceholder")}
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
                isSearchable={false}
                placeholder={t("userProgressReport.filters.selectUser")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedLevel}
                onChange={setSelectedLevel}
                options={levelOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isLoading={!isLevelsLoaded}
                placeholder={t("userProgressReport.filters.selectLevel")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
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
                    ? t("userProgressReport.filters.selectLevelFirst")
                    : t("userProgressReport.filters.selectModule")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
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
                    ? t("userProgressReport.filters.selectModuleFirst")
                    : t("userProgressReport.filters.selectChapter")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
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
                    ? t("userProgressReport.filters.selectChapterFirst")
                    : t("userProgressReport.filters.selectTopic")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("userProgressReport.filters.selectStatus")}
              />
            </div>

            <div className=" flex items-center ">
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
                  {t("userProgressReport.clearAll")}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium">
                {t("userProgressReport.stats.totalRecords")}
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {pagination.total}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3">
              <p className="text-xs text-green-600 font-medium">
                {t("userProgressReport.stats.completed")}
              </p>
              <p className="text-2xl font-bold text-green-700">
                {tableData.filter((item) => item.is_completed).length}
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-3">
              <p className="text-xs text-yellow-600 font-medium">
                {t("userProgressReport.stats.inProgress")}
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {
                  tableData.filter(
                    (item) =>
                      !item.is_completed &&
                      item.completion_status === "In Progress",
                  ).length
                }
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3">
              <p className="text-xs text-purple-600 font-medium">
                {t("userProgressReport.stats.avgCompletion")}
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {Math.round(
                  tableData.reduce(
                    (acc, item) => acc + item.completion_percentage,
                    0,
                  ) / (tableData.length || 1),
                )}
                %
              </p>
            </div>
          </div> */}
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

export default UserProgressReport;
