import { useEffect, useState, useCallback, useRef } from "react";
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
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import {
  getAllFaqs,
  updateSingleFaqStatus,
} from "../../../../../redux/slice/faqSlice";
import { getAllTopics } from "../../../../../redux/slice/topicSlice";
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";

const ITEMS_PER_PAGE = 10;

const Faqs = () => {
  const { t } = useTranslation();
  const { faqs, isLoading, isError, message } = useSelector(
    (state) => state.faq,
  );

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  // Track which data has been fetched
  const [fetchedTypes, setFetchedTypes] = useState({
    level: false,
    module: false,
    chapter: false,
    topic: false,
  });

  // ✅ Fixed: Dynamic options with i18n
  const levelOption = [
    { value: "all", label: t("faq.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const moduleOption = [
    { value: "all", label: t("faq.filters.allModules") },
    ...(modules?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const chapterOption = [
    { value: "all", label: t("faq.filters.allChapters") },
    ...(chapters?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const topicOption = [
    { value: "all", label: t("faq.filters.allTopics") },
    ...(topics?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  // ✅ Fixed: Status options with i18n
  const statusOptions = [
    { value: "all", label: t("faq.filters.allStatus") },
    { value: "1", label: t("faq.filters.active") },
    { value: "0", label: t("faq.filters.inactive") },
  ];

  // ✅ Fixed: Type options with i18n
  const typeOptions = [
    { value: "all", label: t("faq.filters.allTypes") },
    { value: "level", label: t("faq.types.level") },
    { value: "module", label: t("faq.types.module") },
    { value: "chapter", label: t("faq.types.chapter") },
    { value: "topic", label: t("faq.types.topic") },
  ];

  const [status, setStatus] = useState(statusOptions[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [selectedOption, setSelectedOption] = useState(null);

  const getDynamicOptions = () => {
    switch (type?.value) {
      case "level":
        return levelOption;
      case "module":
        return moduleOption;
      case "chapter":
        return chapterOption;
      case "topic":
        return topicOption;
      default:
        return [];
    }
  };

  const getDynamicLabel = () => {
    switch (type?.value) {
      case "level":
        return t("faq.filters.selectLevel");
      case "module":
        return t("faq.filters.selectModule");
      case "chapter":
        return t("faq.filters.selectChapter");
      case "topic":
        return t("faq.filters.selectTopic");
      default:
        return t("faq.filters.selectOption");
    }
  };

  // Function to fetch data based on type
  const fetchTypeSpecificData = useCallback(
    async (typeValue) => {
      switch (typeValue) {
        case "level":
          if (!fetchedTypes.level) {
            await dispatch(getAllLevels());
            setFetchedTypes((prev) => ({ ...prev, level: true }));
          }
          break;
        case "module":
          if (!fetchedTypes.module) {
            await dispatch(getAllModules());
            setFetchedTypes((prev) => ({ ...prev, module: true }));
          }
          break;
        case "chapter":
          if (!fetchedTypes.chapter) {
            await dispatch(getAllChapters());
            setFetchedTypes((prev) => ({ ...prev, chapter: true }));
          }
          break;
        case "topic":
          if (!fetchedTypes.topic) {
            await dispatch(getAllTopics());
            setFetchedTypes((prev) => ({ ...prev, topic: true }));
          }
          break;
        default:
          break;
      }
    },
    [dispatch, fetchedTypes],
  );

  const fetchAllFaqs = useCallback(
    (overridePage) => {
      const params = {
        search: search || "",
        status: status?.value !== "all" ? status?.value : "all",
        type: type?.value !== "all" ? type?.value : "all",
        page: overridePage ?? page,
        limit: ITEMS_PER_PAGE,
      };
      if (
        type?.value !== "all" &&
        selectedOption?.value &&
        selectedOption?.value !== "all"
      ) {
        params.type_id = selectedOption.value;
      }
      dispatch(getAllFaqs(params));
    },
    [dispatch, search, type?.value, selectedOption?.value, page, status],
  );

  // Handle type change - fetch only the selected type's data
  const handleTypeChange = useCallback(
    async (newType) => {
      setType(newType);
      setSelectedOption(null);
      setPage(1);

      // Fetch only the data for the selected type
      if (newType?.value !== "all") {
        await fetchTypeSpecificData(newType.value);
      }
    },
    [fetchTypeSpecificData],
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchAllFaqs(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status, type, selectedOption, fetchAllFaqs]);

  useEffect(() => {
    if (
      page !== 1 ||
      search ||
      status?.value !== "all" ||
      type?.value !== "all" ||
      selectedOption
    ) {
      fetchAllFaqs(page);
    } else {
      fetchAllFaqs(page);
    }
  }, [page, fetchAllFaqs]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setStatus(statusOptions[0]);
    setType(typeOptions[0]);
    setSelectedOption(null);
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
      header: t("faq.list.columns.id"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">{row.id}</p>
      ),
    },
    {
      header: t("faq.list.columns.question"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">
          {row.question?.length > 50
            ? row.question.substring(0, 50) + "..."
            : row.question}
        </p>
      ),
    },
    {
      header: t("faq.list.columns.type"),
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {row.type}
        </span>
      ),
    },
    {
      header: t("faq.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleFaqStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchAllFaqs(1);
          }}
        />
      ),
    },
    {
      header: t("faq.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !faqs?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("faq.list.title")}</PageTitle>
          <PageSubtitle>{t("faq.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
          >
            {t("faq.actions.addNewFaq")}
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
                placeholder={t("faq.list.searchPlaceholder")}
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

          {/* Filters */}
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
            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={type}
                onChange={handleTypeChange}
                options={typeOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={getDynamicOptions()}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={getDynamicLabel()}
                isDisabled={type?.value === "all"}
              />
            </div>

            {/* Clear Button */}
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
                  {t("faq.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={faqs?.data || []}
            serverSide={true}
            currentPage={faqs?.current_page || 1}
            totalPages={faqs?.last_page || 1}
            totalItems={faqs?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Faqs;
