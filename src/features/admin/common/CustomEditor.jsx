// // // // // // import { memo, useEffect } from "react";
// // // // // // import { useEditor, EditorContent } from "@tiptap/react";
// // // // // // import StarterKit from "@tiptap/starter-kit";
// // // // // // import { Table } from "@tiptap/extension-table";
// // // // // // import { TableRow } from "@tiptap/extension-table-row";
// // // // // // import { TableCell } from "@tiptap/extension-table-cell";
// // // // // // import { TableHeader } from "@tiptap/extension-table-header";
// // // // // // import Image from "@tiptap/extension-image";
// // // // // // import Link from "@tiptap/extension-link";
// // // // // // import Placeholder from "@tiptap/extension-placeholder";
// // // // // // import Underline from "@tiptap/extension-underline";
// // // // // // // No TextAlign import
// // // // // // import {
// // // // // //   FiBold,
// // // // // //   FiItalic,
// // // // // //   FiList,
// // // // // //   FiAlignLeft,
// // // // // //   FiAlignCenter,
// // // // // //   FiAlignRight,
// // // // // //   FiTable,
// // // // // //   FiLink as FiLinkIcon,
// // // // // //   FiImage,
// // // // // // } from "react-icons/fi";

// // // // // // const CustomEditor = memo(
// // // // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // // // //     const editor = useEditor({
// // // // // //       extensions: [
// // // // // //         StarterKit.configure({
// // // // // //           heading: {
// // // // // //             levels: [1, 2, 3, 4, 5, 6],
// // // // // //           },
// // // // // //         }),
// // // // // //         Underline,
// // // // // //         // No TextAlign extension
// // // // // //         Link.configure({
// // // // // //           openOnClick: false,
// // // // // //           HTMLAttributes: {
// // // // // //             class: "text-blue-500 underline",
// // // // // //           },
// // // // // //         }),
// // // // // //         Image.configure({
// // // // // //           inline: true,
// // // // // //           allowBase64: true,
// // // // // //           HTMLAttributes: {
// // // // // //             class: "max-w-full h-auto rounded-lg",
// // // // // //           },
// // // // // //         }),
// // // // // //         Placeholder.configure({
// // // // // //           placeholder: placeholder || "Write something...",
// // // // // //         }),
// // // // // //         Table.configure({
// // // // // //           resizable: true,
// // // // // //           HTMLAttributes: {
// // // // // //             class: "min-w-full border-collapse",
// // // // // //           },
// // // // // //         }),
// // // // // //         TableRow,
// // // // // //         TableCell,
// // // // // //         TableHeader,
// // // // // //       ],
// // // // // //       content: value || "",
// // // // // //       onUpdate: ({ editor }) => {
// // // // // //         onChange(editor.getHTML());
// // // // // //       },
// // // // // //       editorProps: {
// // // // // //         attributes: {
// // // // // //           class: "prose max-w-none focus:outline-none",
// // // // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
// // // // // //         },
// // // // // //       },
// // // // // //     });

// // // // // //     // Update content when value changes externally
// // // // // //     useEffect(() => {
// // // // // //       if (editor && value !== editor.getHTML()) {
// // // // // //         editor.commands.setContent(value || "");
// // // // // //       }
// // // // // //     }, [editor, value]);

// // // // // //     if (!editor) {
// // // // // //       return (
// // // // // //         <div
// // // // // //           className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center"
// // // // // //           style={{ minHeight }}
// // // // // //         >
// // // // // //           <div className="text-gray-400">Loading editor...</div>
// // // // // //         </div>
// // // // // //       );
// // // // // //     }

// // // // // //     const addTable = () => {
// // // // // //       const rows = prompt("Number of rows:", "3");
// // // // // //       const cols = prompt("Number of columns:", "3");
// // // // // //       if (rows && cols) {
// // // // // //         editor
// // // // // //           .chain()
// // // // // //           .focus()
// // // // // //           .insertTable({
// // // // // //             rows: parseInt(rows),
// // // // // //             cols: parseInt(cols),
// // // // // //             withHeaderRow: true,
// // // // // //           })
// // // // // //           .run();
// // // // // //       }
// // // // // //     };

// // // // // //     const addImage = () => {
// // // // // //       const url = prompt("Enter image URL:");
// // // // // //       if (url) {
// // // // // //         editor.chain().focus().setImage({ src: url }).run();
// // // // // //       }
// // // // // //     };

// // // // // //     const addLink = () => {
// // // // // //       const url = prompt("Enter URL:");
// // // // // //       if (url) {
// // // // // //         editor.chain().focus().setLink({ href: url }).run();
// // // // // //       }
// // // // // //     };

// // // // // //     return (
// // // // // //       <div className="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
// // // // // //         {/* Toolbar */}
// // // // // //         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
// // // // // //           {/* Text Formatting */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleBold().run()}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Bold"
// // // // // //           >
// // // // // //             <FiBold size={16} />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleItalic().run()}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Italic"
// // // // // //           >
// // // // // //             <FiItalic size={16} />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleUnderline().run()}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Underline"
// // // // // //           >
// // // // // //             <span className="underline text-sm">U</span>
// // // // // //           </button>

// // // // // //           <div className="w-px h-6 bg-gray-300 mx-1" />

// // // // // //           {/* Headers */}
// // // // // //           <select
// // // // // //             onChange={(e) => {
// // // // // //               const val = e.target.value;
// // // // // //               if (val === "paragraph") {
// // // // // //                 editor.chain().focus().setParagraph().run();
// // // // // //               } else {
// // // // // //                 editor
// // // // // //                   .chain()
// // // // // //                   .focus()
// // // // // //                   .toggleHeading({ level: parseInt(val) })
// // // // // //                   .run();
// // // // // //               }
// // // // // //             }}
// // // // // //             className="p-1 rounded border border-gray-300 text-sm bg-white"
// // // // // //             value={(() => {
// // // // // //               if (editor.isActive("heading", { level: 1 })) return "1";
// // // // // //               if (editor.isActive("heading", { level: 2 })) return "2";
// // // // // //               if (editor.isActive("heading", { level: 3 })) return "3";
// // // // // //               if (editor.isActive("heading", { level: 4 })) return "4";
// // // // // //               return "paragraph";
// // // // // //             })()}
// // // // // //           >
// // // // // //             <option value="paragraph">Normal</option>
// // // // // //             <option value="1">Heading 1</option>
// // // // // //             <option value="2">Heading 2</option>
// // // // // //             <option value="3">Heading 3</option>
// // // // // //             <option value="4">Heading 4</option>
// // // // // //           </select>

// // // // // //           <div className="w-px h-6 bg-gray-300 mx-1" />

// // // // // //           {/* Lists */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleBulletList().run()}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Bullet List"
// // // // // //           >
// // // // // //             <FiList size={16} />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleOrderedList().run()}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Numbered List"
// // // // // //           >
// // // // // //             <span className="font-bold text-sm">1.</span>
// // // // // //           </button>

// // // // // //           <div className="w-px h-6 bg-gray-300 mx-1" />

// // // // // //           {/* Alignment Buttons - Commented out */}
// // // // // //           {/*
// // // // // //         <button
// // // // // //           type="button"
// // // // // //           onClick={() => editor.chain().focus().setTextAlign("left").run()}
// // // // // //           className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // // //           title="Align Left"
// // // // // //         >
// // // // // //           <FiAlignLeft size={16} />
// // // // // //         </button>
// // // // // //         <button
// // // // // //           type="button"
// // // // // //           onClick={() => editor.chain().focus().setTextAlign("center").run()}
// // // // // //           className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // // //           title="Align Center"
// // // // // //         >
// // // // // //           <FiAlignCenter size={16} />
// // // // // //         </button>
// // // // // //         <button
// // // // // //           type="button"
// // // // // //           onClick={() => editor.chain().focus().setTextAlign("right").run()}
// // // // // //           className="p-2 rounded hover:bg-gray-200 text-gray-700"
// // // // // //           title="Align Right"
// // // // // //         >
// // // // // //           <FiAlignRight size={16} />
// // // // // //         </button>
// // // // // //         <div className="w-px h-6 bg-gray-300 mx-1" />
// // // // // //         */}

