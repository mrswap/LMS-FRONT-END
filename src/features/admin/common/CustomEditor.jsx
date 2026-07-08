// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   FiBold,
//   FiItalic,
//   FiUnderline,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
//   FiAlignJustify,
//   FiList,
//   FiCornerUpLeft,
//   FiCornerUpRight,
//   FiImage,
//   FiLink,
//   FiLink2,
//   FiTrash2,
//   FiX,
//   FiPlus,
//   FiGrid,
//   FiChevronsLeft,
//   FiChevronsRight,
//   FiSlash,
//   FiArrowUp,
//   FiArrowDown,
//   FiArrowLeft,
//   FiArrowRight,
// } from "react-icons/fi";

// // ---------- helpers ----------

// const TABLE_ID_ATTR = "data-tbl-id";

// let tblCounter = 0;
// const nextTableId = () => `tbl-${++tblCounter}-${Date.now()}`;

// const cellStyleEven =
//   "border:1px solid #9aa5b1;padding:10px 14px;min-width:80px;background:#ffffff;";
// const cellStyleOdd =
//   "border:1px solid #9aa5b1;padding:10px 14px;min-width:80px;background:#f4f6f9;";
// const headStyle =
//   "border:1px solid #1d4e6f;border-bottom:2px solid #9aa5b1;padding:12px 14px;text-align:left;font-weight:700;background:#1d4e6f;color:#ffffff;min-width:80px;";
// const cellStyle = cellStyleEven;

// function buildTableHTML(rows, cols, id) {
//   let html = `<table ${TABLE_ID_ATTR}="${id}" class="custom-table" style="border-collapse:collapse;border:1px solid #9aa5b1;width:100%;margin:14px 0;font-family:Arial, sans-serif;font-size:14px;"><tbody>`;
//   for (let r = 0; r < rows; r++) {
//     html += "<tr>";
//     for (let c = 0; c < cols; c++) {
//       if (r === 0) {
//         html += `<th style="${headStyle}">Header ${c + 1}</th>`;
//       } else {
//         const style = r % 2 === 0 ? cellStyleEven : cellStyleOdd;
//         html += `<td style="${style}">&nbsp;</td>`;
//       }
//     }
//     html += "</tr>";
//   }
//   html += "</tbody></table><p><br></p>";
//   return html;
// }

// function closest(node, selector) {
//   while (node && node.nodeType !== 1) node = node.parentNode;
//   return node ? node.closest(selector) : null;
// }

// function findCell(node) {
//   return closest(node, "td,th");
// }
// function findRow(node) {
//   return closest(node, "tr");
// }
// function findTable(node) {
//   return closest(node, "table");
// }

// // rAF-based yield: gives the browser a real paint/input opportunity every
// // time we call this, unlike requestIdleCallback which can be deprioritized
// // and make the tab look "stuck" under heavy load.
// const yieldToBrowser = () =>
//   new Promise((resolve) => requestAnimationFrame(() => resolve()));

// // Safety cap: beyond this raw HTML length we skip all DOM-walking work
// // entirely and fall back to a regex-only sanitize (near-instant, no
// // per-element work at all). This only kicks in for truly pathological
// // pastes (tens of MB) — normal 250-page Word docs stay on the fast path.
// const MAX_PASTE_HTML_LENGTH = 50_000_000; // ~50MB of raw HTML

// // Structural/layout tags that never carry meaningful text styling.
// const SKIP_STYLE_TAGS = new Set([
//   "TABLE",
//   "TBODY",
//   "THEAD",
//   "TR",
//   "COL",
//   "COLGROUP",
//   "BR",
// ]);

// // Time budget per chunk of work, in ms. Frames are ~16ms; leaving this much
// // headroom keeps scrolling/typing/paint responsive even while we're mid-paste,
// // regardless of how many total elements there are (time-budgeted, not
// // count-budgeted, so it scales correctly from 1k to 1M+ elements).
// const FRAME_BUDGET_MS = 8;

// // ---------- toolbar pieces ----------

// const ToolBtn = ({
//   onMouseDown,
//   title,
//   active,
//   children,
//   danger,
//   disabled,
// }) => (
//   <button
//     type="button"
//     title={title}
//     disabled={disabled}
//     onMouseDown={(e) => {
//       e.preventDefault(); // keep selection alive
//       onMouseDown(e);
//     }}
//     className={`inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded-md text-sm transition-colors border
//       ${danger ? "text-red-600 hover:bg-red-50 border-transparent" : "text-gray-700 hover:bg-gray-200 border-transparent"}
//       ${active ? "bg-indigo-100 text-indigo-700 border-indigo-300" : ""}
//       ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//   >
//     {children}
//   </button>
// );

// const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1.5 shrink-0" />;

// const ColorPickerBtn = ({
//   title,
//   color,
//   onPick,
//   onMouseDown,
//   children,
//   inputRef,
// }) => (
//   <div className="relative">
//     <button
//       type="button"
//       title={title}
//       onMouseDown={(e) => {
//         e.preventDefault();
//         onMouseDown();
//         inputRef.current.click();
//       }}
//       className="inline-flex flex-col items-center justify-center h-8 w-9 rounded-md text-sm text-gray-700 hover:bg-gray-200 border border-transparent"
//     >
//       <span className="leading-none mb-1">{children}</span>
//       <span
//         className="block w-5 h-[3px] rounded-sm"
//         style={{ backgroundColor: color }}
//       />
//     </button>
//     <input
//       ref={inputRef}
//       type="color"
//       value={color}
//       onChange={(e) => onPick(e.target.value)}
//       className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
//       tabIndex={-1}
//     />
//   </div>
// );

// // ---------- main component ----------

// const CustomEditor = ({
//   value = "",
//   onChange = () => {},
//   placeholder = "Start typing here...",
// }) => {
//   const editorRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const savedSelectionRef = useRef(null);
//   const pasteInProgressRef = useRef(false);

//   const historyRef = useRef([value || ""]);
//   const historyIndexRef = useRef(0);
//   const skipNextHistoryRef = useRef(false);
//   const debounceRef = useRef(null);

//   const [isImageLoading, setIsImageLoading] = useState(false);
//   const [isPasteLoading, setIsPasteLoading] = useState(false);
//   const [pasteProgress, setPasteProgress] = useState(null); // { phase, done, total } | null

//   const [activeTableId, setActiveTableId] = useState(null);
//   const [toast, setToast] = useState(null);
//   const [activeFormats, setActiveFormats] = useState({});

//   const [textColor, setTextColor] = useState("#000000");
//   const [highlightColor, setHighlightColor] = useState("#ffff00");

//   const textColorInputRef = useRef(null);
//   const highlightColorInputRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerHTML !== value) {
//       editorRef.current.innerHTML = value || "";
//     }
//   }, [value]);

//   const flashToast = (msg) => {
//     setToast(msg);
//     window.clearTimeout(flashToast._t);
//     flashToast._t = window.setTimeout(() => setToast(null), 1600);
//   };

//   // ---- selection save/restore (so toolbar clicks / async paste don't lose cursor) ----
//   const saveSelection = () => {
//     const sel = window.getSelection();
//     if (
//       sel &&
//       sel.rangeCount > 0 &&
//       editorRef.current.contains(sel.anchorNode)
//     ) {
//       savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
//     }
//   };

//   const restoreSelection = () => {
//     const sel = window.getSelection();
//     sel.removeAllRanges();
//     if (savedSelectionRef.current) {
//       sel.addRange(savedSelectionRef.current);
//     } else {
//       editorRef.current.focus();
//     }
//   };

//   // returns the live Range object after restoring, so callers can insert
//   // directly via DOM ops instead of execCommand
//   const restoreSelectionRange = () => {
//     const sel = window.getSelection();
//     sel.removeAllRanges();
//     if (savedSelectionRef.current) {
//       sel.addRange(savedSelectionRef.current);
//       return savedSelectionRef.current;
//     }
//     editorRef.current.focus();
//     return null;
//   };

//   // ---- active format detection (for toolbar highlighting) ----
//   const updateActiveFormats = () => {
//     if (!editorRef.current) return;
//     try {
//       setActiveFormats({
//         bold: document.queryCommandState("bold"),
//         italic: document.queryCommandState("italic"),
//         underline: document.queryCommandState("underline"),
//         strikeThrough: document.queryCommandState("strikeThrough"),
//         superscript: document.queryCommandState("superscript"),
//         subscript: document.queryCommandState("subscript"),
//         justifyLeft: document.queryCommandState("justifyLeft"),
//         justifyCenter: document.queryCommandState("justifyCenter"),
//         justifyRight: document.queryCommandState("justifyRight"),
//         justifyFull: document.queryCommandState("justifyFull"),
//         insertUnorderedList: document.queryCommandState("insertUnorderedList"),
//         insertOrderedList: document.queryCommandState("insertOrderedList"),
//       });
//     } catch {
//       // some commands can throw if editor isn't focused yet - ignore
//     }
//   };

//   // ---- history ----
//   const pushHistory = useCallback(() => {
//     if (skipNextHistoryRef.current) {
//       skipNextHistoryRef.current = false;
//       return;
//     }
//     const html = editorRef.current.innerHTML;
//     const hist = historyRef.current;
//     const idx = historyIndexRef.current;
//     if (hist[idx] === html) return;
//     const trimmed = hist.slice(0, idx + 1);
//     trimmed.push(html);
//     historyRef.current = trimmed.slice(-100);
//     historyIndexRef.current = historyRef.current.length - 1;
//   }, []);

//   const scheduleHistory = useCallback(() => {
//     window.clearTimeout(debounceRef.current);
//     debounceRef.current = window.setTimeout(pushHistory, 400);
//   }, [pushHistory]);

//   // Single place that both schedules history AND notifies the parent
//   // (Formik) of the new content. Any code path that mutates
//   // editorRef.current's DOM *without* going through a native "input" event
//   // (e.g. direct appendChild/insertBefore during paste) MUST call this,
//   // otherwise React/Formik never learns the value changed.
//   const notifyContentChanged = useCallback(() => {
//     scheduleHistory();
//     if (editorRef.current) {
//       onChange(editorRef.current.innerHTML);
//     }
//   }, [scheduleHistory, onChange]);

//   const applyHTMLSnapshot = (html) => {
//     skipNextHistoryRef.current = true;
//     editorRef.current.innerHTML = html;
//     onChange(editorRef.current.innerHTML);
//   };

//   const undo = () => {
//     if (historyIndexRef.current > 0) {
//       historyIndexRef.current -= 1;
//       applyHTMLSnapshot(historyRef.current[historyIndexRef.current]);
//     }
//   };

//   const redo = () => {
//     if (historyIndexRef.current < historyRef.current.length - 1) {
//       historyIndexRef.current += 1;
//       applyHTMLSnapshot(historyRef.current[historyIndexRef.current]);
//     }
//   };

//   // ---- formatting ----
//   const applyFormat = (command, value = null) => {
//     editorRef.current.focus();
//     restoreSelection();
//     document.execCommand(command, false, value);
//     notifyContentChanged();
//     updateActiveFormats();
//   };

//   const insertHTMLAtCursor = (html) => {
//     restoreSelection();
//     editorRef.current.focus();
//     document.execCommand("insertHTML", false, html);
//     notifyContentChanged();
//   };

//   // ---- clear / deselect everything ----
//   const clearSelectionAndFormatting = () => {
//     restoreSelection();
//     try {
//       document.execCommand("removeFormat", false, null);
//     } catch {
//       // ignore
//     }
//     const sel = window.getSelection();
//     if (sel) sel.removeAllRanges();
//     savedSelectionRef.current = null;
//     setActiveFormats({});
//     editorRef.current.focus();
//     notifyContentChanged();
//   };

