import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
// import { GiBookCover } from "react-icons/gi";
// import { IoIosCheckmarkCircleOutline } from "react-icons/io";
// import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
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
import {
  getAllLevels,
  updateSingleLevelStatus,
} from "../../../../../redux/slice/levelSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { FiSearch } from "react-icons/fi";
import TruncateText from "../../../common/TruncateText";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";

const ITEMS_PER_PAGE = 5;

const Levels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { levels, isLoading, isError, message } = useSelector(
    (state) => state.level,
  );

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchLevels = (overridePage) => {
    const params = {
      search: search || "",
      status: status?.value !== "All" ? status?.value : "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllLevels(params));
  };

  // useEffect(() => {
  //   fetchLevels(1);
  // }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchLevels(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchLevels(page);
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
      header: t("levels.list.columns.levelName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("levels.list.columns.parentProgram"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.program?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("levels.list.columns.totalChapters"),
    },
    {
      header: "Total Topic",
    },
    {
      header: "Total Module",
    },
    // {
    //   header: t("levels.list.columns.status"),
    //   render: (row) => (
    //     <span
    //       className={`px-2 py-1 rounded text-xs font-medium ${
    //         row.status
    //           ? "bg-green-100 text-green-700"
    //           : "bg-red-100 text-red-700"
    //       }`}
    //     >
    //       {row.status ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
    {
      header: t("levels.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleLevelStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchLevels(1);
          }}
        />
      ),
    },
    {
      header: t("levels.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`level-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !levels?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("levels.list.title")}</PageTitle>
          <PageSubtitle>{t("levels.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-level"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("levels.actions.addNew")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        {/* <div className="bg-white border border-gray-300 rounded-xl p-3 flex flex-wrap items-center gap-3">
          <div
            className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-blue-500
           rounded-xl px-3 py-2 w-full md:w-[280px] lg:w-[330px] transition-colors"
          >
            <FiSearch className="text-gray-400 text-sm flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search levels..."
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
        </div> */}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          {/* 🔍 Search */}
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
                placeholder="Search topics..."
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

          {/* 🎯 Filters */}
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

            {/* ❌ Clear Button */}
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
                  Clear all
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mt-4">
            <CustomeTable
              columns={columns}
              data={levels?.data || []}
              serverSide={true}
              currentPage={levels?.current_page || 1}
              totalPages={levels?.last_page || 1}
              totalItems={levels?.total || 0}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* <div className="flex gap-4 w-full mt-4">
          <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                <HiOutlineSquare3Stack3D className="text-xl" />
              </div>
              <div>
                <h3 className="text-[12px] text-[#29324C] font-[700]">
                  {t("levels.list.stats.totalLevels")}
                </h3>
                <p className="text-2xl font-bold text-gray-800 ">42</p>
              </div>
            </div>
          </div>

          <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <IoIosCheckmarkCircleOutline className="text-xl" />
              </div>
              <div>
                <h3 className="text-[12px] text-[#29324C] font-[700]">
                  {t("levels.list.stats.active")}
                </h3>
                <p className="text-2xl font-bold text-gray-800">35</p>
              </div>
            </div>
          </div>

          <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <GiBookCover className="text-xl" />
              </div>
              <div>
                <h3 className="text-[12px] text-[#29324C] font-[700]">
                  {t("levels.list.stats.avgChapters")}
                </h3>
                <p className="text-2xl font-bold text-gray-800">14.2</p>
              </div>
            </div>
          </div>
        </div> */}
      </PageBody>
    </PageLayout>
  );
};

export default Levels;
