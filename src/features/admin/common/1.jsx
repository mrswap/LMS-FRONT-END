// // // // // import { memo, useEffect, useState } from "react";

// // // // // // =========================
// // // // // // Tiptap Core
// // // // // // =========================
// // // // // import { useEditor, EditorContent, Extension } from "@tiptap/react";
// // // // // import StarterKit from "@tiptap/starter-kit";

// // // // // // =========================
// // // // // // Tiptap Extensions
// // // // // // =========================
// // // // // import { Table } from "@tiptap/extension-table";
// // // // // import { TableRow } from "@tiptap/extension-table-row";
// // // // // import { TableCell } from "@tiptap/extension-table-cell";
// // // // // import { TableHeader } from "@tiptap/extension-table-header";

// // // // // import Image from "@tiptap/extension-image";
// // // // // import Link from "@tiptap/extension-link";
// // // // // import Placeholder from "@tiptap/extension-placeholder";
// // // // // import Underline from "@tiptap/extension-underline";
// // // // // import TextAlign from "@tiptap/extension-text-align";
// // // // // import Highlight from "@tiptap/extension-highlight";

// // // // // import { TextStyle } from "@tiptap/extension-text-style";
// // // // // import { Color } from "@tiptap/extension-color";

// // // // // import FontFamily from "@tiptap/extension-font-family";
// // // // // import HorizontalRule from "@tiptap/extension-horizontal-rule";

// // // // // import Blockquote from "@tiptap/extension-blockquote";
// // // // // import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // // // // // =========================
// // // // // // Lowlight + Highlight.js
// // // // // // =========================
// // // // // import { createLowlight } from "lowlight";
// // // // // import javascript from "highlight.js/lib/languages/javascript";
// // // // // import xml from "highlight.js/lib/languages/xml";
// // // // // import css from "highlight.js/lib/languages/css";
// // // // // import json from "highlight.js/lib/languages/json";
// // // // // import typescript from "highlight.js/lib/languages/typescript";
// // // // // import bash from "highlight.js/lib/languages/bash";
// // // // // import "highlight.js/styles/github-dark.css";

// // // // // const lowlight = createLowlight();
// // // // // lowlight.register("javascript", javascript);
// // // // // lowlight.register("js", javascript);
// // // // // lowlight.register("html", xml);
// // // // // lowlight.register("xml", xml);
// // // // // lowlight.register("css", css);
// // // // // lowlight.register("json", json);
// // // // // lowlight.register("typescript", typescript);
// // // // // lowlight.register("ts", typescript);
// // // // // lowlight.register("bash", bash);
// // // // // lowlight.register("shell", bash);

// // // // // // =========================
// // // // // // FIX 1: Custom FontSize Extension
// // // // // // TextStyle extension alone doesn't handle fontSize attribute
// // // // // // We need to explicitly extend it
// // // // // // =========================
// // // // // const FontSize = Extension.create({
// // // // //   name: "fontSize",
// // // // //   addOptions() {
// // // // //     return { types: ["textStyle"] };
// // // // //   },
// // // // //   addGlobalAttributes() {
// // // // //     return [
// // // // //       {
// // // // //         types: this.options.types,
// // // // //         attributes: {
// // // // //           fontSize: {
// // // // //             default: null,
// // // // //             parseHTML: (element) => element.style.fontSize || null,
// // // // //             renderHTML: (attributes) => {
// // // // //               if (!attributes.fontSize) return {};
// // // // //               return { style: `font-size: ${attributes.fontSize}` };
// // // // //             },
// // // // //           },
// // // // //         },
// // // // //       },
// // // // //     ];
// // // // //   },
// // // // //   addCommands() {
// // // // //     return {
// // // // //       setFontSize:
// // // // //         (fontSize) =>
// // // // //         ({ chain }) => {
// // // // //           return chain().setMark("textStyle", { fontSize }).run();
// // // // //         },
// // // // //       unsetFontSize:
// // // // //         () =>
// // // // //         ({ chain }) => {
// // // // //           return chain()
// // // // //             .setMark("textStyle", { fontSize: null })
// // // // //             .removeEmptyTextStyle()
// // // // //             .run();
// // // // //         },
// // // // //     };
// // // // //   },
// // // // // });

// // // // // // =========================
// // // // // // React Icons
// // // // // // =========================
// // // // // import {
// // // // //   FiBold,
// // // // //   FiItalic,
// // // // //   FiUnderline,
// // // // //   FiList,
// // // // //   FiAlignLeft,
// // // // //   FiAlignCenter,
// // // // //   FiAlignRight,
// // // // //   FiTable,
// // // // //   FiImage,
// // // // //   FiCode,
// // // // //   FiMinus,
// // // // //   FiX,
// // // // //   FiLink as FiLinkIcon,
// // // // // } from "react-icons/fi";
// // // // // import {
// // // // //   MdFormatColorText,
// // // // //   MdFormatColorFill,
// // // // //   MdFormatQuote,
// // // // //   MdFormatClear,
// // // // // } from "react-icons/md";

// // // // // const COLORS = [
// // // // //   "#000000",
// // // // //   "#DC2626",
// // // // //   "#059669",
// // // // //   "#2563EB",
// // // // //   "#D97706",
// // // // //   "#7C3AED",
// // // // //   "#DB2777",
// // // // //   "#4B5563",
// // // // //   "#FFFFFF",
// // // // //   "#FCD34D",
// // // // //   "#F97316",
// // // // //   "#EC4899",
// // // // //   "#06B6D4",
// // // // //   "#84CC16",
// // // // //   "#8B5CF6",
// // // // // ];

// // // // // const HIGHLIGHT_COLORS = [
// // // // //   { color: "#FEF08A", label: "Yellow" },
// // // // //   { color: "#86EFAC", label: "Green" },
// // // // //   { color: "#FDA4AF", label: "Pink" },
// // // // //   { color: "#93C5FD", label: "Blue" },
// // // // //   { color: "#FED7AA", label: "Orange" },
// // // // //   { color: "#E9D5FF", label: "Purple" },
// // // // // ];

// // // // // const CustomEditor = memo(
// // // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // // // //     const [showHighlighter, setShowHighlighter] = useState(false);

// // // // //     const editor = useEditor({
// // // // //       extensions: [
// // // // //         StarterKit.configure({
// // // // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // // // //           codeBlock: false,
// // // // //           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
// // // // //           // but we still import Blockquote separately for the toggle button
// // // // //           blockquote: true,
// // // // //           // Ordered list fix — keep enabled in StarterKit
// // // // //           orderedList: {
// // // // //             keepMarks: true,
// // // // //             keepAttributes: true,
// // // // //           },
// // // // //           bulletList: {
// // // // //             keepMarks: true,
// // // // //             keepAttributes: true,
// // // // //           },
// // // // //         }),
// // // // //         Underline,
// // // // //         TextAlign.configure({
// // // // //           types: ["heading", "paragraph"],
// // // // //           alignments: ["left", "center", "right", "justify"],
// // // // //         }),
// // // // //         Highlight.configure({ multicolor: true }),
// // // // //         TextStyle,
// // // // //         Color,
// // // // //         FontFamily,
// // // // //         // FIX 1: Use our custom FontSize extension
// // // // //         FontSize,
// // // // //         // FIX 2: Don't include Blockquote separately since StarterKit already has it
// // // // //         // (double registration causes issues)
// // // // //         Link.configure({
// // // // //           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
// // // // //           linkOnPaste: true,
// // // // //           autolink: true,
// // // // //           HTMLAttributes: {
// // // // //             class: "custom-link",
// // // // //             rel: "noopener noreferrer",
// // // // //             target: "_blank",
// // // // //           },
// // // // //         }),
// // // // //         Image.configure({
// // // // //           inline: true,
// // // // //           allowBase64: true,
// // // // //         }),
// // // // //         Placeholder.configure({
// // // // //           placeholder: placeholder || "Write something...",
// // // // //         }),
// // // // //         Table.configure({ resizable: true }),
// // // // //         TableRow,
// // // // //         TableCell,
// // // // //         TableHeader,
// // // // //         HorizontalRule,
// // // // //         CodeBlockLowlight.configure({ lowlight }),
// // // // //       ],
// // // // //       content: value || "",
// // // // //       onUpdate: ({ editor }) => {
// // // // //         onChange(editor.getHTML());
// // // // //         const html = editor.getHTML();
// // // // //         console.log("===== TIPTAP HTML =====");
// // // // //         console.log(html);
// // // // //       },
// // // // //       editorProps: {
// // // // //         attributes: {
// // // // //           class: "editor-content",
// // // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
// // // // //         },
// // // // //       },
// // // // //     });

// // // // //     // Sync external value changes
// // // // //     useEffect(() => {
// // // // //       if (editor && value !== editor.getHTML()) {
// // // // //         editor.commands.setContent(value || "", false);
// // // // //       }
// // // // //     }, [editor, value]);

// // // // //     // Close pickers on outside click
// // // // //     useEffect(() => {
// // // // //       const handler = (e) => {
// // // // //         if (!e.target.closest(".color-picker-wrapper")) {
// // // // //           setShowColorPicker(false);
// // // // //           setShowBgColorPicker(false);
// // // // //           setShowHighlighter(false);
// // // // //         }
// // // // //       };
// // // // //       document.addEventListener("mousedown", handler);
// // // // //       return () => document.removeEventListener("mousedown", handler);
// // // // //     }, []);

// // // // //     if (!editor) {
// // // // //       return (
// // // // //         <div
// // // // //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// // // // //           style={{ minHeight }}
// // // // //         >
// // // // //           <div className="text-gray-400">Loading editor...</div>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     const addTable = () => {
// // // // //       const rows = prompt("Number of rows:", "3");
// // // // //       const cols = prompt("Number of columns:", "3");
// // // // //       if (rows && cols) {
// // // // //         editor
// // // // //           .chain()
// // // // //           .focus()
// // // // //           .insertTable({
// // // // //             rows: parseInt(rows),
// // // // //             cols: parseInt(cols),
// // // // //             withHeaderRow: true,
// // // // //           })
// // // // //           .run();
// // // // //       }
// // // // //     };

// // // // //     const addImage = () => {
// // // // //       const url = prompt("Enter image URL:");
// // // // //       if (url) editor.chain().focus().setImage({ src: url }).run();
// // // // //     };

// // // // //     // Same pattern as addImage — prompt() keeps selection alive
// // // // //     const openLinkDialog = () => {
// // // // //       const url = window.prompt("Enter link URL:");
// // // // //       if (!url) return;
// // // // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // // // //       // If text is selected, wrap it; otherwise just apply mark at cursor
// // // // //       const { from, to } = editor.state.selection;
// // // // //       if (from === to) {
// // // // //         // No selection: insert the URL as visible linked text
// // // // //         editor
// // // // //           .chain()
// // // // //           .focus()
// // // // //           .insertContent(`<a href="${href}">${href}</a>`)
// // // // //           .run();
// // // // //       } else {
// // // // //         editor.chain().focus().setLink({ href }).run();
// // // // //       }
// // // // //     };

// // // // //     const removeLink = () => {
// // // // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // // // //     };

// // // // //     // FIX 1: Use our custom setFontSize command
// // // // //     const setFontSize = (size) => {
// // // // //       if (size === "default") {
// // // // //         editor.chain().focus().unsetFontSize().run();
// // // // //       } else {
// // // // //         editor.chain().focus().setFontSize(size).run();
// // // // //       }
// // // // //     };

// // // // //     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
// // // // //     const handleSetTextColor = (color) => {
// // // // //       editor.chain().focus().setColor(color).run();
// // // // //       setShowColorPicker(false);
// // // // //     };

// // // // //     const handleUnsetTextColor = () => {
// // // // //       editor.chain().focus().unsetColor().run();
// // // // //       setShowColorPicker(false);
// // // // //     };

// // // // //     // FIX 4: Highlight color — same fix
// // // // //     const handleSetHighlight = (color) => {
// // // // //       editor.chain().focus().setHighlight({ color }).run();
// // // // //       setShowBgColorPicker(false);
// // // // //     };

// // // // //     const handleUnsetHighlight = () => {
// // // // //       editor.chain().focus().unsetHighlight().run();
// // // // //       setShowBgColorPicker(false);
// // // // //     };

// // // // //     const clearFormatting = () => {
// // // // //       editor.chain().focus().clearNodes().unsetAllMarks().run();
// // // // //     };

// // // // //     // Get current heading value for the dropdown
// // // // //     const currentHeading = (() => {
// // // // //       for (let i = 1; i <= 4; i++) {
// // // // //         if (editor.isActive("heading", { level: i })) return String(i);
// // // // //       }
// // // // //       return "paragraph";
// // // // //     })();

// // // // //     return (
// // // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
// // // // //         {/* ── Toolbar ── */}
// // // // //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// // // // //           {/* Font Family */}
// // // // //           <select
// // // // //             onChange={(e) => {
// // // // //               const font = e.target.value;
// // // // //               if (font === "default")
// // // // //                 editor.chain().focus().unsetFontFamily().run();
// // // // //               else editor.chain().focus().setFontFamily(font).run();
// // // // //             }}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //           >
// // // // //             <option value="default">Font Family</option>
// // // // //             <option value="Arial">Arial</option>
// // // // //             <option value="Georgia">Georgia</option>
// // // // //             <option value="Times New Roman">Times New Roman</option>
// // // // //             <option value="Courier New">Courier New</option>
// // // // //             <option value="Verdana">Verdana</option>
// // // // //           </select>

// // // // //           {/* FIX 1: Font Size — uses custom FontSize extension */}
// // // // //           <select
// // // // //             onChange={(e) => setFontSize(e.target.value)}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //             defaultValue="default"
// // // // //           >
// // // // //             <option value="default">Font Size</option>
// // // // //             <option value="12px">12px</option>
// // // // //             <option value="14px">14px</option>
// // // // //             <option value="16px">16px</option>
// // // // //             <option value="18px">18px</option>
// // // // //             <option value="20px">20px</option>
// // // // //             <option value="24px">24px</option>
// // // // //             <option value="28px">28px</option>
// // // // //             <option value="32px">32px</option>
// // // // //           </select>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault(); // Don't lose selection
// // // // //                 setShowColorPicker((v) => !v);
// // // // //                 setShowBgColorPicker(false);
// // // // //                 setShowHighlighter(false);
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // // //               title="Text Color"
// // // // //             >
// // // // //               <MdFormatColorText size={18} />
// // // // //               <span
// // // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // // //                 style={{
// // // // //                   backgroundColor:
// // // // //                     editor.getAttributes("textStyle").color || "transparent",
// // // // //                 }}
// // // // //               />
// // // // //             </button>
// // // // //             {showColorPicker && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     handleUnsetTextColor();
// // // // //                   }}
// // // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // // //                 >
// // // // //                   Remove Color
// // // // //                 </button>
// // // // //                 {COLORS.map((color) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       handleSetTextColor(color);
// // // // //                     }}
// // // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // // //                     style={{
// // // // //                       backgroundColor: color,
// // // // //                       border:
// // // // //                         color === "#FFFFFF"
// // // // //                           ? "1px solid #ddd"
// // // // //                           : "1px solid transparent",
// // // // //                       outline:
// // // // //                         editor.getAttributes("textStyle").color === color
// // // // //                           ? "2px solid #2563eb"
// // // // //                           : "none",
// // // // //                       outlineOffset: "2px",
// // // // //                     }}
// // // // //                   />
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 setShowBgColorPicker((v) => !v);
// // // // //                 setShowColorPicker(false);
// // // // //                 setShowHighlighter(false);
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // // //               title="Background Color"
// // // // //             >
// // // // //               <MdFormatColorFill size={18} />
// // // // //               <span
// // // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // // //                 style={{
// // // // //                   backgroundColor:
// // // // //                     editor.getAttributes("highlight").color || "transparent",
// // // // //                 }}
// // // // //               />
// // // // //             </button>
// // // // //             {showBgColorPicker && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     handleUnsetHighlight();
// // // // //                   }}
// // // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // // //                 >
// // // // //                   Remove Background
// // // // //                 </button>
// // // // //                 {COLORS.map((color) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       handleSetHighlight(color);
// // // // //                     }}
// // // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // // //                     style={{
// // // // //                       backgroundColor: color,
// // // // //                       border:
// // // // //                         color === "#FFFFFF"
// // // // //                           ? "1px solid #ddd"
// // // // //                           : "1px solid transparent",
// // // // //                     }}
// // // // //                   />
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* Highlighter Pen */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 setShowHighlighter((v) => !v);
// // // // //                 setShowColorPicker(false);
// // // // //                 setShowBgColorPicker(false);
// // // // //               }}
// // // // //               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //               style={
// // // // //                 editor.isActive("highlight")
// // // // //                   ? {
// // // // //                       backgroundColor:
// // // // //                         editor.getAttributes("highlight").color || "#FEF08A",
// // // // //                       color: "#000",
// // // // //                     }
// // // // //                   : {}
// // // // //               }
// // // // //               title="Highlighter"
// // // // //             >
// // // // //               <svg
// // // // //                 width="16"
// // // // //                 height="16"
// // // // //                 viewBox="0 0 24 24"
// // // // //                 fill="none"
// // // // //                 stroke="currentColor"
// // // // //                 strokeWidth="2"
// // // // //                 strokeLinecap="round"
// // // // //                 strokeLinejoin="round"
// // // // //               >
// // // // //                 <path d="M12 20h9" />
// // // // //                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
// // // // //               </svg>
// // // // //             </button>
// // // // //             {showHighlighter && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
// // // // //                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
// // // // //                   Highlight Color
// // // // //                 </span>
// // // // //                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       editor.chain().focus().setHighlight({ color }).run();
// // // // //                       setShowHighlighter(false);
// // // // //                     }}
// // // // //                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
// // // // //                   >
// // // // //                     <span
// // // // //                       className="w-5 h-5 rounded-sm border flex-shrink-0"
// // // // //                       style={{
// // // // //                         backgroundColor: color,
// // // // //                         borderColor:
// // // // //                           editor.getAttributes("highlight").color === color
// // // // //                             ? "#2563eb"
// // // // //                             : "#e5e7eb",
// // // // //                         outline:
// // // // //                           editor.getAttributes("highlight").color === color
// // // // //                             ? "2px solid #2563eb"
// // // // //                             : "none",
// // // // //                         outlineOffset: "2px",
// // // // //                       }}
// // // // //                     />
// // // // //                     {label}
// // // // //                   </button>
// // // // //                 ))}
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     editor.chain().focus().unsetHighlight().run();
// // // // //                     setShowHighlighter(false);
// // // // //                   }}
// // // // //                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
// // // // //                 >
// // // // //                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
// // // // //                   Remove
// // // // //                 </button>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Bold */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBold().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Bold"
// // // // //           >
// // // // //             <FiBold size={16} />
// // // // //           </button>

// // // // //           {/* Italic */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleItalic().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Italic"
// // // // //           >
// // // // //             <FiItalic size={16} />
// // // // //           </button>

// // // // //           {/* Underline */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleUnderline().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Underline"
// // // // //           >
// // // // //             <FiUnderline size={16} />
// // // // //           </button>

// // // // //           {/* Clear Formatting */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               clearFormatting();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // // //             title="Clear Formatting"
// // // // //           >
// // // // //             <MdFormatClear size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Heading Select */}
// // // // //           <select
// // // // //             onChange={(e) => {
// // // // //               const val = e.target.value;
// // // // //               if (val === "paragraph")
// // // // //                 editor.chain().focus().setParagraph().run();
// // // // //               else
// // // // //                 editor
// // // // //                   .chain()
// // // // //                   .focus()
// // // // //                   .toggleHeading({ level: parseInt(val) })
// // // // //                   .run();
// // // // //             }}
// // // // //             value={currentHeading}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //           >
// // // // //             <option value="paragraph">Normal</option>
// // // // //             <option value="1">Heading 1</option>
// // // // //             <option value="2">Heading 2</option>
// // // // //             <option value="3">Heading 3</option>
// // // // //             <option value="4">Heading 4</option>
// // // // //           </select>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Align Left */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("left").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignLeft size={16} />
// // // // //           </button>
// // // // //           {/* Align Center */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("center").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignCenter size={16} />
// // // // //           </button>
// // // // //           {/* Align Right */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("right").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignRight size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Bullet List */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBulletList().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Bullet List"
// // // // //           >
// // // // //             <FiList size={16} />
// // // // //           </button>

// // // // //           {/* FIX 5: Ordered List — proper toggle */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleOrderedList().run();
// // // // //             }}
// // // // //             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Numbered List"
// // // // //           >
// // // // //             1.
// // // // //           </button>

// // // // //           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBlockquote().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Blockquote"
// // // // //           >
// // // // //             <MdFormatQuote size={16} />
// // // // //           </button>

// // // // //           {/* Code Block */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleCodeBlock().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Code Block"
// // // // //           >
// // // // //             <FiCode size={16} />
// // // // //           </button>

// // // // //           {/* Horizontal Rule */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setHorizontalRule().run();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Horizontal Rule"
// // // // //           >
// // // // //             <FiMinus size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Table */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               addTable();
// // // // //             }}
// // // // //             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Insert Table"
// // // // //           >
// // // // //             <div className="grid grid-cols-2 gap-[2px]">
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //             </div>
// // // // //             <span className="text-sm font-medium">Table</span>
// // // // //           </button>

// // // // //           {/* Image */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               addImage();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Insert Image"
// // // // //           >
// // // // //             <FiImage size={16} />
// // // // //           </button>

// // // // //           {/* Link button — uses prompt() so selection is preserved */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               openLinkDialog();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Insert Link"
// // // // //           >
// // // // //             <FiLinkIcon size={16} />
// // // // //           </button>

// // // // //           {/* Single Quote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               const { from, to } = editor.state.selection;
// // // // //               if (from === to) {
// // // // //                 // No selection — insert '' and place cursor inside
// // // // //                 editor.chain().focus().insertContent("''").run();
// // // // //               } else {
// // // // //                 // Wrap selected text with single quotes
// // // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // // //                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
// // // // //               }
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // // //             title="Single Quotes"
// // // // //           >
// // // // //             '&thinsp;'
// // // // //           </button>

// // // // //           {/* Double Quote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               const { from, to } = editor.state.selection;
// // // // //               if (from === to) {
// // // // //                 editor.chain().focus().insertContent('""').run();
// // // // //               } else {
// // // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // // //                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
// // // // //               }
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // // //             title="Double Quotes"
// // // // //           >
// // // // //             "&thinsp;"
// // // // //           </button>

// // // // //           {editor.isActive("link") && (
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 removeLink();
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // // //               title="Remove Link"
// // // // //             >
// // // // //               Remove Link
// // // // //             </button>
// // // // //           )}

// // // // //           {/* Table Controls — shown only when inside a table */}
// // // // //           {editor.isActive("table") && (
// // // // //             <>
// // // // //               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
// // // // //               {[
// // // // //                 {
// // // // //                   label: "+ Row ↑",
// // // // //                   action: () => editor.chain().focus().addRowBefore().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Row ↓",
// // // // //                   action: () => editor.chain().focus().addRowAfter().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Col ←",
// // // // //                   action: () => editor.chain().focus().addColumnBefore().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Col →",
// // // // //                   action: () => editor.chain().focus().addColumnAfter().run(),
// // // // //                 },
// // // // //               ].map(({ label, action }) => (
// // // // //                 <button
// // // // //                   key={label}
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     action();
// // // // //                   }}
// // // // //                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
// // // // //                 >
// // // // //                   {label}
// // // // //                 </button>
// // // // //               ))}
// // // // //               {[
// // // // //                 {
// // // // //                   label: "- Row",
// // // // //                   action: () => editor.chain().focus().deleteRow().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "- Col",
// // // // //                   action: () => editor.chain().focus().deleteColumn().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "Delete Table",
// // // // //                   action: () => editor.chain().focus().deleteTable().run(),
// // // // //                 },
// // // // //               ].map(({ label, action }) => (
// // // // //                 <button
// // // // //                   key={label}
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     action();
// // // // //                   }}
// // // // //                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // // //                 >
// // // // //                   {label}
// // // // //                 </button>
// // // // //               ))}
// // // // //             </>
// // // // //           )}
// // // // //         </div>

// // // // //         <EditorContent editor={editor} />

// // // // //         <style>{`
// // // // //         /* ── Editor reset ── */
// // // // //         .editor-wrapper .editor-content:focus {
// // // // //           outline: none;
// // // // //         }

// // // // //         /* Dark caret + cursor visible on white background */
// // // // //         .editor-wrapper .editor-content {
// // // // //           caret-color: #2563EB;
// // // // //           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
// // // // //         }

// // // // //         /* ── Placeholder ── */
// // // // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // // // //           content: attr(data-placeholder);
// // // // //           float: left;
// // // // //           color: #adb5bd;
// // // // //           pointer-events: none;
// // // // //           height: 0;
// // // // //         }

// // // // //         /* FIX 4: Override browser text selection so applied colors remain visible */
// // // // //         .editor-wrapper .editor-content ::selection {
// // // // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // // // //           color: inherit !important;
// // // // //         }

// // // // //         /* FIX 4: Highlight / background color — always visible */
// // // // //         .editor-wrapper mark {
// // // // //           padding: 0.1em 0;
// // // // //           border-radius: 2px;
// // // // //         }

// // // // //         /* FIX 3: Links visible inside editor */
// // // // //         .editor-wrapper .custom-link,
// // // // //         .editor-wrapper a {
// // // // //           color: #2563eb !important;
// // // // //           text-decoration: underline !important;
// // // // //           cursor: pointer !important;
// // // // //         }
// // // // //         .editor-wrapper .custom-link:hover,
// // // // //         .editor-wrapper a:hover {
// // // // //           color: #1d4ed8 !important;
// // // // //         }

// // // // //         /* ── Table ── */
// // // // //         .editor-wrapper table {
// // // // //           border-collapse: collapse;
// // // // //           width: 100%;
// // // // //           margin: 1rem 0;
// // // // //           table-layout: fixed;
// // // // //         }
// // // // //         .editor-wrapper td,
// // // // //         .editor-wrapper th {
// // // // //           border: 1px solid #d1d5db;
// // // // //           padding: 8px 12px;
// // // // //           position: relative;
// // // // //         }
// // // // //         .editor-wrapper th {
// // // // //           background-color: #f3f4f6;
// // // // //           font-weight: 600;
// // // // //         }
// // // // //         .editor-wrapper .selectedCell::after {
// // // // //           content: "";
// // // // //           position: absolute;
// // // // //           inset: 0;
// // // // //           background: rgba(59, 130, 246, 0.15);
// // // // //           pointer-events: none;
// // // // //         }

// // // // //         /* ── Typography ── */
// // // // //         .editor-wrapper .editor-content p {
// // // // //           margin: 0 0 0.75rem;
// // // // //           line-height: 1.6;
// // // // //         }

// // // // //         /* FIX 5: Ordered & bullet lists */
// // // // //         .editor-wrapper .editor-content ul {
// // // // //           list-style-type: disc;
// // // // //           padding-left: 1.75rem;
// // // // //           margin: 0 0 0.75rem;
// // // // //         }
// // // // //         .editor-wrapper .editor-content ol {
// // // // //           list-style-type: decimal;
// // // // //           padding-left: 1.75rem;
// // // // //           margin: 0 0 0.75rem;
// // // // //         }
// // // // //         .editor-wrapper .editor-content li {
// // // // //           margin-bottom: 0.25rem;
// // // // //           line-height: 1.6;
// // // // //         }
// // // // //         .editor-wrapper .editor-content li p {
// // // // //           margin: 0;
// // // // //         }

// // // // //         /* FIX 2: Blockquote */
// // // // //         .editor-wrapper .editor-content blockquote {
// // // // //           border-left: 4px solid #3b82f6;
// // // // //           padding: 0.5rem 1rem;
// // // // //           margin: 1rem 0;
// // // // //           color: #4b5563;
// // // // //           font-style: italic;
// // // // //           background-color: #f8fafc;
// // // // //           border-radius: 0 4px 4px 0;
// // // // //         }
// // // // //         .editor-wrapper .editor-content blockquote p {
// // // // //           margin: 0;
// // // // //         }

// // // // //         /* ── Headings ── */
// // // // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // // // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // // // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // // // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // // // //         /* ── Image ── */
// // // // //         .editor-wrapper .editor-content img {
// // // // //           max-width: 100%;
// // // // //           height: auto;
// // // // //           border-radius: 0.5rem;
// // // // //           margin: 0.5rem 0;
// // // // //         }

// // // // //         /* ── Code ── */
// // // // //         .editor-wrapper .editor-content pre {
// // // // //           background-color: #1f2937;
// // // // //           color: #f3f4f6;
// // // // //           padding: 1rem;
// // // // //           border-radius: 0.5rem;
// // // // //           overflow-x: auto;
// // // // //           font-family: monospace;
// // // // //           font-size: 0.875rem;
// // // // //           margin: 1rem 0;
// // // // //         }
// // // // //         .editor-wrapper .editor-content code:not(pre code) {
// // // // //           background-color: #f3f4f6;
// // // // //           padding: 0.125rem 0.3rem;
// // // // //           border-radius: 0.25rem;
// // // // //           font-family: monospace;
// // // // //           font-size: 0.875rem;
// // // // //           color: #dc2626;
// // // // //         }

// // // // //         /* ── Horizontal Rule ── */
// // // // //         .editor-wrapper .editor-content hr {
// // // // //           margin: 1.5rem 0;
// // // // //           border: none;
// // // // //           border-top: 2px solid #e5e7eb;
// // // // //         }
// // // // //       `}</style>
// // // // //       </div>
// // // // //     );
// // // // //   },
// // // // // );

// // // // // CustomEditor.displayName = "CustomEditor";

// // // // // export default CustomEditor;

// // // // // import { memo, useEffect, useState } from "react";

// // // // // // =========================
// // // // // // Tiptap Core
// // // // // // =========================
// // // // // import { useEditor, EditorContent, Extension } from "@tiptap/react";
// // // // // import StarterKit from "@tiptap/starter-kit";

// // // // // // =========================
// // // // // // Tiptap Extensions
// // // // // // =========================
// // // // // import { Table } from "@tiptap/extension-table";
// // // // // import { TableRow } from "@tiptap/extension-table-row";
// // // // // import { TableCell } from "@tiptap/extension-table-cell";
// // // // // import { TableHeader } from "@tiptap/extension-table-header";

// // // // // import Image from "@tiptap/extension-image";
// // // // // import Link from "@tiptap/extension-link";
// // // // // import Placeholder from "@tiptap/extension-placeholder";
// // // // // import Underline from "@tiptap/extension-underline";
// // // // // import TextAlign from "@tiptap/extension-text-align";
// // // // // import Highlight from "@tiptap/extension-highlight";

// // // // // import { TextStyle } from "@tiptap/extension-text-style";
// // // // // import { Color } from "@tiptap/extension-color";

// // // // // import FontFamily from "@tiptap/extension-font-family";
// // // // // import HorizontalRule from "@tiptap/extension-horizontal-rule";

// // // // // import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // // // // // =========================
// // // // // // Lowlight + Highlight.js
// // // // // // =========================
// // // // // import { createLowlight } from "lowlight";
// // // // // import javascript from "highlight.js/lib/languages/javascript";
// // // // // import xml from "highlight.js/lib/languages/xml";
// // // // // import css from "highlight.js/lib/languages/css";
// // // // // import json from "highlight.js/lib/languages/json";
// // // // // import typescript from "highlight.js/lib/languages/typescript";
// // // // // import bash from "highlight.js/lib/languages/bash";
// // // // // import "highlight.js/styles/github-dark.css";

// // // // // const lowlight = createLowlight();
// // // // // lowlight.register("javascript", javascript);
// // // // // lowlight.register("js", javascript);
// // // // // lowlight.register("html", xml);
// // // // // lowlight.register("xml", xml);
// // // // // lowlight.register("css", css);
// // // // // lowlight.register("json", json);
// // // // // lowlight.register("typescript", typescript);
// // // // // lowlight.register("ts", typescript);
// // // // // lowlight.register("bash", bash);
// // // // // lowlight.register("shell", bash);

// // // // // // =========================
// // // // // // FIX 1: Custom FontSize Extension
// // // // // // =========================
// // // // // const FontSize = Extension.create({
// // // // //   name: "fontSize",
// // // // //   addOptions() {
// // // // //     return { types: ["textStyle"] };
// // // // //   },
// // // // //   addGlobalAttributes() {
// // // // //     return [
// // // // //       {
// // // // //         types: this.options.types,
// // // // //         attributes: {
// // // // //           fontSize: {
// // // // //             default: null,
// // // // //             parseHTML: (element) => element.style.fontSize || null,
// // // // //             renderHTML: (attributes) => {
// // // // //               if (!attributes.fontSize) return {};
// // // // //               return { style: `font-size: ${attributes.fontSize}` };
// // // // //             },
// // // // //           },
// // // // //         },
// // // // //       },
// // // // //     ];
// // // // //   },
// // // // //   addCommands() {
// // // // //     return {
// // // // //       setFontSize:
// // // // //         (fontSize) =>
// // // // //         ({ chain }) => {
// // // // //           return chain().setMark("textStyle", { fontSize }).run();
// // // // //         },
// // // // //       unsetFontSize:
// // // // //         () =>
// // // // //         ({ chain }) => {
// // // // //           return chain()
// // // // //             .setMark("textStyle", { fontSize: null })
// // // // //             .removeEmptyTextStyle()
// // // // //             .run();
// // // // //         },
// // // // //     };
// // // // //   },
// // // // // });

// // // // // const BackgroundColor = Extension.create({
// // // // //   name: "backgroundColor",
// // // // //   addOptions() {
// // // // //     return { types: ["paragraph", "heading"] };
// // // // //   },
// // // // //   addGlobalAttributes() {
// // // // //     return [
// // // // //       {
// // // // //         types: this.options.types,
// // // // //         attributes: {
// // // // //           backgroundColor: {
// // // // //             default: null,
// // // // //             parseHTML: (element) =>
// // // // //               element.style.backgroundColor || element.style.background || null,
// // // // //             renderHTML: (attributes) => {
// // // // //               if (!attributes.backgroundColor) return {};
// // // // //               return {
// // // // //                 style: `background-color: ${attributes.backgroundColor}`,
// // // // //               };
// // // // //             },
// // // // //           },
// // // // //         },
// // // // //       },
// // // // //     ];
// // // // //   },
// // // // // });

// // // // // // =========================
// // // // // // React Icons
// // // // // // =========================
// // // // // import {
// // // // //   FiBold,
// // // // //   FiItalic,
// // // // //   FiUnderline,
// // // // //   FiList,
// // // // //   FiAlignLeft,
// // // // //   FiAlignCenter,
// // // // //   FiAlignRight,
// // // // //   FiImage,
// // // // //   FiCode,
// // // // //   FiMinus,
// // // // //   FiLink as FiLinkIcon,
// // // // // } from "react-icons/fi";
// // // // // import {
// // // // //   MdFormatColorText,
// // // // //   MdFormatColorFill,
// // // // //   MdFormatQuote,
// // // // //   MdFormatClear,
// // // // // } from "react-icons/md";

// // // // // const COLORS = [
// // // // //   "#000000",
// // // // //   "#DC2626",
// // // // //   "#059669",
// // // // //   "#2563EB",
// // // // //   "#D97706",
// // // // //   "#7C3AED",
// // // // //   "#DB2777",
// // // // //   "#4B5563",
// // // // //   "#FFFFFF",
// // // // //   "#FCD34D",
// // // // //   "#F97316",
// // // // //   "#EC4899",
// // // // //   "#06B6D4",
// // // // //   "#84CC16",
// // // // //   "#8B5CF6",
// // // // // ];

