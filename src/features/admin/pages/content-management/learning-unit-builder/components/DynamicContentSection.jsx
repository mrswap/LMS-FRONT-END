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



// import { useState, useEffect, useRef, memo, useCallback } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// // ✅ Yeh karo (correct way)
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import {
//   FiPlus,
//   FiTrash2,
//   FiImage,
//   FiType,
//   FiTable,
//   FiLink,
//   FiBold,
//   FiItalic,
//   FiList,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
//   FiUnderline,
// } from "react-icons/fi";
// import usePermission from "../../../../../../hooks/usePermission";

// // ─── TipTap Text Editor with Table Support ─────────────────────────────────────────────
// const TextEditor = memo(({ value, onChange, t }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: {
//           levels: [1, 2, 3, 4, 5, 6],
//         },
//       }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           class: "text-blue-500 underline",
//         },
//       }),
//       Image.configure({
//         inline: true,
//         allowBase64: true,
//         HTMLAttributes: {
//           class: "max-w-full h-auto rounded-lg",
//         },
//       }),
//       Placeholder.configure({
//         placeholder:
//           t("learningUnitBuilder.details.content.editorPlaceholder") ||
//           "Write something...",
//       }),
//       Table.configure({
//         resizable: true,
//         HTMLAttributes: {
//           class: "min-w-full border-collapse",
//         },
//       }),
//       TableRow,
//       TableCell,
//       TableHeader,
//     ],
//     content: value || "",
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     editorProps: {
//       attributes: {
//         class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
//       },
//     },
//   });

//   // Update content when value changes externally
//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value || "");
//     }
//   }, [editor, value]);

//   if (!editor) {
//     return (
//       <div className="border border-gray-300 rounded-lg p-4 min-h-[350px] bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-400">Loading editor...</div>
//       </div>
//     );
//   }

//   // Toolbar functions
//   const addTable = () => {
//     const rows = prompt("Number of rows:", "3");
//     const cols = prompt("Number of columns:", "3");
//     if (rows && cols) {
//       editor.commands.insertTable({
//         rows: parseInt(rows),
//         cols: parseInt(cols),
//         withHeaderRow: true,
//       });
//     }
//   };

//   const addImage = () => {
//     const url = prompt("Enter image URL:");
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   const addLink = () => {
//     const url = prompt("Enter URL:");
//     if (url) {
//       editor.chain().focus().setLink({ href: url }).run();
//     }
//   };

//   return (
//     <div className="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
//       {/* Toolbar */}
//       <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
//         {/* Text Formatting */}
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Bold"
//         >
//           <FiBold size={16} />
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Italic"
//         >
//           <FiItalic size={16} />
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Underline"
//         >
//           <FiUnderline size={16} />
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1" />

//         {/* Headers */}
//         <select
//           onChange={(e) => {
//             const value = e.target.value;
//             if (value === "paragraph") {
//               editor.chain().focus().setParagraph().run();
//             } else {
//               editor
//                 .chain()
//                 .focus()
//                 .toggleHeading({ level: parseInt(value) })
//                 .run();
//             }
//           }}
//           className="p-1 rounded border border-gray-300 text-sm bg-white"
//           value={(() => {
//             if (editor.isActive("heading", { level: 1 })) return "1";
//             if (editor.isActive("heading", { level: 2 })) return "2";
//             if (editor.isActive("heading", { level: 3 })) return "3";
//             if (editor.isActive("heading", { level: 4 })) return "4";
//             return "paragraph";
//           })()}
//         >
//           <option value="paragraph">Normal</option>
//           <option value="1">Heading 1</option>
//           <option value="2">Heading 2</option>
//           <option value="3">Heading 3</option>
//           <option value="4">Heading 4</option>
//         </select>

//         <div className="w-px h-6 bg-gray-300 mx-1" />

//         {/* Lists */}
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Bullet List"
//         >
//           <FiList size={16} />
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Numbered List"
//         >
//           <span className="font-bold text-sm">1.</span>
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1" />

//         {/* Alignment */}
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Align Left"
//         >
//           <FiAlignLeft size={16} />
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Align Center"
//         >
//           <FiAlignCenter size={16} />
//         </button>

//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Align Right"
//         >
//           <FiAlignRight size={16} />
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1" />

//         {/* Table */}
//         <button
//           type="button"
//           onClick={addTable}
//           className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
//           title="Insert Table"
//         >
//           <FiTable size={16} />
//         </button>

//         {/* Image */}
//         <button
//           type="button"
//           onClick={addImage}
//           className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
//           title="Insert Image"
//         >
//           <FiImage size={16} />
//         </button>

//         {/* Link */}
//         <button
//           type="button"
//           onClick={addLink}
//           className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//           title="Insert Link"
//         >
//           <FiLink size={16} />
//         </button>

//         <div className="w-px h-6 bg-gray-300 mx-1" />

//         {/* Table Row/Column Operations (only show when inside a table) */}
//         {editor.isActive("table") && (
//           <>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().addRowBefore().run()}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
//               title="Add Row Above"
//             >
//               + Row ↑
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().addRowAfter().run()}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
//               title="Add Row Below"
//             >
//               + Row ↓
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().addColumnBefore().run()}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
//               title="Add Column Left"
//             >
//               + Col ←
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().addColumnAfter().run()}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
//               title="Add Column Right"
//             >
//               + Col →
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().deleteRow().run()}
//               className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
//               title="Delete Row"
//             >
//               - Row
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().deleteColumn().run()}
//               className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
//               title="Delete Column"
//             >
//               - Col
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().deleteTable().run()}
//               className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
//               title="Delete Table"
//             >
//               Delete Table
//             </button>
//           </>
//         )}
//       </div>

