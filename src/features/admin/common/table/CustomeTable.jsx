// import { useState } from "react";

// /* ================= NORMALISE ================= */
// const normalise = (col) => {
//   if ("header" in col) {
//     return {
//       label: col.header,
//       align: col.align || "center",
//       getCell: (row) => {
//         if (col.render) return col.render(row);
//         if (col.accessor) return row[col.accessor] ?? "—";
//         return "—";
//       },
//     };
//   }

//   return {
//     label: col.label,
//     align: col.align || "center",
//     getCell: (row) => {
//       if (col.render) return col.render(row[col.key], row);
//       return row[col.key] ?? "—";
//     },
//   };
// };

// /* ================= ROW ================= */
// const TableRow = ({ row, normCols, isLast }) => {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <tr
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         borderBottom: isLast ? "none" : "1px solid #f1f5f9",
//         background: hovered ? "#f8fafc" : "transparent",
//       }}
//     >
//       {normCols.map((col, i) => (
//         <td
//           key={i}
//           style={{
//             padding: "14px 20px",
//             textAlign: col.align,
//             fontSize: 13,
//             color: "#374151",
//             fontWeight: 500,
//           }}
//         >
//           {col.getCell(row)}
//         </td>
//       ))}
//     </tr>
//   );
// };

// /* ================= ICONS ================= */
// const ChevronLeft = () => (
//   <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//     <path
//       d="M13 16l-6-6 6-6"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//   </svg>
// );

// const ChevronRight = () => (
//   <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//     <path
//       d="M7 4l6 6-6 6"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//     />
//   </svg>
// );

// /* ================= BUTTON ================= */
// const PageBtn = ({ children, onClick, isActive, isDisabled, title }) => {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <button
//       title={title}
//       onClick={onClick}
//       disabled={isDisabled}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         minWidth: 32,
//         height: 32,
//         borderRadius: 6,
//         border: isActive
//           ? "none"
//           : `1.5px solid ${hovered && !isDisabled ? "#2563eb" : "#e2e8f0"}`,
//         background: isActive ? "#2563eb" : isDisabled ? "#f1f5f9" : "#fff",
//         color: isActive
//           ? "#fff"
//           : isDisabled
//             ? "#cbd5e1"
//             : hovered
//               ? "#2563eb"
//               : "#374151",
//         fontSize: 13,
//         fontWeight: isActive ? 700 : 500,
//         cursor: isDisabled ? "not-allowed" : "pointer",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         transition: "all 0.15s",
//         boxShadow: isActive ? "0 2px 8px rgba(37,99,235,0.25)" : "none",
//       }}
//     >
//       {children}
//     </button>
//   );
// };

// /* ================= MAIN ================= */
// const CustomeTable = ({
//   columns = [],
//   data = [],
//   itemsPerPage = 5,
//   emptyText = "No data found.",
// }) => {
//   const normCols = columns.map(normalise);
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalItems = data.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

//   const paginatedData = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   const getPageNumbers = () => {
//     if (totalPages <= 7) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     const pages = [1];
//     if (currentPage > 3) pages.push("left-dots");

//     for (
//       let i = Math.max(2, currentPage - 1);
//       i <= Math.min(totalPages - 1, currentPage + 1);
//       i++
//     ) {
//       pages.push(i);
//     }

//     if (currentPage < totalPages - 2) pages.push("right-dots");
//     pages.push(totalPages);

//     return pages;
//   };

//   return (
//     <div>
//       {/* TABLE */}
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr style={{ background: "#f8fafc" }}>
//             {normCols.map((col, i) => (
//               <th key={i} style={{ padding: "12px" }}>
//                 {col.label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {paginatedData.length === 0 ? (
//             <tr>
//               <td colSpan={normCols.length} style={{ padding: 30 }}>
//                 {emptyText}
//               </td>
//             </tr>
//           ) : (
//             paginatedData.map((row, i) => (
//               <TableRow
//                 key={i}
//                 row={row}
//                 normCols={normCols}
//                 isLast={i === paginatedData.length - 1}
//               />
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* 🔥 SAME PAGINATION UI */}
//       {totalPages > 1 && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "14px 24px",
//             borderTop: "1px solid #f1f5f9",
//             flexWrap: "wrap",
//             gap: 10,
//           }}
//         >
//           {/* summary */}
//           <span style={{ fontSize: 13, color: "#64748b" }}>
//             Showing <strong>{startItem}</strong> to <strong>{endItem}</strong>{" "}
//             of <strong>{totalItems}</strong>
//           </span>

