/**
 * tagTopicSectionHeading.jsx
 *
 * Confirmed patterns across modules (backend ke liye "topic-section-heading"
 * track karne ka pura mapping):
 *
 *   Module 1 -> 1.1.1.H1 Chapter Overview
 *               1.1.1.H2 Definition of the Heart   (title kuch bhi ho sakta hai)
 *               1.1.1.H3 Modern Cardiology
 *
 *   Module 2 -> 2.1.1.1 Chapter Overview           (H marker NAHI, pure numeric)
 *               2.1.1.2 Learning Objective
 *
 *   Module 3 -> 3.1.1.H1C1 Content Sections
 *               3.1.1.H2C2 Learning Objective
 *
 *   Module 4/5 -> koi numbering nahi at all, sirf plain:
 *               "Chapter Overview"
 *               "Learning Objectives"
 *
 *   Module 6 -> 6.1.1.H1C1 Learning Objectives
 *               6.1.1.H1C2 Fundamentals of Pacemaker Lead Systems
 *               6.1.1.H1C3 Topic Overview
 *               ... 6.1.1.H1C7 Broad Classification of Pacemaker Leads
 *               (SAME H-number "H1", sirf C badhta hai 1..7 -> ye SAAT
 *               nahi, EK hi heading hai; C1..C7 uss ek heading ke andar
 *               content ke sequential chunks hain)
 *   Module 7 -> 7.0.H1C1  Learning Objectives
 *
 * Detection rule (numbering ke AAKHRI token se decide hota hai heading hai ya content):
 *   0) Numbering me kam se kam 3 segments (dot se separated) chahiye
 *      (topic.subtopic.heading jaisa depth). Module/Chapter declaration
 *      lines ki shallow numbering ("2", "2.1") is wajah se heading nahi
 *      maani jaati — wo plain content ki tarah treat hoti hain.
 *   0.5) Line ka text (numbering strip karne ke baad) agar "Module"/
 *      "Chapter"/"Topic" declaration pattern se match kare (e.g. "Topic
 *      3.1.1: ECG Basics"), to ye chahe kitni bhi deep numbering ke
 *      saath aaye, kabhi bhi heading nahi maani jaati — aur na hi
 *      "content" ginti hai jo Introduction ko trigger kare.
 *   1) Last token = "C<digit>" (bina H ke, jaise C1, C2)
 *        -> CONTENT hai, kabhi bhi heading nahi maana jata.
 *   2) Last token = "H<digit>" ya "H<digit>C<digit>" (H1, H2, H1C1, H2C2 ...)
 *        -> HEADING hai, title text chahe kuch bhi ho.
 *   2.5) "H<digit>C<digit>" wale case me GROUPING lagti hai: H-number
 *        (topic path + "H<n>") ek "group key" banata hai. Poore group
 *        (same topic, same H-number, chahe C1, C2, C3 ... kitna bhi ho)
 *        me se sirf PEHLA occurrence (document order me) asli heading
 *        banta hai — baaki (C2, C3, ...) sirf us heading ke andar content
 *        hote hain, alag heading nahi (Module 6 ka H1C1..H1C7 example).
 *        Agar H-number badal jaye (H1 -> H2), to wo naya, alag heading hai.
 *   3) Last token = pure numeric (1, 2, 3, 4 ... koi letter nahi)
 *        -> Module 2/3 jaisa topic-level numbering, ye bhi HEADING hai,
 *           title text chahe kuch bhi ho (e.g. "Explanation",
 *           "Introduction to the Cardiac Conduction System").
 *   4) Numbering hi nahi mili (plain text, jaise Module 4/5) -> sirf tab
 *      heading maana jata hai jab poore document me KAHIN bhi numbered
 *      heading na mile, AUR text ek KNOWN title list se match kare
 *      (Chapter Overview / Learning Objective(s) / etc).
 *
 * Module/Chapter/Topic declaration lines aur unke baad ka koi bhi content
 * jo pehli REAL heading se pehle aata hai, wo sab khud-b-khud synthetic
 * "Introduction" (index 0) ke andar cover ho jaata hai — alag se in
 * declaration lines ko heading nahi banaya jaata (rule #0 aur #0.5 isko
 * ensure karte hain).
 *
 * NAYA RULE: agar document me pehli detect hui heading se PEHLE bhi kuch
 * real content hai (ya poore document me koi heading hi nahi mili), to ek
 * synthetic heading khud insert kar do:
 *      id="topic-section-heading", data-topic-heading="Introduction",
 *      data-heading-index="0"
 * taaki backend ko wo leading content bhi kisi section ke andar mile,
 * bina orphan hue.
 *
 * Sabhi tagged headings ko FINAL id document (reading) order me milta hai:
 *   #1 -> id="topic-section-heading"          data-heading-index="0"
 *   #2 -> id="topic-section-heading-2"        data-heading-index="1"
 *   #3 -> id="topic-section-heading-3"        data-heading-index="2"
 *   ... aur aage
 *
 * Usage:
 *   import { tagTopicSectionHeading } from "./tagTopicSectionHeading";
 *   const finalHtml = tagTopicSectionHeading(values.htmlContent);
 */