// // // // // const HIGHLIGHT_COLORS = [
// // // // //   { color: "#FEF08A", label: "Yellow" },
// // // // //   { color: "#86EFAC", label: "Green" },
// // // // //   { color: "#FDA4AF", label: "Pink" },
// // // // //   { color: "#93C5FD", label: "Blue" },
// // // // //   { color: "#FED7AA", label: "Orange" },
// // // // //   { color: "#E9D5FF", label: "Purple" },
// // // // // ];

// // // // // // ============================================================
// // // // // // PASTE CLEANER
// // // // // // Strips Word/Google-Docs layout junk before Tiptap parses it:
// // // // // //  - nested "layout" tables (tables used only for spacing/positioning)
// // // // // //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// // // // // //  - empty spacing paragraphs (&nbsp; / <br><br>)
// // // // // //  - inline width/style junk on any table that survives
// // // // // // This MUST be defined at module scope (outside the component) so it
// // // // // // exists before editorProps.transformPastedHTML references it.
// // // // // // ============================================================
// // // // // function cleanPastedHTML(html) {
// // // // //   const doc = new DOMParser().parseFromString(html, "text/html");

// // // // //   // 1) Repeatedly unwrap tables whose cells have no real tabular data
// // // // //   //    (Word nests these 2-3 deep purely for layout/centering purposes).
// // // // //   //    A "real" table is one with more than 1 row or more than 1 column —
// // // // //   //    we leave those alone.
// // // // //   let guard = 0;
// // // // //   let changed = true;
// // // // //   while (changed && guard < 15) {
// // // // //     changed = false;
// // // // //     guard++;
// // // // //     const tables = Array.from(doc.querySelectorAll("table"));
// // // // //     tables.forEach((table) => {
// // // // //       const rows = table.querySelectorAll("tr");
// // // // //       const cells = table.querySelectorAll("td, th");
// // // // //       const maxCellsInARow = Math.max(
// // // // //         0,
// // // // //         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
// // // // //       );
// // // // //       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

// // // // //       if (isLayoutTable && cells.length > 0) {
// // // // //         const fragment = doc.createDocumentFragment();
// // // // //         cells.forEach((cell) => {
// // // // //           // Preserve the cell's background-color (Word often uses
// // // // //           // single-cell "layout tables" to paint colored heading bands).
// // // // //           // If we just unwrap without saving this, the colored band
// // // // //           // disappears even though the cleanup is otherwise correct.
// // // // //           const cellBg = (cell.getAttribute("style") || "").match(
// // // // //             /background(?:-color)?\s*:\s*([^;]+)/i,
// // // // //           );
// // // // //           const bgColor = cellBg ? cellBg[1].trim() : null;

// // // // //           Array.from(cell.childNodes).forEach((node) => {
// // // // //             if (bgColor && node.nodeType === 1) {
// // // // //               // Element node (e.g. <p>) — merge background into its style
// // // // //               const existing = node.getAttribute("style") || "";
// // // // //               const sep =
// // // // //                 existing && !existing.trim().endsWith(";") ? "; " : "";
// // // // //               node.setAttribute(
// // // // //                 "style",
// // // // //                 `${existing}${sep}background-color: ${bgColor};`,
// // // // //               );
// // // // //             }
// // // // //             fragment.appendChild(node);
// // // // //           });
// // // // //         });
// // // // //         table.replaceWith(fragment);
// // // // //         changed = true;
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   // 2) Split paragraphs where a numbering span like "3." / "4." sits
// // // // //   //    in the MIDDLE of a <p> instead of at the start. This is the
// // // // //   //    "3....ventricle. 4.Understand..." stuck-together bug — Word
// // // // //   //    sometimes puts two list items in one <p> with the second
// // // // //   //    number's span appearing mid-paragraph instead of starting a
// // // // //   //    new one. We detect that BEFORE removing the number spans (step 3),
// // // // //   //    because we need the span as the split marker.
// // // // //   doc.querySelectorAll("p").forEach((p) => {
// // // // //     const spans = Array.from(p.querySelectorAll("span"));
// // // // //     const numberSpans = spans.filter((s) =>
// // // // //       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
// // // // //     );
// // // // //     // If there's more than one numbering span in this paragraph, every
// // // // //     // numbering span AFTER the first one marks where a new paragraph
// // // // //     // should begin.
// // // // //     if (numberSpans.length > 1) {
// // // // //       const parent = p.parentNode;
// // // // //       let current = doc.createElement("p");
// // // // //       // copy paragraph-level attributes (e.g. style="text-align:center")
// // // // //       Array.from(p.attributes).forEach((attr) =>
// // // // //         current.setAttribute(attr.name, attr.value),
// // // // //       );
// // // // //       const splitMarkers = new Set(numberSpans.slice(1));
// // // // //       const newParagraphs = [current];

// // // // //       Array.from(p.childNodes).forEach((node) => {
// // // // //         if (splitMarkers.has(node)) {
// // // // //           current = doc.createElement("p");
// // // // //           Array.from(p.attributes).forEach((attr) =>
// // // // //             current.setAttribute(attr.name, attr.value),
// // // // //           );
// // // // //           newParagraphs.push(current);
// // // // //         }
// // // // //         current.appendChild(node);
// // // // //       });

// // // // //       newParagraphs.forEach((np) => parent.insertBefore(np, p));
// // // // //       parent.removeChild(p);
// // // // //     }
// // // // //   });

// // // // //   // 3) Strip Word's manual "1." "2." numbering text that sits in its
// // // // //   //    own <span> right before the item text — these aren't real
// // // // //   //    <ol><li> items, just styled text, and they break formatting
// // // // //   //    because two of them can land in the same <p>.
// // // // //   doc.querySelectorAll("span").forEach((span) => {
// // // // //     const t = span.textContent.trim();
// // // // //     if (/^\d{1,2}[.)]$/.test(t)) {
// // // // //       span.remove();
// // // // //     }
// // // // //   });

// // // // //   // 3b) Convert the now-numbered-but-plain paragraphs into a real <ol>
// // // // //   //    so the editor's own list styling/behaviour applies. We detect
// // // // //   //    paragraphs that start directly after a removed-number marker by
// // // // //   //    just leaving them as paragraphs — simplest & safest is to leave
// // // // //   //    text as-is (no auto-list-ification), since guessing list
// // // // //   //    boundaries from arbitrary pasted HTML is unreliable. If you want
// // // // //   //    them as a real list, select the pasted lines afterward and click
// // // // //   //    the "Numbered List" toolbar button.

// // // // //   // 4) Remove empty spacing paragraphs: <p>&nbsp;</p>, <p><br><br></p>, etc.
// // // // //   doc.querySelectorAll("p").forEach((p) => {
// // // // //     const hasMedia = p.querySelector("img, table");
// // // // //     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
// // // // //     if (isEmptyText && !hasMedia) {
// // // // //       p.remove();
// // // // //     }
// // // // //   });

// // // // //   // 5) Strip inline width/min-width/border junk on any table that
// // // // //   //    survived (genuine content tables) so your own CSS controls layout
// // // // //   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
// // // // //     el.removeAttribute("width");
// // // // //     if (
// // // // //       el.tagName === "TABLE" ||
// // // // //       el.tagName === "COLGROUP" ||
// // // // //       el.tagName === "COL"
// // // // //     ) {
// // // // //       el.removeAttribute("style");
// // // // //     }
// // // // //   });

// // // // //   return doc.body.innerHTML;
// // // // // }

// // // // // const CustomEditor = memo(
// // // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // // // //     const [showHighlighter, setShowHighlighter] = useState(false);

// // // // //     const editor = useEditor({
// // // // //       extensions: [
// // // // //         StarterKit.configure({
// // // // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // // // //           codeBlock: false,
// // // // //           blockquote: true,
// // // // //           orderedList: {
// // // // //             keepMarks: true,
// // // // //             keepAttributes: true,
// // // // //           },
// // // // //           bulletList: {
// // // // //             keepMarks: true,
// // // // //             keepAttributes: true,
// // // // //           },
// // // // //           // FIX: StarterKit already bundles Underline, Link & HorizontalRule
// // // // //           // in recent versions — disable them here since we import + configure
// // // // //           // our own below. Having both registered caused the
// // // // //           // "Duplicate extension names" warning you saw in console.
// // // // //           underline: false,
// // // // //           link: false,
// // // // //           horizontalRule: false,
// // // // //         }),
// // // // //         Underline,
// // // // //         TextAlign.configure({
// // // // //           types: ["heading", "paragraph"],
// // // // //           alignments: ["left", "center", "right", "justify"],
// // // // //         }),
// // // // //         Highlight.configure({ multicolor: true }),
// // // // //         TextStyle,
// // // // //         Color,
// // // // //         FontFamily,
// // // // //         FontSize,
// // // // //         BackgroundColor,
// // // // //         Link.configure({
// // // // //           openOnClick: false,
// // // // //           linkOnPaste: true,
// // // // //           autolink: true,
// // // // //           HTMLAttributes: {
// // // // //             class: "custom-link",
// // // // //             rel: "noopener noreferrer",
// // // // //             target: "_blank",
// // // // //           },
// // // // //         }),
// // // // //         Image.configure({
// // // // //           inline: true,
// // // // //           allowBase64: true,
// // // // //         }),
// // // // //         Placeholder.configure({
// // // // //           placeholder: placeholder || "Write something...",
// // // // //         }),
// // // // //         Table.configure({ resizable: true }),
// // // // //         TableRow,
// // // // //         TableCell,
// // // // //         TableHeader,
// // // // //         HorizontalRule,
// // // // //         CodeBlockLowlight.configure({ lowlight }),
// // // // //       ],
// // // // //       content: value || "",
// // // // //       onUpdate: ({ editor }) => {
// // // // //         onChange(editor.getHTML());
// // // // //         console.log("===== TIPTAP HTML (after edit) =====");
// // // // //         console.log(editor.getHTML());
// // // // //       },
// // // // //       editorProps: {
// // // // //         attributes: {
// // // // //           class: "editor-content",
// // // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
// // // // //         },
// // // // //         transformPastedHTML(html) {
// // // // //           console.log("===== RAW PASTED HTML (before cleaning) =====");
// // // // //           console.log(html);
// // // // //           const cleaned = cleanPastedHTML(html);
// // // // //           console.log("===== CLEANED PASTED HTML (after cleaning) =====");
// // // // //           console.log(cleaned);
// // // // //           return cleaned;
// // // // //         },
// // // // //       },
// // // // //     });

// // // // //     // Sync external value changes
// // // // //     useEffect(() => {
// // // // //       if (editor && value !== editor.getHTML()) {
// // // // //         editor.commands.setContent(value || "", false);
// // // // //       }
// // // // //     }, [editor, value]);

// // // // //     // Close pickers on outside click
// // // // //     useEffect(() => {
// // // // //       const handler = (e) => {
// // // // //         if (!e.target.closest(".color-picker-wrapper")) {
// // // // //           setShowColorPicker(false);
// // // // //           setShowBgColorPicker(false);
// // // // //           setShowHighlighter(false);
// // // // //         }
// // // // //       };
// // // // //       document.addEventListener("mousedown", handler);
// // // // //       return () => document.removeEventListener("mousedown", handler);
// // // // //     }, []);

// // // // //     if (!editor) {
// // // // //       return (
// // // // //         <div
// // // // //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// // // // //           style={{ minHeight }}
// // // // //         >
// // // // //           <div className="text-gray-400">Loading editor...</div>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     const addTable = () => {
// // // // //       const rows = prompt("Number of rows:", "3");
// // // // //       const cols = prompt("Number of columns:", "3");
// // // // //       if (rows && cols) {
// // // // //         editor
// // // // //           .chain()
// // // // //           .focus()
// // // // //           .insertTable({
// // // // //             rows: parseInt(rows),
// // // // //             cols: parseInt(cols),
// // // // //             withHeaderRow: true,
// // // // //           })
// // // // //           .run();
// // // // //       }
// // // // //     };

// // // // //     const addImage = () => {
// // // // //       const url = prompt("Enter image URL:");
// // // // //       if (url) editor.chain().focus().setImage({ src: url }).run();
// // // // //     };

// // // // //     const openLinkDialog = () => {
// // // // //       const url = window.prompt("Enter link URL:");
// // // // //       if (!url) return;
// // // // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // // // //       const { from, to } = editor.state.selection;
// // // // //       if (from === to) {
// // // // //         editor
// // // // //           .chain()
// // // // //           .focus()
// // // // //           .insertContent(`<a href="${href}">${href}</a>`)
// // // // //           .run();
// // // // //       } else {
// // // // //         editor.chain().focus().setLink({ href }).run();
// // // // //       }
// // // // //     };

// // // // //     const removeLink = () => {
// // // // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // // // //     };

// // // // //     const setFontSize = (size) => {
// // // // //       if (size === "default") {
// // // // //         editor.chain().focus().unsetFontSize().run();
// // // // //       } else {
// // // // //         editor.chain().focus().setFontSize(size).run();
// // // // //       }
// // // // //     };

// // // // //     const handleSetTextColor = (color) => {
// // // // //       editor.chain().focus().setColor(color).run();
// // // // //       setShowColorPicker(false);
// // // // //     };

// // // // //     const handleUnsetTextColor = () => {
// // // // //       editor.chain().focus().unsetColor().run();
// // // // //       setShowColorPicker(false);
// // // // //     };

// // // // //     const handleSetHighlight = (color) => {
// // // // //       editor.chain().focus().setHighlight({ color }).run();
// // // // //       setShowBgColorPicker(false);
// // // // //     };

// // // // //     const handleUnsetHighlight = () => {
// // // // //       editor.chain().focus().unsetHighlight().run();
// // // // //       setShowBgColorPicker(false);
// // // // //     };

// // // // //     const clearFormatting = () => {
// // // // //       editor.chain().focus().clearNodes().unsetAllMarks().run();
// // // // //     };

// // // // //     const currentHeading = (() => {
// // // // //       for (let i = 1; i <= 4; i++) {
// // // // //         if (editor.isActive("heading", { level: i })) return String(i);
// // // // //       }
// // // // //       return "paragraph";
// // // // //     })();

// // // // //     return (
// // // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
// // // // //         {/* ── Toolbar ── */}
// // // // //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// // // // //           {/* Font Family */}
// // // // //           <select
// // // // //             onChange={(e) => {
// // // // //               const font = e.target.value;
// // // // //               if (font === "default")
// // // // //                 editor.chain().focus().unsetFontFamily().run();
// // // // //               else editor.chain().focus().setFontFamily(font).run();
// // // // //             }}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //           >
// // // // //             <option value="default">Font Family</option>
// // // // //             <option value="Arial">Arial</option>
// // // // //             <option value="Georgia">Georgia</option>
// // // // //             <option value="Times New Roman">Times New Roman</option>
// // // // //             <option value="Courier New">Courier New</option>
// // // // //             <option value="Verdana">Verdana</option>
// // // // //           </select>

// // // // //           {/* Font Size */}
// // // // //           <select
// // // // //             onChange={(e) => setFontSize(e.target.value)}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //             defaultValue="default"
// // // // //           >
// // // // //             <option value="default">Font Size</option>
// // // // //             <option value="12px">12px</option>
// // // // //             <option value="14px">14px</option>
// // // // //             <option value="16px">16px</option>
// // // // //             <option value="18px">18px</option>
// // // // //             <option value="20px">20px</option>
// // // // //             <option value="24px">24px</option>
// // // // //             <option value="28px">28px</option>
// // // // //             <option value="32px">32px</option>
// // // // //           </select>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Text Color */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 setShowColorPicker((v) => !v);
// // // // //                 setShowBgColorPicker(false);
// // // // //                 setShowHighlighter(false);
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // // //               title="Text Color"
// // // // //             >
// // // // //               <MdFormatColorText size={18} />
// // // // //               <span
// // // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // // //                 style={{
// // // // //                   backgroundColor:
// // // // //                     editor.getAttributes("textStyle").color || "transparent",
// // // // //                 }}
// // // // //               />
// // // // //             </button>
// // // // //             {showColorPicker && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     handleUnsetTextColor();
// // // // //                   }}
// // // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // // //                 >
// // // // //                   Remove Color
// // // // //                 </button>
// // // // //                 {COLORS.map((color) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       handleSetTextColor(color);
// // // // //                     }}
// // // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // // //                     style={{
// // // // //                       backgroundColor: color,
// // // // //                       border:
// // // // //                         color === "#FFFFFF"
// // // // //                           ? "1px solid #ddd"
// // // // //                           : "1px solid transparent",
// // // // //                       outline:
// // // // //                         editor.getAttributes("textStyle").color === color
// // // // //                           ? "2px solid #2563eb"
// // // // //                           : "none",
// // // // //                       outlineOffset: "2px",
// // // // //                     }}
// // // // //                   />
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* Background (Highlight) Color */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 setShowBgColorPicker((v) => !v);
// // // // //                 setShowColorPicker(false);
// // // // //                 setShowHighlighter(false);
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // // //               title="Background Color"
// // // // //             >
// // // // //               <MdFormatColorFill size={18} />
// // // // //               <span
// // // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // // //                 style={{
// // // // //                   backgroundColor:
// // // // //                     editor.getAttributes("highlight").color || "transparent",
// // // // //                 }}
// // // // //               />
// // // // //             </button>
// // // // //             {showBgColorPicker && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     handleUnsetHighlight();
// // // // //                   }}
// // // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // // //                 >
// // // // //                   Remove Background
// // // // //                 </button>
// // // // //                 {COLORS.map((color) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       handleSetHighlight(color);
// // // // //                     }}
// // // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // // //                     style={{
// // // // //                       backgroundColor: color,
// // // // //                       border:
// // // // //                         color === "#FFFFFF"
// // // // //                           ? "1px solid #ddd"
// // // // //                           : "1px solid transparent",
// // // // //                     }}
// // // // //                   />
// // // // //                 ))}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {/* Highlighter Pen */}
// // // // //           <div className="relative color-picker-wrapper">
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 setShowHighlighter((v) => !v);
// // // // //                 setShowColorPicker(false);
// // // // //                 setShowBgColorPicker(false);
// // // // //               }}
// // // // //               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //               style={
// // // // //                 editor.isActive("highlight")
// // // // //                   ? {
// // // // //                       backgroundColor:
// // // // //                         editor.getAttributes("highlight").color || "#FEF08A",
// // // // //                       color: "#000",
// // // // //                     }
// // // // //                   : {}
// // // // //               }
// // // // //               title="Highlighter"
// // // // //             >
// // // // //               <svg
// // // // //                 width="16"
// // // // //                 height="16"
// // // // //                 viewBox="0 0 24 24"
// // // // //                 fill="none"
// // // // //                 stroke="currentColor"
// // // // //                 strokeWidth="2"
// // // // //                 strokeLinecap="round"
// // // // //                 strokeLinejoin="round"
// // // // //               >
// // // // //                 <path d="M12 20h9" />
// // // // //                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
// // // // //               </svg>
// // // // //             </button>
// // // // //             {showHighlighter && (
// // // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
// // // // //                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
// // // // //                   Highlight Color
// // // // //                 </span>
// // // // //                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
// // // // //                   <button
// // // // //                     key={color}
// // // // //                     onMouseDown={(e) => {
// // // // //                       e.preventDefault();
// // // // //                       editor.chain().focus().setHighlight({ color }).run();
// // // // //                       setShowHighlighter(false);
// // // // //                     }}
// // // // //                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
// // // // //                   >
// // // // //                     <span
// // // // //                       className="w-5 h-5 rounded-sm border flex-shrink-0"
// // // // //                       style={{
// // // // //                         backgroundColor: color,
// // // // //                         borderColor:
// // // // //                           editor.getAttributes("highlight").color === color
// // // // //                             ? "#2563eb"
// // // // //                             : "#e5e7eb",
// // // // //                         outline:
// // // // //                           editor.getAttributes("highlight").color === color
// // // // //                             ? "2px solid #2563eb"
// // // // //                             : "none",
// // // // //                         outlineOffset: "2px",
// // // // //                       }}
// // // // //                     />
// // // // //                     {label}
// // // // //                   </button>
// // // // //                 ))}
// // // // //                 <button
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     editor.chain().focus().unsetHighlight().run();
// // // // //                     setShowHighlighter(false);
// // // // //                   }}
// // // // //                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
// // // // //                 >
// // // // //                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
// // // // //                   Remove
// // // // //                 </button>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Bold */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBold().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Bold"
// // // // //           >
// // // // //             <FiBold size={16} />
// // // // //           </button>

// // // // //           {/* Italic */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleItalic().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Italic"
// // // // //           >
// // // // //             <FiItalic size={16} />
// // // // //           </button>

// // // // //           {/* Underline */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleUnderline().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Underline"
// // // // //           >
// // // // //             <FiUnderline size={16} />
// // // // //           </button>

// // // // //           {/* Clear Formatting */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               clearFormatting();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // // //             title="Clear Formatting"
// // // // //           >
// // // // //             <MdFormatClear size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Heading Select */}
// // // // //           <select
// // // // //             onChange={(e) => {
// // // // //               const val = e.target.value;
// // // // //               if (val === "paragraph")
// // // // //                 editor.chain().focus().setParagraph().run();
// // // // //               else
// // // // //                 editor
// // // // //                   .chain()
// // // // //                   .focus()
// // // // //                   .toggleHeading({ level: parseInt(val) })
// // // // //                   .run();
// // // // //             }}
// // // // //             value={currentHeading}
// // // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // // //           >
// // // // //             <option value="paragraph">Normal</option>
// // // // //             <option value="1">Heading 1</option>
// // // // //             <option value="2">Heading 2</option>
// // // // //             <option value="3">Heading 3</option>
// // // // //             <option value="4">Heading 4</option>
// // // // //           </select>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Align Left */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("left").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignLeft size={16} />
// // // // //           </button>
// // // // //           {/* Align Center */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("center").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignCenter size={16} />
// // // // //           </button>
// // // // //           {/* Align Right */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setTextAlign("right").run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //           >
// // // // //             <FiAlignRight size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Bullet List */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBulletList().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Bullet List"
// // // // //           >
// // // // //             <FiList size={16} />
// // // // //           </button>

// // // // //           {/* Ordered List */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleOrderedList().run();
// // // // //             }}
// // // // //             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Numbered List"
// // // // //           >
// // // // //             1.
// // // // //           </button>

// // // // //           {/* Blockquote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBlockquote().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Blockquote"
// // // // //           >
// // // // //             <MdFormatQuote size={16} />
// // // // //           </button>

// // // // //           {/* Code Block */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleCodeBlock().run();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Code Block"
// // // // //           >
// // // // //             <FiCode size={16} />
// // // // //           </button>

// // // // //           {/* Horizontal Rule */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().setHorizontalRule().run();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Horizontal Rule"
// // // // //           >
// // // // //             <FiMinus size={16} />
// // // // //           </button>

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Table */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               addTable();
// // // // //             }}
// // // // //             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Insert Table"
// // // // //           >
// // // // //             <div className="grid grid-cols-2 gap-[2px]">
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // //             </div>
// // // // //             <span className="text-sm font-medium">Table</span>
// // // // //           </button>

// // // // //           {/* Image */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               addImage();
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // //             title="Insert Image"
// // // // //           >
// // // // //             <FiImage size={16} />
// // // // //           </button>

// // // // //           {/* Link button */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               openLinkDialog();
// // // // //             }}
// // // // //             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // // //             title="Insert Link"
// // // // //           >
// // // // //             <FiLinkIcon size={16} />
// // // // //           </button>

// // // // //           {/* Single Quote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               const { from, to } = editor.state.selection;
// // // // //               if (from === to) {
// // // // //                 editor.chain().focus().insertContent("''").run();
// // // // //               } else {
// // // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // // //                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
// // // // //               }
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // // //             title="Single Quotes"
// // // // //           >
// // // // //             '&thinsp;'
// // // // //           </button>

// // // // //           {/* Double Quote */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               const { from, to } = editor.state.selection;
// // // // //               if (from === to) {
// // // // //                 editor.chain().focus().insertContent('""').run();
// // // // //               } else {
// // // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // // //                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
// // // // //               }
// // // // //             }}
// // // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // // //             title="Double Quotes"
// // // // //           >
// // // // //             "&thinsp;"
// // // // //           </button>

// // // // //           {editor.isActive("link") && (
// // // // //             <button
// // // // //               type="button"
// // // // //               onMouseDown={(e) => {
// // // // //                 e.preventDefault();
// // // // //                 removeLink();
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // // //               title="Remove Link"
// // // // //             >
// // // // //               Remove Link
// // // // //             </button>
// // // // //           )}

// // // // //           {/* Table Controls — shown only when inside a table */}
// // // // //           {editor.isActive("table") && (
// // // // //             <>
// // // // //               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
// // // // //               {[
// // // // //                 {
// // // // //                   label: "+ Row ↑",
// // // // //                   action: () => editor.chain().focus().addRowBefore().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Row ↓",
// // // // //                   action: () => editor.chain().focus().addRowAfter().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Col ←",
// // // // //                   action: () => editor.chain().focus().addColumnBefore().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "+ Col →",
// // // // //                   action: () => editor.chain().focus().addColumnAfter().run(),
// // // // //                 },
// // // // //               ].map(({ label, action }) => (
// // // // //                 <button
// // // // //                   key={label}
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     action();
// // // // //                   }}
// // // // //                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
// // // // //                 >
// // // // //                   {label}
// // // // //                 </button>
// // // // //               ))}
// // // // //               {[
// // // // //                 {
// // // // //                   label: "- Row",
// // // // //                   action: () => editor.chain().focus().deleteRow().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "- Col",
// // // // //                   action: () => editor.chain().focus().deleteColumn().run(),
// // // // //                 },
// // // // //                 {
// // // // //                   label: "Delete Table",
// // // // //                   action: () => editor.chain().focus().deleteTable().run(),
// // // // //                 },
// // // // //               ].map(({ label, action }) => (
// // // // //                 <button
// // // // //                   key={label}
// // // // //                   onMouseDown={(e) => {
// // // // //                     e.preventDefault();
// // // // //                     action();
// // // // //                   }}
// // // // //                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // // //                 >
// // // // //                   {label}
// // // // //                 </button>
// // // // //               ))}
// // // // //             </>
// // // // //           )}
// // // // //         </div>

// // // // //         <EditorContent editor={editor} />

// // // // //         <style>{`
// // // // //         .editor-wrapper .editor-content:focus {
// // // // //           outline: none;
// // // // //         }

// // // // //         .editor-wrapper .editor-content {
// // // // //           caret-color: #2563EB;
// // // // //           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
// // // // //         }

// // // // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // // // //           content: attr(data-placeholder);
// // // // //           float: left;
// // // // //           color: #adb5bd;
// // // // //           pointer-events: none;
// // // // //           height: 0;
// // // // //         }

// // // // //         .editor-wrapper .editor-content ::selection {
// // // // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // // // //           color: inherit !important;
// // // // //         }

// // // // //         .editor-wrapper mark {
// // // // //           padding: 0.1em 0;
// // // // //           border-radius: 2px;
// // // // //         }

// // // // //         .editor-wrapper .custom-link,
// // // // //         .editor-wrapper a {
// // // // //           color: #2563eb !important;
// // // // //           text-decoration: underline !important;
// // // // //           cursor: pointer !important;
// // // // //         }
// // // // //         .editor-wrapper .custom-link:hover,
// // // // //         .editor-wrapper a:hover {
// // // // //           color: #1d4ed8 !important;
// // // // //         }

// // // // //         .editor-wrapper table {
// // // // //           border-collapse: collapse;
// // // // //           width: 100%;
// // // // //           margin: 1rem 0;
// // // // //           table-layout: fixed;
// // // // //         }
// // // // //         .editor-wrapper td,
// // // // //         .editor-wrapper th {
// // // // //           border: 1px solid #d1d5db;
// // // // //           padding: 8px 12px;
// // // // //           position: relative;
// // // // //         }
// // // // //         .editor-wrapper th {
// // // // //           background-color: #f3f4f6;
// // // // //           font-weight: 600;
// // // // //         }
// // // // //         .editor-wrapper .selectedCell::after {
// // // // //           content: "";
// // // // //           position: absolute;
// // // // //           inset: 0;
// // // // //           background: rgba(59, 130, 246, 0.15);
// // // // //           pointer-events: none;
// // // // //         }

// // // // //         .editor-wrapper .editor-content p {
// // // // //           margin: 0 0 0.75rem;
// // // // //           line-height: 1.6;
// // // // //         }

// // // // //         .editor-wrapper .editor-content ul {
// // // // //           list-style-type: disc;
// // // // //           padding-left: 1.75rem;
// // // // //           margin: 0 0 0.75rem;
// // // // //         }
// // // // //         .editor-wrapper .editor-content ol {
// // // // //           list-style-type: decimal;
// // // // //           padding-left: 1.75rem;
// // // // //           margin: 0 0 0.75rem;
// // // // //         }
// // // // //         .editor-wrapper .editor-content li {
// // // // //           margin-bottom: 0.25rem;
// // // // //           line-height: 1.6;
// // // // //         }
// // // // //         .editor-wrapper .editor-content li p {
// // // // //           margin: 0;
// // // // //         }

// // // // //         .editor-wrapper .editor-content blockquote {
// // // // //           border-left: 4px solid #3b82f6;
// // // // //           padding: 0.5rem 1rem;
// // // // //           margin: 1rem 0;
// // // // //           color: #4b5563;
// // // // //           font-style: italic;
// // // // //           background-color: #f8fafc;
// // // // //           border-radius: 0 4px 4px 0;
// // // // //         }
// // // // //         .editor-wrapper .editor-content blockquote p {
// // // // //           margin: 0;
// // // // //         }

// // // // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // // // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // // // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // // // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // // // //         .editor-wrapper .editor-content img {
// // // // //           max-width: 100%;
// // // // //           height: auto;
// // // // //           border-radius: 0.5rem;
// // // // //           margin: 0.5rem 0;
// // // // //         }

// // // // //         .editor-wrapper .editor-content pre {
// // // // //           background-color: #1f2937;
// // // // //           color: #f3f4f6;
// // // // //           padding: 1rem;
// // // // //           border-radius: 0.5rem;
// // // // //           overflow-x: auto;
// // // // //           font-family: monospace;
// // // // //           font-size: 0.875rem;
// // // // //           margin: 1rem 0;
// // // // //         }
// // // // //         .editor-wrapper .editor-content code:not(pre code) {
// // // // //           background-color: #f3f4f6;
// // // // //           padding: 0.125rem 0.3rem;
// // // // //           border-radius: 0.25rem;
// // // // //           font-family: monospace;
// // // // //           font-size: 0.875rem;
// // // // //           color: #dc2626;
// // // // //         }

// // // // //         .editor-wrapper .editor-content hr {
// // // // //           margin: 1.5rem 0;
// // // // //           border: none;
// // // // //           border-top: 2px solid #e5e7eb;
// // // // //         }
// // // // //       `}</style>
// // // // //       </div>
// // // // //     );
// // // // //   },
// // // // // );

// // // // // CustomEditor.displayName = "CustomEditor";

// // // // // export default CustomEditor;

// // // // import { memo, useEffect, useState } from "react";

// // // // // =========================
// // // // // Tiptap Core
// // // // // =========================
// // // // import { useEditor, EditorContent, Extension } from "@tiptap/react";
// // // // import StarterKit from "@tiptap/starter-kit";

// // // // // =========================
// // // // // Tiptap Extensions
// // // // // =========================
// // // // import { Table } from "@tiptap/extension-table";
// // // // import { TableRow } from "@tiptap/extension-table-row";
// // // // import { TableCell } from "@tiptap/extension-table-cell";
// // // // import { TableHeader } from "@tiptap/extension-table-header";

// // // // import Image from "@tiptap/extension-image";
// // // // import Link from "@tiptap/extension-link";
// // // // import Placeholder from "@tiptap/extension-placeholder";
// // // // import Underline from "@tiptap/extension-underline";
// // // // import TextAlign from "@tiptap/extension-text-align";
// // // // import Highlight from "@tiptap/extension-highlight";

// // // // import { TextStyle } from "@tiptap/extension-text-style";
// // // // import { Color } from "@tiptap/extension-color";

// // // // import FontFamily from "@tiptap/extension-font-family";
// // // // import HorizontalRule from "@tiptap/extension-horizontal-rule";

// // // // import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // // // // =========================
// // // // // Lowlight + Highlight.js
// // // // // =========================
// // // // import { createLowlight } from "lowlight";
// // // // import javascript from "highlight.js/lib/languages/javascript";
// // // // import xml from "highlight.js/lib/languages/xml";
// // // // import css from "highlight.js/lib/languages/css";
// // // // import json from "highlight.js/lib/languages/json";
// // // // import typescript from "highlight.js/lib/languages/typescript";
// // // // import bash from "highlight.js/lib/languages/bash";
// // // // import "highlight.js/styles/github-dark.css";

// // // // const lowlight = createLowlight();
// // // // lowlight.register("javascript", javascript);
// // // // lowlight.register("js", javascript);
// // // // lowlight.register("html", xml);
// // // // lowlight.register("xml", xml);
// // // // lowlight.register("css", css);
// // // // lowlight.register("json", json);
// // // // lowlight.register("typescript", typescript);
// // // // lowlight.register("ts", typescript);
// // // // lowlight.register("bash", bash);
// // // // lowlight.register("shell", bash);

// // // // // =========================
// // // // // FIX 1: Custom FontSize Extension
// // // // // =========================
// // // // const FontSize = Extension.create({
// // // //   name: "fontSize",
// // // //   addOptions() {
// // // //     return { types: ["textStyle"] };
// // // //   },
// // // //   addGlobalAttributes() {
// // // //     return [
// // // //       {
// // // //         types: this.options.types,
// // // //         attributes: {
// // // //           fontSize: {
// // // //             default: null,
// // // //             parseHTML: (element) => element.style.fontSize || null,
// // // //             renderHTML: (attributes) => {
// // // //               if (!attributes.fontSize) return {};
// // // //               return { style: `font-size: ${attributes.fontSize}` };
// // // //             },
// // // //           },
// // // //         },
// // // //       },
// // // //     ];
// // // //   },
// // // //   addCommands() {
// // // //     return {
// // // //       setFontSize:
// // // //         (fontSize) =>
// // // //         ({ chain }) => {
// // // //           return chain().setMark("textStyle", { fontSize }).run();
// // // //         },
// // // //       unsetFontSize:
// // // //         () =>
// // // //         ({ chain }) => {
// // // //           return chain()
// // // //             .setMark("textStyle", { fontSize: null })
// // // //             .removeEmptyTextStyle()
// // // //             .run();
// // // //         },
// // // //     };
// // // //   },
// // // // });

// // // // const BackgroundColor = Extension.create({
// // // //   name: "backgroundColor",
// // // //   addOptions() {
// // // //     return { types: ["paragraph", "heading"] };
// // // //   },
// // // //   addGlobalAttributes() {
// // // //     return [
// // // //       {
// // // //         types: this.options.types,
// // // //         attributes: {
// // // //           backgroundColor: {
// // // //             default: null,
// // // //             parseHTML: (element) =>
// // // //               element.style.backgroundColor || element.style.background || null,
// // // //             renderHTML: (attributes) => {
// // // //               if (!attributes.backgroundColor) return {};
// // // //               return {
// // // //                 style: `background-color: ${attributes.backgroundColor}`,
// // // //               };
// // // //             },
// // // //           },
// // // //         },
// // // //       },
// // // //     ];
// // // //   },
// // // // });

// // // // // =========================
// // // // // React Icons
// // // // // =========================
// // // // import {
// // // //   FiBold,
// // // //   FiItalic,
// // // //   FiUnderline,
// // // //   FiList,
// // // //   FiAlignLeft,
// // // //   FiAlignCenter,
// // // //   FiAlignRight,
// // // //   FiImage,
// // // //   FiCode,
// // // //   FiMinus,
// // // //   FiLink as FiLinkIcon,
// // // // } from "react-icons/fi";
// // // // import {
// // // //   MdFormatColorText,
// // // //   MdFormatColorFill,
// // // //   MdFormatQuote,
// // // //   MdFormatClear,
// // // // } from "react-icons/md";

