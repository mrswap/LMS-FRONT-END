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
import { useDispatch, useSelector } from "react-redux";
import { getAllPrograms } from "../../../../../redux/slice/programSlice";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import TruncateText from "../../../common/TruncateText";
import { FiSearch } from "react-icons/fi";

const ITEMS_PER_PAGE = 10;

const Programs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { programs, isLoading, isError, message } = useSelector(
    (state) => state.program,
  );

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);

  const fetchPrograms = (overridePage) => {
    const params = {
      search: search || "",
      status: status?.value === "all" ? "" : status?.value,
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllPrograms(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPrograms(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchPrograms(page);
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
      header: t("program.list.columns.programName"),
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.title} maxLength={55} />
        </p>
      ),
    },
    {
      header: "Description",
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.description} maxLength={55} />
        </p>
      ),
    },
    // {
    //   header: t("program.list.columns.totalLevels"),
    //   accessor: "totalLevels",
    // },
    // {
    //   header: t("program.list.columns.assignedUsers"),
    //   render: () => (
    //     <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
    //       john
    //     </span>
    //   ),
    // },
    // {
    //   header: t("program.list.columns.complitionRate"),
    //   accessor: "complitionRate",
    // },
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
    // {
    //   header: t("program.list.columns.actions"),
    //   render: (row) => (
    //     <button
    //       onClick={() => navigate(`program-details/${row.id}`)}
    //       className="text-gray-800 text-lg cursor-pointer"
    //     >
    //       <FaEye />
    //     </button>
    //   ),
    // },
  ];

  if (isLoading && programs?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("program.list.title")}</PageTitle>
          <PageSubtitle>{t("program.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>

        {/* <PageHeaderRight>
          <Link
            to="create-program"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("program.actions.addNewProgram")}
          </Link>
        </PageHeaderRight> */}
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
              placeholder={t("program.list.searchPlaceholder")} 
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

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={programs?.data || []}
            serverSide={true}
            currentPage={programs?.current_page || 1}
            totalPages={programs?.last_page || 1}
            totalItems={programs?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Programs;
