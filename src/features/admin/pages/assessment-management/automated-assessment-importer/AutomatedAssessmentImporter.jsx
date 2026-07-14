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
// import { getAllModules } from "../../../../../redux/slice/moduleSlice";
// import usePermission from "../../../../../hooks/usePermission";
// import { getAllImportLogs } from "../../../../../redux/slice/automatedAssessmentSlicer";

// const ITEMS_PER_PAGE = 10;

// const AutomatedAssessmentImporter = () => {
//   const dispatch = useDispatch();
//   const { importLogs, isLoading, isError, message } = useSelector(
//     (state) => state.automatedAssessment,
//   );
//   const { levels } = useSelector((state) => state.level);
//   const { modules } = useSelector((state) => state.module);
//   const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
//   const { hasPermission } = usePermission();

//   const levelOptions = [
//     { value: "all", label: "All Levels" },
//     ...(levels?.data?.map((item) => ({
//       value: item.id,
//       label: item.title,
//     })) || []),
//   ];

//   // Function to get filtered modules based on selected level
//   const getFilteredModuleOptions = () => {
//     if (level?.value === "all") {
//       return [
//         { value: "all", label: "All Modules" },
//         ...(modules?.data?.map((item) => ({
//           value: item.id,
//           label: item.title,
//         })) || []),
//       ];
//     }

//     // Filter modules by selected level
//     const filteredModules =
//       modules?.data?.filter((item) => item.level?.id === level?.value) || [];

//     return [
//       { value: "all", label: "All Modules" },
//       ...filteredModules.map((item) => ({
//         value: item.id,
//         label: item.title,
//       })),
//     ];
//   };

//   const statusOptions = [
//     { value: "all", label: "All Status" },
//     { value: "completed", label: "Completed" },
//     { value: "processing", label: "Processing" },
//     { value: "failed", label: "Failed" },
//   ];

//   const [level, setLevel] = useState(levelOptions[0]);
//   const [moduleFilter, setModuleFilter] = useState({
//     value: "all",
//     label: "All Modules",
//   });
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   // Reset module filter when level changes
//   useEffect(() => {
//     setModuleFilter({ value: "all", label: "All Modules" });
//   }, [level]);

//   // Load levels on component mount
//   useEffect(() => {
//     const loadLevels = async () => {
//       await dispatch(getAllLevels());
//       setIsLevelsLoaded(true);
//     };
//     loadLevels();
//   }, [dispatch]);

//   // Load modules only when level is selected (not "all")
//   useEffect(() => {
//     if (isLevelsLoaded && level?.value !== "all") {
//       dispatch(getAllModules());
//     }
//   }, [level, isLevelsLoaded, dispatch]);

//   const fetchImportLogs = (overridePage) => {
//     const params = {
//       search: search || "",
//       level_id: level?.value !== "all" ? level?.value : "",
//       module_id: moduleFilter?.value !== "all" ? moduleFilter?.value : "",
//       status: status?.value !== "all" ? status?.value : "",
//       page: overridePage ?? page,
//       limit: ITEMS_PER_PAGE,
//       type: "both",
//     };

//     dispatch(getAllImportLogs(params));
//   };

//   // Fetch import logs when filters change
//   useEffect(() => {
//     if (!isLevelsLoaded) return;
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchImportLogs(1);
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [search, level, moduleFilter, status, isLevelsLoaded]);

//   // Fetch import logs on page change
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
//     setModuleFilter({ value: "all", label: "All Modules" });
//     setStatus(statusOptions[0]);
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

//   // Check if module dropdown should be disabled
//   const isModuleDisabled = level?.value === "all";

//   const getStatusBadgeClass = (statusValue) => {
//     if (statusValue === "completed") {
//       return "bg-green-100 text-green-600";
//     }
//     if (statusValue === "failed") {
//       return "bg-red-100 text-red-600";
//     }
//     return "bg-yellow-100 text-yellow-600";
//   };