// // // // // //           {/* Table */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={addTable}
// // // // // //             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 "
// // // // // //             title="Insert Table"
// // // // // //           >
// // // // // //             <div className="grid grid-cols-2 gap-[2px]">
// // // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // // //               <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
// // // // // //             </div>

// // // // // //             <span className="text-sm font-medium">Table</span>
// // // // // //           </button>

// // // // // //           {/* Image */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={addImage}
// // // // // //             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // // // //             title="Insert Image"
// // // // // //           >
// // // // // //             <FiImage size={16} />
// // // // // //           </button>

// // // // // //           {/* Link */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={addLink}
// // // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // // //             title="Insert Link"
// // // // // //           >
// // // // // //             <FiLinkIcon size={16} />
// // // // // //           </button>

// // // // // //           <div className="w-px h-6 bg-gray-300 mx-1" />

// // // // // //           {/* Table Operations */}
// // // // // //           {editor.isActive("table") && (
// // // // // //             <>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().addRowBefore().run()}
// // // // // //                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
// // // // // //                 title="Add Row Above"
// // // // // //               >
// // // // // //                 + Row ↑
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().addRowAfter().run()}
// // // // // //                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
// // // // // //                 title="Add Row Below"
// // // // // //               >
// // // // // //                 + Row ↓
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().addColumnBefore().run()}
// // // // // //                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
// // // // // //                 title="Add Column Left"
// // // // // //               >
// // // // // //                 + Col ←
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().addColumnAfter().run()}
// // // // // //                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
// // // // // //                 title="Add Column Right"
// // // // // //               >
// // // // // //                 + Col →
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().deleteRow().run()}
// // // // // //                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
// // // // // //                 title="Delete Row"
// // // // // //               >
// // // // // //                 - Row
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().deleteColumn().run()}
// // // // // //                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
// // // // // //                 title="Delete Column"
// // // // // //               >
// // // // // //                 - Col
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 type="button"
// // // // // //                 onClick={() => editor.chain().focus().deleteTable().run()}
// // // // // //                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
// // // // // //                 title="Delete Table"
// // // // // //               >
// // // // // //                 Delete Table
// // // // // //               </button>
// // // // // //             </>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         <EditorContent editor={editor} />

// // // // // //         <style>{`
// // // // // //         .tiptap-editor-wrapper .ProseMirror:focus {
// // // // // //           outline: none;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
// // // // // //           content: attr(data-placeholder);
// // // // // //           float: left;
// // // // // //           color: #adb5bd;
// // // // // //           pointer-events: none;
// // // // // //           height: 0;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper table {
// // // // // //           border-collapse: collapse;
// // // // // //           width: 100%;
// // // // // //           margin: 1rem 0;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper td,
// // // // // //         .tiptap-editor-wrapper th {
// // // // // //           border: 1px solid #ddd;
// // // // // //           padding: 8px;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper th {
// // // // // //           background-color: #f3f4f6;
// // // // // //           font-weight: 600;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper .selectedCell {
// // // // // //           background-color: #e0f2fe;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper p {
// // // // // //           margin: 0 0 1rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper ul,
// // // // // //         .tiptap-editor-wrapper ol {
// // // // // //           padding-left: 1.5rem;
// // // // // //           margin: 0 0 1rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper h1 {
// // // // // //           font-size: 2rem;
// // // // // //           font-weight: 700;
// // // // // //           margin: 1rem 0 0.5rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper h2 {
// // // // // //           font-size: 1.5rem;
// // // // // //           font-weight: 600;
// // // // // //           margin: 1rem 0 0.5rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper h3 {
// // // // // //           font-size: 1.25rem;
// // // // // //           font-weight: 600;
// // // // // //           margin: 0.75rem 0 0.5rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper img {
// // // // // //           max-width: 100%;
// // // // // //           height: auto;
// // // // // //           border-radius: 0.5rem;
// // // // // //         }
// // // // // //         .tiptap-editor-wrapper a {
// // // // // //           color: #3b82f6;
// // // // // //           text-decoration: underline;
// // // // // //         }
// // // // // //       `}</style>
// // // // // //       </div>
// // // // // //     );
// // // // // //   },
// // // // // // );

// // // // // // CustomEditor.displayName = "CustomEditor";

// // // // // // export default CustomEditor;

// // // // // // 19-05
// // // // // // import { memo, useEffect } from "react";
// // // // // // import { useEditor, EditorContent } from "@tiptap/react";
// // // // // // import StarterKit from "@tiptap/starter-kit";
// // // // // // import Underline from "@tiptap/extension-underline";
// // // // // // import Link from "@tiptap/extension-link";
// // // // // // import Image from "@tiptap/extension-image";
// // // // // // import Placeholder from "@tiptap/extension-placeholder";
// // // // // // import { Table } from "@tiptap/extension-table";
// // // // // // import { TableRow } from "@tiptap/extension-table-row";
// // // // // // import { TableCell } from "@tiptap/extension-table-cell";
// // // // // // import { TableHeader } from "@tiptap/extension-table-header";
// // // // // // import { TextAlign } from "@tiptap/extension-text-align";
// // // // // // import { TextStyle } from "@tiptap/extension-text-style";
// // // // // // import { Color } from "@tiptap/extension-color";
// // // // // // import { Highlight } from "@tiptap/extension-highlight";
// // // // // // import { FontFamily } from "@tiptap/extension-font-family";
// // // // // // import {
// // // // // //   FiBold,
// // // // // //   FiItalic,
// // // // // //   FiUnderline,
// // // // // //   FiImage,
// // // // // //   FiLink,
// // // // // //   FiAlignLeft,
// // // // // //   FiAlignCenter,
// // // // // //   FiAlignRight,
// // // // // //   FiAlignJustify,
// // // // // //   FiList,
// // // // // // } from "react-icons/fi";

// // // // // // const fonts = [
// // // // // //   "Arial",
// // // // // //   "Poppins",
// // // // // //   "Inter",
// // // // // //   "Georgia",
// // // // // //   "Verdana",
// // // // // //   "Tahoma",
// // // // // //   "Courier New",
// // // // // // ];

// // // // // // const colors = [
// // // // // //   "#000000",
// // // // // //   "#ef4444",
// // // // // //   "#22c55e",
// // // // // //   "#3b82f6",
// // // // // //   "#f59e0b",
// // // // // //   "#ec4899",
// // // // // //   "#8b5cf6",
// // // // // // ];

// // // // // // const CustomEditor = memo(
// // // // // //   ({ value, onChange, placeholder, minHeight = "400px" }) => {
// // // // // //     const editor = useEditor({
// // // // // //       extensions: [
// // // // // //         StarterKit.configure({
// // // // // //           heading: {
// // // // // //             levels: [1, 2, 3, 4, 5, 6],
// // // // // //           },
// // // // // //         }),

// // // // // //         Underline,

// // // // // //         TextStyle,

// // // // // //         Color,

// // // // // //         Highlight.configure({
// // // // // //           multicolor: true,
// // // // // //         }),

// // // // // //         FontFamily,

// // // // // //         TextAlign.configure({
// // // // // //           types: ["heading", "paragraph"],
// // // // // //         }),

// // // // // //         Link.configure({
// // // // // //           openOnClick: false,
// // // // // //         }),

// // // // // //         Image.configure({
// // // // // //           allowBase64: true,
// // // // // //           inline: false,
// // // // // //         }),

// // // // // //         Placeholder.configure({
// // // // // //           placeholder: placeholder || "Write something amazing...",
// // // // // //         }),

// // // // // //         Table.configure({
// // // // // //           resizable: true,
// // // // // //         }),

// // // // // //         TableRow,
// // // // // //         TableHeader,
// // // // // //         TableCell,
// // // // // //       ],

// // // // // //       content: value || "",

// // // // // //       onUpdate: ({ editor }) => {
// // // // // //         onChange(editor.getHTML());
// // // // // //       },

// // // // // //       editorProps: {
// // // // // //         attributes: {
// // // // // //           class: "custom-editor-content",
// // // // // //           style: `min-height:${minHeight}`,
// // // // // //         },
// // // // // //       },
// // // // // //     });

// // // // // //     useEffect(() => {
// // // // // //       if (editor && value !== editor.getHTML()) {
// // // // // //         editor.commands.setContent(value || "");
// // // // // //       }
// // // // // //     }, [editor, value]);

