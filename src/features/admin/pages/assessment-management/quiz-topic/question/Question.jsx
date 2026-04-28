// import { useEffect, useState } from "react";
// import CustomeTable from "../../../../common/table/CustomeTable";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { FaEye, FaPlus } from "react-icons/fa";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageHeaderRight,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { FiSearch } from "react-icons/fi";
// import Loader from "../../../../common/Loader";
// import Error from "../../../../common/Error";
// import TruncateText from "../../../../common/TruncateText";
// import { LuFilterX } from "react-icons/lu";
// import {
//   getAllQuestions,
//   deleteQuestion,
// } from "../../../../../../redux/slice/assessmentQuestionSlice";

// const ITEMS_PER_PAGE = 10;

// const Question = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { assessmentId } = useParams();

//   const { questions, isLoading, isError, message } = useSelector(
//     (state) => state.question,
//   );

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   // Fetch questions
//   const fetchQuestions = (overridePage) => {
//     dispatch(getAllQuestions({ assessmentId }));
//   };

//   // Search debounce
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchQuestions(1);
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [search]);

//   // Page change
//   useEffect(() => {
//     fetchQuestions(page);
//   }, [page]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setPage(1);
//   };

//   const columns = [
//     {
//       header: t("question.columns.id"),
//       render: (row, index) => (
//         <p className="font-semibold text-gray-800">{row?.id}</p>
//       ),
//     },
//     {
//       header: t("question.columns.question"),
//       render: (row) => (
//         <p className="font-semibold text-gray-800">
//           <TruncateText text={row.question_text} maxLength={50} />
//         </p>
//       ),
//     },
//     {
//       header: t("question.columns.type"),
//       render: (row) => {
//         const type = row.question_type?.toLowerCase();

//         return (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-semibold ${
//               type === "mcq"
//                 ? "bg-blue-100 text-blue-600"
//                 : type === "true_false"
//                   ? "bg-green-100 text-green-600"
//                   : "bg-purple-100 text-purple-600"
//             }`}
//           >
//             {type?.toUpperCase()}
//           </span>
//         );
//       },
//     },
//     {
//       header: t("question.columns.marks"),
//       render: (row) => (
//         <p className="font-semibold text-gray-800">{row.marks}</p>
//       ),
//     },
//     {
//       header: "Options",
//       render: (row) => {
//         const options = row.options;

//         if (!options || options.length === 0) {
//           return <div className="text-sm text-gray-700">-</div>;
//         }

//         return (
//           <div className="text-sm text-gray-700">
//             {options.map((opt, i) => (
//               <div key={opt.id}>
//                 {i + 1}. {opt.option_text} {opt.is_correct ? "✅" : ""}
//               </div>
//             ))}
//           </div>
//         );
//       },
//     },
//     {
//       header: t("question.columns.actions"),
//       render: (row) => (
//         console.log("row", row),
//         (
//           <div className="flex gap-4">
//             <button
//               onClick={() =>
//                 navigate(
//                   `/assessment-question/${assessmentId}/create/${row.id}`,
//                 )
//               }
//               className="text-gray-800 text-lg cursor-pointer hover:text-[#184994]"
//             >
//               <FaEye />
//             </button>
//             <button
//               onClick={() =>
//                 navigate(
//                   `/assessment-question-option/${assessmentId}/${row.id}`,
//                 )
//               }
//               className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
//             >
//               {t("question.options")}
//             </button>
//           </div>
//         )
//       ),
//     },
//   ];

//   if (isLoading && !questions?.length) return <Loader />;
//   if (isError) return <Error message={message} />;

//   return (
//     <PageLayout>
//       <PageHeader>
//         <PageHeaderLeft>
//           <PageTitle>{t("question.title")}</PageTitle>
//           <PageSubtitle>{t("question.subtitle")}</PageSubtitle>
//         </PageHeaderLeft>
//         <PageHeaderRight>
//           <Link
//             to="create"
//             className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-2"
//           >
//             <FaPlus size={14} />
//             {t("question.actions.addQuestion")}
//           </Link>
//         </PageHeaderRight>
//       </PageHeader>

//       <PageBody>
//         <div className="mt-4">
//           <CustomeTable
//             columns={columns}
//             data={questions || []}
//             serverSide={true}
//             currentPage={questions?.current_page || 1}
//             totalPages={questions?.last_page || 1}
//             totalItems={questions?.total || 0}
//             itemsPerPage={ITEMS_PER_PAGE}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default Question;

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
import { getAllQuestions } from "../../../../../../redux/slice/assessmentQuestionSlice";

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

  const fetchQuestions = (overridePage) => {
    dispatch(getAllQuestions({ assessmentId }));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchQuestions(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // useEffect(() => {
  //   fetchQuestions(page);
  // }, [page]);

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

  const columns = [
    {
      header: t("question.columns.id"),
      render: (row) => <p className="font-semibold text-gray-800">{row?.id}</p>,
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
      header: t("question.columns.negativeMarks"),
      render: (row) => (
        <p className="font-semibold text-gray-800">{row.negative_marks || 0}</p>
      ),
    },
    {
      header: t("question.columns.options"),
      render: (row) => {
        const options = row.options;
        if (!options || options.length === 0) return <div>-</div>;
        return (
          <div className="text-sm text-gray-700">
            {options.slice(0, 2).map((opt, i) => (
              <div key={opt.id}>
                {String.fromCharCode(65 + i)}. {opt.option_text}{" "}
                {opt.is_correct ? "✅" : ""}
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
    {
      header: t("question.columns.actions"),
      render: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`create/${row.id}`)}
            className="text-gray-800 text-lg cursor-pointer hover:text-[#184994]"
          >
            <FaEye />
          </button>
          <button
            onClick={() =>
              navigate(`/assessment-question-option/${assessmentId}/${row.id}`)
            }
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
          >
            {t("question.options")}
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !questions?.length) return <Loader />;
  if (isError & message) return <Error message={message} />;

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
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
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
        </div>

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
      </PageBody>
    </PageLayout>
  );
};

export default Question;
