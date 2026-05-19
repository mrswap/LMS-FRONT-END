// import { useEffect, useState } from "react";
// import Select from "react-select";
// import { FiSearch } from "react-icons/fi";
// import { LuFilterX } from "react-icons/lu";
// import CustomeTable from "../../../common/table/CustomeTable";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageHeaderRight,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../common/layout";

// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../../common/Loader";
// import Error from "../../../common/Error";
// import { getAllLevels } from "../../../../../redux/slice/levelSlice";
// import { getAllImportLogs } from "../../../../../redux/slice/automatedContentSlicer";

// const ITEMS_PER_PAGE = 10;

// const AutomatedContentImporter = () => {
//   const dispatch = useDispatch();
//   const { importLogs, isLoading, isError, message } = useSelector(
//     (state) => state.automated,
//   );
//   const { levels } = useSelector((state) => state.level);
//   const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);

//   const levelOptions = [
//     { value: "all", label: "All Levels" },

//     ...(levels?.data?.map((item) => ({
//       value: item.id,
//       label: item.title,
//     })) || []),
//   ];

//   const statusOptions = [
//     { value: "all", label: "All Status" },
//     { value: "completed", label: "Completed" },
//     { value: "processing", label: "Processing" },
//     { value: "failed", label: "Failed" },
//   ];