// // // // // //     if (!editor) return null;

// // // // // //     const addImage = () => {
// // // // // //       const url = prompt("Enter Image URL");

// // // // // //       if (url) {
// // // // // //         editor.chain().focus().setImage({ src: url }).run();
// // // // // //       }
// // // // // //     };

// // // // // //     const addLink = () => {
// // // // // //       const url = prompt("Enter Link");

// // // // // //       if (url) {
// // // // // //         editor.chain().focus().setLink({ href: url }).run();
// // // // // //       }
// // // // // //     };

// // // // // //     const addTable = () => {
// // // // // //       const rows = prompt("Rows", "3");
// // // // // //       const cols = prompt("Columns", "3");

// // // // // //       if (rows && cols) {
// // // // // //         editor
// // // // // //           .chain()
// // // // // //           .focus()
// // // // // //           .insertTable({
// // // // // //             rows: parseInt(rows),
// // // // // //             cols: parseInt(cols),
// // // // // //             withHeaderRow: true,
// // // // // //           })
// // // // // //           .run();
// // // // // //       }
// // // // // //     };

// // // // // //     return (
// // // // // //       <div className="editor-wrapper">
// // // // // //         {/* ================= TOOLBAR ================= */}

// // // // // //         <div className="toolbar">
// // // // // //           {/* BOLD */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleBold().run()}
// // // // // //             className={editor.isActive("bold") ? "active-btn" : ""}
// // // // // //           >
// // // // // //             <FiBold />
// // // // // //           </button>

// // // // // //           {/* ITALIC */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleItalic().run()}
// // // // // //             className={editor.isActive("italic") ? "active-btn" : ""}
// // // // // //           >
// // // // // //             <FiItalic />
// // // // // //           </button>

// // // // // //           {/* UNDERLINE */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleUnderline().run()}
// // // // // //             className={editor.isActive("underline") ? "active-btn" : ""}
// // // // // //           >
// // // // // //             <FiUnderline />
// // // // // //           </button>

// // // // // //           {/* FONT FAMILY */}
// // // // // //           <select
// // // // // //             onChange={(e) =>
// // // // // //               editor.chain().focus().setFontFamily(e.target.value).run()
// // // // // //             }
// // // // // //           >
// // // // // //             {fonts.map((font) => (
// // // // // //               <option key={font} value={font}>
// // // // // //                 {font}
// // // // // //               </option>
// // // // // //             ))}
// // // // // //           </select>

// // // // // //           {/* TEXT COLOR */}
// // // // // //           <div className="color-group">
// // // // // //             {colors.map((color) => (
// // // // // //               <button
// // // // // //                 key={color}
// // // // // //                 type="button"
// // // // // //                 className="color-btn"
// // // // // //                 style={{ background: color }}
// // // // // //                 onClick={() => editor.chain().focus().setColor(color).run()}
// // // // // //               />
// // // // // //             ))}
// // // // // //           </div>

// // // // // //           {/* HIGHLIGHT */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleHighlight().run()}
// // // // // //           >
// // // // // //             Highlight
// // // // // //           </button>

// // // // // //           {/* HEADING */}
// // // // // //           <select
// // // // // //             onChange={(e) => {
// // // // // //               const val = e.target.value;

// // // // // //               if (val === "paragraph") {
// // // // // //                 editor.chain().focus().setParagraph().run();
// // // // // //               } else {
// // // // // //                 editor
// // // // // //                   .chain()
// // // // // //                   .focus()
// // // // // //                   .toggleHeading({
// // // // // //                     level: parseInt(val),
// // // // // //                   })
// // // // // //                   .run();
// // // // // //               }
// // // // // //             }}
// // // // // //           >
// // // // // //             <option value="paragraph">Paragraph</option>
// // // // // //             <option value="1">Heading 1</option>
// // // // // //             <option value="2">Heading 2</option>
// // // // // //             <option value="3">Heading 3</option>
// // // // // //             <option value="4">Heading 4</option>
// // // // // //           </select>

// // // // // //           {/* ALIGNMENTS */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().setTextAlign("left").run()}
// // // // // //           >
// // // // // //             <FiAlignLeft />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().setTextAlign("center").run()}
// // // // // //           >
// // // // // //             <FiAlignCenter />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().setTextAlign("right").run()}
// // // // // //           >
// // // // // //             <FiAlignRight />
// // // // // //           </button>

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().setTextAlign("justify").run()}
// // // // // //           >
// // // // // //             <FiAlignJustify />
// // // // // //           </button>

// // // // // //           {/* LIST */}
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => editor.chain().focus().toggleBulletList().run()}
// // // // // //           >
// // // // // //             <FiList />
// // // // // //           </button>

// // // // // //           {/* IMAGE */}
// // // // // //           <button type="button" onClick={addImage}>
// // // // // //             <FiImage />
// // // // // //           </button>

// // // // // //           {/* LINK */}
// // // // // //           <button type="button" onClick={addLink}>
// // // // // //             <FiLink />
// // // // // //           </button>

// // // // // //           {/* TABLE */}
// // // // // //           <button type="button" onClick={addTable}>
// // // // // //             Table
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         {/* ================= TABLE TOOLBAR ================= */}

// // // // // //         {editor.isActive("table") && (
// // // // // //           <div className="table-toolbar">
// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().addRowBefore().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               + Row Top
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().addRowAfter().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               + Row Bottom
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().deleteRow().run()}
// // // // // //               className="table-btn danger"
// // // // // //             >
// // // // // //               Delete Row
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().addColumnBefore().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               + Column Left
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().addColumnAfter().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               + Column Right
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().deleteColumn().run()}
// // // // // //               className="table-btn danger"
// // // // // //             >
// // // // // //               Delete Column
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().mergeCells().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               Merge
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().splitCell().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               Split
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().toggleHeaderRow().run()}
// // // // // //               className="table-btn"
// // // // // //             >
// // // // // //               Header Row
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={() => editor.chain().focus().deleteTable().run()}
// // // // // //               className="table-btn danger"
// // // // // //             >
// // // // // //               Delete Table
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {/* ================= EDITOR ================= */}

// // // // // //         <EditorContent editor={editor} />

// // // // // //         {/* ================= STYLES ================= */}

// // // // // //         <style>{`

// // // // // //         .editor-wrapper{
// // // // // //           border:1px solid #dbeafe;
// // // // // //           border-radius:20px;
// // // // // //           overflow:hidden;
// // // // // //           background:white;
// // // // // //           box-shadow:0 10px 30px rgba(0,0,0,0.05);
// // // // // //         }

// // // // // //         .toolbar{
// // // // // //           display:flex;
// // // // // //           flex-wrap:wrap;
// // // // // //           gap:10px;
// // // // // //           padding:15px;
// // // // // //           background:#f8fafc;
// // // // // //           border-bottom:1px solid #e5e7eb;
// // // // // //         }

// // // // // //         .toolbar button,
// // // // // //         .toolbar select{
// // // // // //           border:none;
// // // // // //           background:white;
// // // // // //           padding:10px 14px;
// // // // // //           border-radius:10px;
// // // // // //           cursor:pointer;
// // // // // //           font-size:14px;
// // // // // //           transition:.2s;
// // // // // //           box-shadow:0 1px 3px rgba(0,0,0,0.08);
// // // // // //         }

// // // // // //         .toolbar button:hover,
// // // // // //         .toolbar select:hover{
// // // // // //           background:#eff6ff;
// // // // // //           color:#2563eb;
// // // // // //         }

// // // // // //         .active-btn{
// // // // // //           background:#2563eb !important;
// // // // // //           color:white !important;
// // // // // //         }

// // // // // //         .color-group{
// // // // // //           display:flex;
// // // // // //           gap:6px;
// // // // // //           align-items:center;
// // // // // //         }

// // // // // //         .color-btn{
// // // // // //           width:25px;
// // // // // //           height:25px;
// // // // // //           border-radius:50%;
// // // // // //           border:2px solid white;
// // // // // //         }

// // // // // //         .custom-editor-content{
// // // // // //           padding:25px;
// // // // // //           outline:none;
// // // // // //           font-size:16px;
// // // // // //           line-height:1.8;
// // // // // //         }

