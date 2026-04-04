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

const ITEMS_PER_PAGE = 5;

const Users = () => {
  const { t } = useTranslation();
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.user,
  );

  const programOptions = [
    { value: "All", label: t("levels.status.all") },
    { value: "Pacemaker", label: "Pacemaker" },
  ];

  const statusOptions = [
    { value: "All", label: t("levels.status.all") },
    { value: "Active", label: t("levels.status.active") },
    { value: "Draft", label: t("levels.status.draft") },
    { value: "Archived", label: t("levels.status.archived") },
  ];

  const [program, setProgram] = useState(programOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= API CALL =================
  const fetchUsers = () => {
    dispatch(getAllUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  const resetFilters = () => {
    // setProgram(programOptions[0]);
    // setStatus(statusOptions[0]);
  };

  // const levels = [
  //   {
  //     id: "AV-9042",
  //     name: "Sarah Anderson",
  //     email: "s.anderson@medmail.com",
  //     phone: "+1 555 012",
  //     region: "North America",
  //     programs: 4,
  //     progress: 82,
  //     status: "Active",
  //   },
  //   {
  //     id: "AV-8731",
  //     name: "James Wilson",
  //     email: "j.wilson@healthcare.org",
  //     phone: "+44 20 7946",
  //     region: "Europe",
  //     programs: 2,
  //     progress: 45,
  //     status: "active",
  //   },
  //   {
  //     id: "AV-7421",
  //     name: "Priya Sharma",
  //     email: "p.sharma@clinicnet.in",
  //     phone: "+91 98001234",
  //     region: "Asia",
  //     programs: 3,
  //     progress: 67,
  //     status: "Active",
  //   },
  // ];

  // const filtered = levels.filter((lvl) => {
  //   const matchProgram =
  //     program.value === "All" || lvl.program === program.value;

  //   const matchStatus = status.value === "All" || lvl.status === status.value;

  //   return matchProgram && matchStatus;
  // });

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
        console.log(row),
        (
          <p className="font-semibold text-gray-800 cursor-pointer">
            {row.name}
          </p>
        )
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
          {/* {row.programs} */}
        </span>
      ),
    },
    {
      header: t("userManagement.list.columns.progress"),
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${row.progress}%` }}
            />
          </div> */}
          {/* <span className="text-xs font-semibold">{row.progress}%</span> */}
        </div>
      ),
    },
    // {
    //   header: t("userManagement.list.columns.status"),
    //   render: (row) => {
    //     const styles = {
    //       Active: "bg-green-100 text-green-800",
    //       "On Leave": "bg-yellow-100 text-yellow-800",
    //       Inactive: "bg-red-100 text-red-800",
    //     };

    //     return (
    //       <span
    //         className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[row.status]}`}
    //       >
    //         {t(
    //           `userManagement.status.${row.status.replace(" ", "").toLowerCase()}`,
    //         )}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   header: t("userManagement.list.columns.actions"),
    //   render: () => (
    //     <button
    //       onClick={() => navigate("user-details")}
    //       className="text-gray-800 text-lg cursor-pointer"
    //     >
    //       <FaEye />
    //     </button>
    //   ),
    // },
    {
      header: t("userManagement.list.columns.status"),
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
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3">
          <div className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-blue-500 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 w-full md:w-[280px] lg:w-[380px] xl:w-[480px]">
            <FiSearch className="text-gray-400 text-sm sm:text-base" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("userManagement.list.searchPlaceholder")}
              className="bg-transparent outline-none px-1.5 sm:px-2 text-xs sm:text-sm w-full"
            />
          </div>

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
              className="text-gray-600 text-sm font-semibold whitespace-nowrap"
            >
              {t("levels.list.clearAll")}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={users || []}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* CARDS */}
        <div className="flex gap-4 w-full mt-4">
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
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Users;
