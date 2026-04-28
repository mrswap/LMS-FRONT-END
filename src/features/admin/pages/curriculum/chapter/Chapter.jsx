// import { useEffect, useState } from "react";
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
//   getAllChapters,
//   updateSingleChapterStatus,
// } from "../../../../../redux/slice/chapterSlice";
// import { getAllModules } from "../../../../../redux/slice/moduleSlice";
// import { getAllLevels } from "../../../../../redux/slice/levelSlice";
// import { FiSearch } from "react-icons/fi";
// import Loader from "../../../common/Loader";
// import Error from "../../../common/Error";
// import TruncateText from "../../../common/TruncateText";
// import StatusToggle from "../../../common/StatusToggle";
// import { LuFilterX } from "react-icons/lu";

// const ITEMS_PER_PAGE = 5;

// const Chapters = () => {
//   const { t } = useTranslation();
//   const { chapters, isLoading, isError, message } = useSelector(
//     (state) => state.chapter,
//   );
//   const { modules } = useSelector((state) => state.module);
//   const { levels } = useSelector((state) => state.level);
//   const dispatch = useDispatch();

//   const levelOption = [
//     { value: "all", label: t("chapter.filters.allLevels") },
//     ...(levels?.data?.map((item) => ({
//       value: item.id,
//       label: item.title,
//     })) || []),
//   ];

//   const statusOptions = [
//     { value: "all", label: t("chapter.filters.allStatus") },
//     { value: "1", label: t("chapter.filters.active") },
//     { value: "0", label: t("chapter.filters.inactive") },
//   ];

//   const getFilteredModuleOptions = () => {
//     if (level?.value === "all") {
//       return [
//         { value: "all", label: t("chapter.filters.allModules") },
//         ...(modules?.data?.map((item) => ({
//           value: item.id,
//           label: item.title,
//         })) || []),
//       ];
//     }

//     const filteredModules =
//       modules?.data?.filter((item) => item.level?.id === level?.value) || [];

//     return [
//       { value: "all", label: t("chapter.filters.allModules") },
//       ...filteredModules.map((item) => ({
//         value: item.id,
//         label: item.title,
//       })),
//     ];
//   };

//   const [moduleFilter, setModuleFilter] = useState({
//     value: "all",
//     label: t("chapter.filters.allModules"),
//   });
//   const [level, setLevel] = useState(levelOption[0]);
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const navigate = useNavigate();

//   // Reset module filter when level changes
//   useEffect(() => {
//     setModuleFilter({ value: "all", label: t("chapter.filters.allModules") });
//   }, [level]);

//   const fetchChapters = (overridePage) => {
//     const params = {
//       search: search || "",
//       level_id: level?.value !== "all" ? level?.value : "",
//       module_id: moduleFilter?.value !== "all" ? moduleFilter?.value : "",
//       status: status?.value !== "all" ? status?.value : "all",
//       page: overridePage ?? page,
//       limit: ITEMS_PER_PAGE,
//     };
//     dispatch(getAllChapters(params));
//     dispatch(getAllModules());
//     dispatch(getAllLevels());
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchChapters(1);
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [search, status, moduleFilter, level]);

//   useEffect(() => {
//     fetchChapters(page);
//   }, [page]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const resetFilters = () => {
//     setLevel(levelOption[0]);
//     setModuleFilter({ value: "all", label: t("chapter.filters.allModules") });
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

//   const isModuleDisabled = level?.value === "all";

//   const columns = [
//     {
//       header: t("chapter.list.columns.chapterName"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("chapter.list.columns.parentModule"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.module?.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("chapter.list.columns.parentLevel"),
//       render: (row) => (
//         <div>
//           <p className="font-semibold text-gray-800">
//             <TruncateText text={row.level?.title} maxLength={25} />
//           </p>
//         </div>
//       ),
//     },
//     {
//       header: t("chapter.list.columns.totalTopics"),
//       render: (row) => (
//         <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
//           {row.topics_count || 0}
//         </span>
//       ),
//     },
//     {
//       header: t("chapter.list.columns.duration"),
//       render: (row) => (
//         <span className="text-gray-600">
//           {row.duration || t("chapter.list.notSpecified")}
//         </span>
//       ),
//     },
//     {
//       header: t("chapter.list.columns.status"),
//       render: (row) => (
//         <StatusToggle
//           value={row.status}
//           onToggle={async (newStatus) => {
//             await dispatch(
//               updateSingleChapterStatus({ id: row.id, status: newStatus }),
//             ).unwrap();
//             await fetchChapters(1);
//           }}
//         />
//       ),
//     },
//     {
//       header: t("chapter.list.columns.actions"),
//       render: (row) => (
//         <button
//           onClick={() => navigate(`chapter-details/${row.id}`)}
//           className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
//         >
//           <FaEye />
//         </button>
//       ),
//     },
//   ];

