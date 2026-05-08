// import { useState, useEffect, useRef, memo, useCallback } from "react";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";
// import { FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";

// // ─── Text Editor ─────────────────────────────────────────────────────────────
// const TextEditor = memo(({ value, onChange, t }) => {
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "clean"],
//       ],
//     },
//   });

//   const isInitialized = useRef(false);

//   // Set initial value once quill is ready
//   useEffect(() => {
//     if (!quill || isInitialized.current) return;
//     isInitialized.current = true;
//     if (value) {
//       quill.root.innerHTML = value;
//     }
//   }, [quill]);

//   // Listen to changes and propagate up
//   useEffect(() => {
//     if (!quill) return;
//     const handleTextChange = () => {
//       onChange(quill.root.innerHTML);
//     };
//     quill.on("text-change", handleTextChange);
//     return () => quill.off("text-change", handleTextChange);
//   }, [quill, onChange]);

//   return (
//     <div className="quill-wrapper" style={{ minHeight: "350px" }}>
//       <div ref={quillRef} style={{ height: "350px" }} />
//     </div>
//   );
// });

// TextEditor.displayName = "TextEditor";

// // ─── Single Section ───────────────────────────────────────────────────────────
// const Section = ({ section, onUpdate, onRemove, t }) => {
//   const [localTitle, setLocalTitle] = useState(section.title);
//   const [localMediaShortcut, setLocalMediaShortcut] = useState(
//     section.media_shortcut || "",
//   );
//   const titleTimeoutRef = useRef(null);
//   const mediaTimeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalTitle(section.title);
//     setLocalMediaShortcut(section.media_shortcut || "");
//   }, [section.title, section.media_shortcut]);

//   const handleTitleChange = (e) => {
//     const newValue = e.target.value;
//     setLocalTitle(newValue);
//     clearTimeout(titleTimeoutRef.current);
//     titleTimeoutRef.current = setTimeout(() => {
//       onUpdate(section.id, { title: newValue });
//     }, 300);
//   };

//   const handleMediaShortcutChange = (e) => {
//     const newValue = e.target.value;
//     setLocalMediaShortcut(newValue);
//     clearTimeout(mediaTimeoutRef.current);
//     mediaTimeoutRef.current = setTimeout(() => {
//       onUpdate(section.id, { media_shortcut: newValue });
//     }, 300);
//   };

//   // FIXED: ek hi onUpdate call mein saare fields update karo — no race condition
//   const handleTypeChange = (newType) => {
//     if (newType === section.type) return;

//     const updates = {
//       type: newType,
//       editorKey: `${section.id}-${newType}-${Date.now()}`,
//     };

//     if (newType === "text") {
//       updates.media_shortcut = "";
//       setLocalMediaShortcut("");
//     }

//     onUpdate(section.id, updates);
//   };

//   const handleContentChange = useCallback(
//     (value) => onUpdate(section.id, { content: value }),
//     [section.id, onUpdate],
//   );

//   return (
//     <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
//       <div className="absolute top-2 left-2 text-xs text-gray-400">
//         {t("learningUnitBuilder.details.content.order")}: {section.order}
//       </div>

//       <button
//         type="button"
//         onClick={() => onRemove(section.id)}
//         className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
//         title={t("learningUnitBuilder.details.content.removeSection")}
//       >
//         <FiTrash2 size={18} />
//       </button>

//       {/* Type toggle */}
//       <div className="mb-4 mt-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {t("learningUnitBuilder.details.content.type")}
//         </label>
//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={() => handleTypeChange("text")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//               section.type === "text"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             <FiType size={16} />
//             {t("learningUnitBuilder.details.content.text")}
//           </button>

//           <button
//             type="button"
//             onClick={() => handleTypeChange("media")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//               section.type === "media"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             <FiImage size={16} />
//             {t("learningUnitBuilder.details.content.media")}
//           </button>
//         </div>
//       </div>

//       {/* Section title */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {t("learningUnitBuilder.details.content.sectionTitle")}
//         </label>
//         <input
//           type="text"
//           value={localTitle}
//           onChange={handleTitleChange}
//           placeholder={t(
//             "learningUnitBuilder.details.content.sectionTitlePlaceholder",
//           )}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
//           maxLength={150}
//         />
//       </div>

//       {/* TEXT mode */}
//       {section.type === "text" && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {t("learningUnitBuilder.details.content.content")}
//           </label>
//           <TextEditor
//             key={section.editorKey || `${section.id}-text`}
//             value={section.content}
//             onChange={handleContentChange}
//             t={t}
//           />
//         </div>
//       )}

