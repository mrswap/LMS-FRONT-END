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
  getAllModules,
  updateSingleModuleStatus,
} from "../../../../../redux/slice/moduleSlice";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import { FiSearch } from "react-icons/fi";
import TruncateText from "../../../common/TruncateText";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import { updatePublishStatus } from "../../../../../redux/slice/commonSlice";
import PublishedDropdown from "../../../common/PublishedDropdown";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const Module = () => {
  const { t } = useTranslation();
  const { modules, isLoading, isError, message } = useSelector(
    (state) => state.module,
  );
  const { levels } = useSelector((state) => state.level);
  const dispatch = useDispatch();

  // ✅ Fixed: Dynamic level options with i18n
  const levelOption = [
    { value: "all", label: t("module.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: t("module.filters.allStatus") },
    { value: "1", label: t("module.filters.active") },
    { value: "0", label: t("module.filters.inactive") },
  ];

  const publishStatusOptions = [
    { value: "all", label: t("module.filters.allVisibility") },
    { value: "published", label: t("module.filters.published") },
    { value: "unpublished", label: t("module.filters.unpublished") },
    { value: "draft", label: t("module.filters.draft") },
  ];

  const [level, setLevel] = useState(levelOption[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [publish_status, setPublishStatus] = useState(publishStatusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const fetchModules = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value !== "all" ? level?.value : "",
      status: status?.value !== "all" ? status?.value : "all",
      publish_status:
        publish_status?.value !== "all" ? publish_status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllModules(params));
    dispatch(getAllLevels());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchModules(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status, level, publish_status]);

  useEffect(() => {
    fetchModules(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setLevel(levelOption[0]);
    setStatus(statusOptions[0]);
    setPublishStatus(publishStatusOptions[0]);
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
      header: t("module.list.columns.moduleName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("module.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.level?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    // {
    //   header: t("module.list.columns.totalChapters"),
    //   render: (row) => (
    //     <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
    //       {row.chapters_count || 0}
    //     </span>
    //   ),
    // },
    // {
    //   header: t("module.list.columns.totalTopics"),
    //   render: (row) => (
    //     <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
    //       {row.topics_count || 0}
    //     </span>
    //   ),
    // },
    {
      header: t("module.list.columns.duration"),
      render: (row) => (
        <span className="text-gray-600">
          {row.duration || t("module.list.notSpecified")}
        </span>
      ),
    },
    ...(hasPermission("modules.status")
      ? [
          {
            header: t("module.list.columns.status"),
            render: (row) => (
              <StatusToggle
                value={row.status}
                onToggle={async (newStatus) => {
                  await dispatch(
                    updateSingleModuleStatus({ id: row.id, status: newStatus }),
                  ).unwrap();
                  await fetchModules(1);
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
                type: "module",
                id: row.id,
                publish_status: newStatus,
              }),
            ).unwrap();
            await fetchModules(1);
          }}
        />
      ),
    },
    ...(hasPermission("modules.edit")
      ? [
          {
            header: t("module.list.columns.actions"),
            render: (row) => (
              <button
                onClick={() => navigate(`module-details/${row.id}`)}
                className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
              >
                <FaEye />
              </button>
            ),
          },
        ]
      : []),
  ];

  if (isLoading && !modules?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("modules.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("module.list.title")}</PageTitle>
          <PageSubtitle>{t("module.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          {hasPermission("modules.create") && (
            <Link
              to="create-module"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
            >
              {t("module.actions.addNewModule")}
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
                placeholder={t("module.list.searchPlaceholder")}
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
                  {t("module.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={modules?.data || []}
            serverSide={true}
            currentPage={modules?.current_page || 1}
            totalPages={modules?.last_page || 1}
            totalItems={modules?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Module;
