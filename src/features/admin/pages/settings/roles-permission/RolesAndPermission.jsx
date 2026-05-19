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
// import { FiSearch } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../../common/Loader";
// import Error from "../../../common/Error";
// import StatusToggle from "../../../common/StatusToggle";
// import { LuFilterX } from "react-icons/lu";
// import {
//   getAllRoles,
//   updateSingleRoleStatus,
// } from "../../../../../redux/slice/rolesSlice";
// import usePermission from "../../../../../hooks/usePermission";
// import TruncateText from "../../../common/TruncateText";

// const ITEMS_PER_PAGE = 10;

// const RolesAndPermission = () => {
//   const { t } = useTranslation();
//   const { roles, isLoading, isError, message } = useSelector(
//     (state) => state.role,
//   );

//   const { hasPermission } = usePermission();

//   const statusOptions = [
//     { value: "all", label: t("role.filters.allStatus") },
//     { value: "1", label: t("role.filters.active") },
//     { value: "0", label: t("role.filters.inactive") },
//   ];

//   const [page, setPage] = useState(1);
//   const [status, setStatus] = useState(statusOptions[0]);
//   const [search, setSearch] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const fetchRoles = (overridePage) => {
//     const params = {
//       search: search || "",
//       page: overridePage ?? page,
//       limit: ITEMS_PER_PAGE,
//       // status: "all",
//     };
//     dispatch(getAllRoles(params));
//   };

//   useEffect(() => {
//     const delay = setTimeout(() => {
//       setPage(1);
//       fetchRoles(1);
//     }, 500);
//     return () => clearTimeout(delay);
//   }, [search, status]);

//   useEffect(() => {
//     fetchRoles(page);
//   }, [page]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const resetFilters = () => {
//     setStatus(statusOptions[0]);
//     setSearch("");
//     setPage(1);
//   };

//   const customSelectStyles = {
//     control: (base) => ({
//       ...base,
//       borderRadius: "8px",
//       borderColor: "#E5E7EB",
//       minHeight: "38px",
//       boxShadow: "none",
//       cursor: "pointer",
//       fontSize: "14px",
//       backgroundColor: "#F8FAFC",
//     }),
//   };

//   const columns = [
//     {
//       header: t("role.list.columns.id"),
//       render: (row) => (
//         <p className="font-semibold text-gray-800 cursor-pointer">{row.id}</p>
//       ),
//     },
//     {
//       header: t("role.list.columns.name"),
//       render: (row) => (
//         <p className="font-semibold text-gray-800 cursor-pointer">
//           <TruncateText text={row?.label} maxLength={25} />
//         </p>
//       ),
//     },
//     ...(hasPermission("roles.status")
//       ? [
//           {
//             header: t("role.list.columns.status"),
//             render: (row) => (
//               <StatusToggle
//                 value={row.is_active}
//                 onToggle={async (newStatus) => {
//                   await dispatch(
//                     updateSingleRoleStatus({ id: row.id, status: newStatus }),
//                   ).unwrap();
//                   await fetchRoles(1);
//                 }}
//               />
//             ),
//           },
//         ]
//       : []),

//     ...(hasPermission("roles.edit")
//       ? [
//           {
//             header: t("role.list.columns.actions"),
//             render: (row) => (
//               <button
//                 onClick={() => navigate(`role-details/${row.id}`)}
//                 className="text-gray-800 text-lg cursor-pointer hover:text-blue-600 transition-colors"
//               >
//                 <FaEye />
//               </button>
//             ),
//           },
//         ]
//       : []),
//   ];

//   if (isLoading && !roles?.length) return <Loader />;
//   if (isError) return <Error message={message} />;

//   if (!hasPermission("roles.view")) {
//     return null;
//   }

//   return (
//     <PageLayout>
//       <PageHeader>
//         <PageHeaderLeft>
//           <PageTitle>{t("role.list.title")}</PageTitle>
//           <PageSubtitle>{t("role.list.subtitle")}</PageSubtitle>
//         </PageHeaderLeft>
//         <PageHeaderRight>
//           <Link
//             to="create-role"
//             className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
//           >
//             {t("role.actions.addNewRole")}
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
//                 placeholder={t("role.list.searchPlaceholder")}
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
//                   {t("role.list.clearAll")}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4">
//           <CustomeTable
//             columns={columns}
//             data={roles || []}
//             serverSide={true}
//             currentPage={roles?.current_page || 1}
//             totalPages={roles?.last_page || 1}
//             totalItems={roles?.total || 0}
//             itemsPerPage={ITEMS_PER_PAGE}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </PageBody>
//     </PageLayout>
//   );
// };