//       {/* MEDIA mode */}
//       {section.type === "media" && (
//         <>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {t("learningUnitBuilder.details.content.mediaShortcut")}
//             </label>
//             <input
//               type="text"
//               value={localMediaShortcut}
//               onChange={handleMediaShortcutChange}
//               placeholder={t(
//                 "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
//               )}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
//               maxLength={250}
//             />
//           </div>

//           <div className="mb-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {t("learningUnitBuilder.details.content.description")}
//             </label>
//             <TextEditor
//               key={`${section.editorKey || section.id}-desc`}
//               value={section.content}
//               onChange={handleContentChange}
//               t={t}
//             />
//           </div>

//           {section.media_shortcut && (
//             <div className="mt-2 p-2 bg-gray-100 rounded">
//               <p className="text-xs text-gray-500 mb-1">
//                 {t("learningUnitBuilder.details.content.preview")}:
//               </p>
//               {section.media_shortcut.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
//                 <img
//                   src={section.media_shortcut}
//                   alt="Preview"
//                   className="mt-1 max-h-32 object-contain"
//                   onError={(e) => (e.target.style.display = "none")}
//                 />
//               ) : section.media_shortcut.match(/\.(mp4|webm|ogg)$/i) ? (
//                 <video
//                   src={section.media_shortcut}
//                   controls
//                   className="mt-1 max-h-32"
//                 />
//               ) : (
//                 <p className="text-xs text-gray-600">
//                   {t("learningUnitBuilder.details.content.media")}:{" "}
//                   {section.media_shortcut}
//                 </p>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ─── DynamicContentSection ────────────────────────────────────────────────────
// const DynamicContentSection = ({
//   sections = [],
//   onSectionsChange,
//   addButtonText = "Add New Section",
//   t,
// }) => {
//   const [localSections, setLocalSections] = useState(sections);
//   const updateTimeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalSections(sections);
//   }, [sections]);

//   const updateParent = useCallback(
//     (newSections) => {
//       setLocalSections(newSections);
//       clearTimeout(updateTimeoutRef.current);
//       updateTimeoutRef.current = setTimeout(() => {
//         onSectionsChange(newSections);
//       }, 500);
//     },
//     [onSectionsChange],
//   );

//   const addSection = useCallback(() => {
//     const id = Date.now();
//     const newSection = {
//       id,
//       type: "text",
//       title: "",
//       content: "",
//       media_shortcut: "",
//       order: localSections.length + 1,
//       editorKey: `${id}-text-init`,
//     };
//     updateParent([...localSections, newSection]);
//   }, [localSections, updateParent]);

//   const removeSection = useCallback(
//     (id) => {
//       const updated = localSections
//         .filter((s) => s.id !== id)
//         .map((s, idx) => ({ ...s, order: idx + 1 }));
//       updateParent(updated);
//     },
//     [localSections, updateParent],
//   );

//   // FIXED: ab ek object of updates accept karta hai — ek hi render mein saare fields update
//   const updateSection = useCallback(
//     (id, updates) => {
//       const updated = localSections.map((s) =>
//         s.id === id ? { ...s, ...updates } : s,
//       );
//       updateParent(updated);
//     },
//     [localSections, updateParent],
//   );

//   return (
//     <div className="space-y-6">
//       {localSections.map((section) => (
//         <Section
//           key={section.id}
//           section={section}
//           onUpdate={updateSection}
//           onRemove={removeSection}
//           t={t}
//         />
//       ))}

//       <button
//         type="button"
//         onClick={addSection}
//         className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
//       >
//         <FiPlus size={18} />
//         {addButtonText}
//       </button>
//     </div>
//   );
// };

// export default DynamicContentSection;

// import { useState, useEffect, useRef, memo, useCallback } from "react";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";
// import { FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";
// import usePermission from "../../../../../../hooks/usePermission";

// // ─── Text Editor ─────────────────────────────────────────────────────────────
// const TextEditor = memo(({ value, onChange, t }) => {
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "clean"],
//       ],
//     },
//   });

//   const isInitialized = useRef(false);

//   useEffect(() => {
//     if (!quill || isInitialized.current) return;
//     isInitialized.current = true;
//     if (value) {
//       quill.root.innerHTML = value;
//     }
//   }, [quill]);

