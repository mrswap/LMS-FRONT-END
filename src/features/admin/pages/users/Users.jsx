import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../common/table/CustomeTable";
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
} from "../../common/layout";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  updateSingleUserStatus,
} from "../../../../redux/slice/userSlice";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import StatusToggle from "../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import usePermission from "../../../../hooks/usePermission";
import TruncateText from "../../common/TruncateText";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const { t } = useTranslation();
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.user,
  );
  const { hasPermission } = usePermission();

  const statusOptions = [
    { value: "all", label: t("userManagement.filters.allStatus") },
    { value: "1", label: t("userManagement.filters.active") },
    { value: "0", label: t("userManagement.filters.inactive") },
  ];

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUsers = (overridePage) => {
    const params = {
      search: search || "",
      // status: status?.value === "all" ? "" : status?.value,
      role: "sales",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllUsers(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchUsers(page);
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
      header: t("userManagement.list.columns.userId"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">
          <TruncateText text={row.employee_id} />
        </p>
      ),
    },
    {
      header: t("userManagement.list.columns.name"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">
          <TruncateText text={row.name} />
        </p>
      ),
    },
    {
      header: t("userManagement.list.columns.contact"),
      render: (row) => (
        <div>
          {/* <p className="text-sm">{row.email}</p> */}
          <TruncateText text={row.email} />
          <p className="text-xs text-gray-400">{row.mobile}</p>
        </div>
      ),
    },
    {
      header: t("userManagement.list.columns.region"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">
          {row.region}
        </p>
      ),
    },
    {
      header: t("userManagement.list.columns.programs"),
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
          1
        </span>
      ),
    },
    ...(hasPermission("users.status")
      ? [
          {
            header: t("userManagement.list.columns.status"),
            render: (row) => (
              // console.log("row", row),
              <StatusToggle
                value={row.status}
                onToggle={async (newStatus) => {
                  await dispatch(
                    updateSingleUserStatus({ id: row.id, status: newStatus }),
                  ).unwrap();
                  await fetchUsers(1);
                }}
              />
            ),
          },
        ]
      : []),
    ...(hasPermission("users.edit")
      ? [
          {
            header: t("userManagement.list.columns.actions"),
            render: (row) => (
              <button
                onClick={() =>
                  navigate(`/assign-training/user-details/${row.id}`)
                }
                className="text-gray-800 text-lg cursor-pointer"
              >
                <FaEye />
              </button>
            ),
          },
        ]
      : []),
  ];

  if (isLoading && !users?.data?.length) return <Loader />;
  // if (isError) return <Error message={message} />;

  if (!hasPermission("users.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("userManagement.list.salesTitle")}</PageTitle>
          <PageSubtitle>{t("userManagement.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          {hasPermission("users.create") && (
            <Link
              to="/assign-training/create-user"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              {t("userManagement.actions.addNewUser")}
            </Link>
          )}
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/*  Search */}
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
                placeholder={t("userManagement.list.searchPlaceholder")}
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

          {/*  Filters */}
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

            {/*  Clear Button */}
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
                  {t("userManagement.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={users?.data || []}
            serverSide={true}
            currentPage={users?.current_page || 1}
            totalPages={users?.last_page || 1}
            totalItems={users?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Users;
