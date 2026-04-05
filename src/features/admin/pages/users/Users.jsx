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
import { getAllUsers } from "../../../../redux/slice/userSlice";
import Loader from "../../common/Loader";
import Error from "../../common/Error";

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const { t } = useTranslation();
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.user,
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

  const fetchUsers = (overridePage) => {
    const params = {
      search: search || "",
      // status: status?.value === "all" ? "" : status?.value,
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
          {row.employee_id}
        </p>
      ),
    },
    {
      header: t("userManagement.list.columns.name"),
      render: (row) => (
        // console.log(row),
        <p className="font-semibold text-gray-800 cursor-pointer">{row.name}</p>
      ),
    },
    {
      header: t("userManagement.list.columns.contact"),
      render: (row) => (
        <div>
          <p className="text-sm">{row.email}</p>
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
          4
        </span>
      ),
    },
    // {
    //   header: t("userManagement.list.columns.progress"),
    //   render: (row) => <div className="flex items-center gap-2"></div>,
    // },
    {
      header: t("userManagement.list.columns.status"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: t("userManagement.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`user-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  // console.log("users", users);

  if (isLoading && !users?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("userManagement.list.title")}</PageTitle>
          <PageSubtitle>{t("userManagement.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-user"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("userManagement.actions.addNewUser")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex flex-wrap items-center gap-3">
          {/* <span className="text-gray-500 text-sm font-semibold">
            {t("topic.list.filters")}
          </span> */}
          <div
            className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-blue-500
           rounded-xl px-3 py-2 w-full md:w-[280px] lg:w-[330px] transition-colors"
          >
            <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="bg-transparent outline-none px-2 text-sm w-full"
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

          <div
            className="flex items-center gap-1 ml-auto cursor-pointer group"
            onClick={resetFilters}
          >
            <MdOutlineFilterAltOff
              className="text-gray-500 group-hover:text-red-500 transition-colors"
              size={18}
            />
            <button className="text-gray-600 group-hover:text-red-500 text-sm font-semibold transition-colors cursor-pointer">
              {t("levels.list.clearAll")}
            </button>
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

        {/* CARDS */}
        {/* <div className="flex gap-4 w-full mt-4">
          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sx transition">
            <h3 className="text-[#6B7280] text-[14px] text-sm font-medium">
              {t("userManagement.list.stats.totalActive.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">1200</p>
            <p className="text-sm text-[#6B7280] text-[12px] mt-1">
              {t("userManagement.list.stats.totalActive.growth")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
            <h3 className="text-[#6B7280] text-[14px] font-medium">
              {t("userManagement.list.stats.avgProgress.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">68%</p>
            <p className="text-[#6B7280] text-[12px] mt-1">
              {t("userManagement.list.stats.avgProgress.growth")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
            <h3 className="text-[#6B7280] text-[14px] font-medium">
              {t("userManagement.list.stats.pending.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">32</p>
            <p className="text-[#6B7280] text-[14px] mt-1">
              {t("userManagement.list.stats.pending.subtext")}
            </p>
          </div>
        </div> */}
      </PageBody>
    </PageLayout>
  );
};

export default Users;
