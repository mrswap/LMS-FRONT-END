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
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import TruncateText from "../../../../common/TruncateText";
import { getAllOptions } from "../../../../../../redux/slice/assessmentOptionSlice";

const ITEMS_PER_PAGE = 10;

const Option = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assessmentId, questionId } = useParams();

  const { options, isLoading, isError, message } = useSelector(
    (state) => state.option,
  );

  console.log("options", options);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [questionData, setQuestionData] = useState(null);

  const fetchOptions = () => {
    if (questionId) {
      dispatch(getAllOptions(1));
    }
  };

  const fetchQuestionDetails = async () => {
    // You'll need to dispatch a question fetch action here
    // For now, let's assume you have the question data from somewhere
    // Or you can extract it from your route state
    if (questionId) {
      // Example: dispatch(getQuestionById(questionId));
    }
  };

  // Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchOptions();
    }, 500);
    return () => clearTimeout(delay);
  }, [search, questionId]);

  // Page change
  useEffect(() => {
    fetchOptions();
  }, [page, questionId]);

  useEffect(() => {
    fetchQuestionDetails();
  }, [questionId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setPage(1);
  };

  // Table columns with question column added
  const columns = [
    {
      header: t("option.columns.id"),
      render: (row) => <p className="font-semibold text-gray-800">{row?.id}</p>,
    },
    {
      header: t("option.columns.question"),
      render: (row) => (
        <div className="font-semibold text-gray-800">
          <p className="mb-1"> {options?.question?.question_text}</p>
        </div>
      ),
    },
    {
      header: t("option.columns.option"),
      render: (row) => (
        <p className="font-semibold text-gray-800">
          <TruncateText text={row.option_text} maxLength={50} />
        </p>
      ),
    },
    {
      header: t("option.columns.isCorrect"),
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.is_correct
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.is_correct ? "Correct" : "Wrong"}
        </span>
      ),
    },
    {
      header: t("option.columns.actions"),
      render: (row) => (
        console.log("row", row),
        (
          <div className="flex gap-4">
            <button
              onClick={() =>
                navigate(
                  `/assessment-question-option/${assessmentId}/${questionId}/option-details/${row.id}`,
                )
              }
              className="text-gray-800 text-lg cursor-pointer hover:text-[#184994]"
            >
              <FaEye />
            </button>
          </div>
        )
      ),
    },
  ];

  if (isLoading && !options?.options?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("option.title")}</PageTitle>
          <PageSubtitle>{t("option.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to={`create`} // Pass questionId to create page
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <FaPlus size={14} />
            {t("option.actions.addOption")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={options?.options || []}
            serverSide={true}
            currentPage={options?.options?.current_page || 1}
            totalPages={options?.options?.last_page || 1}
            totalItems={options?.options?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Option;
