// import { memo, useEffect } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { Table } from "@tiptap/extension-table";
// import { TableRow } from "@tiptap/extension-table-row";
// import { TableCell } from "@tiptap/extension-table-cell";
// import { TableHeader } from "@tiptap/extension-table-header";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";
// // No TextAlign import
// import {
//   FiBold,
//   FiItalic,
//   FiList,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
//   FiTable,
//   FiLink as FiLinkIcon,
//   FiImage,
// } from "react-icons/fi";

// const CustomEditor = memo(
//   ({ value, onChange, placeholder, minHeight = "300px" }) => {
//     const editor = useEditor({
//       extensions: [
//         StarterKit.configure({
//           heading: {
//             levels: [1, 2, 3, 4, 5, 6],
//           },
//         }),
//         Underline,
//         // No TextAlign extension
//         Link.configure({
//           openOnClick: false,
//           HTMLAttributes: {
//             class: "text-blue-500 underline",
//           },
//         }),
//         Image.configure({
//           inline: true,
//           allowBase64: true,
//           HTMLAttributes: {
//             class: "max-w-full h-auto rounded-lg",
//           },
//         }),
//         Placeholder.configure({
//           placeholder: placeholder || "Write something...",
//         }),
//         Table.configure({
//           resizable: true,
//           HTMLAttributes: {
//             class: "min-w-full border-collapse",
//           },
//         }),
//         TableRow,
//         TableCell,
//         TableHeader,
//       ],
//       content: value || "",
//       onUpdate: ({ editor }) => {
//         onChange(editor.getHTML());
//       },
//       editorProps: {
//         attributes: {
//           class: "prose max-w-none focus:outline-none",
//           style: `min-height: ${minHeight}; padding: 1rem;`,
//         },
//       },
//     });

//     // Update content when value changes externally
//     useEffect(() => {
//       if (editor && value !== editor.getHTML()) {
//         editor.commands.setContent(value || "");
//       }
//     }, [editor, value]);

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
//       if (url) {
//         editor.chain().focus().setImage({ src: url }).run();
//       }
//     };

//     const addLink = () => {
//       const url = prompt("Enter URL:");
//       if (url) {
//         editor.chain().focus().setLink({ href: url }).run();
//       }
//     };

//     return (
//       <div className="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
//         {/* Toolbar */}
//         <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
//           {/* Text Formatting */}
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Bold"
//           >
//             <FiBold size={16} />
//           </button>

//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Italic"
//           >
//             <FiItalic size={16} />
//           </button>

//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Underline"
//           >
//             <span className="underline text-sm">U</span>
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1" />

//           {/* Headers */}
//           <select
//             onChange={(e) => {
//               const val = e.target.value;
//               if (val === "paragraph") {
//                 editor.chain().focus().setParagraph().run();
//               } else {
//                 editor
//                   .chain()
//                   .focus()
//                   .toggleHeading({ level: parseInt(val) })
//                   .run();
//               }
//             }}
//             className="p-1 rounded border border-gray-300 text-sm bg-white"
//             value={(() => {
//               if (editor.isActive("heading", { level: 1 })) return "1";
//               if (editor.isActive("heading", { level: 2 })) return "2";
//               if (editor.isActive("heading", { level: 3 })) return "3";
//               if (editor.isActive("heading", { level: 4 })) return "4";
//               return "paragraph";
//             })()}
//           >
//             <option value="paragraph">Normal</option>
//             <option value="1">Heading 1</option>
//             <option value="2">Heading 2</option>
//             <option value="3">Heading 3</option>
//             <option value="4">Heading 4</option>
//           </select>

//           <div className="w-px h-6 bg-gray-300 mx-1" />

//           {/* Lists */}
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Bullet List"
//           >
//             <FiList size={16} />
//           </button>

//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Numbered List"
//           >
//             <span className="font-bold text-sm">1.</span>
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1" />

