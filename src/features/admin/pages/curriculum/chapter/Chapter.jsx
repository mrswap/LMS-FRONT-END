import { useEffect, useState } from "react";
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
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";

const ITEMS_PER_PAGE = 5;

const Chapters = () => {
  const { t } = useTranslation();
  const { chapters, isLoading, isError, message } = useSelector(
    (state) => state.chapter,
  );

  const programOptions = [{ value: "All", label: t("chapter.status.all") }];

  const statusOptions = [
    { value: "All", label: t("chapter.status.all") },
    { value: "Active", label: t("chapter.status.active") },
    { value: "Draft", label: t("chapter.status.draft") },
    { value: "Archived", label: t("chapter.status.archived") },
  ];

  const [program, setProgram] = useState(programOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= API CALL =================
  const fetchChapters = () => {
    dispatch(getAllChapters());
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchChapters();
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  const resetFilters = () => {
    // setProgram(programOptions[0]);
    // setStatus(statusOptions[0]);
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
      header: t("chapter.list.columns.chapterName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.title}</p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.module.title}</p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.level.title}</p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.totalChapters"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {/* {row.chapters} Chapters */}
        </span>
      ),
    },
    {
      header: t("chapter.list.columns.duration"),
      // accessor: "duration",
    },
    {
      header: t("chapter.list.columns.status"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: t("chapter.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`chapter-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("chapter.list.title")}</PageTitle>
          <PageSubtitle>{t("chapter.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-chapter"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("chapter.actions.addNewChapter")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3">
          <span className="text-gray-500 text-sm font-semibold">
            {t("chapter.list.filters")}
          </span>

          <div className="w-[220px]">
            <Select
              value={program}
              onChange={setProgram}
              options={programOptions}
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

          <div className="flex items-center gap-1 ml-auto cursor-pointer group">
            <MdOutlineFilterAltOff className="text-gray-500" size={18} />
            <button
              onClick={resetFilters}
              className="text-gray-600 text-sm font-semibold"
            >
              {t("chapter.list.clearAll")}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={chapters?.data || []}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Chapters;
