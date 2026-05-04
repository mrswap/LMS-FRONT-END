import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import {
  FaEnvelope,
  FaUser,
  FaCertificate,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPercent,
  FaIdCard,
} from "react-icons/fa";
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
import { getAllCertifications } from "../../../../../redux/slice/reportSlice";
import { getAllUsers } from "../../../../../redux/slice/userSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const CertificationReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    certifications: certificationReports,
    loadingCertifications,
    isError,
    message,
  } = useSelector((state) => state.report);

  const { users } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const typeOptions = [
    { value: "", label: t("certificationReport.filters.allTypes") },
    { value: "topic", label: t("certificationReport.filters.topic") },
    { value: "level", label: t("certificationReport.filters.level") },
  ];

  const statusOptions = [
    { value: "", label: t("certificationReport.filters.allStatus") },
    { value: "Active", label: t("certificationReport.filters.active") },
    { value: "Inactive", label: t("certificationReport.filters.inactive") },
  ];

  const userOptions = [
    { value: "", label: t("certificationReport.filters.allUsers") },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  const getPaginationData = () => {
    const meta = certificationReports || {};
    return {
      current_page: meta?.current_page || 1,
      last_page: meta?.last_page || 1,
      total: meta?.total || 0,
    };
  };

  const fetchCertificationReports = (overridePage) => {
    const params = {
      page: overridePage ?? page,
      per_page: ITEMS_PER_PAGE,
      ...(search && { search: search }),
      ...(selectedUser?.value &&
        selectedUser.value !== "" && { user_id: selectedUser.value }),
      ...(selectedType?.value &&
        selectedType.value !== "" && { type: selectedType.value }),
      ...(selectedStatus?.value &&
        selectedStatus.value !== "" && { status: selectedStatus.value }),
    };
    dispatch(getAllCertifications(params));
    dispatch(getAllUsers());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchCertificationReports(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedUser, selectedType, selectedStatus]);

  useEffect(() => {
    fetchCertificationReports(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedUser(null);
    setSelectedType(null);
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
    if (status?.toLowerCase() === "active") {
      return "bg-green-100 text-green-700";
    }
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status?.toLowerCase() === "active") {
      return <FaCheckCircle className="text-green-500" />;
    }
    return <FaTimesCircle className="text-red-500" />;
  };

  const getTypeBadgeColor = (type) => {
    if (type?.toLowerCase() === "topic") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-purple-100 text-purple-700";
  };

  const columns = [
    {
      header: t("certificationReport.columns.userDetails"),
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
      header: t("certificationReport.columns.type"),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row?.type || "-"}</p>
        </div>
      ),
    },
    {
      header: t("certificationReport.columns.levelTopic"),
      render: (row) => (
        <p className="font-medium text-gray-800">
          {row?.type === "topic"
            ? row?.topic
            : row?.type === "level"
              ? row?.level
              : "-"}
        </p>
      ),
    },
    {
      header: t("certificationReport.columns.certificateDetails"),
      render: (row) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-gray-800 flex items-center gap-2">
            <FaCertificate className="text-blue-500" />
            {row?.certificate_id || "-"}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <FaIdCard size={10} />
            {t("certificationReport.id")}: {row?.certificate_id}
          </p>
        </div>
      ),
    },
    {
      header: t("certificationReport.columns.percentage"),
      render: (row) => (
        <div className="text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            {row?.percentage || 0}%
          </p>
        </div>
      ),
    },
    {
      header: t("certificationReport.columns.issueDate"),
      render: (row) => (
        <div className="min-w-[120px]">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaCalendarAlt size={12} />
            {row?.certificate_issue_date
              ? new Date(row?.certificate_issue_date).toLocaleDateString()
              : "-"}
          </p>
          <p className="text-xs text-gray-400">
            {row?.certificate_issue_date
              ? new Date(row?.certificate_issue_date).toLocaleTimeString()
              : "-"}
          </p>
        </div>
      ),
    },
    {
      header: t("certificationReport.columns.status"),
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            {getStatusIcon(row?.certificate_status)}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.certificate_status)}`}
            >
              {row?.certificate_status?.toUpperCase() || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("certificationReport.columns.action"),
      render: (row) => {
        const isValidCertificate = Number(row?.passed_attempt_id) > 0;

        return (
          <div>
            {isValidCertificate ? (
              <button
                onClick={() =>
                  navigate(`/certificate/${row.passed_attempt_id}`)
                }
                className="px-3 py-1 text-xs font-semibold cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
              >
                {t("certificationReport.columns.viewCertificate")}
              </button>
            ) : (
              <span className="text-xs text-gray-400 italic">—</span>
            )}
          </div>
        );
      },
    },
  ];

  const getTableData = () => {
    if (certificationReports?.data) {
      return certificationReports.data;
    }
    return [];
  };

  if (loadingCertifications && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const tableData = getTableData();
  const pagination = getPaginationData();

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("certificationReport.title")}</PageTitle>
          <PageSubtitle>{t("certificationReport.subtitle")}</PageSubtitle>
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
                placeholder={t("certificationReport.searchPlaceholder")}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={userOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder={t("certificationReport.filters.selectUser")}
              />
            </div>

            <div>
              <Select
                value={selectedType}
                onChange={setSelectedType}
                options={typeOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("certificationReport.filters.selectType")}
              />
            </div>

            <div>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("certificationReport.filters.selectStatus")}
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
                  {t("certificationReport.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={tableData}
            serverSide={true}
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            totalItems={certificationReports?.total || tableData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default CertificationReport;
