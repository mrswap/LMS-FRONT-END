// import React from "react";

// const ChevronLeft = () => (
//   <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
//     <path
//       d="M13 16l-6-6 6-6"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
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
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// const PageBtn = ({ children, onClick, isActive, isDisabled, title }) => {
//   const [hovered, setHovered] = React.useState(false);
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
//         padding: "0 6px",
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

// const Pagination = ({
//   currentPage,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
//   siblingCount = 1,
//   showSummary = true,
//   summaryLabel = "items",
// }) => {
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
//   const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   const getPageNumbers = () => {
//     if (totalPages <= 5 + siblingCount * 2) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
//     const left = Math.max(currentPage - siblingCount, 2);
//     const right = Math.min(currentPage + siblingCount, totalPages - 1);
//     const pages = [1];
//     if (left > 2) pages.push("left-dots");
//     for (let i = left; i <= right; i++) pages.push(i);
//     if (right < totalPages - 1) pages.push("right-dots");
//     pages.push(totalPages);
//     return pages;
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "14px 24px",
//         flexWrap: "wrap",
//         gap: 12,
//       }}
//     >
//       {showSummary && (
//         <span style={{ fontSize: 13, color: "#64748b" }}>
//           Showing <strong style={{ color: "#374151" }}>{startItem}</strong> to{" "}
//           <strong style={{ color: "#374151" }}>{endItem}</strong> of{" "}
//           <strong style={{ color: "#374151" }}>
//             {totalItems.toLocaleString()}
//           </strong>{" "}
//           {summaryLabel}
//         </span>
//       )}

//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <PageBtn
//           title="Previous"
//           onClick={() => onPageChange(currentPage - 1)}
//           isDisabled={currentPage === 1}
//         >
//           <ChevronLeft />
//         </PageBtn>

//         {getPageNumbers().map((page) =>
//           page === "left-dots" || page === "right-dots" ? (
//             <span
//               key={page}
//               style={{
//                 minWidth: 32,
//                 textAlign: "center",
//                 color: "#94a3b8",
//                 fontSize: 13,
//                 userSelect: "none",
//               }}
//             >
//               ...
//             </span>
//           ) : (
//             <PageBtn
//               key={`page-${page}`}
//               onClick={() => onPageChange(page)}
//               isActive={page === currentPage}
//             >
//               {page}
//             </PageBtn>
//           ),
//         )}

//         <PageBtn
//           title="Next"
//           onClick={() => onPageChange(currentPage + 1)}
//           isDisabled={currentPage === totalPages}
//         >
//           <ChevronRight />
//         </PageBtn>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