// // // // const COLORS = [
// // // //   "#000000",
// // // //   "#DC2626",
// // // //   "#059669",
// // // //   "#2563EB",
// // // //   "#D97706",
// // // //   "#7C3AED",
// // // //   "#DB2777",
// // // //   "#4B5563",
// // // //   "#FFFFFF",
// // // //   "#FCD34D",
// // // //   "#F97316",
// // // //   "#EC4899",
// // // //   "#06B6D4",
// // // //   "#84CC16",
// // // //   "#8B5CF6",
// // // // ];

// // // // const HIGHLIGHT_COLORS = [
// // // //   { color: "#FEF08A", label: "Yellow" },
// // // //   { color: "#86EFAC", label: "Green" },
// // // //   { color: "#FDA4AF", label: "Pink" },
// // // //   { color: "#93C5FD", label: "Blue" },
// // // //   { color: "#FED7AA", label: "Orange" },
// // // //   { color: "#E9D5FF", label: "Purple" },
// // // // ];

// // // // // ============================================================
// // // // // PASTE CLEANER
// // // // // Strips Word/Google-Docs layout junk before Tiptap parses it:
// // // // //  - nested "layout" tables (tables used only for spacing/positioning)
// // // // //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// // // // //  - empty spacing paragraphs (&nbsp; / <br><br>)
// // // // //  - inline width/style junk on any table that survives
// // // // // This MUST be defined at module scope (outside the component) so it
// // // // // exists before editorProps.transformPastedHTML references it.
// // // // // ============================================================
// // // // function cleanPastedHTML(html) {
// // // //   const doc = new DOMParser().parseFromString(html, "text/html");

// // // //   // 0) Convert legacy "align" attribute (Word/old-HTML) into an actual
// // // //   //    text-align style so Tiptap's TextAlign / inline-style parsing
// // // //   //    picks it up. Without this, centered headings silently become
// // // //   //    left-aligned because Tiptap only reads style="text-align:...".
// // // //   doc.querySelectorAll("[align]").forEach((el) => {
// // // //     const alignVal = el.getAttribute("align");
// // // //     if (alignVal) {
// // // //       const existing = el.getAttribute("style") || "";
// // // //       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
// // // //       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
// // // //     }
// // // //     el.removeAttribute("align");
// // // //   });

// // // //   // 1) Repeatedly unwrap tables whose cells have no real tabular data
// // // //   //    (Word nests these 2-3 deep purely for layout/centering purposes).
// // // //   //    A "real" table is one with more than 1 row or more than 1 column —
// // // //   //    we leave those alone.
// // // //   let guard = 0;
// // // //   let changed = true;
// // // //   while (changed && guard < 15) {
// // // //     changed = false;
// // // //     guard++;
// // // //     const tables = Array.from(doc.querySelectorAll("table"));
// // // //     tables.forEach((table) => {
// // // //       const rows = table.querySelectorAll("tr");
// // // //       const cells = table.querySelectorAll("td, th");
// // // //       const maxCellsInARow = Math.max(
// // // //         0,
// // // //         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
// // // //       );
// // // //       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

// // // //       if (isLayoutTable && cells.length > 0) {
// // // //         const fragment = doc.createDocumentFragment();
// // // //         cells.forEach((cell) => {
// // // //           // Preserve the cell's background-color (Word often uses
// // // //           // single-cell "layout tables" to paint colored heading bands).
// // // //           // If we just unwrap without saving this, the colored band
// // // //           // disappears even though the cleanup is otherwise correct.
// // // //           const cellBg = (cell.getAttribute("style") || "").match(
// // // //             /background(?:-color)?\s*:\s*([^;]+)/i,
// // // //           );
// // // //           const bgColor = cellBg ? cellBg[1].trim() : null;

// // // //           Array.from(cell.childNodes).forEach((node) => {
// // // //             if (bgColor && node.nodeType === 1) {
// // // //               // Element node (e.g. <p>) — merge background into its style
// // // //               const existing = node.getAttribute("style") || "";
// // // //               const sep =
// // // //                 existing && !existing.trim().endsWith(";") ? "; " : "";
// // // //               node.setAttribute(
// // // //                 "style",
// // // //                 `${existing}${sep}background-color: ${bgColor};`,
// // // //               );
// // // //             }
// // // //             fragment.appendChild(node);
// // // //           });
// // // //         });
// // // //         table.replaceWith(fragment);
// // // //         changed = true;
// // // //       }
// // // //     });
// // // //   }

// // // //   // 2) Split paragraphs where a numbering span like "3." / "4." sits
// // // //   //    in the MIDDLE of a <p> instead of at the start. This is the
// // // //   //    "3....ventricle. 4.Understand..." stuck-together bug — Word
// // // //   //    sometimes puts two list items in one <p> with the second
// // // //   //    number's span appearing mid-paragraph instead of starting a
// // // //   //    new one. We detect that BEFORE touching the number spans (step 3),
// // // //   //    because we need the span as the split marker.
// // // //   doc.querySelectorAll("p").forEach((p) => {
// // // //     const spans = Array.from(p.querySelectorAll("span"));
// // // //     const numberSpans = spans.filter((s) =>
// // // //       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
// // // //     );
// // // //     // If there's more than one numbering span in this paragraph, every
// // // //     // numbering span AFTER the first one marks where a new paragraph
// // // //     // should begin.
// // // //     if (numberSpans.length > 1) {
// // // //       const parent = p.parentNode;
// // // //       let current = doc.createElement("p");
// // // //       // copy paragraph-level attributes (e.g. style="text-align:center")
// // // //       Array.from(p.attributes).forEach((attr) =>
// // // //         current.setAttribute(attr.name, attr.value),
// // // //       );
// // // //       const splitMarkers = new Set(numberSpans.slice(1));
// // // //       const newParagraphs = [current];

// // // //       Array.from(p.childNodes).forEach((node) => {
// // // //         if (splitMarkers.has(node)) {
// // // //           current = doc.createElement("p");
// // // //           Array.from(p.attributes).forEach((attr) =>
// // // //             current.setAttribute(attr.name, attr.value),
// // // //           );
// // // //           newParagraphs.push(current);
// // // //         }
// // // //         current.appendChild(node);
// // // //       });

// // // //       newParagraphs.forEach((np) => parent.insertBefore(np, p));
// // // //       parent.removeChild(p);
// // // //     }
// // // //   });

// // // //   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
// // // //   //    at the start of the paragraph (matching the original document
// // // //   //    look), instead of deleting it. We unwrap the number <span> into
// // // //   //    a plain text node + a following space, so it just reads as
// // // //   //    "1. Identify the four chambers..." with no special list markup.
// // // //   doc.querySelectorAll("span").forEach((span) => {
// // // //     const t = span.textContent.trim();
// // // //     if (/^\d{1,2}[.)]$/.test(t)) {
// // // //       const textNode = doc.createTextNode(`${t} `);
// // // //       span.replaceWith(textNode);
// // // //     }
// // // //   });

// // // //   // 4) Remove empty spacing paragraphs: <p>&nbsp;</p>, <p><br><br></p>, etc.
// // // //   doc.querySelectorAll("p").forEach((p) => {
// // // //     const hasMedia = p.querySelector("img, table");
// // // //     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
// // // //     if (isEmptyText && !hasMedia) {
// // // //       p.remove();
// // // //     }
// // // //   });

// // // //   // 4b) Collapse leftover Word tab-stop runs of &nbsp; (e.g. the
// // // //   //     mso-tab-count spacer between "...able to:" and the first list
// // // //   //     item text) down to a single space, so we don't get a big gap
// // // //   //     of non-breaking spaces sitting mid-paragraph.
// // // //   doc.querySelectorAll("span").forEach((span) => {
// // // //     const raw = span.textContent;
// // // //     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
// // // //       span.replaceWith(doc.createTextNode(" "));
// // // //     }
// // // //   });

// // // //   // 5) Strip inline width/min-width/border junk on any table that
// // // //   //    survived (genuine content tables) so your own CSS controls layout
// // // //   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
// // // //     el.removeAttribute("width");
// // // //     if (
// // // //       el.tagName === "TABLE" ||
// // // //       el.tagName === "COLGROUP" ||
// // // //       el.tagName === "COL"
// // // //     ) {
// // // //       el.removeAttribute("style");
// // // //     }
// // // //   });

// // // //   return doc.body.innerHTML;
// // // // }

// // // // const CustomEditor = memo(
// // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // // //     const [showHighlighter, setShowHighlighter] = useState(false);

// // // //     const editor = useEditor({
// // // //       extensions: [
// // // //         StarterKit.configure({
// // // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // // //           codeBlock: false,
// // // //           blockquote: true,
// // // //           orderedList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
// // // //           bulletList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
// // // //           // FIX: StarterKit already bundles Underline, Link & HorizontalRule
// // // //           // in recent versions — disable them here since we import + configure
// // // //           // our own below. Having both registered caused the
// // // //           // "Duplicate extension names" warning you saw in console.
// // // //           underline: false,
// // // //           link: false,
// // // //           horizontalRule: false,
// // // //         }),
// // // //         Underline,
// // // //         TextAlign.configure({
// // // //           types: ["heading", "paragraph"],
// // // //           alignments: ["left", "center", "right", "justify"],
// // // //         }),
// // // //         Highlight.configure({ multicolor: true }),
// // // //         TextStyle,
// // // //         Color,
// // // //         FontFamily,
// // // //         FontSize,
// // // //         BackgroundColor,
// // // //         Link.configure({
// // // //           openOnClick: false,
// // // //           linkOnPaste: true,
// // // //           autolink: true,
// // // //           HTMLAttributes: {
// // // //             class: "custom-link",
// // // //             rel: "noopener noreferrer",
// // // //             target: "_blank",
// // // //           },
// // // //         }),
// // // //         Image.configure({
// // // //           inline: true,
// // // //           allowBase64: true,
// // // //         }),
// // // //         Placeholder.configure({
// // // //           placeholder: placeholder || "Write something...",
// // // //         }),
// // // //         Table.configure({ resizable: true }),
// // // //         TableRow,
// // // //         TableCell,
// // // //         TableHeader,
// // // //         HorizontalRule,
// // // //         CodeBlockLowlight.configure({ lowlight }),
// // // //       ],
// // // //       content: value || "",
// // // //       onUpdate: ({ editor }) => {
// // // //         onChange(editor.getHTML());
// // // //         console.log("===== TIPTAP HTML (after edit) =====");
// // // //         console.log(editor.getHTML());
// // // //       },
// // // //       editorProps: {
// // // //         attributes: {
// // // //           class: "editor-content",
// // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
// // // //         },
// // // //         transformPastedHTML(html) {
// // // //           console.log("===== RAW PASTED HTML (before cleaning) =====");
// // // //           console.log(html);
// // // //           const cleaned = cleanPastedHTML(html);
// // // //           console.log("===== CLEANED PASTED HTML (after cleaning) =====");
// // // //           console.log(cleaned);
// // // //           return cleaned;
// // // //         },
// // // //       },
// // // //     });

// // // //     // Sync external value changes
// // // //     useEffect(() => {
// // // //       if (editor && value !== editor.getHTML()) {
// // // //         editor.commands.setContent(value || "", false);
// // // //       }
// // // //     }, [editor, value]);

// // // //     // Close pickers on outside click
// // // //     useEffect(() => {
// // // //       const handler = (e) => {
// // // //         if (!e.target.closest(".color-picker-wrapper")) {
// // // //           setShowColorPicker(false);
// // // //           setShowBgColorPicker(false);
// // // //           setShowHighlighter(false);
// // // //         }
// // // //       };
// // // //       document.addEventListener("mousedown", handler);
// // // //       return () => document.removeEventListener("mousedown", handler);
// // // //     }, []);

// // // //     if (!editor) {
// // // //       return (
// // // //         <div
// // // //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// // // //           style={{ minHeight }}
// // // //         >
// // // //           <div className="text-gray-400">Loading editor...</div>
// // // //         </div>
// // // //       );
// // // //     }

// // // //     const addTable = () => {
// // // //       const rows = prompt("Number of rows:", "3");
// // // //       const cols = prompt("Number of columns:", "3");
// // // //       if (rows && cols) {
// // // //         editor
// // // //           .chain()
// // // //           .focus()
// // // //           .insertTable({
// // // //             rows: parseInt(rows),
// // // //             cols: parseInt(cols),
// // // //             withHeaderRow: true,
// // // //           })
// // // //           .run();
// // // //       }
// // // //     };

// // // //     const addImage = () => {
// // // //       const url = prompt("Enter image URL:");
// // // //       if (url) editor.chain().focus().setImage({ src: url }).run();
// // // //     };

// // // //     const openLinkDialog = () => {
// // // //       const url = window.prompt("Enter link URL:");
// // // //       if (!url) return;
// // // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // // //       const { from, to } = editor.state.selection;
// // // //       if (from === to) {
// // // //         editor
// // // //           .chain()
// // // //           .focus()
// // // //           .insertContent(`<a href="${href}">${href}</a>`)
// // // //           .run();
// // // //       } else {
// // // //         editor.chain().focus().setLink({ href }).run();
// // // //       }
// // // //     };

// // // //     const removeLink = () => {
// // // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // // //     };

// // // //     const setFontSize = (size) => {
// // // //       if (size === "default") {
// // // //         editor.chain().focus().unsetFontSize().run();
// // // //       } else {
// // // //         editor.chain().focus().setFontSize(size).run();
// // // //       }
// // // //     };

// // // //     const handleSetTextColor = (color) => {
// // // //       editor.chain().focus().setColor(color).run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     const handleUnsetTextColor = () => {
// // // //       editor.chain().focus().unsetColor().run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     const handleSetHighlight = (color) => {
// // // //       editor.chain().focus().setHighlight({ color }).run();
// // // //       setShowBgColorPicker(false);
// // // //     };

// // // //     const handleUnsetHighlight = () => {
// // // //       editor.chain().focus().unsetHighlight().run();
// // // //       setShowBgColorPicker(false);
// // // //     };

// // // //     const clearFormatting = () => {
// // // //       editor.chain().focus().clearNodes().unsetAllMarks().run();
// // // //     };

// // // //     const currentHeading = (() => {
// // // //       for (let i = 1; i <= 4; i++) {
// // // //         if (editor.isActive("heading", { level: i })) return String(i);
// // // //       }
// // // //       return "paragraph";
// // // //     })();

// // // //     return (
// // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
// // // //         {/* ── Toolbar ── */}
// // // //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// // // //           {/* Font Family */}
// // // //           <select
// // // //             onChange={(e) => {
// // // //               const font = e.target.value;
// // // //               if (font === "default")
// // // //                 editor.chain().focus().unsetFontFamily().run();
// // // //               else editor.chain().focus().setFontFamily(font).run();
// // // //             }}
// // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // //           >
// // // //             <option value="default">Font Family</option>
// // // //             <option value="Arial">Arial</option>
// // // //             <option value="Georgia">Georgia</option>
// // // //             <option value="Times New Roman">Times New Roman</option>
// // // //             <option value="Courier New">Courier New</option>
// // // //             <option value="Verdana">Verdana</option>
// // // //           </select>

// // // //           {/* Font Size */}
// // // //           <select
// // // //             onChange={(e) => setFontSize(e.target.value)}
// // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // //             defaultValue="default"
// // // //           >
// // // //             <option value="default">Font Size</option>
// // // //             <option value="12px">12px</option>
// // // //             <option value="14px">14px</option>
// // // //             <option value="16px">16px</option>
// // // //             <option value="18px">18px</option>
// // // //             <option value="20px">20px</option>
// // // //             <option value="24px">24px</option>
// // // //             <option value="28px">28px</option>
// // // //             <option value="32px">32px</option>
// // // //           </select>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Text Color */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 setShowColorPicker((v) => !v);
// // // //                 setShowBgColorPicker(false);
// // // //                 setShowHighlighter(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // //               title="Text Color"
// // // //             >
// // // //               <MdFormatColorText size={18} />
// // // //               <span
// // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // //                 style={{
// // // //                   backgroundColor:
// // // //                     editor.getAttributes("textStyle").color || "transparent",
// // // //                 }}
// // // //               />
// // // //             </button>
// // // //             {showColorPicker && (
// // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // //                 <button
// // // //                   onMouseDown={(e) => {
// // // //                     e.preventDefault();
// // // //                     handleUnsetTextColor();
// // // //                   }}
// // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // //                 >
// // // //                   Remove Color
// // // //                 </button>
// // // //                 {COLORS.map((color) => (
// // // //                   <button
// // // //                     key={color}
// // // //                     onMouseDown={(e) => {
// // // //                       e.preventDefault();
// // // //                       handleSetTextColor(color);
// // // //                     }}
// // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // //                     style={{
// // // //                       backgroundColor: color,
// // // //                       border:
// // // //                         color === "#FFFFFF"
// // // //                           ? "1px solid #ddd"
// // // //                           : "1px solid transparent",
// // // //                       outline:
// // // //                         editor.getAttributes("textStyle").color === color
// // // //                           ? "2px solid #2563eb"
// // // //                           : "none",
// // // //                       outlineOffset: "2px",
// // // //                     }}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* Background (Highlight) Color */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 setShowBgColorPicker((v) => !v);
// // // //                 setShowColorPicker(false);
// // // //                 setShowHighlighter(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // // //               title="Background Color"
// // // //             >
// // // //               <MdFormatColorFill size={18} />
// // // //               <span
// // // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // // //                 style={{
// // // //                   backgroundColor:
// // // //                     editor.getAttributes("highlight").color || "transparent",
// // // //                 }}
// // // //               />
// // // //             </button>
// // // //             {showBgColorPicker && (
// // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // // //                 <button
// // // //                   onMouseDown={(e) => {
// // // //                     e.preventDefault();
// // // //                     handleUnsetHighlight();
// // // //                   }}
// // // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // // //                 >
// // // //                   Remove Background
// // // //                 </button>
// // // //                 {COLORS.map((color) => (
// // // //                   <button
// // // //                     key={color}
// // // //                     onMouseDown={(e) => {
// // // //                       e.preventDefault();
// // // //                       handleSetHighlight(color);
// // // //                     }}
// // // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // // //                     style={{
// // // //                       backgroundColor: color,
// // // //                       border:
// // // //                         color === "#FFFFFF"
// // // //                           ? "1px solid #ddd"
// // // //                           : "1px solid transparent",
// // // //                     }}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* Highlighter Pen */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 setShowHighlighter((v) => !v);
// // // //                 setShowColorPicker(false);
// // // //                 setShowBgColorPicker(false);
// // // //               }}
// // // //               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
// // // //               style={
// // // //                 editor.isActive("highlight")
// // // //                   ? {
// // // //                       backgroundColor:
// // // //                         editor.getAttributes("highlight").color || "#FEF08A",
// // // //                       color: "#000",
// // // //                     }
// // // //                   : {}
// // // //               }
// // // //               title="Highlighter"
// // // //             >
// // // //               <svg
// // // //                 width="16"
// // // //                 height="16"
// // // //                 viewBox="0 0 24 24"
// // // //                 fill="none"
// // // //                 stroke="currentColor"
// // // //                 strokeWidth="2"
// // // //                 strokeLinecap="round"
// // // //                 strokeLinejoin="round"
// // // //               >
// // // //                 <path d="M12 20h9" />
// // // //                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
// // // //               </svg>
// // // //             </button>
// // // //             {showHighlighter && (
// // // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
// // // //                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
// // // //                   Highlight Color
// // // //                 </span>
// // // //                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
// // // //                   <button
// // // //                     key={color}
// // // //                     onMouseDown={(e) => {
// // // //                       e.preventDefault();
// // // //                       editor.chain().focus().setHighlight({ color }).run();
// // // //                       setShowHighlighter(false);
// // // //                     }}
// // // //                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
// // // //                   >
// // // //                     <span
// // // //                       className="w-5 h-5 rounded-sm border flex-shrink-0"
// // // //                       style={{
// // // //                         backgroundColor: color,
// // // //                         borderColor:
// // // //                           editor.getAttributes("highlight").color === color
// // // //                             ? "#2563eb"
// // // //                             : "#e5e7eb",
// // // //                         outline:
// // // //                           editor.getAttributes("highlight").color === color
// // // //                             ? "2px solid #2563eb"
// // // //                             : "none",
// // // //                         outlineOffset: "2px",
// // // //                       }}
// // // //                     />
// // // //                     {label}
// // // //                   </button>
// // // //                 ))}
// // // //                 <button
// // // //                   onMouseDown={(e) => {
// // // //                     e.preventDefault();
// // // //                     editor.chain().focus().unsetHighlight().run();
// // // //                     setShowHighlighter(false);
// // // //                   }}
// // // //                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
// // // //                 >
// // // //                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
// // // //                   Remove
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Bold */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBold().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Bold"
// // // //           >
// // // //             <FiBold size={16} />
// // // //           </button>

// // // //           {/* Italic */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleItalic().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Italic"
// // // //           >
// // // //             <FiItalic size={16} />
// // // //           </button>

// // // //           {/* Underline */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleUnderline().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Underline"
// // // //           >
// // // //             <FiUnderline size={16} />
// // // //           </button>

// // // //           {/* Clear Formatting */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               clearFormatting();
// // // //             }}
// // // //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // //             title="Clear Formatting"
// // // //           >
// // // //             <MdFormatClear size={16} />
// // // //           </button>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Heading Select */}
// // // //           <select
// // // //             onChange={(e) => {
// // // //               const val = e.target.value;
// // // //               if (val === "paragraph")
// // // //                 editor.chain().focus().setParagraph().run();
// // // //               else
// // // //                 editor
// // // //                   .chain()
// // // //                   .focus()
// // // //                   .toggleHeading({ level: parseInt(val) })
// // // //                   .run();
// // // //             }}
// // // //             value={currentHeading}
// // // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // // //           >
// // // //             <option value="paragraph">Normal</option>
// // // //             <option value="1">Heading 1</option>
// // // //             <option value="2">Heading 2</option>
// // // //             <option value="3">Heading 3</option>
// // // //             <option value="4">Heading 4</option>
// // // //           </select>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Align Left */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().setTextAlign("left").run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //           >
// // // //             <FiAlignLeft size={16} />
// // // //           </button>
// // // //           {/* Align Center */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().setTextAlign("center").run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //           >
// // // //             <FiAlignCenter size={16} />
// // // //           </button>
// // // //           {/* Align Right */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().setTextAlign("right").run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //           >
// // // //             <FiAlignRight size={16} />
// // // //           </button>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Bullet List */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBulletList().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Bullet List"
// // // //           >
// // // //             <FiList size={16} />
// // // //           </button>

// // // //           {/* Ordered List */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleOrderedList().run();
// // // //             }}
// // // //             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Numbered List"
// // // //           >
// // // //             1.
// // // //           </button>

// // // //           {/* Blockquote */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBlockquote().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Blockquote"
// // // //           >
// // // //             <MdFormatQuote size={16} />
// // // //           </button>

// // // //           {/* Code Block */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleCodeBlock().run();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Code Block"
// // // //           >
// // // //             <FiCode size={16} />
// // // //           </button>

// // // //           {/* Horizontal Rule */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().setHorizontalRule().run();
// // // //             }}
// // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // //             title="Horizontal Rule"
// // // //           >
// // // //             <FiMinus size={16} />
// // // //           </button>

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Table */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               addTable();
// // // //             }}
// // // //             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
// // // //             title="Insert Table"
// // // //           >
// // // //             <div className="grid grid-cols-2 gap-[2px]">
// // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // //             </div>
// // // //             <span className="text-sm font-medium">Table</span>
// // // //           </button>

// // // //           {/* Image */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               addImage();
// // // //             }}
// // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // //             title="Insert Image"
// // // //           >
// // // //             <FiImage size={16} />
// // // //           </button>

// // // //           {/* Link button */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               openLinkDialog();
// // // //             }}
// // // //             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // // //             title="Insert Link"
// // // //           >
// // // //             <FiLinkIcon size={16} />
// // // //           </button>

// // // //           {/* Single Quote */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               const { from, to } = editor.state.selection;
// // // //               if (from === to) {
// // // //                 editor.chain().focus().insertContent("''").run();
// // // //               } else {
// // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // //                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
// // // //               }
// // // //             }}
// // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // //             title="Single Quotes"
// // // //           >
// // // //             '&thinsp;'
// // // //           </button>

// // // //           {/* Double Quote */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               const { from, to } = editor.state.selection;
// // // //               if (from === to) {
// // // //                 editor.chain().focus().insertContent('""').run();
// // // //               } else {
// // // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // // //                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
// // // //               }
// // // //             }}
// // // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // // //             title="Double Quotes"
// // // //           >
// // // //             "&thinsp;"
// // // //           </button>

// // // //           {editor.isActive("link") && (
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 removeLink();
// // // //               }}
// // // //               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // //               title="Remove Link"
// // // //             >
// // // //               Remove Link
// // // //             </button>
// // // //           )}

// // // //           {/* Table Controls — shown only when inside a table */}
// // // //           {editor.isActive("table") && (
// // // //             <>
// // // //               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
// // // //               {[
// // // //                 {
// // // //                   label: "+ Row ↑",
// // // //                   action: () => editor.chain().focus().addRowBefore().run(),
// // // //                 },
// // // //                 {
// // // //                   label: "+ Row ↓",
// // // //                   action: () => editor.chain().focus().addRowAfter().run(),
// // // //                 },
// // // //                 {
// // // //                   label: "+ Col ←",
// // // //                   action: () => editor.chain().focus().addColumnBefore().run(),
// // // //                 },
// // // //                 {
// // // //                   label: "+ Col →",
// // // //                   action: () => editor.chain().focus().addColumnAfter().run(),
// // // //                 },
// // // //               ].map(({ label, action }) => (
// // // //                 <button
// // // //                   key={label}
// // // //                   onMouseDown={(e) => {
// // // //                     e.preventDefault();
// // // //                     action();
// // // //                   }}
// // // //                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
// // // //                 >
// // // //                   {label}
// // // //                 </button>
// // // //               ))}
// // // //               {[
// // // //                 {
// // // //                   label: "- Row",
// // // //                   action: () => editor.chain().focus().deleteRow().run(),
// // // //                 },
// // // //                 {
// // // //                   label: "- Col",
// // // //                   action: () => editor.chain().focus().deleteColumn().run(),
// // // //                 },
// // // //                 {
// // // //                   label: "Delete Table",
// // // //                   action: () => editor.chain().focus().deleteTable().run(),
// // // //                 },
// // // //               ].map(({ label, action }) => (
// // // //                 <button
// // // //                   key={label}
// // // //                   onMouseDown={(e) => {
// // // //                     e.preventDefault();
// // // //                     action();
// // // //                   }}
// // // //                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // // //                 >
// // // //                   {label}
// // // //                 </button>
// // // //               ))}
// // // //             </>
// // // //           )}
// // // //         </div>

// // // //         <EditorContent editor={editor} />

// // // //         <style>{`
// // // //         .editor-wrapper .editor-content:focus {
// // // //           outline: none;
// // // //         }

// // // //         .editor-wrapper .editor-content {
// // // //           caret-color: #2563EB;
// // // //           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
// // // //         }

// // // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // // //           content: attr(data-placeholder);
// // // //           float: left;
// // // //           color: #adb5bd;
// // // //           pointer-events: none;
// // // //           height: 0;
// // // //         }

// // // //         .editor-wrapper .editor-content ::selection {
// // // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // // //           color: inherit !important;
// // // //         }

// // // //         .editor-wrapper mark {
// // // //           padding: 0.1em 0;
// // // //           border-radius: 2px;
// // // //         }

// // // //         .editor-wrapper .custom-link,
// // // //         .editor-wrapper a {
// // // //           color: #2563eb !important;
// // // //           text-decoration: underline !important;
// // // //           cursor: pointer !important;
// // // //         }
// // // //         .editor-wrapper .custom-link:hover,
// // // //         .editor-wrapper a:hover {
// // // //           color: #1d4ed8 !important;
// // // //         }

// // // //         .editor-wrapper table {
// // // //           border-collapse: collapse;
// // // //           width: 100%;
// // // //           margin: 1rem 0;
// // // //           table-layout: fixed;
// // // //         }
// // // //         .editor-wrapper td,
// // // //         .editor-wrapper th {
// // // //           border: 1px solid #d1d5db;
// // // //           padding: 8px 12px;
// // // //           position: relative;
// // // //         }
// // // //         .editor-wrapper th {
// // // //           background-color: #f3f4f6;
// // // //           font-weight: 600;
// // // //         }
// // // //         .editor-wrapper .selectedCell::after {
// // // //           content: "";
// // // //           position: absolute;
// // // //           inset: 0;
// // // //           background: rgba(59, 130, 246, 0.15);
// // // //           pointer-events: none;
// // // //         }

// // // //         .editor-wrapper .editor-content p {
// // // //           margin: 0 0 0.75rem;
// // // //           line-height: 1.6;
// // // //         }

// // // //         .editor-wrapper .editor-content ul {
// // // //           list-style-type: disc;
// // // //           padding-left: 1.75rem;
// // // //           margin: 0 0 0.75rem;
// // // //         }
// // // //         .editor-wrapper .editor-content ol {
// // // //           list-style-type: decimal;
// // // //           padding-left: 1.75rem;
// // // //           margin: 0 0 0.75rem;
// // // //         }
// // // //         .editor-wrapper .editor-content li {
// // // //           margin-bottom: 0.25rem;
// // // //           line-height: 1.6;
// // // //         }
// // // //         .editor-wrapper .editor-content li p {
// // // //           margin: 0;
// // // //         }

// // // //         .editor-wrapper .editor-content blockquote {
// // // //           border-left: 4px solid #3b82f6;
// // // //           padding: 0.5rem 1rem;
// // // //           margin: 1rem 0;
// // // //           color: #4b5563;
// // // //           font-style: italic;
// // // //           background-color: #f8fafc;
// // // //           border-radius: 0 4px 4px 0;
// // // //         }
// // // //         .editor-wrapper .editor-content blockquote p {
// // // //           margin: 0;
// // // //         }

// // // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // // //         .editor-wrapper .editor-content img {
// // // //           max-width: 100%;
// // // //           height: auto;
// // // //           border-radius: 0.5rem;
// // // //           margin: 0.5rem 0;
// // // //         }

// // // //         .editor-wrapper .editor-content pre {
// // // //           background-color: #1f2937;
// // // //           color: #f3f4f6;
// // // //           padding: 1rem;
// // // //           border-radius: 0.5rem;
// // // //           overflow-x: auto;
// // // //           font-family: monospace;
// // // //           font-size: 0.875rem;
// // // //           margin: 1rem 0;
// // // //         }
// // // //         .editor-wrapper .editor-content code:not(pre code) {
// // // //           background-color: #f3f4f6;
// // // //           padding: 0.125rem 0.3rem;
// // // //           border-radius: 0.25rem;
// // // //           font-family: monospace;
// // // //           font-size: 0.875rem;
// // // //           color: #dc2626;
// // // //         }

// // // //         .editor-wrapper .editor-content hr {
// // // //           margin: 1.5rem 0;
// // // //           border: none;
// // // //           border-top: 2px solid #e5e7eb;
// // // //         }
// // // //       `}</style>
// // // //       </div>
// // // //     );
// // // //   },
// // // // );

// // // // CustomEditor.displayName = "CustomEditor";

// // // // export default CustomEditor;

// // // import { memo, useEffect, useState } from "react";

// // // // =========================
// // // // Tiptap Core
// // // // =========================
// // // import { useEditor, EditorContent, Extension } from "@tiptap/react";
// // // import StarterKit from "@tiptap/starter-kit";

// // // // =========================
// // // // Tiptap Extensions
// // // // =========================
// // // import { Table } from "@tiptap/extension-table";
// // // import { TableRow } from "@tiptap/extension-table-row";
// // // import { TableCell } from "@tiptap/extension-table-cell";
// // // import { TableHeader } from "@tiptap/extension-table-header";

// // // import Image from "@tiptap/extension-image";
// // // import Link from "@tiptap/extension-link";
// // // import Placeholder from "@tiptap/extension-placeholder";
// // // import Underline from "@tiptap/extension-underline";
// // // import TextAlign from "@tiptap/extension-text-align";
// // // import Highlight from "@tiptap/extension-highlight";

// // // import { TextStyle } from "@tiptap/extension-text-style";
// // // import { Color } from "@tiptap/extension-color";

// // // import FontFamily from "@tiptap/extension-font-family";
// // // import HorizontalRule from "@tiptap/extension-horizontal-rule";

// // // import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // // // =========================
// // // // Lowlight + Highlight.js
// // // // =========================
// // // import { createLowlight } from "lowlight";
// // // import javascript from "highlight.js/lib/languages/javascript";
// // // import xml from "highlight.js/lib/languages/xml";
// // // import css from "highlight.js/lib/languages/css";
// // // import json from "highlight.js/lib/languages/json";
// // // import typescript from "highlight.js/lib/languages/typescript";
// // // import bash from "highlight.js/lib/languages/bash";
// // // import "highlight.js/styles/github-dark.css";

// // // const lowlight = createLowlight();
// // // lowlight.register("javascript", javascript);
// // // lowlight.register("js", javascript);
// // // lowlight.register("html", xml);
// // // lowlight.register("xml", xml);
// // // lowlight.register("css", css);
// // // lowlight.register("json", json);
// // // lowlight.register("typescript", typescript);
// // // lowlight.register("ts", typescript);
// // // lowlight.register("bash", bash);
// // // lowlight.register("shell", bash);

// // // // =========================
// // // // FIX 1: Custom FontSize Extension
// // // // =========================
// // // const FontSize = Extension.create({
// // //   name: "fontSize",
// // //   addOptions() {
// // //     return { types: ["textStyle"] };
// // //   },
// // //   addGlobalAttributes() {
// // //     return [
// // //       {
// // //         types: this.options.types,
// // //         attributes: {
// // //           fontSize: {
// // //             default: null,
// // //             parseHTML: (element) => element.style.fontSize || null,
// // //             renderHTML: (attributes) => {
// // //               if (!attributes.fontSize) return {};
// // //               return { style: `font-size: ${attributes.fontSize}` };
// // //             },
// // //           },
// // //         },
// // //       },
// // //     ];
// // //   },
// // //   addCommands() {
// // //     return {
// // //       setFontSize:
// // //         (fontSize) =>
// // //         ({ chain }) => {
// // //           return chain().setMark("textStyle", { fontSize }).run();
// // //         },
// // //       unsetFontSize:
// // //         () =>
// // //         ({ chain }) => {
// // //           return chain()
// // //             .setMark("textStyle", { fontSize: null })
// // //             .removeEmptyTextStyle()
// // //             .run();
// // //         },
// // //     };
// // //   },
// // // });

// // // const BackgroundColor = Extension.create({
// // //   name: "backgroundColor",
// // //   addOptions() {
// // //     return { types: ["paragraph", "heading"] };
// // //   },
// // //   addGlobalAttributes() {
// // //     return [
// // //       {
// // //         types: this.options.types,
// // //         attributes: {
// // //           backgroundColor: {
// // //             default: null,
// // //             parseHTML: (element) =>
// // //               element.style.backgroundColor || element.style.background || null,
// // //             renderHTML: (attributes) => {
// // //               if (!attributes.backgroundColor) return {};
// // //               return {
// // //                 style: `background-color: ${attributes.backgroundColor}`,
// // //               };
// // //             },
// // //           },
// // //         },
// // //       },
// // //     ];
// // //   },
// // // });