//           {/* Alignment Buttons - Commented out */}
//           {/*
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           className="p-2 rounded hover:bg-gray-200 text-gray-700"
//           title="Align Left"
//         >
//           <FiAlignLeft size={16} />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           className="p-2 rounded hover:bg-gray-200 text-gray-700"
//           title="Align Center"
//         >
//           <FiAlignCenter size={16} />
//         </button>
//         <button
//           type="button"
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           className="p-2 rounded hover:bg-gray-200 text-gray-700"
//           title="Align Right"
//         >
//           <FiAlignRight size={16} />
//         </button>
//         <div className="w-px h-6 bg-gray-300 mx-1" />
//         */}

//           {/* Table */}
//           <button
//             type="button"
//             onClick={addTable}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 "
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
//             onClick={addImage}
//             className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
//             title="Insert Image"
//           >
//             <FiImage size={16} />
//           </button>

//           {/* Link */}
//           <button
//             type="button"
//             onClick={addLink}
//             className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
//             title="Insert Link"
//           >
//             <FiLinkIcon size={16} />
//           </button>

//           <div className="w-px h-6 bg-gray-300 mx-1" />

//           {/* Table Operations */}
//           {editor.isActive("table") && (
//             <>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().addRowBefore().run()}
//                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
//                 title="Add Row Above"
//               >
//                 + Row ↑
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().addRowAfter().run()}
//                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
//                 title="Add Row Below"
//               >
//                 + Row ↓
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().addColumnBefore().run()}
//                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
//                 title="Add Column Left"
//               >
//                 + Col ←
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().addColumnAfter().run()}
//                 className="p-2 rounded hover:bg-gray-200 text-gray-700 text-xs font-medium"
//                 title="Add Column Right"
//               >
//                 + Col →
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().deleteRow().run()}
//                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
//                 title="Delete Row"
//               >
//                 - Row
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().deleteColumn().run()}
//                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
//                 title="Delete Column"
//               >
//                 - Col
//               </button>
//               <button
//                 type="button"
//                 onClick={() => editor.chain().focus().deleteTable().run()}
//                 className="p-2 rounded hover:bg-red-100 text-red-600 text-xs font-medium"
//                 title="Delete Table"
//               >
//                 Delete Table
//               </button>
//             </>
//           )}
//         </div>

//         <EditorContent editor={editor} />

//         <style>{`
//         .tiptap-editor-wrapper .ProseMirror:focus {
//           outline: none;
//         }
//         .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
//           content: attr(data-placeholder);
//           float: left;
//           color: #adb5bd;
//           pointer-events: none;
//           height: 0;
//         }
//         .tiptap-editor-wrapper table {
//           border-collapse: collapse;
//           width: 100%;
//           margin: 1rem 0;
//         }
//         .tiptap-editor-wrapper td,
//         .tiptap-editor-wrapper th {
//           border: 1px solid #ddd;
//           padding: 8px;
//         }
//         .tiptap-editor-wrapper th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .tiptap-editor-wrapper .selectedCell {
//           background-color: #e0f2fe;
//         }
//         .tiptap-editor-wrapper p {
//           margin: 0 0 1rem;
//         }
//         .tiptap-editor-wrapper ul,
//         .tiptap-editor-wrapper ol {
//           padding-left: 1.5rem;
//           margin: 0 0 1rem;
//         }
//         .tiptap-editor-wrapper h1 {
//           font-size: 2rem;
//           font-weight: 700;
//           margin: 1rem 0 0.5rem;
//         }
//         .tiptap-editor-wrapper h2 {
//           font-size: 1.5rem;
//           font-weight: 600;
//           margin: 1rem 0 0.5rem;
//         }
//         .tiptap-editor-wrapper h3 {
//           font-size: 1.25rem;
//           font-weight: 600;
//           margin: 0.75rem 0 0.5rem;
//         }
//         .tiptap-editor-wrapper img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 0.5rem;
//         }
//         .tiptap-editor-wrapper a {
//           color: #3b82f6;
//           text-decoration: underline;
//         }
//       `}</style>
//       </div>
//     );
//   },
// );