//   // ---- image (toolbar upload) ----
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setIsImageLoading(true);
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       insertHTMLAtCursor(
//         `<img src="${event.target.result}" alt="Uploaded image" style="max-width:100%;border-radius:4px;" />`,
//       );
//       setIsImageLoading(false);
//     };
//     reader.onerror = () => {
//       setIsImageLoading(false);
//       flashToast("Couldn't load that image — try a different file");
//     };
//     reader.readAsDataURL(file);
//     e.target.value = "";
//   };

//   // ---------- high-performance Word-paste pipeline ----------

//   const buildStyleMaps = (doc) => {
//     const classMap = new Map();
//     const tagMap = new Map();

//     const addTo = (map, key, cssText) => {
//       const existing = map.get(key);
//       map.set(key, existing ? `${existing};${cssText}` : cssText);
//     };

//     doc.querySelectorAll("style").forEach((styleEl) => {
//       try {
//         const sheet = new CSSStyleSheet();
//         sheet.replaceSync(styleEl.textContent || "");
//         for (const rule of sheet.cssRules) {
//           if (!rule.selectorText || !rule.style || !rule.style.cssText)
//             continue;
//           rule.selectorText.split(",").forEach((rawSel) => {
//             const sel = rawSel.trim();
//             const classMatch = sel.match(/^\.([\w-]+)$/);
//             if (classMatch) {
//               addTo(classMap, classMatch[1], rule.style.cssText);
//               return;
//             }
//             const tagMatch = sel.match(/^([a-zA-Z][\w-]*)$/);
//             if (tagMatch) {
//               addTo(tagMap, tagMatch[1].toUpperCase(), rule.style.cssText);
//               return;
//             }
//             const compoundMatch = sel.match(/^([a-zA-Z][\w-]*)\.([\w-]+)$/);
//             if (compoundMatch) {
//               addTo(classMap, compoundMatch[2], rule.style.cssText);
//             }
//             const multiClassMatch = sel.match(/\.([\w-]+)/g);

//             if (multiClassMatch) {
//               multiClassMatch.forEach((m) => {
//                 addTo(classMap, m.substring(1), rule.style.cssText);
//               });
//             }
//           });
//         }
//       } catch {
//         // malformed/unsupported Word CSS - skip, inline attrs still apply
//       }
//     });

//     return { classMap, tagMap };
//   };

//   // ---- Word image recovery ----
//   //
//   // Word's HTML clipboard points images at a local temp file
//   // (file:///C:/Users/.../clip_image001.png) that the browser can never
//   // load — and that file gets overwritten every time Word copies something
//   // new, so pasting a 2nd/3rd image in the same session silently breaks.
//   //
//   // The actual image bytes ARE present in the RTF clipboard flavor, as
//   // hex-encoded \pict blocks. We pull them out here and use them to patch
//   // the broken file:// references before the HTML ever touches the editor.

//   // Converts a Uint8Array to a binary string in chunks instead of one
//   // byte-at-a-time `+=` loop. Byte-by-byte string concatenation is O(n^2)-ish
//   // in practice for large strings and becomes very slow for multi-MB images
//   // embedded in the doc — chunking via String.fromCharCode.apply keeps it fast.
//   function bytesToBinaryString(bytes) {
//     const CHUNK = 8192;
//     let result = "";
//     for (let i = 0; i < bytes.length; i += CHUNK) {
//       const chunk = bytes.subarray(i, i + CHUNK);
//       result += String.fromCharCode.apply(null, chunk);
//     }
//     return result;
//   }

//   const extractImagesFromRtf = (rtf) => {
//     if (!rtf) return [];
//     const images = [];
//     let searchFrom = 0;

//     while (true) {
//       const start = rtf.indexOf("{\\pict", searchFrom);
//       if (start === -1) break;

//       // brace-matching to find the true end of this \pict group. A naive
//       // non-greedy regex would stop at the first "}", which is usually the
//       // closing brace of a nested \picprop group, not the real end.
//       let depth = 0;
//       let end = -1;
//       for (let i = start; i < rtf.length; i++) {
//         if (rtf[i] === "{") depth++;
//         else if (rtf[i] === "}") {
//           depth--;
//           if (depth === 0) {
//             end = i;
//             break;
//           }
//         }
//       }
//       if (end === -1) break;

//       const block = rtf.slice(start, end + 1);
//       searchFrom = end + 1;

//       const kwMatch = block.match(/\\(pngblip|jpegblip)\b/);
//       if (!kwMatch) {
//         // \wmetafile8 / \emfblip are vector formats browsers can't render
//         // directly. Record a placeholder so index alignment with the
//         // matching <img>/<v:imagedata> tags in the HTML is preserved.
//         images.push(null);
//         continue;
//       }
//       const mime = kwMatch[1] === "pngblip" ? "image/png" : "image/jpeg";

//       // Walk forward past the keyword, consuming ONLY genuine
//       // backslash-prefixed control-word tokens (e.g. \picw26565, \bin1234),
//       // stopping the instant we hit something that isn't a control word.
//       // This is deliberately more careful than a blind "strip every
//       // \word+digits pattern" regex: if a control word is directly
//       // followed by hex data with NO delimiting space (which Word does
//       // sometimes), a blind regex would misread the leading hex digits as
//       // the control word's numeric parameter and delete them - shifting
//       // every subsequent byte by a nibble and corrupting the whole image.
//       // Walking explicitly from "\" to "\" avoids that ambiguity entirely.
//       let pos = kwMatch.index + kwMatch[0].length;
//       while (pos < block.length) {
//         while (pos < block.length && /\s/.test(block[pos])) pos++;
//         if (block[pos] === "\\") {
//           const m = /^\\[a-zA-Z]+-?\d*/.exec(block.slice(pos));
//           if (m && m[0].length > 1) {
//             pos += m[0].length;
//             continue;
//           }
//           pos++; // unrecognized escape - skip just the backslash
//           continue;
//         }
//         break; // reached the real start of the hex data
//       }

//       const hex = block
//         .slice(pos)
//         .replace(/\{[^{}]*\}/g, "") // strip any trailing nested groups
//         .replace(/[^0-9a-fA-F]/g, ""); // keep hex digits only

//       if (hex.length < 40) {
//         images.push(null);
//         continue;
//       }

//       try {
//         const byteLen = hex.length >> 1;
//         const bytes = new Uint8Array(byteLen);
//         for (let i = 0; i < byteLen; i++) {
//           bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
//         }
//         const binary = bytesToBinaryString(bytes);
//         images.push(`data:${mime};base64,${btoa(binary)}`);
//       } catch {
//         images.push(null);
//       }
//     }

//     return images;
//   };

//   // Replaces broken file:// image srcs (both plain <img> and Word's VML
//   // <v:imagedata> wrapper) with real image data pulled from RTF, matched
//   // in document order. Any <img> that already has a usable src (http(s)://
//   // or data:) is left untouched.
//   const fixWordImageSrcs = (doc, rtfImages) => {
//     let rtfIdx = 0;
//     const nextRtfImage = () => {
//       while (rtfIdx < rtfImages.length) {
//         const img = rtfImages[rtfIdx];
//         rtfIdx++;
//         if (img) return img;
//         // null = this slot was a vector image we couldn't decode; skip it
//         // but don't stop looking for the next usable one
//       }
//       return null;
//     };

//     // plain <img> tags with a local file:// src
//     doc.querySelectorAll("img").forEach((img) => {
//       const src = img.getAttribute("src") || "";
//       if (/^file:\/\//i.test(src)) {
//         const dataUrl = nextRtfImage();
//         if (dataUrl) {
//           img.setAttribute("src", dataUrl);
//         } else {
//           img.remove(); // no usable data (e.g. WMF) - drop the broken img
//         }
//       }
//     });

//     // Word's VML wrapper: <v:shape><v:imagedata src="file://..."/></v:shape>
//     // HTML parsing keeps the colon as a literal part of the tag name.
//     doc.querySelectorAll("imagedata, v\\:imagedata").forEach((vImg) => {
//       const src = vImg.getAttribute("src") || vImg.getAttribute("o:href") || "";
//       if (!/^file:\/\//i.test(src)) return;

//       const dataUrl = nextRtfImage();
//       const shape = vImg.closest("shape, v\\:shape");
//       const target = shape || vImg;

//       if (!dataUrl) {
//         target.remove();
//         return;
//       }

//       const newImg = doc.createElement("img");
//       newImg.setAttribute("src", dataUrl);
//       newImg.setAttribute("style", "max-width:100%;");

//       if (shape) {
//         const styleAttr = shape.getAttribute("style") || "";
//         const w = styleAttr.match(/width:\s*([\d.]+[a-z%]*)/i);
//         const h = styleAttr.match(/height:\s*([\d.]+[a-z%]*)/i);
//         if (w) newImg.style.width = w[1];
//         if (h) newImg.style.height = h[1];
//       }

//       target.parentNode.replaceChild(newImg, target);
//     });
//   };

//   const propagateCellBackgrounds = (doc) => {
//     doc.querySelectorAll("td, th").forEach((cell) => {
//       const cellStyle = cell.getAttribute("style") || "";
//       const bgMatch = cellStyle.match(/background(?:-color)?\s*:\s*([^;]+)/i);
//       // Word often uses the legacy bgcolor="#rrggbb" attribute for cell
//       // shading INSTEAD of a CSS style — check both.
//       const bgColor = bgMatch
//         ? bgMatch[1].trim()
//         : cell.getAttribute("bgcolor")
//           ? cell.getAttribute("bgcolor").trim()
//           : null;
//       if (!bgColor) return;

//       if (!bgMatch) {
//         const sep = cellStyle && !cellStyle.trim().endsWith(";") ? "; " : "";
//         cell.setAttribute(
//           "style",
//           `${cellStyle}${sep}background-color:${bgColor};`,
//         );
//       }

//       Array.from(cell.children).forEach((child) => {
//         const existing = child.getAttribute("style") || "";
//         if (/background(?:-color)?\s*:/i.test(existing)) return;
//         const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
//         child.setAttribute(
//           "style",
//           `${existing}${sep}background-color:${bgColor};`,
//         );
//       });
//     });
//   };

//   // ---- Safety net: if a recovered heading/divider ends up nested inside a
//   // table (this should never legitimately happen — floating headings never
//   // belong inside a real data table's rows), pull it back out and place it
//   // as a sibling immediately before that table instead. This protects the
//   // table's structure even if the paragraph-index heuristic above drifts on
//   // very large documents with many headings/tables.
//   const rescueHeadingsFromTables = (doc) => {
//     const markers = doc.body.querySelectorAll(
//       "[data-recovered-heading], [data-recovered-divider]",
//     );
//     markers.forEach((el) => {
//       const tbl = el.closest("table");
//       if (!tbl || !tbl.parentNode) return;
//       tbl.parentNode.insertBefore(el, tbl);
//     });
//   };

//   // ---- Diagnostic: tells us definitively whether the clipboard HTML even
//   // contains a colored table/heading BEFORE any processing happens. If this
//   // logs "white-text=true" but everything else is "false", the colored
//   // heading banner was simply never included in what got copied — no
//   // client-side code can recover data that was never part of the copy.
//   const diagnoseClipboard = (rawHtml) => {
//     const hasTable = /<table/i.test(rawHtml);
//     const hasBgStyle = /background(?:-color)?\s*:/i.test(rawHtml);
//     const hasBgColorAttr = /bgcolor\s*=/i.test(rawHtml);
//     const hasWhiteColor = /color:\s*(white|#fff\b|#ffffff)/i.test(rawHtml);
//     console.log(
//       `%c[CLIPBOARD DIAGNOSTIC] table=${hasTable} bg-style=${hasBgStyle} bgcolor-attr=${hasBgColorAttr} white-text=${hasWhiteColor}`,
//       "color:#d97706;font-weight:bold;",
//     );
//     if (hasWhiteColor && !hasTable && !hasBgStyle && !hasBgColorAttr) {
//       console.warn(
//         "[CLIPBOARD DIAGNOSTIC] White text found but NO table/background anywhere in copied HTML. " +
//           "The colored heading banner was NOT included in what got copied from Word — " +
//           "re-select from the very left edge of the heading bar and copy again.",
//       );
//     }
//   };

//   const moveNodesTimeBudgeted = async (
//     sourceContainer,
//     targetParent,
//     refNode,
//     onProgress,
//   ) => {
//     const total = sourceContainer.childNodes.length;
//     let done = 0;

//     // Build everything off-DOM first (documentFragment is not attached to the
//     // live page, so appending into it does NOT trigger layout/reflow at all).
//     // This is what makes the chunking actually cheap.
//     const bigFrag = document.createDocumentFragment();
//     while (sourceContainer.firstChild) {
//       const start = performance.now();
//       while (
//         sourceContainer.firstChild &&
//         performance.now() - start < FRAME_BUDGET_MS
//       ) {
//         bigFrag.appendChild(sourceContainer.firstChild);
//         done++;
//       }
//       onProgress && onProgress(done, total);
//       await yieldToBrowser(); // let the browser paint/respond to input
//     }

//     // Single write into the live, visible editor — only ONE reflow happens
//     // here instead of one per chunk.
//     targetParent.insertBefore(bigFrag, refNode);
//   };

//   // ---- (dependency #1) strip Word's junk markup, including invisible
//   // vglayout tab-stop tables that otherwise create phantom extra spacing ----
//   const stripWordCruft = (html) =>
//     html
//       .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
//       .replace(/<xml>[\s\S]*?<\/xml>/gi, "")
//       .replace(/<o:p>\s*<\/o:p>/gi, "")
//       .replace(/<o:p>/gi, "")
//       .replace(/<\/o:p>/gi, "")
//       // Word's hidden vglayout spans (empty tables used only for internal
//       // tab-stop positioning) - these render as real empty tables/width in
//       // the browser and cause the extra blank spacing you're seeing
//       .replace(/<span[^>]*mso-ignore:vglayout[^>]*>[\s\S]*?<\/span>/gi, "")
//       .replace(/<br[^>]*mso-ignore:vglayout[^>]*>/gi, "");

//   // Word exports two visually-similar-but-semantically-different patterns using
//   // the same margin-left + negative text-indent combo:
//   //  a) real bulleted/numbered list items (has "mso-list:" in style, or a
//   //     child span with mso-list:Ignore holding the literal bullet char)
//   //  b) a "fake center" hack for shape/textbox headings (big margin-left +
//   //     equally big negative text-indent, no bullet involved) — only works
//   //     inside the original fixed-width textbox, breaks in a fluid editor.
//   // Blindly capping margin-left while leaving text-indent untouched (the old
//   // code) desyncs the pair and collapses both patterns to ~0 net indent.
//   // This normalizes each pattern to something that actually renders correctly
//   // at any width.
//   function normalizeWordIndent(el) {
//     const style = el.getAttribute("style") || "";
//     const mlMatch = style.match(/margin-left\s*:\s*([\d.]+)pt/i);
//     const tiMatch = style.match(/text-indent\s*:\s*(-?[\d.]+)pt/i);
//     if (!mlMatch && !tiMatch) return;

//     const isListItem =
//       /mso-list\s*:/i.test(style) ||
//       (el.querySelector &&
//         el.querySelector("span[style*='mso-list:Ignore' i]"));

//     let newStyle = style
//       .replace(/margin-left\s*:\s*[\d.]+pt;?/gi, "")
//       .replace(/text-indent\s*:\s*-?[\d.]+pt;?/gi, "");

//     if (isListItem) {
//       // Real bullet/number paragraph: keep a small, consistent hanging indent
//       // so the bullet glyph + wrapped text line up, regardless of Word's
//       // original (often huge, inconsistent) pt values.
//       newStyle += "margin-left:28px;text-indent:-18px;";
//     } else if (tiMatch && parseFloat(tiMatch[1]) < 0 && mlMatch) {
//       // Fake-center hack (big margin-left + big negative text-indent, no
//       // bullet). Recover the actual intent instead of the broken math.
//       if (!/text-align\s*:/i.test(newStyle)) {
//         newStyle += "text-align:center;";
//       }
//     } else if (mlMatch) {
//       // Plain indent, no hanging trick - just cap it sensibly.
//       const px = Math.min(parseFloat(mlMatch[1]) * 1.333, 32);
//       newStyle += `margin-left:${px}px;`;
//     }

//     el.setAttribute("style", newStyle);
//   }

//   const processNodesTimeBudgeted = async (allEls, styleMaps, onProgress) => {
//     const { classMap, tagMap } = styleMaps;
//     const total = allEls.length;
//     let i = 0;
//     while (i < total) {
//       const start = performance.now();
//       while (i < total && performance.now() - start < FRAME_BUDGET_MS) {
//         const el = allEls[i];
//         if (!SKIP_STYLE_TAGS.has(el.tagName)) {
//           const pieces = [];

//           const tagCss = tagMap.get(el.tagName);
//           if (tagCss) pieces.push(tagCss);

//           const cls = el.getAttribute("class");
//           if (cls && classMap.size) {
//             cls.split(/\s+/).forEach((c) => {
//               const css = classMap.get(c);
//               if (css) pieces.push(css);
//             });
//           }

//           if (pieces.length) {
//             const existing = el.getAttribute("style") || "";
//             const combined = existing
//               ? `${pieces.join(";")};${existing}`
//               : pieces.join(";");
//             el.setAttribute("style", combined);
//           }

//           const finalStyle = el.getAttribute("style") || "";
//           if (
//             /color:\s*(white|#fff\b|#ffffff)/i.test(finalStyle) &&
//             !/background(?:-color)?\s*:/i.test(finalStyle)
//           ) {
//             el.setAttribute(
//               "style",
//               `${finalStyle};background-color:#1d4e6f;padding:4px 8px;`,
//             );
//           }

//           // FIXED: replaces the old margin-left-only cap. That version left
//           // text-indent untouched, which desynced Word's margin-left +
//           // negative text-indent pairs (used both for bullet hanging indents
//           // and for shape-heading "fake centering") and collapsed them to a
//           // near-zero net indent. This handles both patterns correctly.
//           normalizeWordIndent(el);
//         }
//         el.removeAttribute("lang");
//         el.removeAttribute("align");
//         el.removeAttribute("xmlns:v");
//         el.removeAttribute("xmlns:o");
//         i++;
//       }
//       onProgress && onProgress(i, total);
//       await yieldToBrowser();
//     }
//   };

//   // // ---- (dependency #2) per-element style merge + normalize oversized
//   // // Word list indents (pt-based margins from MsoListParagraph etc.) ----
//   // const processNodesTimeBudgeted = async (allEls, styleMaps, onProgress) => {
//   //   const { classMap, tagMap } = styleMaps;
//   //   const total = allEls.length;
//   //   let i = 0;
//   //   while (i < total) {
//   //     const start = performance.now();
//   //     while (i < total && performance.now() - start < FRAME_BUDGET_MS) {
//   //       const el = allEls[i];
//   //       if (!SKIP_STYLE_TAGS.has(el.tagName)) {
//   //         const pieces = [];

//   //         const tagCss = tagMap.get(el.tagName);
//   //         if (tagCss) pieces.push(tagCss);

//   //         const cls = el.getAttribute("class");
//   //         if (cls && classMap.size) {
//   //           cls.split(/\s+/).forEach((c) => {
//   //             const css = classMap.get(c);
//   //             if (css) pieces.push(css);
//   //           });
//   //         }

//   //         if (pieces.length) {
//   //           const existing = el.getAttribute("style") || "";
//   //           const combined = existing
//   //             ? `${pieces.join(";")};${existing}`
//   //             : pieces.join(";");
//   //           el.setAttribute("style", combined);
//   //         }

//   //         const finalStyle = el.getAttribute("style") || "";
//   //         if (
//   //           /color:\s*(white|#fff\b|#ffffff)/i.test(finalStyle) &&
//   //           !/background(?:-color)?\s*:/i.test(finalStyle)
//   //         ) {
//   //           el.setAttribute(
//   //             "style",
//   //             `${finalStyle};background-color:#1d4e6f;padding:4px 8px;`,
//   //           );
//   //         }

//   //         // NEW: cap Word's huge pt-based left margins/indents (common on
//   //         // MsoListParagraph when Word didn't emit a real <ul>/<li>) so they
//   //         // don't blow up the visual indent in the editor
//   //         let styleNow = el.getAttribute("style") || "";
//   //         if (styleNow && /margin-left\s*:\s*[\d.]+pt/i.test(styleNow)) {
//   //           styleNow = styleNow.replace(
//   //             /margin-left\s*:\s*([\d.]+)pt/gi,
//   //             (m, num) => `margin-left:${Math.min(parseFloat(num), 24)}px`,
//   //           );
//   //           el.setAttribute("style", styleNow);
//   //         }
//   //       }
//   //       el.removeAttribute("lang");
//   //       el.removeAttribute("align");
//   //       el.removeAttribute("xmlns:v");
//   //       el.removeAttribute("xmlns:o");
//   //       i++;
//   //     }
//   //     onProgress && onProgress(i, total);
//   //     await yieldToBrowser();
//   //   }
//   // };

//   const cleanPastedHTML = async (rawHtml, rawRtf, onProgress) => {
//     if (rawHtml.length > MAX_PASTE_HTML_LENGTH) {
//       return null; // signal caller to use the regex-only fallback
//     }

//     try {
//       const html = stripWordCruft(rawHtml);

//       diagnoseClipboard(rawHtml);

//       const parser = new DOMParser();
//       const doc = parser.parseFromString(html, "text/html");

//       if (!doc.body || !doc.body.firstChild) {
//         return null; // parsing produced nothing usable - let caller fall back
//       }

//       // fix broken file:// image references using RTF's embedded image data
//       const rtfImages = extractImagesFromRtf(rawRtf);
//       if (rtfImages.length) {
//         fixWordImageSrcs(doc, rtfImages);
//       }

//       propagateCellBackgrounds(doc);

//       // ---- Parse RTF color table once (\colortbl;\red..\green..\blue..;...)
//       // so we can resolve \cfN (character color) indices used inside shapes.
//       const rtfColorTable = [null]; // index 0 = "auto" / no explicit color
//       if (rawRtf) {
//         const ctMatch = rawRtf.match(/\{\\colortbl;([\s\S]*?)\}/);
//         if (ctMatch) {
//           const entries = ctMatch[1].split(";");
//           entries.forEach((entry) => {
//             const r = entry.match(/\\red(\d+)/);
//             const g = entry.match(/\\green(\d+)/);
//             const b = entry.match(/\\blue(\d+)/);
//             if (r && g && b) {
//               const hex = `#${[r[1], g[1], b[1]]
//                 .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
//                 .join("")}`;
//               rtfColorTable.push(hex);
//             } else if (entry.trim() === "") {
//               rtfColorTable.push(null); // auto/black entry
//             }
//           });
//         }
//       }

//       // ---- Walk the raw RTF main stream and, for every {\shp ...} group,
//       // record how many "\par" paragraph breaks occurred BEFORE it in the
//       // main document flow. Shape groups are anchored inline at their
//       // paragraph position in RTF, so this paragraph count gives us a
//       // stable, purely positional index for where each shape belongs - no
//       // fragile text-snippet matching required. \par tokens that occur
//       // *inside* a shape group (used only for wrapping the shape's own
//       // caption text) are deliberately skipped so they don't pollute the
//       // main-flow count.
//       const shapeParagraphIndex = new Map(); // shpStart -> paragraphIndexBefore
//       if (rawRtf) {
//         let pos = 0;
//         let paraCount = 0;
//         const n = rawRtf.length;
//         while (pos < n) {
//           if (rawRtf.startsWith("{\\shp", pos)) {
//             let depth = 0;
//             let j = pos;
//             let shpEnd = -1;
//             for (; j < n; j++) {
//               if (rawRtf[j] === "{") depth++;
//               else if (rawRtf[j] === "}") {
//                 depth--;
//                 if (depth === 0) {
//                   shpEnd = j;
//                   break;
//                 }
//               }
//             }
//             if (shpEnd === -1) break;
//             shapeParagraphIndex.set(pos, paraCount);
//             pos = shpEnd + 1;
//             continue;
//           }
//           if (
//             rawRtf.startsWith("\\par", pos) &&
//             !/[a-zA-Z]/.test(rawRtf[pos + 4] || "")
//           ) {
//             paraCount++;
//             pos += 4;
//             continue;
//           }
//           pos++;
//         }
//       }

//       // ---- Extract floating shape/textbox headings from RTF, each with
//       // its own fill color, border(line) color, text color, font size,
//       // alignment, and its main-flow paragraph index (from the map above) ----
//       const shapeTexts = []; // { text, bgColor, textColor, borderColor, fontSizePx, align, paragraphIndex, rtfOrder }
//       // Word often draws a heading as TWO separate floating shapes anchored
//       // at the same spot: a thin line-only shape (no \shptxt at all - this
//       // IS the divider rule) and a second textbox shape with the actual
//       // heading background+text. The old code silently `continue`d past
//       // any shape with no \shptxt, so the divider was extracted from the
//       // source but then thrown away. We now keep a record of it instead,
//       // so it can be re-inserted right before the heading it belongs to -
//       // this is recovering real source data, not synthesizing a new one.
//       const dividerMarkers = []; // { paragraphIndex, rtfOrder, used }
//       if (rawRtf) {
//         let searchFrom = 0;
//         let rtfOrder = 0;
//         while (true) {
//           const shpStart = rawRtf.indexOf("{\\shp", searchFrom);
//           if (shpStart === -1) break;

//           let depth = 0;
//           let shpEnd = -1;
//           for (let i = shpStart; i < rawRtf.length; i++) {
//             if (rawRtf[i] === "{") depth++;
//             else if (rawRtf[i] === "}") {
//               depth--;
//               if (depth === 0) {
//                 shpEnd = i;
//                 break;
//               }
//             }
//           }
//           if (shpEnd === -1) break;
//           const shapeGroup = rawRtf.slice(shpStart, shpEnd + 1);
//           searchFrom = shpEnd + 1;

//           // fill color: Windows COLORREF integer 0x00BBGGRR
//           let bgColor = null;
//           const fillMatch = shapeGroup.match(
//             /\{\\sp\{\\sn fillColor\}\{\\sv (\d+)\}\}/,
//           );
//           if (fillMatch) {
//             const val = parseInt(fillMatch[1], 10);
//             const r = val & 0xff;
//             const g = (val >> 8) & 0xff;
//             const b = (val >> 16) & 0xff;
//             bgColor = `#${[r, g, b]
//               .map((x) => x.toString(16).padStart(2, "0"))
//               .join("")}`;
//           }

//           // border/line color of the shape - draws the vertical accent bar
//           let borderColor = null;
//           const lineColorMatch = shapeGroup.match(
//             /\{\\sp\{\\sn lineColor\}\{\\sv (\d+)\}\}/,
//           );
//           const fLineMatch = shapeGroup.match(
//             /\{\\sp\{\\sn fLine\}\{\\sv (\d+)\}\}/,
//           );
//           const lineIsOn = !fLineMatch || fLineMatch[1] !== "0";
//           if (lineColorMatch && lineIsOn) {
//             const val = parseInt(lineColorMatch[1], 10);
//             const r = val & 0xff;
//             const g = (val >> 8) & 0xff;
//             const b = (val >> 16) & 0xff;
//             borderColor = `#${[r, g, b]
//               .map((x) => x.toString(16).padStart(2, "0"))
//               .join("")}`;
//           }

//           const txtStart = shapeGroup.indexOf("{\\shptxt");
//           if (txtStart === -1) {
//             // Check if this shape actually has a fill (background) — if it does,
//             // it's a decorative rectangle belonging to some heading's group, NOT
//             // a standalone divider line.
//             const fFilledMatch = shapeGroup.match(
//               /\{\\sp\{\\sn fFilled\}\{\\sv (\d+)\}\}/,
//             );
//             const hasFillProp = /\{\\sp\{\\sn fillColor\}/.test(shapeGroup);
//             const isActuallyFilled = fFilledMatch
//               ? fFilledMatch[1] !== "0"
//               : hasFillProp;

//             if (!isActuallyFilled) {
//               dividerMarkers.push({
//                 paragraphIndex: shapeParagraphIndex.has(shpStart)
//                   ? shapeParagraphIndex.get(shpStart)
//                   : rtfOrder,
//                 rtfOrder: rtfOrder++,
//                 used: false,
//               });
//             }
//             continue;
//           }

//           let tdepth = 0;
//           let txtEnd = -1;
//           for (let i = txtStart; i < shapeGroup.length; i++) {
//             if (shapeGroup[i] === "{") tdepth++;
//             else if (shapeGroup[i] === "}") {
//               tdepth--;
//               if (tdepth === 0) {
//                 txtEnd = i;
//                 break;
//               }
//             }
//           }
//           if (txtEnd === -1) continue;

//           const block = shapeGroup.slice(txtStart, txtEnd + 1);

//           // ---- FIX #1: skip Word field-code shapes (e.g. page numbers).
//           // Word writes "Page \* PAGE 10" style footers using a
//           // \field{\*\fldinst PAGE}{\fldrslt N} construct inside the
//           // shape text. This is never real heading content — it's a
//           // footer page-number field that gets duplicated once per page
//           // when a multi-page selection is copied. Drop it entirely
//           // before any text extraction happens.
//           const looksLikePageField =
//             /\\\*\s*PAGE\b/i.test(block) ||
//             /\\fldinst[^}]*\bPAGE\b/i.test(block) ||
//             /\\fldinst[^}]*\bNUMPAGES\b/i.test(block);
//           if (looksLikePageField) {
//             continue;
//           }

//           // text color: first \cfN found inside the text block
//           let textColor = null;
//           const cfMatch = block.match(/\\cf(\d+)/);
//           if (cfMatch) {
//             const idx = parseInt(cfMatch[1], 10);
//             textColor = rtfColorTable[idx] || null;
//           }

//           // font size: \fsN is in half-points -> convert to px (~1.333 ratio)
//           let fontSizePx = 16;
//           const fsMatch = block.match(/\\fs(\d+)/);
//           if (fsMatch) {
//             const pt = parseInt(fsMatch[1], 10) / 2;
//             fontSizePx = Math.round(pt * 1.333);
//           }

//           // alignment
//           let align = "left";
//           if (/\\qc\b/.test(block)) align = "center";
//           else if (/\\qr\b/.test(block)) align = "right";
//           else {
//             // Word often "fake-centers" shape text using a large left indent (\li)
//             // paired with an equally large NEGATIVE first-line indent (\fi), instead
//             // of a real \qc control word — same trick normalizeWordIndent() already
//             // detects for plain HTML paragraphs. Catch it here too so shape headings
//             // recovered purely from RTF don't silently default to left.
//             const liMatch = block.match(/\\li(-?\d+)/);
//             const fiMatch = block.match(/\\fi(-?\d+)/);
//             if (liMatch && fiMatch) {
//               const li = parseInt(liMatch[1], 10);
//               const fi = parseInt(fiMatch[1], 10);
//               if (li > 0 && fi < 0 && Math.abs(fi) > li * 0.3) {
//                 align = "center";
//               }
//             }
//           }
//           // NOTE: \par / \line are replaced with a plain space (not <br>),
//           // because in RTF they mark where Word happened to wrap the line
//           // at the shape's ORIGINAL width — forcing those as hard <br>
//           // breaks makes every word land on its own line once rendered at
//           // a different width. Using a space lets the browser wrap the
//           // text naturally, exactly like Word did visually.
//           const text = block
//             .replace(/\\par\b/g, " ")
//             .replace(/\\line\b/g, " ")
//             .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
//               String.fromCharCode(parseInt(hex, 16)),
//             )
//             .replace(/\{\\pict[\s\S]*?\}/g, "")
//             .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
//             .replace(/[{}]/g, "")
//             .replace(/\s+/g, " ")
//             .trim();

//           if (text.length > 0) {
//             shapeTexts.push({
//               text,
//               bgColor,
//               textColor,
//               borderColor,
//               fontSizePx,
//               align,
//               paragraphIndex: shapeParagraphIndex.has(shpStart)
//                 ? shapeParagraphIndex.get(shpStart)
//                 : rtfOrder, // fallback if map lookup somehow misses
//               rtfOrder: rtfOrder++,
//             });
//           }
//         }
//       }

//       // ---- FIX #2: drop repeated-verbatim shapes (header/footer boilerplate).
//       // A real heading appears once per document. If the exact same shape
//       // text shows up more than once, it's Word repeating a page header or
//       // footer once per page in the copied range — every instance of that
//       // text should be dropped, not just the duplicates.
//       const shapeTextFreq = new Map();
//       shapeTexts.forEach((s) => {
//         const key = s.text.trim().toLowerCase();
//         shapeTextFreq.set(key, (shapeTextFreq.get(key) || 0) + 1);
//       });
//       const dedupedShapeTexts = shapeTexts.filter((s) => {
//         const key = s.text.trim().toLowerCase();
//         return shapeTextFreq.get(key) === 1;
//       });

//       if (dedupedShapeTexts.length) {
//         const existingPlainText = (doc.body.textContent || "")
//           .replace(/\s+/g, " ")
//           .trim();

//         const buildHeadingEl = ({
//           text,
//           bgColor,
//           textColor,
//           borderColor,
//           fontSizePx,
//           align,
//         }) => {
//           const heading = doc.createElement("p");
//           const bg = bgColor || "transparent";

//           let finalTextColor = textColor;
//           if (!finalTextColor) {
//             if (bgColor) {
//               const r = parseInt(bgColor.slice(1, 3), 16);
//               const g = parseInt(bgColor.slice(3, 5), 16);
//               const b = parseInt(bgColor.slice(5, 7), 16);
//               const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//               finalTextColor = luminance < 0.5 ? "#ffffff" : "#1a1a1a";
//             } else {
//               finalTextColor = "#1a1a1a";
//             }
//           }

//           // FIX: use borderColor from RTF if we actually found one, otherwise
//           // fall back to the TEXT color (always contrasts with bg) instead of
//           // bgColor itself (which made the border invisible - same color as bg).
//           const accentColor = borderColor || finalTextColor || null;

//           heading.setAttribute(
//             "style",
//             `background-color:${bg};color:${finalTextColor};font-weight:700;` +
//               `font-size:${fontSizePx}px;padding:10px 16px;margin:0 0 8px 0;` +
//               `text-align:${align};border-radius:2px;` +
//               (accentColor ? `border-left:4px solid ${accentColor};` : "") +
//               `white-space:normal;word-wrap:break-word;line-height:1.4;`,
//           );
//           heading.textContent = text;
//           heading.setAttribute("data-recovered-heading", "1");
//           return heading;
//         };

//         // Detect Word's real divider paragraphs: empty of text, but carrying
//         // a border-top/border-bottom (or a literal <hr>). We NEVER
//         // synthesize one — we only recognize it if the source doc actually
//         // had it, so it either stays exactly where Word put it or doesn't
//         // appear at all.
//         const isDividerElement = (el) => {
//           if (el.tagName === "HR") return true;
//           const style = el.getAttribute("style") || "";
//           const hasText = (el.textContent || "").trim().length > 0;
//           if (hasText) return false;
//           if (/border-(top|bottom)\s*:\s*[^;]*\d/i.test(style)) return true;
//           // Word sometimes puts the border on a child span/div instead of
//           // directly on the paragraph itself
//           return Array.from(el.children || []).some((child) => {
//             const cs = child.getAttribute("style") || "";
//             return /border-(top|bottom)\s*:\s*[^;]*\d/i.test(cs);
//           });
//         };

//         const queue = dedupedShapeTexts
//           .map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ").trim() }))
//           .filter(
//             (s) => s.text.length > 0 && !existingPlainText.includes(s.text),
//           )
//           // keep RTF stream order - paragraphIndex values are inherently
//           // increasing in this order for correctly-anchored shapes
//           .sort((a, b) => a.rtfOrder - b.rtfOrder);

//         // ---- Candidate block-level "paragraph units" in the HTML doc, in
//         // document order. This is what paragraphIndex is mapped against.
//         //
//         // IMPORTANT: do NOT filter out empty paragraphs here. Word's RTF \par
//         // count includes every paragraph mark, including the ones that only
//         // exist to anchor an invisible floating shape (empty <p> in the HTML
//         // clipboard) or a divider line. If we skip those empty paragraphs
//         // while RTF still counts them, the index mapping drifts further off
//         // with every empty paragraph encountered.
//         // const candidates = Array.from(
//         //   doc.body.querySelectorAll(
//         //     "p, li, td, th, div, h1, h2, h3, h4, h5, h6, hr",
//         //   ),
//         // );

//         const candidates = Array.from(
//           doc.body.querySelectorAll(
//             "p, li, div, h1, h2, h3, h4, h5, h6, hr, table",
//           ),
//         ).filter((el) => el.tagName === "TABLE" || !el.closest("table"));

//         // ---- Insert each heading directly before the candidate at its
//         // computed paragraph index. If that candidate is an EMPTY
//         // paragraph (Word commonly anchors a floating shape's paragraph
//         // mark to an empty "spacer" paragraph that visually belongs
//         // BEFORE the heading, not after it), skip forward past any
//         // consecutive empty candidates and insert before the first
//         // non-empty one instead.
//         //
//         // FIX: if one of those empty candidates is actually a real divider
//         // line copied from Word (isDividerElement), we stop skipping right
//         // there and place the heading immediately AFTER the divider instead
//         // of jumping past it — this preserves the original
//         // "divider -> heading" layout instead of losing the divider or
//         // stranding it in the wrong spot.
//         // Sort dividers by rtfOrder so we always consume them in source
//         // order when matching them up against headings below.
//         const sortedDividers = dividerMarkers
//           .slice()
//           .sort((a, b) => a.rtfOrder - b.rtfOrder);

//         const findDividerFor = (shape) => {
//           // A divider belongs to a heading if it appears at or just before
//           // the heading's own paragraph position and hasn't been claimed by
//           // an earlier heading yet. We take the closest unused one at or
//           // before this shape's paragraphIndex.
//           let best = null;
//           for (const d of sortedDividers) {
//             if (d.used) continue;
//             if (d.paragraphIndex > shape.paragraphIndex) break;
//             best = d; // keep the latest (closest) match found so far
//           }
//           if (best) best.used = true;
//           return best;
//         };

//         queue.forEach((shape) => {
//           let idx = Math.max(
//             0,
//             Math.min(shape.paragraphIndex, candidates.length),
//           );

//           while (
//             idx < candidates.length &&
//             (candidates[idx].textContent || "").trim().length === 0 &&
//             !isDividerElement(candidates[idx])
//           ) {
//             idx++;
//           }

//           // if we stopped ON a real divider that was already present as an
//           // HTML element, the heading goes right after it
//           if (idx < candidates.length && isDividerElement(candidates[idx])) {
//             idx++;
//           }

//           const heading = buildHeadingEl(shape);

//           // Recover the actual divider line Word drew for this heading (a
//           // separate line-only floating shape in the RTF), rather than
//           // inventing one - only add it if the source really had it.
//           const divider = findDividerFor(shape)
//             ? doc.createElement("hr")
//             : null;
//           if (divider) divider.setAttribute("data-recovered-divider", "1");

//           // agar target ek table cell hai, to poore table ke pehle insert karo,
//           // row ke andar nahi — warna heading <tr> ke andar ghus jaati hai
//           let insertionTarget = candidates[idx];
//           if (
//             insertionTarget &&
//             (insertionTarget.tagName === "TD" ||
//               insertionTarget.tagName === "TH")
//           ) {
//             const tbl = insertionTarget.closest("table");
//             if (tbl && tbl.parentNode) {
//               insertionTarget = tbl;
//             }
//           }

//           if (insertionTarget && insertionTarget.parentNode) {
//             if (divider) {
//               insertionTarget.parentNode.insertBefore(divider, insertionTarget);
//             }
//             insertionTarget.parentNode.insertBefore(heading, insertionTarget);
//           } else {
//             if (divider) doc.body.appendChild(divider);
//             doc.body.appendChild(heading);
//           }
//         });

//         // Final safety pass: guarantee no heading/divider ended up nested
//         // inside a table's rows/cells, regardless of any drift above.
//         rescueHeadingsFromTables(doc);
//       }

//       const styleMaps = buildStyleMaps(doc);

//       // NOTE: this container is intentionally kept DETACHED from
//       // document.body. Attaching a 500-page tree to the live DOM forces the
//       // browser to compute style/layout for the entire tree synchronously in
//       // one shot — that's what was causing the tab freeze. A detached
//       // fragment/div can still be freely queried and mutated
//       // (querySelectorAll, setAttribute, etc. all work fine off-DOM), so
//       // there's no need to attach it just to process it.
//       const container = document.createElement("div");
//       container.style.cssText =
//         "position:fixed;left:-9999px;top:0;width:800px;";
//       while (doc.body.firstChild) container.appendChild(doc.body.firstChild);

//       const allEls = container.querySelectorAll("*");
//       await processNodesTimeBudgeted(
//         allEls,
//         styleMaps,
//         (done, total) =>
//           onProgress && onProgress({ phase: "cleaning", done, total }),
//       );

//       return container;
//     } catch (e) {
//       console.error("Error in cleanPastedHTML:", e);
//       return null;
//     }
//   };

//   const sanitizeOnly = (html, rtf) => {
//     let bodyHtml = html;
//     try {
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(html, "text/html");
//       if (doc && doc.body) {
//         // still try to recover images even on the pathological-size fallback
//         const rtfImages = extractImagesFromRtf(rtf);
//         if (rtfImages.length) fixWordImageSrcs(doc, rtfImages);
//         bodyHtml = doc.body.innerHTML;
//       }
//     } catch {
//       // fall back to the raw string
//     }
//     return bodyHtml
//       .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
//       .replace(/<o:p>\s*<\/o:p>/gi, "")
//       .replace(/<style[\s\S]*?<\/style>/gi, "")
//       .replace(/\sxmlns:[a-z]+="[^"]*"/gi, "")
//       .replace(/\sclass="[^"]*"/gi, "")
//       .replace(/\slang="[^"]*"/gi, "")
//       .replace(/mso-[^:;"]*:[^;"]*;?/gi, "");
//   };

//   const handlePaste = (e) => {
//     // Prevent multiple concurrent pastes
//     if (pasteInProgressRef.current) {
//       e.preventDefault();
//       flashToast("Paste already in progress — please wait");
//       return;
//     }

//     const html = e.clipboardData.getData("text/html");
//     const rtf = e.clipboardData.getData("text/rtf");

//     console.log(html);
//     // console.log(cleanedContainer.innerHTML);

//     console.log(
//       "[paste] html length:",
//       html.length,
//       "rtf length:",
//       rtf ? rtf.length : 0,
//     );
//     console.log(
//       "[paste] rtf present?",
//       !!rtf,
//       "rtf sample:",
//       rtf ? rtf.slice(0, 100) : "NONE",
//     );

//     if (html) {
//       e.preventDefault();

//       pasteInProgressRef.current = true;
//       setIsPasteLoading(true);
//       setPasteProgress({ phase: "preparing", done: 0, total: 100 });

//       saveSelection();

//       Promise.resolve().then(async () => {
//         try {
//           await new Promise((r) => setTimeout(r, 50));

//           setPasteProgress({ phase: "parsing", done: 0, total: 100 });
//           await new Promise((r) => setTimeout(r, 10));

//           const cleanedContainer = await cleanPastedHTML(html, rtf, (p) => {
//             setPasteProgress(p);
//           });

//           console.log("cleaned:", cleanedContainer?.innerHTML);

//           if (cleanedContainer === null) {
//             // pathological size - regex-only fallback (non-blocking)
//             setPasteProgress({ phase: "sanitizing", done: 50, total: 100 });
//             await new Promise((r) => setTimeout(r, 20));

//             const sanitized = sanitizeOnly(html, rtf);

//             setPasteProgress({ phase: "inserting", done: 75, total: 100 });
//             await new Promise((r) => setTimeout(r, 10));

//             restoreSelection();
//             editorRef.current.focus();
//             document.execCommand("insertHTML", false, sanitized);

//             notifyContentChanged();

//             setPasteProgress({ phase: "complete", done: 100, total: 100 });
//           } else {
//             setPasteProgress({ phase: "positioning", done: 50, total: 100 });
//             await new Promise((r) => setTimeout(r, 20));

//             const range = restoreSelectionRange();
//             let targetParent = editorRef.current;
//             let refNode = null;

//             if (range) {
//               range.deleteContents();
//               if (range.startContainer.nodeType === Node.TEXT_NODE) {
//                 const textNode = range.startContainer;
//                 const after = textNode.splitText(range.startOffset);
//                 targetParent = textNode.parentNode;
//                 refNode = after;
//               } else {
//                 targetParent = range.startContainer;
//                 refNode =
//                   range.startContainer.childNodes[range.startOffset] || null;
//               }
//             }

//             await moveNodesTimeBudgeted(
//               cleanedContainer,
//               targetParent,
//               refNode,
//               (done, total) => {
//                 const pct = Math.round(50 + (done / total) * 50);
//                 setPasteProgress({
//                   phase: "inserting",
//                   done: pct,
//                   total: 100,
//                 });
//               },
//             );

//             await new Promise((r) => setTimeout(r, 10));

//             notifyContentChanged();

//             setPasteProgress({ phase: "complete", done: 100, total: 100 });
//           }
//         } catch (err) {
//           console.error("Paste error:", err);
//           try {
//             setPasteProgress({ phase: "fallback", done: 0, total: 100 });
//             await new Promise((r) => setTimeout(r, 50));

//             restoreSelection();
//             editorRef.current.focus();
//             const sanitized = sanitizeOnly(html, rtf);
//             document.execCommand("insertHTML", false, sanitized);

//             notifyContentChanged();
//           } catch (e2) {
//             console.error("Fallback paste failed:", e2);
//             flashToast("Paste failed — try pasting as plain text");
//           }
//         } finally {
//           await new Promise((r) => setTimeout(r, 200));
//           setIsPasteLoading(false);
//           setPasteProgress(null);
//           pasteInProgressRef.current = false;
//         }
//       });

//       return;
//     }

//     // No HTML on clipboard — check for a directly-copied image (Files),
//     // e.g. right-click "Copy image" or copying a single image from an app.
//     const items = e.clipboardData.items
//       ? Array.from(e.clipboardData.items)
//       : [];
//     const imageItem = items.find(
//       (item) => item.type && item.type.startsWith("image/"),
//     );
//     if (imageItem) {
//       e.preventDefault();
//       const file = imageItem.getAsFile();
//       if (file) {
//         setIsImageLoading(true);
//         const reader = new FileReader();
//         reader.onload = (event) => {
//           insertHTMLAtCursor(
//             `<img src="${event.target.result}" alt="Pasted image" style="max-width:100%;border-radius:4px;" />`,
//           );
//           setIsImageLoading(false);
//         };
//         reader.onerror = () => {
//           setIsImageLoading(false);
//           flashToast("Couldn't load that image — try again");
//         };
//         reader.readAsDataURL(file);
//       }
//       return;
//     }

//     // fallback: plain text paste (no HTML/image available on clipboard)
//     const text = e.clipboardData.getData("text/plain");
//     if (text) {
//       e.preventDefault();
//       document.execCommand("insertText", false, text);
//       notifyContentChanged();
//     }
//   };

//   // ---- table creation ----
//   const createCustomTable = () => {
//     const rowsInput = prompt("Number of rows (including header):", "4");
//     if (rowsInput === null) return;
//     const colsInput = prompt("Number of columns:", "3");
//     if (colsInput === null) return;

//     const numRows = parseInt(rowsInput, 10);
//     const numCols = parseInt(colsInput, 10);

//     if (
//       !Number.isInteger(numRows) ||
//       !Number.isInteger(numCols) ||
//       numRows < 1 ||
//       numCols < 1
//     ) {
//       alert("Please enter valid whole numbers (1 or greater).");
//       return;
//     }
//     if (numRows > 50 || numCols > 20) {
//       alert("Please keep it under 50 rows and 20 columns.");
//       return;
//     }

//     const id = nextTableId();
//     insertHTMLAtCursor(buildTableHTML(numRows, numCols, id));
//   };

//   // ---- table mutation helpers ----
//   const withActiveTable = (fn) => {
//     if (!activeTableId || !editorRef.current) return;
//     const table = editorRef.current.querySelector(
//       `[${TABLE_ID_ATTR}="${activeTableId}"]`,
//     );
//     if (table) fn(table);
//     notifyContentChanged();
//   };

//   const getCurrentCell = () => {
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0) return null;
//     return findCell(sel.getRangeAt(0).startContainer);
//   };