// // // // ADD: Custom BorderBottom Extension for underlines
// // // const BorderBottom = Extension.create({
// // //   name: "borderBottom",
// // //   addOptions() {
// // //     return { types: ["paragraph", "heading"] };
// // //   },
// // //   addGlobalAttributes() {
// // //     return [
// // //       {
// // //         types: this.options.types,
// // //         attributes: {
// // //           borderBottom: {
// // //             default: null,
// // //             parseHTML: (element) => {
// // //               const style = element.getAttribute("style") || "";
// // //               const match = style.match(/border-bottom:\s*([^;]+)/i);
// // //               return match ? match[1].trim() : null;
// // //             },
// // //             renderHTML: (attributes) => {
// // //               if (!attributes.borderBottom) return {};
// // //               return {
// // //                 style: `border-bottom: ${attributes.borderBottom}`,
// // //               };
// // //             },
// // //           },
// // //         },
// // //       },
// // //     ];
// // //   },
// // // });

// // // // =========================
// // // // React Icons
// // // // =========================
// // // import {
// // //   FiBold,
// // //   FiItalic,
// // //   FiUnderline,
// // //   FiList,
// // //   FiAlignLeft,
// // //   FiAlignCenter,
// // //   FiAlignRight,
// // //   FiImage,
// // //   FiCode,
// // //   FiMinus,
// // //   FiLink as FiLinkIcon,
// // // } from "react-icons/fi";
// // // import {
// // //   MdFormatColorText,
// // //   MdFormatColorFill,
// // //   MdFormatQuote,
// // //   MdFormatClear,
// // // } from "react-icons/md";

// // // const COLORS = [
// // //   "#000000",
// // //   "#DC2626",
// // //   "#059669",
// // //   "#2563EB",
// // //   "#D97706",
// // //   "#7C3AED",
// // //   "#DB2777",
// // //   "#4B5563",
// // //   "#FFFFFF",
// // //   "#FCD34D",
// // //   "#F97316",
// // //   "#EC4899",
// // //   "#06B6D4",
// // //   "#84CC16",
// // //   "#8B5CF6",
// // // ];

// // // const HIGHLIGHT_COLORS = [
// // //   { color: "#FEF08A", label: "Yellow" },
// // //   { color: "#86EFAC", label: "Green" },
// // //   { color: "#FDA4AF", label: "Pink" },
// // //   { color: "#93C5FD", label: "Blue" },
// // //   { color: "#FED7AA", label: "Orange" },
// // //   { color: "#E9D5FF", label: "Purple" },
// // // ];

// // // // ============================================================
// // // // PASTE CLEANER - IMPROVED
// // // // Strips Word/Google-Docs layout junk before Tiptap parses it:
// // // //  - nested "layout" tables (tables used only for spacing/positioning)
// // // //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// // // //  - empty spacing paragraphs (&nbsp; / <br><br>)
// // // //  - inline width/style junk on any table that survives
// // // //  - PRESERVES: borders (underlines), text-align, background-color
// // // // ============================================================
// // // function cleanPastedHTML(html) {
// // //   const doc = new DOMParser().parseFromString(html, "text/html");

// // //   doc.querySelectorAll("*").forEach((el) => {
// // //     const style = el.getAttribute("style") || "";

// // //     if (
// // //       style.includes("border-bottom") ||
// // //       style.includes("mso-border-bottom")
// // //     ) {
// // //       console.log("FOUND BORDER:", el.tagName, style);
// // //     }
// // //   });

// // //   // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
// // //   doc.querySelectorAll("[align]").forEach((el) => {
// // //     const alignVal = el.getAttribute("align");
// // //     if (alignVal) {
// // //       const existing = el.getAttribute("style") || "";
// // //       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
// // //       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
// // //     }
// // //     el.removeAttribute("align");
// // //   });

// // //   // 1) Repeatedly unwrap tables whose cells have no real tabular data
// // //   let guard = 0;
// // //   let changed = true;
// // //   while (changed && guard < 15) {
// // //     changed = false;
// // //     guard++;
// // //     const tables = Array.from(doc.querySelectorAll("table"));
// // //     tables.forEach((table) => {
// // //       const rows = table.querySelectorAll("tr");
// // //       const cells = table.querySelectorAll("td, th");
// // //       const maxCellsInARow = Math.max(
// // //         0,
// // //         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
// // //       );
// // //       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

// // //       if (isLayoutTable && cells.length > 0) {
// // //         const fragment = doc.createDocumentFragment();

// // //         cells.forEach((cell) => {
// // //           const cellStyle = cell.getAttribute("style") || "";

// // //           // Background color preserve
// // //           const bgMatch = cellStyle.match(
// // //             /background(?:-color)?\s*:\s*([^;]+)/i,
// // //           );
// // //           const bgColor = bgMatch ? bgMatch[1].trim() : null;

// // //           // IMPORTANT: preserve border-bottom specifically
// // //           const borderBottomMatch = cellStyle.match(
// // //             /border-bottom\s*:\s*([^;]+)/i,
// // //           );

// // //           const borderBottom = borderBottomMatch
// // //             ? borderBottomMatch[1].trim()
// // //             : null;

// // //           Array.from(cell.childNodes).forEach((node) => {
// // //             if (node.nodeType === 1) {
// // //               const existing = node.getAttribute("style") || "";
// // //               const styles = [];

// // //               if (existing.trim()) {
// // //                 styles.push(existing.trim().replace(/;$/, ""));
// // //               }

// // //               if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
// // //                 styles.push(`background-color:${bgColor}`);
// // //               }

// // //               if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
// // //                 styles.push(`border-bottom:${borderBottom}`);
// // //               }

// // //               node.setAttribute(
// // //                 "style",
// // //                 styles.join("; ") + (styles.length ? ";" : ""),
// // //               );

// // //               console.log(
// // //                 "MOVING STYLE:",
// // //                 node.tagName,
// // //                 node.getAttribute("style"),
// // //               );
// // //             }

// // //             fragment.appendChild(node);
// // //           });
// // //         });

// // //         table.replaceWith(fragment);
// // //         changed = true;
// // //       }
// // //     });
// // //   }

// // //   // 2) Split paragraphs where a numbering span like "3." / "4." sits
// // //   //    in the MIDDLE of a <p> instead of at the start
// // //   doc.querySelectorAll("p").forEach((p) => {
// // //     const spans = Array.from(p.querySelectorAll("span"));
// // //     const numberSpans = spans.filter((s) =>
// // //       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
// // //     );

// // //     if (numberSpans.length > 1) {
// // //       const parent = p.parentNode;
// // //       let current = doc.createElement("p");
// // //       Array.from(p.attributes).forEach((attr) =>
// // //         current.setAttribute(attr.name, attr.value),
// // //       );
// // //       const splitMarkers = new Set(numberSpans.slice(1));
// // //       const newParagraphs = [current];

// // //       Array.from(p.childNodes).forEach((node) => {
// // //         if (splitMarkers.has(node)) {
// // //           current = doc.createElement("p");
// // //           Array.from(p.attributes).forEach((attr) =>
// // //             current.setAttribute(attr.name, attr.value),
// // //           );
// // //           newParagraphs.push(current);
// // //         }
// // //         current.appendChild(node);
// // //       });

// // //       newParagraphs.forEach((np) => parent.insertBefore(np, p));
// // //       parent.removeChild(p);
// // //     }
// // //   });

// // //   // 2b) FIX: If a paragraph ends with text like "able to:" followed by
// // //   //    a numbered list item "1. Identify...", split them into separate paragraphs
// // //   doc.querySelectorAll("p").forEach((p) => {
// // //     const textContent = p.textContent.trim();
// // //     // Check if this paragraph has both "able to:" pattern and number pattern
// // //     if (textContent.match(/able\s+to:\s*\d+\./i)) {
// // //       const parent = p.parentNode;
// // //       const parts = [];

// // //       // Split by number pattern like "1. " "2. " etc
// // //       const nodes = Array.from(p.childNodes);
// // //       let currentPara = doc.createElement("p");
// // //       Array.from(p.attributes).forEach((attr) =>
// // //         currentPara.setAttribute(attr.name, attr.value),
// // //       );

// // //       nodes.forEach((node) => {
// // //         const isNumberNode =
// // //           node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

// // //         if (isNumberNode) {
// // //           // Found a number span - this should start a new paragraph
// // //           if (currentPara.childNodes.length > 0) {
// // //             parts.push(currentPara);
// // //           }
// // //           currentPara = doc.createElement("p");
// // //           Array.from(p.attributes).forEach((attr) =>
// // //             currentPara.setAttribute(attr.name, attr.value),
// // //           );
// // //         }
// // //         currentPara.appendChild(node);
// // //       });

// // //       if (currentPara.childNodes.length > 0) {
// // //         parts.push(currentPara);
// // //       }

// // //       if (parts.length > 1) {
// // //         parts.forEach((part) => parent.insertBefore(part, p));
// // //         parent.removeChild(p);
// // //       }
// // //     }
// // //   });

// // //   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
// // //   doc.querySelectorAll("span").forEach((span) => {
// // //     const t = span.textContent.trim();
// // //     if (/^\d{1,2}[.)]$/.test(t)) {
// // //       const textNode = doc.createTextNode(`${t} `);
// // //       span.replaceWith(textNode);
// // //     }
// // //   });

// // //   // 4) Remove empty spacing paragraphs
// // //   doc.querySelectorAll("p").forEach((p) => {
// // //     const hasMedia = p.querySelector("img, table");
// // //     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
// // //     if (isEmptyText && !hasMedia) {
// // //       p.remove();
// // //     }
// // //   });

// // //   // 4b) Collapse leftover Word tab-stop runs of &nbsp;
// // //   doc.querySelectorAll("span").forEach((span) => {
// // //     const raw = span.textContent;
// // //     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
// // //       span.replaceWith(doc.createTextNode(" "));
// // //     }
// // //   });

// // //   // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
// // //   //    for underlines and keep text-align and background-color
// // //   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
// // //     el.removeAttribute("width");
// // //     if (
// // //       el.tagName === "TABLE" ||
// // //       el.tagName === "COLGROUP" ||
// // //       el.tagName === "COL"
// // //     ) {
// // //       el.removeAttribute("style");
// // //     }
// // //   });

// // //   // 5b) IMPORTANT: Clean up inline styles on paragraphs but PRESERVE
// // //   //     text-align, background-color, and border-bottom
// // //   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
// // //     const style = el.getAttribute("style") || "";
// // //     const preserved = [];

// // //     // Extract styles we want to keep
// // //     const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
// // //     if (textAlignMatch) {
// // //       preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
// // //     }

// // //     const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
// // //     if (bgColorMatch) {
// // //       preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
// // //     }

// // //     const borderMatch = style.match(
// // //       /(border(?:-bottom|-top|-left|-right)?)\s*:\s*([^;]+)/i,
// // //     );
// // //     if (borderMatch) {
// // //       preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
// // //     }

// // //     const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
// // //     if (colorMatch) {
// // //       preserved.push(`color: ${colorMatch[1].trim()}`);
// // //     }

// // //     const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
// // //     if (fontSizeMatch) {
// // //       preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
// // //     }

// // //     const borderBottom = style.match(/border-bottom\s*:\s*([^;]+)/i);

// // //     if (borderBottom) {
// // //       preserved.push(`border-bottom:${borderBottom[1].trim()}`);
// // //     }
// // //   });

// // //   console.log(
// // //     "FINAL BORDER COUNT:",
// // //     (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
// // //   );

// // //   return doc.body.innerHTML;
// // // }

// // // const CustomEditor = memo(
// // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // //     const [showHighlighter, setShowHighlighter] = useState(false);

// // //     const editor = useEditor({
// // //       extensions: [
// // //         StarterKit.configure({
// // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // //           codeBlock: false,
// // //           blockquote: true,
// // //           orderedList: {
// // //             keepMarks: true,
// // //             keepAttributes: true,
// // //           },
// // //           bulletList: {
// // //             keepMarks: true,
// // //             keepAttributes: true,
// // //           },
// // //           underline: false,
// // //           link: false,
// // //           horizontalRule: false,
// // //         }),
// // //         Underline,
// // //         TextAlign.configure({
// // //           types: ["heading", "paragraph"],
// // //           alignments: ["left", "center", "right", "justify"],
// // //         }),
// // //         Highlight.configure({ multicolor: true }),
// // //         TextStyle,
// // //         Color,
// // //         FontFamily,
// // //         FontSize,
// // //         BackgroundColor,
// // //         BorderBottom, // ADD: For underlines
// // //         Link.configure({
// // //           openOnClick: false,
// // //           linkOnPaste: true,
// // //           autolink: true,
// // //           HTMLAttributes: {
// // //             class: "custom-link",
// // //             rel: "noopener noreferrer",
// // //             target: "_blank",
// // //           },
// // //         }),
// // //         Image.configure({
// // //           inline: true,
// // //           allowBase64: true,
// // //         }),
// // //         Placeholder.configure({
// // //           placeholder: placeholder || "Write something...",
// // //         }),
// // //         Table.configure({ resizable: true }),
// // //         TableRow,
// // //         TableCell,
// // //         TableHeader,
// // //         HorizontalRule,
// // //         CodeBlockLowlight.configure({ lowlight }),
// // //       ],
// // //       content: value || "",
// // //       onUpdate: ({ editor }) => {
// // //         onChange(editor.getHTML());
// // //         console.log("===== TIPTAP HTML (after edit) =====");
// // //         console.log(editor.getHTML());
// // //       },
// // //       editorProps: {
// // //         attributes: {
// // //           class: "editor-content",
// // //           style: `min-height: ${minHeight}; padding: 1rem;`,
// // //         },
// // //         transformPastedHTML(html) {
// // //           console.log("===== RAW HTML =====");

// // //           console.log("RAW border-bottom:", html.includes("border-bottom"));

// // //           console.log(
// // //             "RAW mso-border-bottom:",
// // //             html.includes("mso-border-bottom"),
// // //           );

// // //           console.log("RAW table:", html.includes("<table"));

// // //           const cleaned = cleanPastedHTML(html);

// // //           console.log("===== CLEANED HTML =====");

// // //           console.log(
// // //             "CLEANED border-bottom:",
// // //             cleaned.includes("border-bottom"),
// // //           );

// // //           console.log(
// // //             "CLEANED mso-border-bottom:",
// // //             cleaned.includes("mso-border-bottom"),
// // //           );

// // //           console.log("CLEANED table:", cleaned.includes("<table"));

// // //           return cleaned;
// // //         },
// // //       },
// // //     });

// // //     // Sync external value changes
// // //     useEffect(() => {
// // //       if (editor && value !== editor.getHTML()) {
// // //         editor.commands.setContent(value || "", false);
// // //       }
// // //     }, [editor, value]);

// // //     // Close pickers on outside click
// // //     useEffect(() => {
// // //       const handler = (e) => {
// // //         if (!e.target.closest(".color-picker-wrapper")) {
// // //           setShowColorPicker(false);
// // //           setShowBgColorPicker(false);
// // //           setShowHighlighter(false);
// // //         }
// // //       };
// // //       document.addEventListener("mousedown", handler);
// // //       return () => document.removeEventListener("mousedown", handler);
// // //     }, []);

// // //     if (!editor) {
// // //       return (
// // //         <div
// // //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// // //           style={{ minHeight }}
// // //         >
// // //           <div className="text-gray-400">Loading editor...</div>
// // //         </div>
// // //       );
// // //     }

// // //     const addTable = () => {
// // //       const rows = prompt("Number of rows:", "3");
// // //       const cols = prompt("Number of columns:", "3");
// // //       if (rows && cols) {
// // //         editor
// // //           .chain()
// // //           .focus()
// // //           .insertTable({
// // //             rows: parseInt(rows),
// // //             cols: parseInt(cols),
// // //             withHeaderRow: true,
// // //           })
// // //           .run();
// // //       }
// // //     };

// // //     const addImage = () => {
// // //       const url = prompt("Enter image URL:");
// // //       if (url) editor.chain().focus().setImage({ src: url }).run();
// // //     };

// // //     const openLinkDialog = () => {
// // //       const url = window.prompt("Enter link URL:");
// // //       if (!url) return;
// // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // //       const { from, to } = editor.state.selection;
// // //       if (from === to) {
// // //         editor
// // //           .chain()
// // //           .focus()
// // //           .insertContent(`<a href="${href}">${href}</a>`)
// // //           .run();
// // //       } else {
// // //         editor.chain().focus().setLink({ href }).run();
// // //       }
// // //     };

// // //     const removeLink = () => {
// // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // //     };

// // //     const setFontSize = (size) => {
// // //       if (size === "default") {
// // //         editor.chain().focus().unsetFontSize().run();
// // //       } else {
// // //         editor.chain().focus().setFontSize(size).run();
// // //       }
// // //     };

// // //     const handleSetTextColor = (color) => {
// // //       editor.chain().focus().setColor(color).run();
// // //       setShowColorPicker(false);
// // //     };

// // //     const handleUnsetTextColor = () => {
// // //       editor.chain().focus().unsetColor().run();
// // //       setShowColorPicker(false);
// // //     };

// // //     const handleSetHighlight = (color) => {
// // //       editor.chain().focus().setHighlight({ color }).run();
// // //       setShowBgColorPicker(false);
// // //     };

// // //     const handleUnsetHighlight = () => {
// // //       editor.chain().focus().unsetHighlight().run();
// // //       setShowBgColorPicker(false);
// // //     };

// // //     const clearFormatting = () => {
// // //       editor.chain().focus().clearNodes().unsetAllMarks().run();
// // //     };

// // //     const currentHeading = (() => {
// // //       for (let i = 1; i <= 4; i++) {
// // //         if (editor.isActive("heading", { level: i })) return String(i);
// // //       }
// // //       return "paragraph";
// // //     })();

// // //     return (
// // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
// // //         {/* ── Toolbar ── */}
// // //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// // //           {/* Font Family */}
// // //           <select
// // //             onChange={(e) => {
// // //               const font = e.target.value;
// // //               if (font === "default")
// // //                 editor.chain().focus().unsetFontFamily().run();
// // //               else editor.chain().focus().setFontFamily(font).run();
// // //             }}
// // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // //           >
// // //             <option value="default">Font Family</option>
// // //             <option value="Arial">Arial</option>
// // //             <option value="Georgia">Georgia</option>
// // //             <option value="Times New Roman">Times New Roman</option>
// // //             <option value="Courier New">Courier New</option>
// // //             <option value="Verdana">Verdana</option>
// // //           </select>

// // //           {/* Font Size */}
// // //           <select
// // //             onChange={(e) => setFontSize(e.target.value)}
// // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // //             defaultValue="default"
// // //           >
// // //             <option value="default">Font Size</option>
// // //             <option value="12px">12px</option>
// // //             <option value="14px">14px</option>
// // //             <option value="16px">16px</option>
// // //             <option value="18px">18px</option>
// // //             <option value="20px">20px</option>
// // //             <option value="24px">24px</option>
// // //             <option value="28px">28px</option>
// // //             <option value="32px">32px</option>
// // //           </select>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Text Color */}
// // //           <div className="relative color-picker-wrapper">
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault();
// // //                 setShowColorPicker((v) => !v);
// // //                 setShowBgColorPicker(false);
// // //                 setShowHighlighter(false);
// // //               }}
// // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // //               title="Text Color"
// // //             >
// // //               <MdFormatColorText size={18} />
// // //               <span
// // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // //                 style={{
// // //                   backgroundColor:
// // //                     editor.getAttributes("textStyle").color || "transparent",
// // //                 }}
// // //               />
// // //             </button>
// // //             {showColorPicker && (
// // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // //                 <button
// // //                   onMouseDown={(e) => {
// // //                     e.preventDefault();
// // //                     handleUnsetTextColor();
// // //                   }}
// // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // //                 >
// // //                   Remove Color
// // //                 </button>
// // //                 {COLORS.map((color) => (
// // //                   <button
// // //                     key={color}
// // //                     onMouseDown={(e) => {
// // //                       e.preventDefault();
// // //                       handleSetTextColor(color);
// // //                     }}
// // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // //                     style={{
// // //                       backgroundColor: color,
// // //                       border:
// // //                         color === "#FFFFFF"
// // //                           ? "1px solid #ddd"
// // //                           : "1px solid transparent",
// // //                       outline:
// // //                         editor.getAttributes("textStyle").color === color
// // //                           ? "2px solid #2563eb"
// // //                           : "none",
// // //                       outlineOffset: "2px",
// // //                     }}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Background (Highlight) Color */}
// // //           <div className="relative color-picker-wrapper">
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault();
// // //                 setShowBgColorPicker((v) => !v);
// // //                 setShowColorPicker(false);
// // //                 setShowHighlighter(false);
// // //               }}
// // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// // //               title="Background Color"
// // //             >
// // //               <MdFormatColorFill size={18} />
// // //               <span
// // //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// // //                 style={{
// // //                   backgroundColor:
// // //                     editor.getAttributes("highlight").color || "transparent",
// // //                 }}
// // //               />
// // //             </button>
// // //             {showBgColorPicker && (
// // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// // //                 <button
// // //                   onMouseDown={(e) => {
// // //                     e.preventDefault();
// // //                     handleUnsetHighlight();
// // //                   }}
// // //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// // //                 >
// // //                   Remove Background
// // //                 </button>
// // //                 {COLORS.map((color) => (
// // //                   <button
// // //                     key={color}
// // //                     onMouseDown={(e) => {
// // //                       e.preventDefault();
// // //                       handleSetHighlight(color);
// // //                     }}
// // //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// // //                     style={{
// // //                       backgroundColor: color,
// // //                       border:
// // //                         color === "#FFFFFF"
// // //                           ? "1px solid #ddd"
// // //                           : "1px solid transparent",
// // //                     }}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Highlighter Pen */}
// // //           <div className="relative color-picker-wrapper">
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault();
// // //                 setShowHighlighter((v) => !v);
// // //                 setShowColorPicker(false);
// // //                 setShowBgColorPicker(false);
// // //               }}
// // //               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
// // //               style={
// // //                 editor.isActive("highlight")
// // //                   ? {
// // //                       backgroundColor:
// // //                         editor.getAttributes("highlight").color || "#FEF08A",
// // //                       color: "#000",
// // //                     }
// // //                   : {}
// // //               }
// // //               title="Highlighter"
// // //             >
// // //               <svg
// // //                 width="16"
// // //                 height="16"
// // //                 viewBox="0 0 24 24"
// // //                 fill="none"
// // //                 stroke="currentColor"
// // //                 strokeWidth="2"
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //               >
// // //                 <path d="M12 20h9" />
// // //                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
// // //               </svg>
// // //             </button>
// // //             {showHighlighter && (
// // //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
// // //                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
// // //                   Highlight Color
// // //                 </span>
// // //                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
// // //                   <button
// // //                     key={color}
// // //                     onMouseDown={(e) => {
// // //                       e.preventDefault();
// // //                       editor.chain().focus().setHighlight({ color }).run();
// // //                       setShowHighlighter(false);
// // //                     }}
// // //                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
// // //                   >
// // //                     <span
// // //                       className="w-5 h-5 rounded-sm border flex-shrink-0"
// // //                       style={{
// // //                         backgroundColor: color,
// // //                         borderColor:
// // //                           editor.getAttributes("highlight").color === color
// // //                             ? "#2563eb"
// // //                             : "#e5e7eb",
// // //                         outline:
// // //                           editor.getAttributes("highlight").color === color
// // //                             ? "2px solid #2563eb"
// // //                             : "none",
// // //                         outlineOffset: "2px",
// // //                       }}
// // //                     />
// // //                     {label}
// // //                   </button>
// // //                 ))}
// // //                 <button
// // //                   onMouseDown={(e) => {
// // //                     e.preventDefault();
// // //                     editor.chain().focus().unsetHighlight().run();
// // //                     setShowHighlighter(false);
// // //                   }}
// // //                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
// // //                 >
// // //                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
// // //                   Remove
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Bold */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleBold().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Bold"
// // //           >
// // //             <FiBold size={16} />
// // //           </button>

// // //           {/* Italic */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleItalic().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Italic"
// // //           >
// // //             <FiItalic size={16} />
// // //           </button>

// // //           {/* Underline */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleUnderline().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Underline"
// // //           >
// // //             <FiUnderline size={16} />
// // //           </button>

// // //           {/* Clear Formatting */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               clearFormatting();
// // //             }}
// // //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // //             title="Clear Formatting"
// // //           >
// // //             <MdFormatClear size={16} />
// // //           </button>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Heading Select */}
// // //           <select
// // //             onChange={(e) => {
// // //               const val = e.target.value;
// // //               if (val === "paragraph")
// // //                 editor.chain().focus().setParagraph().run();
// // //               else
// // //                 editor
// // //                   .chain()
// // //                   .focus()
// // //                   .toggleHeading({ level: parseInt(val) })
// // //                   .run();
// // //             }}
// // //             value={currentHeading}
// // //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// // //           >
// // //             <option value="paragraph">Normal</option>
// // //             <option value="1">Heading 1</option>
// // //             <option value="2">Heading 2</option>
// // //             <option value="3">Heading 3</option>
// // //             <option value="4">Heading 4</option>
// // //           </select>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Align Left */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().setTextAlign("left").run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //           >
// // //             <FiAlignLeft size={16} />
// // //           </button>
// // //           {/* Align Center */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().setTextAlign("center").run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //           >
// // //             <FiAlignCenter size={16} />
// // //           </button>
// // //           {/* Align Right */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().setTextAlign("right").run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //           >
// // //             <FiAlignRight size={16} />
// // //           </button>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Bullet List */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleBulletList().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Bullet List"
// // //           >
// // //             <FiList size={16} />
// // //           </button>

// // //           {/* Ordered List */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleOrderedList().run();
// // //             }}
// // //             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Numbered List"
// // //           >
// // //             1.
// // //           </button>

// // //           {/* Blockquote */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleBlockquote().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Blockquote"
// // //           >
// // //             <MdFormatQuote size={16} />
// // //           </button>

// // //           {/* Code Block */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleCodeBlock().run();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Code Block"
// // //           >
// // //             <FiCode size={16} />
// // //           </button>

// // //           {/* Horizontal Rule */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().setHorizontalRule().run();
// // //             }}
// // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // //             title="Horizontal Rule"
// // //           >
// // //             <FiMinus size={16} />
// // //           </button>

// // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // //           {/* Table */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               addTable();
// // //             }}
// // //             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
// // //             title="Insert Table"
// // //           >
// // //             <div className="grid grid-cols-2 gap-[2px]">
// // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // //             </div>
// // //             <span className="text-sm font-medium">Table</span>
// // //           </button>

// // //           {/* Image */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               addImage();
// // //             }}
// // //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // //             title="Insert Image"
// // //           >
// // //             <FiImage size={16} />
// // //           </button>

// // //           {/* Link button */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               openLinkDialog();
// // //             }}
// // //             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// // //             title="Insert Link"
// // //           >
// // //             <FiLinkIcon size={16} />
// // //           </button>

// // //           {/* Single Quote */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               const { from, to } = editor.state.selection;
// // //               if (from === to) {
// // //                 editor.chain().focus().insertContent("''").run();
// // //               } else {
// // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // //                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
// // //               }
// // //             }}
// // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // //             title="Single Quotes"
// // //           >
// // //             '&thinsp;'
// // //           </button>

// // //           {/* Double Quote */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               const { from, to } = editor.state.selection;
// // //               if (from === to) {
// // //                 editor.chain().focus().insertContent('""').run();
// // //               } else {
// // //                 const selectedText = editor.state.doc.textBetween(from, to);
// // //                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
// // //               }
// // //             }}
// // //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// // //             title="Double Quotes"
// // //           >
// // //             "&thinsp;"
// // //           </button>

// // //           {editor.isActive("link") && (
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault();
// // //                 removeLink();
// // //               }}
// // //               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // //               title="Remove Link"
// // //             >
// // //               Remove Link
// // //             </button>
// // //           )}

// // //           {/* Table Controls — shown only when inside a table */}
// // //           {editor.isActive("table") && (
// // //             <>
// // //               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
// // //               {[
// // //                 {
// // //                   label: "+ Row ↑",
// // //                   action: () => editor.chain().focus().addRowBefore().run(),
// // //                 },
// // //                 {
// // //                   label: "+ Row ↓",
// // //                   action: () => editor.chain().focus().addRowAfter().run(),
// // //                 },
// // //                 {
// // //                   label: "+ Col ←",
// // //                   action: () => editor.chain().focus().addColumnBefore().run(),
// // //                 },
// // //                 {
// // //                   label: "+ Col →",
// // //                   action: () => editor.chain().focus().addColumnAfter().run(),
// // //                 },
// // //               ].map(({ label, action }) => (
// // //                 <button
// // //                   key={label}
// // //                   onMouseDown={(e) => {
// // //                     e.preventDefault();
// // //                     action();
// // //                   }}
// // //                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
// // //                 >
// // //                   {label}
// // //                 </button>
// // //               ))}
// // //               {[
// // //                 {
// // //                   label: "- Row",
// // //                   action: () => editor.chain().focus().deleteRow().run(),
// // //                 },
// // //                 {
// // //                   label: "- Col",
// // //                   action: () => editor.chain().focus().deleteColumn().run(),
// // //                 },
// // //                 {
// // //                   label: "Delete Table",
// // //                   action: () => editor.chain().focus().deleteTable().run(),
// // //                 },
// // //               ].map(({ label, action }) => (
// // //                 <button
// // //                   key={label}
// // //                   onMouseDown={(e) => {
// // //                     e.preventDefault();
// // //                     action();
// // //                   }}
// // //                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// // //                 >
// // //                   {label}
// // //                 </button>
// // //               ))}
// // //             </>
// // //           )}
// // //         </div>

// // //         <EditorContent editor={editor} />

// // //         <style>{`
// // //         .editor-wrapper .editor-content:focus {
// // //           outline: none;
// // //         }

// // //         .editor-wrapper .editor-content {
// // //           caret-color: #2563EB;
// // //           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
// // //         }

// // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // //           content: attr(data-placeholder);
// // //           float: left;
// // //           color: #adb5bd;
// // //           pointer-events: none;
// // //           height: 0;
// // //         }

// // //         .editor-wrapper .editor-content ::selection {
// // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // //           color: inherit !important;
// // //         }

// // //         .editor-wrapper mark {
// // //           padding: 0.1em 0;
// // //           border-radius: 2px;
// // //         }

// // //         .editor-wrapper .custom-link,
// // //         .editor-wrapper a {
// // //           color: #2563eb !important;
// // //           text-decoration: underline !important;
// // //           cursor: pointer !important;
// // //         }
// // //         .editor-wrapper .custom-link:hover,
// // //         .editor-wrapper a:hover {
// // //           color: #1d4ed8 !important;
// // //         }

// // //         .editor-wrapper table {
// // //           border-collapse: collapse;
// // //           width: 100%;
// // //           margin: 1rem 0;
// // //           table-layout: fixed;
// // //         }
// // //         .editor-wrapper td,
// // //         .editor-wrapper th {
// // //           border: 1px solid #d1d5db;
// // //           padding: 8px 12px;
// // //           position: relative;
// // //         }
// // //         .editor-wrapper th {
// // //           background-color: #f3f4f6;
// // //           font-weight: 600;
// // //         }
// // //         .editor-wrapper .selectedCell::after {
// // //           content: "";
// // //           position: absolute;
// // //           inset: 0;
// // //           background: rgba(59, 130, 246, 0.15);
// // //           pointer-events: none;
// // //         }

// // //         .editor-wrapper .editor-content p {
// // //           margin: 0 0 0.75rem;
// // //           line-height: 1.6;
// // //         }

// // //         .editor-wrapper .editor-content ul {
// // //           list-style-type: disc;
// // //           padding-left: 1.75rem;
// // //           margin: 0 0 0.75rem;
// // //         }
// // //         .editor-wrapper .editor-content ol {
// // //           list-style-type: decimal;
// // //           padding-left: 1.75rem;
// // //           margin: 0 0 0.75rem;
// // //         }
// // //         .editor-wrapper .editor-content li {
// // //           margin-bottom: 0.25rem;
// // //           line-height: 1.6;
// // //         }
// // //         .editor-wrapper .editor-content li p {
// // //           margin: 0;
// // //         }

// // //         .editor-wrapper .editor-content blockquote {
// // //           border-left: 4px solid #3b82f6;
// // //           padding: 0.5rem 1rem;
// // //           margin: 1rem 0;
// // //           color: #4b5563;
// // //           font-style: italic;
// // //           background-color: #f8fafc;
// // //           border-radius: 0 4px 4px 0;
// // //         }
// // //         .editor-wrapper .editor-content blockquote p {
// // //           margin: 0;
// // //         }

// // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // //         .editor-wrapper .editor-content img {
// // //           max-width: 100%;
// // //           height: auto;
// // //           border-radius: 0.5rem;
// // //           margin: 0.5rem 0;
// // //         }

// // //         .editor-wrapper .editor-content pre {
// // //           background-color: #1f2937;
// // //           color: #f3f4f6;
// // //           padding: 1rem;
// // //           border-radius: 0.5rem;
// // //           overflow-x: auto;
// // //           font-family: monospace;
// // //           font-size: 0.875rem;
// // //           margin: 1rem 0;
// // //         }
// // //         .editor-wrapper .editor-content code:not(pre code) {
// // //           background-color: #f3f4f6;
// // //           padding: 0.125rem 0.3rem;
// // //           border-radius: 0.25rem;
// // //           font-family: monospace;
// // //           font-size: 0.875rem;
// // //           color: #dc2626;
// // //         }

// // //         .editor-wrapper .editor-content hr {
// // //           margin: 1.5rem 0;
// // //           border: none;
// // //           border-top: 2px solid #e5e7eb;
// // //         }
// // //       `}</style>
// // //       </div>
// // //     );
// // //   },
// // // );

// // // CustomEditor.displayName = "CustomEditor";

// // // export default CustomEditor;

// // import { memo, useEffect, useState } from "react";

// // // =========================
// // // Tiptap Core
// // // =========================
// // import { useEditor, EditorContent, Extension } from "@tiptap/react";
// // import StarterKit from "@tiptap/starter-kit";

// // // =========================
// // // Tiptap Extensions
// // // =========================
// // import { Table } from "@tiptap/extension-table";
// // import { TableRow } from "@tiptap/extension-table-row";
// // import { TableCell } from "@tiptap/extension-table-cell";
// // import { TableHeader } from "@tiptap/extension-table-header";

// // import Image from "@tiptap/extension-image";
// // import Link from "@tiptap/extension-link";
// // import Placeholder from "@tiptap/extension-placeholder";
// // import Underline from "@tiptap/extension-underline";
// // import TextAlign from "@tiptap/extension-text-align";
// // import Highlight from "@tiptap/extension-highlight";

// // import { TextStyle } from "@tiptap/extension-text-style";
// // import { Color } from "@tiptap/extension-color";

// // import FontFamily from "@tiptap/extension-font-family";
// // import HorizontalRule from "@tiptap/extension-horizontal-rule";

// // import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // // =========================
// // // Lowlight + Highlight.js
// // // =========================
// // import { createLowlight } from "lowlight";
// // import javascript from "highlight.js/lib/languages/javascript";
// // import xml from "highlight.js/lib/languages/xml";
// // import css from "highlight.js/lib/languages/css";
// // import json from "highlight.js/lib/languages/json";
// // import typescript from "highlight.js/lib/languages/typescript";
// // import bash from "highlight.js/lib/languages/bash";
// // import "highlight.js/styles/github-dark.css";

// // const lowlight = createLowlight();
// // lowlight.register("javascript", javascript);
// // lowlight.register("js", javascript);
// // lowlight.register("html", xml);
// // lowlight.register("xml", xml);
// // lowlight.register("css", css);
// // lowlight.register("json", json);
// // lowlight.register("typescript", typescript);
// // lowlight.register("ts", typescript);
// // lowlight.register("bash", bash);
// // lowlight.register("shell", bash);

