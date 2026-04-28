// import { useEffect, useRef, useState } from "react";
// import Select from "react-select";
// import CustomeTable from "../../../common/table/CustomeTable";
// import { Link, useNavigate } from "react-router-dom";
// import { FaEye } from "react-icons/fa";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageHeaderRight,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllTopics,
//   updateSingleTopicStatus,
// } from "../../../../../redux/slice/topicSlice";
// import { FiSearch } from "react-icons/fi";
// import Loader from "../../../common/Loader";
// import Error from "../../../common/Error";
// import TruncateText from "../../../common/TruncateText";
// import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
// import { getAllModules } from "../../../../../redux/slice/moduleSlice";
// import { getAllLevels } from "../../../../../redux/slice/levelSlice";
// import StatusToggle from "../../../common/StatusToggle";
// import { LuFilterX } from "react-icons/lu";

// const ITEMS_PER_PAGE = 5;

// const Topics = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { topics, isLoading, isError, message } = useSelector(
//     (state) => state.topic,
//   );

//   const { chapters } = useSelector((state) => state.chapter);
//   const { modules } = useSelector((state) => state.module);
//   const { levels } = useSelector((state) => state.level);

//   const levelOption = [
//     { value: "All", label: "All Level" },
//     ...(levels?.data?.map((item) => ({
//       value: item.id,
//       label: item.title,
//     })) || []),
//   ];

//   const statusOptions = [
//     { value: "all", label: "All Status" },
//     { value: "1", label: "Active" },
//     { value: "0", label: "Inactive" },
//   ];

//   const [level, setLevel] = useState(levelOption[0]);
//   const [module, setModule] = useState(null);
//   const [chapter, setChapter] = useState(null);
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   // 🔥 Level ke according modules filter kar
//   const getModuleOptions = () => {
//     if (!level || level?.value === "All") {
//       return [];
//     }

//     const filteredModules =
//       modules?.data?.filter((item) => item.level?.id === level?.value) || [];

//     return filteredModules.map((item) => ({
//       value: item.id,
//       label: item.title,
//     }));
//   };

//   // 🔥 Module ke according chapters filter kar
//   const getChapterOptions = () => {
//     if (!module || module?.value === "All" || !module?.value) {
//       return [];
//     }

//     const filteredChapters =
//       chapters?.data?.filter((item) => item.module?.id === module?.value) || [];

//     return filteredChapters.map((item) => ({
//       value: item.id,
//       label: item.title,
//     }));
//   };

//   // 🔥 Level change hone par module aur chapter reset
//   useEffect(() => {
//     setModule(null);
//     setChapter(null);
//   }, [level]);

//   // 🔥 Module change hone par chapter reset
//   useEffect(() => {
//     setChapter(null);
//   }, [module]);

//   const fetchTopics = (overridePage) => {
//     const params = {
//       search: search || "",
//       chapter_id: chapter?.value || "",
//       level_id: level?.value !== "All" ? level?.value : "",
//       module_id: module?.value || "",
//       status: status?.value !== "All" ? status?.value : "",
//       page: overridePage ?? page,
//       limit: ITEMS_PER_PAGE,
//     };
//     dispatch(getAllTopics(params));
//     dispatch(getAllChapters());
//     dispatch(getAllModules());
//     dispatch(getAllLevels());
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchTopics(1);
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [search, level, module, chapter, status]);

//   useEffect(() => {
//     fetchTopics(page);
//   }, [page]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const resetFilters = () => {
//     setLevel(levelOption[0]);
//     setModule(null);
//     setChapter(null);
//     setStatus(statusOptions[0]);
//     setSearch("");
//     setPage(1);
//   };

//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       borderRadius: "8px",
//       borderColor: "#E5E7EB",
//       minHeight: "38px",
//       boxShadow: "none",
//       cursor: state.isDisabled ? "not-allowed" : "pointer",
//       fontSize: "14px",
//       backgroundColor: state.isDisabled ? "#F1F5F9" : "#F8FAFC",
//       opacity: state.isDisabled ? 0.6 : 1,
//     }),
//   };

//   const columns = [
//     {
//       header: t("topic.list.columns.topicName"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("topic.list.columns.parentChapter"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.chapter?.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("topic.list.columns.parentModule"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row?.module?.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("topic.list.columns.parentLevel"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.level?.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("topic.list.columns.duration"),
//       render: (row) => (
//         <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
//           {row.estimated_duration ?? 0} mins
//         </span>
//       ),
//     },
//     {
//       header: t("topic.list.columns.status"),
//       render: (row) => (
//         <StatusToggle
//           value={row.status}
//           onToggle={async (newStatus) => {
//             await dispatch(
//               updateSingleTopicStatus({ id: row.id, status: newStatus }),
//             ).unwrap();
//             await fetchTopics(1);
//           }}
//         />
//       ),
//     },
//     {
//       header: t("topic.list.columns.actions"),
//       render: (row) => (
//         <button
//           onClick={() => navigate(`topic-details/${row.id}`)}
//           className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
//         >
//           <FaEye />
//         </button>
//       ),
//     },
//   ];