//   const addRow = (position) => {
//     const cell = getCurrentCell();
//     const row = cell ? findRow(cell) : null;
//     if (!row) return;
//     const colCount = row.children.length;
//     const newRow = document.createElement("tr");
//     for (let i = 0; i < colCount; i++) {
//       const td = document.createElement("td");
//       td.setAttribute("style", cellStyle);
//       td.innerHTML = "&nbsp;";
//       newRow.appendChild(td);
//     }
//     if (position === "after") {
//       row.parentNode.insertBefore(newRow, row.nextSibling);
//     } else {
//       row.parentNode.insertBefore(newRow, row);
//     }
//     notifyContentChanged();
//   };

//   const deleteRow = () => {
//     const cell = getCurrentCell();
//     const row = cell ? findRow(cell) : null;
//     if (!row) return;
//     const table = row.closest("table");
//     const rowCount = table.querySelectorAll("tr").length;
//     if (rowCount <= 1) {
//       flashToast("Can't delete the last row — delete the table instead");
//       return;
//     }
//     if (!confirm("Delete this row?")) return;
//     row.remove();
//     notifyContentChanged();
//   };

//   const addColumn = (position) => {
//     const cell = getCurrentCell();
//     if (!cell) return;
//     const table = cell.closest("table");
//     const colIndex = cell.cellIndex;
//     const rows = table.querySelectorAll("tr");
//     rows.forEach((row, ri) => {
//       const tag = ri === 0 && row.children[0]?.tagName === "TH" ? "th" : "td";
//       const newCell = document.createElement(tag);
//       newCell.setAttribute("style", tag === "th" ? headStyle : cellStyle);
//       newCell.innerHTML = tag === "th" ? `Header` : "&nbsp;";
//       const ref =
//         position === "after"
//           ? row.children[colIndex + 1]
//           : row.children[colIndex];
//       row.insertBefore(newCell, ref || null);
//     });
//     notifyContentChanged();
//   };

