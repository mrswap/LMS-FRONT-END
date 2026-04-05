import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
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

const ITEMS_PER_PAGE = 5;

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

  const chapterOption = [
    { value: "All", label: "All Chapter" },
    ...(chapters?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const moduleOption = [
    { value: "All", label: "All Module" },
    ...(modules?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const levelOption = [
    { value: "All", label: "All Level" },
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

  const [chapter, setChapter] = useState(chapterOption[0]);
  const [module, setModule] = useState(moduleOption[0]);
  const [level, setLevel] = useState(levelOption[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchTopics = (overridePage) => {
    const params = {
      search: search || "",
      chapter_id: chapter?.value !== "All" ? chapter?.value : "",
      level_id: level?.value !== "All" ? level?.value : "",
      module_id: module?.value !== "All" ? module?.value : "",
      status: status?.value !== "All" ? status?.value : "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllTopics(params));
    dispatch(getAllChapters());
    dispatch(getAllModules());
    dispatch(getAllLevels());
  };

  // useEffect(() => {
  //   fetchTopics(1);
  // }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchTopics(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, chapter, status, module, level]);

  useEffect(() => {
    fetchTopics(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setChapter(chapterOption[0]);
    setModule(moduleOption[0]);
    setLevel(levelOption[0]);
    setStatus(statusOptions[0]);
    setSearch("");
    setPage(1);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
    }),
  };

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
            <TruncateText text={row?.module?.title} maxLength={25} />
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
          {row.estimated_duration ?? 0} mins
        </span>
      ),
    },
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
    {
      header: t("topic.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`topic-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !topics?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("topic.list.title")}</PageTitle>
          <PageSubtitle>{t("topic.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-topic"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("topic.actions.addNewTopic")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        {/* <div className="bg-white border border-gray-300 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div
            className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-blue-500
           rounded-xl px-3 py-2 w-full md:w-[280px] lg:w-[330px] transition-colors"
          >
            <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="bg-transparent outline-none px-2 text-sm w-full"
            />
          </div>

          <div className="w-[220px]">
            <Select
              value={level}
              onChange={setLevel}
              options={levelOption}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div className="w-[220px]">
            <Select
              value={module}
              onChange={setModule}
              options={moduleOption}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div className="w-[220px]">
            <Select
              value={chapter}
              onChange={setChapter}
              options={chapterOption}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div className="w-[220px]">
            <Select
              value={status}
              onChange={setStatus}
              options={statusOptions}
              styles={customSelectStyles}
              isSearchable={false}
            />
          </div>

          <div
            className="flex items-center gap-1 ml-auto cursor-pointer group"
            onClick={resetFilters}
          >
            <MdOutlineFilterAltOff
              className="text-gray-500 group-hover:text-red-500 transition-colors"
              size={18}
            />
            <button className="text-gray-600 group-hover:text-red-500 text-sm font-semibold transition-colors cursor-pointer">
              {t("topic.list.clearAll")}
            </button>
          </div>
        </div> */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/* 🔍 Search */}
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
                placeholder="Search topics..."
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

          {/* 🎯 Filters */}
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
                options={moduleOption}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={chapter}
                onChange={setChapter}
                options={chapterOption}
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

            {/* ❌ Clear Button */}
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

                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
      px-2 py-1 text-xs rounded-md bg-gray-800 text-white
      opacity-0 group-hover:opacity-100 transition-all duration-200
      whitespace-nowrap pointer-events-none"
                >
                  Clear all
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