//   const getStatusLabel = (statusValue) => {
//     if (statusValue === "completed") {
//       return "Completed";
//     }
//     if (statusValue === "failed") {
//       return "Failed";
//     }
//     if (statusValue === "processing") {
//       return "Processing";
//     }
//     return statusValue;
//   };

//   const columns = [
//     {
//       header: "Level",
//       width: "15%",
//       render: (row) => (
//         <p className="text-gray-700">{row.level?.title || "-"}</p>
//       ),
//     },
//     {
//       header: "Module",
//       width: "15%",
//       render: (row) => (
//         <p className="text-gray-700">{row.module?.title || "-"}</p>
//       ),
//     },
//     {
//       header: "Status",
//       width: "15%",
//       render: (row) => (
//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
//             row.status,
//           )}`}
//         >
//           {getStatusLabel(row.status)}
//         </span>
//       ),
//     },
//     {
//       header: "Created By",
//       width: "15%",
//       render: (row) => (
//         <div className="flex flex-col">
//           <span className="text-sm font-medium text-gray-700">
//             {row.created_by?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
//           </span>
//         </div>
//       ),
//     },
//     {
//       header: "Error",
//       width: "55%",
//       render: (row) => (
//         <div
//           className={`inline-block max-w-full rounded-lg px-4 py-3 text-xs font-medium whitespace-normal break-all leading-6 ${
//             row.error
//               ? "bg-red-100 text-red-700"
//               : "bg-green-100 text-green-700"
//           }`}
//         >
//           {row.error || t("automatedImporter.noErrors")}
//         </div>
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
//           <PageTitle>Automated Assessment Importer</PageTitle>
//           <PageSubtitle>
//             View and manage automated assessment imports
//           </PageSubtitle>
//         </PageHeaderLeft>

//         <PageHeaderRight>
//           {hasPermission("assessments.create") && (
//             <Link
//               to="create"
//               className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
//             >
//               Create New Import
//             </Link>
//           )}
//         </PageHeaderRight>
//       </PageHeader>

//       <PageBody>
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
//           <div className="w-full">
//             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
//               <FiSearch className="text-gray-400 text-base" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search imports..."
//                 className="bg-transparent outline-none px-3 text-sm w-full"
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             {/* Level Filter */}
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

//             {/* Module Filter - Disabled until level is selected */}
//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={moduleFilter}
//                 onChange={setModuleFilter}
//                 options={getFilteredModuleOptions()}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//                 isDisabled={isModuleDisabled}
//                 isLoading={
//                   !isModuleDisabled && !modules?.data && level?.value !== "all"
//                 }
//                 placeholder={
//                   isModuleDisabled ? "Select level first" : "Select module"
//                 }
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="w-full sm:w-[48%] lg:w-[210px]">
//               <Select
//                 value={status}
//                 onChange={setStatus}
//                 options={statusOptions}
//                 styles={customSelectStyles}
//                 isSearchable={false}
//               />
//             </div>

//             {/* Reset Button */}
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

// export default AutomatedAssessmentImporter;

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
import { getAllModules } from "../../../../../redux/slice/moduleSlice";
import usePermission from "../../../../../hooks/usePermission";
import { getAllImportLogs } from "../../../../../redux/slice/automatedAssessmentSlicer";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

