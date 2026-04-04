import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { GiBookCover } from "react-icons/gi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
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
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { useSelector, useDispatch } from "react-redux";

const ITEMS_PER_PAGE = 5;

const Module = () => {
  const { t } = useTranslation();

  const { modules, isLoading, isError, message } = useSelector(
    (state) => state.module,
  );

  const programOptions = [
    { value: "All", label: t("module.status.all") },
    { value: "Pacemaker", label: "Pacemaker" },
  ];

  const statusOptions = [
    { value: "All", label: t("module.status.all") },
    { value: "Active", label: t("module.status.active") },
    { value: "Draft", label: t("module.status.draft") },
    { value: "Archived", label: t("module.status.archived") },
  ];

  const [program, setProgram] = useState(programOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= API CALL =================
  const fetchlevels = () => {
    dispatch(getAllModules());
  };

  useEffect(() => {
    fetchlevels();
  }, []);

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchlevels();
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  const resetFilters = () => {
    // setProgram(programOptions[0]);
    // setStatus(statusOptions[0]);
  };

  // SELECT STYLE (same as your old)
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
      header: t("module.list.columns.moduleName"),
      render: (row) => (
        console.log("row", row),
        (
          <div>
            <p className="font-semibold text-gray-800">{row.title}</p>
          </div>
        )
      ),
    },
    {
      header: t("module.list.columns.levelName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.level.title}</p>
        </div>
      ),
    },
    {
      header: t("module.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.program.title}</p>
        </div>
      ),
    },
    {
      header: t("module.list.columns.totalChapters"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {/* {row.chapters} Chapters */}
        </span>
      ),
    },
    {
      header: t("module.list.columns.duration"),
      // accessor: "duration",
    },
    {
      header: t("program.list.columns.status"),
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
      header: t("levels.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`module-details/${row.id}`)}
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
          <PageTitle>{t("module.list.title")}</PageTitle>
          <PageSubtitle>{t("module.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-module"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("module.actions.addNew")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3">
          <span className="text-gray-500 text-sm font-semibold">
            {t("module.list.filters")}
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
              {t("module.list.clearAll")}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={modules?.data || []}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        <div className="flex gap-4 w-full mt-4">
          <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                <HiOutlineSquare3Stack3D className="text-xl" />
              </div>
              <div>
                <h3 className="text-[12px] text-[#29324C] font-[700]">
                  {t("module.list.stats.totalLevels")}
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
                  {t("module.list.stats.active")}
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
                  {t("module.list.stats.avgChapters")}
                </h3>
                <p className="text-2xl font-bold text-gray-800">14.2</p>
              </div>
            </div>
          </div>
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Module;