//   if (isLoading && !chapters?.data?.length) return <Loader />;
//   if (isError) return <Error message={message} />;

//   return (
//     <PageLayout>
//       <PageHeader>
//         <PageHeaderLeft>
//           <PageTitle>{t("chapter.list.title")}</PageTitle>
//           <PageSubtitle>{t("chapter.list.subtitle")}</PageSubtitle>
//         </PageHeaderLeft>
//         <PageHeaderRight>
//           <Link
//             to="create-chapter"
//             className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
//           >
//             {t("chapter.actions.addNewChapter")}
//           </Link>
//         </PageHeaderRight>
//       </PageHeader>

//       <PageBody>
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
//           <div className="w-full">
//             <div
//               className="flex items-center bg-gray-50 border border-gray-200
//               hover:border-blue-500 focus-within:border-blue-500
//               rounded-xl px-4 py-2.5 transition-all"
//             >
//               <FiSearch className="text-gray-400 text-base" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder={t("chapter.list.searchPlaceholder")}
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
//                 value={moduleFilter}
//                 onChange={setModuleFilter}
//                 options={getFilteredModuleOptions()}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//                 isDisabled={isModuleDisabled}
//                 placeholder={
//                   isModuleDisabled
//                     ? t("chapter.filters.selectLevelFirst")
//                     : t("chapter.filters.selectModule")
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
//                   text-gray-500 hover:text-white hover:bg-red-500 transition-all"
//                 >
//                   <LuFilterX size={18} />
//                 </button>
//                 <div
//                   className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
//                   px-2 py-1 text-xs rounded-md bg-gray-800 text-white
//                   opacity-0 group-hover:opacity-100 transition-all duration-200
//                   whitespace-nowrap pointer-events-none"
//                 >
//                   {t("chapter.list.clearAll")}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4">
//           <CustomeTable
//             columns={columns}
//             data={chapters?.data || []}
//             serverSide={true}
//             currentPage={chapters?.current_page || 1}
//             totalPages={chapters?.last_page || 1}
//             totalItems={chapters?.total || 0}
//             itemsPerPage={ITEMS_PER_PAGE}
//             onPageChange={handlePageChange}
//           />
//         </div>

//         {/* ========== COMMENTED CODE - STATS CARDS (FUTURE USE) ==========
//         <div className="flex gap-4 w-full mt-4">
//           <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
//             <h3 className="text-[#6B7280] text-sm font-medium">
//               {t("chapter.stats.totalChapters.title")}
//             </h3>
//             <p className="text-2xl font-bold text-gray-800 mt-2">
//               {chapters?.total || 0}
//             </p>
//             <p className="text-sm text-[#6B7280] mt-1">
//               {t("chapter.stats.totalChapters.subtext")}
//             </p>
//           </div>

//           <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
//             <h3 className="text-[#6B7280] text-sm font-medium">
//               {t("chapter.stats.activeChapters.title")}
//             </h3>
//             <p className="text-2xl font-bold text-gray-800 mt-2">
//               {chapters?.data?.filter(c => c.status)?.length || 0}
//             </p>
//             <p className="text-sm text-[#6B7280] mt-1">
//               {t("chapter.stats.activeChapters.subtext")}
//             </p>
//           </div>

//           <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sm transition">
//             <h3 className="text-[#6B7280] text-sm font-medium">
//               {t("chapter.stats.totalTopics.title")}
//             </h3>
//             <p className="text-2xl font-bold text-gray-800 mt-2">
//               {chapters?.data?.reduce((sum, c) => sum + (c.topics_count || 0), 0) || 0}
//             </p>
//             <p className="text-sm text-[#6B7280] mt-1">
//               {t("chapter.stats.totalTopics.subtext")}
//             </p>
//           </div>
//         </div>
//         ========== END COMMENTED CODE ========== */}
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default Chapters;

import { useEffect, useState } from "react";
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
  getAllChapters,
  updateSingleChapterStatus,
} from "../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import TruncateText from "../../../common/TruncateText";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";

const ITEMS_PER_PAGE = 5;

