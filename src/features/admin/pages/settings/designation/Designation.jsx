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
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  updateSingleUserStatus,
} from "../../../../../redux/slice/userSlice";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import {
  getAllRoles,
  updateSingleRoleStatus,
} from "../../../../../redux/slice/rolesSlice";
import {
  getAllDesignation,
  updateSingleDesignationStatus,
} from "../../../../../redux/slice/designationSlice";

const ITEMS_PER_PAGE = 5;

const Designation = () => {
  const { t } = useTranslation();
  const { designations, isLoading, isError, message } = useSelector(
    (state) => state.designation,
  );

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchDesignation = (overridePage) => {
    const params = {
      search: search || "",
      // status: status?.value === "all" ? "" : status?.value,
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllDesignation(params));
    // dispatch(getAllDesignation());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchDesignation(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchDesignation(page);
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
      header: t("designation.list.columns.id"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">{row.id}</p>
      ),
    },
    {
      header: t("designation.list.columns.name"),
      render: (row) => (
        <p className="font-semibold text-gray-800 cursor-pointer">{row.name}</p>
      ),
    },
    {
      header: t("designation.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.is_active}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleDesignationStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchRoles(1);
          }}
        />
      ),
    },
    {
      header: t("role.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`designation-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !designations?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("designation.list.title")}</PageTitle>
          <PageSubtitle>{t("designation.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-designation"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("designation.actions.addNewDesignation")}
          </Link>
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
                placeholder={t("designation.list.searchPlaceholder")}
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
                  {t("designation.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={designations || []}
            serverSide={true}
            currentPage={designations?.current_page || 1}
            totalPages={designations?.last_page || 1}
            totalItems={designations?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Designation;