// // // // // //         .custom-editor-content h1{
// // // // // //           font-size:36px;
// // // // // //           font-weight:800;
// // // // // //           margin:20px 0;
// // // // // //         }

// // // // // //         .custom-editor-content h2{
// // // // // //           font-size:30px;
// // // // // //           font-weight:700;
// // // // // //           margin:18px 0;
// // // // // //         }

// // // // // //         .custom-editor-content h3{
// // // // // //           font-size:24px;
// // // // // //           font-weight:700;
// // // // // //           margin:16px 0;
// // // // // //         }

// // // // // //         .custom-editor-content p{
// // // // // //           margin-bottom:15px;
// // // // // //         }

// // // // // //         .custom-editor-content ul,
// // // // // //         .custom-editor-content ol{
// // // // // //           padding-left:25px;
// // // // // //           margin-bottom:15px;
// // // // // //         }

// // // // // //         .custom-editor-content img{
// // // // // //           width:100%;
// // // // // //           border-radius:16px;
// // // // // //           margin:20px 0;
// // // // // //         }

// // // // // //         .custom-editor-content a{
// // // // // //           color:#2563eb;
// // // // // //           text-decoration:underline;
// // // // // //         }

// // // // // //         /* ================= TABLE ================= */

// // // // // //         .table-toolbar{
// // // // // //           display:flex;
// // // // // //           flex-wrap:wrap;
// // // // // //           gap:10px;
// // // // // //           padding:14px;
// // // // // //           background:#f8fafc;
// // // // // //           border-bottom:1px solid #e5e7eb;
// // // // // //         }

// // // // // //         .table-btn{
// // // // // //           padding:10px 14px;
// // // // // //           border:none;
// // // // // //           border-radius:10px;
// // // // // //           background:white;
// // // // // //           cursor:pointer;
// // // // // //           transition:.2s;
// // // // // //           font-size:13px;
// // // // // //           font-weight:600;
// // // // // //           box-shadow:0 1px 3px rgba(0,0,0,0.08);
// // // // // //         }

// // // // // //         .table-btn:hover{
// // // // // //           background:#eff6ff;
// // // // // //           color:#2563eb;
// // // // // //         }

// // // // // //         .danger{
// // // // // //           background:#fef2f2;
// // // // // //           color:#dc2626;
// // // // // //         }

// // // // // //         .danger:hover{
// // // // // //           background:#dc2626;
// // // // // //           color:white;
// // // // // //         }

// // // // // //         .ProseMirror table{
// // // // // //           border-collapse:collapse;
// // // // // //           width:100%;
// // // // // //           margin-top:20px;
// // // // // //           border-radius:14px;
// // // // // //           overflow:hidden;
// // // // // //           border:1px solid #dbeafe;
// // // // // //         }

// // // // // //         .ProseMirror th{
// // // // // //           background:#2563eb;
// // // // // //           color:white;
// // // // // //           padding:14px;
// // // // // //           border:1px solid #dbeafe;
// // // // // //           text-align:left;
// // // // // //         }

// // // // // //         .ProseMirror td{
// // // // // //           padding:14px;
// // // // // //           border:1px solid #e5e7eb;
// // // // // //         }

// // // // // //         .ProseMirror tr:nth-child(even) td{
// // // // // //           background:#f9fafb;
// // // // // //         }

// // // // // //         .ProseMirror td:hover{
// // // // // //           background:#eff6ff;
// // // // // //         }

// // // // // //         .ProseMirror .selectedCell{
// // // // // //           background:#dbeafe !important;
// // // // // //           position:relative;
// // // // // //         }

// // // // // //         .ProseMirror .selectedCell::after{
// // // // // //           content:"";
// // // // // //           position:absolute;
// // // // // //           inset:0;
// // // // // //           border:2px solid #2563eb;
// // // // // //           pointer-events:none;
// // // // // //         }

// // // // // //         .ProseMirror .column-resize-handle{
// // // // // //           background:#2563eb;
// // // // // //           width:4px;
// // // // // //         }

// // // // // //         .ProseMirror .tableWrapper{
// // // // // //           overflow-x:auto;
// // // // // //           margin:20px 0;
// // // // // //         }

// // // // // //         .ProseMirror p.is-editor-empty:first-child::before{
// // // // // //           content:attr(data-placeholder);
// // // // // //           color:#9ca3af;
// // // // // //           pointer-events:none;
// // // // // //           float:left;
// // // // // //           height:0;
// // // // // //         }

// // // // // //         `}</style>
// // // // // //       </div>
// // // // // //     );
// // // // // //   },
// // // // // // );

// // // // // // CustomEditor.displayName = "CustomEditor";

// // // // // // export default CustomEditor;
// // // // // import { memo, useEffect, useState, useCallback } from "react";

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

// // // // // const CustomEditor = memo(
// // // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // // // //     const [linkUrl, setLinkUrl] = useState("");
// // // // //     const [showLinkModal, setShowLinkModal] = useState(false);

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

// // // // //     // FIX 3: Proper link insertion — preserve selection, then set link
// // // // //     const setLink = () => {
// // // // //       if (!linkUrl) return;
// // // // //       const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
// // // // //       editor
// // // // //         .chain()
// // // // //         .focus()
// // // // //         .extendMarkRange("link")
// // // // //         .setLink({ href: url })
// // // // //         .run();
// // // // //       setShowLinkModal(false);
// // // // //       setLinkUrl("");
// // // // //     };

// // // // //     const removeLink = () => {
// // // // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // // // //       setShowLinkModal(false);
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
// // // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // // //               title="Text Color"
// // // // //             >
// // // // //               <MdFormatColorText size={18} />
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
// // // // //               }}
// // // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // // //               title="Background Color"
// // // // //             >
// // // // //               <MdFormatColorFill size={18} />
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

// // // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // // //           {/* Bold */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               editor.chain().focus().toggleBold().run();
// // // // //             }}
// // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 font-bold text-sm ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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

// // // // //           {/* FIX 3: Hyperlink button */}
// // // // //           <button
// // // // //             type="button"
// // // // //             onMouseDown={(e) => {
// // // // //               e.preventDefault();
// // // // //               // Save current selection before modal opens
// // // // //               setShowLinkModal(true);
// // // // //             }}
// // // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // // //             title="Insert Link"
// // // // //           >
// // // // //             <FiLinkIcon size={16} />
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

// // // // //         {/* ── Link Modal ── */}
// // // // //         {showLinkModal && (
// // // // //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // // //             <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
// // // // //               <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
// // // // //               <input
// // // // //                 type="url"
// // // // //                 value={linkUrl}
// // // // //                 onChange={(e) => setLinkUrl(e.target.value)}
// // // // //                 onKeyDown={(e) => e.key === "Enter" && setLink()}
// // // // //                 placeholder="https://example.com"
// // // // //                 className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // //                 autoFocus
// // // // //               />
// // // // //               <div className="flex gap-2 justify-end">
// // // // //                 <button
// // // // //                   onClick={() => {
// // // // //                     setShowLinkModal(false);
// // // // //                     setLinkUrl("");
// // // // //                   }}
// // // // //                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
// // // // //                 >
// // // // //                   Cancel
// // // // //                 </button>
// // // // //                 <button
// // // // //                   onClick={setLink}
// // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // // //                 >
// // // // //                   Insert
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         <EditorContent editor={editor} />

// // // // //         <style>{`
// // // // //         /* ── Editor reset ── */
// // // // //         .editor-wrapper .editor-content:focus {
// // // // //           outline: none;
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

// // // // import { memo, useEffect, useState, useCallback } from "react";

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

// // // // import Blockquote from "@tiptap/extension-blockquote";
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
// // // // // TextStyle extension alone doesn't handle fontSize attribute
// // // // // We need to explicitly extend it
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
// // // //   FiTable,
// // // //   FiImage,
// // // //   FiCode,
// // // //   FiMinus,
// // // //   FiX,
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

// // // // const CustomEditor = memo(
// // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);
// // // //     const [linkUrl, setLinkUrl] = useState("");
// // // //     const [showLinkModal, setShowLinkModal] = useState(false);
// // // //     // Save selection before modal opens so we can restore it on insert
// // // //     const savedSelectionRef = useState(null);