// // // =========================
// // // FIX 1: Custom FontSize Extension
// // // =========================
// // const FontSize = Extension.create({
// //   name: "fontSize",
// //   addOptions() {
// //     return { types: ["textStyle"] };
// //   },
// //   addGlobalAttributes() {
// //     return [
// //       {
// //         types: this.options.types,
// //         attributes: {
// //           fontSize: {
// //             default: null,
// //             parseHTML: (element) => element.style.fontSize || null,
// //             renderHTML: (attributes) => {
// //               if (!attributes.fontSize) return {};
// //               return { style: `font-size: ${attributes.fontSize}` };
// //             },
// //           },
// //         },
// //       },
// //     ];
// //   },
// //   addCommands() {
// //     return {
// //       setFontSize:
// //         (fontSize) =>
// //         ({ chain }) => {
// //           return chain().setMark("textStyle", { fontSize }).run();
// //         },
// //       unsetFontSize:
// //         () =>
// //         ({ chain }) => {
// //           return chain()
// //             .setMark("textStyle", { fontSize: null })
// //             .removeEmptyTextStyle()
// //             .run();
// //         },
// //     };
// //   },
// // });

// // const BackgroundColor = Extension.create({
// //   name: "backgroundColor",
// //   addOptions() {
// //     return { types: ["paragraph", "heading"] };
// //   },
// //   addGlobalAttributes() {
// //     return [
// //       {
// //         types: this.options.types,
// //         attributes: {
// //           backgroundColor: {
// //             default: null,
// //             parseHTML: (element) =>
// //               element.style.backgroundColor || element.style.background || null,
// //             renderHTML: (attributes) => {
// //               if (!attributes.backgroundColor) return {};
// //               return {
// //                 style: `background-color: ${attributes.backgroundColor}`,
// //               };
// //             },
// //           },
// //         },
// //       },
// //     ];
// //   },
// // });

// // // ADD: Custom BorderBottom Extension for underlines
// // const BorderBottom = Extension.create({
// //   name: "borderBottom",
// //   addOptions() {
// //     return { types: ["paragraph", "heading"] };
// //   },
// //   addGlobalAttributes() {
// //     return [
// //       {
// //         types: this.options.types,
// //         attributes: {
// //           borderBottom: {
// //             default: null,
// //             parseHTML: (element) => {
// //               const style = element.getAttribute("style") || "";
// //               const match = style.match(/border-bottom:\s*([^;]+)/i);
// //               return match ? match[1].trim() : null;
// //             },
// //             renderHTML: (attributes) => {
// //               if (!attributes.borderBottom) return {};
// //               return {
// //                 style: `border-bottom: ${attributes.borderBottom}`,
// //               };
// //             },
// //           },
// //         },
// //       },
// //     ];
// //   },
// // });

// // // =========================
// // // React Icons
// // // =========================
// // import {
// //   FiBold,
// //   FiItalic,
// //   FiUnderline,
// //   FiList,
// //   FiAlignLeft,
// //   FiAlignCenter,
// //   FiAlignRight,
// //   FiImage,
// //   FiCode,
// //   FiMinus,
// //   FiLink as FiLinkIcon,
// // } from "react-icons/fi";
// // import {
// //   MdFormatColorText,
// //   MdFormatColorFill,
// //   MdFormatQuote,
// //   MdFormatClear,
// // } from "react-icons/md";

// // const COLORS = [
// //   "#000000",
// //   "#DC2626",
// //   "#059669",
// //   "#2563EB",
// //   "#D97706",
// //   "#7C3AED",
// //   "#DB2777",
// //   "#4B5563",
// //   "#FFFFFF",
// //   "#FCD34D",
// //   "#F97316",
// //   "#EC4899",
// //   "#06B6D4",
// //   "#84CC16",
// //   "#8B5CF6",
// // ];

// // const HIGHLIGHT_COLORS = [
// //   { color: "#FEF08A", label: "Yellow" },
// //   { color: "#86EFAC", label: "Green" },
// //   { color: "#FDA4AF", label: "Pink" },
// //   { color: "#93C5FD", label: "Blue" },
// //   { color: "#FED7AA", label: "Orange" },
// //   { color: "#E9D5FF", label: "Purple" },
// // ];

// // // ============================================================
// // // PASTE CLEANER - IMPROVED
// // // Strips Word/Google-Docs layout junk before Tiptap parses it:
// // //  - nested "layout" tables (tables used only for spacing/positioning)
// // //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// // //  - empty spacing paragraphs (&nbsp; / <br><br>)
// // //  - inline width/style junk on any table that survives
// // //  - PRESERVES: borders (underlines), text-align, background-color
// // // ============================================================
// // function cleanPastedHTML(html) {
// //   const doc = new DOMParser().parseFromString(html, "text/html");

// //   doc.querySelectorAll("*").forEach((el) => {
// //     const style = el.getAttribute("style") || "";

// //     if (
// //       style.includes("border-bottom") ||
// //       style.includes("mso-border-bottom")
// //     ) {
// //       console.log("FOUND BORDER:", el.tagName, style);
// //     }
// //   });

// //   // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
// //   doc.querySelectorAll("[align]").forEach((el) => {
// //     const alignVal = el.getAttribute("align");
// //     if (alignVal) {
// //       const existing = el.getAttribute("style") || "";
// //       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
// //       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
// //     }
// //     el.removeAttribute("align");
// //   });

// //   // 1) Repeatedly unwrap tables whose cells have no real tabular data
// //   let guard = 0;
// //   let changed = true;
// //   while (changed && guard < 15) {
// //     changed = false;
// //     guard++;
// //     const tables = Array.from(doc.querySelectorAll("table"));
// //     tables.forEach((table) => {
// //       const rows = table.querySelectorAll("tr");
// //       const cells = table.querySelectorAll("td, th");
// //       const maxCellsInARow = Math.max(
// //         0,
// //         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
// //       );
// //       // const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

// //       // Step 1 ke andar, isLayoutTable calculation ko replace karo:
// //       const hasRowspan = table.querySelector("[rowspan]") !== null;
// //       const hasColspan = table.querySelector("[colspan]") !== null;
// //       const hasMultipleColumns = maxCellsInARow > 1;
// //       const hasMultipleRows = rows.length > 1;

// //       const isLayoutTable =
// //         !hasRowspan && !hasColspan && !(hasMultipleRows && hasMultipleColumns);

// //       if (isLayoutTable && cells.length > 0) {
// //         const fragment = doc.createDocumentFragment();

// //         cells.forEach((cell) => {
// //           const cellStyle = cell.getAttribute("style") || "";

// //           // Background color preserve
// //           const bgMatch = cellStyle.match(
// //             /background(?:-color)?\s*:\s*([^;]+)/i,
// //           );
// //           const bgColor = bgMatch ? bgMatch[1].trim() : null;

// //           // IMPORTANT: preserve border-bottom specifically
// //           const borderBottomMatch = cellStyle.match(
// //             /border-bottom\s*:\s*([^;]+)/i,
// //           );

// //           const borderBottom = borderBottomMatch
// //             ? borderBottomMatch[1].trim()
// //             : null;

// //           Array.from(cell.childNodes).forEach((node) => {
// //             if (node.nodeType === 1) {
// //               const existing = node.getAttribute("style") || "";
// //               const styles = [];

// //               if (existing.trim()) {
// //                 styles.push(existing.trim().replace(/;$/, ""));
// //               }

// //               if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
// //                 styles.push(`background-color:${bgColor}`);
// //               }

// //               if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
// //                 styles.push(`border-bottom:${borderBottom}`);
// //               }

// //               node.setAttribute(
// //                 "style",
// //                 styles.join("; ") + (styles.length ? ";" : ""),
// //               );

// //               console.log(
// //                 "MOVING STYLE:",
// //                 node.tagName,
// //                 node.getAttribute("style"),
// //               );
// //             }

// //             fragment.appendChild(node);
// //           });
// //         });

// //         table.replaceWith(fragment);
// //         changed = true;
// //       }
// //     });
// //   }

// //   // 2) Split paragraphs where a numbering span like "3." / "4." sits
// //   //    in the MIDDLE of a <p> instead of at the start
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const spans = Array.from(p.querySelectorAll("span"));
// //     const numberSpans = spans.filter((s) =>
// //       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
// //     );

// //     if (numberSpans.length > 1) {
// //       const parent = p.parentNode;
// //       let current = doc.createElement("p");
// //       Array.from(p.attributes).forEach((attr) =>
// //         current.setAttribute(attr.name, attr.value),
// //       );
// //       const splitMarkers = new Set(numberSpans.slice(1));
// //       const newParagraphs = [current];

// //       Array.from(p.childNodes).forEach((node) => {
// //         if (splitMarkers.has(node)) {
// //           current = doc.createElement("p");
// //           Array.from(p.attributes).forEach((attr) =>
// //             current.setAttribute(attr.name, attr.value),
// //           );
// //           newParagraphs.push(current);
// //         }
// //         current.appendChild(node);
// //       });

// //       newParagraphs.forEach((np) => parent.insertBefore(np, p));
// //       parent.removeChild(p);
// //     }
// //   });

// //   // 2b) FIX: If a paragraph ends with text like "able to:" followed by
// //   //    a numbered list item "1. Identify...", split them into separate paragraphs
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const textContent = p.textContent.trim();
// //     // Check if this paragraph has both "able to:" pattern and number pattern
// //     if (textContent.match(/able\s+to:\s*\d+\./i)) {
// //       const parent = p.parentNode;
// //       const parts = [];

// //       // Split by number pattern like "1. " "2. " etc
// //       const nodes = Array.from(p.childNodes);
// //       let currentPara = doc.createElement("p");
// //       Array.from(p.attributes).forEach((attr) =>
// //         currentPara.setAttribute(attr.name, attr.value),
// //       );

// //       nodes.forEach((node) => {
// //         const isNumberNode =
// //           node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

// //         if (isNumberNode) {
// //           // Found a number span - this should start a new paragraph
// //           if (currentPara.childNodes.length > 0) {
// //             parts.push(currentPara);
// //           }
// //           currentPara = doc.createElement("p");
// //           Array.from(p.attributes).forEach((attr) =>
// //             currentPara.setAttribute(attr.name, attr.value),
// //           );
// //         }
// //         currentPara.appendChild(node);
// //       });

// //       if (currentPara.childNodes.length > 0) {
// //         parts.push(currentPara);
// //       }

// //       if (parts.length > 1) {
// //         parts.forEach((part) => parent.insertBefore(part, p));
// //         parent.removeChild(p);
// //       }
// //     }
// //   });

// //   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
// //   doc.querySelectorAll("span").forEach((span) => {
// //     const t = span.textContent.trim();
// //     if (/^\d{1,2}[.)]$/.test(t)) {
// //       const textNode = doc.createTextNode(`${t} `);
// //       span.replaceWith(textNode);
// //     }
// //   });

// //   // 4) Remove empty spacing paragraphs
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const hasMedia = p.querySelector("img, table");
// //     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
// //     if (isEmptyText && !hasMedia) {
// //       p.remove();
// //     }
// //   });

// //   // 4b) Collapse leftover Word tab-stop runs of &nbsp;
// //   doc.querySelectorAll("span").forEach((span) => {
// //     const raw = span.textContent;
// //     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
// //       span.replaceWith(doc.createTextNode(" "));
// //     }
// //   });

// //   // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
// //   //    for underlines and keep text-align and background-color
// //   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
// //     el.removeAttribute("width");
// //     if (
// //       el.tagName === "TABLE" ||
// //       el.tagName === "COLGROUP" ||
// //       el.tagName === "COL"
// //     ) {
// //       el.removeAttribute("style");
// //     }
// //   });

// //   // 5b) IMPORTANT: Clean up inline styles on paragraphs but PRESERVE
// //   //     text-align, background-color, and border-bottom
// //   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
// //     const style = el.getAttribute("style") || "";
// //     const preserved = [];

// //     // Extract styles we want to keep
// //     const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
// //     if (textAlignMatch) {
// //       preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
// //     }

// //     const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
// //     if (bgColorMatch) {
// //       preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
// //     }

// //     const borderMatch = style.match(
// //       /(border(?:-bottom|-top|-left|-right)?)\s*:\s*([^;]+)/i,
// //     );
// //     if (borderMatch) {
// //       preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
// //     }

// //     const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
// //     if (colorMatch) {
// //       preserved.push(`color: ${colorMatch[1].trim()}`);
// //     }

// //     const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
// //     if (fontSizeMatch) {
// //       preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
// //     }

// //     const borderBottom = style.match(/border-bottom\s*:\s*([^;]+)/i);

// //     if (borderBottom) {
// //       preserved.push(`border-bottom:${borderBottom[1].trim()}`);
// //     }
// //   });

// //   // ==================================================
// //   // FIX: Word Symbol bullets (·)
// //   // Convert to separate lines, NOT <ul>
// //   // ==================================================
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const text = p.textContent || "";

// //     const bulletCount = (text.match(/·/g) || []).length;

// //     if (bulletCount >= 2) {
// //       const parts = text
// //         .split("·")
// //         .map((x) => x.trim())
// //         .filter(Boolean);

// //       if (parts.length > 1) {
// //         const fragment = doc.createDocumentFragment();

// //         const intro = doc.createElement("p");
// //         intro.textContent = parts.shift();
// //         fragment.appendChild(intro);

// //         parts.forEach((item) => {
// //           const bulletLine = doc.createElement("p");
// //           bulletLine.textContent = `• ${item}`;
// //           fragment.appendChild(bulletLine);
// //         });

// //         p.replaceWith(fragment);
// //       }
// //     }
// //   });

// //   // ============================================
// //   // FIX WORD TABLE BULLETS
// //   // ============================================
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const next = p.nextElementSibling;

// //     if (!next) return;

// //     const bulletText = p.textContent.replace(/\s/g, "");

// //     const onlyBullets = bulletText && /^([·•])+$/u.test(bulletText);

// //     if (!onlyBullets) return;

// //     const lines = next.innerHTML
// //       .split(/<br\s*\/?>/i)
// //       .map((x) => x.trim())
// //       .filter(Boolean);

// //     if (!lines.length) return;

// //     const fragment = doc.createDocumentFragment();

// //     lines.forEach((line) => {
// //       const bulletLine = doc.createElement("p");
// //       bulletLine.innerHTML = `• ${line}`;
// //       fragment.appendChild(bulletLine);
// //     });

// //     p.replaceWith(fragment);
// //     next.remove();
// //   });

// //   console.log(
// //     "FINAL BORDER COUNT:",
// //     (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
// //   );

// //   return doc.body.innerHTML;
// // }

// // const CustomEditor = memo(
// //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// //     const [showColorPicker, setShowColorPicker] = useState(false);
// //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// //     const [showHighlighter, setShowHighlighter] = useState(false);

// //     const editor = useEditor({
// //       extensions: [
// //         StarterKit.configure({
// //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// //           codeBlock: false,
// //           blockquote: true,
// //           orderedList: {
// //             keepMarks: true,
// //             keepAttributes: true,
// //           },
// //           bulletList: {
// //             keepMarks: true,
// //             keepAttributes: true,
// //           },
// //           underline: false,
// //           link: false,
// //           horizontalRule: false,
// //         }),
// //         Underline,
// //         TextAlign.configure({
// //           types: ["heading", "paragraph"],
// //           alignments: ["left", "center", "right", "justify"],
// //         }),
// //         Highlight.configure({ multicolor: true }),
// //         TextStyle,
// //         Color,
// //         FontFamily,
// //         FontSize,
// //         BackgroundColor,
// //         BorderBottom, // ADD: For underlines
// //         Link.configure({
// //           openOnClick: false,
// //           linkOnPaste: true,
// //           autolink: true,
// //           HTMLAttributes: {
// //             class: "custom-link",
// //             rel: "noopener noreferrer",
// //             target: "_blank",
// //           },
// //         }),
// //         Image.configure({
// //           inline: true,
// //           allowBase64: true,
// //         }),
// //         Placeholder.configure({
// //           placeholder: placeholder || "Write something...",
// //         }),
// //         Table.configure({ resizable: true }),
// //         TableRow,
// //         TableCell,
// //         TableHeader,
// //         HorizontalRule,
// //         CodeBlockLowlight.configure({ lowlight }),
// //       ],
// //       content: value || "",
// //       onUpdate: ({ editor }) => {
// //         onChange(editor.getHTML());
// //         console.log("===== TIPTAP HTML (after edit) =====");
// //         console.log(editor.getHTML());
// //       },
// //       editorProps: {
// //         attributes: {
// //           class: "editor-content",
// //           style: `min-height: ${minHeight}; padding: 1rem;`,
// //         },
// //         transformPastedHTML(html) {
// //           console.log("===== RAW HTML =====");

// //           console.log("RAW border-bottom:", html.includes("border-bottom"));

// //           console.log(
// //             "RAW mso-border-bottom:",
// //             html.includes("mso-border-bottom"),
// //           );

// //           console.log("RAW table:", html.includes("<table"));

// //           const cleaned = cleanPastedHTML(html);

// //           // TEMP DEBUG - cleaned HTML dekho
// //           console.log("FULL CLEANED HTML:", cleaned);

// //           console.log("===== CLEANED HTML =====");

// //           console.log(
// //             "CLEANED border-bottom:",
// //             cleaned.includes("border-bottom"),
// //           );

// //           console.log(
// //             "CLEANED mso-border-bottom:",
// //             cleaned.includes("mso-border-bottom"),
// //           );

// //           console.log("CLEANED table:", cleaned.includes("<table"));

// //           return cleaned;
// //         },
// //       },
// //     });

// //     // Sync external value changes
// //     useEffect(() => {
// //       if (editor && value !== editor.getHTML()) {
// //         editor.commands.setContent(value || "", false);
// //       }
// //     }, [editor, value]);

// //     // Close pickers on outside click
// //     useEffect(() => {
// //       const handler = (e) => {
// //         if (!e.target.closest(".color-picker-wrapper")) {
// //           setShowColorPicker(false);
// //           setShowBgColorPicker(false);
// //           setShowHighlighter(false);
// //         }
// //       };
// //       document.addEventListener("mousedown", handler);
// //       return () => document.removeEventListener("mousedown", handler);
// //     }, []);

// //     if (!editor) {
// //       return (
// //         <div
// //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// //           style={{ minHeight }}
// //         >
// //           <div className="text-gray-400">Loading editor...</div>
// //         </div>
// //       );
// //     }

// //     const addTable = () => {
// //       const rows = prompt("Number of rows:", "3");
// //       const cols = prompt("Number of columns:", "3");
// //       if (rows && cols) {
// //         editor
// //           .chain()
// //           .focus()
// //           .insertTable({
// //             rows: parseInt(rows),
// //             cols: parseInt(cols),
// //             withHeaderRow: true,
// //           })
// //           .run();
// //       }
// //     };

// //     const addImage = () => {
// //       const url = prompt("Enter image URL:");
// //       if (url) editor.chain().focus().setImage({ src: url }).run();
// //     };

// //     const openLinkDialog = () => {
// //       const url = window.prompt("Enter link URL:");
// //       if (!url) return;
// //       const href = url.startsWith("http") ? url : `https://${url}`;
// //       const { from, to } = editor.state.selection;
// //       if (from === to) {
// //         editor
// //           .chain()
// //           .focus()
// //           .insertContent(`<a href="${href}">${href}</a>`)
// //           .run();
// //       } else {
// //         editor.chain().focus().setLink({ href }).run();
// //       }
// //     };

// //     const removeLink = () => {
// //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// //     };

// //     const setFontSize = (size) => {
// //       if (size === "default") {
// //         editor.chain().focus().unsetFontSize().run();
// //       } else {
// //         editor.chain().focus().setFontSize(size).run();
// //       }
// //     };

// //     const handleSetTextColor = (color) => {
// //       editor.chain().focus().setColor(color).run();
// //       setShowColorPicker(false);
// //     };

// //     const handleUnsetTextColor = () => {
// //       editor.chain().focus().unsetColor().run();
// //       setShowColorPicker(false);
// //     };

// //     const handleSetHighlight = (color) => {
// //       editor.chain().focus().setHighlight({ color }).run();
// //       setShowBgColorPicker(false);
// //     };

// //     const handleUnsetHighlight = () => {
// //       editor.chain().focus().unsetHighlight().run();
// //       setShowBgColorPicker(false);
// //     };

// //     const clearFormatting = () => {
// //       editor.chain().focus().clearNodes().unsetAllMarks().run();
// //     };

// //     const currentHeading = (() => {
// //       for (let i = 1; i <= 4; i++) {
// //         if (editor.isActive("heading", { level: i })) return String(i);
// //       }
// //       return "paragraph";
// //     })();

// //     return (
// //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
// //         {/* ── Toolbar ── */}
// //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// //           {/* Font Family */}
// //           <select
// //             onChange={(e) => {
// //               const font = e.target.value;
// //               if (font === "default")
// //                 editor.chain().focus().unsetFontFamily().run();
// //               else editor.chain().focus().setFontFamily(font).run();
// //             }}
// //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// //           >
// //             <option value="default">Font Family</option>
// //             <option value="Arial">Arial</option>
// //             <option value="Georgia">Georgia</option>
// //             <option value="Times New Roman">Times New Roman</option>
// //             <option value="Courier New">Courier New</option>
// //             <option value="Verdana">Verdana</option>
// //           </select>

// //           {/* Font Size */}
// //           <select
// //             onChange={(e) => setFontSize(e.target.value)}
// //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// //             defaultValue="default"
// //           >
// //             <option value="default">Font Size</option>
// //             <option value="12px">12px</option>
// //             <option value="14px">14px</option>
// //             <option value="16px">16px</option>
// //             <option value="18px">18px</option>
// //             <option value="20px">20px</option>
// //             <option value="24px">24px</option>
// //             <option value="28px">28px</option>
// //             <option value="32px">32px</option>
// //           </select>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Text Color */}
// //           <div className="relative color-picker-wrapper">
// //             <button
// //               type="button"
// //               onMouseDown={(e) => {
// //                 e.preventDefault();
// //                 setShowColorPicker((v) => !v);
// //                 setShowBgColorPicker(false);
// //                 setShowHighlighter(false);
// //               }}
// //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// //               title="Text Color"
// //             >
// //               <MdFormatColorText size={18} />
// //               <span
// //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// //                 style={{
// //                   backgroundColor:
// //                     editor.getAttributes("textStyle").color || "transparent",
// //                 }}
// //               />
// //             </button>
// //             {showColorPicker && (
// //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// //                 <button
// //                   onMouseDown={(e) => {
// //                     e.preventDefault();
// //                     handleUnsetTextColor();
// //                   }}
// //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// //                 >
// //                   Remove Color
// //                 </button>
// //                 {COLORS.map((color) => (
// //                   <button
// //                     key={color}
// //                     onMouseDown={(e) => {
// //                       e.preventDefault();
// //                       handleSetTextColor(color);
// //                     }}
// //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// //                     style={{
// //                       backgroundColor: color,
// //                       border:
// //                         color === "#FFFFFF"
// //                           ? "1px solid #ddd"
// //                           : "1px solid transparent",
// //                       outline:
// //                         editor.getAttributes("textStyle").color === color
// //                           ? "2px solid #2563eb"
// //                           : "none",
// //                       outlineOffset: "2px",
// //                     }}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Background (Highlight) Color */}
// //           <div className="relative color-picker-wrapper">
// //             <button
// //               type="button"
// //               onMouseDown={(e) => {
// //                 e.preventDefault();
// //                 setShowBgColorPicker((v) => !v);
// //                 setShowColorPicker(false);
// //                 setShowHighlighter(false);
// //               }}
// //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
// //               title="Background Color"
// //             >
// //               <MdFormatColorFill size={18} />
// //               <span
// //                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
// //                 style={{
// //                   backgroundColor:
// //                     editor.getAttributes("highlight").color || "transparent",
// //                 }}
// //               />
// //             </button>
// //             {showBgColorPicker && (
// //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
// //                 <button
// //                   onMouseDown={(e) => {
// //                     e.preventDefault();
// //                     handleUnsetHighlight();
// //                   }}
// //                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
// //                 >
// //                   Remove Background
// //                 </button>
// //                 {COLORS.map((color) => (
// //                   <button
// //                     key={color}
// //                     onMouseDown={(e) => {
// //                       e.preventDefault();
// //                       handleSetHighlight(color);
// //                     }}
// //                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
// //                     style={{
// //                       backgroundColor: color,
// //                       border:
// //                         color === "#FFFFFF"
// //                           ? "1px solid #ddd"
// //                           : "1px solid transparent",
// //                     }}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Highlighter Pen */}
// //           <div className="relative color-picker-wrapper">
// //             <button
// //               type="button"
// //               onMouseDown={(e) => {
// //                 e.preventDefault();
// //                 setShowHighlighter((v) => !v);
// //                 setShowColorPicker(false);
// //                 setShowBgColorPicker(false);
// //               }}
// //               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
// //               style={
// //                 editor.isActive("highlight")
// //                   ? {
// //                       backgroundColor:
// //                         editor.getAttributes("highlight").color || "#FEF08A",
// //                       color: "#000",
// //                     }
// //                   : {}
// //               }
// //               title="Highlighter"
// //             >
// //               <svg
// //                 width="16"
// //                 height="16"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               >
// //                 <path d="M12 20h9" />
// //                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
// //               </svg>
// //             </button>
// //             {showHighlighter && (
// //               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
// //                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
// //                   Highlight Color
// //                 </span>
// //                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
// //                   <button
// //                     key={color}
// //                     onMouseDown={(e) => {
// //                       e.preventDefault();
// //                       editor.chain().focus().setHighlight({ color }).run();
// //                       setShowHighlighter(false);
// //                     }}
// //                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
// //                   >
// //                     <span
// //                       className="w-5 h-5 rounded-sm border flex-shrink-0"
// //                       style={{
// //                         backgroundColor: color,
// //                         borderColor:
// //                           editor.getAttributes("highlight").color === color
// //                             ? "#2563eb"
// //                             : "#e5e7eb",
// //                         outline:
// //                           editor.getAttributes("highlight").color === color
// //                             ? "2px solid #2563eb"
// //                             : "none",
// //                         outlineOffset: "2px",
// //                       }}
// //                     />
// //                     {label}
// //                   </button>
// //                 ))}
// //                 <button
// //                   onMouseDown={(e) => {
// //                     e.preventDefault();
// //                     editor.chain().focus().unsetHighlight().run();
// //                     setShowHighlighter(false);
// //                   }}
// //                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
// //                 >
// //                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
// //                   Remove
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Bold */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleBold().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Bold"
// //           >
// //             <FiBold size={16} />
// //           </button>

// //           {/* Italic */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleItalic().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Italic"
// //           >
// //             <FiItalic size={16} />
// //           </button>

// //           {/* Underline */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleUnderline().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Underline"
// //           >
// //             <FiUnderline size={16} />
// //           </button>

// //           {/* Clear Formatting */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               clearFormatting();
// //             }}
// //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// //             title="Clear Formatting"
// //           >
// //             <MdFormatClear size={16} />
// //           </button>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Heading Select */}
// //           <select
// //             onChange={(e) => {
// //               const val = e.target.value;
// //               if (val === "paragraph")
// //                 editor.chain().focus().setParagraph().run();
// //               else
// //                 editor
// //                   .chain()
// //                   .focus()
// //                   .toggleHeading({ level: parseInt(val) })
// //                   .run();
// //             }}
// //             value={currentHeading}
// //             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
// //           >
// //             <option value="paragraph">Normal</option>
// //             <option value="1">Heading 1</option>
// //             <option value="2">Heading 2</option>
// //             <option value="3">Heading 3</option>
// //             <option value="4">Heading 4</option>
// //           </select>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Align Left */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().setTextAlign("left").run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //           >
// //             <FiAlignLeft size={16} />
// //           </button>
// //           {/* Align Center */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().setTextAlign("center").run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //           >
// //             <FiAlignCenter size={16} />
// //           </button>
// //           {/* Align Right */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().setTextAlign("right").run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //           >
// //             <FiAlignRight size={16} />
// //           </button>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Bullet List */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleBulletList().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Bullet List"
// //           >
// //             <FiList size={16} />
// //           </button>

// //           {/* Ordered List */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleOrderedList().run();
// //             }}
// //             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Numbered List"
// //           >
// //             1.
// //           </button>

// //           {/* Blockquote */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleBlockquote().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Blockquote"
// //           >
// //             <MdFormatQuote size={16} />
// //           </button>

// //           {/* Code Block */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().toggleCodeBlock().run();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Code Block"
// //           >
// //             <FiCode size={16} />
// //           </button>

// //           {/* Horizontal Rule */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               editor.chain().focus().setHorizontalRule().run();
// //             }}
// //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// //             title="Horizontal Rule"
// //           >
// //             <FiMinus size={16} />
// //           </button>

// //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// //           {/* Table */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               addTable();
// //             }}
// //             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
// //             title="Insert Table"
// //           >
// //             <div className="grid grid-cols-2 gap-[2px]">
// //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// //             </div>
// //             <span className="text-sm font-medium">Table</span>
// //           </button>

// //           {/* Image */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               addImage();
// //             }}
// //             className="p-2 rounded hover:bg-gray-200 text-gray-700"
// //             title="Insert Image"
// //           >
// //             <FiImage size={16} />
// //           </button>

// //           {/* Link button */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               openLinkDialog();
// //             }}
// //             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
// //             title="Insert Link"
// //           >
// //             <FiLinkIcon size={16} />
// //           </button>

// //           {/* Single Quote */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               const { from, to } = editor.state.selection;
// //               if (from === to) {
// //                 editor.chain().focus().insertContent("''").run();
// //               } else {
// //                 const selectedText = editor.state.doc.textBetween(from, to);
// //                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
// //               }
// //             }}
// //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// //             title="Single Quotes"
// //           >
// //             '&thinsp;'
// //           </button>

// //           {/* Double Quote */}
// //           <button
// //             type="button"
// //             onMouseDown={(e) => {
// //               e.preventDefault();
// //               const { from, to } = editor.state.selection;
// //               if (from === to) {
// //                 editor.chain().focus().insertContent('""').run();
// //               } else {
// //                 const selectedText = editor.state.doc.textBetween(from, to);
// //                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
// //               }
// //             }}
// //             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
// //             title="Double Quotes"
// //           >
// //             "&thinsp;"
// //           </button>

// //           {editor.isActive("link") && (
// //             <button
// //               type="button"
// //               onMouseDown={(e) => {
// //                 e.preventDefault();
// //                 removeLink();
// //               }}
// //               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// //               title="Remove Link"
// //             >
// //               Remove Link
// //             </button>
// //           )}

// //           {/* Table Controls — shown only when inside a table */}
// //           {editor.isActive("table") && (
// //             <>
// //               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
// //               {[
// //                 {
// //                   label: "+ Row ↑",
// //                   action: () => editor.chain().focus().addRowBefore().run(),
// //                 },
// //                 {
// //                   label: "+ Row ↓",
// //                   action: () => editor.chain().focus().addRowAfter().run(),
// //                 },
// //                 {
// //                   label: "+ Col ←",
// //                   action: () => editor.chain().focus().addColumnBefore().run(),
// //                 },
// //                 {
// //                   label: "+ Col →",
// //                   action: () => editor.chain().focus().addColumnAfter().run(),
// //                 },
// //               ].map(({ label, action }) => (
// //                 <button
// //                   key={label}
// //                   onMouseDown={(e) => {
// //                     e.preventDefault();
// //                     action();
// //                   }}
// //                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
// //                 >
// //                   {label}
// //                 </button>
// //               ))}
// //               {[
// //                 {
// //                   label: "- Row",
// //                   action: () => editor.chain().focus().deleteRow().run(),
// //                 },
// //                 {
// //                   label: "- Col",
// //                   action: () => editor.chain().focus().deleteColumn().run(),
// //                 },
// //                 {
// //                   label: "Delete Table",
// //                   action: () => editor.chain().focus().deleteTable().run(),
// //                 },
// //               ].map(({ label, action }) => (
// //                 <button
// //                   key={label}
// //                   onMouseDown={(e) => {
// //                     e.preventDefault();
// //                     action();
// //                   }}
// //                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
// //                 >
// //                   {label}
// //                 </button>
// //               ))}
// //             </>
// //           )}
// //         </div>

// //         <EditorContent editor={editor} />

// //         <style>{`
// //         .editor-wrapper .editor-content:focus {
// //           outline: none;
// //         }

// //         .editor-wrapper .editor-content {
// //           caret-color: #2563EB;
// //           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
// //         }

// //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// //           content: attr(data-placeholder);
// //           float: left;
// //           color: #adb5bd;
// //           pointer-events: none;
// //           height: 0;
// //         }

// //         .editor-wrapper .editor-content ::selection {
// //           background-color: rgba(59, 130, 246, 0.3) !important;
// //           color: inherit !important;
// //         }

// //         .editor-wrapper mark {
// //           padding: 0.1em 0;
// //           border-radius: 2px;
// //         }

// //         .editor-wrapper .custom-link,
// //         .editor-wrapper a {
// //           color: #2563eb !important;
// //           text-decoration: underline !important;
// //           cursor: pointer !important;
// //         }
// //         .editor-wrapper .custom-link:hover,
// //         .editor-wrapper a:hover {
// //           color: #1d4ed8 !important;
// //         }

// //         .editor-wrapper table {
// //           border-collapse: collapse;
// //           width: 100%;
// //           margin: 1rem 0;
// //           table-layout: fixed;
// //         }
// //         .editor-wrapper td,
// //         .editor-wrapper th {
// //           border: 1px solid #d1d5db;
// //           padding: 8px 12px;
// //           position: relative;
// //         }
// //         .editor-wrapper th {
// //           background-color: #f3f4f6;
// //           font-weight: 600;
// //         }
// //         .editor-wrapper .selectedCell::after {
// //           content: "";
// //           position: absolute;
// //           inset: 0;
// //           background: rgba(59, 130, 246, 0.15);
// //           pointer-events: none;
// //         }

// //         .editor-wrapper .editor-content p {
// //           margin: 0 0 0.75rem;
// //           line-height: 1.6;
// //         }

// //         .editor-wrapper .editor-content ul {
// //           list-style-type: disc;
// //           padding-left: 1.75rem;
// //           margin: 0 0 0.75rem;
// //         }
// //         .editor-wrapper .editor-content ol {
// //           list-style-type: decimal;
// //           padding-left: 1.75rem;
// //           margin: 0 0 0.75rem;
// //         }
// //         .editor-wrapper .editor-content li {
// //           margin-bottom: 0.25rem;
// //           line-height: 1.6;
// //         }
// //         .editor-wrapper .editor-content li p {
// //           margin: 0;
// //         }

// //         .editor-wrapper .editor-content blockquote {
// //           border-left: 4px solid #3b82f6;
// //           padding: 0.5rem 1rem;
// //           margin: 1rem 0;
// //           color: #4b5563;
// //           font-style: italic;
// //           background-color: #f8fafc;
// //           border-radius: 0 4px 4px 0;
// //         }
// //         .editor-wrapper .editor-content blockquote p {
// //           margin: 0;
// //         }

// //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// //         .editor-wrapper .editor-content img {
// //           max-width: 100%;
// //           height: auto;
// //           border-radius: 0.5rem;
// //           margin: 0.5rem 0;
// //         }

// //         .editor-wrapper .editor-content pre {
// //           background-color: #1f2937;
// //           color: #f3f4f6;
// //           padding: 1rem;
// //           border-radius: 0.5rem;
// //           overflow-x: auto;
// //           font-family: monospace;
// //           font-size: 0.875rem;
// //           margin: 1rem 0;
// //         }
// //         .editor-wrapper .editor-content code:not(pre code) {
// //           background-color: #f3f4f6;
// //           padding: 0.125rem 0.3rem;
// //           border-radius: 0.25rem;
// //           font-family: monospace;
// //           font-size: 0.875rem;
// //           color: #dc2626;
// //         }

// //         .editor-wrapper .editor-content hr {
// //           margin: 1.5rem 0;
// //           border: none;
// //           border-top: 2px solid #e5e7eb;
// //         }
// //       `}</style>
// //       </div>
// //     );
// //   },
// // );

// // CustomEditor.displayName = "CustomEditor";

