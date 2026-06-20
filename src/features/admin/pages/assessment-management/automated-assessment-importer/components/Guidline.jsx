import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineInfoCircle,
  AiOutlineDown,
  AiOutlineRight,
} from "react-icons/ai";

const sections = [
  {
    id: 1,
    title: "1. ASSESSMENT TYPES",
    color: "blue",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Supported Assessment Types:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {[
            "Module Exams",
            "Chapter Exams",
            "Level Exams",
            "Case-Based Exams",
          ].map((t) => (
            <div
              key={t}
              className="bg-blue-50 border border-blue-200 rounded-md p-2 text-center text-xs font-semibold text-blue-800"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "2. ASSESSMENT HEADER FORMAT",
    color: "indigo",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm font-semibold">
          Required header for all assessments:
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`Assessment Type: module\nAssessment Target: 1\nAssessment Title: Module 1 Final Assessment`}</pre>
        </div>
        <div className="bg-indigo-50 p-2 sm:p-3 rounded border-l-4 border-indigo-500 text-xs sm:text-sm">
          <p className="font-semibold text-indigo-800">Assessment Targets:</p>
          <ul className="list-disc list-inside text-indigo-700 ml-3 mt-1 space-y-0.5">
            <li>
              Module → Target:{" "}
              <code className="bg-indigo-100 px-1 rounded">1</code>
            </li>
            <li>
              Chapter → Target:{" "}
              <code className="bg-indigo-100 px-1 rounded">1.2</code>
            </li>
            <li>
              Level → Target:{" "}
              <code className="bg-indigo-100 px-1 rounded">L1</code>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "3. MCQ QUESTION FORMAT",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Every MCQ question MUST follow this format:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          [Code] Question text
        </code>
        <p className="font-semibold text-xs sm:text-sm text-gray-700 mb-1">
          Question Codes:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-3 mb-3 space-y-1">
          {[
            "Topic Quiz: N.N.N.QN",
            "Module MCQ: N.MMQN",
            "Chapter MCQ: N.N.CHQN",
            "Level MCQ: LN.LMQN",
            "Case MCQ: N.CMQN",
          ].map((e) => (
            <li key={e}>
              <code className="bg-gray-100 px-1 rounded text-xs">{e}</code>
            </li>
          ))}
        </ul>
        <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500 text-xs sm:text-sm">
          <p className="font-semibold text-green-800">Examples:</p>
          <ul className="list-disc list-inside text-green-700 ml-3 mt-1 space-y-0.5">
            <li>
              <code className="bg-green-100 px-1 rounded">
                1.1.1.Q1 Which vessel carries blood?
              </code>
            </li>
            <li>
              <code className="bg-green-100 px-1 rounded">
                1.MMQ1 Which structure is the pacemaker?
              </code>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "4. OPTION FORMAT",
    color: "teal",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Options MUST follow the question code:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          [Code].O[N] Option text
        </code>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`1.1.1.Q1 Which vessel carries blood from the RV to lungs?\n1.1.1.Q1.O1 A. Aorta\n1.1.1.Q1.O2 B. Pulmonary artery\n1.1.1.Q1.O3 C. Pulmonary vein\n1.1.1.Q1.O4 D. Superior vena cava`}</pre>
        </div>
        <div className="bg-teal-50 p-2 sm:p-3 rounded border-l-4 border-teal-500 text-xs sm:text-sm">
          <p className="font-semibold text-teal-800">Supported Formats:</p>
          <ul className="list-disc list-inside text-teal-700 ml-3 mt-1 space-y-0.5">
            <li>
              <code>A. Option</code> ← Recommended
            </li>
            <li>
              <code>A) Option</code>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "5. ANSWER FORMAT",
    color: "purple",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Correct answer MUST be specified:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          [Code].A Correct Answer: [Option Letter]
        </code>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`1.1.1.Q1.A Correct Answer: B`}</pre>
        </div>
        <div className="bg-purple-50 p-2 sm:p-3 rounded border-l-4 border-purple-500 text-xs sm:text-sm">
          <p className="font-semibold text-purple-800">Supported Formats:</p>
          <ul className="list-disc list-inside text-purple-700 ml-3 mt-1 space-y-0.5">
            <li>
              <code>Correct Answer: B</code> ← Recommended
            </li>
            <li>
              <code>Answer: B</code>
            </li>
            <li>
              <code>B</code>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "6. MODULE MCQ FORMAT",
    color: "blue",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">N.MMQN</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: module\nAssessment Target: 1\nAssessment Title: Module 1 Final Assessment\n\n1.MMQ1 Which structure is the natural pacemaker of the heart?\n1.MMQ1.O1 A. AV Node\n1.MMQ1.O2 B. Bundle of His\n1.MMQ1.O3 C. SA Node\n1.MMQ1.O4 D. Purkinje Fibers\n1.MMQ1.A Correct Answer: C`}</pre>
        </div>
        <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500 text-xs sm:text-sm mt-3">
          <p className="font-semibold text-blue-800">Rules:</p>
          <ul className="list-disc list-inside text-blue-700 ml-3 mt-1 space-y-0.5">
            <li>Module code starts with module number</li>
            <li>
              Example: <code>1.MMQ1</code> for Module 1
            </li>
            <li>Can have multiple questions per module</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "7. CHAPTER MCQ FORMAT",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">N.N.CHQN</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: chapter\nAssessment Target: 1.2\nAssessment Title: Chapter 1.2 Assessment\n\n1.2.CHQ1 Which valve separates LA and LV?\n1.2.CHQ1.O1 A. Tricuspid\n1.2.CHQ1.O2 B. Mitral\n1.2.CHQ1.O3 C. Pulmonary\n1.2.CHQ1.O4 D. Aortic\n1.2.CHQ1.A Correct Answer: B`}</pre>
        </div>
        <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500 text-xs sm:text-sm mt-3">
          <p className="font-semibold text-green-800">Rules:</p>
          <ul className="list-disc list-inside text-green-700 ml-3 mt-1 space-y-0.5">
            <li>
              Chapter code: <code>Module.Chapter</code>
            </li>
            <li>
              Example: <code>1.2.CHQ1</code> for Chapter 1.2
            </li>
            <li>Each chapter can have multiple questions</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "8. LEVEL MCQ FORMAT",
    color: "amber",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">LN.LMQN</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: level\nAssessment Target: L1\nAssessment Title: Level 1 Assessment\n\nL1.LMQ1 Which chamber pumps blood into systemic circulation?\nL1.LMQ1.O1 A. RA\nL1.LMQ1.O2 B. RV\nL1.LMQ1.O3 C. LA\nL1.LMQ1.O4 D. LV\nL1.LMQ1.A Correct Answer: D`}</pre>
        </div>
        <div className="bg-amber-50 p-2 sm:p-3 rounded border-l-4 border-amber-500 text-xs sm:text-sm mt-3">
          <p className="font-semibold text-amber-800">Rules:</p>
          <ul className="list-disc list-inside text-amber-700 ml-3 mt-1 space-y-0.5">
            <li>
              Level code: <code>L[N]</code>
            </li>
            <li>
              Example: <code>L1.LMQ1</code> for Level 1
            </li>
            <li>Each level can have multiple questions</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    title: "9. CASE-BASED EXAM FORMAT",
    color: "red",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`1.CT1 Sinus Node Dysfunction\n\n1.CD1\nA 74-year-old female presents with fatigue and dizziness.\n\n1.CMQ1 Which conduction structure is most likely dysfunctional?\n1.CMQ1.O1 A. AV Node\n1.CMQ1.O2 B. Bundle Branch\n1.CMQ1.O3 C. SA Node\n1.CMQ1.O4 D. Purkinje Fibers\n1.CMQ1.A Correct Answer: C`}</pre>
        </div>
        <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500 text-xs sm:text-sm">
          <p className="font-semibold text-red-800">Format Codes:</p>
          <ul className="list-disc list-inside text-red-700 ml-3 mt-1 space-y-0.5">
            <li>
              <code>N.CT1</code> → Case Title
            </li>
            <li>
              <code>N.CD1</code> → Case Description
            </li>
            <li>
              <code>N.CMQ1</code> → Case MCQ
            </li>
            <li>
              <code>N.CMQ1.O[N]</code> → Option
            </li>
            <li>
              <code>N.CMQ1.A</code> → Answer
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    title: "10. TOPIC QUIZ FORMAT",
    color: "purple",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Topic quizzes MUST be placed under the correct topic:
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`1.1.2.Q1 Which vessel carries blood from the RV to lungs?\n1.1.2.Q1.O1 A. Aorta\n1.1.2.Q1.O2 B. Pulmonary artery\n1.1.2.Q1.O3 C. Pulmonary vein\n1.1.2.Q1.O4 D. Superior vena cava\n1.1.2.Q1.A Correct Answer: B`}</pre>
        </div>
        <div className="bg-purple-50 p-2 sm:p-3 rounded border-l-4 border-purple-500 text-xs sm:text-sm">
          <p className="font-semibold text-purple-800">Rules:</p>
          <ul className="list-disc list-inside text-purple-700 ml-3 mt-1 space-y-0.5">
            <li>
              Format: <code>Topic Code</code> + <code>.Q[N]</code>
            </li>
            <li>
              Example: <code>1.1.2.Q1</code> for Topic 1.1.2
            </li>
            <li>Each topic can have multiple questions (Q1, Q2, Q3...)</li>
            <li>Must maintain unique question codes</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    title: "11. COMPLETE ASSESSMENT EXAMPLE",
    color: "gray",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md font-mono text-[10px] sm:text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: module\nAssessment Target: 1\nAssessment Title: Module 1 Final Assessment\n\n1.MMQ1 Which structure is the natural pacemaker of the heart?\n1.MMQ1.O1 A. AV Node\n1.MMQ1.O2 B. Bundle of His\n1.MMQ1.O3 C. SA Node\n1.MMQ1.O4 D. Purkinje Fibers\n1.MMQ1.A Correct Answer: C\n\n1.MMQ2 Which chamber receives deoxygenated blood from the body?\n1.MMQ2.O1 A. Left Atrium\n1.MMQ2.O2 B. Right Atrium\n1.MMQ2.O3 C. Left Ventricle\n1.MMQ2.O4 D. Right Ventricle\n1.MMQ2.A Correct Answer: B\n\nAssessment Type: chapter\nAssessment Target: 1.2\nAssessment Title: Chapter 1.2 Assessment\n\n1.2.CHQ1 Which valve separates LA and LV?\n1.2.CHQ1.O1 A. Tricuspid\n1.2.CHQ1.O2 B. Mitral\n1.2.CHQ1.O3 C. Pulmonary\n1.2.CHQ1.O4 D. Aortic\n1.2.CHQ1.A Correct Answer: B\n\nAssessment Type: level\nAssessment Target: L1\nAssessment Title: Level 1 Assessment\n\nL1.LMQ1 Which chamber pumps blood into systemic circulation?\nL1.LMQ1.O1 A. RA\nL1.LMQ1.O2 B. RV\nL1.LMQ1.O3 C. LA\nL1.LMQ1.O4 D. LV\nL1.LMQ1.A Correct Answer: D`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    title: "12. HTML SUPPORT",
    color: "gray",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 text-xs sm:text-sm mb-2">
          The assessment system fully supports HTML in question and option text:
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          {[
            "<p>",
            "<strong>",
            "<b>",
            "<ul>",
            "<ol>",
            "<li>",
            "<tr>",
            "<img>",
            "<hr>",
            "<div>",
          ].map((tag) => (
            <code
              key={tag}
              className="bg-gray-100 px-1.5 py-0.5 rounded text-xs"
            >
              {tag}
            </code>
          ))}
        </div>
        <div className="bg-gray-50 p-2 rounded text-xs">
          <p className="font-semibold">Image Format:</p>
          <code className="block text-gray-700 mt-1">
            {'<img src="image-url" />'}
          </code>
          <p className="font-semibold mt-2">Table Format:</p>
          <code className="block text-gray-700 mt-1">{`<table><tr><td>Data</td></tr></table>`}</code>
        </div>
      </div>
    ),
  },
  {
    id: 13,
    title: "13. DO NOT USE",
    color: "red",
    content: (
      <div className="p-3 sm:p-4">
        <ul className="list-disc list-inside text-red-600 space-y-1 text-xs sm:text-sm ml-3">
          {[
            "Use malformed question codes",
            "Skip assessment headers",
            "Use duplicate question IDs",
            "Place assessments without proper headers",
            "Use inconsistent option formatting",
            "Forget to specify correct answers",
            "Mix assessment types incorrectly",
            "Use invalid target references",
            "Put plain MCQs without identifiers",
            "Break the question-options-answer sequence",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 14,
    title: "14. FINAL IMPORTANT NOTES",
    color: "red",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-red-50 p-3 sm:p-4 rounded border-2 border-red-300 mb-4">
          <p className="font-bold text-red-800 text-sm sm:text-base mb-2">
            ⚠️ The assessment import system is STRUCTURE-SENSITIVE!
          </p>
          <p className="text-xs sm:text-sm text-red-700">
            Even small formatting mistakes can:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-4 mt-1 space-y-0.5">
            {[
              "Break parsing",
              "Skip questions",
              "Lose assessments",
              "Miss answers/options",
              "Attach questions to wrong target",
              "Break assessment relationships",
            ].map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500">
            <p className="font-semibold text-green-800 text-xs sm:text-sm">
              ALWAYS:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-green-700 ml-3 mt-1 space-y-0.5">
              {[
                "Include assessment headers",
                "Use correct codes",
                "Keep options consistent",
                "Specify correct answers",
                "Use unique question IDs",
                "Verify targets before submission",
              ].map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500">
            <p className="font-semibold text-red-800 text-xs sm:text-sm">
              NEVER:
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-3 mt-1 space-y-0.5">
              {[
                "Skip assessment headers",
                "Use duplicate question codes",
                "Mix assessment types incorrectly",
                "Use inconsistent formatting",
                "Forget to specify answers",
                "Use malformed codes",
              ].map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 15,
    title: "15. PRE-SUBMISSION CHECKLIST",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {[
            "Assessment type specified",
            "Assessment target verified",
            "Assessment title added",
            "All question codes correct",
            "All options present",
            "All answers specified",
            "No duplicate question IDs",
            "HTML formatting clean",
            "Images properly placed",
            "Hierarchy maintained",
            "Unique question IDs",
            "Final proofreading completed",
          ].map((item) => (
            <div
              key={item}
              className="text-xs sm:text-sm text-gray-700 flex items-center gap-2"
            >
              <AiOutlineCheckCircle className="text-green-600 text-sm sm:text-base flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const colorMap = {
  blue: "bg-blue-100 text-blue-800",
  indigo: "bg-indigo-100 text-indigo-800",
  green: "bg-green-100 text-green-800",
  teal: "bg-teal-100 text-teal-800",
  purple: "bg-purple-100 text-purple-800",
  pink: "bg-pink-100 text-pink-800",
  orange: "bg-orange-100 text-orange-800",
  yellow: "bg-yellow-100 text-yellow-800",
  cyan: "bg-cyan-100 text-cyan-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-800",
};

const Guideline = ({ open, onClose }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all = {};
    sections.forEach((s) => {
      all[s.id] = true;
    });
    setOpenSections(all);
  };

  const collapseAll = () => setOpenSections({});

  if (!open) return null;

  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col"
          style={{ animation: "slideUp 0.3s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg sticky top-0 z-10 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <AiOutlineInfoCircle className="text-blue-400 text-lg sm:text-xl" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Quiz & Assessment Import Guidelines
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Follow strictly for successful assessment import
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <AiOutlineClose className="text-lg sm:text-xl" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
            {/* Warning Banner */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <AiOutlineWarning className="text-yellow-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 text-sm sm:text-base">
                    Structure-Sensitive System
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                    The assessment import system is structure-sensitive. Even
                    small formatting mistakes can: break parsing | skip
                    questions | lose assessments | miss answers/options | attach
                    questions to wrong target | break assessment relationships
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Format Reference */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
              <div className="bg-gray-800 px-3 sm:px-4 py-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Quick Format Reference
                </h3>
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-200 font-semibold">
                        Assessment Type
                      </th>
                      <th className="text-left p-2 border border-gray-200 font-semibold">
                        Format
                      </th>
                      <th className="text-left p-2 border border-gray-200 font-semibold">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Module MCQ", "N.MMQN", "1.MMQ1 Question text"],
                      ["Chapter MCQ", "N.N.CHQN", "1.2.CHQ1 Question text"],
                      ["Level MCQ", "LN.LMQN", "L1.LMQ1 Question text"],
                      ["Topic Quiz", "N.N.N.QN", "1.1.1.Q1 Question text"],
                      ["Case Title", "N.CTN", "1.CT1 Case Title"],
                      ["Case Desc", "N.CDN", "1.CD1 Description"],
                      ["Case MCQ", "N.CMQN", "1.CMQ1 Question text"],
                      ["Options", "[Code].O[N]", "1.MMQ1.O1 A. Option"],
                      ["Answer", "[Code].A", "1.MMQ1.A Correct Answer: B"],
                    ].map(([type, fmt, ex]) => (
                      <tr
                        key={type}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-2 border border-gray-200 font-medium text-gray-700">
                          {type}
                        </td>
                        <td className="p-2 border border-gray-200">
                          <code className="bg-gray-100 px-1 rounded text-xs">
                            {fmt}
                          </code>
                        </td>
                        <td className="p-2 border border-gray-200 text-gray-500 text-xs">
                          {ex}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expand/Collapse Controls */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={expandAll}
                className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
              >
                Collapse All
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    className="w-full bg-gray-100 px-3 sm:px-4 py-2.5 border-b border-gray-200 flex justify-between items-center hover:bg-gray-150 transition-colors text-left"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colorMap[section.color] || "bg-gray-100 text-gray-800"}`}
                      >
                        #{section.id}
                      </span>
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                        {section.title}
                      </h3>
                    </div>
                    {openSections[section.id] ? (
                      <AiOutlineDown className="text-gray-500 text-sm flex-shrink-0" />
                    ) : (
                      <AiOutlineRight className="text-gray-500 text-sm flex-shrink-0" />
                    )}
                  </button>
                  {openSections[section.id] && section.content}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-3 sm:px-6 py-3 border-t border-gray-200 flex justify-between items-center rounded-b-lg sticky bottom-0 flex-shrink-0">
            <div></div>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-xs sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Guideline;