// // // //     const editor = useEditor({
// // // //       extensions: [
// // // //         StarterKit.configure({
// // // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // // //           codeBlock: false,
// // // //           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
// // // //           // but we still import Blockquote separately for the toggle button
// // // //           blockquote: true,
// // // //           // Ordered list fix — keep enabled in StarterKit
// // // //           orderedList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
// // // //           bulletList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
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
// // // //         // FIX 1: Use our custom FontSize extension
// // // //         FontSize,
// // // //         // FIX 2: Don't include Blockquote separately since StarterKit already has it
// // // //         // (double registration causes issues)
// // // //         Link.configure({
// // // //           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
// // // //       },
// // // //       editorProps: {
// // // //         attributes: {
// // // //           class: "editor-content",
// // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
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

// // // //     // FIX 3: Save selection → open modal → restore selection → apply link
// // // //     const setLink = () => {
// // // //       if (!linkUrl) return;
// // // //       const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;

// // // //       const saved = savedSelectionRef[0];
// // // //       if (saved) {
// // // //         // Restore the saved selection, then apply link
// // // //         const { from, to } = saved;
// // // //         editor
// // // //           .chain()
// // // //           .focus()
// // // //           .setTextSelection({ from, to })
// // // //           .setLink({ href: url })
// // // //           .run();
// // // //       } else {
// // // //         // No selection — just insert link at cursor
// // // //         editor.chain().focus().setLink({ href: url }).run();
// // // //       }

// // // //       setShowLinkModal(false);
// // // //       setLinkUrl("");
// // // //       savedSelectionRef[0] = null;
// // // //     };

// // // //     const removeLink = () => {
// // // //       editor.chain().focus().extendMarkRange("link").unsetLink().run();
// // // //       setShowLinkModal(false);
// // // //     };

// // // //     // FIX 1: Use our custom setFontSize command
// // // //     const setFontSize = (size) => {
// // // //       if (size === "default") {
// // // //         editor.chain().focus().unsetFontSize().run();
// // // //       } else {
// // // //         editor.chain().focus().setFontSize(size).run();
// // // //       }
// // // //     };

// // // //     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
// // // //     const handleSetTextColor = (color) => {
// // // //       editor.chain().focus().setColor(color).run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     const handleUnsetTextColor = () => {
// // // //       editor.chain().focus().unsetColor().run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     // FIX 4: Highlight color — same fix
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

// // // //     // Get current heading value for the dropdown
// // // //     const currentHeading = (() => {
// // // //       for (let i = 1; i <= 4; i++) {
// // // //         if (editor.isActive("heading", { level: i })) return String(i);
// // // //       }
// // // //       return "paragraph";
// // // //     })();

// // // //     return (
// // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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

// // // //           {/* FIX 1: Font Size — uses custom FontSize extension */}
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

// // // //           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault(); // Don't lose selection
// // // //                 setShowColorPicker((v) => !v);
// // // //                 setShowBgColorPicker(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // //               title="Text Color"
// // // //             >
// // // //               <MdFormatColorText size={18} />
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
// // // //                     }}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 setShowBgColorPicker((v) => !v);
// // // //                 setShowColorPicker(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // //               title="Background Color"
// // // //             >
// // // //               <MdFormatColorFill size={18} />
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

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Bold */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBold().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // //             title="Bullet List"
// // // //           >
// // // //             <FiList size={16} />
// // // //           </button>

// // // //           {/* FIX 5: Ordered List — proper toggle */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleOrderedList().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 font-bold text-sm ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // //             title="Numbered List"
// // // //           >
// // // //             1.
// // // //           </button>

// // // //           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBlockquote().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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

// // // //           {/* FIX 3: Hyperlink button — save selection before modal opens */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               // Save current selection so we can restore it after modal input
// // // //               const { from, to } = editor.state.selection;
// // // //               savedSelectionRef[0] = { from, to };
// // // //               setShowLinkModal(true);
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //                 // No selection — insert '' and place cursor inside
// // // //                 editor.chain().focus().insertContent("''").run();
// // // //               } else {
// // // //                 // Wrap selected text with single quotes
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

// // // //         {/* ── Link Modal ── */}
// // // //         {showLinkModal && (
// // // //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // //             <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
// // // //               <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
// // // //               <input
// // // //                 type="url"
// // // //                 value={linkUrl}
// // // //                 onChange={(e) => setLinkUrl(e.target.value)}
// // // //                 onKeyDown={(e) => e.key === "Enter" && setLink()}
// // // //                 placeholder="https://example.com"
// // // //                 className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                 autoFocus
// // // //               />
// // // //               <div className="flex gap-2 justify-end">
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     setShowLinkModal(false);
// // // //                     setLinkUrl("");
// // // //                   }}
// // // //                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={setLink}
// // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // //                 >
// // // //                   Insert
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         <EditorContent editor={editor} />

// // // //         <style>{`
// // // //         /* ── Editor reset ── */
// // // //         .editor-wrapper .editor-content:focus {
// // // //           outline: none;
// // // //         }

// // // //         /* ── Placeholder ── */
// // // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // // //           content: attr(data-placeholder);
// // // //           float: left;
// // // //           color: #adb5bd;
// // // //           pointer-events: none;
// // // //           height: 0;
// // // //         }

// // // //         /* FIX 4: Override browser text selection so applied colors remain visible */
// // // //         .editor-wrapper .editor-content ::selection {
// // // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // // //           color: inherit !important;
// // // //         }

// // // //         /* FIX 4: Highlight / background color — always visible */
// // // //         .editor-wrapper mark {
// // // //           padding: 0.1em 0;
// // // //           border-radius: 2px;
// // // //         }

// // // //         /* FIX 3: Links visible inside editor */
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

// // // //         /* ── Table ── */
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

// // // //         /* ── Typography ── */
// // // //         .editor-wrapper .editor-content p {
// // // //           margin: 0 0 0.75rem;
// // // //           line-height: 1.6;
// // // //         }

// // // //         /* FIX 5: Ordered & bullet lists */
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

// // // //         /* FIX 2: Blockquote */
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

// // // //         /* ── Headings ── */
// // // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // // //         /* ── Image ── */
// // // //         .editor-wrapper .editor-content img {
// // // //           max-width: 100%;
// // // //           height: auto;
// // // //           border-radius: 0.5rem;
// // // //           margin: 0.5rem 0;
// // // //         }

// // // //         /* ── Code ── */
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

// // // //         /* ── Horizontal Rule ── */
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

// // // // import Blockquote from "@tiptap/extension-blockquote";
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
// // // // // TextStyle extension alone doesn't handle fontSize attribute
// // // // // We need to explicitly extend it
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
// // // //   FiTable,
// // // //   FiImage,
// // // //   FiCode,
// // // //   FiMinus,
// // // //   FiX,
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

// // // // const CustomEditor = memo(
// // // //   ({ value, onChange, placeholder, minHeight = "300px" }) => {
// // // //     const [showColorPicker, setShowColorPicker] = useState(false);
// // // //     const [showBgColorPicker, setShowBgColorPicker] = useState(false);

// // // //     const editor = useEditor({
// // // //       extensions: [
// // // //         StarterKit.configure({
// // // //           heading: { levels: [1, 2, 3, 4, 5, 6] },
// // // //           codeBlock: false,
// // // //           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
// // // //           // but we still import Blockquote separately for the toggle button
// // // //           blockquote: true,
// // // //           // Ordered list fix — keep enabled in StarterKit
// // // //           orderedList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
// // // //           bulletList: {
// // // //             keepMarks: true,
// // // //             keepAttributes: true,
// // // //           },
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
// // // //         // FIX 1: Use our custom FontSize extension
// // // //         FontSize,
// // // //         // FIX 2: Don't include Blockquote separately since StarterKit already has it
// // // //         // (double registration causes issues)
// // // //         Link.configure({
// // // //           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
// // // //       },
// // // //       editorProps: {
// // // //         attributes: {
// // // //           class: "editor-content",
// // // //           style: `min-height: ${minHeight}; padding: 1rem;`,
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