//   const [level, setLevel] = useState(levelOptions[0]);
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const loadLevels = async () => {
//       await dispatch(getAllLevels());
//       setIsLevelsLoaded(true);
//     };
//     loadLevels();
//   }, [dispatch]);

//   const fetchImportLogs = (overridePage) => {
//     const params = {
//       search: search || "",
//       level_id: level?.value !== "all" ? level?.value : "",
//       status: status?.value !== "all" ? status?.value : "",
//       page: overridePage ?? page,
//       limit: ITEMS_PER_PAGE,
//     };

//     dispatch(getAllImportLogs(params));
//   };

//   useEffect(() => {
//     if (!isLevelsLoaded) return;
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchImportLogs(1);
//     }, 500);

//     return () => clearTimeout(delay);
//   }, [search, level, status, isLevelsLoaded]);

//   useEffect(() => {
//     if (isLevelsLoaded) {
//       fetchImportLogs(page);
//     }
//   }, [page, isLevelsLoaded]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const resetFilters = () => {
//     setSearch("");
//     setLevel(levelOptions[0]);
//     setStatus(statusOptions[0]);
//     setPage(1);
//   };

//   const customSelectStyles = {
//     control: (base) => ({
//       ...base,
//       borderRadius: "8px",
//       borderColor: "#E5E7EB",
//       minHeight: "38px",
//       boxShadow: "none",
//       backgroundColor: "#F8FAFC",
//       fontSize: "14px",
//     }),
//   };

//   const columns = [
//     {
//       header: "Program",
//       render: (row) => (
//         <p className="font-medium text-gray-800">{row.program?.title || "-"}</p>
//       ),
//     },
//     {
//       header: "Level",
//       render: (row) => (
//         <p className="text-gray-700">{row.level?.title || "-"}</p>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold
//           ${
//             row.status === "completed"
//               ? "bg-green-100 text-green-600"
//               : row.status === "failed"
//                 ? "bg-red-100 text-red-600"
//                 : "bg-yellow-100 text-yellow-600"
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       header: "Created By",
//       render: (row) => (
//         <span className="text-sm text-gray-700">
//           {row.created_by?.name || "-"}
//         </span>
//       ),
//     },
//     {
//       header: "Created At",
//       render: (row) => (
//         <span className="text-sm text-gray-600">
//           {new Date(row.created_at).toLocaleString()}
//         </span>
//       ),
//     },
//   ];

//   if (isLoading && !importLogs?.data?.length) {
//     return <Loader />;
//   }

//   if (isError) {
//     return <Error message={message} />;
//   }

//   return (
//     <PageLayout>
//       <PageHeader>
//         <PageHeaderLeft>
//           <PageTitle>Automated Content Importer</PageTitle>
//           <PageSubtitle>Manage and monitor automated import logs</PageSubtitle>
//         </PageHeaderLeft>

//         <PageHeaderRight>
//           <Link
//             to="create"
//             className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
//           >
//             Create Import
//           </Link>
//         </PageHeaderRight>
//       </PageHeader>

//       <PageBody>
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
//           {/* SEARCH */}
//           <div className="w-full">
//             <div
//               className="flex items-center bg-gray-50 border border-gray-200
//               rounded-xl px-4 py-2.5"
//             >
//               <FiSearch className="text-gray-400 text-base" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search imports..."
//                 className="bg-transparent outline-none px-3 text-sm w-full"
//               />
//             </div>
//           </div>

//           {/* FILTERS */}
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={level}
//                 onChange={setLevel}
//                 options={levelOptions}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//                 isLoading={!isLevelsLoaded}
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

//             <div className="ml-auto">
//               <button
//                 onClick={resetFilters}
//                 className="flex items-center justify-center w-9 h-9 rounded-lg
//                 text-gray-500 hover:text-white hover:bg-red-500 transition-all"
//               >
//                 <LuFilterX size={18} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="mt-4">
//           <CustomeTable
//             columns={columns}
//             data={importLogs?.data || []}
//             serverSide={true}
//             currentPage={importLogs?.current_page || 1}
//             totalPages={importLogs?.last_page || 1}
//             totalItems={importLogs?.total || 0}
//             itemsPerPage={ITEMS_PER_PAGE}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default AutomatedContentImporter;

import { useEffect, useState } from "react";
import Select from "react-select";
import { FiSearch } from "react-icons/fi";
import { LuFilterX } from "react-icons/lu";
import CustomeTable from "../../../common/table/CustomeTable";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { getAllLevels } from "../../../../../redux/slice/levelSlice";
import { getAllImportLogs } from "../../../../../redux/slice/automatedContentSlicer";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";

const ITEMS_PER_PAGE = 10;

const AutomatedContentImporter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { importLogs, isLoading, isError, message } = useSelector(
    (state) => state.automated,
  );
  const { levels } = useSelector((state) => state.level);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const { hasPermission } = usePermission();

  const levelOptions = [
    { value: "all", label: t("automatedImporter.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const statusOptions = [
    { value: "all", label: t("automatedImporter.filters.allStatus") },
    { value: "completed", label: t("automatedImporter.filters.completed") },
    { value: "processing", label: t("automatedImporter.filters.processing") },
    { value: "failed", label: t("automatedImporter.filters.failed") },
  ];

  const [level, setLevel] = useState(levelOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  const fetchImportLogs = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value !== "all" ? level?.value : "",
      status: status?.value !== "all" ? status?.value : "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };

    dispatch(getAllImportLogs(params));
  };

  useEffect(() => {
    if (!isLevelsLoaded) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchImportLogs(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, level, status, isLevelsLoaded]);

  useEffect(() => {
    if (isLevelsLoaded) {
      fetchImportLogs(page);
    }
  }, [page, isLevelsLoaded]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setLevel(levelOptions[0]);
    setStatus(statusOptions[0]);
    setPage(1);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      backgroundColor: "#F8FAFC",
      fontSize: "14px",
    }),
  };

  const getStatusBadgeClass = (statusValue) => {
    if (statusValue === "completed") {
      return "bg-green-100 text-green-600";
    }
    if (statusValue === "failed") {
      return "bg-red-100 text-red-600";
    }
    return "bg-yellow-100 text-yellow-600";
  };

  const getStatusLabel = (statusValue) => {
    if (statusValue === "completed") {
      return t("automatedImporter.status.completed");
    }
    if (statusValue === "failed") {
      return t("automatedImporter.status.failed");
    }
    if (statusValue === "processing") {
      return t("automatedImporter.status.processing");
    }
    return statusValue;
  };

  const columns = [
    {
      header: t("automatedImporter.columns.program"),
      render: (row) => (
        <p className="font-medium text-gray-800">{row.program?.title || "-"}</p>
      ),
    },
    {
      header: t("automatedImporter.columns.level"),
      render: (row) => (
        <p className="text-gray-700">{row.level?.title || "-"}</p>
      ),
    },
    {
      header: t("automatedImporter.columns.status"),
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(row.status)}`}
        >
          {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      header: t("automatedImporter.columns.createdBy"),
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.created_by?.name || "-"}
        </span>
      ),
    },
    {
      header: t("automatedImporter.columns.createdAt"),
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  if (isLoading && !importLogs?.data?.length) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={message} />;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("automatedImporter.list.title")}</PageTitle>
          <PageSubtitle>{t("automatedImporter.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>

        <PageHeaderRight>
          {hasPermission("imports.create") && (
            <Link
              to="create"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {t("automatedImporter.actions.createImport")}
            </Link>
          )}
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="w-full">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <FiSearch className="text-gray-400 text-base" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("automatedImporter.searchPlaceholder")}
                className="bg-transparent outline-none px-3 text-sm w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[48%] lg:w-[210px]">
              <Select
                value={level}
                onChange={setLevel}
                options={levelOptions}
                styles={customSelectStyles}
                isSearchable={false}
                isLoading={!isLevelsLoaded}
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

            <div className="ml-auto">
              <button
                onClick={resetFilters}
                className="flex items-center justify-center w-9 h-9 rounded-lg
                text-gray-500 hover:text-white hover:bg-red-500 transition-all"
              >
                <LuFilterX size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={importLogs?.data || []}
            serverSide={true}
            currentPage={importLogs?.current_page || 1}
            totalPages={importLogs?.last_page || 1}
            totalItems={importLogs?.total || 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default AutomatedContentImporter;