//   // 🔥 Disabled logic
//   const isModuleDisabled = !level || level?.value === "All";
//   const isChapterDisabled = !module || !module?.value;
//   const moduleOptions = getModuleOptions();
//   const chapterOptions = getChapterOptions();

//   if (isLoading && !topics?.data?.length) return <Loader />;
//   if (isError) return <Error message={message} />;

//   return (
//     <PageLayout>
//       <PageHeader>
//         <PageHeaderLeft>
//           <PageTitle>{t("topic.list.title")}</PageTitle>
//           <PageSubtitle>{t("topic.list.subtitle")}</PageSubtitle>
//         </PageHeaderLeft>
//         <PageHeaderRight>
//           <Link
//             to="create-topic"
//             className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
//           >
//             {t("topic.actions.addNewTopic")}
//           </Link>
//         </PageHeaderRight>
//       </PageHeader>

//       <PageBody>
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
//           <div className="w-full">
//             <div
//               className="flex items-center bg-gray-50 border border-gray-200
//       hover:border-blue-500 focus-within:border-blue-500
//       rounded-xl px-4 py-2.5 transition-all"
//             >
//               <FiSearch className="text-gray-400 text-base" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder={t("topic.list.searchPlaceholder")}
//                 className="bg-transparent outline-none px-3 text-sm w-full placeholder:text-gray-400"
//               />
//               {search && (
//                 <button
//                   onClick={() => setSearch("")}
//                   className="text-gray-400 hover:text-red-500 text-sm"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={level}
//                 onChange={setLevel}
//                 options={levelOption}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//               />
//             </div>

//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={module}
//                 onChange={setModule}
//                 options={moduleOptions}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//                 isDisabled={isModuleDisabled}
//                 placeholder={
//                   isModuleDisabled ? "Select level first" : "Select module"
//                 }
//               />
//             </div>

//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={chapter}
//                 onChange={setChapter}
//                 options={chapterOptions}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//                 isDisabled={isChapterDisabled}
//                 placeholder={
//                   isChapterDisabled ? "Select module first" : "Select chapter"
//                 }
//               />
//             </div>

//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={status}
//                 onChange={setStatus}
//                 options={statusOptions}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//               />
//             </div>

//             <div className="ml-auto flex items-center h-[40px]">
//               <div className="relative group">
//                 <button
//                   onClick={resetFilters}
//                   className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer
//       text-gray-500 hover:text-white hover:bg-red-500
//       transition-all"
//                 >
//                   <LuFilterX size={18} />
//                 </button>
//                 <div
//                   className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
//       px-2 py-1 text-xs rounded-md bg-gray-800 text-white
//       opacity-0 group-hover:opacity-100 transition-all duration-200
//       whitespace-nowrap pointer-events-none"
//                 >
//                   {t("topic.list.clearAll")}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4">
//           <CustomeTable
//             columns={columns}
//             data={topics?.data || []}
//             serverSide={true}
//             currentPage={topics?.current_page || 1}
//             totalPages={topics?.last_page || 1}
//             totalItems={topics?.total || 0}
//             itemsPerPage={ITEMS_PER_PAGE}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default Topics;

import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
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
import {
  getAllTopics,
  updateSingleTopicStatus,
} from "../../../../../redux/slice/topicSlice";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import TruncateText from "../../../common/TruncateText";
import { getAllChapters } from "../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";

const ITEMS_PER_PAGE = 5;