// // export default CustomEditor;

// import { memo, useEffect, useState } from "react";

// // =========================
// // Tiptap Core
// // =========================
// import { useEditor, EditorContent, Extension } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// // =========================
// // Tiptap Extensions
// // =========================
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";

// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Highlight from "@tiptap/extension-highlight";

// import { TextStyle } from "@tiptap/extension-text-style";
// import { Color } from "@tiptap/extension-color";

// import FontFamily from "@tiptap/extension-font-family";
// import HorizontalRule from "@tiptap/extension-horizontal-rule";

// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // =========================
// // Lowlight + Highlight.js
// // =========================
// import { createLowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";
// import xml from "highlight.js/lib/languages/xml";
// import css from "highlight.js/lib/languages/css";
// import json from "highlight.js/lib/languages/json";
// import typescript from "highlight.js/lib/languages/typescript";
// import bash from "highlight.js/lib/languages/bash";
// import "highlight.js/styles/github-dark.css";

// const lowlight = createLowlight();
// lowlight.register("javascript", javascript);
// lowlight.register("js", javascript);
// lowlight.register("html", xml);
// lowlight.register("xml", xml);
// lowlight.register("css", css);
// lowlight.register("json", json);
// lowlight.register("typescript", typescript);
// lowlight.register("ts", typescript);
// lowlight.register("bash", bash);
// lowlight.register("shell", bash);

// // =========================
// // FIX 1: Custom FontSize Extension
// // =========================
// const FontSize = Extension.create({
//   name: "fontSize",
//   addOptions() {
//     return { types: ["textStyle"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           fontSize: {
//             default: null,
//             parseHTML: (element) => element.style.fontSize || null,
//             renderHTML: (attributes) => {
//               if (!attributes.fontSize) return {};
//               return { style: `font-size: ${attributes.fontSize}` };
//             },
//           },
//         },
//       },
//     ];
//   },
//   addCommands() {
//     return {
//       setFontSize:
//         (fontSize) =>
//         ({ chain }) => {
//           return chain().setMark("textStyle", { fontSize }).run();
//         },
//       unsetFontSize:
//         () =>
//         ({ chain }) => {
//           return chain()
//             .setMark("textStyle", { fontSize: null })
//             .removeEmptyTextStyle()
//             .run();
//         },
//     };
//   },
// });

// const BackgroundColor = Extension.create({
//   name: "backgroundColor",
//   addOptions() {
//     return { types: ["paragraph", "heading"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           backgroundColor: {
//             default: null,
//             parseHTML: (element) =>
//               element.style.backgroundColor || element.style.background || null,
//             renderHTML: (attributes) => {
//               if (!attributes.backgroundColor) return {};
//               return {
//                 style: `background-color: ${attributes.backgroundColor}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },
// });

// // ADD: Custom BorderBottom Extension for underlines
// const BorderBottom = Extension.create({
//   name: "borderBottom",
//   addOptions() {
//     return { types: ["paragraph", "heading"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           borderBottom: {
//             default: null,
//             parseHTML: (element) => {
//               const style = element.getAttribute("style") || "";
//               const match = style.match(/border-bottom:\s*([^;]+)/i);
//               return match ? match[1].trim() : null;
//             },
//             renderHTML: (attributes) => {
//               if (!attributes.borderBottom) return {};
//               return {
//                 style: `border-bottom: ${attributes.borderBottom}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },
// });

// // =========================
// // React Icons
// // =========================
// import {
//   FiBold,
//   FiItalic,
//   FiUnderline,
//   FiList,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
//   FiImage,
//   FiCode,
//   FiMinus,
//   FiLink as FiLinkIcon,
// } from "react-icons/fi";
// import {
//   MdFormatColorText,
//   MdFormatColorFill,
//   MdFormatQuote,
//   MdFormatClear,
// } from "react-icons/md";

// const COLORS = [
//   "#000000",
//   "#DC2626",
//   "#059669",
//   "#2563EB",
//   "#D97706",
//   "#7C3AED",
//   "#DB2777",
//   "#4B5563",
//   "#FFFFFF",
//   "#FCD34D",
//   "#F97316",
//   "#EC4899",
//   "#06B6D4",
//   "#84CC16",
//   "#8B5CF6",
// ];

// const HIGHLIGHT_COLORS = [
//   { color: "#FEF08A", label: "Yellow" },
//   { color: "#86EFAC", label: "Green" },
//   { color: "#FDA4AF", label: "Pink" },
//   { color: "#93C5FD", label: "Blue" },
//   { color: "#FED7AA", label: "Orange" },
//   { color: "#E9D5FF", label: "Purple" },
// ];

// // ============================================================
// // PASTE CLEANER - IMPROVED
// // Strips Word/Google-Docs layout junk before Tiptap parses it:
// //  - nested "layout" tables (tables used only for spacing/positioning)
// //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// //  - empty spacing paragraphs (&nbsp; / <br><br>)
// //  - inline width/style junk on any table that survives
// //  - PRESERVES: borders (underlines), text-align, background-color
// // ============================================================
// function cleanPastedHTML(html) {
//   const doc = new DOMParser().parseFromString(html, "text/html");

//   doc.querySelectorAll("*").forEach((el) => {
//     const style = el.getAttribute("style") || "";

//     if (
//       style.includes("border-bottom") ||
//       style.includes("mso-border-bottom")
//     ) {
//       console.log("FOUND BORDER:", el.tagName, style);
//     }
//   });

//   // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
//   doc.querySelectorAll("[align]").forEach((el) => {
//     const alignVal = el.getAttribute("align");
//     if (alignVal) {
//       const existing = el.getAttribute("style") || "";
//       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
//       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
//     }
//     el.removeAttribute("align");
//   });

//   // 1) Repeatedly unwrap tables whose cells have no real tabular data
//   let guard = 0;
//   let changed = true;
//   while (changed && guard < 15) {
//     changed = false;
//     guard++;
//     const tables = Array.from(doc.querySelectorAll("table"));
//     tables.forEach((table) => {
//       const rows = table.querySelectorAll("tr");
//       const cells = table.querySelectorAll("td, th");
//       const maxCellsInARow = Math.max(
//         0,
//         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
//       );
//       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

//       if (isLayoutTable && cells.length > 0) {
//         const fragment = doc.createDocumentFragment();

//         cells.forEach((cell) => {
//           const cellStyle = cell.getAttribute("style") || "";

//           // Background color preserve
//           const bgMatch = cellStyle.match(
//             /background(?:-color)?\s*:\s*([^;]+)/i,
//           );
//           const bgColor = bgMatch ? bgMatch[1].trim() : null;

//           // IMPORTANT: preserve border-bottom specifically
//           const borderBottomMatch = cellStyle.match(
//             /border-bottom\s*:\s*([^;]+)/i,
//           );

//           const borderBottom = borderBottomMatch
//             ? borderBottomMatch[1].trim()
//             : null;

//           Array.from(cell.childNodes).forEach((node) => {
//             if (node.nodeType === 1) {
//               const existing = node.getAttribute("style") || "";
//               const styles = [];

//               if (existing.trim()) {
//                 styles.push(existing.trim().replace(/;$/, ""));
//               }

//               if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
//                 styles.push(`background-color:${bgColor}`);
//               }

//               if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
//                 styles.push(`border-bottom:${borderBottom}`);
//               }

//               node.setAttribute(
//                 "style",
//                 styles.join("; ") + (styles.length ? ";" : ""),
//               );

//               console.log(
//                 "MOVING STYLE:",
//                 node.tagName,
//                 node.getAttribute("style"),
//               );
//             }

//             fragment.appendChild(node);
//           });
//         });

//         table.replaceWith(fragment);
//         changed = true;
//       }
//     });
//   }

//   // 2) Split paragraphs where a numbering span like "3." / "4." sits
//   //    in the MIDDLE of a <p> instead of at the start
//   doc.querySelectorAll("p").forEach((p) => {
//     const spans = Array.from(p.querySelectorAll("span"));
//     const numberSpans = spans.filter((s) =>
//       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
//     );

//     if (numberSpans.length > 1) {
//       const parent = p.parentNode;
//       let current = doc.createElement("p");
//       Array.from(p.attributes).forEach((attr) =>
//         current.setAttribute(attr.name, attr.value),
//       );
//       const splitMarkers = new Set(numberSpans.slice(1));
//       const newParagraphs = [current];

//       Array.from(p.childNodes).forEach((node) => {
//         if (splitMarkers.has(node)) {
//           current = doc.createElement("p");
//           Array.from(p.attributes).forEach((attr) =>
//             current.setAttribute(attr.name, attr.value),
//           );
//           newParagraphs.push(current);
//         }
//         current.appendChild(node);
//       });

//       newParagraphs.forEach((np) => parent.insertBefore(np, p));
//       parent.removeChild(p);
//     }
//   });

//   // 2b) FIX: If a paragraph ends with text like "able to:" followed by
//   //    a numbered list item "1. Identify...", split them into separate paragraphs
//   doc.querySelectorAll("p").forEach((p) => {
//     const textContent = p.textContent.trim();
//     // Check if this paragraph has both "able to:" pattern and number pattern
//     if (textContent.match(/able\s+to:\s*\d+\./i)) {
//       const parent = p.parentNode;
//       const parts = [];

//       // Split by number pattern like "1. " "2. " etc
//       const nodes = Array.from(p.childNodes);
//       let currentPara = doc.createElement("p");
//       Array.from(p.attributes).forEach((attr) =>
//         currentPara.setAttribute(attr.name, attr.value),
//       );

//       nodes.forEach((node) => {
//         const isNumberNode =
//           node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

//         if (isNumberNode) {
//           // Found a number span - this should start a new paragraph
//           if (currentPara.childNodes.length > 0) {
//             parts.push(currentPara);
//           }
//           currentPara = doc.createElement("p");
//           Array.from(p.attributes).forEach((attr) =>
//             currentPara.setAttribute(attr.name, attr.value),
//           );
//         }
//         currentPara.appendChild(node);
//       });

//       if (currentPara.childNodes.length > 0) {
//         parts.push(currentPara);
//       }

//       if (parts.length > 1) {
//         parts.forEach((part) => parent.insertBefore(part, p));
//         parent.removeChild(p);
//       }
//     }
//   });

//   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
//   doc.querySelectorAll("span").forEach((span) => {
//     const t = span.textContent.trim();
//     if (/^\d{1,2}[.)]$/.test(t)) {
//       const textNode = doc.createTextNode(`${t} `);
//       span.replaceWith(textNode);
//     }
//   });

//   // 4) Remove empty spacing paragraphs
//   doc.querySelectorAll("p").forEach((p) => {
//     const hasMedia = p.querySelector("img, table");
//     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
//     if (isEmptyText && !hasMedia) {
//       p.remove();
//     }
//   });

//   // 4b) Collapse leftover Word tab-stop runs of &nbsp;
//   doc.querySelectorAll("span").forEach((span) => {
//     const raw = span.textContent;
//     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
//       span.replaceWith(doc.createTextNode(" "));
//     }
//   });

//   // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
//   //    for underlines and keep text-align and background-color
//   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
//     el.removeAttribute("width");
//     if (
//       el.tagName === "TABLE" ||
//       el.tagName === "COLGROUP" ||
//       el.tagName === "COL"
//     ) {
//       el.removeAttribute("style");
//     }
//   });

//   // 5b) IMPORTANT: Clean up inline styles on paragraphs but PRESERVE
//   //     text-align, background-color, and border-bottom
//   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
//     const style = el.getAttribute("style") || "";
//     const preserved = [];

//     // Extract styles we want to keep
//     const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
//     if (textAlignMatch) {
//       preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
//     }

//     const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
//     if (bgColorMatch) {
//       preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
//     }

//     const borderMatch = style.match(
//       /(border(?:-bottom|-top|-left|-right)?)\s*:\s*([^;]+)/i,
//     );
//     if (borderMatch) {
//       preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
//     }

//     const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
//     if (colorMatch) {
//       preserved.push(`color: ${colorMatch[1].trim()}`);
//     }

//     const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
//     if (fontSizeMatch) {
//       preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
//     }

//     const borderBottom = style.match(/border-bottom\s*:\s*([^;]+)/i);

//     if (borderBottom) {
//       preserved.push(`border-bottom:${borderBottom[1].trim()}`);
//     }
//   });

//   // ==================================================
//   // FIX: Word Symbol bullets (·)
//   // Convert to separate lines, NOT <ul>
//   // ==================================================
//   doc.querySelectorAll("p").forEach((p) => {
//     const text = p.textContent || "";

//     const bulletCount = (text.match(/·/g) || []).length;

//     if (bulletCount >= 2) {
//       const parts = text
//         .split("·")
//         .map((x) => x.trim())
//         .filter(Boolean);

//       if (parts.length > 1) {
//         const fragment = doc.createDocumentFragment();

//         const intro = doc.createElement("p");
//         intro.textContent = parts.shift();
//         fragment.appendChild(intro);

//         parts.forEach((item) => {
//           const bulletLine = doc.createElement("p");
//           bulletLine.textContent = `• ${item}`;
//           fragment.appendChild(bulletLine);
//         });

//         p.replaceWith(fragment);
//       }
//     }
//   });

//   // ============================================
//   // FIX WORD TABLE BULLETS
//   // ============================================
//   doc.querySelectorAll("p").forEach((p) => {
//     const next = p.nextElementSibling;

//     if (!next) return;

//     const bulletText = p.textContent.replace(/\s/g, "");

//     const onlyBullets = bulletText && /^([·•])+$/u.test(bulletText);

//     if (!onlyBullets) return;

//     const lines = next.innerHTML
//       .split(/<br\s*\/?>/i)
//       .map((x) => x.trim())
//       .filter(Boolean);

//     if (!lines.length) return;

//     const fragment = doc.createDocumentFragment();

//     lines.forEach((line) => {
//       const bulletLine = doc.createElement("p");
//       bulletLine.innerHTML = `• ${line}`;
//       fragment.appendChild(bulletLine);
//     });

//     p.replaceWith(fragment);
//     next.remove();
//   });

//   console.log(
//     "FINAL BORDER COUNT:",
//     (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
//   );

//   return doc.body.innerHTML;
// }

// const CustomEditor = memo(
//   ({ value, onChange, placeholder, minHeight = "300px" }) => {
//     const [showColorPicker, setShowColorPicker] = useState(false);
//     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
//     const [showHighlighter, setShowHighlighter] = useState(false);

//     const editor = useEditor({
//       extensions: [
//         StarterKit.configure({
//           heading: { levels: [1, 2, 3, 4, 5, 6] },
//           codeBlock: false,
//           blockquote: true,
//           orderedList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
//           bulletList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
//           underline: false,
//           link: false,
//           horizontalRule: false,
//         }),
//         Underline,
//         TextAlign.configure({
//           types: ["heading", "paragraph"],
//           alignments: ["left", "center", "right", "justify"],
//         }),
//         Highlight.configure({ multicolor: true }),
//         TextStyle,
//         Color,
//         FontFamily,
//         FontSize,
//         BackgroundColor,
//         BorderBottom, // ADD: For underlines
//         Link.configure({
//           openOnClick: false,
//           linkOnPaste: true,
//           autolink: true,
//           HTMLAttributes: {
//             class: "custom-link",
//             rel: "noopener noreferrer",
//             target: "_blank",
//           },
//         }),
//         Image.configure({
//           inline: true,
//           allowBase64: true,
//         }),
//         Placeholder.configure({
//           placeholder: placeholder || "Write something...",
//         }),
//         Table.configure({ resizable: true }),
//         TableRow,
//         TableCell,
//         TableHeader,
//         HorizontalRule,
//         CodeBlockLowlight.configure({ lowlight }),
//       ],
//       content: value || "",
//       onUpdate: ({ editor }) => {
//         onChange(editor.getHTML());
//         console.log("===== TIPTAP HTML (after edit) =====");
//         console.log(editor.getHTML());
//       },
//       editorProps: {
//         attributes: {
//           class: "editor-content",
//           style: `min-height: ${minHeight}; padding: 1rem;`,
//         },
//         transformPastedHTML(html) {
//           console.log("===== RAW HTML =====");

//           console.log("RAW border-bottom:", html.includes("border-bottom"));

//           console.log(
//             "RAW mso-border-bottom:",
//             html.includes("mso-border-bottom"),
//           );

//           console.log("RAW table:", html.includes("<table"));

//           const cleaned = cleanPastedHTML(html);

//           console.log("===== CLEANED HTML =====");

//           console.log(
//             "CLEANED border-bottom:",
//             cleaned.includes("border-bottom"),
//           );

//           console.log(
//             "CLEANED mso-border-bottom:",
//             cleaned.includes("mso-border-bottom"),
//           );

//           console.log("CLEANED table:", cleaned.includes("<table"));

//           return cleaned;
//         },
//       },
//     });

//     // Sync external value changes
//     useEffect(() => {
//       if (editor && value !== editor.getHTML()) {
//         editor.commands.setContent(value || "", false);
//       }
//     }, [editor, value]);

//     // Close pickers on outside click
//     useEffect(() => {
//       const handler = (e) => {
//         if (!e.target.closest(".color-picker-wrapper")) {
//           setShowColorPicker(false);
//           setShowBgColorPicker(false);
//           setShowHighlighter(false);
//         }
//       };
//       document.addEventListener("mousedown", handler);
//       return () => document.removeEventListener("mousedown", handler);
//     }, []);

//     if (!editor) {
//       return (
//         <div
//           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
//           style={{ minHeight }}
//         >
//           <div className="text-gray-400">Loading editor...</div>
//         </div>
//       );
//     }

//     const addTable = () => {
//       const rows = prompt("Number of rows:", "3");
//       const cols = prompt("Number of columns:", "3");
//       if (rows && cols) {
//         editor
//           .chain()
//           .focus()
//           .insertTable({
//             rows: parseInt(rows),
//             cols: parseInt(cols),
//             withHeaderRow: true,
//           })
//           .run();
//       }
//     };

//     const addImage = () => {
//       const url = prompt("Enter image URL:");
//       if (url) editor.chain().focus().setImage({ src: url }).run();
//     };

//     const openLinkDialog = () => {
//       const url = window.prompt("Enter link URL:");
//       if (!url) return;
//       const href = url.startsWith("http") ? url : `https://${url}`;
//       const { from, to } = editor.state.selection;
//       if (from === to) {
//         editor
//           .chain()
//           .focus()
//           .insertContent(`<a href="${href}">${href}</a>`)
//           .run();
//       } else {
//         editor.chain().focus().setLink({ href }).run();
//       }
//     };

//     const removeLink = () => {
//       editor.chain().focus().extendMarkRange("link").unsetLink().run();
//     };

//     const setFontSize = (size) => {
//       if (size === "default") {
//         editor.chain().focus().unsetFontSize().run();
//       } else {
//         editor.chain().focus().setFontSize(size).run();
//       }
//     };

//     const handleSetTextColor = (color) => {
//       editor.chain().focus().setColor(color).run();
//       setShowColorPicker(false);
//     };

//     const handleUnsetTextColor = () => {
//       editor.chain().focus().unsetColor().run();
//       setShowColorPicker(false);
//     };

//     const handleSetHighlight = (color) => {
//       editor.chain().focus().setHighlight({ color }).run();
//       setShowBgColorPicker(false);
//     };

//     const handleUnsetHighlight = () => {
//       editor.chain().focus().unsetHighlight().run();
//       setShowBgColorPicker(false);
//     };

//     const clearFormatting = () => {
//       editor.chain().focus().clearNodes().unsetAllMarks().run();
//     };

//     const currentHeading = (() => {
//       for (let i = 1; i <= 4; i++) {
//         if (editor.isActive("heading", { level: i })) return String(i);
//       }
//       return "paragraph";
//     })();

//     return (
//       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
//         {/* ── Toolbar ── */}
//         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
//           {/* Font Family */}
//           <select
//             onChange={(e) => {
//               const font = e.target.value;
//               if (font === "default")
//                 editor.chain().focus().unsetFontFamily().run();
//               else editor.chain().focus().setFontFamily(font).run();
//             }}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//           >
//             <option value="default">Font Family</option>
//             <option value="Arial">Arial</option>
//             <option value="Georgia">Georgia</option>
//             <option value="Times New Roman">Times New Roman</option>
//             <option value="Courier New">Courier New</option>
//             <option value="Verdana">Verdana</option>
//           </select>

//           {/* Font Size */}
//           <select
//             onChange={(e) => setFontSize(e.target.value)}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//             defaultValue="default"
//           >
//             <option value="default">Font Size</option>
//             <option value="12px">12px</option>
//             <option value="14px">14px</option>
//             <option value="16px">16px</option>
//             <option value="18px">18px</option>
//             <option value="20px">20px</option>
//             <option value="24px">24px</option>
//             <option value="28px">28px</option>
//             <option value="32px">32px</option>
//           </select>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Text Color */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowColorPicker((v) => !v);
//                 setShowBgColorPicker(false);
//                 setShowHighlighter(false);
//               }}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
//               title="Text Color"
//             >
//               <MdFormatColorText size={18} />
//               <span
//                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
//                 style={{
//                   backgroundColor:
//                     editor.getAttributes("textStyle").color || "transparent",
//                 }}
//               />
//             </button>
//             {showColorPicker && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleUnsetTextColor();
//                   }}
//                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
//                 >
//                   Remove Color
//                 </button>
//                 {COLORS.map((color) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleSetTextColor(color);
//                     }}
//                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
//                     style={{
//                       backgroundColor: color,
//                       border:
//                         color === "#FFFFFF"
//                           ? "1px solid #ddd"
//                           : "1px solid transparent",
//                       outline:
//                         editor.getAttributes("textStyle").color === color
//                           ? "2px solid #2563eb"
//                           : "none",
//                       outlineOffset: "2px",
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Background (Highlight) Color */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowBgColorPicker((v) => !v);
//                 setShowColorPicker(false);
//                 setShowHighlighter(false);
//               }}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
//               title="Background Color"
//             >
//               <MdFormatColorFill size={18} />
//               <span
//                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
//                 style={{
//                   backgroundColor:
//                     editor.getAttributes("highlight").color || "transparent",
//                 }}
//               />
//             </button>
//             {showBgColorPicker && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleUnsetHighlight();
//                   }}
//                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
//                 >
//                   Remove Background
//                 </button>
//                 {COLORS.map((color) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleSetHighlight(color);
//                     }}
//                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
//                     style={{
//                       backgroundColor: color,
//                       border:
//                         color === "#FFFFFF"
//                           ? "1px solid #ddd"
//                           : "1px solid transparent",
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Highlighter Pen */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowHighlighter((v) => !v);
//                 setShowColorPicker(false);
//                 setShowBgColorPicker(false);
//               }}
//               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
//               style={
//                 editor.isActive("highlight")
//                   ? {
//                       backgroundColor:
//                         editor.getAttributes("highlight").color || "#FEF08A",
//                       color: "#000",
//                     }
//                   : {}
//               }
//               title="Highlighter"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 20h9" />
//                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//               </svg>
//             </button>
//             {showHighlighter && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
//                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
//                   Highlight Color
//                 </span>
//                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       editor.chain().focus().setHighlight({ color }).run();
//                       setShowHighlighter(false);
//                     }}
//                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
//                   >
//                     <span
//                       className="w-5 h-5 rounded-sm border flex-shrink-0"
//                       style={{
//                         backgroundColor: color,
//                         borderColor:
//                           editor.getAttributes("highlight").color === color
//                             ? "#2563eb"
//                             : "#e5e7eb",
//                         outline:
//                           editor.getAttributes("highlight").color === color
//                             ? "2px solid #2563eb"
//                             : "none",
//                         outlineOffset: "2px",
//                       }}
//                     />
//                     {label}
//                   </button>
//                 ))}
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     editor.chain().focus().unsetHighlight().run();
//                     setShowHighlighter(false);
//                   }}
//                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
//                 >
//                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
//                   Remove
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Bold */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBold().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Bold"
//           >
//             <FiBold size={16} />
//           </button>

//           {/* Italic */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleItalic().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Italic"
//           >
//             <FiItalic size={16} />
//           </button>

//           {/* Underline */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleUnderline().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Underline"
//           >
//             <FiUnderline size={16} />
//           </button>

//           {/* Clear Formatting */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               clearFormatting();
//             }}
//             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
//             title="Clear Formatting"
//           >
//             <MdFormatClear size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Heading Select */}
//           <select
//             onChange={(e) => {
//               const val = e.target.value;
//               if (val === "paragraph")
//                 editor.chain().focus().setParagraph().run();
//               else
//                 editor
//                   .chain()
//                   .focus()
//                   .toggleHeading({ level: parseInt(val) })
//                   .run();
//             }}
//             value={currentHeading}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//           >
//             <option value="paragraph">Normal</option>
//             <option value="1">Heading 1</option>
//             <option value="2">Heading 2</option>
//             <option value="3">Heading 3</option>
//             <option value="4">Heading 4</option>
//           </select>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Align Left */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("left").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignLeft size={16} />
//           </button>
//           {/* Align Center */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("center").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignCenter size={16} />
//           </button>
//           {/* Align Right */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("right").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignRight size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Bullet List */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBulletList().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Bullet List"
//           >
//             <FiList size={16} />
//           </button>

//           {/* Ordered List */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleOrderedList().run();
//             }}
//             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Numbered List"
//           >
//             1.
//           </button>

//           {/* Blockquote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBlockquote().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Blockquote"
//           >
//             <MdFormatQuote size={16} />
//           </button>

//           {/* Code Block */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleCodeBlock().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Code Block"
//           >
//             <FiCode size={16} />
//           </button>

//           {/* Horizontal Rule */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setHorizontalRule().run();
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Horizontal Rule"
//           >
//             <FiMinus size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Table */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               addTable();
//             }}
//             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Insert Table"
//           >
//             <div className="grid grid-cols-2 gap-[2px]">
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//             </div>
//             <span className="text-sm font-medium">Table</span>
//           </button>

//           {/* Image */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               addImage();
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Insert Image"
//           >
//             <FiImage size={16} />
//           </button>

//           {/* Link button */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               openLinkDialog();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Insert Link"
//           >
//             <FiLinkIcon size={16} />
//           </button>

//           {/* Single Quote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               const { from, to } = editor.state.selection;
//               if (from === to) {
//                 editor.chain().focus().insertContent("''").run();
//               } else {
//                 const selectedText = editor.state.doc.textBetween(from, to);
//                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
//               }
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
//             title="Single Quotes"
//           >
//             '&thinsp;'
//           </button>

//           {/* Double Quote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               const { from, to } = editor.state.selection;
//               if (from === to) {
//                 editor.chain().focus().insertContent('""').run();
//               } else {
//                 const selectedText = editor.state.doc.textBetween(from, to);
//                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
//               }
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
//             title="Double Quotes"
//           >
//             "&thinsp;"
//           </button>

//           {editor.isActive("link") && (
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 removeLink();
//               }}
//               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
//               title="Remove Link"
//             >
//               Remove Link
//             </button>
//           )}

//           {/* Table Controls — shown only when inside a table */}
//           {editor.isActive("table") && (
//             <>
//               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
//               {[
//                 {
//                   label: "+ Row ↑",
//                   action: () => editor.chain().focus().addRowBefore().run(),
//                 },
//                 {
//                   label: "+ Row ↓",
//                   action: () => editor.chain().focus().addRowAfter().run(),
//                 },
//                 {
//                   label: "+ Col ←",
//                   action: () => editor.chain().focus().addColumnBefore().run(),
//                 },
//                 {
//                   label: "+ Col →",
//                   action: () => editor.chain().focus().addColumnAfter().run(),
//                 },
//               ].map(({ label, action }) => (
//                 <button
//                   key={label}
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     action();
//                   }}
//                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
//                 >
//                   {label}
//                 </button>
//               ))}
//               {[
//                 {
//                   label: "- Row",
//                   action: () => editor.chain().focus().deleteRow().run(),
//                 },
//                 {
//                   label: "- Col",
//                   action: () => editor.chain().focus().deleteColumn().run(),
//                 },
//                 {
//                   label: "Delete Table",
//                   action: () => editor.chain().focus().deleteTable().run(),
//                 },
//               ].map(({ label, action }) => (
//                 <button
//                   key={label}
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     action();
//                   }}
//                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
//                 >
//                   {label}
//                 </button>
//               ))}
//             </>
//           )}
//         </div>

//         <EditorContent editor={editor} />

//         <style>{`
//         .editor-wrapper .editor-content:focus {
//           outline: none;
//         }

//         .editor-wrapper .editor-content {
//           caret-color: #2563EB;
//           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
//         }

//         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #adb5bd;
//           pointer-events: none;
//           height: 0;
//         }

//         .editor-wrapper .editor-content ::selection {
//           background-color: rgba(59, 130, 246, 0.3) !important;
//           color: inherit !important;
//         }

//         .editor-wrapper mark {
//           padding: 0.1em 0;
//           border-radius: 2px;
//         }

//         .editor-wrapper .custom-link,
//         .editor-wrapper a {
//           color: #2563eb !important;
//           text-decoration: underline !important;
//           cursor: pointer !important;
//         }
//         .editor-wrapper .custom-link:hover,
//         .editor-wrapper a:hover {
//           color: #1d4ed8 !important;
//         }

//         .editor-wrapper table {
//           border-collapse: collapse;
//           width: 100%;
//           margin: 1rem 0;
//           table-layout: fixed;
//         }
//         .editor-wrapper td,
//         .editor-wrapper th {
//           border: 1px solid #d1d5db;
//           padding: 8px 12px;
//           position: relative;
//         }
//         .editor-wrapper th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .editor-wrapper .selectedCell::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: rgba(59, 130, 246, 0.15);
//           pointer-events: none;
//         }

//         .editor-wrapper .editor-content p {
//           margin: 0 0 0.75rem;
//           line-height: 1.6;
//         }

//         .editor-wrapper .editor-content ul {
//           list-style-type: disc;
//           padding-left: 1.75rem;
//           margin: 0 0 0.75rem;
//         }
//         .editor-wrapper .editor-content ol {
//           list-style-type: decimal;
//           padding-left: 1.75rem;
//           margin: 0 0 0.75rem;
//         }
//         .editor-wrapper .editor-content li {
//           margin-bottom: 0.25rem;
//           line-height: 1.6;
//         }
//         .editor-wrapper .editor-content li p {
//           margin: 0;
//         }

//         .editor-wrapper .editor-content blockquote {
//           border-left: 4px solid #3b82f6;
//           padding: 0.5rem 1rem;
//           margin: 1rem 0;
//           color: #4b5563;
//           font-style: italic;
//           background-color: #f8fafc;
//           border-radius: 0 4px 4px 0;
//         }
//         .editor-wrapper .editor-content blockquote p {
//           margin: 0;
//         }

//         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
//         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
//         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
//         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

//         .editor-wrapper .editor-content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.5rem;
//           margin: 0.5rem 0;
//         }

//         .editor-wrapper .editor-content pre {
//           background-color: #1f2937;
//           color: #f3f4f6;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           overflow-x: auto;
//           font-family: monospace;
//           font-size: 0.875rem;
//           margin: 1rem 0;
//         }
//         .editor-wrapper .editor-content code:not(pre code) {
//           background-color: #f3f4f6;
//           padding: 0.125rem 0.3rem;
//           border-radius: 0.25rem;
//           font-family: monospace;
//           font-size: 0.875rem;
//           color: #dc2626;
//         }

//         .editor-wrapper .editor-content hr {
//           margin: 1.5rem 0;
//           border: none;
//           border-top: 2px solid #e5e7eb;
//         }
//       `}</style>
//       </div>
//     );
//   },
// );

// CustomEditor.displayName = "CustomEditor";

// export default CustomEditor;

// import { memo, useEffect, useState } from "react";

// // =========================
// // Tiptap Core
// // =========================
// import { useEditor, EditorContent, Extension } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// // =========================
// // Tiptap Extensions
// // =========================
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";

// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Highlight from "@tiptap/extension-highlight";

// import { TextStyle } from "@tiptap/extension-text-style";
// import { Color } from "@tiptap/extension-color";

// import FontFamily from "@tiptap/extension-font-family";
// import HorizontalRule from "@tiptap/extension-horizontal-rule";

// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // =========================
// // Lowlight + Highlight.js
// // =========================
// import { createLowlight } from "lowlight";
// import javascript from "highlight.js/lib/languages/javascript";
// import xml from "highlight.js/lib/languages/xml";
// import css from "highlight.js/lib/languages/css";
// import json from "highlight.js/lib/languages/json";
// import typescript from "highlight.js/lib/languages/typescript";
// import bash from "highlight.js/lib/languages/bash";
// import "highlight.js/styles/github-dark.css";

// const lowlight = createLowlight();
// lowlight.register("javascript", javascript);
// lowlight.register("js", javascript);
// lowlight.register("html", xml);
// lowlight.register("xml", xml);
// lowlight.register("css", css);
// lowlight.register("json", json);
// lowlight.register("typescript", typescript);
// lowlight.register("ts", typescript);
// lowlight.register("bash", bash);
// lowlight.register("shell", bash);

// // =========================
// // FIX 1: Custom FontSize Extension
// // =========================
// const FontSize = Extension.create({
//   name: "fontSize",
//   addOptions() {
//     return { types: ["textStyle"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           fontSize: {
//             default: null,
//             parseHTML: (element) => element.style.fontSize || null,
//             renderHTML: (attributes) => {
//               if (!attributes.fontSize) return {};
//               return { style: `font-size: ${attributes.fontSize}` };
//             },
//           },
//         },
//       },
//     ];
//   },
//   addCommands() {
//     return {
//       setFontSize:
//         (fontSize) =>
//         ({ chain }) => {
//           return chain().setMark("textStyle", { fontSize }).run();
//         },
//       unsetFontSize:
//         () =>
//         ({ chain }) => {
//           return chain()
//             .setMark("textStyle", { fontSize: null })
//             .removeEmptyTextStyle()
//             .run();
//         },
//     };
//   },
// });

// const BackgroundColor = Extension.create({
//   name: "backgroundColor",
//   addOptions() {
//     return { types: ["paragraph", "heading"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           backgroundColor: {
//             default: null,
//             parseHTML: (element) =>
//               element.style.backgroundColor || element.style.background || null,
//             renderHTML: (attributes) => {
//               if (!attributes.backgroundColor) return {};
//               return {
//                 style: `background-color: ${attributes.backgroundColor}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },
// });

// // ADD: Custom BorderBottom Extension for underlines
// const BorderBottom = Extension.create({
//   name: "borderBottom",
//   addOptions() {
//     return { types: ["paragraph", "heading"] };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           borderBottom: {
//             default: null,
//             parseHTML: (element) => {
//               const style = element.getAttribute("style") || "";
//               const match = style.match(/border-bottom:\s*([^;]+)/i);
//               return match ? match[1].trim() : null;
//             },
//             renderHTML: (attributes) => {
//               if (!attributes.borderBottom) return {};
//               return {
//                 style: `border-bottom: ${attributes.borderBottom}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },
// });

// // =========================
// // React Icons
// // =========================
// import {
//   FiBold,
//   FiItalic,
//   FiUnderline,
//   FiList,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
//   FiImage,
//   FiCode,
//   FiMinus,
//   FiLink as FiLinkIcon,
// } from "react-icons/fi";
// import {
//   MdFormatColorText,
//   MdFormatColorFill,
//   MdFormatQuote,
//   MdFormatClear,
// } from "react-icons/md";

// const COLORS = [
//   "#000000",
//   "#DC2626",
//   "#059669",
//   "#2563EB",
//   "#D97706",
//   "#7C3AED",
//   "#DB2777",
//   "#4B5563",
//   "#FFFFFF",
//   "#FCD34D",
//   "#F97316",
//   "#EC4899",
//   "#06B6D4",
//   "#84CC16",
//   "#8B5CF6",
// ];