export const TOPIC_HEADING_ID = "topic-section-heading";

// Sirf tab kaam aati hai jab numbering me H-marker nahi hota
// (e.g. "2.1.1.1 Chapter Overview") ya numbering hi nahi hota
// (e.g. plain "Learning Objectives"). Naya module milte hi yahan naya
// title add kar dena (singular/plural dono daal dena, jaisa doc me likha ho).
const KNOWN_HEADING_TITLES = [
  "Chapter Overview",
  "Learning Objective",
  "Learning Objectives",
  "Introduction",
  "Summary",
  "Key Points",
  "Key Takeaways",
  "Review Questions",
  "Case Study",
];

const BLOCK_TAGS = new Set([
  "P",
  "DIV",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
  "TD",
  "TH",
  "SPAN",
  "STRONG",
  "B",
]);

// Block-level tags jinke against hum "closest declaration-line container"
// dhoondte hain jab leading-content scan karte hain.
const DECLARATION_CONTAINER_SELECTOR = "p,div,h1,h2,h3,h4,h5,h6,li,td,th";

// &nbsp; aur multiple spaces/tabs ko normalize karta hai — Module 4/5 me
// heading se pehle bohot saare nbsp spaces (centering hack) aate hain.
function normalizeText(str) {
  return (str || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Numbering prefix jaise "1.1.1.H1 ", "2.1.1.1 ", "3.1.1.H1C1 ", "7.0.H1C1  "
const NUMBERING_PREFIX_RE = /^\s*\d+(?:\.[A-Za-z0-9]+)*\.?\s+/;

// "C1", "C2" (bina H ke) -> explicit CONTENT marker, kabhi heading nahi
function isContentMarkerToken(token) {
  return /^C\d+$/i.test(token);
}

function isKnownTitle(str) {
  const lower = str.toLowerCase();
  return KNOWN_HEADING_TITLES.some((h) => h.toLowerCase() === lower);
}

// "Module 2: ...", "Chapter 2.1: ...", "Topic 3.1.1: ...", "Level 1-Module
// 3: ..." — ye sab structural DECLARATION lines hain (chahe numbering ho ya
// na ho, chahe tag <p> ho ya <h1>-<h6>). Inhe na to heading banana hai, na
// hi "content" ginna hai jo Introduction ko trigger kare.
const DECLARATION_LINE_RE =
  /^(?:Level\s*\d+\s*[-:]?\s*)?(?:Module|Chapter|Topic)\b\s*[\d.:]*/i;

function isDeclarationLine(rawText) {
  const text = normalizeText(rawText);
  if (!text) return false;

  // poore text par check
  if (DECLARATION_LINE_RE.test(text)) return true;

  // ya numbering strip karne ke baad bhi check (e.g. "3.1.1 Topic 3.1.1: ECG Basics")
  const prefixMatch = text.match(NUMBERING_PREFIX_RE);
  if (prefixMatch) {
    const afterPrefix = text.slice(prefixMatch[0].length).trim();
    if (DECLARATION_LINE_RE.test(afterPrefix)) return true;
  }

  return false;
}

/**
 * @returns {{type: "numbered"|"plain", title: string, groupKey: (string|null)}|null}
 *   type "numbered" = numbering prefix mila (H-marker ya numeric+known-title)
 *   type "plain"    = koi numbering nahi, sirf known-title text match hua
 *   groupKey        = "same heading" ka pehchan-key. Jab do matches ka
 *                      groupKey same ho, to unme se sirf PEHLA (document
 *                      order me) heading banta hai, baaki content ban
 *                      jaate hain (H1C1..H1C7 jaisa case).
 */
function classifyHeading(rawText) {
  const text = normalizeText(rawText);
  if (!text) return null;

  // Sabse pehle: Module/Chapter/Topic declaration line hai to ye kabhi bhi
  // heading nahi ban sakti — chahe numbering kitni bhi "deep" kyun na ho
  // (e.g. "3.1.1 Topic 3.1.1: ECG Basics" -> 3 segments, last token pure
  // numeric "1", warna rule #3 se ye galti se heading ban jaati thi).
  if (isDeclarationLine(text)) {
    return null;
  }

  const prefixMatch = text.match(NUMBERING_PREFIX_RE);

  if (prefixMatch) {
    const prefixRaw = prefixMatch[0].trim().replace(/\.$/, "");
    const tokens = prefixRaw.split(".");
    const title = text.slice(prefixMatch[0].length).trim();

    // Module/Chapter/Topic declaration lines ("Module 2: ...", "Chapter
    // 2.1: ...") ki apni bhi shallow numbering hoti hai (sirf 1-2
    // segments: "2", "2.1"). Asli topic-section headings hamesha kam se
    // kam 3 segments deep hoti hain (topic.subtopic.heading, jaise
    // "2.1.1.1", "1.1.1.H1", "7.0.H1C1"). Isse kam depth wali numbering
    // ko heading nahi maanna — warna declaration lines galat tag ho
    // jaati hain. (Aisi lines is wajah se "plain content" ban jaati hain
    // aur agar first real heading se pehle aayein to Introduction ke
    // andar khud-b-khud cover ho jaati hain.)
    if (tokens.length < 3) {
      return null;
    }

    const lastToken = tokens[tokens.length - 1];
    const moduleNum = tokens[0];

    if (isContentMarkerToken(lastToken)) {
      // e.g. "1.1.1.C1 ..." -> explicit content, never a heading
      return null;
    }

    const hcMatch = lastToken.match(/^H(\d+)C\d+$/i);
    if (hcMatch) {
      // e.g. "6.1.1.H1C1" .. "6.1.1.H1C7", or "7.0.H1C1" .. "7.0.H1C3"
      // followed later by "7.1.H1C1" -> sab EK hi heading (groupKey =
      // sirf MODULE number + H-number, beech ke chapter/topic sub-numbers
      // "0", "1", "1.1" etc. IGNORE hote hain). Isse chahe wahi H-number
      // ("H1") kisi bhi chapter/topic sub-path ke saath dobara aaye, sab
      // ek hi heading ke content-chunks maane jaate hain.
      return {
        type: "numbered",
        title: title || "Untitled Heading",
        groupKey: `${moduleNum}.H${hcMatch[1]}`,
      };
    }

    const hOnlyMatch = lastToken.match(/^H(\d+)$/i);
    if (hOnlyMatch) {
      // e.g. "1.1.1.H1", "1.1.1.H2", "1.1.1.H3" -> bina C ke, module +
      // H-number hi groupKey hai (Module 1 me har H-number sirf ek baar
      // aata hai to ye naturally alag-alag headings rahenge).
      return {
        type: "numbered",
        title: title || "Untitled Heading",
        groupKey: `${moduleNum}.H${hOnlyMatch[1]}`,
      };
    }

    if (/^\d+$/.test(lastToken)) {
      // e.g. "2.1.1.1", "2.1.1.2" -> Module 2/3 jaisa pure-numeric
      // topic-level numbering. Har numbering apne aap me unique heading
      // hai (koi grouping/dedup nahi) — full prefix hi groupKey.
      return {
        type: "numbered",
        title: title || "Untitled Heading",
        groupKey: prefixRaw,
      };
    }

    // numbering hai lekin H-marker ya pure-numeric nahi (e.g. koi aur
    // marker format) — sirf known title par heading
    if (title && isKnownTitle(title)) {
      return { type: "numbered", title, groupKey: prefixRaw };
    }
    return null;
  }

  // koi numbering hi nahi — "plain" bucket, sirf tab count hoga jab poore
  // document me kahin bhi numbered heading na mile (Module 4/5 jaisa case)
  return isKnownTitle(text)
    ? { type: "plain", title: text, groupKey: null }
    : null;
}

function depthOf(node) {
  let d = 0;
  let n = node;
  while (n.parentElement) {
    d++;
    n = n.parentElement;
  }
  return d;
}

// Body ke andar target element se PEHLE (document/reading order me) koi
// non-empty REAL content hai kya, ye check karta hai. Do tarah ka text
// yahan IGNORE hota hai:
//   1) h1-h6 tags ka text — ye Module/Chapter/Topic breadcrumb titles hote
//      hain, real body "content" nahi.
//   2) koi bhi block (tag chahe kuch bhi ho — <p>, <div>, etc.) jiska pura
//      text ek Module/Chapter/Topic declaration line ho (e.g. "Level
//      1-Module 3...", "Chapter 3.1...", "Topic 3.1.1: ECG Basics") — ye
//      bhi structural declaration hai, real content nahi, isliye
//      Introduction ko trigger nahi karni chahiye.
function hasNonEmptyContentBefore(body, targetEl) {
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (targetEl.contains(node)) break; // heading ke apne text tak pahunch gaye

    const headingAncestor =
      node.parentElement && node.parentElement.closest("h1,h2,h3,h4,h5,h6");
    if (headingAncestor) continue; // breadcrumb title — ignore

    const declarationAncestor =
      node.parentElement &&
      node.parentElement.closest(DECLARATION_CONTAINER_SELECTOR);
    if (
      declarationAncestor &&
      isDeclarationLine(declarationAncestor.textContent)
    ) {
      continue; // Module/Chapter/Topic declaration line — ignore
    }

    if (normalizeText(node.textContent)) return true;
  }
  return false;
}

/**
 * @param {string} html - editor se aaya raw HTML (values.htmlContent)
 * @returns {string} - same HTML, topic-section-heading element(s) tagged
 *                      with id + data-topic-heading + data-heading-index
 */
export function tagTopicSectionHeading(html) {
  if (!html || !normalizeText(html.replace(/<[^>]*>/g, ""))) {
    // completely empty content — kuch tag karne ko hai hi nahi
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  // Agar pehle se kabhi tag lag chuka hai (edit -> resubmit case), sabse
  // pehle unhe clean karo warna stale/duplicate ids reh jayenge.
  body.querySelectorAll(`[id^="${TOPIC_HEADING_ID}"]`).forEach((el) => {
    el.removeAttribute("id");
    el.removeAttribute("data-topic-heading");
    el.removeAttribute("data-heading-index");
  });

  const candidates = Array.from(body.querySelectorAll("*")).filter((el) =>
    BLOCK_TAGS.has(el.tagName),
  );

  // ---- PASS 1: matches dhoondo, deepest-first (isse hamesha sabse
  // "tight" wrapper tag milta hai — poore bade <div> ko nahi jisme
  // heading sirf ek chhota sa hissa ho). Ye sirf DETECTION ke liye hai,
  // final numbering iske order pe depend nahi karti.
  const sortedByDepth = candidates
    .map((el) => ({ el, depth: depthOf(el) }))
    .sort((a, b) => b.depth - a.depth)
    .map((x) => x.el);

  let matches = []; // { el, title, type, groupKey }
  sortedByDepth.forEach((el) => {
    if (matches.some((m) => m.el.contains(el) || el.contains(m.el))) return;

    const ownText = normalizeText(el.textContent);
    const classified = classifyHeading(ownText);
    if (!classified) return;

    matches.push({
      el,
      title: classified.title,
      type: classified.type,
      groupKey: classified.groupKey,
    });
  });

  // Agar document me kahin bhi "numbered" heading mil gayi (numbering
  // convention use ho rahi hai), to "plain" (bina-numbering) matches ko
  // ignore kar do — Module 1 jaisa case jahan "Learning Objective" bina
  // number ke aa gayi ho, wo heading nahi maani jaani chahiye kyunki poore
  // doc me numbering scheme follow ho raha hai. "Plain" sirf tab chalta
  // hai jab poore document me numbering ka koi trace na ho (Module 4/5).
  const hasAnyNumberedMatch = matches.some((m) => m.type === "numbered");
  if (hasAnyNumberedMatch) {
    matches = matches.filter((m) => m.type === "numbered");
  }

  // ---- PASS 2: matches ko actual reading/document order me sort karo,
  // taaki final numbering (topic-section-heading, -2, -3...) top-se-neeche
  // padhne ke order ke hisaab se ho, depth-scan ke random order se nahi.
  matches.sort((a, b) => {
    const relation = a.el.compareDocumentPosition(b.el);
    if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  // ---- PASS 2.5: ek hi "group" (same topic path + same H-number, jaise
  // "6.1.1.H1C1", "6.1.1.H1C2", ... "6.1.1.H1C7") se multiple matches mil
  // sakte hain jab content ko C1, C2, C3... me split kiya gaya ho. Ye sab
  // EK hi heading ka content hai — ab matches document order me hain, to
  // sirf sabse PEHLA occurrence heading banega, baaki (same groupKey)
  // discard ho jaayenge aur khud-b-khud us pehle heading ke section me
  // "content" ki tarah aa jaayenge.
  const seenGroupKeys = new Set();
  matches = matches.filter((m) => {
    if (!m.groupKey) return true; // "plain" type ya groupKey na ho -> koi dedup nahi
    if (seenGroupKeys.has(m.groupKey)) return false;
    seenGroupKeys.add(m.groupKey);
    return true;
  });

  // ---- PASS 3: pehli heading se pehle koi orphan content hai kya (ya
  // poore document me koi heading hi nahi mili) -> tab synthetic
  // "Introduction" heading (index 0) top par insert karo.
  const needsIntroPrefix =
    matches.length === 0 || hasNonEmptyContentBefore(body, matches[0].el);

  if (needsIntroPrefix) {
    const introEl = doc.createElement("p");
    introEl.textContent = "Introduction";
    body.insertBefore(introEl, body.firstChild);
    matches.unshift({ el: introEl, title: "Introduction" });
  }

  // ---- FINAL: sequential ids + index, document order me
  matches.forEach((m, i) => {
    const id = i === 0 ? TOPIC_HEADING_ID : `${TOPIC_HEADING_ID}-${i + 1}`;
    m.el.setAttribute("id", id);
    m.el.setAttribute("data-topic-heading", m.title);
    m.el.setAttribute("data-heading-index", String(i)); // 0-based
  });

  return body.innerHTML;
}