//   useEffect(() => {
//     if (!quill) return;
//     const handleTextChange = () => {
//       onChange(quill.root.innerHTML);
//     };
//     quill.on("text-change", handleTextChange);
//     return () => quill.off("text-change", handleTextChange);
//   }, [quill, onChange]);

//   return (
//     <div className="quill-wrapper" style={{ minHeight: "350px" }}>
//       <div ref={quillRef} style={{ height: "350px" }} />
//     </div>
//   );
// });

// TextEditor.displayName = "TextEditor";

// // ─── Single Section ───────────────────────────────────────────────────────────
// const Section = ({
//   section,
//   onUpdate,
//   onRemove,
//   t,
//   hasBulkPermission,
//   isOnlySection,
// }) => {
//   const [localTitle, setLocalTitle] = useState(section.title);
//   const [localMediaShortcut, setLocalMediaShortcut] = useState(
//     section.media_shortcut || "",
//   );
//   const titleTimeoutRef = useRef(null);
//   const mediaTimeoutRef = useRef(null);

//   useEffect(() => {
//     setLocalTitle(section.title);
//     setLocalMediaShortcut(section.media_shortcut || "");
//   }, [section.title, section.media_shortcut]);

//   const handleTitleChange = (e) => {
//     const newValue = e.target.value;
//     setLocalTitle(newValue);
//     clearTimeout(titleTimeoutRef.current);
//     titleTimeoutRef.current = setTimeout(() => {
//       onUpdate(section.id, { title: newValue });
//     }, 300);
//   };

//   const handleMediaShortcutChange = (e) => {
//     const newValue = e.target.value;
//     setLocalMediaShortcut(newValue);
//     clearTimeout(mediaTimeoutRef.current);
//     mediaTimeoutRef.current = setTimeout(() => {
//       onUpdate(section.id, { media_shortcut: newValue });
//     }, 300);
//   };

//   const handleTypeChange = (newType) => {
//     if (newType === section.type) return;

//     const updates = {
//       type: newType,
//       editorKey: `${section.id}-${newType}-${Date.now()}`,
//     };

//     if (newType === "text") {
//       updates.media_shortcut = "";
//       setLocalMediaShortcut("");
//     }

//     onUpdate(section.id, updates);
//   };

//   const handleContentChange = useCallback(
//     (value) => onUpdate(section.id, { content: value }),
//     [section.id, onUpdate],
//   );

//   return (
//     <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
//       <div className="absolute top-2 left-2 text-xs text-gray-400">
//         {t("learningUnitBuilder.details.content.order")}: {section.order}
//       </div>

//       {/* Remove button - only show if has permission OR not the only section */}
//       {(hasBulkPermission || !isOnlySection) && (
//         <button
//           type="button"
//           onClick={() => onRemove(section.id)}
//           className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
//           title={t("learningUnitBuilder.details.content.removeSection")}
//         >
//           <FiTrash2 size={18} />
//         </button>
//       )}

//       {/* Type toggle */}
//       <div className="mb-4 mt-6">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {t("learningUnitBuilder.details.content.type")}
//         </label>
//         <div className="flex gap-4">
//           <button
//             type="button"
//             onClick={() => handleTypeChange("text")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//               section.type === "text"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             <FiType size={16} />
//             {t("learningUnitBuilder.details.content.text")}
//           </button>

//           <button
//             type="button"
//             onClick={() => handleTypeChange("media")}
//             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//               section.type === "media"
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             <FiImage size={16} />
//             {t("learningUnitBuilder.details.content.media")}
//           </button>
//         </div>
//       </div>

//       {/* Section title */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {t("learningUnitBuilder.details.content.sectionTitle")}
//         </label>
//         <input
//           type="text"
//           value={localTitle}
//           onChange={handleTitleChange}
//           placeholder={t(
//             "learningUnitBuilder.details.content.sectionTitlePlaceholder",
//           )}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
//           maxLength={150}
//         />
//       </div>

//       {/* TEXT mode */}
//       {section.type === "text" && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {t("learningUnitBuilder.details.content.content")}
//           </label>
//           <TextEditor
//             key={section.editorKey || `${section.id}-text`}
//             value={section.content}
//             onChange={handleContentChange}
//             t={t}
//           />
//         </div>
//       )}

