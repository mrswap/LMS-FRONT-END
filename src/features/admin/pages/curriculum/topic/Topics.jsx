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
import { useDispatch, useSelector } from "react-redux";
import { getAllTopics } from "../../../../../redux/slice/topicSlice";

const ITEMS_PER_PAGE = 5;

const Topics = () => {
  const { t } = useTranslation();
  const { topics, isLoading, isError, message } = useSelector(
    (state) => state.topic,
  );

  const programOptions = [{ value: "All", label: t("topic.status.all") }];

  const statusOptions = [
    { value: "All", label: t("topic.status.all") },
    { value: "Active", label: t("topic.status.active") },
    { value: "Draft", label: t("topic.status.draft") },
    { value: "Archived", label: t("topic.status.archived") },
  ];

  const [program, setProgram] = useState(programOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= API CALL =================
  const fetchTopics = () => {
    dispatch(getAllTopics());
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTopics();
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
      header: t("topic.list.columns.topicName"),
      render: (row) => (
        console.log(row),
        (
          <div>
            <p className="font-semibold text-gray-800">{row.title}</p>
          </div>
        )
      ),
    },
    {
      header: t("topic.list.columns.parentChapter"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.chapter.title}</p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.module.title}</p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.level.title}</p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.totalChapters"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {/* {row.chapters} Chapters */}
        </span>
      ),
    },
    {
      header: t("topic.list.columns.duration"),
      // accessor: "duration",
    },
    {
      header: t("topic.list.columns.status"),
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
      header: t("topic.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`topic-details/${row.id}`)}
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
          <PageTitle>{t("topic.list.title")}</PageTitle>
          <PageSubtitle>{t("topic.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-topic"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {t("topic.actions.addNewTopic")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3">
          <span className="text-gray-500 text-sm font-semibold">
            {t("topic.list.filters")}
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
              {t("topic.list.clearAll")}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={topics?.data || []}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Topics;