//   const deleteColumn = () => {
//     const cell = getCurrentCell();
//     if (!cell) return;
//     const table = cell.closest("table");
//     const colIndex = cell.cellIndex;
//     const rows = table.querySelectorAll("tr");
//     if (rows[0].children.length <= 1) {
//       flashToast("Can't delete the last column — delete the table instead");
//       return;
//     }
//     if (!confirm("Delete this column?")) return;
//     rows.forEach((row) => {
//       if (row.children[colIndex]) row.children[colIndex].remove();
//     });
//     notifyContentChanged();
//   };

//   const deleteTable = () => {
//     withActiveTable((table) => {
//       if (
//         confirm(
//           "Delete this entire table? This can't be undone with undo... actually it can — Ctrl/Cmd+Z works.",
//         )
//       ) {
//         table.remove();
//         setActiveTableId(null);
//       }
//     });
//   };

//   // ---- detect when caret/click is inside a table ----
//   const updateTableContext = () => {
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0) {
//       setActiveTableId(null);
//       return;
//     }
//     const node = sel.getRangeAt(0).startContainer;
//     if (!editorRef.current || !editorRef.current.contains(node)) {
//       setActiveTableId(null);
//       return;
//     }
//     const table = findTable(node);
//     if (table) {
//       let id = table.getAttribute(TABLE_ID_ATTR);
//       if (!id) {
//         id = nextTableId();
//         table.setAttribute(TABLE_ID_ATTR, id);
//       }
//       setActiveTableId(id);
//     } else {
//       setActiveTableId(null);
//     }
//   };

//   const handleEditorClick = () => {
//     saveSelection();
//     updateTableContext();
//     updateActiveFormats();
//   };

//   const handleEditorKeyUp = () => {
//     saveSelection();
//     updateTableContext();
//     updateActiveFormats();
//   };

//   const handleInput = () => {
//     saveSelection();
//     scheduleHistory();
//     updateActiveFormats();

//     onChange(editorRef.current.innerHTML);
//   };

//   useEffect(() => {
//     const onKeyDown = (e) => {
//       const meta = e.ctrlKey || e.metaKey;
//       if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
//         e.preventDefault();
//         undo();
//       } else if (
//         meta &&
//         (e.key.toLowerCase() === "y" ||
//           (e.shiftKey && e.key.toLowerCase() === "z"))
//       ) {
//         e.preventDefault();
//         redo();
//       }
//     };
//     const node = editorRef.current;
//     node?.addEventListener("keydown", onKeyDown);
//     return () => node?.removeEventListener("keydown", onKeyDown);
//   }, []);

//   const insideTable = !!activeTableId;
//   const anyFormatActive = Object.values(activeFormats).some(Boolean);
//   const isLoading = isImageLoading || isPasteLoading;

//   const pasteStatusLabel = (() => {
//     if (!pasteProgress) return "Pasting content…";
//     const pct = pasteProgress.total
//       ? Math.round((pasteProgress.done / pasteProgress.total) * 100)
//       : 0;
//     const phaseLabel = (() => {
//       switch (pasteProgress.phase) {
//         case "preparing":
//           return "Preparing";
//         case "parsing":
//           return "Parsing";
//         case "cleaning":
//           return "Cleaning";
//         case "sanitizing":
//           return "Sanitizing";
//         case "positioning":
//           return "Positioning";
//         case "inserting":
//           return "Inserting";
//         case "fallback":
//           return "Using fallback";
//         case "complete":
//           return "Complete";
//         default:
//           return "Processing";
//       }
//     })();
//     return `${phaseLabel} content… ${pct}%`;
//   })();

//   return (
//     <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
//       <style>{`
//         .editor-content table.custom-table td:focus-within,
//         .editor-content table.custom-table th:focus-within { outline: 2px solid #6366f1; outline-offset: -2px; }
//         .editor-content table.custom-table { border-color: #e2e2e7; }
//         .editor-content img { border-radius: 4px; }
//         .editor-content:empty:before { content: attr(data-placeholder); color: #9ca3af; }
//          .editor-content hr {
//           border: none;
//           border-top: 2px solid #d5dae1;
//           margin: 16px 0;
//           }
//         .editor-content h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; line-height: 1.3; }
//         .editor-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.75em 0; line-height: 1.3; }
//         .editor-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.83em 0; line-height: 1.3; }
//         .editor-content h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0; line-height: 1.3; }
//         .editor-content p { margin: 0.5em 0; }

//         .editor-content ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
//         .editor-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
//         .editor-content ul ul { list-style: circle; }
//         .editor-content ul ul ul { list-style: square; }
//         .editor-content li { display: list-item; margin: 0.25em 0; }

//         .editor-content a { color: #2563eb; text-decoration: underline; cursor: pointer; }
//       `}</style>

//       {/* Toolbar */}
//       <div className="border-b border-gray-200 p-2 bg-gray-50/80 sticky top-0 z-20">
//         <div className="flex flex-wrap items-center gap-1">
//           <select
//             onMouseDown={saveSelection}
//             onChange={(e) => applyFormat("fontName", e.target.value)}
//             disabled={isPasteLoading}
//             className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
//             defaultValue=""
//           >
//             <option value="" disabled>
//               Font
//             </option>
//             <option value="Arial">Arial</option>
//             <option value="Times New Roman">Times New Roman</option>
//             <option value="Georgia">Georgia</option>
//             <option value="Verdana">Verdana</option>
//             <option value="Courier New">Courier New</option>
//             <option value="Tahoma">Tahoma</option>
//           </select>

//           <select
//             onMouseDown={saveSelection}
//             onChange={(e) => applyFormat("fontSize", e.target.value)}
//             disabled={isPasteLoading}
//             className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
//             defaultValue=""
//           >
//             <option value="" disabled>
//               Size
//             </option>
//             <option value="1">8</option>
//             <option value="2">10</option>
//             <option value="3">12</option>
//             <option value="4">14</option>
//             <option value="5">16</option>
//             <option value="6">18</option>
//             <option value="7">24</option>
//           </select>

//           <select
//             onMouseDown={saveSelection}
//             onChange={(e) => applyFormat("formatBlock", e.target.value)}
//             disabled={isPasteLoading}
//             className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
//             defaultValue="p"
//           >
//             <option value="p">Normal</option>
//             <option value="h1">Heading 1</option>
//             <option value="h2">Heading 2</option>
//             <option value="h3">Heading 3</option>
//             <option value="h4">Heading 4</option>
//           </select>

//           <Divider />

//           <ToolBtn
//             title="Bold"
//             active={activeFormats.bold}
//             onMouseDown={() => applyFormat("bold")}
//           >
//             <FiBold size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Italic"
//             active={activeFormats.italic}
//             onMouseDown={() => applyFormat("italic")}
//           >
//             <FiItalic size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Underline"
//             active={activeFormats.underline}
//             onMouseDown={() => applyFormat("underline")}
//           >
//             <FiUnderline size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Strikethrough"
//             active={activeFormats.strikeThrough}
//             onMouseDown={() => applyFormat("strikeThrough")}
//           >
//             <span className="text-sm font-bold line-through">S</span>
//           </ToolBtn>
//           <ToolBtn
//             title="Superscript"
//             active={activeFormats.superscript}
//             onMouseDown={() => applyFormat("superscript")}
//           >
//             <span className="text-xs font-semibold">X²</span>
//           </ToolBtn>
//           <ToolBtn
//             title="Subscript"
//             active={activeFormats.subscript}
//             onMouseDown={() => applyFormat("subscript")}
//           >
//             <span className="text-xs font-semibold">X₂</span>
//           </ToolBtn>

//           <Divider />

//           <ToolBtn
//             title="Align left"
//             active={activeFormats.justifyLeft}
//             onMouseDown={() => applyFormat("justifyLeft")}
//           >
//             <FiAlignLeft size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Align center"
//             active={activeFormats.justifyCenter}
//             onMouseDown={() => applyFormat("justifyCenter")}
//           >
//             <FiAlignCenter size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Align right"
//             active={activeFormats.justifyRight}
//             onMouseDown={() => applyFormat("justifyRight")}
//           >
//             <FiAlignRight size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Justify"
//             active={activeFormats.justifyFull}
//             onMouseDown={() => applyFormat("justifyFull")}
//           >
//             <FiAlignJustify size={15} />
//           </ToolBtn>

//           <Divider />

//           <ToolBtn
//             title="Bulleted list"
//             active={activeFormats.insertUnorderedList}
//             onMouseDown={() => applyFormat("insertUnorderedList")}
//           >
//             <FiList size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Numbered list"
//             active={activeFormats.insertOrderedList}
//             onMouseDown={() => applyFormat("insertOrderedList")}
//           >
//             <span className="text-xs font-semibold">1.</span>
//           </ToolBtn>
//           <ToolBtn title="Indent" onMouseDown={() => applyFormat("indent")}>
//             <FiChevronsRight size={15} />
//           </ToolBtn>
//           <ToolBtn title="Outdent" onMouseDown={() => applyFormat("outdent")}>
//             <FiChevronsLeft size={15} />
//           </ToolBtn>

//           <Divider />

//           <ColorPickerBtn
//             title="Text color"
//             color={textColor}
//             inputRef={textColorInputRef}
//             onMouseDown={saveSelection}
//             onPick={(val) => {
//               setTextColor(val);
//               applyFormat("foreColor", val);
//             }}
//           >
//             <span className="font-bold text-[15px] leading-none">A</span>
//           </ColorPickerBtn>

//           <ColorPickerBtn
//             title="Highlight color"
//             color={highlightColor}
//             inputRef={highlightColorInputRef}
//             onMouseDown={saveSelection}
//             onPick={(val) => {
//               setHighlightColor(val);
//               applyFormat("hiliteColor", val);
//             }}
//           >
//             <span className="font-bold text-[15px] leading-none">H</span>
//           </ColorPickerBtn>

//           <Divider />

//           <ToolBtn
//             title="Insert image"
//             onMouseDown={() => {
//               saveSelection();
//               fileInputRef.current.click();
//             }}
//             disabled={isPasteLoading}
//           >
//             <FiImage size={15} />
//           </ToolBtn>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             accept="image/*"
//             className="hidden"
//           />
//           <ToolBtn
//             title="Insert link"
//             onMouseDown={() => {
//               const url = prompt("Enter URL:");
//               if (url) applyFormat("createLink", url);
//             }}
//           >
//             <FiLink size={15} />
//           </ToolBtn>
//           <ToolBtn
//             title="Remove link"
//             onMouseDown={() => applyFormat("unlink")}
//           >
//             <FiLink2 size={15} />
//           </ToolBtn>

//           <Divider />

//           <ToolBtn
//             title="Clear formatting"
//             onMouseDown={() => applyFormat("removeFormat")}
//           >
//             <FiSlash size={15} />
//           </ToolBtn>

//           <ToolBtn
//             title="Clear / Deselect all active formats"
//             active={anyFormatActive}
//             onMouseDown={clearSelectionAndFormatting}
//           >
//             <FiX size={15} />
//             <span className="text-xs ml-1">Clear</span>
//           </ToolBtn>

//           <Divider />

//           <ToolBtn title="Undo" onMouseDown={undo} disabled={isPasteLoading}>
//             <FiCornerUpLeft size={15} />
//           </ToolBtn>
//           <ToolBtn title="Redo" onMouseDown={redo} disabled={isPasteLoading}>
//             <FiCornerUpRight size={15} />
//           </ToolBtn>

//           <Divider />

//           <button
//             type="button"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               saveSelection();
//               createCustomTable();
//             }}
//             disabled={isPasteLoading}
//             className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
//           >
//             <FiGrid size={15} />
//             Insert table
//           </button>
//         </div>

//         {/* Contextual table toolbar */}
//         <div
//           className={`grid transition-all duration-200 ease-out ${
//             insideTable
//               ? "grid-rows-[1fr] opacity-100 mt-2"
//               : "grid-rows-[0fr] opacity-0"
//           }`}
//         >
//           <div className="overflow-hidden">
//             <div className="flex flex-wrap items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-1.5">
//               <span className="text-xs font-medium text-indigo-700 pr-1 whitespace-nowrap">
//                 Table tools
//               </span>
//               <Divider />
//               <ToolBtn
//                 title="Add row above"
//                 onMouseDown={() => addRow("before")}
//               >
//                 <FiArrowUp size={14} />
//                 <FiPlus size={10} className="-ml-1" />
//               </ToolBtn>
//               <ToolBtn
//                 title="Add row below"
//                 onMouseDown={() => addRow("after")}
//               >
//                 <FiArrowDown size={14} />
//                 <FiPlus size={10} className="-ml-1" />
//               </ToolBtn>
//               <ToolBtn title="Delete row" danger onMouseDown={deleteRow}>
//                 <FiX size={14} />
//                 <span className="text-xs ml-0.5">Row</span>
//               </ToolBtn>
//               <Divider />
//               <ToolBtn
//                 title="Add column left"
//                 onMouseDown={() => addColumn("before")}
//               >
//                 <FiArrowLeft size={14} />
//                 <FiPlus size={10} className="-ml-1" />
//               </ToolBtn>
//               <ToolBtn
//                 title="Add column right"
//                 onMouseDown={() => addColumn("after")}
//               >
//                 <FiArrowRight size={14} />
//                 <FiPlus size={10} className="-ml-1" />
//               </ToolBtn>
//               <ToolBtn title="Delete column" danger onMouseDown={deleteColumn}>
//                 <FiX size={14} />
//                 <span className="text-xs ml-0.5">Col</span>
//               </ToolBtn>
//               <Divider />
//               <ToolBtn title="Delete table" danger onMouseDown={deleteTable}>
//                 <FiTrash2 size={14} />
//                 <span className="text-xs ml-0.5">Table</span>
//               </ToolBtn>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Editor */}
//       <div className="relative">
//         {isLoading && (
//           <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
//             <div className="bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
//               <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
//               {isPasteLoading ? pasteStatusLabel : "Uploading image…"}
//             </div>
//           </div>
//         )}

//         <div
//           ref={editorRef}
//           contentEditable
//           suppressContentEditableWarning
//           className={`editor-content min-h-[480px] max-h-[70vh] overflow-y-auto p-5 focus:outline-none ${
//             isPasteLoading ? "opacity-70 pointer-events-none" : ""
//           }`}
//           onPaste={handlePaste}
//           onInput={handleInput}
//           onClick={handleEditorClick}
//           onKeyUp={handleEditorKeyUp}
//           onMouseUp={handleEditorClick}
//           data-placeholder={placeholder}
//           style={{
//             fontFamily: "Arial, sans-serif",
//             lineHeight: 1.6,
//             fontSize: "14px",
//           }}
//         />
//       </div>

//       {/* Status bar */}
//       <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between items-center min-h-[34px]">
//         <span className={insideTable ? "text-indigo-700 font-medium" : ""}>
//           {insideTable
//             ? "● Editing inside a table — use Table tools above to add or remove rows/columns"
//             : "Click 'Insert table' to add a table, or click into any cell to edit it"}
//         </span>
//         {toast && (
//           <span className="text-red-600 font-medium animate-pulse">
//             {toast}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomEditor;

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiList,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiImage,
  FiLink,
  FiLink2,
  FiTrash2,
  FiX,
  FiPlus,
  FiGrid,
  FiChevronsLeft,
  FiChevronsRight,
  FiSlash,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

// ---------- helpers ----------

const TABLE_ID_ATTR = "data-tbl-id";

let tblCounter = 0;
const nextTableId = () => `tbl-${++tblCounter}-${Date.now()}`;

const cellStyleEven =
  "border:1px solid #9aa5b1;padding:10px 14px;min-width:80px;background:#ffffff;";
const cellStyleOdd =
  "border:1px solid #9aa5b1;padding:10px 14px;min-width:80px;background:#f4f6f9;";
const headStyle =
  "border:1px solid #1d4e6f;border-bottom:2px solid #9aa5b1;padding:12px 14px;text-align:left;font-weight:700;background:#1d4e6f;color:#ffffff;min-width:80px;";
const cellStyle = cellStyleEven;

function buildTableHTML(rows, cols, id) {
  let html = `<table ${TABLE_ID_ATTR}="${id}" class="custom-table" style="border-collapse:collapse;border:1px solid #9aa5b1;width:100%;margin:14px 0;font-family:Arial, sans-serif;font-size:14px;"><tbody>`;
  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    for (let c = 0; c < cols; c++) {
      if (r === 0) {
        html += `<th style="${headStyle}">Header ${c + 1}</th>`;
      } else {
        const style = r % 2 === 0 ? cellStyleEven : cellStyleOdd;
        html += `<td style="${style}">&nbsp;</td>`;
      }
    }
    html += "</tr>";
  }
  html += "</tbody></table><p><br></p>";
  return html;
}