const Topics = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topics, isLoading, isError, message } = useSelector(
    (state) => state.topic,
  );

  const { chapters } = useSelector((state) => state.chapter);
  const { modules } = useSelector((state) => state.module);
  const { levels } = useSelector((state) => state.level);

  // ✅ Fixed: Dynamic level options with i18n
  const levelOption = [
    { value: "all", label: t("topic.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  // ✅ Fixed: Dynamic status options with i18n
  const statusOptions = [
    { value: "all", label: t("topic.filters.allStatus") },
    { value: "1", label: t("topic.filters.active") },
    { value: "0", label: t("topic.filters.inactive") },
  ];

  const [level, setLevel] = useState(levelOption[0]);
  const [moduleFilter, setModuleFilter] = useState(null);
  const [chapterFilter, setChapterFilter] = useState(null);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Get module options based on selected level
  const getModuleOptions = () => {
    if (!level || level?.value === "all") {
      return [];
    }
    const filteredModules =
      modules?.data?.filter((item) => item.level?.id === level?.value) || [];
    return filteredModules.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  // Get chapter options based on selected module
  const getChapterOptions = () => {
    if (!moduleFilter || !moduleFilter?.value) {
      return [];
    }
    const filteredChapters =
      chapters?.data?.filter(
        (item) => item.module?.id === moduleFilter?.value,
      ) || [];
    return filteredChapters.map((item) => ({
      value: item.id,
      label: item.title,
    }));
  };

  // Reset module and chapter when level changes
  useEffect(() => {
    setModuleFilter(null);
    setChapterFilter(null);
  }, [level]);

  // Reset chapter when module changes
  useEffect(() => {
    setChapterFilter(null);
  }, [moduleFilter]);

  const fetchTopics = (overridePage) => {
    const params = {
      search: search || "",
      chapter_id: chapterFilter?.value || "",
      level_id: level?.value !== "all" ? level?.value : "",
      module_id: moduleFilter?.value || "",
      status: status?.value !== "all" ? status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllTopics(params));
    dispatch(getAllChapters());
    dispatch(getAllModules());
    dispatch(getAllLevels());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchTopics(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, level, moduleFilter, chapterFilter, status]);

  useEffect(() => {
    fetchTopics(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setLevel(levelOption[0]);
    setModuleFilter(null);
    setChapterFilter(null);
    setStatus(statusOptions[0]);
    setSearch("");
    setPage(1);
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      fontSize: "14px",
      backgroundColor: state.isDisabled ? "#F1F5F9" : "#F8FAFC",
      opacity: state.isDisabled ? 0.6 : 1,
    }),
  };

  const isModuleDisabled = !level || level?.value === "all";
  const isChapterDisabled = !moduleFilter || !moduleFilter?.value;
  const moduleOptions = getModuleOptions();
  const chapterOptions = getChapterOptions();

  const columns = [
    {
      header: t("topic.list.columns.topicName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentChapter"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.chapter?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.module?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.level?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("topic.list.columns.duration"),
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {row.estimated_duration ?? 0} {t("topic.list.minutes")}
        </span>
      ),
    },
    {
      header: t("topic.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleTopicStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchTopics(1);
          }}
        />
      ),
    },
    {
      header: t("topic.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`topic-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer hover:text-[#184994] transition-colors"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !topics?.data?.length) return <Loader />;
  if (isError) return <Error message={message} />;

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
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
          >
            {t("topic.actions.addNewTopic")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
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
                placeholder={t("topic.list.searchPlaceholder")}
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={level}
                onChange={setLevel}
                options={levelOption}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={moduleFilter}
                onChange={setModuleFilter}
                options={moduleOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isModuleDisabled}
                placeholder={
                  isModuleDisabled
                    ? t("topic.filters.selectLevelFirst")
                    : t("topic.filters.selectModule")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={chapterFilter}
                onChange={setChapterFilter}
                options={chapterOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isChapterDisabled}
                placeholder={
                  isChapterDisabled
                    ? t("topic.filters.selectModuleFirst")
                    : t("topic.filters.selectChapter")
                }
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={status}
                onChange={setStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <div className="ml-auto flex items-center h-[40px]">
              <div className="relative group">
                <button
                  onClick={resetFilters}
                  className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer
                  text-gray-500 hover:text-white hover:bg-red-500 transition-all"
                >
                  <LuFilterX size={18} />
                </button>
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-2 py-1 text-xs rounded-md bg-gray-800 text-white
                  opacity-0 group-hover:opacity-100 transition-all duration-200
                  whitespace-nowrap pointer-events-none"
                >
                  {t("topic.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={topics?.data || []}
            serverSide={true}
            currentPage={topics?.current_page || 1}
            totalPages={topics?.last_page || 1}
            totalItems={topics?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>

        {/* ========== COMMENTED CODE - STATS CARDS (FUTURE USE) ==========
        <div className="flex gap-4 w-full mt-4">
          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("topic.stats.totalTopics.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {topics?.total || 0}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("topic.stats.totalTopics.subtext")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("topic.stats.activeTopics.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {topics?.data?.filter(t => t.status)?.length || 0}
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("topic.stats.activeTopics.subtext")}
            </p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
            <h3 className="text-[#6B7280] text-sm font-medium">
              {t("topic.stats.avgDuration.title")}
            </h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {Math.round(topics?.data?.reduce((sum, t) => sum + (t.estimated_duration || 0), 0) / (topics?.data?.length || 1)) || 0} mins
            </p>
            <p className="text-sm text-[#6B7280] mt-1">
              {t("topic.stats.avgDuration.subtext")}
            </p>
          </div>
        </div>
        ========== END COMMENTED CODE ========== */}
      </PageBody>
    </PageLayout>
  );
};

export default Topics;