// export default RolesAndPermission;

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
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import StatusToggle from "../../../common/StatusToggle";
import { LuFilterX } from "react-icons/lu";
import {
  getAllRoles,
  updateSingleRoleStatus,
} from "../../../../../redux/slice/rolesSlice";
import usePermission from "../../../../../hooks/usePermission";
import TruncateText from "../../../common/TruncateText";

const ITEMS_PER_PAGE = 10;

const RolesAndPermission = () => {
  const { t } = useTranslation();
  const { roles, isLoading, isError, message } = useSelector(
    (state) => state.role,
  );

  const { hasPermission } = usePermission();

  const statusOptions = [
    { value: "all", label: t("role.filters.allStatus") },
    { value: "1", label: t("role.filters.active") },
    { value: "0", label: t("role.filters.inactive") },
  ];

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(statusOptions[0]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchRoles = (overridePage) => {
    const params = {
      search: search || "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllRoles(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchRoles(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, status]);

  useEffect(() => {
    fetchRoles(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setStatus(statusOptions[0]);
    setSearch("");
    setPage(1);
  };

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

  // Sirf hidden:true wale filter honge, baaki sab show honge
  const getFilteredData = () => {
    if (!roles) return [];
    // hidden: true wale hatao, hidden: false wale raho
    return roles.filter((role) => !role.hidden);
  };

  const columns = [
    {
      header: t("role.list.columns.id"),
      render: (row) => (
        <p
          className={`font-semibold text-gray-800 ${row.is_system ? "opacity-60" : ""}`}
        >
          {row.id}
        </p>
      ),
    },
    {
      header: t("role.list.columns.name"),
      render: (row) => (
        <p
          className={`font-semibold text-gray-800 ${row.is_system ? "opacity-60" : ""}`}
        >
          <TruncateText text={row?.label} maxLength={25} />
        </p>
      ),
    },
    ...(hasPermission("roles.status")
      ? [
          {
            header: t("role.list.columns.status"),
            render: (row) => (
              <div
                className={
                  row.is_system ? "pointer-events-none opacity-60" : ""
                }
              >
                <StatusToggle
                  value={row.is_active}
                  onToggle={async (newStatus) => {
                    if (row.is_system) return; // is_system true wale disabled
                    await dispatch(
                      updateSingleRoleStatus({ id: row.id, status: newStatus }),
                    ).unwrap();
                    await fetchRoles(1);
                  }}
                />
              </div>
            ),
          },
        ]
      : []),

    ...(hasPermission("roles.edit")
      ? [
          {
            header: t("role.list.columns.actions"),
            render: (row) => (
              <button
                onClick={() => {
                  if (!row.is_system) {
                    navigate(`role-details/${row.id}`);
                  }
                }}
                className={`text-gray-800 text-lg transition-colors ${
                  row.is_system
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:text-blue-600"
                }`}
                disabled={row.is_system}
              >
                <FaEye />
              </button>
            ),
          },
        ]
      : []),
  ];

  if (isLoading && !roles?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("roles.view")) {
    return null;
  }

  // Sirf hidden:true wale hatao, baaki sab dikhao
  let filteredData = getFilteredData();

  // Search filter apply karo (optional)
  if (search) {
    filteredData = filteredData.filter(
      (role) =>
        role.label?.toLowerCase().includes(search.toLowerCase()) ||
        role.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Status filter apply karo (optional)
  if (status.value !== "all") {
    filteredData = filteredData.filter(
      (role) => role.is_active === (status.value === "1"),
    );
  }

  // Pagination
  const totalFilteredItems = filteredData.length;
  const totalFilteredPages = Math.ceil(totalFilteredItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("role.list.title")}</PageTitle>
          <PageSubtitle>{t("role.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <Link
            to="create-role"
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition"
          >
            {t("role.actions.addNewRole")}
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
                placeholder={t("role.list.searchPlaceholder")}
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
                  {t("role.list.clearAll")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={paginatedData}
            serverSide={true}
            currentPage={page}
            totalPages={totalFilteredPages}
            totalItems={totalFilteredItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default RolesAndPermission;