// // // //     // Same pattern as addImage — prompt() keeps selection alive
// // // //     const openLinkDialog = () => {
// // // //       const url = window.prompt("Enter link URL:");
// // // //       if (!url) return;
// // // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // // //       // If text is selected, wrap it; otherwise just apply mark at cursor
// // // //       const { from, to } = editor.state.selection;
// // // //       if (from === to) {
// // // //         // No selection: insert the URL as visible linked text
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

// // // //     // FIX 1: Use our custom setFontSize command
// // // //     const setFontSize = (size) => {
// // // //       if (size === "default") {
// // // //         editor.chain().focus().unsetFontSize().run();
// // // //       } else {
// // // //         editor.chain().focus().setFontSize(size).run();
// // // //       }
// // // //     };

// // // //     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
// // // //     const handleSetTextColor = (color) => {
// // // //       editor.chain().focus().setColor(color).run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     const handleUnsetTextColor = () => {
// // // //       editor.chain().focus().unsetColor().run();
// // // //       setShowColorPicker(false);
// // // //     };

// // // //     // FIX 4: Highlight color — same fix
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

// // // //     // Get current heading value for the dropdown
// // // //     const currentHeading = (() => {
// // // //       for (let i = 1; i <= 4; i++) {
// // // //         if (editor.isActive("heading", { level: i })) return String(i);
// // // //       }
// // // //       return "paragraph";
// // // //     })();

// // // //     return (
// // // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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

// // // //           {/* FIX 1: Font Size — uses custom FontSize extension */}
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

// // // //           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault(); // Don't lose selection
// // // //                 setShowColorPicker((v) => !v);
// // // //                 setShowBgColorPicker(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // //               title="Text Color"
// // // //             >
// // // //               <MdFormatColorText size={18} />
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
// // // //                     }}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
// // // //           <div className="relative color-picker-wrapper">
// // // //             <button
// // // //               type="button"
// // // //               onMouseDown={(e) => {
// // // //                 e.preventDefault();
// // // //                 setShowBgColorPicker((v) => !v);
// // // //                 setShowColorPicker(false);
// // // //               }}
// // // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // // //               title="Background Color"
// // // //             >
// // // //               <MdFormatColorFill size={18} />
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

// // // //           <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

// // // //           {/* Bold */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBold().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // //             title="Bullet List"
// // // //           >
// // // //             <FiList size={16} />
// // // //           </button>

// // // //           {/* FIX 5: Ordered List — proper toggle */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleOrderedList().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 font-bold text-sm ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // // //             title="Numbered List"
// // // //           >
// // // //             1.
// // // //           </button>

// // // //           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               editor.chain().focus().toggleBlockquote().run();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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

// // // //           {/* Link button — uses prompt() so selection is preserved */}
// // // //           <button
// // // //             type="button"
// // // //             onMouseDown={(e) => {
// // // //               e.preventDefault();
// // // //               openLinkDialog();
// // // //             }}
// // // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // // //                 // No selection — insert '' and place cursor inside
// // // //                 editor.chain().focus().insertContent("''").run();
// // // //               } else {
// // // //                 // Wrap selected text with single quotes
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
// // // //         /* ── Editor reset ── */
// // // //         .editor-wrapper .editor-content:focus {
// // // //           outline: none;
// // // //         }

// // // //         /* ── Placeholder ── */
// // // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // // //           content: attr(data-placeholder);
// // // //           float: left;
// // // //           color: #adb5bd;
// // // //           pointer-events: none;
// // // //           height: 0;
// // // //         }

// // // //         /* FIX 4: Override browser text selection so applied colors remain visible */
// // // //         .editor-wrapper .editor-content ::selection {
// // // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // // //           color: inherit !important;
// // // //         }

// // // //         /* FIX 4: Highlight / background color — always visible */
// // // //         .editor-wrapper mark {
// // // //           padding: 0.1em 0;
// // // //           border-radius: 2px;
// // // //         }

// // // //         /* FIX 3: Links visible inside editor */
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

// // // //         /* ── Table ── */
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

// // // //         /* ── Typography ── */
// // // //         .editor-wrapper .editor-content p {
// // // //           margin: 0 0 0.75rem;
// // // //           line-height: 1.6;
// // // //         }

// // // //         /* FIX 5: Ordered & bullet lists */
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

// // // //         /* FIX 2: Blockquote */
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

// // // //         /* ── Headings ── */
// // // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // // //         /* ── Image ── */
// // // //         .editor-wrapper .editor-content img {
// // // //           max-width: 100%;
// // // //           height: auto;
// // // //           border-radius: 0.5rem;
// // // //           margin: 0.5rem 0;
// // // //         }

// // // //         /* ── Code ── */
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

// // // //         /* ── Horizontal Rule ── */
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

// // // import Blockquote from "@tiptap/extension-blockquote";
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
// // // // TextStyle extension alone doesn't handle fontSize attribute
// // // // We need to explicitly extend it
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
// // //   FiTable,
// // //   FiImage,
// // //   FiCode,
// // //   FiMinus,
// // //   FiX,
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
// // //           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
// // //           // but we still import Blockquote separately for the toggle button
// // //           blockquote: true,
// // //           // Ordered list fix — keep enabled in StarterKit
// // //           orderedList: {
// // //             keepMarks: true,
// // //             keepAttributes: true,
// // //           },
// // //           bulletList: {
// // //             keepMarks: true,
// // //             keepAttributes: true,
// // //           },
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
// // //         // FIX 1: Use our custom FontSize extension
// // //         FontSize,
// // //         // FIX 2: Don't include Blockquote separately since StarterKit already has it
// // //         // (double registration causes issues)
// // //         Link.configure({
// // //           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
// // //       },
// // //       editorProps: {
// // //         attributes: {
// // //           class: "editor-content",
// // //           style: `min-height: ${minHeight}; padding: 1rem;`,
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

// // //     // Same pattern as addImage — prompt() keeps selection alive
// // //     const openLinkDialog = () => {
// // //       const url = window.prompt("Enter link URL:");
// // //       if (!url) return;
// // //       const href = url.startsWith("http") ? url : `https://${url}`;
// // //       // If text is selected, wrap it; otherwise just apply mark at cursor
// // //       const { from, to } = editor.state.selection;
// // //       if (from === to) {
// // //         // No selection: insert the URL as visible linked text
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

// // //     // FIX 1: Use our custom setFontSize command
// // //     const setFontSize = (size) => {
// // //       if (size === "default") {
// // //         editor.chain().focus().unsetFontSize().run();
// // //       } else {
// // //         editor.chain().focus().setFontSize(size).run();
// // //       }
// // //     };

// // //     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
// // //     const handleSetTextColor = (color) => {
// // //       editor.chain().focus().setColor(color).run();
// // //       setShowColorPicker(false);
// // //     };

// // //     const handleUnsetTextColor = () => {
// // //       editor.chain().focus().unsetColor().run();
// // //       setShowColorPicker(false);
// // //     };

// // //     // FIX 4: Highlight color — same fix
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

// // //     // Get current heading value for the dropdown
// // //     const currentHeading = (() => {
// // //       for (let i = 1; i <= 4; i++) {
// // //         if (editor.isActive("heading", { level: i })) return String(i);
// // //       }
// // //       return "paragraph";
// // //     })();

// // //     return (
// // //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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

// // //           {/* FIX 1: Font Size — uses custom FontSize extension */}
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

// // //           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
// // //           <div className="relative color-picker-wrapper">
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault(); // Don't lose selection
// // //                 setShowColorPicker((v) => !v);
// // //                 setShowBgColorPicker(false);
// // //                 setShowHighlighter(false);
// // //               }}
// // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // //               title="Text Color"
// // //             >
// // //               <MdFormatColorText size={18} />
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
// // //                     }}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
// // //           <div className="relative color-picker-wrapper">
// // //             <button
// // //               type="button"
// // //               onMouseDown={(e) => {
// // //                 e.preventDefault();
// // //                 setShowBgColorPicker((v) => !v);
// // //                 setShowColorPicker(false);
// // //                 setShowHighlighter(false);
// // //               }}
// // //               className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
// // //               title="Background Color"
// // //             >
// // //               <MdFormatColorFill size={18} />
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
// // //               className={`p-2 rounded hover:bg-gray-200 transition-colors ${showHighlighter ? "bg-yellow-100 text-yellow-700" : "text-gray-700"}`}
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
// // //                       className="w-5 h-5 rounded-sm border border-gray-200 flex-shrink-0"
// // //                       style={{ backgroundColor: color }}
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
// // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // //             title="Bullet List"
// // //           >
// // //             <FiList size={16} />
// // //           </button>