// const HIGHLIGHT_COLORS = [
//   { color: "#FEF08A", label: "Yellow" },
//   { color: "#86EFAC", label: "Green" },
//   { color: "#FDA4AF", label: "Pink" },
//   { color: "#93C5FD", label: "Blue" },
//   { color: "#FED7AA", label: "Orange" },
//   { color: "#E9D5FF", label: "Purple" },
// ];

// // ============================================================
// // PASTE CLEANER - IMPROVED
// // Strips Word/Google-Docs layout junk before Tiptap parses it:
// //  - nested "layout" tables (tables used only for spacing/positioning)
// //  - manual "1." "2." numbering spans that aren't real <ol><li> items
// //  - empty spacing paragraphs (&nbsp; / <br><br>)
// //  - inline width/style junk on any table that survives
// //  - PRESERVES: borders (underlines), text-align, background-color
// // ============================================================
// // function cleanPastedHTML(html) {
// //   const doc = new DOMParser().parseFromString(html, "text/html");

// //   doc.querySelectorAll("*").forEach((el) => {
// //     const style = el.getAttribute("style") || "";

// //     if (
// //       style.includes("border-bottom") ||
// //       style.includes("mso-border-bottom")
// //     ) {
// //       console.log("FOUND BORDER:", el.tagName, style);
// //     }
// //   });

// //   // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
// //   doc.querySelectorAll("[align]").forEach((el) => {
// //     const alignVal = el.getAttribute("align");
// //     if (alignVal) {
// //       const existing = el.getAttribute("style") || "";
// //       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
// //       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
// //     }
// //     el.removeAttribute("align");
// //   });

// //   // 1) Repeatedly unwrap tables whose cells have no real tabular data
// //   let guard = 0;
// //   let changed = true;
// //   while (changed && guard < 15) {
// //     changed = false;
// //     guard++;
// //     const tables = Array.from(doc.querySelectorAll("table"));
// //     tables.forEach((table) => {
// //       const rows = table.querySelectorAll("tr");
// //       const cells = table.querySelectorAll("td, th");
// //       const maxCellsInARow = Math.max(
// //         0,
// //         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
// //       );
// //       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

// //       if (isLayoutTable && cells.length > 0) {
// //         const fragment = doc.createDocumentFragment();

// //         cells.forEach((cell) => {
// //           const cellStyle = cell.getAttribute("style") || "";

// //           // Background color preserve
// //           const bgMatch = cellStyle.match(
// //             /background(?:-color)?\s*:\s*([^;]+)/i,
// //           );
// //           const bgColor = bgMatch ? bgMatch[1].trim() : null;

// //           // IMPORTANT: preserve border-bottom specifically
// //           const borderBottomMatch = cellStyle.match(
// //             /border-bottom\s*:\s*([^;]+)/i,
// //           );

// //           const borderBottom = borderBottomMatch
// //             ? borderBottomMatch[1].trim()
// //             : null;

// //           Array.from(cell.childNodes).forEach((node) => {
// //             if (node.nodeType === 1) {
// //               const existing = node.getAttribute("style") || "";
// //               const styles = [];

// //               if (existing.trim()) {
// //                 styles.push(existing.trim().replace(/;$/, ""));
// //               }

// //               if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
// //                 styles.push(`background-color:${bgColor}`);
// //               }

// //               if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
// //                 styles.push(`border-bottom:${borderBottom}`);
// //               }

// //               node.setAttribute(
// //                 "style",
// //                 styles.join("; ") + (styles.length ? ";" : ""),
// //               );

// //               console.log(
// //                 "MOVING STYLE:",
// //                 node.tagName,
// //                 node.getAttribute("style"),
// //               );
// //             }

// //             fragment.appendChild(node);
// //           });
// //         });

// //         table.replaceWith(fragment);
// //         changed = true;
// //       }
// //     });
// //   }

// //   // 2) Split paragraphs where a numbering span like "3." / "4." sits
// //   //    in the MIDDLE of a <p> instead of at the start
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const spans = Array.from(p.querySelectorAll("span"));
// //     const numberSpans = spans.filter((s) =>
// //       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
// //     );

// //     if (numberSpans.length > 1) {
// //       const parent = p.parentNode;
// //       let current = doc.createElement("p");
// //       Array.from(p.attributes).forEach((attr) =>
// //         current.setAttribute(attr.name, attr.value),
// //       );
// //       const splitMarkers = new Set(numberSpans.slice(1));
// //       const newParagraphs = [current];

// //       Array.from(p.childNodes).forEach((node) => {
// //         if (splitMarkers.has(node)) {
// //           current = doc.createElement("p");
// //           Array.from(p.attributes).forEach((attr) =>
// //             current.setAttribute(attr.name, attr.value),
// //           );
// //           newParagraphs.push(current);
// //         }
// //         current.appendChild(node);
// //       });

// //       newParagraphs.forEach((np) => parent.insertBefore(np, p));
// //       parent.removeChild(p);
// //     }
// //   });

// //   // 2b) FIX: If a paragraph ends with text like "able to:" followed by
// //   //    a numbered list item "1. Identify...", split them into separate paragraphs
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const textContent = p.textContent.trim();
// //     // Check if this paragraph has both "able to:" pattern and number pattern
// //     if (textContent.match(/able\s+to:\s*\d+\./i)) {
// //       const parent = p.parentNode;
// //       const parts = [];

// //       // Split by number pattern like "1. " "2. " etc
// //       const nodes = Array.from(p.childNodes);
// //       let currentPara = doc.createElement("p");
// //       Array.from(p.attributes).forEach((attr) =>
// //         currentPara.setAttribute(attr.name, attr.value),
// //       );

// //       nodes.forEach((node) => {
// //         const isNumberNode =
// //           node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

// //         if (isNumberNode) {
// //           // Found a number span - this should start a new paragraph
// //           if (currentPara.childNodes.length > 0) {
// //             parts.push(currentPara);
// //           }
// //           currentPara = doc.createElement("p");
// //           Array.from(p.attributes).forEach((attr) =>
// //             currentPara.setAttribute(attr.name, attr.value),
// //           );
// //         }
// //         currentPara.appendChild(node);
// //       });

// //       if (currentPara.childNodes.length > 0) {
// //         parts.push(currentPara);
// //       }

// //       if (parts.length > 1) {
// //         parts.forEach((part) => parent.insertBefore(part, p));
// //         parent.removeChild(p);
// //       }
// //     }
// //   });

// //   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
// //   doc.querySelectorAll("span").forEach((span) => {
// //     const t = span.textContent.trim();
// //     if (/^\d{1,2}[.)]$/.test(t)) {
// //       const textNode = doc.createTextNode(`${t} `);
// //       span.replaceWith(textNode);
// //     }
// //   });

// //   // 4) Remove empty spacing paragraphs
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const hasMedia = p.querySelector("img, table");
// //     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
// //     if (isEmptyText && !hasMedia) {
// //       p.remove();
// //     }
// //   });

// //   // 4b) Collapse leftover Word tab-stop runs of &nbsp;
// //   doc.querySelectorAll("span").forEach((span) => {
// //     const raw = span.textContent;
// //     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
// //       span.replaceWith(doc.createTextNode(" "));
// //     }
// //   });

// //   // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
// //   //    for underlines and keep text-align and background-color
// //   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
// //     el.removeAttribute("width");
// //     if (
// //       el.tagName === "TABLE" ||
// //       el.tagName === "COLGROUP" ||
// //       el.tagName === "COL"
// //     ) {
// //       el.removeAttribute("style");
// //     }
// //   });

// //   // 5b) IMPORTANT: Clean up inline styles on paragraphs but PRESERVE
// //   //     text-align, background-color, and border-bottom
// //   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
// //     const style = el.getAttribute("style") || "";
// //     const preserved = [];

// //     // Extract styles we want to keep
// //     const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
// //     if (textAlignMatch) {
// //       preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
// //     }

// //     const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
// //     if (bgColorMatch) {
// //       preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
// //     }

// //     const borderMatch = style.match(
// //       /(border(?:-bottom|-top|-left|-right)?)\s*:\s*([^;]+)/i,
// //     );
// //     if (borderMatch) {
// //       preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
// //     }

// //     const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
// //     if (colorMatch) {
// //       preserved.push(`color: ${colorMatch[1].trim()}`);
// //     }

// //     const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
// //     if (fontSizeMatch) {
// //       preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
// //     }

// //     const borderBottom = style.match(/border-bottom\s*:\s*([^;]+)/i);

// //     if (borderBottom) {
// //       preserved.push(`border-bottom:${borderBottom[1].trim()}`);
// //     }
// //   });

// //   // ==================================================
// //   // FIX: Word Symbol bullets (·)
// //   // Convert to separate lines, NOT <ul>
// //   // ==================================================
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const text = p.textContent || "";

// //     const bulletCount = (text.match(/·/g) || []).length;

// //     if (bulletCount >= 2) {
// //       const parts = text
// //         .split("·")
// //         .map((x) => x.trim())
// //         .filter(Boolean);

// //       if (parts.length > 1) {
// //         const fragment = doc.createDocumentFragment();

// //         const intro = doc.createElement("p");
// //         intro.textContent = parts.shift();
// //         fragment.appendChild(intro);

// //         parts.forEach((item) => {
// //           const bulletLine = doc.createElement("p");
// //           bulletLine.textContent = `• ${item}`;
// //           fragment.appendChild(bulletLine);
// //         });

// //         p.replaceWith(fragment);
// //       }
// //     }
// //   });

// //   // ============================================
// //   // FIX WORD TABLE BULLETS
// //   // ============================================
// //   doc.querySelectorAll("p").forEach((p) => {
// //     const next = p.nextElementSibling;

// //     if (!next) return;

// //     const bulletText = p.textContent.replace(/\s/g, "");

// //     const onlyBullets = bulletText && /^([·•])+$/u.test(bulletText);

// //     if (!onlyBullets) return;

// //     const lines = next.innerHTML
// //       .split(/<br\s*\/?>/i)
// //       .map((x) => x.trim())
// //       .filter(Boolean);

// //     if (!lines.length) return;

// //     const fragment = doc.createDocumentFragment();

// //     lines.forEach((line) => {
// //       const bulletLine = doc.createElement("p");
// //       bulletLine.innerHTML = `• ${line}`;
// //       fragment.appendChild(bulletLine);
// //     });

// //     p.replaceWith(fragment);
// //     next.remove();
// //   });

// //   console.log(
// //     "FINAL BORDER COUNT:",
// //     (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
// //   );

// //   return doc.body.innerHTML;
// // }

// function cleanPastedHTML(html) {
//   const doc = new DOMParser().parseFromString(html, "text/html");

//   doc.querySelectorAll("*").forEach((el) => {
//     const style = el.getAttribute("style") || "";

//     if (
//       style.includes("border-bottom") ||
//       style.includes("mso-border-bottom")
//     ) {
//       console.log("FOUND BORDER:", el.tagName, style);
//     }
//   });

//   // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
//   doc.querySelectorAll("[align]").forEach((el) => {
//     const alignVal = el.getAttribute("align");
//     if (alignVal) {
//       const existing = el.getAttribute("style") || "";
//       const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
//       el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
//     }
//     el.removeAttribute("align");
//   });

//   // 0a) NEW: Convert common alignment utility classes (Tailwind etc.)
//   //     into inline text-align style, since these are often what's
//   //     actually present when copying from a rendered web page
//   //     (e.g. class="text-center") rather than inline style or align=.
//   const CLASS_ALIGN_MAP = {
//     "text-left": "left",
//     "text-center": "center",
//     "text-right": "right",
//     "text-justify": "justify",
//   };
//   doc.querySelectorAll("[class]").forEach((el) => {
//     const classes = (el.getAttribute("class") || "").split(/\s+/);
//     const found = classes.find((c) => CLASS_ALIGN_MAP[c]);
//     if (found) {
//       const existing = el.getAttribute("style") || "";
//       if (!/text-align\s*:/i.test(existing)) {
//         const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
//         el.setAttribute(
//           "style",
//           `${existing}${sep}text-align: ${CLASS_ALIGN_MAP[found]};`,
//         );
//       }
//     }
//   });

//   // 0b) NEW: Push inherited text-align down from ANY ancestor (div, td,
//   //     span, whatever) onto block-level elements (p / h1-h6) that don't
//   //     already define their own text-align. MUST run before table
//   //     unwrapping / before Tiptap parses, because Tiptap only keeps
//   //     alignment that lives directly on the <p>/<h*> — anything sitting
//   //     on a wrapper that later gets dropped is otherwise lost silently.
//   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((block) => {
//     const ownStyle = block.getAttribute("style") || "";
//     if (/text-align\s*:/i.test(ownStyle)) return; // already has its own, don't override

//     let node = block.parentElement;
//     while (node && node !== doc.body) {
//       const style = node.getAttribute("style") || "";
//       const match = style.match(/text-align\s*:\s*([^;]+)/i);
//       if (match) {
//         const align = match[1].trim();
//         const sep = ownStyle && !ownStyle.trim().endsWith(";") ? "; " : "";
//         block.setAttribute("style", `${ownStyle}${sep}text-align: ${align};`);
//         break;
//       }
//       node = node.parentElement;
//     }
//   });

//   // 1) Repeatedly unwrap tables whose cells have no real tabular data
//   let guard = 0;
//   let changed = true;
//   while (changed && guard < 15) {
//     changed = false;
//     guard++;
//     const tables = Array.from(doc.querySelectorAll("table"));
//     tables.forEach((table) => {
//       const rows = table.querySelectorAll("tr");
//       const cells = table.querySelectorAll("td, th");
//       const maxCellsInARow = Math.max(
//         0,
//         ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
//       );
//       const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

//       if (isLayoutTable && cells.length > 0) {
//         const fragment = doc.createDocumentFragment();

//         cells.forEach((cell) => {
//           const cellStyle = cell.getAttribute("style") || "";

//           // Background color preserve
//           const bgMatch = cellStyle.match(
//             /background(?:-color)?\s*:\s*([^;]+)/i,
//           );
//           const bgColor = bgMatch ? bgMatch[1].trim() : null;

//           // IMPORTANT: preserve border-bottom specifically
//           const borderBottomMatch = cellStyle.match(
//             /border-bottom\s*:\s*([^;]+)/i,
//           );
//           const borderBottom = borderBottomMatch
//             ? borderBottomMatch[1].trim()
//             : null;

//           // text-align is already handled by step 0b above (ancestor walk),
//           // so we don't need to re-extract it here.

//           Array.from(cell.childNodes).forEach((node) => {
//             if (node.nodeType === 1) {
//               const existing = node.getAttribute("style") || "";
//               const styles = [];

//               if (existing.trim()) {
//                 styles.push(existing.trim().replace(/;$/, ""));
//               }

//               if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
//                 styles.push(`background-color:${bgColor}`);
//               }

//               if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
//                 styles.push(`border-bottom:${borderBottom}`);
//               }

//               node.setAttribute(
//                 "style",
//                 styles.join("; ") + (styles.length ? ";" : ""),
//               );

//               console.log(
//                 "MOVING STYLE:",
//                 node.tagName,
//                 node.getAttribute("style"),
//               );
//             }

//             fragment.appendChild(node);
//           });
//         });

//         table.replaceWith(fragment);
//         changed = true;
//       }
//     });
//   }

//   // 2) Split paragraphs where a numbering span like "3." / "4." sits
//   //    in the MIDDLE of a <p> instead of at the start
//   doc.querySelectorAll("p").forEach((p) => {
//     const spans = Array.from(p.querySelectorAll("span"));
//     const numberSpans = spans.filter((s) =>
//       /^\d{1,2}[.)]$/.test(s.textContent.trim()),
//     );

//     if (numberSpans.length > 1) {
//       const parent = p.parentNode;
//       let current = doc.createElement("p");
//       Array.from(p.attributes).forEach((attr) =>
//         current.setAttribute(attr.name, attr.value),
//       );
//       const splitMarkers = new Set(numberSpans.slice(1));
//       const newParagraphs = [current];

//       Array.from(p.childNodes).forEach((node) => {
//         if (splitMarkers.has(node)) {
//           current = doc.createElement("p");
//           Array.from(p.attributes).forEach((attr) =>
//             current.setAttribute(attr.name, attr.value),
//           );
//           newParagraphs.push(current);
//         }
//         current.appendChild(node);
//       });

//       newParagraphs.forEach((np) => parent.insertBefore(np, p));
//       parent.removeChild(p);
//     }
//   });

//   // 2b) FIX: If a paragraph ends with text like "able to:" followed by
//   //    a numbered list item "1. Identify...", split them into separate paragraphs
//   doc.querySelectorAll("p").forEach((p) => {
//     const textContent = p.textContent.trim();
//     if (textContent.match(/able\s+to:\s*\d+\./i)) {
//       const parent = p.parentNode;
//       const parts = [];

//       const nodes = Array.from(p.childNodes);
//       let currentPara = doc.createElement("p");
//       Array.from(p.attributes).forEach((attr) =>
//         currentPara.setAttribute(attr.name, attr.value),
//       );

//       nodes.forEach((node) => {
//         const isNumberNode =
//           node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

//         if (isNumberNode) {
//           if (currentPara.childNodes.length > 0) {
//             parts.push(currentPara);
//           }
//           currentPara = doc.createElement("p");
//           Array.from(p.attributes).forEach((attr) =>
//             currentPara.setAttribute(attr.name, attr.value),
//           );
//         }
//         currentPara.appendChild(node);
//       });

//       if (currentPara.childNodes.length > 0) {
//         parts.push(currentPara);
//       }

//       if (parts.length > 1) {
//         parts.forEach((part) => parent.insertBefore(part, p));
//         parent.removeChild(p);
//       }
//     }
//   });

//   // 3) Keep Word's manual "1." "2." numbering text visible as plain text
//   doc.querySelectorAll("span").forEach((span) => {
//     const t = span.textContent.trim();
//     if (/^\d{1,2}[.)]$/.test(t)) {
//       const textNode = doc.createTextNode(`${t} `);
//       span.replaceWith(textNode);
//     }
//   });

//   // 4) Remove empty spacing paragraphs
//   doc.querySelectorAll("p").forEach((p) => {
//     const hasMedia = p.querySelector("img, table");
//     const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
//     if (isEmptyText && !hasMedia) {
//       p.remove();
//     }
//   });

//   // 4b) Collapse leftover Word tab-stop runs of &nbsp;
//   doc.querySelectorAll("span").forEach((span) => {
//     const raw = span.textContent;
//     if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
//       span.replaceWith(doc.createTextNode(" "));
//     }
//   });

//   // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
//   //    for underlines and keep text-align and background-color
//   doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
//     el.removeAttribute("width");
//     if (
//       el.tagName === "TABLE" ||
//       el.tagName === "COLGROUP" ||
//       el.tagName === "COL"
//     ) {
//       el.removeAttribute("style");
//     }
//   });

//   // 5b) Clean up inline styles on paragraphs but PRESERVE
//   //     text-align, background-color, border, color, font-size
//   doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
//     const style = el.getAttribute("style") || "";
//     const preserved = [];

//     const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
//     if (textAlignMatch) {
//       preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
//     }

//     const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
//     if (bgColorMatch) {
//       preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
//     }

//     const borderMatch = style.match(
//       /(border(?:-bottom|-top|-left|-right)?)\s*:\s*([^;]+)/i,
//     );
//     if (borderMatch) {
//       preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
//     }

//     const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
//     if (colorMatch) {
//       preserved.push(`color: ${colorMatch[1].trim()}`);
//     }

//     const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
//     if (fontSizeMatch) {
//       preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
//     }

//     if (preserved.length) {
//       el.setAttribute("style", preserved.join("; ") + ";");
//     } else {
//       el.removeAttribute("style");
//     }
//   });

//   // ==================================================
//   // FIX: Word Symbol bullets (·)
//   // Convert to separate lines, NOT <ul>
//   // ==================================================
//   doc.querySelectorAll("p").forEach((p) => {
//     const text = p.textContent || "";

//     const bulletCount = (text.match(/·/g) || []).length;

//     if (bulletCount >= 2) {
//       const parts = text
//         .split("·")
//         .map((x) => x.trim())
//         .filter(Boolean);

//       if (parts.length > 1) {
//         const fragment = doc.createDocumentFragment();

//         const intro = doc.createElement("p");
//         intro.textContent = parts.shift();
//         fragment.appendChild(intro);

//         parts.forEach((item) => {
//           const bulletLine = doc.createElement("p");
//           bulletLine.textContent = `• ${item}`;
//           fragment.appendChild(bulletLine);
//         });

//         p.replaceWith(fragment);
//       }
//     }
//   });

//   // ============================================
//   // FIX WORD TABLE BULLETS
//   // ============================================
//   doc.querySelectorAll("p").forEach((p) => {
//     const next = p.nextElementSibling;

//     if (!next) return;

//     const bulletText = p.textContent.replace(/\s/g, "");

//     const onlyBullets = bulletText && /^([·•])+$/u.test(bulletText);

//     if (!onlyBullets) return;

//     const lines = next.innerHTML
//       .split(/<br\s*\/?>/i)
//       .map((x) => x.trim())
//       .filter(Boolean);

//     if (!lines.length) return;

//     const fragment = doc.createDocumentFragment();

//     lines.forEach((line) => {
//       const bulletLine = doc.createElement("p");
//       bulletLine.innerHTML = `• ${line}`;
//       fragment.appendChild(bulletLine);
//     });

//     p.replaceWith(fragment);
//     next.remove();
//   });

//   console.log(
//     "FINAL BORDER COUNT:",
//     (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
//   );

//   return doc.body.innerHTML;
// }

// const CustomEditor = memo(
//   ({ value, onChange, placeholder, minHeight = "300px" }) => {
//     const [showColorPicker, setShowColorPicker] = useState(false);
//     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
//     const [showHighlighter, setShowHighlighter] = useState(false);

//     const editor = useEditor({
//       extensions: [
//         StarterKit.configure({
//           heading: { levels: [1, 2, 3, 4, 5, 6] },
//           codeBlock: false,
//           blockquote: true,
//           orderedList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
//           bulletList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
//           underline: false,
//           link: false,
//           horizontalRule: false,
//         }),
//         Underline,
//         TextAlign.configure({
//           types: ["heading", "paragraph"],
//           alignments: ["left", "center", "right", "justify"],
//         }),
//         Highlight.configure({ multicolor: true }),
//         TextStyle,
//         Color,
//         FontFamily,
//         FontSize,
//         BackgroundColor,
//         BorderBottom, // ADD: For underlines
//         Link.configure({
//           openOnClick: false,
//           linkOnPaste: true,
//           autolink: true,
//           HTMLAttributes: {
//             class: "custom-link",
//             rel: "noopener noreferrer",
//             target: "_blank",
//           },
//         }),
//         Image.configure({
//           inline: true,
//           allowBase64: true,
//         }),
//         Placeholder.configure({
//           placeholder: placeholder || "Write something...",
//         }),
//         Table.configure({ resizable: true }),
//         TableRow,
//         TableCell,
//         TableHeader,
//         HorizontalRule,
//         CodeBlockLowlight.configure({ lowlight }),
//       ],
//       content: value || "",
//       onUpdate: ({ editor }) => {
//         onChange(editor.getHTML());
//         console.log("===== TIPTAP HTML (after edit) =====");
//         console.log(editor.getHTML());
//       },
//       editorProps: {
//         attributes: {
//           class: "editor-content",
//           style: `min-height: ${minHeight}; padding: 1rem;`,
//         },
//         transformPastedHTML(html) {
//           console.log("===== RAW HTML =====");

//           console.log("RAW border-bottom:", html.includes("border-bottom"));

//           console.log(
//             "RAW mso-border-bottom:",
//             html.includes("mso-border-bottom"),
//           );

//           console.log("RAW table:", html.includes("<table"));

//           const cleaned = cleanPastedHTML(html);

//           console.log("===== CLEANED HTML =====");

//           console.log(
//             "CLEANED border-bottom:",
//             cleaned.includes("border-bottom"),
//           );

//           console.log(
//             "CLEANED mso-border-bottom:",
//             cleaned.includes("mso-border-bottom"),
//           );

//           console.log("CLEANED table:", cleaned.includes("<table"));

//           return cleaned;
//         },
//       },
//     });

//     // Sync external value changes
//     useEffect(() => {
//       if (editor && value !== editor.getHTML()) {
//         editor.commands.setContent(value || "", false);
//       }
//     }, [editor, value]);

//     // Close pickers on outside click
//     useEffect(() => {
//       const handler = (e) => {
//         if (!e.target.closest(".color-picker-wrapper")) {
//           setShowColorPicker(false);
//           setShowBgColorPicker(false);
//           setShowHighlighter(false);
//         }
//       };
//       document.addEventListener("mousedown", handler);
//       return () => document.removeEventListener("mousedown", handler);
//     }, []);

//     if (!editor) {
//       return (
//         <div
//           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
//           style={{ minHeight }}
//         >
//           <div className="text-gray-400">Loading editor...</div>
//         </div>
//       );
//     }

//     const addTable = () => {
//       const rows = prompt("Number of rows:", "3");
//       const cols = prompt("Number of columns:", "3");
//       if (rows && cols) {
//         editor
//           .chain()
//           .focus()
//           .insertTable({
//             rows: parseInt(rows),
//             cols: parseInt(cols),
//             withHeaderRow: true,
//           })
//           .run();
//       }
//     };

//     const addImage = () => {
//       const url = prompt("Enter image URL:");
//       if (url) editor.chain().focus().setImage({ src: url }).run();
//     };

//     const openLinkDialog = () => {
//       const url = window.prompt("Enter link URL:");
//       if (!url) return;
//       const href = url.startsWith("http") ? url : `https://${url}`;
//       const { from, to } = editor.state.selection;
//       if (from === to) {
//         editor
//           .chain()
//           .focus()
//           .insertContent(`<a href="${href}">${href}</a>`)
//           .run();
//       } else {
//         editor.chain().focus().setLink({ href }).run();
//       }
//     };

//     const removeLink = () => {
//       editor.chain().focus().extendMarkRange("link").unsetLink().run();
//     };

//     const setFontSize = (size) => {
//       if (size === "default") {
//         editor.chain().focus().unsetFontSize().run();
//       } else {
//         editor.chain().focus().setFontSize(size).run();
//       }
//     };

//     const handleSetTextColor = (color) => {
//       editor.chain().focus().setColor(color).run();
//       setShowColorPicker(false);
//     };

//     const handleUnsetTextColor = () => {
//       editor.chain().focus().unsetColor().run();
//       setShowColorPicker(false);
//     };

//     const handleSetHighlight = (color) => {
//       editor.chain().focus().setHighlight({ color }).run();
//       setShowBgColorPicker(false);
//     };

//     const handleUnsetHighlight = () => {
//       editor.chain().focus().unsetHighlight().run();
//       setShowBgColorPicker(false);
//     };

//     const clearFormatting = () => {
//       editor.chain().focus().clearNodes().unsetAllMarks().run();
//     };

//     const currentHeading = (() => {
//       for (let i = 1; i <= 4; i++) {
//         if (editor.isActive("heading", { level: i })) return String(i);
//       }
//       return "paragraph";
//     })();

//     return (
//       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
//         {/* ── Toolbar ── */}
//         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
//           {/* Font Family */}
//           <select
//             onChange={(e) => {
//               const font = e.target.value;
//               if (font === "default")
//                 editor.chain().focus().unsetFontFamily().run();
//               else editor.chain().focus().setFontFamily(font).run();
//             }}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//           >
//             <option value="default">Font Family</option>
//             <option value="Arial">Arial</option>
//             <option value="Georgia">Georgia</option>
//             <option value="Times New Roman">Times New Roman</option>
//             <option value="Courier New">Courier New</option>
//             <option value="Verdana">Verdana</option>
//           </select>

//           {/* Font Size */}
//           <select
//             onChange={(e) => setFontSize(e.target.value)}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//             defaultValue="default"
//           >
//             <option value="default">Font Size</option>
//             <option value="12px">12px</option>
//             <option value="14px">14px</option>
//             <option value="16px">16px</option>
//             <option value="18px">18px</option>
//             <option value="20px">20px</option>
//             <option value="24px">24px</option>
//             <option value="28px">28px</option>
//             <option value="32px">32px</option>
//           </select>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Text Color */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowColorPicker((v) => !v);
//                 setShowBgColorPicker(false);
//                 setShowHighlighter(false);
//               }}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
//               title="Text Color"
//             >
//               <MdFormatColorText size={18} />
//               <span
//                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
//                 style={{
//                   backgroundColor:
//                     editor.getAttributes("textStyle").color || "transparent",
//                 }}
//               />
//             </button>
//             {showColorPicker && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleUnsetTextColor();
//                   }}
//                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
//                 >
//                   Remove Color
//                 </button>
//                 {COLORS.map((color) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleSetTextColor(color);
//                     }}
//                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
//                     style={{
//                       backgroundColor: color,
//                       border:
//                         color === "#FFFFFF"
//                           ? "1px solid #ddd"
//                           : "1px solid transparent",
//                       outline:
//                         editor.getAttributes("textStyle").color === color
//                           ? "2px solid #2563eb"
//                           : "none",
//                       outlineOffset: "2px",
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Background (Highlight) Color */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowBgColorPicker((v) => !v);
//                 setShowColorPicker(false);
//                 setShowHighlighter(false);
//               }}
//               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
//               title="Background Color"
//             >
//               <MdFormatColorFill size={18} />
//               <span
//                 className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
//                 style={{
//                   backgroundColor:
//                     editor.getAttributes("highlight").color || "transparent",
//                 }}
//               />
//             </button>
//             {showBgColorPicker && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleUnsetHighlight();
//                   }}
//                   className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
//                 >
//                   Remove Background
//                 </button>
//                 {COLORS.map((color) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       handleSetHighlight(color);
//                     }}
//                     className="w-8 h-8 rounded hover:scale-110 transition-transform"
//                     style={{
//                       backgroundColor: color,
//                       border:
//                         color === "#FFFFFF"
//                           ? "1px solid #ddd"
//                           : "1px solid transparent",
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Highlighter Pen */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 setShowHighlighter((v) => !v);
//                 setShowColorPicker(false);
//                 setShowBgColorPicker(false);
//               }}
//               className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
//               style={
//                 editor.isActive("highlight")
//                   ? {
//                       backgroundColor:
//                         editor.getAttributes("highlight").color || "#FEF08A",
//                       color: "#000",
//                     }
//                   : {}
//               }
//               title="Highlighter"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M12 20h9" />
//                 <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//               </svg>
//             </button>
//             {showHighlighter && (
//               <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
//                 <span className="text-xs text-gray-400 font-medium px-1 mb-1">
//                   Highlight Color
//                 </span>
//                 {HIGHLIGHT_COLORS.map(({ color, label }) => (
//                   <button
//                     key={color}
//                     onMouseDown={(e) => {
//                       e.preventDefault();
//                       editor.chain().focus().setHighlight({ color }).run();
//                       setShowHighlighter(false);
//                     }}
//                     className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
//                   >
//                     <span
//                       className="w-5 h-5 rounded-sm border flex-shrink-0"
//                       style={{
//                         backgroundColor: color,
//                         borderColor:
//                           editor.getAttributes("highlight").color === color
//                             ? "#2563eb"
//                             : "#e5e7eb",
//                         outline:
//                           editor.getAttributes("highlight").color === color
//                             ? "2px solid #2563eb"
//                             : "none",
//                         outlineOffset: "2px",
//                       }}
//                     />
//                     {label}
//                   </button>
//                 ))}
//                 <button
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     editor.chain().focus().unsetHighlight().run();
//                     setShowHighlighter(false);
//                   }}
//                   className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
//                 >
//                   <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
//                   Remove
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Bold */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBold().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Bold"
//           >
//             <FiBold size={16} />
//           </button>

//           {/* Italic */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleItalic().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Italic"
//           >
//             <FiItalic size={16} />
//           </button>

//           {/* Underline */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleUnderline().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Underline"
//           >
//             <FiUnderline size={16} />
//           </button>

//           {/* Clear Formatting */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               clearFormatting();
//             }}
//             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
//             title="Clear Formatting"
//           >
//             <MdFormatClear size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Heading Select */}
//           <select
//             onChange={(e) => {
//               const val = e.target.value;
//               if (val === "paragraph")
//                 editor.chain().focus().setParagraph().run();
//               else
//                 editor
//                   .chain()
//                   .focus()
//                   .toggleHeading({ level: parseInt(val) })
//                   .run();
//             }}
//             value={currentHeading}
//             className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
//           >
//             <option value="paragraph">Normal</option>
//             <option value="1">Heading 1</option>
//             <option value="2">Heading 2</option>
//             <option value="3">Heading 3</option>
//             <option value="4">Heading 4</option>
//           </select>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Align Left */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("left").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignLeft size={16} />
//           </button>
//           {/* Align Center */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("center").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignCenter size={16} />
//           </button>
//           {/* Align Right */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setTextAlign("right").run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//           >
//             <FiAlignRight size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Bullet List */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBulletList().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Bullet List"
//           >
//             <FiList size={16} />
//           </button>

//           {/* Ordered List */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleOrderedList().run();
//             }}
//             className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Numbered List"
//           >
//             1.
//           </button>

//           {/* Blockquote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleBlockquote().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Blockquote"
//           >
//             <MdFormatQuote size={16} />
//           </button>

//           {/* Code Block */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().toggleCodeBlock().run();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Code Block"
//           >
//             <FiCode size={16} />
//           </button>

//           {/* Horizontal Rule */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               editor.chain().focus().setHorizontalRule().run();
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Horizontal Rule"
//           >
//             <FiMinus size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//           {/* Table */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               addTable();
//             }}
//             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Insert Table"
//           >
//             <div className="grid grid-cols-2 gap-[2px]">
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
//             </div>
//             <span className="text-sm font-medium">Table</span>
//           </button>

//           {/* Image */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               addImage();
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700"
//             title="Insert Image"
//           >
//             <FiImage size={16} />
//           </button>

//           {/* Link button */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               openLinkDialog();
//             }}
//             className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
//             title="Insert Link"
//           >
//             <FiLinkIcon size={16} />
//           </button>

//           {/* Single Quote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               const { from, to } = editor.state.selection;
//               if (from === to) {
//                 editor.chain().focus().insertContent("''").run();
//               } else {
//                 const selectedText = editor.state.doc.textBetween(from, to);
//                 editor.chain().focus().insertContent(`'${selectedText}'`).run();
//               }
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
//             title="Single Quotes"
//           >
//             '&thinsp;'
//           </button>

//           {/* Double Quote */}
//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               const { from, to } = editor.state.selection;
//               if (from === to) {
//                 editor.chain().focus().insertContent('""').run();
//               } else {
//                 const selectedText = editor.state.doc.textBetween(from, to);
//                 editor.chain().focus().insertContent(`"${selectedText}"`).run();
//               }
//             }}
//             className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
//             title="Double Quotes"
//           >
//             "&thinsp;"
//           </button>

//           {editor.isActive("link") && (
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault();
//                 removeLink();
//               }}
//               className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
//               title="Remove Link"
//             >
//               Remove Link
//             </button>
//           )}

//           {/* Table Controls — shown only when inside a table */}
//           {editor.isActive("table") && (
//             <>
//               <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
//               {[
//                 {
//                   label: "+ Row ↑",
//                   action: () => editor.chain().focus().addRowBefore().run(),
//                 },
//                 {
//                   label: "+ Row ↓",
//                   action: () => editor.chain().focus().addRowAfter().run(),
//                 },
//                 {
//                   label: "+ Col ←",
//                   action: () => editor.chain().focus().addColumnBefore().run(),
//                 },
//                 {
//                   label: "+ Col →",
//                   action: () => editor.chain().focus().addColumnAfter().run(),
//                 },
//               ].map(({ label, action }) => (
//                 <button
//                   key={label}
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     action();
//                   }}
//                   className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
//                 >
//                   {label}
//                 </button>
//               ))}
//               {[
//                 {
//                   label: "- Row",
//                   action: () => editor.chain().focus().deleteRow().run(),
//                 },
//                 {
//                   label: "- Col",
//                   action: () => editor.chain().focus().deleteColumn().run(),
//                 },
//                 {
//                   label: "Delete Table",
//                   action: () => editor.chain().focus().deleteTable().run(),
//                 },
//               ].map(({ label, action }) => (
//                 <button
//                   key={label}
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     action();
//                   }}
//                   className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
//                 >
//                   {label}
//                 </button>
//               ))}
//             </>
//           )}
//         </div>

