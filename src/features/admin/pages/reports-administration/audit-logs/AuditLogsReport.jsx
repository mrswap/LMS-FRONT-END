import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { FaEnvelope, FaEye, FaDesktop } from "react-icons/fa";
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
import { useNavigate } from "react-router-dom";
import { getAllAuditLogs } from "../../../../../redux/slice/reportSlice";
import { getAllUsers } from "../../../../../redux/slice/userSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const AuditLogsReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditLogs, loadingAuditLogs, isError, message } = useSelector(
    (state) => state.report,
  );

  const { hasPermission } = usePermission();

  const { users } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const eventOptions = [
    { value: "", label: t("auditLogReport.filters.allEvents") },

    { value: "login", label: t("auditLogReport.filters.login") },
    {
      value: "profile_viewed",
      label: t("auditLogReport.filters.profile_viewed"),
    },
    { value: "reset_device", label: t("auditLogReport.filters.reset_device") },
    {
      value: "chapter_viewed",
      label: t("auditLogReport.filters.chapter_viewed"),
    },
  ];

  const userOptions = [
    { value: "", label: t("auditLogReport.filters.allUsers") },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  const fetchAuditLogs = (overridePage) => {
    const params = {
      page: overridePage ?? page,
      per_page: ITEMS_PER_PAGE,
      ...(search && { search: search }),
      ...(selectedEvent?.value &&
        selectedEvent.value !== "" && { event: selectedEvent.value }),
      ...(selectedUser?.value &&
        selectedUser.value !== "" && { user_id: selectedUser.value }),
    };
    dispatch(getAllAuditLogs(params));
    dispatch(getAllUsers());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchAuditLogs(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedEvent, selectedUser]);

  useEffect(() => {
    fetchAuditLogs(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedEvent(null);
    setSelectedUser(null);
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

  const getEventBadgeColor = (event) => {
    switch (event?.toLowerCase()) {
      case "login":
        return "bg-green-100 text-green-700";

      case "profile_viewed":
        return "bg-blue-100 text-blue-700";

      case "reset_device":
        return "bg-red-100 text-red-700";

      case "chapter_viewed":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = [
    {
      header: t("auditLogReport.columns.userDetails"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">
              <TruncateText text={row?.user?.name} maxLength={25} />
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaEnvelope size={10} />
              <TruncateText text={row?.user?.email} maxLength={25} />
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t("auditLogReport.columns.event"),
      render: (row) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getEventBadgeColor(row?.event)}`}
          >
            {row?.event?.replaceAll("_", " ").toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: t("auditLogReport.columns.description"),
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="text-gray-700">
            <TruncateText text={row?.description || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("auditLogReport.columns.ipAddress"),
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm font-mono">{row?.ip || "-"}</p>
        </div>
      ),
    },
    {
      header: t("auditLogReport.columns.device"),
      render: (row) => (
        <div>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <FaDesktop size={12} />
            <TruncateText text={row?.device || "-"} maxLength={30} />
          </p>
        </div>
      ),
    },
    {
      header: t("auditLogReport.columns.dateTime"),
      render: (row) => (
        <div className="min-w-[120px]">
          <p className="text-gray-600 text-sm">
            {new Date(row.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row.created_at).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  const getTableData = () => {
    if (auditLogs?.data) {
      return auditLogs.data;
    }
    return auditLogs || [];
  };

  const getPaginationData = () => {
    const meta = auditLogs?.meta || {};
    return {
      current_page: meta?.current_page || 1,
      last_page: meta?.last_page || 1,
      total: meta?.total || 0,
    };
  };

  if (loadingAuditLogs && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const pagination = getPaginationData();

  if (!hasPermission("reports.audit")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("auditLogReport.title")}</PageTitle>
          <PageSubtitle>{t("auditLogReport.subtitle")}</PageSubtitle>
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
                placeholder={t("auditLogReport.searchPlaceholder")}
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
            <div className="w-full sm:w-[48%] lg:w-[250px]">
              <Select
                value={selectedEvent}
                onChange={setSelectedEvent}
                options={eventOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("auditLogReport.filters.selectEvent")}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[250px]">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={userOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder={t("auditLogReport.filters.selectUser")}
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
                  {t("auditLogReport.clearAll")}
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

export default AuditLogsReport;