// CustomEditor.displayName = "CustomEditor";

// export default CustomEditor;

// 19-05
import { memo, useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

import { TextAlign } from "@tiptap/extension-text-align";
// import TextStyle from "@tiptap/extension-text-style";
// import Color from "@tiptap/extension-color";
// import Highlight from "@tiptap/extension-highlight";
// import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";

import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiImage,
  FiLink,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiList,
} from "react-icons/fi";

const fonts = [
  "Arial",
  "Poppins",
  "Inter",
  "Georgia",
  "Verdana",
  "Tahoma",
  "Courier New",
];

const colors = [
  "#000000",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

const CustomEditor = memo(
  ({ value, onChange, placeholder, minHeight = "400px" }) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),

        Underline,

        TextStyle,

        Color,

        Highlight.configure({
          multicolor: true,
        }),

        FontFamily,

        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),

        Link.configure({
          openOnClick: false,
        }),

        Image.configure({
          allowBase64: true,
          inline: false,
        }),

        Placeholder.configure({
          placeholder: placeholder || "Write something amazing...",
        }),

        Table.configure({
          resizable: true,
        }),

        TableRow,
        TableHeader,
        TableCell,
      ],

      content: value || "",

      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },

      editorProps: {
        attributes: {
          class: "custom-editor-content",
          style: `min-height:${minHeight}`,
        },
      },
    });

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }, [editor, value]);

    if (!editor) return null;

    const addImage = () => {
      const url = prompt("Enter Image URL");

      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    const addLink = () => {
      const url = prompt("Enter Link");

      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    const addTable = () => {
      const rows = prompt("Rows", "3");
      const cols = prompt("Columns", "3");

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

    return (
      <div className="editor-wrapper">
        {/* ================= TOOLBAR ================= */}

        <div className="toolbar">
          {/* BOLD */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active-btn" : ""}
          >
            <FiBold />
          </button>

          {/* ITALIC */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active-btn" : ""}
          >
            <FiItalic />
          </button>

          {/* UNDERLINE */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "active-btn" : ""}
          >
            <FiUnderline />
          </button>

          {/* FONT FAMILY */}
          <select
            onChange={(e) =>
              editor.chain().focus().setFontFamily(e.target.value).run()
            }
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          {/* TEXT COLOR */}
          <div className="color-group">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className="color-btn"
                style={{ background: color }}
                onClick={() => editor.chain().focus().setColor(color).run()}
              />
            ))}
          </div>

          {/* HIGHLIGHT */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Highlight
          </button>

          {/* HEADING */}
          <select
            onChange={(e) => {
              const val = e.target.value;

              if (val === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: parseInt(val),
                  })
                  .run();
              }
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>

          {/* ALIGNMENTS */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <FiAlignLeft />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <FiAlignCenter />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <FiAlignRight />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <FiAlignJustify />
          </button>

          {/* LIST */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FiList />
          </button>

          {/* IMAGE */}
          <button type="button" onClick={addImage}>
            <FiImage />
          </button>

          {/* LINK */}
          <button type="button" onClick={addLink}>
            <FiLink />
          </button>

          {/* TABLE */}
          <button type="button" onClick={addTable}>
            Table
          </button>
        </div>

        {/* ================= TABLE TOOLBAR ================= */}

        {editor.isActive("table") && (
          <div className="table-toolbar">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="table-btn"
            >
              + Row Top
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="table-btn"
            >
              + Row Bottom
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="table-btn danger"
            >
              Delete Row
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="table-btn"
            >
              + Column Left
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="table-btn"
            >
              + Column Right
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="table-btn danger"
            >
              Delete Column
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().mergeCells().run()}
              className="table-btn"
            >
              Merge
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().splitCell().run()}
              className="table-btn"
            >
              Split
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              className="table-btn"
            >
              Header Row
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="table-btn danger"
            >
              Delete Table
            </button>
          </div>
        )}

        {/* ================= EDITOR ================= */}

        <EditorContent editor={editor} />

        {/* ================= STYLES ================= */}

        <style>{`

        .editor-wrapper{
          border:1px solid #dbeafe;
          border-radius:20px;
          overflow:hidden;
          background:white;
          box-shadow:0 10px 30px rgba(0,0,0,0.05);
        }

        .toolbar{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          padding:15px;
          background:#f8fafc;
          border-bottom:1px solid #e5e7eb;
        }

        .toolbar button,
        .toolbar select{
          border:none;
          background:white;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-size:14px;
          transition:.2s;
          box-shadow:0 1px 3px rgba(0,0,0,0.08);
        }

        .toolbar button:hover,
        .toolbar select:hover{
          background:#eff6ff;
          color:#2563eb;
        }

        .active-btn{
          background:#2563eb !important;
          color:white !important;
        }

        .color-group{
          display:flex;
          gap:6px;
          align-items:center;
        }

        .color-btn{
          width:25px;
          height:25px;
          border-radius:50%;
          border:2px solid white;
        }

        .custom-editor-content{
          padding:25px;
          outline:none;
          font-size:16px;
          line-height:1.8;
        }

        .custom-editor-content h1{
          font-size:36px;
          font-weight:800;
          margin:20px 0;
        }

        .custom-editor-content h2{
          font-size:30px;
          font-weight:700;
          margin:18px 0;
        }

        .custom-editor-content h3{
          font-size:24px;
          font-weight:700;
          margin:16px 0;
        }

        .custom-editor-content p{
          margin-bottom:15px;
        }

        .custom-editor-content ul,
        .custom-editor-content ol{
          padding-left:25px;
          margin-bottom:15px;
        }

        .custom-editor-content img{
          width:100%;
          border-radius:16px;
          margin:20px 0;
        }

        .custom-editor-content a{
          color:#2563eb;
          text-decoration:underline;
        }

        /* ================= TABLE ================= */

        .table-toolbar{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          padding:14px;
          background:#f8fafc;
          border-bottom:1px solid #e5e7eb;
        }

        .table-btn{
          padding:10px 14px;
          border:none;
          border-radius:10px;
          background:white;
          cursor:pointer;
          transition:.2s;
          font-size:13px;
          font-weight:600;
          box-shadow:0 1px 3px rgba(0,0,0,0.08);
        }

        .table-btn:hover{
          background:#eff6ff;
          color:#2563eb;
        }

        .danger{
          background:#fef2f2;
          color:#dc2626;
        }

        .danger:hover{
          background:#dc2626;
          color:white;
        }

        .ProseMirror table{
          border-collapse:collapse;
          width:100%;
          margin-top:20px;
          border-radius:14px;
          overflow:hidden;
          border:1px solid #dbeafe;
        }

        .ProseMirror th{
          background:#2563eb;
          color:white;
          padding:14px;
          border:1px solid #dbeafe;
          text-align:left;
        }

        .ProseMirror td{
          padding:14px;
          border:1px solid #e5e7eb;
        }

        .ProseMirror tr:nth-child(even) td{
          background:#f9fafb;
        }

        .ProseMirror td:hover{
          background:#eff6ff;
        }

        .ProseMirror .selectedCell{
          background:#dbeafe !important;
          position:relative;
        }

        .ProseMirror .selectedCell::after{
          content:"";
          position:absolute;
          inset:0;
          border:2px solid #2563eb;
          pointer-events:none;
        }

        .ProseMirror .column-resize-handle{
          background:#2563eb;
          width:4px;
        }

        .ProseMirror .tableWrapper{
          overflow-x:auto;
          margin:20px 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before{
          content:attr(data-placeholder);
          color:#9ca3af;
          pointer-events:none;
          float:left;
          height:0;
        }

        `}</style>
      </div>
    );
  },
);

CustomEditor.displayName = "CustomEditor";

export default CustomEditor;