const Chapters = () => {
  const { t } = useTranslation();
  const { chapters, isLoading, isError, message } = useSelector(
    (state) => state.chapter,
  );
  const { modules } = useSelector((state) => state.module);
  const { levels } = useSelector((state) => state.level);
  const dispatch = useDispatch();

  const levelOption = [
    { value: "all", label: t("chapter.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: t("chapter.filters.allStatus") },
    { value: "1", label: t("chapter.filters.active") },
    { value: "0", label: t("chapter.filters.inactive") },
  ];

  const getFilteredModuleOptions = () => {
    if (level?.value === "all") {
      return [
        { value: "all", label: t("chapter.filters.allModules") },
        ...(modules?.data?.map((item) => ({
          value: item.id,
          label: item.title,
        })) || []),
      ];
    }

    const filteredModules =
      modules?.data?.filter((item) => item.level?.id === level?.value) || [];

    return [
      { value: "all", label: t("chapter.filters.allModules") },
      ...filteredModules.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    ];
  };

  const [moduleFilter, setModuleFilter] = useState({
    value: "all",
    label: t("chapter.filters.allModules"),
  });
  const [level, setLevel] = useState(levelOption[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const navigate = useNavigate();

  // Reset module filter when level changes
  useEffect(() => {
    setModuleFilter({ value: "all", label: t("chapter.filters.allModules") });
  }, [level]);

  // Load levels on component mount
  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  // Load modules only when level is selected (not "all")
  useEffect(() => {
    if (isLevelsLoaded && level?.value !== "all") {
      dispatch(getAllModules());
    }
  }, [level, isLevelsLoaded, dispatch]);

  const fetchChapters = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value !== "all" ? level?.value : "",
      module_id: moduleFilter?.value !== "all" ? moduleFilter?.value : "",
      status: status?.value !== "all" ? status?.value : "all",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllChapters(params));
  };

  // Fetch chapters when filters change
  useEffect(() => {
    if (!isLevelsLoaded) return;

    const delay = setTimeout(() => {
      setPage(1);
      fetchChapters(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status, moduleFilter, level, isLevelsLoaded]);

  // Fetch chapters on page change
  useEffect(() => {
    if (isLevelsLoaded) {
      fetchChapters(page);
    }
  }, [page, isLevelsLoaded]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setLevel(levelOption[0]);
    setModuleFilter({ value: "all", label: t("chapter.filters.allModules") });
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

  const isModuleDisabled = level?.value === "all";

  const columns = [
    {
      header: t("chapter.list.columns.chapterName"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.parentModule"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.module?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.parentLevel"),
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">
            <TruncateText text={row.level?.title} maxLength={25} />
          </p>
        </div>
      ),
    },
    {
      header: t("chapter.list.columns.totalTopics"),
      render: (row) => (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          {row.topics_count || 0}
        </span>
      ),
    },
    {
      header: t("chapter.list.columns.duration"),
      render: (row) => (
        <span className="text-gray-600">
          {row.duration || t("chapter.list.notSpecified")}
        </span>
      ),
    },
    {
      header: t("chapter.list.columns.status"),
      render: (row) => (
        <StatusToggle
          value={row.status}
          onToggle={async (newStatus) => {
            await dispatch(
              updateSingleChapterStatus({ id: row.id, status: newStatus }),
            ).unwrap();
            await fetchChapters(1);
          }}
        />
      ),
    },
    {
      header: t("chapter.list.columns.actions"),
      render: (row) => (
        <button
          onClick={() => navigate(`chapter-details/${row.id}`)}
          className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  if (isLoading && !chapters?.data?.length && !isLevelsLoaded)
    return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("chapter.list.title")}</PageTitle>
          <PageSubtitle>{t("chapter.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-chapter"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
          >
            {t("chapter.actions.addNewChapter")}
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
                placeholder={t("chapter.list.searchPlaceholder")}
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
                isLoading={!isLevelsLoaded}
              />
            </div>

            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={moduleFilter}
                onChange={setModuleFilter}
                options={getFilteredModuleOptions()}
                styles={customSelectStyles}
                isSearchable={false}
                isDisabled={isModuleDisabled}
                isLoading={
                  !isModuleDisabled && !modules?.data && level?.value !== "all"
                }
                placeholder={
                  isModuleDisabled
                    ? t("chapter.filters.selectLevelFirst")
                    : t("chapter.filters.selectModule")
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
                  {t("chapter.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={chapters?.data || []}
            serverSide={true}
            currentPage={chapters?.current_page || 1}
            totalPages={chapters?.last_page || 1}
            totalItems={chapters?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default Chapters;