//           {/* buttons */}
//           <div style={{ display: "flex", gap: 6 }}>
//             <PageBtn
//               title="Prev"
//               onClick={() => setCurrentPage(currentPage - 1)}
//               isDisabled={currentPage === 1}
//             >
//               <ChevronLeft />
//             </PageBtn>

//             {getPageNumbers().map((page, i) =>
//               page === "left-dots" || page === "right-dots" ? (
//                 <span key={i} style={{ padding: "6px 8px" }}>
//                   ...
//                 </span>
//               ) : (
//                 <PageBtn
//                   key={i}
//                   onClick={() => setCurrentPage(page)}
//                   isActive={page === currentPage}
//                 >
//                   {page}
//                 </PageBtn>
//               ),
//             )}

//             <PageBtn
//               title="Next"
//               onClick={() => setCurrentPage(currentPage + 1)}
//               isDisabled={currentPage === totalPages}
//             >
//               <ChevronRight />
//             </PageBtn>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomeTable;

import { useState } from "react";

/* ================= NORMALISE ================= */
const normalise = (col) => {
  if ("header" in col) {
    return {
      label: col.header,
      align: col.align || "center",
      getCell: (row) => {
        if (col.render) return col.render(row);
        if (col.accessor) return row[col.accessor] ?? "—";
        return "—";
      },
    };
  }

  return {
    label: col.label,
    align: col.align || "center",
    getCell: (row) => {
      if (col.render) return col.render(row[col.key], row);
      return row[col.key] ?? "—";
    },
  };
};

/* ================= ROW ================= */
const TableRow = ({ row, normCols, isLast }) => {
  return (
    <tr
      className={`hover:bg-slate-50 ${
        !isLast ? "border-b border-slate-100" : ""
      }`}
    >
      {normCols.map((col, i) => (
        <td
          key={i}
          className={`px-5 py-3 text-[13px] font-medium text-gray-700 text-${col.align} text-left`}
        >
          {col.getCell(row)}
        </td>
      ))}
    </tr>
  );
};

/* ================= ICONS ================= */
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path
      d="M13 16l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path
      d="M7 4l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ================= BUTTON ================= */
const PageBtn = ({ children, onClick, isActive, isDisabled, title }) => {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        min-w-[32px] h-8 rounded-md flex items-center justify-center text-sm transition-all
        ${
          isActive
            ? "bg-[#184994] text-white font-bold shadow-md cursor-pointer"
            : isDisabled
              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : "border border-slate-200 text-gray-700 hover:border-[#184994] hover:text-[#184994] cursor-pointer"
        }
      `}
    >
      {children}
    </button>
  );
};

/* ================= MAIN ================= */
const CustomeTable = ({
  columns = [],
  data = [],
  itemsPerPage = 5,
  emptyText = "No data found.",
}) => {
  const normCols = columns.map(normalise);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    if (currentPage > 3) pages.push("left-dots");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("right-dots");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="w-full bg-white shadow-xs border rounded-xl border-gray-300 overflow-hidden">
      {/* TABLE */}
      <table className="w-full border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {normCols.map((col, i) => (
              <th
                key={i}
                className="px-4 py-3 text-sm font-semibold text-[#090F31] font-[700] text-left"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={normCols.length}
                className="text-center py-8 text-gray-500 "
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, i) => (
              <TableRow
                key={i}
                row={row}
                normCols={normCols}
                isLast={i === paginatedData.length - 1}
              />
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-slate-100 gap-3">
          {/* summary */}
          <span className="text-sm text-slate-500">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong>{" "}
            of <strong>{totalItems}</strong>
          </span>

          {/* buttons */}
          <div className="flex gap-2">
            <PageBtn
              title="Prev"
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              <ChevronLeft />
            </PageBtn>

            {getPageNumbers().map((page, i) =>
              page === "left-dots" || page === "right-dots" ? (
                <span key={i} className="px-2 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <PageBtn
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PageBtn>
              ),
            )}

            <PageBtn
              title="Next"
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              <ChevronRight />
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomeTable;
