import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { FaEnvelope, FaUser, FaChartLine, FaClock } from "react-icons/fa";
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
import TruncateText from "../../../common/TruncateText";
import { LuFilterX } from "react-icons/lu";
import { getAllAssessmentReports } from "../../../../../redux/slice/reportSlice";
import { getAllUsers } from "../../../../../redux/slice/userSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const AssessmentReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { assessmentReports, loadingAssessmentReports, isError, message } =
    useSelector((state) => state.report);

  const { users } = useSelector((state) => state.user);
  const { hasPermission } = usePermission();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const typeOptions = [
    { value: "", label: t("assessmentReport.filters.allTypes") },
    { value: "level", label: t("assessmentReport.filters.level") },
    { value: "topic", label: t("assessmentReport.filters.topic") },
  ];

  const statusOptions = [
    { value: "", label: t("assessmentReport.filters.allStatus") },
    { value: "passed", label: t("assessmentReport.filters.passed") },
    { value: "failed", label: t("assessmentReport.filters.failed") },
  ];

  const userOptions = [
    { value: "", label: t("assessmentReport.filters.allUsers") },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  const fetchAssessmentReports = (overridePage) => {
    const params = {
      page: overridePage ?? page,
      per_page: ITEMS_PER_PAGE,
      ...(search && { search: search }),
      ...(selectedType?.value &&
        selectedType.value !== "" && { type: selectedType.value }),
      ...(selectedUser?.value &&
        selectedUser.value !== "" && { user_id: selectedUser.value }),
      ...(selectedStatus?.value &&
        selectedStatus.value !== "" && { status: selectedStatus.value }),
    };
    dispatch(getAllAssessmentReports(params));
    dispatch(getAllUsers());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchAssessmentReports(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedType, selectedUser, selectedStatus]);

  useEffect(() => {
    fetchAssessmentReports(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedType(null);
    setSelectedUser(null);
    setSelectedStatus(null);
    setPage(1);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
    }),
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = [
    {
      header: t("assessmentReport.columns.userDetails"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">{row?.user_name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaEnvelope size={10} />
              {row?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.assessment"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row?.assessment_name}</p>
          <p className="text-xs text-gray-500">{row?.related_name}</p>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.scorePercentage"),
      render: (row) => (
        <div>
          <p className="text-gray-700 font-medium">
            {row?.score} / {row?.total_questions}
          </p>
          <p className="text-xs text-gray-500">{row?.percentage}%</p>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.status"),
      render: (row) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.status)}`}
          >
            {row?.status?.toUpperCase()}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {t("assessmentReport.passing")}: {row?.passing_score}%
          </p>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.answers"),
      render: (row) => (
        <div className="space-y-1">
          <p className="text-xs">
            <span className="text-green-600">
              ✓ {t("assessmentReport.correct")}: {row?.correct_answers}
            </span>
          </p>
          <p className="text-xs">
            <span className="text-red-600">
              ✗ {t("assessmentReport.incorrect")}: {row?.incorrect_answers}
            </span>
          </p>
          <p className="text-xs">
            <span className="text-gray-500">
              ⊘ {t("assessmentReport.skipped")}: {row?.skipped}
            </span>
          </p>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.attempt"),
      render: (row) => (
        <div>
          <p className="text-gray-700 font-medium">
            {t("assessmentReport.attemptNumber")} #{row?.attempt_count}
          </p>
        </div>
      ),
    },
    {
      header: t("assessmentReport.columns.dateTime"),
      render: (row) => (
        <div className="min-w-[120px]">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <FaClock size={12} />
            {new Date(row?.attempt_date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row?.attempt_date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  const getTableData = () => {
    if (assessmentReports?.data) {
      return assessmentReports.data;
    }
    return assessmentReports || [];
  };

  const getPaginationData = () => {
    const meta = assessmentReports?.meta || {};
    return {
      current_page: meta?.current_page || 1,
      last_page: meta?.last_page || 1,
      total: meta?.total || 0,
    };
  };

  if (loadingAssessmentReports && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const pagination = getPaginationData();

  if (!hasPermission("reports.assessment")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("assessmentReport.title")}</PageTitle>
          <PageSubtitle>{t("assessmentReport.subtitle")}</PageSubtitle>
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
                placeholder={t("assessmentReport.searchPlaceholder")}
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
            <div className="w-full sm:w-[31%] lg:w-[220px]">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={userOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder={t("assessmentReport.filters.selectUser")}
              />
            </div>

            <div className="w-full sm:w-[31%] lg:w-[220px]">
              <Select
                value={selectedType}
                onChange={setSelectedType}
                options={typeOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("assessmentReport.filters.selectType")}
              />
            </div>

            <div className="w-full sm:w-[31%] lg:w-[220px]">
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("assessmentReport.filters.selectStatus")}
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
                  {t("assessmentReport.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={getTableData()}
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

export default AssessmentReport;