//       {/* MEDIA mode */}
//       {section.type === "media" && (
//         <>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {t("learningUnitBuilder.details.content.mediaShortcut")}
//             </label>
//             <input
//               type="text"
//               value={localMediaShortcut}
//               onChange={handleMediaShortcutChange}
//               placeholder={t(
//                 "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
//               )}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
//               maxLength={250}
//             />
//           </div>

//           <div className="mb-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {t("learningUnitBuilder.details.content.description")}
//             </label>
//             <TextEditor
//               key={`${section.editorKey || section.id}-desc`}
//               value={section.content}
//               onChange={handleContentChange}
//               t={t}
//             />
//           </div>

//           {section.media_shortcut && (
//             <div className="mt-2 p-2 bg-gray-100 rounded">
//               <p className="text-xs text-gray-500 mb-1">
//                 {t("learningUnitBuilder.details.content.preview")}:
//               </p>
//               {section.media_shortcut.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
//                 <img
//                   src={section.media_shortcut}
//                   alt="Preview"
//                   className="mt-1 max-h-32 object-contain"
//                   onError={(e) => (e.target.style.display = "none")}
//                 />
//               ) : section.media_shortcut.match(/\.(mp4|webm|ogg)$/i) ? (
//                 <video
//                   src={section.media_shortcut}
//                   controls
//                   className="mt-1 max-h-32"
//                 />
//               ) : (
//                 <p className="text-xs text-gray-600">
//                   {t("learningUnitBuilder.details.content.media")}:{" "}
//                   {section.media_shortcut}
//                 </p>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// // ─── DynamicContentSection ────────────────────────────────────────────────────
// const DynamicContentSection = ({
//   sections = [],
//   onSectionsChange,
//   addButtonText = "Add New Section",
//   t,
// }) => {
//   const [localSections, setLocalSections] = useState(sections);
//   const updateTimeoutRef = useRef(null);
//   const { hasPermission } = usePermission();

//   // Check for bulk permission
//   const hasBulkPermission = hasPermission("content.bulk-create");

//   // Initialize with one default section if empty
//   useEffect(() => {
//     if (sections.length === 0 && localSections.length === 0) {
//       const defaultSection = {
//         id: Date.now(),
//         type: "text",
//         title: "",
//         content: "",
//         media_shortcut: "",
//         order: 1,
//         editorKey: `default-${Date.now()}-text`,
//       };
//       setLocalSections([defaultSection]);
//       onSectionsChange([defaultSection]);
//     }
//   }, []);

//   useEffect(() => {
//     if (sections.length > 0 && localSections.length === 0) {
//       setLocalSections(sections);
//     }
//   }, [sections]);

//   const updateParent = useCallback(
//     (newSections) => {
//       setLocalSections(newSections);
//       clearTimeout(updateTimeoutRef.current);
//       updateTimeoutRef.current = setTimeout(() => {
//         onSectionsChange(newSections);
//       }, 500);
//     },
//     [onSectionsChange],
//   );

//   const addSection = useCallback(() => {
//     if (!hasBulkPermission) return; // Don't allow adding if no permission

//     const id = Date.now();
//     const newSection = {
//       id,
//       type: "text",
//       title: "",
//       content: "",
//       media_shortcut: "",
//       order: localSections.length + 1,
//       editorKey: `${id}-text-init`,
//     };
//     updateParent([...localSections, newSection]);
//   }, [localSections, updateParent, hasBulkPermission]);

//   const removeSection = useCallback(
//     (id) => {
//       // Don't allow removing if only one section exists and no bulk permission
//       if (!hasBulkPermission && localSections.length === 1) return;

//       const updated = localSections
//         .filter((s) => s.id !== id)
//         .map((s, idx) => ({ ...s, order: idx + 1 }));
//       updateParent(updated);
//     },
//     [localSections, updateParent, hasBulkPermission],
//   );

//   const updateSection = useCallback(
//     (id, updates) => {
//       const updated = localSections.map((s) =>
//         s.id === id ? { ...s, ...updates } : s,
//       );
//       updateParent(updated);
//     },
//     [localSections, updateParent],
//   );

//   return (
//     <div className="space-y-6">
//       {localSections.map((section) => (
//         <Section
//           key={section.id}
//           section={section}
//           onUpdate={updateSection}
//           onRemove={removeSection}
//           t={t}
//           hasBulkPermission={hasBulkPermission}
//           isOnlySection={!hasBulkPermission && localSections.length === 1}
//         />
//       ))}