// // //           {/* FIX 5: Ordered List — proper toggle */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleOrderedList().run();
// // //             }}
// // //             className={`p-2 rounded hover:bg-gray-200 font-bold text-sm ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
// // //             title="Numbered List"
// // //           >
// // //             1.
// // //           </button>

// // //           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               editor.chain().focus().toggleBlockquote().run();
// // //             }}
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("blockquote") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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

// // //           {/* Link button — uses prompt() so selection is preserved */}
// // //           <button
// // //             type="button"
// // //             onMouseDown={(e) => {
// // //               e.preventDefault();
// // //               openLinkDialog();
// // //             }}
// // //             className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
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
// // //                 // No selection — insert '' and place cursor inside
// // //                 editor.chain().focus().insertContent("''").run();
// // //               } else {
// // //                 // Wrap selected text with single quotes
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
// // //         /* ── Editor reset ── */
// // //         .editor-wrapper .editor-content:focus {
// // //           outline: none;
// // //         }

// // //         /* ── Placeholder ── */
// // //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// // //           content: attr(data-placeholder);
// // //           float: left;
// // //           color: #adb5bd;
// // //           pointer-events: none;
// // //           height: 0;
// // //         }

// // //         /* FIX 4: Override browser text selection so applied colors remain visible */
// // //         .editor-wrapper .editor-content ::selection {
// // //           background-color: rgba(59, 130, 246, 0.3) !important;
// // //           color: inherit !important;
// // //         }

// // //         /* FIX 4: Highlight / background color — always visible */
// // //         .editor-wrapper mark {
// // //           padding: 0.1em 0;
// // //           border-radius: 2px;
// // //         }

// // //         /* FIX 3: Links visible inside editor */
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

// // //         /* ── Table ── */
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

// // //         /* ── Typography ── */
// // //         .editor-wrapper .editor-content p {
// // //           margin: 0 0 0.75rem;
// // //           line-height: 1.6;
// // //         }

// // //         /* FIX 5: Ordered & bullet lists */
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

// // //         /* FIX 2: Blockquote */
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

// // //         /* ── Headings ── */
// // //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// // //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// // //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// // //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// // //         /* ── Image ── */
// // //         .editor-wrapper .editor-content img {
// // //           max-width: 100%;
// // //           height: auto;
// // //           border-radius: 0.5rem;
// // //           margin: 0.5rem 0;
// // //         }

// // //         /* ── Code ── */
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

// // //         /* ── Horizontal Rule ── */
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

// // import Blockquote from "@tiptap/extension-blockquote";
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
// // // TextStyle extension alone doesn't handle fontSize attribute
// // // We need to explicitly extend it
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
// //   FiTable,
// //   FiImage,
// //   FiCode,
// //   FiMinus,
// //   FiX,
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
// //           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
// //           // but we still import Blockquote separately for the toggle button
// //           blockquote: true,
// //           // Ordered list fix — keep enabled in StarterKit
// //           orderedList: {
// //             keepMarks: true,
// //             keepAttributes: true,
// //           },
// //           bulletList: {
// //             keepMarks: true,
// //             keepAttributes: true,
// //           },
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
// //         // FIX 1: Use our custom FontSize extension
// //         FontSize,
// //         // FIX 2: Don't include Blockquote separately since StarterKit already has it
// //         // (double registration causes issues)
// //         Link.configure({
// //           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
// //       },
// //       editorProps: {
// //         attributes: {
// //           class: "editor-content",
// //           style: `min-height: ${minHeight}; padding: 1rem;`,
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

// //     // Same pattern as addImage — prompt() keeps selection alive
// //     const openLinkDialog = () => {
// //       const url = window.prompt("Enter link URL:");
// //       if (!url) return;
// //       const href = url.startsWith("http") ? url : `https://${url}`;
// //       // If text is selected, wrap it; otherwise just apply mark at cursor
// //       const { from, to } = editor.state.selection;
// //       if (from === to) {
// //         // No selection: insert the URL as visible linked text
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

// //     // FIX 1: Use our custom setFontSize command
// //     const setFontSize = (size) => {
// //       if (size === "default") {
// //         editor.chain().focus().unsetFontSize().run();
// //       } else {
// //         editor.chain().focus().setFontSize(size).run();
// //       }
// //     };

// //     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
// //     const handleSetTextColor = (color) => {
// //       editor.chain().focus().setColor(color).run();
// //       setShowColorPicker(false);
// //     };

// //     const handleUnsetTextColor = () => {
// //       editor.chain().focus().unsetColor().run();
// //       setShowColorPicker(false);
// //     };

// //     // FIX 4: Highlight color — same fix
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

// //     // Get current heading value for the dropdown
// //     const currentHeading = (() => {
// //       for (let i = 1; i <= 4; i++) {
// //         if (editor.isActive("heading", { level: i })) return String(i);
// //       }
// //       return "paragraph";
// //     })();

// //     return (
// //       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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

// //           {/* FIX 1: Font Size — uses custom FontSize extension */}
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

// //           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
// //           <div className="relative color-picker-wrapper">
// //             <button
// //               type="button"
// //               onMouseDown={(e) => {
// //                 e.preventDefault(); // Don't lose selection
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

// //           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
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
// //               className={`p-2 rounded transition-colors ${editor.isActive("highlight") ? "bg-yellow-200 text-yellow-800 ring-1 ring-yellow-400" : showHighlighter ? "bg-yellow-100 text-yellow-700" : "text-gray-700 hover:bg-gray-200"}`}
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

// //           {/* FIX 5: Ordered List — proper toggle */}
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

// //           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
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

// //           {/* Link button — uses prompt() so selection is preserved */}
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
// //                 // No selection — insert '' and place cursor inside
// //                 editor.chain().focus().insertContent("''").run();
// //               } else {
// //                 // Wrap selected text with single quotes
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
// //         /* ── Editor reset ── */
// //         .editor-wrapper .editor-content:focus {
// //           outline: none;
// //         }

// //         /* ── Placeholder ── */
// //         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
// //           content: attr(data-placeholder);
// //           float: left;
// //           color: #adb5bd;
// //           pointer-events: none;
// //           height: 0;
// //         }

// //         /* FIX 4: Override browser text selection so applied colors remain visible */
// //         .editor-wrapper .editor-content ::selection {
// //           background-color: rgba(59, 130, 246, 0.3) !important;
// //           color: inherit !important;
// //         }

// //         /* FIX 4: Highlight / background color — always visible */
// //         .editor-wrapper mark {
// //           padding: 0.1em 0;
// //           border-radius: 2px;
// //         }

// //         /* FIX 3: Links visible inside editor */
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

// //         /* ── Table ── */
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

// //         /* ── Typography ── */
// //         .editor-wrapper .editor-content p {
// //           margin: 0 0 0.75rem;
// //           line-height: 1.6;
// //         }

// //         /* FIX 5: Ordered & bullet lists */
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

// //         /* FIX 2: Blockquote */
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

// //         /* ── Headings ── */
// //         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
// //         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
// //         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
// //         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

// //         /* ── Image ── */
// //         .editor-wrapper .editor-content img {
// //           max-width: 100%;
// //           height: auto;
// //           border-radius: 0.5rem;
// //           margin: 0.5rem 0;
// //         }

// //         /* ── Code ── */
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

// //         /* ── Horizontal Rule ── */
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

// import Blockquote from "@tiptap/extension-blockquote";
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
// // TextStyle extension alone doesn't handle fontSize attribute
// // We need to explicitly extend it
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
//   FiTable,
//   FiImage,
//   FiCode,
//   FiMinus,
//   FiX,
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
//           // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
//           // but we still import Blockquote separately for the toggle button
//           blockquote: true,
//           // Ordered list fix — keep enabled in StarterKit
//           orderedList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
//           bulletList: {
//             keepMarks: true,
//             keepAttributes: true,
//           },
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
//         // FIX 1: Use our custom FontSize extension
//         FontSize,
//         // FIX 2: Don't include Blockquote separately since StarterKit already has it
//         // (double registration causes issues)
//         Link.configure({
//           openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
//       },
//       editorProps: {
//         attributes: {
//           class: "editor-content",
//           style: `min-height: ${minHeight}; padding: 1rem;`,
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

