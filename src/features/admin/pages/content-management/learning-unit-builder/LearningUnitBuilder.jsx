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

const ITEMS_PER_PAGE = 5;

const LearningUnitBuilder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contents, isLoading, isError, message } = useSelector(
    (state) => state.content,
  );

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const levelOption = [
    { value: "", label: "All Levels" },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "text", label: "Text" },
    { value: "media", label: "Media" },
  ];

  const [type, setType] = useState(typeOptions[0]);
  const [level, setLevel] = useState(levelOption[0]);
  const [module, setModule] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [topic, setTopic] = useState(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 Level ke according modules filter kar
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

  // 🔥 Module ke according chapters filter kar
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

  // 🔥 Chapter ke according topics filter kar
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

  // 🔥 Level change hone par module, chapter, topic reset
  useEffect(() => {
    setModule(null);
    setChapter(null);
    setTopic(null);
  }, [level]);

  // 🔥 Module change hone par chapter, topic reset
  useEffect(() => {
    setChapter(null);
    setTopic(null);
  }, [module]);

  // 🔥 Chapter change hone par topic reset
  useEffect(() => {
    setTopic(null);
  }, [chapter]);

  const fetchContents = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value || "",
      module_id: module?.value || "",
      chapter_id: chapter?.value || "",
      topic_id: topic?.value || "",
      type: type?.value || "",
      status: status?.value || "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllContents(params));
    dispatch(getAllLevels());
    dispatch(getAllModules());
    dispatch(getAllChapters());
    dispatch(getAllTopics());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchContents(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, level, module, chapter, topic, status, type]);

  useEffect(() => {
    fetchContents(page);
  }, [page]);

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
    setSearch("");
    setPage(1);
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
  ];

  // 🔥 Disabled logic
  const isModuleDisabled = !level || level?.value === "";
  const isChapterDisabled = !module || !module?.value;
  const isTopicDisabled = !chapter || !chapter?.value;

  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();
  const topicOptions = getTopicOptions();

  if (isLoading && !contents?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("learningUnitBuilder.list.title")}</PageTitle>
          <PageSubtitle>{t("learningUnitBuilder.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("learningUnitBuilder.actions.addNewContent")}
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
                placeholder={
                  isModuleDisabled ? "Select level first" : "Select module"
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
                placeholder={
                  isChapterDisabled ? "Select module first" : "Select chapter"
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
                placeholder={
                  isTopicDisabled ? "Select chapter first" : "Select topic"
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

            <div className="ml-auto flex items-center h-[40px]">
              <div className="relative group">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer
      text-gray-500 hover:text-white hover:bg-red-500
      transition-all"
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