//       {/* Only show add button if user has bulk permission */}
//       {hasBulkPermission && (
//         <button
//           type="button"
//           onClick={addSection}
//           className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
//         >
//           <FiPlus size={18} />
//           {addButtonText}
//         </button>
//       )}
//     </div>
//   );
// };

// export default DynamicContentSection;

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import { FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";
import usePermission from "../../../../../../hooks/usePermission";

// ✅ Register Table Module
import QuillBetterTable from "quill-better-table";
Quill.register(
  {
    "modules/better-table": QuillBetterTable,
  },
  true,
);

// ─── Text Editor with In-Editor Table Support ─────────────────────────────────────────────
const TextEditor = memo(({ value, onChange, t }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isInitialized.current) return;

    // Initialize Quill with table module
    quillInstance.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "clean"],
          ["table"], // ✅ Table button - toolbar me dikhega
        ],
        table: true, // ✅ Enable table module
        "better-table": {
          operationMenu: {
            items: {
              insertColumnRight: "Insert column right",
              insertColumnLeft: "Insert column left",
              insertRowUp: "Insert row above",
              insertRowDown: "Insert row below",
              mergeCells: "Merge cells",
              unmergeCells: "Unmerge cells",
              deleteColumn: "Delete column",
              deleteRow: "Delete row",
              deleteTable: "Delete table",
            },
          },
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings,
        },
      },
    });

    // Set initial value
    if (value) {
      quillInstance.current.root.innerHTML = value;
    }

    // Handle text change
    quillInstance.current.on("text-change", () => {
      onChange(quillInstance.current.root.innerHTML);
    });

    isInitialized.current = true;

    // ✅ Add custom table size picker
    const toolbar = document.querySelector(".ql-toolbar");
    if (toolbar) {
      let tableButton = toolbar.querySelector(".ql-table");
      if (tableButton) {
        // Replace default table button with custom one that shows picker
        const newButton = document.createElement("button");
        newButton.className = "ql-table";
        newButton.innerHTML = "📊";
        newButton.title = "Insert Table";
        newButton.style.width = "30px";

        newButton.onclick = (e) => {
          e.preventDefault();
          const rows = prompt("Enter number of rows:", "3");
          const cols = prompt("Enter number of columns:", "3");
          if (rows && cols) {
            const tableModule = quillInstance.current.getModule("better-table");
            if (tableModule) {
              tableModule.insertTable(parseInt(rows), parseInt(cols));
            }
          }
        };

        tableButton.parentNode.replaceChild(newButton, tableButton);
      }
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
      }
    };
  }, []);

  // Update content when value changes externally
  useEffect(() => {
    if (
      quillInstance.current &&
      value !== undefined &&
      !isInitialized.current
    ) {
      const currentContent = quillInstance.current.root.innerHTML;
      if (currentContent !== value) {
        quillInstance.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div className="quill-wrapper" style={{ minHeight: "350px" }}>
      <div ref={editorRef} style={{ height: "350px" }} />
    </div>
  );
});

TextEditor.displayName = "TextEditor";

// ─── Single Section ───────────────────────────────────────────────────────────
const Section = ({
  section,
  onUpdate,
  onRemove,
  t,
  hasBulkPermission,
  isOnlySection,
}) => {
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localMediaShortcut, setLocalMediaShortcut] = useState(
    section.media_shortcut || "",
  );
  const titleTimeoutRef = useRef(null);
  const mediaTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalTitle(section.title);
    setLocalMediaShortcut(section.media_shortcut || "");
  }, [section.title, section.media_shortcut]);

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setLocalTitle(newValue);
    clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, { title: newValue });
    }, 300);
  };

  const handleMediaShortcutChange = (e) => {
    const newValue = e.target.value;
    setLocalMediaShortcut(newValue);
    clearTimeout(mediaTimeoutRef.current);
    mediaTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, { media_shortcut: newValue });
    }, 300);
  };

  const handleTypeChange = (newType) => {
    if (newType === section.type) return;

    const updates = {
      type: newType,
      editorKey: `${section.id}-${newType}-${Date.now()}`,
    };

    if (newType === "text") {
      updates.media_shortcut = "";
      setLocalMediaShortcut("");
    }

    onUpdate(section.id, updates);
  };

  const handleContentChange = useCallback(
    (value) => onUpdate(section.id, { content: value }),
    [section.id, onUpdate],
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
      <div className="absolute top-2 left-2 text-xs text-gray-400">
        {t("learningUnitBuilder.details.content.order")}: {section.order}
      </div>

      {(hasBulkPermission || !isOnlySection) && (
        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
          title={t("learningUnitBuilder.details.content.removeSection")}
        >
          <FiTrash2 size={18} />
        </button>
      )}

      <div className="mb-4 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("learningUnitBuilder.details.content.type")}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange("text")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              section.type === "text"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiType size={16} />
            {t("learningUnitBuilder.details.content.text")}
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              section.type === "media"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiImage size={16} />
            {t("learningUnitBuilder.details.content.media")}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("learningUnitBuilder.details.content.sectionTitle")}
        </label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder={t(
            "learningUnitBuilder.details.content.sectionTitlePlaceholder",
          )}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          maxLength={150}
        />
      </div>

      {section.type === "text" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("learningUnitBuilder.details.content.content")}
          </label>
          <TextEditor
            key={section.editorKey || `${section.id}-text`}
            value={section.content}
            onChange={handleContentChange}
            t={t}
          />
        </div>
      )}

      {section.type === "media" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.mediaShortcut")}
            </label>
            <input
              type="text"
              value={localMediaShortcut}
              onChange={handleMediaShortcutChange}
              placeholder={t(
                "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              maxLength={250}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.description")}
            </label>
            <TextEditor
              key={`${section.editorKey || section.id}-desc`}
              value={section.content}
              onChange={handleContentChange}
              t={t}
            />
          </div>

          {section.media_shortcut && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p className="text-xs text-gray-500 mb-1">
                {t("learningUnitBuilder.details.content.preview")}:
              </p>
              {section.media_shortcut.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img
                  src={section.media_shortcut}
                  alt="Preview"
                  className="mt-1 max-h-32 object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : section.media_shortcut.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={section.media_shortcut}
                  controls
                  className="mt-1 max-h-32"
                />
              ) : (
                <p className="text-xs text-gray-600">
                  {t("learningUnitBuilder.details.content.media")}:{" "}
                  {section.media_shortcut}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── DynamicContentSection ────────────────────────────────────────────────────
const DynamicContentSection = ({
  sections = [],
  onSectionsChange,
  addButtonText = "Add New Section",
  t,
}) => {
  const [localSections, setLocalSections] = useState(sections);
  const updateTimeoutRef = useRef(null);
  const { hasPermission } = usePermission();

  const hasBulkPermission = hasPermission("content.bulk-create");

  useEffect(() => {
    if (sections.length === 0 && localSections.length === 0) {
      const defaultSection = {
        id: Date.now(),
        type: "text",
        title: "",
        content: "",
        media_shortcut: "",
        order: 1,
        editorKey: `default-${Date.now()}-text`,
      };
      setLocalSections([defaultSection]);
      onSectionsChange([defaultSection]);
    }
  }, []);

  useEffect(() => {
    if (sections.length > 0 && localSections.length === 0) {
      setLocalSections(sections);
    }
  }, [sections]);

  const updateParent = useCallback(
    (newSections) => {
      setLocalSections(newSections);
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        onSectionsChange(newSections);
      }, 500);
    },
    [onSectionsChange],
  );

  const addSection = useCallback(() => {
    if (!hasBulkPermission) return;

    const id = Date.now();
    const newSection = {
      id,
      type: "text",
      title: "",
      content: "",
      media_shortcut: "",
      order: localSections.length + 1,
      editorKey: `${id}-text-init`,
    };
    updateParent([...localSections, newSection]);
  }, [localSections, updateParent, hasBulkPermission]);

  const removeSection = useCallback(
    (id) => {
      if (!hasBulkPermission && localSections.length === 1) return;

      const updated = localSections
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, order: idx + 1 }));
      updateParent(updated);
    },
    [localSections, updateParent, hasBulkPermission],
  );

  const updateSection = useCallback(
    (id, updates) => {
      const updated = localSections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      );
      updateParent(updated);
    },
    [localSections, updateParent],
  );

  return (
    <div className="space-y-6">
      {localSections.map((section) => (
        <Section
          key={section.id}
          section={section}
          onUpdate={updateSection}
          onRemove={removeSection}
          t={t}
          hasBulkPermission={hasBulkPermission}
          isOnlySection={!hasBulkPermission && localSections.length === 1}
        />
      ))}

      {hasBulkPermission && (
        <button
          type="button"
          onClick={addSection}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <FiPlus size={18} />
          {addButtonText}
        </button>
      )}
    </div>
  );
};

export default DynamicContentSection;
