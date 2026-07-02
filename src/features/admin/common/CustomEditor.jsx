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
  "HR",
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
        let binary = "";
        for (let i = 0; i < bytes.length; i++)
          binary += String.fromCharCode(bytes[i]);
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
        }
        el.removeAttribute("class");
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

  const moveNodesTimeBudgeted = async (
    sourceContainer,
    targetParent,
    refNode,
    onProgress,
  ) => {
    const total = sourceContainer.childNodes.length;
    let done = 0;
    while (sourceContainer.firstChild) {
      const start = performance.now();
      const frag = document.createDocumentFragment();
      while (
        sourceContainer.firstChild &&
        performance.now() - start < FRAME_BUDGET_MS
      ) {
        frag.appendChild(sourceContainer.firstChild);
        done++;
      }
      targetParent.insertBefore(frag, refNode);
      onProgress && onProgress(done, total);
      await yieldToBrowser();
    }
  };

  const stripWordCruft = (html) =>
    html
      .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "")
      .replace(/<xml>[\s\S]*?<\/xml>/gi, "")
      .replace(/<o:p>\s*<\/o:p>/gi, "")
      .replace(/<o:p>/gi, "")
      .replace(/<\/o:p>/gi, "");

  const cleanPastedHTML = async (rawHtml, rawRtf, onProgress) => {
    if (rawHtml.length > MAX_PASTE_HTML_LENGTH) {
      return null; // signal caller to use the regex-only fallback
    }

    try {
      const html = stripWordCruft(rawHtml);

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

      const styleMaps = buildStyleMaps(doc);

      const container = document.createElement("div");
      container.style.cssText =
        "position:fixed;left:-9999px;top:0;width:800px;";
      while (doc.body.firstChild) container.appendChild(doc.body.firstChild);
      document.body.appendChild(container);

      const allEls = container.querySelectorAll("*");
      await processNodesTimeBudgeted(
        allEls,
        styleMaps,
        (done, total) =>
          onProgress && onProgress({ phase: "cleaning", done, total }),
      );

      document.body.removeChild(container);

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