function closest(node, selector) {
  while (node && node.nodeType !== 1) node = node.parentNode;
  return node ? node.closest(selector) : null;
}

function findCell(node) {
  return closest(node, "td,th");
}
function findRow(node) {
  return closest(node, "tr");
}
function findTable(node) {
  return closest(node, "table");
}

// rAF-based yield: gives the browser a real paint/input opportunity every
// time we call this, unlike requestIdleCallback which can be deprioritized
// and make the tab look "stuck" under heavy load.
const yieldToBrowser = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

// Safety cap: beyond this raw HTML length we skip all DOM-walking work
// entirely and fall back to a regex-only sanitize (near-instant, no
// per-element work at all). This only kicks in for truly pathological
// pastes (tens of MB) — normal 250-page Word docs stay on the fast path.
const MAX_PASTE_HTML_LENGTH = 50_000_000; // ~50MB of raw HTML

// Structural/layout tags that never carry meaningful text styling.
const SKIP_STYLE_TAGS = new Set([
  "TABLE",
  "TBODY",
  "THEAD",
  "TR",
  "COL",
  "COLGROUP",
  "BR",
]);

// Time budget per chunk of work, in ms. Frames are ~16ms; leaving this much
// headroom keeps scrolling/typing/paint responsive even while we're mid-paste,
// regardless of how many total elements there are (time-budgeted, not
// count-budgeted, so it scales correctly from 1k to 1M+ elements).
const FRAME_BUDGET_MS = 8;

// ---------- toolbar pieces ----------