//         <div className="mx-auto max-w-[1300px] my-4">
//           <EditorContent editor={editor} />
//         </div>

//         <style>{`
//         .editor-wrapper .editor-content:focus {
//           outline: none;
//         }

//         .editor-wrapper .editor-content {
//           caret-color: #2563EB;
//           cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
//         }

//         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #adb5bd;
//           pointer-events: none;
//           height: 0;
//         }

//         .editor-wrapper .editor-content ::selection {
//           background-color: rgba(59, 130, 246, 0.3) !important;
//           color: inherit !important;
//         }

//         .editor-wrapper mark {
//           padding: 0.1em 0;
//           border-radius: 2px;
//         }

//         .editor-wrapper .custom-link,
//         .editor-wrapper a {
//           color: #2563eb !important;
//           text-decoration: underline !important;
//           cursor: pointer !important;
//         }
//         .editor-wrapper .custom-link:hover,
//         .editor-wrapper a:hover {
//           color: #1d4ed8 !important;
//         }

//         .editor-wrapper table {
//           border-collapse: collapse;
//           width: 100%;
//           margin: 1rem 0;
//           table-layout: fixed;
//         }
//         .editor-wrapper td,
//         .editor-wrapper th {
//           border: 1px solid #d1d5db;
//           padding: 8px 12px;
//           position: relative;
//         }
//         .editor-wrapper th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .editor-wrapper .selectedCell::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: rgba(59, 130, 246, 0.15);
//           pointer-events: none;
//         }

//         .editor-wrapper .editor-content p {
//           margin: 0 0 0.75rem;
//           line-height: 1.6;
//         }

//         .editor-wrapper .editor-content ul {
//           list-style-type: disc;
//           padding-left: 1.75rem;
//           margin: 0 0 0.75rem;
//         }
//         .editor-wrapper .editor-content ol {
//           list-style-type: decimal;
//           padding-left: 1.75rem;
//           margin: 0 0 0.75rem;
//         }
//         .editor-wrapper .editor-content li {
//           margin-bottom: 0.25rem;
//           line-height: 1.6;
//         }
//         .editor-wrapper .editor-content li p {
//           margin: 0;
//         }

//         .editor-wrapper .editor-content blockquote {
//           border-left: 4px solid #3b82f6;
//           padding: 0.5rem 1rem;
//           margin: 1rem 0;
//           color: #4b5563;
//           font-style: italic;
//           background-color: #f8fafc;
//           border-radius: 0 4px 4px 0;
//         }
//         .editor-wrapper .editor-content blockquote p {
//           margin: 0;
//         }

//         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
//         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
//         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
//         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

//         .editor-wrapper .editor-content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.5rem;
//           margin: 0.5rem 0;
//         }

//         .editor-wrapper .editor-content pre {
//           background-color: #1f2937;
//           color: #f3f4f6;
//           padding: 1rem;
//           border-radius: 0.5rem;
//           overflow-x: auto;
//           font-family: monospace;
//           font-size: 0.875rem;
//           margin: 1rem 0;
//         }
//         .editor-wrapper .editor-content code:not(pre code) {
//           background-color: #f3f4f6;
//           padding: 0.125rem 0.3rem;
//           border-radius: 0.25rem;
//           font-family: monospace;
//           font-size: 0.875rem;
//           color: #dc2626;
//         }

//         .editor-wrapper .editor-content hr {
//           margin: 1.5rem 0;
//           border: none;
//           border-top: 2px solid #e5e7eb;
//         }
//       `}</style>
//       </div>
//     );
//   },
// );

// CustomEditor.displayName = "CustomEditor";

// export default CustomEditor;

import { memo, useEffect, useState } from "react";

// =========================
// Tiptap Core
// =========================
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// =========================
// Tiptap Extensions
// =========================
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import FontFamily from "@tiptap/extension-font-family";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// =========================
// Lowlight + Highlight.js
// =========================
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("html", xml);
lowlight.register("xml", xml);
lowlight.register("css", css);
lowlight.register("json", json);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);
lowlight.register("bash", bash);
lowlight.register("shell", bash);

// =========================
// FIX 1: Custom FontSize Extension
// =========================
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const BackgroundColor = Extension.create({
  name: "backgroundColor",
  addOptions() {
    return { types: ["paragraph", "heading"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor || element.style.background || null,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },
});

// ADD: Custom BorderBottom Extension for underlines
const BorderBottom = Extension.create({
  name: "borderBottom",
  addOptions() {
    return { types: ["paragraph", "heading"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          borderBottom: {
            default: null,
            parseHTML: (element) => {
              const style = element.getAttribute("style") || "";
              const match = style.match(/border-bottom:\s*([^;]+)/i);
              return match ? match[1].trim() : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.borderBottom) return {};
              return {
                style: `border-bottom: ${attributes.borderBottom}`,
              };
            },
          },
        },
      },
    ];
  },
});

// =========================
// React Icons
// =========================
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiImage,
  FiCode,
  FiMinus,
  FiLink as FiLinkIcon,
} from "react-icons/fi";
import {
  MdFormatColorText,
  MdFormatColorFill,
  MdFormatQuote,
  MdFormatClear,
} from "react-icons/md";

const COLORS = [
  "#000000",
  "#DC2626",
  "#059669",
  "#2563EB",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#4B5563",
  "#FFFFFF",
  "#FCD34D",
  "#F97316",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#8B5CF6",
];

const HIGHLIGHT_COLORS = [
  { color: "#FEF08A", label: "Yellow" },
  { color: "#86EFAC", label: "Green" },
  { color: "#FDA4AF", label: "Pink" },
  { color: "#93C5FD", label: "Blue" },
  { color: "#FED7AA", label: "Orange" },
  { color: "#E9D5FF", label: "Purple" },
];

function cleanPastedHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("*").forEach((el) => {
    const style = el.getAttribute("style") || "";

    if (
      style.includes("border-bottom") ||
      style.includes("mso-border-bottom")
    ) {
      console.log("FOUND BORDER:", el.tagName, style);
    }
  });

  // 0) Convert legacy "align" attribute (Word/old-HTML) into text-align style
  doc.querySelectorAll("[align]").forEach((el) => {
    const alignVal = el.getAttribute("align");
    if (alignVal) {
      const existing = el.getAttribute("style") || "";
      const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
      el.setAttribute("style", `${existing}${sep}text-align: ${alignVal};`);
    }
    el.removeAttribute("align");
  });

  // 0a) NEW: Convert common alignment utility classes (Tailwind etc.)
  //     into inline text-align style, since these are often what's
  //     actually present when copying from a rendered web page
  //     (e.g. class="text-center") rather than inline style or align=.
  const CLASS_ALIGN_MAP = {
    "text-left": "left",
    "text-center": "center",
    "text-right": "right",
    "text-justify": "justify",
  };
  doc.querySelectorAll("[class]").forEach((el) => {
    const classes = (el.getAttribute("class") || "").split(/\s+/);
    const found = classes.find((c) => CLASS_ALIGN_MAP[c]);
    if (found) {
      const existing = el.getAttribute("style") || "";
      if (!/text-align\s*:/i.test(existing)) {
        const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
        el.setAttribute(
          "style",
          `${existing}${sep}text-align: ${CLASS_ALIGN_MAP[found]};`,
        );
      }
    }
  });

  // 0b) NEW: Push inherited text-align down from ANY ancestor (div, td,
  //     span, whatever) onto block-level elements (p / h1-h6) that don't
  //     already define their own text-align. MUST run before table
  //     unwrapping / before Tiptap parses, because Tiptap only keeps
  //     alignment that lives directly on the <p>/<h*> — anything sitting
  //     on a wrapper that later gets dropped is otherwise lost silently.
  doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((block) => {
    const ownStyle = block.getAttribute("style") || "";
    if (/text-align\s*:/i.test(ownStyle)) return; // already has its own, don't override

    let node = block.parentElement;
    while (node && node !== doc.body) {
      const style = node.getAttribute("style") || "";
      const match = style.match(/text-align\s*:\s*([^;]+)/i);
      if (match) {
        const align = match[1].trim();
        const sep = ownStyle && !ownStyle.trim().endsWith(";") ? "; " : "";
        block.setAttribute("style", `${ownStyle}${sep}text-align: ${align};`);
        break;
      }
      node = node.parentElement;
    }
  });

  // 1) Repeatedly unwrap tables whose cells have no real tabular data
  let guard = 0;
  let changed = true;
  while (changed && guard < 15) {
    changed = false;
    guard++;
    const tables = Array.from(doc.querySelectorAll("table"));
    tables.forEach((table) => {
      const rows = table.querySelectorAll("tr");
      const cells = table.querySelectorAll("td, th");
      const maxCellsInARow = Math.max(
        0,
        ...Array.from(rows).map((r) => r.querySelectorAll("td, th").length),
      );
      const isLayoutTable = rows.length <= 1 || maxCellsInARow <= 1;

      if (isLayoutTable && cells.length > 0) {
        const fragment = doc.createDocumentFragment();

        cells.forEach((cell) => {
          const cellStyle = cell.getAttribute("style") || "";

          // Background color preserve
          const bgMatch = cellStyle.match(
            /background(?:-color)?\s*:\s*([^;]+)/i,
          );
          const bgColor = bgMatch ? bgMatch[1].trim() : null;

          // IMPORTANT: preserve border-bottom specifically
          const borderBottomMatch = cellStyle.match(
            /border-bottom\s*:\s*([^;]+)/i,
          );
          const borderBottom = borderBottomMatch
            ? borderBottomMatch[1].trim()
            : null;

          // text-align is already handled by step 0b above (ancestor walk),
          // so we don't need to re-extract it here.

          Array.from(cell.childNodes).forEach((node) => {
            if (node.nodeType === 1) {
              const existing = node.getAttribute("style") || "";
              const styles = [];

              if (existing.trim()) {
                styles.push(existing.trim().replace(/;$/, ""));
              }

              if (bgColor && !/background(?:-color)?\s*:/i.test(existing)) {
                styles.push(`background-color:${bgColor}`);
              }

              if (borderBottom && !/border-bottom\s*:/i.test(existing)) {
                styles.push(`border-bottom:${borderBottom}`);
              }

              node.setAttribute(
                "style",
                styles.join("; ") + (styles.length ? ";" : ""),
              );

              console.log(
                "MOVING STYLE:",
                node.tagName,
                node.getAttribute("style"),
              );
            }

            fragment.appendChild(node);
          });
        });

        table.replaceWith(fragment);
        changed = true;
      }
    });
  }

  // 2) Split paragraphs where a numbering span like "3." / "4." sits
  //    in the MIDDLE of a <p> instead of at the start
  doc.querySelectorAll("p").forEach((p) => {
    const spans = Array.from(p.querySelectorAll("span"));
    const numberSpans = spans.filter((s) =>
      /^\d{1,2}[.)]$/.test(s.textContent.trim()),
    );

    if (numberSpans.length > 1) {
      const parent = p.parentNode;
      let current = doc.createElement("p");
      Array.from(p.attributes).forEach((attr) =>
        current.setAttribute(attr.name, attr.value),
      );
      const splitMarkers = new Set(numberSpans.slice(1));
      const newParagraphs = [current];

      Array.from(p.childNodes).forEach((node) => {
        if (splitMarkers.has(node)) {
          current = doc.createElement("p");
          Array.from(p.attributes).forEach((attr) =>
            current.setAttribute(attr.name, attr.value),
          );
          newParagraphs.push(current);
        }
        current.appendChild(node);
      });

      newParagraphs.forEach((np) => parent.insertBefore(np, p));
      parent.removeChild(p);
    }
  });

  // 2b) FIX: If a paragraph ends with text like "able to:" followed by
  //    a numbered list item "1. Identify...", split them into separate paragraphs
  doc.querySelectorAll("p").forEach((p) => {
    const textContent = p.textContent.trim();
    if (textContent.match(/able\s+to:\s*\d+\./i)) {
      const parent = p.parentNode;
      const parts = [];

      const nodes = Array.from(p.childNodes);
      let currentPara = doc.createElement("p");
      Array.from(p.attributes).forEach((attr) =>
        currentPara.setAttribute(attr.name, attr.value),
      );

      nodes.forEach((node) => {
        const isNumberNode =
          node.nodeType === 1 && /^\d{1,2}[.)]$/.test(node.textContent.trim());

        if (isNumberNode) {
          if (currentPara.childNodes.length > 0) {
            parts.push(currentPara);
          }
          currentPara = doc.createElement("p");
          Array.from(p.attributes).forEach((attr) =>
            currentPara.setAttribute(attr.name, attr.value),
          );
        }
        currentPara.appendChild(node);
      });

      if (currentPara.childNodes.length > 0) {
        parts.push(currentPara);
      }

      if (parts.length > 1) {
        parts.forEach((part) => parent.insertBefore(part, p));
        parent.removeChild(p);
      }
    }
  });

  // 3) Keep Word's manual "1." "2." numbering text visible as plain text
  doc.querySelectorAll("span").forEach((span) => {
    const t = span.textContent.trim();
    if (/^\d{1,2}[.)]$/.test(t)) {
      const textNode = doc.createTextNode(`${t} `);
      span.replaceWith(textNode);
    }
  });

  // 4) Remove empty spacing paragraphs
  doc.querySelectorAll("p").forEach((p) => {
    const hasMedia = p.querySelector("img, table");
    const isEmptyText = p.textContent.replace(/\u00a0/g, "").trim() === "";
    if (isEmptyText && !hasMedia) {
      p.remove();
    }
  });

  // 4b) Collapse leftover Word tab-stop runs of &nbsp;
  doc.querySelectorAll("span").forEach((span) => {
    const raw = span.textContent;
    if (raw && /^[\u00a0\s]+$/.test(raw) && raw.includes("\u00a0")) {
      span.replaceWith(doc.createTextNode(" "));
    }
  });

  // 5) Strip inline width/min-width/border junk on tables EXCEPT keep border-bottom
  //    for underlines and keep text-align and background-color
  doc.querySelectorAll("table, colgroup, col, td, th").forEach((el) => {
    el.removeAttribute("width");
    if (
      el.tagName === "TABLE" ||
      el.tagName === "COLGROUP" ||
      el.tagName === "COL"
    ) {
      el.removeAttribute("style");
    }
  });

  // 5b) Clean up inline styles on paragraphs but PRESERVE
  //     text-align, background-color, color, font-size
  //     EXCLUDE: border-bottom from table cells (unwanted underlines)
  doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6").forEach((el) => {
    const style = el.getAttribute("style") || "";
    const preserved = [];

    const textAlignMatch = style.match(/text-align:\s*([^;]+)/i);
    if (textAlignMatch) {
      preserved.push(`text-align: ${textAlignMatch[1].trim()}`);
    }

    const bgColorMatch = style.match(/background(?:-color)?\s*:\s*([^;]+)/i);
    if (bgColorMatch) {
      preserved.push(`background-color: ${bgColorMatch[1].trim()}`);
    }

    // Skip border-bottom (it's from table cells, not user intent)
    // but keep other borders if needed
    const borderMatch = style.match(
      /(border(?:-top|-left|-right)?)\s*:\s*([^;]+)/i,
    );
    if (borderMatch) {
      preserved.push(`${borderMatch[1]}: ${borderMatch[2].trim()}`);
    }

    const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
    if (colorMatch) {
      preserved.push(`color: ${colorMatch[1].trim()}`);
    }

    const fontSizeMatch = style.match(/font-size\s*:\s*([^;]+)/i);
    if (fontSizeMatch) {
      preserved.push(`font-size: ${fontSizeMatch[1].trim()}`);
    }

    if (preserved.length) {
      el.setAttribute("style", preserved.join("; ") + ";");
    } else {
      el.removeAttribute("style");
    }
  });

  // ==================================================
  // FIX 1: Merge orphaned bullets with following content
  // (happens when bullets come from table cells)
  // Handles multiple consecutive orphaned bullets
  // ==================================================
  let allPs = Array.from(doc.querySelectorAll("p"));

  // Keep removing orphaned bullets until none remain
  let hasOrphaned = true;
  let iterations = 0;
  while (hasOrphaned && iterations < 20) {
    iterations++;
    hasOrphaned = false;
    allPs = Array.from(doc.querySelectorAll("p"));

    for (let i = 0; i < allPs.length; i++) {
      const p = allPs[i];
      const html = p.innerHTML;

      // Check if this is an orphaned bullet (bullet + only whitespace/br)
      const hasBullet = /[●·]/.test(html);
      const textContent = p.textContent.replace(/[●·\s\t\u00a0]/g, "").trim();

      if (hasBullet && !textContent) {
        hasOrphaned = true;

        // Extract the bullet character and styling
        const bulletMatch = html.match(/[●·]/);
        const bullet = bulletMatch ? bulletMatch[0] : "●";
        const bulletSpan = `<span style="color: rgb(51, 65, 85); font-size: 10pt;">${bullet}</span>`;
        const spacer = `<span style="display: inline-block; width: 0.5em;"></span>`;

        // Find the NEXT non-orphaned paragraph with actual content
        let nextP = p.nextElementSibling;
        let foundContent = false;

        while (nextP && nextP.tagName === "P") {
          const nextHtml = nextP.innerHTML;
          const nextText = nextP.textContent
            .replace(/[●·\s\t\u00a0]/g, "")
            .trim();
          const nextHasBullet = /[●·]/.test(nextHtml);

          // Skip other orphaned bullets - keep looking
          if (nextHasBullet && !nextText) {
            nextP = nextP.nextElementSibling;
            continue;
          }

          // Found a real content paragraph!
          if (nextText && nextText.length > 0) {
            // Prepend bullet to this paragraph
            nextP.innerHTML = bulletSpan + spacer + nextP.innerHTML;

            // Remove border-bottom style (from table cells)
            const currentStyle = nextP.getAttribute("style") || "";
            const cleanedStyle = currentStyle
              .replace(/border-bottom:\s*[^;]+;?/gi, "")
              .replace(/;\s*;/g, ";")
              .trim();

            if (cleanedStyle) {
              nextP.setAttribute("style", cleanedStyle);
            } else {
              nextP.removeAttribute("style");
            }

            foundContent = true;
            break;
          }

          nextP = nextP.nextElementSibling;
        }

        // Remove the orphaned bullet paragraph
        p.remove();
        break; // Restart the loop since we modified the DOM
      }
    }
  }

  // ==================================================
  // FIX 2: Add bullets to list continuation paragraphs
  // If a paragraph follows a bullet item but has no bullet itself, add one
  // (fallback for items that FIX 1 couldn't merge)
  // ==================================================
  let allPsAfterMerge = Array.from(doc.querySelectorAll("p"));
  let inBulletList = false;

  for (let i = 0; i < allPsAfterMerge.length; i++) {
    const p = allPsAfterMerge[i];
    const html = p.innerHTML;
    const text = p.textContent.trim();

    // Skip empty paragraphs and headings
    if (!text || p.tagName !== "P") continue;

    const hasBullet = /[●·]/.test(html);

    if (hasBullet) {
      // This paragraph has a bullet - we're in a list
      inBulletList = true;
    } else if (inBulletList && text) {
      // We're in a list but this paragraph has no bullet - add one!

      // Check if this looks like it should be in the list
      // (same styling as bullet items, not a heading, etc.)
      const style = p.getAttribute("style") || "";

      // Add bullet to this paragraph
      const bulletSpan = `<span style="color: rgb(51, 65, 85); font-size: 10pt;">●</span>`;
      const spacer = `<span style="display: inline-block; width: 0.5em;"></span>`;
      p.innerHTML = bulletSpan + spacer + html;
    }
  }
  doc.querySelectorAll("p").forEach((p) => {
    const html = p.innerHTML;

    // Check for inline bullet characters (● or ·)
    if (/[●·]/.test(html)) {
      const bulletCount = (html.match(/[●·]/g) || []).length;

      // Only split if we have 2+ bullets inline
      if (bulletCount >= 2) {
        const fragment = doc.createDocumentFragment();

        // Split HTML by bullet characters, preserving all formatting
        const parts = html.split(/●|·/);

        // First part (text before first bullet) goes into opening paragraph
        if (parts[0].trim()) {
          const openingP = doc.createElement("p");
          Array.from(p.attributes).forEach((attr) =>
            openingP.setAttribute(attr.name, attr.value),
          );
          openingP.innerHTML = parts[0].trim();
          fragment.appendChild(openingP);
        }

        // Each subsequent part becomes a new bullet paragraph
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];

          // Clean up the part: remove leading/trailing whitespace and tabs,
          // but preserve the formatting inside
          const cleanedPart = part.replace(/^[\s\t\u00a0]+/, "").trim();

          // Only create bullet if there's actual content
          if (cleanedPart && cleanedPart.length > 0) {
            const bulletP = doc.createElement("p");
            Array.from(p.attributes).forEach((attr) =>
              bulletP.setAttribute(attr.name, attr.value),
            );
            // Preserve the bullet with proper spacing and keep all original formatting
            bulletP.innerHTML = `<span style="color: rgb(51, 65, 85); font-size: 10pt;">●</span><span style="display: inline-block; width: 0.5em;"></span>${cleanedPart}`;
            fragment.appendChild(bulletP);
          }
        }

        if (fragment.childNodes.length > 0) {
          p.replaceWith(fragment);
        }
      }
    }
  });

  // ============================================
  // FIX WORD TABLE BULLETS
  // ============================================
  doc.querySelectorAll("p").forEach((p) => {
    const next = p.nextElementSibling;

    if (!next) return;

    const bulletText = p.textContent.replace(/\s/g, "");

    const onlyBullets = bulletText && /^([·•])+$/u.test(bulletText);

    if (!onlyBullets) return;

    const lines = next.innerHTML
      .split(/<br\s*\/?>/i)
      .map((x) => x.trim())
      .filter(Boolean);

    if (!lines.length) return;

    const fragment = doc.createDocumentFragment();

    lines.forEach((line) => {
      const bulletLine = doc.createElement("p");
      bulletLine.innerHTML = `• ${line}`;
      fragment.appendChild(bulletLine);
    });

    p.replaceWith(fragment);
    next.remove();
  });

  console.log(
    "FINAL BORDER COUNT:",
    (doc.body.innerHTML.match(/border-bottom/gi) || []).length,
  );

  return doc.body.innerHTML;
}

const CustomEditor = memo(
  ({ value, onChange, placeholder, minHeight = "300px" }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);
    const [showHighlighter, setShowHighlighter] = useState(false);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
          codeBlock: false,
          blockquote: true,
          orderedList: {
            keepMarks: true,
            keepAttributes: true,
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: true,
          },
          underline: false,
          link: false,
          horizontalRule: false,
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
        }),
        Highlight.configure({ multicolor: true }),
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        BackgroundColor,
        BorderBottom, // ADD: For underlines
        Link.configure({
          openOnClick: false,
          linkOnPaste: true,
          autolink: true,
          HTMLAttributes: {
            class: "custom-link",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Placeholder.configure({
          placeholder: placeholder || "Write something...",
        }),
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,
        HorizontalRule,
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content: value || "",
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
        console.log("===== TIPTAP HTML (after edit) =====");
        console.log(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: "editor-content",
          style: `min-height: ${minHeight}; padding: 1rem;`,
        },
        transformPastedHTML(html) {
          console.log("===== RAW HTML =====");

          console.log("RAW border-bottom:", html.includes("border-bottom"));

          console.log(
            "RAW mso-border-bottom:",
            html.includes("mso-border-bottom"),
          );

          console.log("RAW table:", html.includes("<table"));

          const cleaned = cleanPastedHTML(html);

          console.log("===== CLEANED HTML =====");

          console.log(
            "CLEANED border-bottom:",
            cleaned.includes("border-bottom"),
          );

          console.log(
            "CLEANED mso-border-bottom:",
            cleaned.includes("mso-border-bottom"),
          );

          console.log("CLEANED table:", cleaned.includes("<table"));

          return cleaned;
        },
      },
    });

    // Sync external value changes
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "", false);
      }
    }, [editor, value]);

    // Close pickers on outside click
    useEffect(() => {
      const handler = (e) => {
        if (!e.target.closest(".color-picker-wrapper")) {
          setShowColorPicker(false);
          setShowBgColorPicker(false);
          setShowHighlighter(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    if (!editor) {
      return (
        <div
          className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
          style={{ minHeight }}
        >
          <div className="text-gray-400">Loading editor...</div>
        </div>
      );
    }

    const addTable = () => {
      const rows = prompt("Number of rows:", "3");
      const cols = prompt("Number of columns:", "3");
      if (rows && cols) {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: parseInt(rows),
            cols: parseInt(cols),
            withHeaderRow: true,
          })
          .run();
      }
    };

    const addImage = () => {
      const url = prompt("Enter image URL:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const openLinkDialog = () => {
      const url = window.prompt("Enter link URL:");
      if (!url) return;
      const href = url.startsWith("http") ? url : `https://${url}`;
      const { from, to } = editor.state.selection;
      if (from === to) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${href}">${href}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href }).run();
      }
    };

    const removeLink = () => {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    };

    const setFontSize = (size) => {
      if (size === "default") {
        editor.chain().focus().unsetFontSize().run();
      } else {
        editor.chain().focus().setFontSize(size).run();
      }
    };

    const handleSetTextColor = (color) => {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    };

    const handleUnsetTextColor = () => {
      editor.chain().focus().unsetColor().run();
      setShowColorPicker(false);
    };

    const handleSetHighlight = (color) => {
      editor.chain().focus().setHighlight({ color }).run();
      setShowBgColorPicker(false);
    };

    const handleUnsetHighlight = () => {
      editor.chain().focus().unsetHighlight().run();
      setShowBgColorPicker(false);
    };

    const clearFormatting = () => {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    };

    const currentHeading = (() => {
      for (let i = 1; i <= 4; i++) {
        if (editor.isActive("heading", { level: i })) return String(i);
      }
      return "paragraph";
    })();

    return (
      <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
        {/* ── Toolbar ── */}
        <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
          {/* Font Family */}
          <select
            onChange={(e) => {
              const font = e.target.value;
              if (font === "default")
                editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(font).run();
            }}
            className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
          >
            <option value="default">Font Family</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>

          {/* Font Size */}
          <select
            onChange={(e) => setFontSize(e.target.value)}
            className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
            defaultValue="default"
          >
            <option value="default">Font Size</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Text Color */}
          <div className="relative color-picker-wrapper">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowColorPicker((v) => !v);
                setShowBgColorPicker(false);
                setShowHighlighter(false);
              }}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
              title="Text Color"
            >
              <MdFormatColorText size={18} />
              <span
                className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
                style={{
                  backgroundColor:
                    editor.getAttributes("textStyle").color || "transparent",
                }}
              />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleUnsetTextColor();
                  }}
                  className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
                >
                  Remove Color
                </button>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSetTextColor(color);
                    }}
                    className="w-8 h-8 rounded hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color,
                      border:
                        color === "#FFFFFF"
                          ? "1px solid #ddd"
                          : "1px solid transparent",
                      outline:
                        editor.getAttributes("textStyle").color === color
                          ? "2px solid #2563eb"
                          : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Background (Highlight) Color */}
          <div className="relative color-picker-wrapper">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowBgColorPicker((v) => !v);
                setShowColorPicker(false);
                setShowHighlighter(false);
              }}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 relative"
              title="Background Color"
            >
              <MdFormatColorFill size={18} />
              <span
                className="absolute bottom-0.5 left-1 right-1 h-[3px] rounded-full"
                style={{
                  backgroundColor:
                    editor.getAttributes("highlight").color || "transparent",
                }}
              />
            </button>
            {showBgColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 grid grid-cols-5 gap-1 min-w-[150px]">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleUnsetHighlight();
                  }}
                  className="col-span-5 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded"
                >
                  Remove Background
                </button>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSetHighlight(color);
                    }}
                    className="w-8 h-8 rounded hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color,
                      border:
                        color === "#FFFFFF"
                          ? "1px solid #ddd"
                          : "1px solid transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlighter Pen */}
          <div className="relative color-picker-wrapper">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowHighlighter((v) => !v);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
              }}
              className={`p-2 rounded transition-colors relative ${editor.isActive("highlight") ? "ring-1 ring-yellow-500" : showHighlighter ? "bg-yellow-50" : "text-gray-700 hover:bg-gray-200"}`}
              style={
                editor.isActive("highlight")
                  ? {
                      backgroundColor:
                        editor.getAttributes("highlight").color || "#FEF08A",
                      color: "#000",
                    }
                  : {}
              }
              title="Highlighter"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
            {showHighlighter && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-20 flex flex-col gap-1 min-w-[140px]">
                <span className="text-xs text-gray-400 font-medium px-1 mb-1">
                  Highlight Color
                </span>
                {HIGHLIGHT_COLORS.map(({ color, label }) => (
                  <button
                    key={color}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().setHighlight({ color }).run();
                      setShowHighlighter(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-700"
                  >
                    <span
                      className="w-5 h-5 rounded-sm border flex-shrink-0"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          editor.getAttributes("highlight").color === color
                            ? "#2563eb"
                            : "#e5e7eb",
                        outline:
                          editor.getAttributes("highlight").color === color
                            ? "2px solid #2563eb"
                            : "none",
                        outlineOffset: "2px",
                      }}
                    />
                    {label}
                  </button>
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().unsetHighlight().run();
                    setShowHighlighter(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-sm text-gray-500 border-t mt-1 pt-2"
                >
                  <span className="w-5 h-5 rounded-sm border border-gray-300 flex-shrink-0 bg-white" />
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Bold"
          >
            <FiBold size={16} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Italic"
          >
            <FiItalic size={16} />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Underline"
          >
            <FiUnderline size={16} />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              clearFormatting();
            }}
            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
            title="Clear Formatting"
          >
            <MdFormatClear size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Heading Select */}
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val === "paragraph")
                editor.chain().focus().setParagraph().run();
              else
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: parseInt(val) })
                  .run();
            }}
            value={currentHeading}
            className="p-2 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50"
          >
            <option value="paragraph">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Align Left */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("left").run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <FiAlignLeft size={16} />
          </button>
          {/* Align Center */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <FiAlignCenter size={16} />
          </button>
          {/* Align Right */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <FiAlignRight size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Bullet List"
          >
            <FiList size={16} />
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={`p-2 rounded font-bold text-sm transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Numbered List"
          >
            1.
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Blockquote"
          >
            <MdFormatQuote size={16} />
          </button>

          {/* Code Block */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleCodeBlock().run();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Code Block"
          >
            <FiCode size={16} />
          </button>

          {/* Horizontal Rule */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().setHorizontalRule().run();
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Horizontal Rule"
          >
            <FiMinus size={16} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

          {/* Table */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addTable();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700"
            title="Insert Table"
          >
            <div className="grid grid-cols-2 gap-[2px]">
              <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
            </div>
            <span className="text-sm font-medium">Table</span>
          </button>

          {/* Image */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              addImage();
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-700"
            title="Insert Image"
          >
            <FiImage size={16} />
          </button>

          {/* Link button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              openLinkDialog();
            }}
            className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-700 ring-1 ring-blue-400" : "text-gray-700 hover:bg-gray-200"}`}
            title="Insert Link"
          >
            <FiLinkIcon size={16} />
          </button>

          {/* Single Quote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const { from, to } = editor.state.selection;
              if (from === to) {
                editor.chain().focus().insertContent("''").run();
              } else {
                const selectedText = editor.state.doc.textBetween(from, to);
                editor.chain().focus().insertContent(`'${selectedText}'`).run();
              }
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
            title="Single Quotes"
          >
            '&thinsp;'
          </button>

          {/* Double Quote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const { from, to } = editor.state.selection;
              if (from === to) {
                editor.chain().focus().insertContent('""').run();
              } else {
                const selectedText = editor.state.doc.textBetween(from, to);
                editor.chain().focus().insertContent(`"${selectedText}"`).run();
              }
            }}
            className="p-2 rounded hover:bg-gray-200 text-gray-700 font-mono text-base leading-none"
            title="Double Quotes"
          >
            "&thinsp;"
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                removeLink();
              }}
              className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
              title="Remove Link"
            >
              Remove Link
            </button>
          )}

          {/* Table Controls — shown only when inside a table */}
          {editor.isActive("table") && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
              {[
                {
                  label: "+ Row ↑",
                  action: () => editor.chain().focus().addRowBefore().run(),
                },
                {
                  label: "+ Row ↓",
                  action: () => editor.chain().focus().addRowAfter().run(),
                },
                {
                  label: "+ Col ←",
                  action: () => editor.chain().focus().addColumnBefore().run(),
                },
                {
                  label: "+ Col →",
                  action: () => editor.chain().focus().addColumnAfter().run(),
                },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    action();
                  }}
                  className="p-2 rounded hover:bg-gray-200 text-xs text-gray-700"
                >
                  {label}
                </button>
              ))}
              {[
                {
                  label: "- Row",
                  action: () => editor.chain().focus().deleteRow().run(),
                },
                {
                  label: "- Col",
                  action: () => editor.chain().focus().deleteColumn().run(),
                },
                {
                  label: "Delete Table",
                  action: () => editor.chain().focus().deleteTable().run(),
                },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    action();
                  }}
                  className="p-2 rounded hover:bg-red-100 text-red-600 text-xs"
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="mx-auto max-w-[1300px] my-4">
          <EditorContent editor={editor} />
        </div>

        <style>{`
        .editor-wrapper .editor-content:focus {
          outline: none;
        }

        .editor-wrapper .editor-content {
          caret-color: #2563EB;
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
        }

        .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .editor-wrapper .editor-content ::selection {
          background-color: rgba(59, 130, 246, 0.3) !important;
          color: inherit !important;
        }

        .editor-wrapper mark {
          padding: 0.1em 0;
          border-radius: 2px;
        }

        .editor-wrapper .custom-link,
        .editor-wrapper a {
          color: #2563eb !important;
          text-decoration: underline !important;
          cursor: pointer !important;
        }
        .editor-wrapper .custom-link:hover,
        .editor-wrapper a:hover {
          color: #1d4ed8 !important;
        }

        .editor-wrapper table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          table-layout: fixed;
        }
        .editor-wrapper td,
        .editor-wrapper th {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          position: relative;
        }
        .editor-wrapper th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .editor-wrapper .selectedCell::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(59, 130, 246, 0.15);
          pointer-events: none;
        }

        .editor-wrapper .editor-content p {
          margin: 0 0 0.75rem;
          line-height: 1.6;
        }

        .editor-wrapper .editor-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin: 0 0 0.75rem;
        }
        .editor-wrapper .editor-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin: 0 0 0.75rem;
        }
        .editor-wrapper .editor-content li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }
        .editor-wrapper .editor-content li p {
          margin: 0;
        }

        .editor-wrapper .editor-content blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          color: #4b5563;
          font-style: italic;
          background-color: #f8fafc;
          border-radius: 0 4px 4px 0;
        }
        .editor-wrapper .editor-content blockquote p {
          margin: 0;
        }

        .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
        .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
        .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

        .editor-wrapper .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }

        .editor-wrapper .editor-content pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.875rem;
          margin: 1rem 0;
        }
        .editor-wrapper .editor-content code:not(pre code) {
          background-color: #f3f4f6;
          padding: 0.125rem 0.3rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .editor-wrapper .editor-content hr {
          margin: 1.5rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
        }
      `}</style>
      </div>
    );
  },
);

CustomEditor.displayName = "CustomEditor";

export default CustomEditor;
