import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaEye } from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTopics,
  updateSingleTopicStatus,
} from "../../../../../redux/slice/topicSlice";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import TruncateText from "../../../common/TruncateText";
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import PublishedDropdown from "../../../common/PublishedDropdown";
import { updatePublishStatus } from "../../../../../redux/slice/commonSlice";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const Topics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topics, isLoading, isError, message } = useSelector(
    (state) => state.topic,
  );

  const { chapters } = useSelector((state) => state.chapter);
  const { modules } = useSelector((state) => state.module);
  const { levels } = useSelector((state) => state.level);

  // State to track loading sequence
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);

  // ✅ Fixed: Dynamic level options with i18n
  const levelOption = [
    { value: "all", label: t("topic.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  // ✅ Fixed: Dynamic status options with i18n
  const statusOptions = [
    { value: "all", label: t("topic.filters.allStatus") },
    { value: "1", label: t("topic.filters.active") },
    { value: "0", label: t("topic.filters.inactive") },
  ];

  const publishStatusOptions = [
    { value: "all", label: t("topic.filters.allVisibility") },
    { value: "published", label: t("topic.filters.published") },
    { value: "unpublished", label: t("topic.filters.unpublished") },
    { value: "draft", label: t("topic.filters.draft") },
  ];

  const [level, setLevel] = useState(levelOption[0]);
  const [moduleFilter, setModuleFilter] = useState(null);
  const [chapterFilter, setChapterFilter] = useState(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [publish_status, setPublishStatus] = useState(publishStatusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { hasPermission } = usePermission();

  // Get module options based on selected level
  const getModuleOptions = () => {
    if (!level || level?.value === "all") {
      return [];
    }
    const filteredModules =
      modules?.data?.filter((item) => item.level?.id === level?.value) || [];
    return filteredModules.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  // Get chapter options based on selected module
  const getChapterOptions = () => {
    if (!moduleFilter || !moduleFilter?.value) {
      return [];
    }
    const filteredChapters =
      chapters?.data?.filter(
        (item) => item.module?.id === moduleFilter?.value,
      ) || [];
    return filteredChapters.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  // Reset module, chapter, and their loaded states when level changes
  useEffect(() => {
    setModuleFilter(null);
    setChapterFilter(null);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
  }, [level]);

  // Reset chapter when module changes
  useEffect(() => {
    setChapterFilter(null);
    setIsChaptersLoaded(false);
  }, [moduleFilter]);

  // STEP 1: Load levels on component mount
  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  // STEP 2: Load modules only when level is selected (not "all")
  useEffect(() => {
    if (isLevelsLoaded && level?.value !== "all") {
      const loadModules = async () => {
        await dispatch(getAllModules());
        setIsModulesLoaded(true);
      };
      loadModules();
    }
  }, [level, isLevelsLoaded, dispatch]);

  // STEP 3: Load chapters only when module is selected
  useEffect(() => {
    if (isModulesLoaded && moduleFilter?.value) {
      const loadChapters = async () => {
        await dispatch(getAllChapters());
        setIsChaptersLoaded(true);
      };
      loadChapters();
    }
  }, [moduleFilter, isModulesLoaded, dispatch]);

  // STEP 4: Fetch topics when all dependencies are ready
  const fetchTopics = (overridePage) => {
    const params = {
      search: search || "",
      chapter_id: chapterFilter?.value || "",
      level_id: level?.value !== "all" ? level?.value : "",
      module_id: moduleFilter?.value || "",
      status: status?.value !== "all" ? status?.value : "all",
      publish_status:
        publish_status?.value !== "all" ? publish_status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllTopics(params));
  };

  // Fetch topics when filters change (only after levels are loaded)
  useEffect(() => {
    if (!isLevelsLoaded) return;

    const delay = setTimeout(() => {
      setPage(1);
      fetchTopics(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [
    search,
    status,
    level,
    moduleFilter,
    chapterFilter,
    isLevelsLoaded,
    publish_status,
  ]);

  // Fetch topics on page change
  useEffect(() => {
    if (isLevelsLoaded) {
      fetchTopics(page);
    }
  }, [page, isLevelsLoaded]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setLevel(levelOption[0]);
    setModuleFilter(null);
    setChapterFilter(null);
    setStatus(statusOptions[0]);
    setPublishStatus(publishStatusOptions[0]);
    setSearch("");
    setPage(1);
    setIsModulesLoaded(false);
    setIsChaptersLoaded(false);
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

  const isModuleDisabled = !level || level?.value === "all";
  const isChapterDisabled = !moduleFilter || !moduleFilter?.value;
  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();

  // Check if modules are loading
  const isModulesLoading =
    isLevelsLoaded &&
    level?.value !== "all" &&
    !isModulesLoaded &&
    !modules?.data;
  // Check if chapters are loading
  const isChaptersLoading =
    isModulesLoaded &&
    moduleFilter?.value &&
    !isChaptersLoaded &&
    !chapters?.data;

  const columns = [
    {
      header: t("topic.list.columns.topicName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentChapter"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.chapter?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.module?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.level?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.duration"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {row.estimated_duration ?? 0} {t("topic.list.minutes")}
        </span>
      ),
    },
    ...(hasPermission("topics.status")
      ? [
          {
            header: t("topic.list.columns.status"),
            render: (row) => (
              <StatusToggle
                value={row.status}
                onToggle={async (newStatus) => {
                  await dispatch(
                    updateSingleTopicStatus({ id: row.id, status: newStatus }),
                  ).unwrap();
                  await fetchTopics(1);
                }}
              />
            ),
          },
        ]
      : []),

    {
      header: t("publishedDropdown.status.title"),
      render: (row) => (
        <PublishedDropdown
          value={row.publish_status}
          onToggle={async (newStatus) => {
            await dispatch(
              updatePublishStatus({
                type: "topic",
                id: row.id,
                publish_status: newStatus,
              }),
            ).unwrap();
            await fetchTopics(1);
          }}
        />
      ),
    },
    {
      header: t("topic.list.columns.createdBy"),

      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.creator?.name || "-"}
        </span>
      ),
    },
    ...(hasPermission("topics.edit") || hasPermission("content.view")
      ? [
          {
            header: t("topic.list.columns.actions"),
            render: (row) => (
              <div className="flex gap-2">
                {hasPermission("topics.edit") && (
                  <button
                    onClick={() => navigate(`topic-details/${row.id}`)}
                    className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
                  >
                    <FaEye />
                  </button>
                )}

                {hasPermission("content.view") && (
                  <button
                    onClick={() => navigate(`/learning-unit/bulk//${row.id}`)}
                    className="px-3 py-1 text-xs font-semibold cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                  >
                    {/* View all content */}
                    {t("topic.list.columns.viewContent")}
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  if (isLoading && !topics?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("topics.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("topic.list.title")}</PageTitle>
          <PageSubtitle>{t("topic.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          {hasPermission("topics.create") && (
            <Link
              to="create-topic"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
            >
              {t("topic.actions.addNewTopic")}
            </Link>
          )}
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
                placeholder={t("topic.list.searchPlaceholder")}
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
                value={moduleFilter}
                onChange={setModuleFilter}
                options={moduleOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isModuleDisabled}
                isLoading={isModulesLoading}
                placeholder={
                  isModuleDisabled
                    ? t("topic.filters.selectLevelFirst")
                    : isModulesLoading
                      ? t("topic.filters.loadingModules")
                      : t("topic.filters.selectModule")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={chapterFilter}
                onChange={setChapterFilter}
                options={chapterOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isChapterDisabled}
                isLoading={isChaptersLoading}
                placeholder={
                  isChapterDisabled
                    ? t("topic.filters.selectModuleFirst")
                    : isChaptersLoading
                      ? t("topic.filters.loadingChapters")
                      : t("topic.filters.selectChapter")
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

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={publish_status}
                onChange={setPublishStatus}
                options={publishStatusOptions}
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
                  {t("topic.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={topics?.data || []}
            serverSide={true}
            currentPage={topics?.current_page || 1}
            totalPages={topics?.last_page || 1}
            totalItems={topics?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Topics;