const AutomatedAssessmentImporter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { importLogs, isLoading, isError, message } = useSelector(
    (state) => state.automatedAssessment,
  );
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const { hasPermission } = usePermission();

  const levelOptions = [
    { value: "all", label: t("automatedAssessmentImporter.filters.allLevels") },
    ...(levels?.data?.map((item) => ({
      value: item.id,
      label: item.title,
    })) || []),
  ];

  const getFilteredModuleOptions = () => {
    if (level?.value === "all") {
      return [
        {
          value: "all",
          label: t("automatedAssessmentImporter.filters.allModules"),
        },
        ...(modules?.data?.map((item) => ({
          value: item.id,
          label: item.title,
        })) || []),
      ];
    }

    const filteredModules =
      modules?.data?.filter((item) => item.level?.id === level?.value) || [];

    return [
      {
        value: "all",
        label: t("automatedAssessmentImporter.filters.allModules"),
      },
      ...filteredModules.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    ];
  };

  const statusOptions = [
    { value: "all", label: t("automatedAssessmentImporter.filters.allStatus") },
    {
      value: "completed",
      label: t("automatedAssessmentImporter.filters.completed"),
    },
    {
      value: "processing",
      label: t("automatedAssessmentImporter.filters.processing"),
    },
    { value: "failed", label: t("automatedAssessmentImporter.filters.failed") },
  ];

  const [level, setLevel] = useState(levelOptions[0]);
  const [moduleFilter, setModuleFilter] = useState({
    value: "all",
    label: t("automatedAssessmentImporter.filters.allModules"),
  });
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setModuleFilter({
      value: "all",
      label: t("automatedAssessmentImporter.filters.allModules"),
    });
  }, [level]);

  useEffect(() => {
    const loadLevels = async () => {
      await dispatch(getAllLevels());
      setIsLevelsLoaded(true);
    };
    loadLevels();
  }, [dispatch]);

  useEffect(() => {
    if (isLevelsLoaded && level?.value !== "all") {
      dispatch(getAllModules());
    }
  }, [level, isLevelsLoaded, dispatch]);

  const fetchImportLogs = (overridePage) => {
    const params = {
      search: search || "",
      level_id: level?.value !== "all" ? level?.value : "",
      module_id: moduleFilter?.value !== "all" ? moduleFilter?.value : "",
      status: status?.value !== "all" ? status?.value : "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
      type: "both",
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
  }, [search, level, moduleFilter, status, isLevelsLoaded]);

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
    setModuleFilter({
      value: "all",
      label: t("automatedAssessmentImporter.filters.allModules"),
    });
    setStatus(statusOptions[0]);
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
      return t("automatedAssessmentImporter.status.completed");
    }
    if (statusValue === "failed") {
      return t("automatedAssessmentImporter.status.failed");
    }
    if (statusValue === "processing") {
      return t("automatedAssessmentImporter.status.processing");
    }
    return statusValue;
  };

  const columns = [
    {
      header: t("automatedAssessmentImporter.columns.level"),
      width: "15%",
      render: (row) => (
        <p className="text-gray-700">{row.level?.title || "-"}</p>
      ),
    },
    {
      header: t("automatedAssessmentImporter.columns.module"),
      width: "15%",
      render: (row) => (
        <p className="text-gray-700">{row.module?.title || "-"}</p>
      ),
    },
    {
      header: t("automatedAssessmentImporter.columns.status"),
      width: "15%",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
            row.status,
          )}`}
        >
          {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      header: t("automatedAssessmentImporter.columns.createdBy"),
      width: "15%",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            {row.created_by?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
          </span>
        </div>
      ),
    },
    {
      header: t("automatedAssessmentImporter.columns.error"),
      width: "55%",
      render: (row) => (
        <div
          className={`inline-block max-w-full rounded-lg px-4 py-3 text-xs font-medium whitespace-normal break-all leading-6 ${
            row.error
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {row.error || t("automatedAssessmentImporter.noErrors")}
        </div>
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
          <PageTitle>{t("automatedAssessmentImporter.list.title")}</PageTitle>
          <PageSubtitle>
            {t("automatedAssessmentImporter.list.subtitle")}
          </PageSubtitle>
        </PageHeaderLeft>

        <PageHeaderRight>
          {hasPermission("assessments.create") && (
            <Link
              to="create"
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {t("automatedAssessmentImporter.actions.createImport")}
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
                placeholder={t("automatedAssessmentImporter.searchPlaceholder")}
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
                    ? t("automatedAssessmentImporter.filters.selectLevelFirst")
                    : t("automatedAssessmentImporter.filters.selectModule")
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

export default AutomatedAssessmentImporter;
