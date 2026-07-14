import { useEffect, useState } from "react";
import CustomeTable from "../../../../common/table/CustomeTable";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import TruncateText from "../../../../common/TruncateText";
import { LuFilterX } from "react-icons/lu";
import { getAllQuestions } from "../../../../../../redux/slice/assessmentQuestionSlice";
import usePermission from "../../../../../../hooks/usePermission";
import Breadcrumb from "../../../../common/layout/Breadcrumb";

const ITEMS_PER_PAGE = 10;

const Question = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const { hasPermission } = usePermission();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const { questions, isLoading, isError, message } = useSelector(
    (state) => state.question,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // const fetchQuestions = (overridePage) => {
  //   dispatch(getAllQuestions({ assessmentId }));
  // };

  const fetchQuestions = (currentPage = 1) => {
    dispatch(
      getAllQuestions({
        assessmentId,
        params: {
          page: currentPage,
          search,
        },
      }),
    );
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchQuestions(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const getTypeBadge = (type) => {
    const typeLower = type?.toLowerCase();
    if (typeLower === "mcq") return "bg-blue-100 text-blue-700";
    if (typeLower === "true_false") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const getCaseStatus = (isCase) => {
    if (isCase) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {t("question.columns.caseAvailable")}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
        {t("question.columns.caseNa")}
      </span>
    );
  };

  // Base columns
  const baseColumns = [
    {
      header: t("question.columns.id"),
      render: (row) => <p className="font-semibold text-gray-800">{row?.id}</p>,
    },
    {
      header: t("question.columns.question"),
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.question_text} maxLength={25} />
        </p>
      ),
    },
  ];

  // Add Case column only if type is module
  if (type === "module") {
    baseColumns.push({
      header: "Case",
      render: (row) => getCaseStatus(row.is_case),
    });
  }

  // Add remaining columns
  baseColumns.push(
    {
      header: t("question.columns.type"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadge(row.question_type)}`}
        >
          {row.question_type?.toUpperCase()}
        </span>
      ),
    },
    {
      header: t("question.columns.marks"),
      render: (row) => (
        <p className="font-semibold text-gray-800">{row.marks}</p>
      ),
    },
    {
      header: t("question.columns.options"),
      render: (row) => {
        const options = row.options;

        if (!options || options.length === 0) {
          return <div>-</div>;
        }

        return (
          <div className="text-sm text-gray-700 space-y-1">
            {options.slice(0, 2).map((opt) => (
              <div key={opt.id} className="max-w-[250px]">
                <TruncateText
                  text={opt.option_text}
                  maxLength={25}
                  className="inline"
                />

                {opt.is_correct ? " ✅" : ""}
              </div>
            ))}

            {options.length > 2 && (
              <div className="text-xs text-gray-400">
                +{options.length - 2} more
              </div>
            )}
          </div>
        );
      },
    },
  );

  // Add Actions column if user has permissions
  if (hasPermission("questions.edit") || hasPermission("options.view")) {
    baseColumns.push({
      header: t("question.columns.actions"),
      render: (row) => (
        <div className="flex gap-4">
          {hasPermission("questions.edit") && (
            <button
              onClick={() => navigate(`${row.id}?type=${type}`)}
              className="text-gray-800 text-lg cursor-pointer hover:text-[#184994]"
            >
              <FaEye />
            </button>
          )}

          {hasPermission("options.view") && (
            <buttona
              onClick={() =>
                navigate(
                  `/assessment-question-option/${assessmentId}/${row.id}?type=${type}`,
                )
              }
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            >
              {t("question.options")}
            </buttona>
          )}
        </div>
      ),
    });
  }

  const columns = baseColumns;

  if (isLoading && !questions?.questions?.length) return <Loader />;
  if (isError & message) return <Error message={message} />;

  if (!hasPermission("questions.view")) {
    return null;
  }

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label:
              questions?.assessment_type === "module"
                ? t("examAssessment.list.examTitle")
                : t("quizAssessment.list.quizTitle"),
            path:
              questions?.assessment_type === "module"
                ? "/exam-module"
                : "/assessment",
          },
          {
            label: t("question.columns.question"),
          },
        ]}
      />
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("question.title")}</PageTitle>
          <PageSubtitle>{t("question.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          {hasPermission("questions.create") && (
            <Link
              to={`create?type=${type}`}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-2"
            >
              <FaPlus size={14} />
              {t("question.actions.addQuestion")}
            </Link>
          )}
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        {/* <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
          <div className="w-full">
            <div className="flex items-center bg-gray-50 border border-gray-200 hover:border-blue-500 rounded-xl px-4 py-2.5">
              <FiSearch className="text-gray-400 text-base" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  t("question.list.searchPlaceholder") ||
                  "Search by question..."
                }
                className="bg-transparent outline-none px-3 text-sm w-full"
              />
              {search && (
                <button
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div> */}

        <CustomeTable
          columns={columns}
          data={questions?.questions || []}
          serverSide={true}
          currentPage={questions?.questions?.current_page || 1}
          totalPages={questions?.questions?.last_page || 1}
          totalItems={questions?.questions?.total || 0}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </PageBody>
    </PageLayout>
  );
};

export default Question;