//     // Same pattern as addImage — prompt() keeps selection alive
//     const openLinkDialog = () => {
//       const url = window.prompt("Enter link URL:");
//       if (!url) return;
//       const href = url.startsWith("http") ? url : `https://${url}`;
//       // If text is selected, wrap it; otherwise just apply mark at cursor
//       const { from, to } = editor.state.selection;
//       if (from === to) {
//         // No selection: insert the URL as visible linked text
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

//     // FIX 1: Use our custom setFontSize command
//     const setFontSize = (size) => {
//       if (size === "default") {
//         editor.chain().focus().unsetFontSize().run();
//       } else {
//         editor.chain().focus().setFontSize(size).run();
//       }
//     };

//     // FIX 4: Text color — use mousedown instead of click to avoid selection loss
//     const handleSetTextColor = (color) => {
//       editor.chain().focus().setColor(color).run();
//       setShowColorPicker(false);
//     };

//     const handleUnsetTextColor = () => {
//       editor.chain().focus().unsetColor().run();
//       setShowColorPicker(false);
//     };

//     // FIX 4: Highlight color — same fix
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

//     // Get current heading value for the dropdown
//     const currentHeading = (() => {
//       for (let i = 1; i <= 4; i++) {
//         if (editor.isActive("heading", { level: i })) return String(i);
//       }
//       return "paragraph";
//     })();

//     return (
//       <div className="editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
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

//           {/* FIX 1: Font Size — uses custom FontSize extension */}
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

//           {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
//           <div className="relative color-picker-wrapper">
//             <button
//               type="button"
//               onMouseDown={(e) => {
//                 e.preventDefault(); // Don't lose selection
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

//           {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
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

//           {/* FIX 5: Ordered List — proper toggle */}
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

//           {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
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

//           {/* Link button — uses prompt() so selection is preserved */}
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
//                 // No selection — insert '' and place cursor inside
//                 editor.chain().focus().insertContent("''").run();
//               } else {
//                 // Wrap selected text with single quotes
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
//         /* ── Editor reset ── */
//         .editor-wrapper .editor-content:focus {
//           outline: none;
//         }

//         /* ── Placeholder ── */
//         .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #adb5bd;
//           pointer-events: none;
//           height: 0;
//         }

//         /* FIX 4: Override browser text selection so applied colors remain visible */
//         .editor-wrapper .editor-content ::selection {
//           background-color: rgba(59, 130, 246, 0.3) !important;
//           color: inherit !important;
//         }

//         /* FIX 4: Highlight / background color — always visible */
//         .editor-wrapper mark {
//           padding: 0.1em 0;
//           border-radius: 2px;
//         }

//         /* FIX 3: Links visible inside editor */
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

//         /* ── Table ── */
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

//         /* ── Typography ── */
//         .editor-wrapper .editor-content p {
//           margin: 0 0 0.75rem;
//           line-height: 1.6;
//         }

//         /* FIX 5: Ordered & bullet lists */
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

//         /* FIX 2: Blockquote */
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

//         /* ── Headings ── */
//         .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
//         .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
//         .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
//         .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

//         /* ── Image ── */
//         .editor-wrapper .editor-content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.5rem;
//           margin: 0.5rem 0;
//         }

//         /* ── Code ── */
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

//         /* ── Horizontal Rule ── */
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

import Blockquote from "@tiptap/extension-blockquote";
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
// TextStyle extension alone doesn't handle fontSize attribute
// We need to explicitly extend it
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
  FiTable,
  FiImage,
  FiCode,
  FiMinus,
  FiX,
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
          // FIX 2: Don't disable blockquote in StarterKit — let it handle natively
          // but we still import Blockquote separately for the toggle button
          blockquote: true,
          // Ordered list fix — keep enabled in StarterKit
          orderedList: {
            keepMarks: true,
            keepAttributes: true,
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: true,
          },
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
        // FIX 1: Use our custom FontSize extension
        FontSize,
        // FIX 2: Don't include Blockquote separately since StarterKit already has it
        // (double registration causes issues)
        Link.configure({
          openOnClick: false, // FIX 3: Don't open on click in editor (causes focus loss)
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
      },
      editorProps: {
        attributes: {
          class: "editor-content",
          style: `min-height: ${minHeight}; padding: 1rem;`,
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

    // Same pattern as addImage — prompt() keeps selection alive
    const openLinkDialog = () => {
      const url = window.prompt("Enter link URL:");
      if (!url) return;
      const href = url.startsWith("http") ? url : `https://${url}`;
      // If text is selected, wrap it; otherwise just apply mark at cursor
      const { from, to } = editor.state.selection;
      if (from === to) {
        // No selection: insert the URL as visible linked text
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

    // FIX 1: Use our custom setFontSize command
    const setFontSize = (size) => {
      if (size === "default") {
        editor.chain().focus().unsetFontSize().run();
      } else {
        editor.chain().focus().setFontSize(size).run();
      }
    };

    // FIX 4: Text color — use mousedown instead of click to avoid selection loss
    const handleSetTextColor = (color) => {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    };

    const handleUnsetTextColor = () => {
      editor.chain().focus().unsetColor().run();
      setShowColorPicker(false);
    };

    // FIX 4: Highlight color — same fix
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

    // Get current heading value for the dropdown
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

          {/* FIX 1: Font Size — uses custom FontSize extension */}
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

          {/* FIX 4: Text Color — onMouseDown prevents selection loss */}
          <div className="relative color-picker-wrapper">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Don't lose selection
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

          {/* FIX 4: Background (Highlight) Color — same onMouseDown fix */}
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

          {/* FIX 5: Ordered List — proper toggle */}
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

          {/* FIX 2: Blockquote — uses StarterKit's built-in blockquote */}
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

          {/* Link button — uses prompt() so selection is preserved */}
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
                // No selection — insert '' and place cursor inside
                editor.chain().focus().insertContent("''").run();
              } else {
                // Wrap selected text with single quotes
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

        <EditorContent editor={editor} />

        <style>{`
        /* ── Editor reset ── */
        .editor-wrapper .editor-content:focus {
          outline: none;
        }

        /* Dark caret + cursor visible on white background */
        .editor-wrapper .editor-content {
          caret-color: #2563EB;
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='20' viewBox='0 0 12 20'%3E%3Cpath d='M 6 0 L 6 20 M 3 3 L 6 0 L 9 3 M 3 17 L 6 20 L 9 17' stroke='%232563EB' stroke-width='1.2' fill='none'/%3E%3C/svg%3E") 6 10, text;
        }

        /* ── Placeholder ── */
        .editor-wrapper .editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        /* FIX 4: Override browser text selection so applied colors remain visible */
        .editor-wrapper .editor-content ::selection {
          background-color: rgba(59, 130, 246, 0.3) !important;
          color: inherit !important;
        }

        /* FIX 4: Highlight / background color — always visible */
        .editor-wrapper mark {
          padding: 0.1em 0;
          border-radius: 2px;
        }

        /* FIX 3: Links visible inside editor */
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

        /* ── Table ── */
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

        /* ── Typography ── */
        .editor-wrapper .editor-content p {
          margin: 0 0 0.75rem;
          line-height: 1.6;
        }

        /* FIX 5: Ordered & bullet lists */
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

        /* FIX 2: Blockquote */
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

        /* ── Headings ── */
        .editor-wrapper .editor-content h1 { font-size: 2rem; font-weight: 700; margin: 1rem 0 0.5rem; line-height: 1.2; }
        .editor-wrapper .editor-content h2 { font-size: 1.5rem; font-weight: 600; margin: 1rem 0 0.5rem; line-height: 1.3; }
        .editor-wrapper .editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
        .editor-wrapper .editor-content h4 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }

        /* ── Image ── */
        .editor-wrapper .editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }

        /* ── Code ── */
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

        /* ── Horizontal Rule ── */
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