//       {/* Editor Content */}
//       <EditorContent editor={editor} className="tiptap-content" />

//       <style>{`
//         .tiptap-content .ProseMirror {
//           min-height: 300px;
//           padding: 1rem;
//         }
//         .tiptap-content .ProseMirror:focus {
//           outline: none;
//         }
//         .tiptap-content table {
//           border-collapse: collapse;
//           width: 100%;
//           margin: 1rem 0;
//         }
//         .tiptap-content td,
//         .tiptap-content th {
//           border: 1px solid #ddd;
//           padding: 8px;
//           position: relative;
//         }
//         .tiptap-content th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .tiptap-content .selectedCell {
//           background-color: #e0f2fe;
//         }
//         .tiptap-content p {
//           margin: 0 0 1rem;
//         }
//         .tiptap-content ul, 
//         .tiptap-content ol {
//           padding-left: 1.5rem;
//           margin: 0 0 1rem;
//         }
//         .tiptap-content li {
//           margin: 0.25rem 0;
//         }
//         .tiptap-content h1 {
//           font-size: 2rem;
//           font-weight: 700;
//           margin: 1rem 0 0.5rem;
//         }
//         .tiptap-content h2 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin: 1rem 0 0.5rem;
//         }
//         .tiptap-content h3 {
//           font-size: 1.25rem;
//           font-weight: 600;
//           margin: 0.75rem 0 0.5rem;
//         }
//         .tiptap-content img {
//           max-width: 100%;
//           height: auto;
//           margin: 0.5rem 0;
//           border-radius: 0.5rem;
//         }
//         .tiptap-content a {
//           color: #3b82f6;
//           text-decoration: underline;
//         }
//       `}</style>
//     </div>
//   );
// });

// TextEditor.displayName = "TextEditor";

// // ─── Section Component ───────────────────────────────────────────────────────────
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

// // ─── DynamicContentSection Component ───────────────────────────────────────────
// const DynamicContentSection = ({
//   sections = [],
//   onSectionsChange,
//   addButtonText = "Add New Section",
//   t,
// }) => {
//   const [localSections, setLocalSections] = useState(sections);
//   const updateTimeoutRef = useRef(null);
//   const { hasPermission } = usePermission();

//   const hasBulkPermission = hasPermission("content.bulk-create");

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
//     if (!hasBulkPermission) return;

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



// DynamicContentSection.jsx (Refactored)

import { useState, useEffect, useRef, memo, useCallback } from "react";
import {
  FiPlus,
  FiTrash2,
  FiImage,
  FiType,
} from "react-icons/fi";
import usePermission from "../../../../../../hooks/usePermission";
import CustomEditor from "../../../../common/CustomEditor";

// ─── Section Component ───────────────────────────────────────────────────────────
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
          <CustomEditor
            key={section.editorKey || `${section.id}-text`}
            value={section.content}
            onChange={handleContentChange}
            placeholder={t("learningUnitBuilder.details.content.editorPlaceholder")}
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
            <CustomEditor
              key={`${section.editorKey || section.id}-desc`}
              value={section.content}
              onChange={handleContentChange}
              placeholder={t("learningUnitBuilder.details.content.editorPlaceholder")}
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

// ─── DynamicContentSection Component ───────────────────────────────────────────
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