const ToolBtn = ({
  onMouseDown,
  title,
  active,
  children,
  danger,
  disabled,
}) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => {
      e.preventDefault(); // keep selection alive
      onMouseDown(e);
    }}
    className={`inline-flex items-center justify-center h-8 min-w-8 px-1.5 rounded-md text-sm transition-colors border
      ${danger ? "text-red-600 hover:bg-red-50 border-transparent" : "text-gray-700 hover:bg-gray-200 border-transparent"}
      ${active ? "bg-indigo-100 text-indigo-700 border-indigo-300" : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1.5 shrink-0" />;

const ColorPickerBtn = ({
  title,
  color,
  onPick,
  onMouseDown,
  children,
  inputRef,
}) => (
  <div className="relative">
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
        inputRef.current.click();
      }}
      className="inline-flex flex-col items-center justify-center h-8 w-9 rounded-md text-sm text-gray-700 hover:bg-gray-200 border border-transparent"
    >
      <span className="leading-none mb-1">{children}</span>
      <span
        className="block w-5 h-[3px] rounded-sm"
        style={{ backgroundColor: color }}
      />
    </button>
    <input
      ref={inputRef}
      type="color"
      value={color}
      onChange={(e) => onPick(e.target.value)}
      className="absolute inset-0 w-0 h-0 opacity-0 pointer-events-none"
      tabIndex={-1}
    />
  </div>
);

// ---------- main component ----------

const CustomEditor = ({
  value = "",
  onChange = () => {},
  placeholder = "Start typing here...",
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const pasteInProgressRef = useRef(false);

  const historyRef = useRef([value || ""]);
  const historyIndexRef = useRef(0);
  const skipNextHistoryRef = useRef(false);
  const debounceRef = useRef(null);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isPasteLoading, setIsPasteLoading] = useState(false);
  const [pasteProgress, setPasteProgress] = useState(null); // { phase, done, total } | null

  const [activeTableId, setActiveTableId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeFormats, setActiveFormats] = useState({});

  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");

  const textColorInputRef = useRef(null);
  const highlightColorInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const flashToast = (msg) => {
    setToast(msg);
    window.clearTimeout(flashToast._t);
    flashToast._t = window.setTimeout(() => setToast(null), 1600);
  };

  // ---- selection save/restore (so toolbar clicks / async paste don't lose cursor) ----
  const saveSelection = () => {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      editorRef.current.contains(sel.anchorNode)
    ) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    sel.removeAllRanges();
    if (savedSelectionRef.current) {
      sel.addRange(savedSelectionRef.current);
    } else {
      editorRef.current.focus();
    }
  };

  // returns the live Range object after restoring, so callers can insert
  // directly via DOM ops instead of execCommand
  const restoreSelectionRange = () => {
    const sel = window.getSelection();
    sel.removeAllRanges();
    if (savedSelectionRef.current) {
      sel.addRange(savedSelectionRef.current);
      return savedSelectionRef.current;
    }
    editorRef.current.focus();
    return null;
  };

  // ---- active format detection (for toolbar highlighting) ----
  const updateActiveFormats = () => {
    if (!editorRef.current) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        superscript: document.queryCommandState("superscript"),
        subscript: document.queryCommandState("subscript"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
        justifyRight: document.queryCommandState("justifyRight"),
        justifyFull: document.queryCommandState("justifyFull"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
      });
    } catch {
      // some commands can throw if editor isn't focused yet - ignore
    }
  };

  // ---- history ----
  const pushHistory = useCallback(() => {
    if (skipNextHistoryRef.current) {
      skipNextHistoryRef.current = false;
      return;
    }
    const html = editorRef.current.innerHTML;
    const hist = historyRef.current;
    const idx = historyIndexRef.current;
    if (hist[idx] === html) return;
    const trimmed = hist.slice(0, idx + 1);
    trimmed.push(html);
    historyRef.current = trimmed.slice(-100);
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const scheduleHistory = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(pushHistory, 400);
  }, [pushHistory]);

  // Single place that both schedules history AND notifies the parent
  // (Formik) of the new content. Any code path that mutates
  // editorRef.current's DOM *without* going through a native "input" event
  // (e.g. direct appendChild/insertBefore during paste) MUST call this,
  // otherwise React/Formik never learns the value changed.
  const notifyContentChanged = useCallback(() => {
    scheduleHistory();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [scheduleHistory, onChange]);

  const applyHTMLSnapshot = (html) => {
    skipNextHistoryRef.current = true;
    editorRef.current.innerHTML = html;
    onChange(editorRef.current.innerHTML);
  };

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      applyHTMLSnapshot(historyRef.current[historyIndexRef.current]);
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      applyHTMLSnapshot(historyRef.current[historyIndexRef.current]);
    }
  };

  // ---- formatting ----
  const applyFormat = (command, value = null) => {
    editorRef.current.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    notifyContentChanged();
    updateActiveFormats();
  };

  const insertHTMLAtCursor = (html) => {
    restoreSelection();
    editorRef.current.focus();
    document.execCommand("insertHTML", false, html);
    notifyContentChanged();
  };

  // ---- clear / deselect everything ----
  const clearSelectionAndFormatting = () => {
    restoreSelection();
    try {
      document.execCommand("removeFormat", false, null);
    } catch {
      // ignore
    }
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    savedSelectionRef.current = null;
    setActiveFormats({});
    editorRef.current.focus();
    notifyContentChanged();
  };

  // ---- image (toolbar upload) ----
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      insertHTMLAtCursor(
        `<img src="${event.target.result}" alt="Uploaded image" style="max-width:100%;border-radius:4px;" />`,
      );
      setIsImageLoading(false);
    };
    reader.onerror = () => {
      setIsImageLoading(false);
      flashToast("Couldn't load that image — try a different file");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ---------- high-performance Word-paste pipeline ----------

  const buildStyleMaps = (doc) => {
    const classMap = new Map();
    const tagMap = new Map();

    const addTo = (map, key, cssText) => {
      const existing = map.get(key);
      map.set(key, existing ? `${existing};${cssText}` : cssText);
    };

    doc.querySelectorAll("style").forEach((styleEl) => {
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(styleEl.textContent || "");
        for (const rule of sheet.cssRules) {
          if (!rule.selectorText || !rule.style || !rule.style.cssText)
            continue;
          rule.selectorText.split(",").forEach((rawSel) => {
            const sel = rawSel.trim();
            const classMatch = sel.match(/^\.([\w-]+)$/);
            if (classMatch) {
              addTo(classMap, classMatch[1], rule.style.cssText);
              return;
            }
            const tagMatch = sel.match(/^([a-zA-Z][\w-]*)$/);
            if (tagMatch) {
              addTo(tagMap, tagMatch[1].toUpperCase(), rule.style.cssText);
              return;
            }
            const compoundMatch = sel.match(/^([a-zA-Z][\w-]*)\.([\w-]+)$/);
            if (compoundMatch) {
              addTo(classMap, compoundMatch[2], rule.style.cssText);
            }
            const multiClassMatch = sel.match(/\.([\w-]+)/g);

            if (multiClassMatch) {
              multiClassMatch.forEach((m) => {
                addTo(classMap, m.substring(1), rule.style.cssText);
              });
            }
          });
        }
      } catch {
        // malformed/unsupported Word CSS - skip, inline attrs still apply
      }
    });

    return { classMap, tagMap };
  };

  // ---- Word image recovery ----
  //
  // Word's HTML clipboard points images at a local temp file
  // (file:///C:/Users/.../clip_image001.png) that the browser can never
  // load — and that file gets overwritten every time Word copies something
  // new, so pasting a 2nd/3rd image in the same session silently breaks.
  //
  // The actual image bytes ARE present in the RTF clipboard flavor, as
  // hex-encoded \pict blocks. We pull them out here and use them to patch
  // the broken file:// references before the HTML ever touches the editor.

  // Converts a Uint8Array to a binary string in chunks instead of one
  // byte-at-a-time `+=` loop. Byte-by-byte string concatenation is O(n^2)-ish
  // in practice for large strings and becomes very slow for multi-MB images
  // embedded in the doc — chunking via String.fromCharCode.apply keeps it fast.
  function bytesToBinaryString(bytes) {
    const CHUNK = 8192;
    let result = "";
    for (let i = 0; i < bytes.length; i += CHUNK) {
      const chunk = bytes.subarray(i, i + CHUNK);
      result += String.fromCharCode.apply(null, chunk);
    }
    return result;
  }

  const extractImagesFromRtf = (rtf) => {
    if (!rtf) return [];
    const images = [];
    let searchFrom = 0;

    while (true) {
      const start = rtf.indexOf("{\\pict", searchFrom);
      if (start === -1) break;

      // brace-matching to find the true end of this \pict group. A naive
      // non-greedy regex would stop at the first "}", which is usually the
      // closing brace of a nested \picprop group, not the real end.
      let depth = 0;
      let end = -1;
      for (let i = start; i < rtf.length; i++) {
        if (rtf[i] === "{") depth++;
        else if (rtf[i] === "}") {
          depth--;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }
      if (end === -1) break;

      const block = rtf.slice(start, end + 1);
      searchFrom = end + 1;

      const kwMatch = block.match(/\\(pngblip|jpegblip)\b/);
      if (!kwMatch) {
        // \wmetafile8 / \emfblip are vector formats browsers can't render
        // directly. Record a placeholder so index alignment with the
        // matching <img>/<v:imagedata> tags in the HTML is preserved.
        images.push(null);
        continue;
      }
      const mime = kwMatch[1] === "pngblip" ? "image/png" : "image/jpeg";

      // Walk forward past the keyword, consuming ONLY genuine
      // backslash-prefixed control-word tokens (e.g. \picw26565, \bin1234),
      // stopping the instant we hit something that isn't a control word.
      // This is deliberately more careful than a blind "strip every
      // \word+digits pattern" regex: if a control word is directly
      // followed by hex data with NO delimiting space (which Word does
      // sometimes), a blind regex would misread the leading hex digits as
      // the control word's numeric parameter and delete them - shifting
      // every subsequent byte by a nibble and corrupting the whole image.
      // Walking explicitly from "\" to "\" avoids that ambiguity entirely.
      let pos = kwMatch.index + kwMatch[0].length;
      while (pos < block.length) {
        while (pos < block.length && /\s/.test(block[pos])) pos++;
        if (block[pos] === "\\") {
          const m = /^\\[a-zA-Z]+-?\d*/.exec(block.slice(pos));
          if (m && m[0].length > 1) {
            pos += m[0].length;
            continue;
          }
          pos++; // unrecognized escape - skip just the backslash
          continue;
        }
        break; // reached the real start of the hex data
      }

      const hex = block
        .slice(pos)
        .replace(/\{[^{}]*\}/g, "") // strip any trailing nested groups
        .replace(/[^0-9a-fA-F]/g, ""); // keep hex digits only

      if (hex.length < 40) {
        images.push(null);
        continue;
      }

      try {
        const byteLen = hex.length >> 1;
        const bytes = new Uint8Array(byteLen);
        for (let i = 0; i < byteLen; i++) {
          bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        const binary = bytesToBinaryString(bytes);
        images.push(`data:${mime};base64,${btoa(binary)}`);
      } catch {
        images.push(null);
      }
    }

    return images;
  };

  // Replaces broken file:// image srcs (both plain <img> and Word's VML
  // <v:imagedata> wrapper) with real image data pulled from RTF, matched
  // in document order. Any <img> that already has a usable src (http(s)://
  // or data:) is left untouched.
  const fixWordImageSrcs = (doc, rtfImages) => {
    let rtfIdx = 0;
    const nextRtfImage = () => {
      while (rtfIdx < rtfImages.length) {
        const img = rtfImages[rtfIdx];
        rtfIdx++;
        if (img) return img;
        // null = this slot was a vector image we couldn't decode; skip it
        // but don't stop looking for the next usable one
      }
      return null;
    };

    // plain <img> tags with a local file:// src
    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (/^file:\/\//i.test(src)) {
        const dataUrl = nextRtfImage();
        if (dataUrl) {
          img.setAttribute("src", dataUrl);
        } else {
          img.remove(); // no usable data (e.g. WMF) - drop the broken img
        }
      }
    });

    // Word's VML wrapper: <v:shape><v:imagedata src="file://..."/></v:shape>
    // HTML parsing keeps the colon as a literal part of the tag name.
    doc.querySelectorAll("imagedata, v\\:imagedata").forEach((vImg) => {
      const src = vImg.getAttribute("src") || vImg.getAttribute("o:href") || "";
      if (!/^file:\/\//i.test(src)) return;

      const dataUrl = nextRtfImage();
      const shape = vImg.closest("shape, v\\:shape");
      const target = shape || vImg;

      if (!dataUrl) {
        target.remove();
        return;
      }

      const newImg = doc.createElement("img");
      newImg.setAttribute("src", dataUrl);
      newImg.setAttribute("style", "max-width:100%;");

      if (shape) {
        const styleAttr = shape.getAttribute("style") || "";
        const w = styleAttr.match(/width:\s*([\d.]+[a-z%]*)/i);
        const h = styleAttr.match(/height:\s*([\d.]+[a-z%]*)/i);
        if (w) newImg.style.width = w[1];
        if (h) newImg.style.height = h[1];
      }

      target.parentNode.replaceChild(newImg, target);
    });
  };

  const propagateCellBackgrounds = (doc) => {
    doc.querySelectorAll("td, th").forEach((cell) => {
      const cellStyle = cell.getAttribute("style") || "";
      const bgMatch = cellStyle.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      // Word often uses the legacy bgcolor="#rrggbb" attribute for cell
      // shading INSTEAD of a CSS style — check both.
      const bgColor = bgMatch
        ? bgMatch[1].trim()
        : cell.getAttribute("bgcolor")
          ? cell.getAttribute("bgcolor").trim()
          : null;
      if (!bgColor) return;

      if (!bgMatch) {
        const sep = cellStyle && !cellStyle.trim().endsWith(";") ? "; " : "";
        cell.setAttribute(
          "style",
          `${cellStyle}${sep}background-color:${bgColor};`,
        );
      }

      Array.from(cell.children).forEach((child) => {
        const existing = child.getAttribute("style") || "";
        if (/background(?:-color)?\s*:/i.test(existing)) return;
        const sep = existing && !existing.trim().endsWith(";") ? "; " : "";
        child.setAttribute(
          "style",
          `${existing}${sep}background-color:${bgColor};`,
        );
      });
    });
  };

  // ---- Safety net: if a recovered heading/divider ends up nested inside a
  // table (this should never legitimately happen — floating headings never
  // belong inside a real data table's rows), pull it back out and place it
  // as a sibling immediately before that table instead. This protects the
  // table's structure even if the paragraph-index heuristic above drifts on
  // very large documents with many headings/tables.
  const rescueHeadingsFromTables = (doc) => {
    const markers = doc.body.querySelectorAll(
      "[data-recovered-heading], [data-recovered-divider]",
    );
    markers.forEach((el) => {
      const tbl = el.closest("table");
      if (!tbl || !tbl.parentNode) return;
      tbl.parentNode.insertBefore(el, tbl);
    });
  };

  // ---- Diagnostic: tells us definitively whether the clipboard HTML even
  // contains a colored table/heading BEFORE any processing happens. If this
  // logs "white-text=true" but everything else is "false", the colored
  // heading banner was simply never included in what got copied — no
  // client-side code can recover data that was never part of the copy.
  const diagnoseClipboard = (rawHtml) => {
    const hasTable = /<table/i.test(rawHtml);
    const hasBgStyle = /background(?:-color)?\s*:/i.test(rawHtml);
    const hasBgColorAttr = /bgcolor\s*=/i.test(rawHtml);
    const hasWhiteColor = /color:\s*(white|#fff\b|#ffffff)/i.test(rawHtml);
    console.log(
      `%c[CLIPBOARD DIAGNOSTIC] table=${hasTable} bg-style=${hasBgStyle} bgcolor-attr=${hasBgColorAttr} white-text=${hasWhiteColor}`,
      "color:#d97706;font-weight:bold;",
    );
    if (hasWhiteColor && !hasTable && !hasBgStyle && !hasBgColorAttr) {
      console.warn(
        "[CLIPBOARD DIAGNOSTIC] White text found but NO table/background anywhere in copied HTML. " +
          "The colored heading banner was NOT included in what got copied from Word — " +
          "re-select from the very left edge of the heading bar and copy again.",
      );
    }
  };

  const moveNodesTimeBudgeted = async (
    sourceContainer,
    targetParent,
    refNode,
    onProgress,
  ) => {
    const total = sourceContainer.childNodes.length;
    let done = 0;

    // Build everything off-DOM first (documentFragment is not attached to the
    // live page, so appending into it does NOT trigger layout/reflow at all).
    // This is what makes the chunking actually cheap.
    const bigFrag = document.createDocumentFragment();
    while (sourceContainer.firstChild) {
      const start = performance.now();
      while (
        sourceContainer.firstChild &&
        performance.now() - start < FRAME_BUDGET_MS
      ) {
        bigFrag.appendChild(sourceContainer.firstChild);
        done++;
      }
      onProgress && onProgress(done, total);
      await yieldToBrowser(); // let the browser paint/respond to input
    }

    // Single write into the live, visible editor — only ONE reflow happens
    // here instead of one per chunk.
    targetParent.insertBefore(bigFrag, refNode);
  };

  // ---- (dependency #1) strip Word's junk markup, including invisible
  // vglayout tab-stop tables that otherwise create phantom extra spacing ----
  const stripWordCruft = (html) =>
    html
      .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
      .replace(/<xml>[\s\S]*?<\/xml>/gi, "")
      .replace(/<o:p>\s*<\/o:p>/gi, "")
      .replace(/<o:p>/gi, "")
      .replace(/<\/o:p>/gi, "")
      // Word's hidden vglayout spans (empty tables used only for internal
      // tab-stop positioning) - these render as real empty tables/width in
      // the browser and cause the extra blank spacing you're seeing
      .replace(/<span[^>]*mso-ignore:vglayout[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<br[^>]*mso-ignore:vglayout[^>]*>/gi, "");

  // Word exports two visually-similar-but-semantically-different patterns using
  // the same margin-left + negative text-indent combo:
  //  a) real bulleted/numbered list items (has "mso-list:" in style, or a
  //     child span with mso-list:Ignore holding the literal bullet char)
  //  b) a "fake center" hack for shape/textbox headings (big margin-left +
  //     equally big negative text-indent, no bullet involved) — only works
  //     inside the original fixed-width textbox, breaks in a fluid editor.
  // Blindly capping margin-left while leaving text-indent untouched (the old
  // code) desyncs the pair and collapses both patterns to ~0 net indent.
  // This normalizes each pattern to something that actually renders correctly
  // at any width.
  function normalizeWordIndent(el) {
    const style = el.getAttribute("style") || "";
    const mlMatch = style.match(/margin-left\s*:\s*([\d.]+)pt/i);
    const tiMatch = style.match(/text-indent\s*:\s*(-?[\d.]+)pt/i);
    if (!mlMatch && !tiMatch) return;

    const isListItem =
      /mso-list\s*:/i.test(style) ||
      (el.querySelector &&
        el.querySelector("span[style*='mso-list:Ignore' i]"));

    let newStyle = style
      .replace(/margin-left\s*:\s*[\d.]+pt;?/gi, "")
      .replace(/text-indent\s*:\s*-?[\d.]+pt;?/gi, "");

    if (isListItem) {
      // Real bullet/number paragraph: keep a small, consistent hanging indent
      // so the bullet glyph + wrapped text line up, regardless of Word's
      // original (often huge, inconsistent) pt values.
      newStyle += "margin-left:28px;text-indent:-18px;";
    } else if (tiMatch && parseFloat(tiMatch[1]) < 0 && mlMatch) {
      // Fake-center hack (big margin-left + big negative text-indent, no
      // bullet). Recover the actual intent instead of the broken math.
      if (!/text-align\s*:/i.test(newStyle)) {
        newStyle += "text-align:center;";
      }
    } else if (mlMatch) {
      // Plain indent, no hanging trick - just cap it sensibly.
      const px = Math.min(parseFloat(mlMatch[1]) * 1.333, 32);
      newStyle += `margin-left:${px}px;`;
    }

    el.setAttribute("style", newStyle);
  }

  const processNodesTimeBudgeted = async (allEls, styleMaps, onProgress) => {
    const { classMap, tagMap } = styleMaps;
    const total = allEls.length;
    let i = 0;
    while (i < total) {
      const start = performance.now();
      while (i < total && performance.now() - start < FRAME_BUDGET_MS) {
        const el = allEls[i];
        if (!SKIP_STYLE_TAGS.has(el.tagName)) {
          const pieces = [];

          const tagCss = tagMap.get(el.tagName);
          if (tagCss) pieces.push(tagCss);

          const cls = el.getAttribute("class");
          if (cls && classMap.size) {
            cls.split(/\s+/).forEach((c) => {
              const css = classMap.get(c);
              if (css) pieces.push(css);
            });
          }

          if (pieces.length) {
            const existing = el.getAttribute("style") || "";
            const combined = existing
              ? `${pieces.join(";")};${existing}`
              : pieces.join(";");
            el.setAttribute("style", combined);
          }

          const finalStyle = el.getAttribute("style") || "";
          if (
            /color:\s*(white|#fff\b|#ffffff)/i.test(finalStyle) &&
            !/background(?:-color)?\s*:/i.test(finalStyle)
          ) {
            el.setAttribute(
              "style",
              `${finalStyle};background-color:#1d4e6f;padding:4px 8px;`,
            );
          }

          // FIXED: replaces the old margin-left-only cap. That version left
          // text-indent untouched, which desynced Word's margin-left +
          // negative text-indent pairs (used both for bullet hanging indents
          // and for shape-heading "fake centering") and collapsed them to a
          // near-zero net indent. This handles both patterns correctly.
          normalizeWordIndent(el);
        }
        el.removeAttribute("lang");
        el.removeAttribute("align");
        el.removeAttribute("xmlns:v");
        el.removeAttribute("xmlns:o");
        i++;
      }
      onProgress && onProgress(i, total);
      await yieldToBrowser();
    }
  };

  const cleanPastedHTML = async (rawHtml, rawRtf, onProgress) => {
    if (rawHtml.length > MAX_PASTE_HTML_LENGTH) {
      return null; // signal caller to use the regex-only fallback
    }

    try {
      const html = stripWordCruft(rawHtml);

      diagnoseClipboard(rawHtml);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      if (!doc.body || !doc.body.firstChild) {
        return null; // parsing produced nothing usable - let caller fall back
      }

      // fix broken file:// image references using RTF's embedded image data
      const rtfImages = extractImagesFromRtf(rawRtf);
      if (rtfImages.length) {
        fixWordImageSrcs(doc, rtfImages);
      }

      propagateCellBackgrounds(doc);

      // ---- Parse RTF color table once (\colortbl;\red..\green..\blue..;...)
      // so we can resolve \cfN (character color) indices used inside shapes.
      const rtfColorTable = [null]; // index 0 = "auto" / no explicit color
      if (rawRtf) {
        const ctMatch = rawRtf.match(/\{\\colortbl;([\s\S]*?)\}/);
        if (ctMatch) {
          const entries = ctMatch[1].split(";");
          entries.forEach((entry) => {
            const r = entry.match(/\\red(\d+)/);
            const g = entry.match(/\\green(\d+)/);
            const b = entry.match(/\\blue(\d+)/);
            if (r && g && b) {
              const hex = `#${[r[1], g[1], b[1]]
                .map((n) => parseInt(n, 10).toString(16).padStart(2, "0"))
                .join("")}`;
              rtfColorTable.push(hex);
            } else if (entry.trim() === "") {
              rtfColorTable.push(null); // auto/black entry
            }
          });
        }
      }

      // ---- Walk the raw RTF main stream and, for every {\shp ...} group,
      // record how many "\par" paragraph breaks occurred BEFORE it in the
      // main document flow. Shape groups are anchored inline at their
      // paragraph position in RTF, so this paragraph count gives us a
      // stable, purely positional index for where each shape belongs - no
      // fragile text-snippet matching required. \par tokens that occur
      // *inside* a shape group (used only for wrapping the shape's own
      // caption text) are deliberately skipped so they don't pollute the
      // main-flow count.
      //
      // 🔍 TEMP DEBUG: also record the raw byte offset (shpStart) alongside
      // paraCount, so we can print BOTH and see whether two shapes really
      // do land on the same paraCount despite being far apart in the raw
      // RTF bytes (which would mean Word wrote them out of visual order and
      // this whole \par-counting approach can't distinguish them).
      const shapeParagraphIndex = new Map(); // shpStart -> paragraphIndexBefore
      const shapeDebugLog = []; // { shpStart, paraCountAtThatPoint }
      if (rawRtf) {
        let pos = 0;
        let paraCount = 0;
        const n = rawRtf.length;
        while (pos < n) {
          if (rawRtf.startsWith("{\\shp", pos)) {
            let depth = 0;
            let j = pos;
            let shpEnd = -1;
            for (; j < n; j++) {
              if (rawRtf[j] === "{") depth++;
              else if (rawRtf[j] === "}") {
                depth--;
                if (depth === 0) {
                  shpEnd = j;
                  break;
                }
              }
            }
            if (shpEnd === -1) break;
            shapeParagraphIndex.set(pos, paraCount);
            shapeDebugLog.push({
              shpStart: pos,
              paraCountAtThatPoint: paraCount,
            });
            pos = shpEnd + 1;
            continue;
          }
          if (
            rawRtf.startsWith("\\par", pos) &&
            !/[a-zA-Z]/.test(rawRtf[pos + 4] || "")
          ) {
            paraCount++;
            pos += 4;
            continue;
          }
          pos++;
        }
      }

      // 🔍 TEMP DEBUG — how many \par tokens did we find total, and at what
      // byte offset + paraCount did each {\shp} group land? If two headings'
      // paraCountAtThatPoint values are equal/very close even though their
      // shpStart byte offsets are far apart, Word wrote the shapes out of
      // visual order and \par-counting cannot disambiguate them.
      console.log(
        "[DEBUG shapeDebugLog] (byte offset -> paraCount at that point):",
        shapeDebugLog,
      );

      // ---- Extract floating shape/textbox headings from RTF, each with
      // its own fill color, border(line) color, text color, font size,
      // alignment, and its main-flow paragraph index (from the map above) ----
      const shapeTexts = []; // { text, bgColor, textColor, borderColor, fontSizePx, align, paragraphIndex, rtfOrder }
      // Word often draws a heading as TWO separate floating shapes anchored
      // at the same spot: a thin line-only shape (no \shptxt at all - this
      // IS the divider rule) and a second textbox shape with the actual
      // heading background+text. The old code silently `continue`d past
      // any shape with no \shptxt, so the divider was extracted from the
      // source but then thrown away. We now keep a record of it instead,
      // so it can be re-inserted right before the heading it belongs to -
      // this is recovering real source data, not synthesizing a new one.
      const dividerMarkers = []; // { paragraphIndex, rtfOrder, used }
      if (rawRtf) {
        let searchFrom = 0;
        let rtfOrder = 0;
        while (true) {
          const shpStart = rawRtf.indexOf("{\\shp", searchFrom);
          if (shpStart === -1) break;

          let depth = 0;
          let shpEnd = -1;
          for (let i = shpStart; i < rawRtf.length; i++) {
            if (rawRtf[i] === "{") depth++;
            else if (rawRtf[i] === "}") {
              depth--;
              if (depth === 0) {
                shpEnd = i;
                break;
              }
            }
          }
          if (shpEnd === -1) break;
          const shapeGroup = rawRtf.slice(shpStart, shpEnd + 1);
          searchFrom = shpEnd + 1;

          // fill color: Windows COLORREF integer 0x00BBGGRR
          let bgColor = null;
          const fillMatch = shapeGroup.match(
            /\{\\sp\{\\sn fillColor\}\{\\sv (\d+)\}\}/,
          );
          if (fillMatch) {
            const val = parseInt(fillMatch[1], 10);
            const r = val & 0xff;
            const g = (val >> 8) & 0xff;
            const b = (val >> 16) & 0xff;
            bgColor = `#${[r, g, b]
              .map((x) => x.toString(16).padStart(2, "0"))
              .join("")}`;
          }

          // border/line color of the shape - draws the vertical accent bar
          let borderColor = null;
          const lineColorMatch = shapeGroup.match(
            /\{\\sp\{\\sn lineColor\}\{\\sv (\d+)\}\}/,
          );
          const fLineMatch = shapeGroup.match(
            /\{\\sp\{\\sn fLine\}\{\\sv (\d+)\}\}/,
          );
          const lineIsOn = !fLineMatch || fLineMatch[1] !== "0";
          if (lineColorMatch && lineIsOn) {
            const val = parseInt(lineColorMatch[1], 10);
            const r = val & 0xff;
            const g = (val >> 8) & 0xff;
            const b = (val >> 16) & 0xff;
            borderColor = `#${[r, g, b]
              .map((x) => x.toString(16).padStart(2, "0"))
              .join("")}`;
          }

          const txtStart = shapeGroup.indexOf("{\\shptxt");
          if (txtStart === -1) {
            // Check if this shape actually has a fill (background) — if it does,
            // it's a decorative rectangle belonging to some heading's group, NOT
            // a standalone divider line.
            const fFilledMatch = shapeGroup.match(
              /\{\\sp\{\\sn fFilled\}\{\\sv (\d+)\}\}/,
            );
            const hasFillProp = /\{\\sp\{\\sn fillColor\}/.test(shapeGroup);
            const isActuallyFilled = fFilledMatch
              ? fFilledMatch[1] !== "0"
              : hasFillProp;

            if (!isActuallyFilled) {
              dividerMarkers.push({
                paragraphIndex: shapeParagraphIndex.has(shpStart)
                  ? shapeParagraphIndex.get(shpStart)
                  : rtfOrder,
                rtfOrder: rtfOrder++,
                used: false,
              });
            }
            continue;
          }

          let tdepth = 0;
          let txtEnd = -1;
          for (let i = txtStart; i < shapeGroup.length; i++) {
            if (shapeGroup[i] === "{") tdepth++;
            else if (shapeGroup[i] === "}") {
              tdepth--;
              if (tdepth === 0) {
                txtEnd = i;
                break;
              }
            }
          }
          if (txtEnd === -1) continue;

          const block = shapeGroup.slice(txtStart, txtEnd + 1);

          // ---- FIX #1: skip Word field-code shapes (e.g. page numbers).
          // Word writes "Page \* PAGE 10" style footers using a
          // \field{\*\fldinst PAGE}{\fldrslt N} construct inside the
          // shape text. This is never real heading content — it's a
          // footer page-number field that gets duplicated once per page
          // when a multi-page selection is copied. Drop it entirely
          // before any text extraction happens.
          const looksLikePageField =
            /\\\*\s*PAGE\b/i.test(block) ||
            /\\fldinst[^}]*\bPAGE\b/i.test(block) ||
            /\\fldinst[^}]*\bNUMPAGES\b/i.test(block);
          if (looksLikePageField) {
            continue;
          }

          // text color: first \cfN found inside the text block
          let textColor = null;
          const cfMatch = block.match(/\\cf(\d+)/);
          if (cfMatch) {
            const idx = parseInt(cfMatch[1], 10);
            textColor = rtfColorTable[idx] || null;
          }

          // font size: \fsN is in half-points -> convert to px (~1.333 ratio)
          let fontSizePx = 16;
          const fsMatch = block.match(/\\fs(\d+)/);
          if (fsMatch) {
            const pt = parseInt(fsMatch[1], 10) / 2;
            fontSizePx = Math.round(pt * 1.333);
          }

          // alignment
          let align = "left";
          if (/\\qc\b/.test(block)) align = "center";
          else if (/\\qr\b/.test(block)) align = "right";
          else {
            // Word often "fake-centers" shape text using a large left indent (\li)
            // paired with an equally large NEGATIVE first-line indent (\fi), instead
            // of a real \qc control word — same trick normalizeWordIndent() already
            // detects for plain HTML paragraphs. Catch it here too so shape headings
            // recovered purely from RTF don't silently default to left.
            const liMatch = block.match(/\\li(-?\d+)/);
            const fiMatch = block.match(/\\fi(-?\d+)/);
            if (liMatch && fiMatch) {
              const li = parseInt(liMatch[1], 10);
              const fi = parseInt(fiMatch[1], 10);
              if (li > 0 && fi < 0 && Math.abs(fi) > li * 0.3) {
                align = "center";
              }
            }
          }
          // NOTE: \par / \line are replaced with a plain space (not <br>),
          // because in RTF they mark where Word happened to wrap the line
          // at the shape's ORIGINAL width — forcing those as hard <br>
          // breaks makes every word land on its own line once rendered at
          // a different width. Using a space lets the browser wrap the
          // text naturally, exactly like Word did visually.
          const text = block
            .replace(/\\par\b/g, " ")
            .replace(/\\line\b/g, " ")
            .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
              String.fromCharCode(parseInt(hex, 16)),
            )
            .replace(/\{\\pict[\s\S]*?\}/g, "")
            .replace(/\\[a-zA-Z]+-?\d*\s?/g, "")
            .replace(/[{}]/g, "")
            .replace(/\s+/g, " ")
            .trim();

          if (text.length > 0) {
            shapeTexts.push({
              text,
              bgColor,
              textColor,
              borderColor,
              fontSizePx,
              align,
              paragraphIndex: shapeParagraphIndex.has(shpStart)
                ? shapeParagraphIndex.get(shpStart)
                : rtfOrder, // fallback if map lookup somehow misses
              rtfOrder: rtfOrder++,
              shpStart, // 🔍 TEMP DEBUG: keep raw byte offset for logging below
            });
          }
        }
      }

      // ---- FIX #2: drop repeated-verbatim shapes (header/footer boilerplate).
      // A real heading appears once per document. If the exact same shape
      // text shows up more than once, it's Word repeating a page header or
      // footer once per page in the copied range — every instance of that
      // text should be dropped, not just the duplicates.
      const shapeTextFreq = new Map();
      shapeTexts.forEach((s) => {
        const key = s.text.trim().toLowerCase();
        shapeTextFreq.set(key, (shapeTextFreq.get(key) || 0) + 1);
      });
      const dedupedShapeTexts = shapeTexts.filter((s) => {
        const key = s.text.trim().toLowerCase();
        return shapeTextFreq.get(key) === 1;
      });

      // 🔍 TEMP DEBUG — the single most important log. If both headings show
      // the SAME (or very close) paragraphIndex here despite very different
      // shpStart byte offsets, that confirms Word wrote both {\shp} groups
      // out of visual order in the RTF stream, and \par-counting cannot be
      // used to place them correctly for this document.
      console.log(
        "[DEBUG dedupedShapeTexts]",
        dedupedShapeTexts.map((s) => ({
          text: s.text.slice(0, 40),
          paragraphIndex: s.paragraphIndex,
          rtfOrder: s.rtfOrder,
          shpStart: s.shpStart,
        })),
      );

      if (dedupedShapeTexts.length) {
        const existingPlainText = (doc.body.textContent || "")
          .replace(/\s+/g, " ")
          .trim();

        const buildHeadingEl = ({
          text,
          bgColor,
          textColor,
          borderColor,
          fontSizePx,
          align,
        }) => {
          const heading = doc.createElement("p");
          const bg = bgColor || "transparent";

          let finalTextColor = textColor;
          if (!finalTextColor) {
            if (bgColor) {
              const r = parseInt(bgColor.slice(1, 3), 16);
              const g = parseInt(bgColor.slice(3, 5), 16);
              const b = parseInt(bgColor.slice(5, 7), 16);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              finalTextColor = luminance < 0.5 ? "#ffffff" : "#1a1a1a";
            } else {
              finalTextColor = "#1a1a1a";
            }
          }

          // FIX: use borderColor from RTF if we actually found one, otherwise
          // fall back to the TEXT color (always contrasts with bg) instead of
          // bgColor itself (which made the border invisible - same color as bg).
          const accentColor = borderColor || finalTextColor || null;

          heading.setAttribute(
            "style",
            `background-color:${bg};color:${finalTextColor};font-weight:700;` +
              `font-size:${fontSizePx}px;padding:10px 16px;margin:0 0 8px 0;` +
              `text-align:${align};border-radius:2px;` +
              (accentColor ? `border-left:4px solid ${accentColor};` : "") +
              `white-space:normal;word-wrap:break-word;line-height:1.4;`,
          );
          heading.textContent = text;
          heading.setAttribute("data-recovered-heading", "1");
          return heading;
        };

        // Detect Word's real divider paragraphs: empty of text, but carrying
        // a border-top/border-bottom (or a literal <hr>). We NEVER
        // synthesize one — we only recognize it if the source doc actually
        // had it, so it either stays exactly where Word put it or doesn't
        // appear at all.
        const isDividerElement = (el) => {
          if (el.tagName === "HR") return true;
          const style = el.getAttribute("style") || "";
          const hasText = (el.textContent || "").trim().length > 0;
          if (hasText) return false;
          if (/border-(top|bottom)\s*:\s*[^;]*\d/i.test(style)) return true;
          // Word sometimes puts the border on a child span/div instead of
          // directly on the paragraph itself
          return Array.from(el.children || []).some((child) => {
            const cs = child.getAttribute("style") || "";
            return /border-(top|bottom)\s*:\s*[^;]*\d/i.test(cs);
          });
        };

        const queue = dedupedShapeTexts
          .map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ").trim() }))
          .filter(
            (s) => s.text.length > 0 && !existingPlainText.includes(s.text),
          )
          // keep RTF stream order - paragraphIndex values are inherently
          // increasing in this order for correctly-anchored shapes
          .sort((a, b) => a.rtfOrder - b.rtfOrder);

        // ---- Candidate block-level "paragraph units" in the HTML doc, in
        // document order. This is what paragraphIndex is mapped against.
        //
        // IMPORTANT: do NOT filter out empty paragraphs here. Word's RTF \par
        // count includes every paragraph mark, including the ones that only
        // exist to anchor an invisible floating shape (empty <p> in the HTML
        // clipboard) or a divider line. If we skip those empty paragraphs
        // while RTF still counts them, the index mapping drifts further off
        // with every empty paragraph encountered.
        //
        // FIX: td/th are intentionally EXCLUDED here and the whole <table>
        // is treated as a single candidate unit instead. Counting every
        // td/th as its own "paragraph slot" (12 slots for a 6x2 table)
        // desynced this array against the RTF paragraph count, which
        // generally does NOT increment once per table cell the same way.
        const candidates = Array.from(
          doc.body.querySelectorAll(
            "p, li, div, h1, h2, h3, h4, h5, h6, hr, table",
          ),
        ).filter((el) => el.tagName === "TABLE" || !el.closest("table"));

        // ---- PRIMARY positioning strategy: Word's own HTML anchor markers.
        //
        // Word's HTML clipboard leaves an empty comment-pair
        // <!--[if !vml]--><!--[endif]--> inside whichever paragraph anchors
        // a floating shape (textbox/heading) — and these appear in the HTML
        // in correct VISUAL/reading-flow order, one per shape.
        //
        // The RTF \shp byte order is NOT reliable for this: debug logging
        // showed two different heading shapes both resolving to paraCount=1
        // and paraCount=3, landing on the SAME candidate (the table),
        // because Word wrote BOTH {\shp...} groups into the RTF stream
        // before the table's bytes even though the second heading visually
        // belongs after the table. No amount of \par-counting can fix that,
        // since the byte position where we read paraCount for shape #2 is
        // itself before the table.
        //
        // The HTML anchor comments don't have this problem - they're placed
        // exactly where each shape sits in the document's reading order. So
        // we match the Nth shape (by rtfOrder, which IS a correct relative
        // ordering between shapes even though absolute paraCount isn't) to
        // the Nth anchor-comment candidate in document order.
        const vmlAnchorCandidates = candidates.filter((el) =>
          /<!--\[if\s*!vml\]-->/i.test(el.innerHTML || ""),
        );
        const useVmlAnchors = vmlAnchorCandidates.length === queue.length;

        // 🔍 DEBUG — full candidate list + which positioning strategy is active.
        console.log(
          "[DEBUG candidates]",
          candidates.map((c, i) => ({
            i,
            tag: c.tagName,
            text: (c.textContent || "").trim().slice(0, 30),
          })),
        );
        console.log(
          `[DEBUG positioning strategy] useVmlAnchors=${useVmlAnchors} (found ${vmlAnchorCandidates.length} anchor comment(s) for ${queue.length} shape(s))`,
        );

        // ---- Insert each heading directly before the candidate at its
        // computed paragraph index. If that candidate is an EMPTY
        // paragraph (Word commonly anchors a floating shape's paragraph
        // mark to an empty "spacer" paragraph that visually belongs
        // BEFORE the heading, not after it), skip forward past any
        // consecutive empty candidates and insert before the first
        // non-empty one instead.
        //
        // FIX: if one of those empty candidates is actually a real divider
        // line copied from Word (isDividerElement), we stop skipping right
        // there and place the heading immediately AFTER the divider instead
        // of jumping past it — this preserves the original
        // "divider -> heading" layout instead of losing the divider or
        // stranding it in the wrong spot.
        // Sort dividers by rtfOrder so we always consume them in source
        // order when matching them up against headings below.
        const sortedDividers = dividerMarkers
          .slice()
          .sort((a, b) => a.rtfOrder - b.rtfOrder);

        const findDividerFor = (shape) => {
          // A divider belongs to a heading if it appears at or just before
          // the heading's own paragraph position and hasn't been claimed by
          // an earlier heading yet. We take the closest unused one at or
          // before this shape's paragraphIndex.
          let best = null;
          for (const d of sortedDividers) {
            if (d.used) continue;
            if (d.paragraphIndex > shape.paragraphIndex) break;
            best = d; // keep the latest (closest) match found so far
          }
          if (best) best.used = true;
          return best;
        };

        queue.forEach((shape, shapeQueueIdx) => {
          let idx = useVmlAnchors
            ? candidates.indexOf(vmlAnchorCandidates[shapeQueueIdx])
            : Math.max(0, Math.min(shape.paragraphIndex, candidates.length));

          while (
            idx < candidates.length &&
            (candidates[idx].textContent || "").trim().length === 0 &&
            !isDividerElement(candidates[idx])
          ) {
            idx++;
          }

          // if we stopped ON a real divider that was already present as an
          // HTML element, the heading goes right after it
          if (idx < candidates.length && isDividerElement(candidates[idx])) {
            idx++;
          }

          // 🔍 TEMP DEBUG — exactly which candidate this shape resolved to.
          console.log(
            `[DEBUG insert] "${shape.text.slice(0, 30)}" paragraphIndex=${shape.paragraphIndex} -> candidates[${idx}] =`,
            candidates[idx]
              ? {
                  tag: candidates[idx].tagName,
                  text: (candidates[idx].textContent || "").trim().slice(0, 30),
                }
              : "END OF LIST",
          );

          const heading = buildHeadingEl(shape);

          // Recover the actual divider line Word drew for this heading (a
          // separate line-only floating shape in the RTF), rather than
          // inventing one - only add it if the source really had it.
          const divider = findDividerFor(shape)
            ? doc.createElement("hr")
            : null;
          if (divider) divider.setAttribute("data-recovered-divider", "1");

          // agar target ek table cell hai, to poore table ke pehle insert karo,
          // row ke andar nahi — warna heading <tr> ke andar ghus jaati hai
          let insertionTarget = candidates[idx];
          if (
            insertionTarget &&
            (insertionTarget.tagName === "TD" ||
              insertionTarget.tagName === "TH")
          ) {
            const tbl = insertionTarget.closest("table");
            if (tbl && tbl.parentNode) {
              insertionTarget = tbl;
            }
          }

          if (insertionTarget && insertionTarget.parentNode) {
            if (divider) {
              insertionTarget.parentNode.insertBefore(divider, insertionTarget);
            }
            insertionTarget.parentNode.insertBefore(heading, insertionTarget);
          } else {
            if (divider) doc.body.appendChild(divider);
            doc.body.appendChild(heading);
          }
        });

        // Final safety pass: guarantee no heading/divider ended up nested
        // inside a table's rows/cells, regardless of any drift above.
        rescueHeadingsFromTables(doc);
      }

      const styleMaps = buildStyleMaps(doc);

      // NOTE: this container is intentionally kept DETACHED from
      // document.body. Attaching a 500-page tree to the live DOM forces the
      // browser to compute style/layout for the entire tree synchronously in
      // one shot — that's what was causing the tab freeze. A detached
      // fragment/div can still be freely queried and mutated
      // (querySelectorAll, setAttribute, etc. all work fine off-DOM), so
      // there's no need to attach it just to process it.
      const container = document.createElement("div");
      container.style.cssText =
        "position:fixed;left:-9999px;top:0;width:800px;";
      while (doc.body.firstChild) container.appendChild(doc.body.firstChild);

      const allEls = container.querySelectorAll("*");
      await processNodesTimeBudgeted(
        allEls,
        styleMaps,
        (done, total) =>
          onProgress && onProgress({ phase: "cleaning", done, total }),
      );

      return container;
    } catch (e) {
      console.error("Error in cleanPastedHTML:", e);
      return null;
    }
  };

  const sanitizeOnly = (html, rtf) => {
    let bodyHtml = html;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (doc && doc.body) {
        // still try to recover images even on the pathological-size fallback
        const rtfImages = extractImagesFromRtf(rtf);
        if (rtfImages.length) fixWordImageSrcs(doc, rtfImages);
        bodyHtml = doc.body.innerHTML;
      }
    } catch {
      // fall back to the raw string
    }
    return bodyHtml
      .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
      .replace(/<o:p>\s*<\/o:p>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/\sxmlns:[a-z]+="[^"]*"/gi, "")
      .replace(/\sclass="[^"]*"/gi, "")
      .replace(/\slang="[^"]*"/gi, "")
      .replace(/mso-[^:;"]*:[^;"]*;?/gi, "");
  };

  const handlePaste = (e) => {
    // Prevent multiple concurrent pastes
    if (pasteInProgressRef.current) {
      e.preventDefault();
      flashToast("Paste already in progress — please wait");
      return;
    }

    const html = e.clipboardData.getData("text/html");
    const rtf = e.clipboardData.getData("text/rtf");

    console.log(html);
    // console.log(cleanedContainer.innerHTML);

    console.log(
      "[paste] html length:",
      html.length,
      "rtf length:",
      rtf ? rtf.length : 0,
    );
    console.log(
      "[paste] rtf present?",
      !!rtf,
      "rtf sample:",
      rtf ? rtf.slice(0, 100) : "NONE",
    );

    if (html) {
      e.preventDefault();

      pasteInProgressRef.current = true;
      setIsPasteLoading(true);
      setPasteProgress({ phase: "preparing", done: 0, total: 100 });

      saveSelection();

      Promise.resolve().then(async () => {
        try {
          await new Promise((r) => setTimeout(r, 50));

          setPasteProgress({ phase: "parsing", done: 0, total: 100 });
          await new Promise((r) => setTimeout(r, 10));

          const cleanedContainer = await cleanPastedHTML(html, rtf, (p) => {
            setPasteProgress(p);
          });

          console.log("cleaned:", cleanedContainer?.innerHTML);

          if (cleanedContainer === null) {
            // pathological size - regex-only fallback (non-blocking)
            setPasteProgress({ phase: "sanitizing", done: 50, total: 100 });
            await new Promise((r) => setTimeout(r, 20));

            const sanitized = sanitizeOnly(html, rtf);

            setPasteProgress({ phase: "inserting", done: 75, total: 100 });
            await new Promise((r) => setTimeout(r, 10));

            restoreSelection();
            editorRef.current.focus();
            document.execCommand("insertHTML", false, sanitized);

            notifyContentChanged();

            setPasteProgress({ phase: "complete", done: 100, total: 100 });
          } else {
            setPasteProgress({ phase: "positioning", done: 50, total: 100 });
            await new Promise((r) => setTimeout(r, 20));

            const range = restoreSelectionRange();
            let targetParent = editorRef.current;
            let refNode = null;

            if (range) {
              range.deleteContents();
              if (range.startContainer.nodeType === Node.TEXT_NODE) {
                const textNode = range.startContainer;
                const after = textNode.splitText(range.startOffset);
                targetParent = textNode.parentNode;
                refNode = after;
              } else {
                targetParent = range.startContainer;
                refNode =
                  range.startContainer.childNodes[range.startOffset] || null;
              }
            }

            await moveNodesTimeBudgeted(
              cleanedContainer,
              targetParent,
              refNode,
              (done, total) => {
                const pct = Math.round(50 + (done / total) * 50);
                setPasteProgress({
                  phase: "inserting",
                  done: pct,
                  total: 100,
                });
              },
            );

            await new Promise((r) => setTimeout(r, 10));

            notifyContentChanged();

            setPasteProgress({ phase: "complete", done: 100, total: 100 });
          }
        } catch (err) {
          console.error("Paste error:", err);
          try {
            setPasteProgress({ phase: "fallback", done: 0, total: 100 });
            await new Promise((r) => setTimeout(r, 50));

            restoreSelection();
            editorRef.current.focus();
            const sanitized = sanitizeOnly(html, rtf);
            document.execCommand("insertHTML", false, sanitized);

            notifyContentChanged();
          } catch (e2) {
            console.error("Fallback paste failed:", e2);
            flashToast("Paste failed — try pasting as plain text");
          }
        } finally {
          await new Promise((r) => setTimeout(r, 200));
          setIsPasteLoading(false);
          setPasteProgress(null);
          pasteInProgressRef.current = false;
        }
      });

      return;
    }

    // No HTML on clipboard — check for a directly-copied image (Files),
    // e.g. right-click "Copy image" or copying a single image from an app.
    const items = e.clipboardData.items
      ? Array.from(e.clipboardData.items)
      : [];
    const imageItem = items.find(
      (item) => item.type && item.type.startsWith("image/"),
    );
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        setIsImageLoading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          insertHTMLAtCursor(
            `<img src="${event.target.result}" alt="Pasted image" style="max-width:100%;border-radius:4px;" />`,
          );
          setIsImageLoading(false);
        };
        reader.onerror = () => {
          setIsImageLoading(false);
          flashToast("Couldn't load that image — try again");
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // fallback: plain text paste (no HTML/image available on clipboard)
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      notifyContentChanged();
    }
  };

  // ---- table creation ----
  const createCustomTable = () => {
    const rowsInput = prompt("Number of rows (including header):", "4");
    if (rowsInput === null) return;
    const colsInput = prompt("Number of columns:", "3");
    if (colsInput === null) return;

    const numRows = parseInt(rowsInput, 10);
    const numCols = parseInt(colsInput, 10);

    if (
      !Number.isInteger(numRows) ||
      !Number.isInteger(numCols) ||
      numRows < 1 ||
      numCols < 1
    ) {
      alert("Please enter valid whole numbers (1 or greater).");
      return;
    }
    if (numRows > 50 || numCols > 20) {
      alert("Please keep it under 50 rows and 20 columns.");
      return;
    }

    const id = nextTableId();
    insertHTMLAtCursor(buildTableHTML(numRows, numCols, id));
  };

  // ---- table mutation helpers ----
  const withActiveTable = (fn) => {
    if (!activeTableId || !editorRef.current) return;
    const table = editorRef.current.querySelector(
      `[${TABLE_ID_ATTR}="${activeTableId}"]`,
    );
    if (table) fn(table);
    notifyContentChanged();
  };

  const getCurrentCell = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    return findCell(sel.getRangeAt(0).startContainer);
  };

  const addRow = (position) => {
    const cell = getCurrentCell();
    const row = cell ? findRow(cell) : null;
    if (!row) return;
    const colCount = row.children.length;
    const newRow = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.setAttribute("style", cellStyle);
      td.innerHTML = "&nbsp;";
      newRow.appendChild(td);
    }
    if (position === "after") {
      row.parentNode.insertBefore(newRow, row.nextSibling);
    } else {
      row.parentNode.insertBefore(newRow, row);
    }
    notifyContentChanged();
  };

  const deleteRow = () => {
    const cell = getCurrentCell();
    const row = cell ? findRow(cell) : null;
    if (!row) return;
    const table = row.closest("table");
    const rowCount = table.querySelectorAll("tr").length;
    if (rowCount <= 1) {
      flashToast("Can't delete the last row — delete the table instead");
      return;
    }
    if (!confirm("Delete this row?")) return;
    row.remove();
    notifyContentChanged();
  };

  const addColumn = (position) => {
    const cell = getCurrentCell();
    if (!cell) return;
    const table = cell.closest("table");
    const colIndex = cell.cellIndex;
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, ri) => {
      const tag = ri === 0 && row.children[0]?.tagName === "TH" ? "th" : "td";
      const newCell = document.createElement(tag);
      newCell.setAttribute("style", tag === "th" ? headStyle : cellStyle);
      newCell.innerHTML = tag === "th" ? `Header` : "&nbsp;";
      const ref =
        position === "after"
          ? row.children[colIndex + 1]
          : row.children[colIndex];
      row.insertBefore(newCell, ref || null);
    });
    notifyContentChanged();
  };

  const deleteColumn = () => {
    const cell = getCurrentCell();
    if (!cell) return;
    const table = cell.closest("table");
    const colIndex = cell.cellIndex;
    const rows = table.querySelectorAll("tr");
    if (rows[0].children.length <= 1) {
      flashToast("Can't delete the last column — delete the table instead");
      return;
    }
    if (!confirm("Delete this column?")) return;
    rows.forEach((row) => {
      if (row.children[colIndex]) row.children[colIndex].remove();
    });
    notifyContentChanged();
  };

  const deleteTable = () => {
    withActiveTable((table) => {
      if (
        confirm(
          "Delete this entire table? This can't be undone with undo... actually it can — Ctrl/Cmd+Z works.",
        )
      ) {
        table.remove();
        setActiveTableId(null);
      }
    });
  };

  // ---- detect when caret/click is inside a table ----
  const updateTableContext = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setActiveTableId(null);
      return;
    }
    const node = sel.getRangeAt(0).startContainer;
    if (!editorRef.current || !editorRef.current.contains(node)) {
      setActiveTableId(null);
      return;
    }
    const table = findTable(node);
    if (table) {
      let id = table.getAttribute(TABLE_ID_ATTR);
      if (!id) {
        id = nextTableId();
        table.setAttribute(TABLE_ID_ATTR, id);
      }
      setActiveTableId(id);
    } else {
      setActiveTableId(null);
    }
  };

  const handleEditorClick = () => {
    saveSelection();
    updateTableContext();
    updateActiveFormats();
  };

  const handleEditorKeyUp = () => {
    saveSelection();
    updateTableContext();
    updateActiveFormats();
  };

  const handleInput = () => {
    saveSelection();
    scheduleHistory();
    updateActiveFormats();

    onChange(editorRef.current.innerHTML);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        meta &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        redo();
      }
    };
    const node = editorRef.current;
    node?.addEventListener("keydown", onKeyDown);
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, []);

  const insideTable = !!activeTableId;
  const anyFormatActive = Object.values(activeFormats).some(Boolean);
  const isLoading = isImageLoading || isPasteLoading;

  const pasteStatusLabel = (() => {
    if (!pasteProgress) return "Pasting content…";
    const pct = pasteProgress.total
      ? Math.round((pasteProgress.done / pasteProgress.total) * 100)
      : 0;
    const phaseLabel = (() => {
      switch (pasteProgress.phase) {
        case "preparing":
          return "Preparing";
        case "parsing":
          return "Parsing";
        case "cleaning":
          return "Cleaning";
        case "sanitizing":
          return "Sanitizing";
        case "positioning":
          return "Positioning";
        case "inserting":
          return "Inserting";
        case "fallback":
          return "Using fallback";
        case "complete":
          return "Complete";
        default:
          return "Processing";
      }
    })();
    return `${phaseLabel} content… ${pct}%`;
  })();

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <style>{`
        .editor-content table.custom-table td:focus-within,
        .editor-content table.custom-table th:focus-within { outline: 2px solid #6366f1; outline-offset: -2px; }
        .editor-content table.custom-table { border-color: #e2e2e7; }
        .editor-content img { border-radius: 4px; }
        .editor-content:empty:before { content: attr(data-placeholder); color: #9ca3af; }
         .editor-content hr {
          border: none;
          border-top: 2px solid #d5dae1;
          margin: 16px 0;
          }
        .editor-content h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; line-height: 1.3; }
        .editor-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.75em 0; line-height: 1.3; }
        .editor-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.83em 0; line-height: 1.3; }
        .editor-content h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0; line-height: 1.3; }
        .editor-content p { margin: 0.5em 0; }

        .editor-content ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .editor-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .editor-content ul ul { list-style: circle; }
        .editor-content ul ul ul { list-style: square; }
        .editor-content li { display: list-item; margin: 0.25em 0; }

        .editor-content a { color: #2563eb; text-decoration: underline; cursor: pointer; }
      `}</style>

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50/80 sticky top-0 z-20">
        <div className="flex flex-wrap items-center gap-1">
          <select
            onMouseDown={saveSelection}
            onChange={(e) => applyFormat("fontName", e.target.value)}
            disabled={isPasteLoading}
            className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>
              Font
            </option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
            <option value="Tahoma">Tahoma</option>
          </select>

          <select
            onMouseDown={saveSelection}
            onChange={(e) => applyFormat("fontSize", e.target.value)}
            disabled={isPasteLoading}
            className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>
              Size
            </option>
            <option value="1">8</option>
            <option value="2">10</option>
            <option value="3">12</option>
            <option value="4">14</option>
            <option value="5">16</option>
            <option value="6">18</option>
            <option value="7">24</option>
          </select>

          <select
            onMouseDown={saveSelection}
            onChange={(e) => applyFormat("formatBlock", e.target.value)}
            disabled={isPasteLoading}
            className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
            defaultValue="p"
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <Divider />

          <ToolBtn
            title="Bold"
            active={activeFormats.bold}
            onMouseDown={() => applyFormat("bold")}
          >
            <FiBold size={15} />
          </ToolBtn>
          <ToolBtn
            title="Italic"
            active={activeFormats.italic}
            onMouseDown={() => applyFormat("italic")}
          >
            <FiItalic size={15} />
          </ToolBtn>
          <ToolBtn
            title="Underline"
            active={activeFormats.underline}
            onMouseDown={() => applyFormat("underline")}
          >
            <FiUnderline size={15} />
          </ToolBtn>
          <ToolBtn
            title="Strikethrough"
            active={activeFormats.strikeThrough}
            onMouseDown={() => applyFormat("strikeThrough")}
          >
            <span className="text-sm font-bold line-through">S</span>
          </ToolBtn>
          <ToolBtn
            title="Superscript"
            active={activeFormats.superscript}
            onMouseDown={() => applyFormat("superscript")}
          >
            <span className="text-xs font-semibold">X²</span>
          </ToolBtn>
          <ToolBtn
            title="Subscript"
            active={activeFormats.subscript}
            onMouseDown={() => applyFormat("subscript")}
          >
            <span className="text-xs font-semibold">X₂</span>
          </ToolBtn>

          <Divider />

          <ToolBtn
            title="Align left"
            active={activeFormats.justifyLeft}
            onMouseDown={() => applyFormat("justifyLeft")}
          >
            <FiAlignLeft size={15} />
          </ToolBtn>
          <ToolBtn
            title="Align center"
            active={activeFormats.justifyCenter}
            onMouseDown={() => applyFormat("justifyCenter")}
          >
            <FiAlignCenter size={15} />
          </ToolBtn>
          <ToolBtn
            title="Align right"
            active={activeFormats.justifyRight}
            onMouseDown={() => applyFormat("justifyRight")}
          >
            <FiAlignRight size={15} />
          </ToolBtn>
          <ToolBtn
            title="Justify"
            active={activeFormats.justifyFull}
            onMouseDown={() => applyFormat("justifyFull")}
          >
            <FiAlignJustify size={15} />
          </ToolBtn>

          <Divider />

          <ToolBtn
            title="Bulleted list"
            active={activeFormats.insertUnorderedList}
            onMouseDown={() => applyFormat("insertUnorderedList")}
          >
            <FiList size={15} />
          </ToolBtn>
          <ToolBtn
            title="Numbered list"
            active={activeFormats.insertOrderedList}
            onMouseDown={() => applyFormat("insertOrderedList")}
          >
            <span className="text-xs font-semibold">1.</span>
          </ToolBtn>
          <ToolBtn title="Indent" onMouseDown={() => applyFormat("indent")}>
            <FiChevronsRight size={15} />
          </ToolBtn>
          <ToolBtn title="Outdent" onMouseDown={() => applyFormat("outdent")}>
            <FiChevronsLeft size={15} />
          </ToolBtn>

          <Divider />

          <ColorPickerBtn
            title="Text color"
            color={textColor}
            inputRef={textColorInputRef}
            onMouseDown={saveSelection}
            onPick={(val) => {
              setTextColor(val);
              applyFormat("foreColor", val);
            }}
          >
            <span className="font-bold text-[15px] leading-none">A</span>
          </ColorPickerBtn>

          <ColorPickerBtn
            title="Highlight color"
            color={highlightColor}
            inputRef={highlightColorInputRef}
            onMouseDown={saveSelection}
            onPick={(val) => {
              setHighlightColor(val);
              applyFormat("hiliteColor", val);
            }}
          >
            <span className="font-bold text-[15px] leading-none">H</span>
          </ColorPickerBtn>

          <Divider />

          <ToolBtn
            title="Insert image"
            onMouseDown={() => {
              saveSelection();
              fileInputRef.current.click();
            }}
            disabled={isPasteLoading}
          >
            <FiImage size={15} />
          </ToolBtn>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <ToolBtn
            title="Insert link"
            onMouseDown={() => {
              const url = prompt("Enter URL:");
              if (url) applyFormat("createLink", url);
            }}
          >
            <FiLink size={15} />
          </ToolBtn>
          <ToolBtn
            title="Remove link"
            onMouseDown={() => applyFormat("unlink")}
          >
            <FiLink2 size={15} />
          </ToolBtn>

          <Divider />

          <ToolBtn
            title="Clear formatting"
            onMouseDown={() => applyFormat("removeFormat")}
          >
            <FiSlash size={15} />
          </ToolBtn>

          <ToolBtn
            title="Clear / Deselect all active formats"
            active={anyFormatActive}
            onMouseDown={clearSelectionAndFormatting}
          >
            <FiX size={15} />
            <span className="text-xs ml-1">Clear</span>
          </ToolBtn>

          <Divider />

          <ToolBtn title="Undo" onMouseDown={undo} disabled={isPasteLoading}>
            <FiCornerUpLeft size={15} />
          </ToolBtn>
          <ToolBtn title="Redo" onMouseDown={redo} disabled={isPasteLoading}>
            <FiCornerUpRight size={15} />
          </ToolBtn>

          <Divider />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              createCustomTable();
            }}
            disabled={isPasteLoading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <FiGrid size={15} />
            Insert table
          </button>
        </div>

        {/* Contextual table toolbar */}
        <div
          className={`grid transition-all duration-200 ease-out ${
            insideTable
              ? "grid-rows-[1fr] opacity-100 mt-2"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-1.5">
              <span className="text-xs font-medium text-indigo-700 pr-1 whitespace-nowrap">
                Table tools
              </span>
              <Divider />
              <ToolBtn
                title="Add row above"
                onMouseDown={() => addRow("before")}
              >
                <FiArrowUp size={14} />
                <FiPlus size={10} className="-ml-1" />
              </ToolBtn>
              <ToolBtn
                title="Add row below"
                onMouseDown={() => addRow("after")}
              >
                <FiArrowDown size={14} />
                <FiPlus size={10} className="-ml-1" />
              </ToolBtn>
              <ToolBtn title="Delete row" danger onMouseDown={deleteRow}>
                <FiX size={14} />
                <span className="text-xs ml-0.5">Row</span>
              </ToolBtn>
              <Divider />
              <ToolBtn
                title="Add column left"
                onMouseDown={() => addColumn("before")}
              >
                <FiArrowLeft size={14} />
                <FiPlus size={10} className="-ml-1" />
              </ToolBtn>
              <ToolBtn
                title="Add column right"
                onMouseDown={() => addColumn("after")}
              >
                <FiArrowRight size={14} />
                <FiPlus size={10} className="-ml-1" />
              </ToolBtn>
              <ToolBtn title="Delete column" danger onMouseDown={deleteColumn}>
                <FiX size={14} />
                <span className="text-xs ml-0.5">Col</span>
              </ToolBtn>
              <Divider />
              <ToolBtn title="Delete table" danger onMouseDown={deleteTable}>
                <FiTrash2 size={14} />
                <span className="text-xs ml-0.5">Table</span>
              </ToolBtn>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
              {isPasteLoading ? pasteStatusLabel : "Uploading image…"}
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={`editor-content min-h-[480px] max-h-[70vh] overflow-y-auto p-5 focus:outline-none ${
            isPasteLoading ? "opacity-70 pointer-events-none" : ""
          }`}
          onPaste={handlePaste}
          onInput={handleInput}
          onClick={handleEditorClick}
          onKeyUp={handleEditorKeyUp}
          onMouseUp={handleEditorClick}
          data-placeholder={placeholder}
          style={{
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.6,
            fontSize: "14px",
          }}
        />
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between items-center min-h-[34px]">
        <span className={insideTable ? "text-indigo-700 font-medium" : ""}>
          {insideTable
            ? "● Editing inside a table — use Table tools above to add or remove rows/columns"
            : "Click 'Insert table' to add a table, or click into any cell to edit it"}
        </span>
        {toast && (
          <span className="text-red-600 font-medium animate-pulse">
            {toast}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomEditor;
