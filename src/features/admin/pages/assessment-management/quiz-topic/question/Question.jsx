import { useEffect, useState } from "react";
import CustomeTable from "../../../../common/table/CustomeTable";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import {
  getAllQuestions,
  deleteQuestion,
} from "../../../../../../redux/slice/assessmentQuestionSlice";

const ITEMS_PER_PAGE = 10;

const Question = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assessmentId } = useParams();

  const { questions, isLoading, isError, message } = useSelector(
    (state) => state.question,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch questions
  const fetchQuestions = (overridePage) => {
    dispatch(getAllQuestions({ assessmentId }));
  };

  // Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchQuestions(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // Page change
  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setPage(1);
  };

  const columns = [
    {
      header: t("question.columns.id"),
      render: (row, index) => (
        <p className="font-semibold text-gray-800">{row?.id}</p>
      ),
    },
    {
      header: t("question.columns.question"),
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.question_text} maxLength={50} />
        </p>
      ),
    },
    {
      header: t("question.columns.type"),
      render: (row) => {
        const type = row.question_type?.toLowerCase();

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              type === "mcq"
                ? "bg-blue-100 text-blue-600"
                : type === "true_false"
                  ? "bg-green-100 text-green-600"
                  : "bg-purple-100 text-purple-600"
            }`}
          >
            {type?.toUpperCase()}
          </span>
        );
      },
    },
    {
      header: t("question.columns.marks"),
      render: (row) => (
        <p className="font-semibold text-gray-800">{row.marks}</p>
      ),
    },
    {
      header: "Options",
      render: (row) => {
        const options = row.options;

        if (!options || options.length === 0) {
          return <div className="text-sm text-gray-700">-</div>;
        }

        return (
          <div className="text-sm text-gray-700">
            {options.map((opt, i) => (
              <div key={opt.id}>
                {i + 1}. {opt.option_text} {opt.is_correct ? "✅" : ""}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: t("question.columns.actions"),
      render: (row) => (
        console.log("row", row),
        (
          <div className="flex gap-4">
            <button
              onClick={() =>
                navigate(
                  `/assessment-question/${assessmentId}/create/${row.id}`,
                )
              }
              className="text-gray-800 text-lg cursor-pointer hover:text-[#184994]"
            >
              <FaEye />
            </button>
            <button
              onClick={() =>
                navigate(
                  `/assessment-question-option/${assessmentId}/${row.id}`,
                )
              }
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
            >
              {t("question.options")}
            </button>
          </div>
        )
      ),
    },
  ];

  if (isLoading && !questions?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("question.title")}</PageTitle>
          <PageSubtitle>{t("question.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-2"
          >
            <FaPlus size={14} />
            {t("question.actions.addQuestion")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={questions || []}
            serverSide={true}
            currentPage={questions?.current_page || 1}
            totalPages={questions?.last_page || 1}
            totalItems={questions?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Question;
