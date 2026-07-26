import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { FaEnvelope, FaCheckCircle, FaRegCircle, FaEye } from "react-icons/fa";
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
import { getAllContacts } from "../../../../../redux/slice/contactSlice";
import { LuFilterX } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const Contact = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts, isLoading, isError, message } = useSelector(
    (state) => state.contact,
  );

  const { hasPermission } = usePermission();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusOptions = [
    { value: "all", label: t("contact.filters.allContacts") },
    { value: "1", label: t("contact.filters.seen") },
    { value: "0", label: t("contact.filters.unseen") },
  ];

  const fetchContacts = (overridePage) => {
    const params = {
      search: search || "",
      limit: ITEMS_PER_PAGE,
      page: overridePage ?? page,
      ...(selectedStatus?.value &&
        selectedStatus.value !== "all" && { is_seen: selectedStatus.value }),
    };
    dispatch(getAllContacts(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchContacts(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedStatus]);

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSelectedStatus(null);
    setSearch("");
    setPage(1);
  };

  // const getStatusBadge = (isSeen) => {
  //   if (isSeen === 1 || isSeen === true) {
  //     return (
  //       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
  //         <FaCheckCircle size={12} />
  //         {t("contact.status.seen")}
  //       </span>
  //     );
  //   }
  //   return (
  //     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
  //       <FaRegCircle size={12} />
  //       {t("contact.status.unseen")}
  //     </span>
  //   );
  // };

  const getStatusBadge = (isSeen) => {
    const seen = isSeen === 1 || isSeen === true;

    return (
      <span
        className={`inline-flex w-fit self-start items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          seen ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {seen ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
        {seen ? t("contact.status.seen") : t("contact.status.unseen")}
      </span>
    );
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

  const columns = [
    {
      header: t("contact.columns.userDetails"),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">
              <TruncateText text={row?.name} maxLength={25} />
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaEnvelope size={10} />
              <TruncateText text={row?.email} maxLength={25} />
            </p>
          </div>
        </div>
      ),
    },
    {
      header: t("contact.columns.subject"),
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-gray-800">
            <TruncateText text={row?.subject || "-"} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("contact.columns.status"),
      render: (row) => (
        <div className="flex flex-col gap-1">{getStatusBadge(row.is_seen)}</div>
      ),
    },
    {
      header: t("contact.columns.dateTime"),
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
    {
      header: t("contact.columns.actions"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`${row.id}`)}
            className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
            title={t("contact.actions.viewDetails")}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  const getTableData = () => {
    if (contacts?.data?.data) {
      return contacts.data.data;
    }
    return contacts?.data || [];
  };

  const getPaginationData = () => {
    const paginationData = contacts?.data || contacts;
    return {
      current_page: paginationData?.current_page || 1,
      last_page: paginationData?.last_page || 1,
      total: paginationData?.total || 0,
    };
  };

  if (isLoading && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const pagination = getPaginationData();

  if (!hasPermission("contacts.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("contact.list.title")}</PageTitle>
          <PageSubtitle>{t("contact.list.subtitle")}</PageSubtitle>
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
                placeholder={t("contact.list.searchPlaceholder")}
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
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder={t("contact.filters.filterByStatus")}
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
                  {t("contact.list.clearAll")}
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

export default Contact;
