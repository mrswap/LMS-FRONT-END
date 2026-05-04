import { useEffect, useState } from "react";
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
import {
  getAllLevels,
  updateSingleLevelStatus,
} from "../../../../../redux/slice/levelSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { FiSearch } from "react-icons/fi";
import TruncateText from "../../../common/TruncateText";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";

const ITEMS_PER_PAGE = 10;

const Levels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { levels, isLoading, isError, message } = useSelector(
    (state) => state.level,
  );

  const statusOptions = [
    { value: "all", label: t("levels.filters.allStatus") },
    { value: "1", label: t("levels.filters.active") },
    { value: "0", label: t("levels.filters.inactive") },
  ];

  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchLevels = (overridePage) => {
    const params = {
      search: search || "",
      status: status?.value !== "all" ? status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllLevels(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchLevels(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchLevels(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
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
      header: t("levels.list.columns.levelName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("levels.list.columns.parentProgram"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.program?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("levels.list.columns.totalChapters"),
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          {row.chapters_count || 0}
        </span>
      ),
    },
    {
      header: t("levels.list.columns.totalTopics"),
      render: (row) => (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          {row.topics_count || 0}
        </span>
      ),
    },
    {
      header: t("levels.list.columns.totalModules"),
      render: (row) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {row.modules_count || 0}
        </span>
      ),
    },
    {
      header: t("levels.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleLevelStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchLevels(1);
          }}
        />
      ),
    },
    {
      header: t("levels.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`level-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !levels?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("levels.list.title")}</PageTitle>
          <PageSubtitle>{t("levels.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-level"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
          >
            {t("levels.actions.addNew")}
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
                placeholder={t("levels.list.searchPlaceholder")}
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
                  {t("levels.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={levels?.data || []}
            serverSide={true}
            currentPage={levels?.current_page || 1}
            totalPages={levels?.last_page || 1}
            totalItems={levels?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>

        {/* ========== COMMENTED CODE - STATS CARDS (FUTURE USE) ==========
        <div className="flex gap-4 w-full mt-4">
          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("levels.stats.totalLevels.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {levels?.total || 0}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("levels.stats.totalLevels.subtext")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("levels.stats.activeLevels.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {levels?.data?.filter(l => l.status)?.length || 0}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("levels.stats.activeLevels.subtext")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("levels.stats.totalChapters.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {levels?.data?.reduce((sum, l) => sum + (l.chapters_count || 0), 0) || 0}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("levels.stats.totalChapters.subtext")}
            </p>
          </div>
        </div>
        ========== END COMMENTED CODE ========== */}
      </PageBody>
    </PageLayout>
  );
};

export default Levels;
