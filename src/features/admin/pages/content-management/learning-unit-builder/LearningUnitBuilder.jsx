import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
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
import {
  getAllContents,
  updateSingleContentStatus,
} from "../../../../../redux/slice/unitBuilderSlice";
import usePermission from "../../../../../hooks/usePermission";
import PublishedDropdown from "../../../common/PublishedDropdown";
import { updatePublishStatus } from "../../../../../redux/slice/commonSlice";

const ITEMS_PER_PAGE = 10;

const LearningUnitBuilder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { contents, isLoading, isError, message } = useSelector(
    (state) => state.content,
  );

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const levelOption = [
    { value: "", label: t("learningUnitBuilder.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: t("learningUnitBuilder.filters.allStatus") },
    { value: "1", label: t("learningUnitBuilder.filters.active") },
    { value: "0", label: t("learningUnitBuilder.filters.inactive") },
  ];

  const typeOptions = [
    { value: "", label: t("learningUnitBuilder.filters.allTypes") },
    { value: "text", label: t("learningUnitBuilder.filters.text") },
    { value: "media", label: t("learningUnitBuilder.filters.media") },
  ];

  const publishStatusOptions = [
    { value: "all", label: t("learningUnitBuilder.filters.allVisibility") },
    { value: "published", label: t("learningUnitBuilder.filters.published") },
    {
      value: "unpublished",
      label: t("learningUnitBuilder.filters.unpublished"),
    },
    { value: "draft", label: t("learningUnitBuilder.filters.draft") },
  ];

  const [type, setType] = useState(typeOptions[0]);
  const [level, setLevel] = useState(levelOption[0]);
  const [module, setModule] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [topic, setTopic] = useState(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [publish_status, setPublishStatus] = useState(publishStatusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const getModuleOptions = () => {
    if (!level || level?.value === "") {
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
    if (!module || !module?.value) {
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
    if (!chapter || !chapter?.value) {
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
    if (isLevelsLoaded && level?.value !== "" && level?.value) {
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

  const fetchContents = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value || "",
      module_id: module?.value || "",
      chapter_id: chapter?.value || "",
      topic_id: topic?.value || "",
      type: type?.value || "",
      status: status?.value || "",
      publish_status:
        publish_status?.value !== "all" ? publish_status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllContents(params));
  };

  useEffect(() => {
    if (!isLevelsLoaded) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchContents(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [
    search,
    level,
    module,
    chapter,
    topic,
    status,
    type,
    isLevelsLoaded,
    publish_status,
  ]);

  useEffect(() => {
    if (isLevelsLoaded) {
      fetchContents(page);
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
    setType(typeOptions[0]);
    setStatus(statusOptions[0]);
    setPublishStatus(publishStatusOptions[0]);
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

  const isModulesLoading =
    isLevelsLoaded &&
    level?.value !== "" &&
    level?.value &&
    !isModulesLoaded &&
    !modules?.data;
  const isChaptersLoading =
    isModulesLoaded && module?.value && !isChaptersLoaded && !chapters?.data;
  const isTopicsLoading =
    isChaptersLoaded && chapter?.value && !isTopicsLoaded && !topics?.data;

  const columns = [
    {
      header: t("learningUnitBuilder.list.columns.title"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("learningUnitBuilder.list.columns.type"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.type} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("learningUnitBuilder.list.columns.parentTopic"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.topic?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("learningUnitBuilder.list.columns.parentChapter"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.topic?.chapter?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("learningUnitBuilder.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.topic?.module?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("learningUnitBuilder.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row?.topic?.level?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    ...(hasPermission("content.status")
      ? [
          {
            header: t("learningUnitBuilder.list.columns.status"),
            render: (row) => (
              <StatusToggle
                value={row.status}
                onToggle={async (newStatus) => {
                  await dispatch(
                    updateSingleContentStatus({
                      topicId: row?.topic?.id,
                      id: row.id,
                    }),
                  ).unwrap();
                  await fetchContents(1);
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
                type: "topic_content",
                id: row.id,
                publish_status: newStatus,
              }),
            ).unwrap();
            await fetchContents(1);
          }}
        />
      ),
    },

    ...(hasPermission("content.edit")
      ? [
          {
            header: t("learningUnitBuilder.list.columns.actions"),
            render: (row) => (
              <button
                onClick={() =>
                  navigate(`single/${row.id}?topic_id=${row?.topic?.id}`)
                }
                className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
              >
                <FaEye />
              </button>
            ),
          },
        ]
      : []),
  ];

  const isModuleDisabled = !level || level?.value === "";
  const isChapterDisabled = !module || !module?.value;
  const isTopicDisabled = !chapter || !chapter?.value;

  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();
  const topicOptions = getTopicOptions();

  if (isLoading && !contents?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("content.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("learningUnitBuilder.list.title")}</PageTitle>
          <PageSubtitle>{t("learningUnitBuilder.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          {hasPermission("content.bulk-create") && (
            <Link
              to="create"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              {t("learningUnitBuilder.actions.addNewContent")}
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
                placeholder={t("learningUnitBuilder.list.searchPlaceholder")}
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
                isLoading={isModulesLoading}
                placeholder={
                  isModuleDisabled
                    ? t("learningUnitBuilder.filters.selectLevelFirst")
                    : isModulesLoading
                      ? t("learningUnitBuilder.filters.loadingModules")
                      : t("learningUnitBuilder.filters.selectModule")
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
                isLoading={isChaptersLoading}
                placeholder={
                  isChapterDisabled
                    ? t("learningUnitBuilder.filters.selectModuleFirst")
                    : isChaptersLoading
                      ? t("learningUnitBuilder.filters.loadingChapters")
                      : t("learningUnitBuilder.filters.selectChapter")
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
                isLoading={isTopicsLoading}
                placeholder={
                  isTopicDisabled
                    ? t("learningUnitBuilder.filters.selectChapterFirst")
                    : isTopicsLoading
                      ? t("learningUnitBuilder.filters.loadingTopics")
                      : t("learningUnitBuilder.filters.selectTopic")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={type}
                onChange={setType}
                options={typeOptions}
                styles={customSelectStyles}
                isSearchable={false}
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
                  {t("learningUnitBuilder.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={contents?.data || []}
            serverSide={true}
            currentPage={contents?.current_page || 1}
            totalPages={contents?.last_page || 1}
            totalItems={contents?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default LearningUnitBuilder;
