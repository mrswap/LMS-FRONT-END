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

const ITEMS_PER_PAGE = 10;

const Programs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { programs, isLoading, isError, message } = useSelector(
    (state) => state.program,
  );

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [level, setLevel] = useState(null);

  // ================= OPTIONS =================
  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const levelOptions = [
    { label: "Level 1", value: 1 },
    { label: "Level 2", value: 2 },
  ];

  // ================= API CALL =================
  const fetchPrograms = () => {
    const params = {
      search: search || "",
      status: status?.value ?? "",
      level: level?.value ?? "",
    };

    dispatch(getAllPrograms());
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPrograms();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, status, level]);

  // ================= CLEAR FILTER =================
  const handleClear = () => {
    setSearch("");
    setStatus(null);
    setLevel(null);
    dispatch(getAllPrograms({}));
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      header: t("program.list.columns.programName"),
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.title} maxLength={25} />
        </p>
      ),
    },
    {
      header: t("program.list.columns.totalLevels"),
      accessor: "totalLevels",
    },
    {
      header: t("program.list.columns.assignedUsers"),
      render: () => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          Assigned
        </span>
      ),
    },
    {
      header: t("program.list.columns.complitionRate"),
      accessor: "complitionRate",
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
      header: t("program.list.columns.actions"),
      render: (row) => (
        // console.log("Row Data:", row),
        <button
          onClick={() => navigate(`program-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  // ================= UI =================
  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("program.list.title")}</PageTitle>
          <PageSubtitle>{t("program.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>

        <PageHeaderRight>
          <Link
            to="create-program"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("program.actions.addNewProgram")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        {/* ================= FILTER BAR ================= */}
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Search program name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-[220px]"
          />

          {/* STATUS */}
          <div className="w-[200px]">
            <Select
              options={statusOptions}
              value={status}
              onChange={setStatus}
              placeholder="Status"
            />
          </div>

          {/* LEVEL */}
          <div className="w-[200px]">
            <Select
              options={levelOptions}
              value={level}
              onChange={setLevel}
              placeholder="Level"
            />
          </div>

          {/* CLEAR */}
          <div className="flex items-center gap-1 ml-auto cursor-pointer group">
            <MdOutlineFilterAltOff className="text-gray-500" size={18} />
            <button
              onClick={handleClear}
              className="text-gray-600 text-sm font-semibold"
            >
              {t("levels.list.clearAll")}
            </button>
          </div>
        </div>

        {/* ================= DATA ================= */}
        <div className="mt-4">
          {isLoading && <Loader />}
          {isError && <Error message={message} />}

          <CustomeTable
            columns={columns}
            data={programs.data || []}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Programs;
