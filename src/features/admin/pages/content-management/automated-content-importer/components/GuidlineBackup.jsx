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
    title: "1. MODULE FORMAT",
    color: "blue",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Every module MUST start exactly like this:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          Module 1: Cardiac Anatomy and Physiology
        </code>
        <p className="font-semibold text-xs sm:text-sm text-gray-700 mb-1">
          Examples:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-3 mb-3 space-y-1">
          {[
            "Module 2: Pacemaker Fundamentals",
            "Module 3: Lead Placement",
            "Module 4: Device Troubleshooting",
          ].map((e) => (
            <li key={e}>
              <code className="bg-gray-100 px-1 rounded text-xs">{e}</code>
            </li>
          ))}
        </ul>
        <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500 text-xs sm:text-sm">
          <p className="font-semibold text-blue-800">Rules:</p>
          <ul className="list-disc list-inside text-blue-700 ml-3 mt-1 space-y-0.5">
            <li>Always start with "Module"</li>
            <li>Always maintain numbering</li>
            <li>Use colon ":"</li>
            <li>Do NOT skip module numbers</li>
            <li>One module can contain multiple chapters</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "2. MODULE DESCRIPTION FORMAT",
    color: "indigo",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Module descriptions are imported into the{" "}
          <code className="bg-gray-100 px-1 rounded">modules.description</code>{" "}
          field.
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto whitespace-pre-wrap">{`Module 1: Cardiac Anatomy and Physiology\n1.D This module introduces cardiac anatomy, physiology, blood flow pathways, valves, pumping mechanics, and their clinical relevance.`}</code>
        <div className="bg-indigo-50 p-2 sm:p-3 rounded border-l-4 border-indigo-500 text-xs sm:text-sm">
          <p className="font-semibold text-indigo-800">Rules:</p>
          <ul className="list-disc list-inside text-indigo-700 ml-3 mt-1 space-y-0.5">
            <li>
              Format:{" "}
              <code className="bg-indigo-100 px-1 rounded">
                1.D Description text
              </code>
            </li>
            <li>Appears immediately after Module title</li>
            <li>One description per module recommended</li>
            <li>Supports plain text and HTML</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "3. CHAPTER FORMAT",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Every chapter MUST start exactly like this:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          Chapter 1.1: Heart Structure
        </code>
        <p className="font-semibold text-xs sm:text-sm text-gray-700 mb-1">
          Examples:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-3 mb-3 space-y-1">
          {[
            "Chapter 1.2: Heart Valves",
            "Chapter 2.1: Pacemaker Components",
            "Chapter 3.4: Device Programming",
          ].map((e) => (
            <li key={e}>
              <code className="bg-gray-100 px-1 rounded text-xs">{e}</code>
            </li>
          ))}
        </ul>
        <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500 text-xs sm:text-sm">
          <p className="font-semibold text-red-800">Do NOT use:</p>
          <ul className="list-disc list-inside text-red-700 ml-3 mt-1 space-y-0.5">
            {["Chapter-1", "CHAPTER", "Chap", "Missing colon"].map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "4. CHAPTER DESCRIPTION FORMAT",
    color: "teal",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Imported into the{" "}
          <code className="bg-gray-100 px-1 rounded">chapters.description</code>{" "}
          field.
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto whitespace-pre-wrap">{`Chapter 1.1: Heart Structure\n1.1.D This chapter explains cardiac chambers, blood flow pathways, and major vessels.`}</code>
        <div className="bg-teal-50 p-2 sm:p-3 rounded border-l-4 border-teal-500 text-xs sm:text-sm">
          <p className="font-semibold text-teal-800">Rules:</p>
          <ul className="list-disc list-inside text-teal-700 ml-3 mt-1 space-y-0.5">
            <li>
              Format:{" "}
              <code className="bg-teal-100 px-1 rounded">
                1.1.D Description text
              </code>
            </li>
            <li>Appears immediately after Chapter title</li>
            <li>One description per chapter recommended</li>
            <li>Supports plain text and HTML</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "5. TOPIC FORMAT",
    color: "purple",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Every topic MUST start exactly like this:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
          Topic 1.1.1: Four Chambers of the Heart
        </code>
        <p className="font-semibold text-xs sm:text-sm text-gray-700 mb-1">
          Examples:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-3 mb-3 space-y-1">
          {[
            "Topic 1.1.2: Blood Flow Pathways",
            "Topic 1.2.1: Mitral Valve",
            "Topic 2.3.4: Lead Positioning",
          ].map((e) => (
            <li key={e}>
              <code className="bg-gray-100 px-1 rounded text-xs">{e}</code>
            </li>
          ))}
        </ul>
        <div className="bg-purple-50 p-2 sm:p-3 rounded border-l-4 border-purple-500 text-xs sm:text-sm">
          <p className="font-semibold text-purple-800">Rules:</p>
          <ul className="list-disc list-inside text-purple-700 ml-3 mt-1 space-y-0.5">
            <li>
              Format: <strong>Topic Module.Chapter.Topic: Title</strong>
            </li>
            <li>Do NOT skip numbering</li>
            <li>Topic code MUST remain unique</li>
            <li>Every topic belongs to one chapter only</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "6. TOPIC DESCRIPTION FORMAT",
    color: "pink",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Imported into the{" "}
          <code className="bg-gray-100 px-1 rounded">topics.description</code>{" "}
          field.
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto whitespace-pre-wrap">{`Topic 1.1.1: Four Chambers of the Heart\n1.1.1.D This topic explains the anatomy and function of all four cardiac chambers.`}</code>
        <div className="bg-pink-50 p-2 sm:p-3 rounded border-l-4 border-pink-500 text-xs sm:text-sm">
          <p className="font-semibold text-pink-800">Rules:</p>
          <ul className="list-disc list-inside text-pink-700 ml-3 mt-1 space-y-0.5">
            <li>
              Format:{" "}
              <code className="bg-pink-100 px-1 rounded">
                1.1.1.D Description text
              </code>
            </li>
            <li>Appears immediately after Topic title</li>
            <li>One description per topic recommended</li>
            <li>Supports plain text and HTML</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "7. HEADING FORMAT",
    color: "orange",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          All topic headings MUST use this exact structure:
        </p>
        <div className="space-y-1 mb-3">
          {[
            "1.1.1.H1 Heading Name",
            "1.1.1.H2 Heading Name",
            "1.1.1.H3 Heading Name",
          ].map((e) => (
            <code
              key={e}
              className="block bg-gray-900 text-green-400 p-2 rounded-md font-mono text-xs overflow-x-auto"
            >
              {e}
            </code>
          ))}
        </div>
        <p className="font-semibold text-xs sm:text-sm text-gray-700 mb-1">
          Examples:
        </p>
        <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-3 mb-3 space-y-1">
          {[
            "1.1.1.H1 Learning Objective",
            "1.1.1.H2 Definition",
            "1.1.1.H3 Explanation",
            "1.1.1.H4 Clinical Importance",
            "1.1.1.H5 Summary",
          ].map((e) => (
            <li key={e}>
              <code className="bg-gray-100 px-1 rounded text-xs">{e}</code>
            </li>
          ))}
        </ul>
        <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500 text-xs sm:text-sm">
          <p className="font-semibold text-green-800">Correct vs Wrong:</p>
          <p className="mt-1">
            ✓{" "}
            <code className="bg-green-100 px-1 rounded text-xs">
              1.1.1.H1 Definition
            </code>
          </p>
          <p className="text-red-600 mt-0.5">
            ✗{" "}
            <code className="bg-red-100 px-1 rounded text-xs">
              1.1.2.H1 Definition
            </code>{" "}
            (Topic code mismatch)
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "8. CONTENT FORMAT",
    color: "yellow",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Every heading content MUST start like this:
        </p>
        <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3">
          1.1.1.C1
        </code>
        <p className="text-gray-600 text-xs sm:text-sm mb-3">
          Content belongs to latest heading. Continues until next heading,
          topic, chapter, or module.
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`1.1.1.H1 Definition\n1.1.1.C1\nThe heart is a muscular organ responsible for pumping blood.`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    title: "9. TOPIC QUIZ / ASSESSMENT FORMAT",
    color: "purple",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Topic assessments MUST remain inside the same document under the
          correct topic.
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`1.1.2.Q1 Which vessel carries blood from the RV to lungs?\n1.1.2.Q1.O1 A. Aorta\n1.1.2.Q1.O2 B. Pulmonary artery\n1.1.2.Q1.O3 C. Pulmonary vein\n1.1.2.Q1.O4 D. Superior vena cava\n1.1.2.Q1.A Correct Answer: B`}</pre>
        </div>
        <div className="bg-purple-50 p-2 sm:p-3 rounded border-l-4 border-purple-500 text-xs sm:text-sm">
          <p className="font-semibold text-purple-800">
            Answer Formats Supported:
          </p>
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
          <p className="font-semibold text-purple-800 mt-2">
            Option Formats Supported:
          </p>
          <ul className="list-disc list-inside text-purple-700 ml-3 mt-1 space-y-0.5">
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
    id: 10,
    title: "10. DYNAMIC EXAM FORMAT",
    color: "cyan",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm font-semibold">
          Supported Exam Types:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            "Module Exams",
            "Chapter Exams",
            "Level Exams",
            "Case-Based Exams",
          ].map((t) => (
            <div
              key={t}
              className="bg-cyan-50 border border-cyan-200 rounded-md p-2 text-center text-xs font-semibold text-cyan-800"
            >
              {t}
            </div>
          ))}
        </div>
        <p className="text-gray-700 mb-2 text-xs sm:text-sm font-semibold">
          Exam Header Format (required for all non-topic assessments):
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto mb-3">
          <pre className="whitespace-pre-wrap">{`Assessment Type: module\nAssessment Target: 1\nAssessment Title: Module 1 Final Assessment`}</pre>
        </div>
        <div className="bg-cyan-50 p-2 sm:p-3 rounded border-l-4 border-cyan-500 text-xs sm:text-sm">
          <p className="font-semibold text-cyan-800">Assessment Targets:</p>
          <ul className="list-disc list-inside text-cyan-700 ml-3 mt-1 space-y-0.5">
            <li>
              Module → Target: <code>1</code>
            </li>
            <li>
              Chapter → Target: <code>1.2</code>
            </li>
            <li>
              Level → Target: <code>L1</code>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    title: "11. MODULE MCQ FORMAT",
    color: "blue",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">1.MMQ1</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: module\nAssessment Target: 1\nAssessment Title: Module 1 Final Assessment\n\n1.MMQ1 Which structure is the natural pacemaker of the heart?\n1.MMQ1.O1 A. AV Node\n1.MMQ1.O2 B. Bundle of His\n1.MMQ1.O3 C. SA Node\n1.MMQ1.O4 D. Purkinje Fibers\n1.MMQ1.A Correct Answer: C`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    title: "12. CHAPTER MCQ FORMAT",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">1.2.CHQ1</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: chapter\nAssessment Target: 1.2\nAssessment Title: Chapter 1.2 Assessment\n\n1.2.CHQ1 Which valve separates LA and LV?\n1.2.CHQ1.O1 A. Tricuspid\n1.2.CHQ1.O2 B. Mitral\n1.2.CHQ1.O3 C. Pulmonary\n1.2.CHQ1.O4 D. Aortic\n1.2.CHQ1.A Correct Answer: B`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 13,
    title: "13. LEVEL MCQ FORMAT",
    color: "amber",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 mb-2 text-xs sm:text-sm">
          Format: <code className="bg-gray-100 px-1 rounded">L1.LMQ1</code>
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded-md font-mono text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Assessment Type: level\nAssessment Target: L1\nAssessment Title: Level 1 Assessment\n\nL1.LMQ1 Which chamber pumps blood into systemic circulation?\nL1.LMQ1.O1 A. RA\nL1.LMQ1.O2 B. RV\nL1.LMQ1.O3 C. LA\nL1.LMQ1.O4 D. LV\nL1.LMQ1.A Correct Answer: D`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 14,
    title: "14. CASE-BASED EXAM FORMAT",
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
              <code>1.CT1</code> → Case Title
            </li>
            <li>
              <code>1.CD1</code> → Case Description
            </li>
            <li>
              <code>1.CMQ1</code> → Case MCQ
            </li>
            <li>
              <code>1.CMQ1.O1</code> → Option
            </li>
            <li>
              <code>1.CMQ1.A</code> → Answer
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 15,
    title: "15. HTML SUPPORT",
    color: "gray",
    content: (
      <div className="p-3 sm:p-4">
        <p className="text-gray-700 text-xs sm:text-sm mb-2">
          The LMS import system fully supports:
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
            "<tr>",
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
    id: 16,
    title: "16. RECOMMENDED CONTENT FLOW",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500 text-xs sm:text-sm mb-3">
          <p className="font-semibold text-blue-800">Full Hierarchy Flow:</p>
          <div className="mt-2 text-xs space-y-0.5 font-mono">
            {[
              "Module",
              "  1.D Module Description",
              "  Chapter",
              "    1.1.D Chapter Description",
              "    Topic",
              "      1.1.1.D Topic Description",
              "      1.1.1.H1 Learning Objective",
              "      1.1.1.C1 Content",
              "      1.1.1.H2 Definition",
              "      1.1.1.C2 Content",
              "      1.1.1.H3 Explanation",
              "      1.1.1.C3 Content",
              "      1.1.1.H4 Clinical Importance",
              "      1.1.1.C4 Content",
              "      1.1.1.H5 Summary",
              "      1.1.1.C5 Content",
              "      Topic Assessment (Q1–Q5)",
            ].map((line, i) => (
              <code key={i} className="block text-gray-700">
                {line}
              </code>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 17,
    title: "17. COMPLETE TOPIC EXAMPLE",
    color: "gray",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md font-mono text-[10px] sm:text-xs overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`Module 1: Cardiac Anatomy and Physiology
1.D Introduction to cardiac anatomy and physiology.

Chapter 1.1: Heart Structure
1.1.D Overview of cardiac chambers and circulation.

Topic 1.1.1: Four Chambers of the Heart
1.1.1.D Learn the anatomy and function of the four cardiac chambers.

1.1.1.H1 Learning Objective
1.1.1.C1
By the end of this topic learners will understand cardiac chambers.

1.1.1.H2 Definition
1.1.1.C2
The heart contains four chambers: RA, RV, LA, LV.

1.1.1.H3 Explanation
1.1.1.C3
The right atrium receives deoxygenated blood from the body.
The right ventricle pumps blood to the lungs.
The left atrium receives oxygenated blood from the lungs.
The left ventricle pumps blood to the entire body.

1.1.1.H4 Clinical Importance
1.1.1.C4
Understanding chambers helps diagnose heart failure and valve disease.

1.1.1.H5 Summary
1.1.1.C5
The heart's four chambers work together to maintain dual circulation.

1.1.1.Q1 How many chambers are present in the heart?
1.1.1.Q1.O1 A. 2
1.1.1.Q1.O2 B. 3
1.1.1.Q1.O3 C. 4
1.1.1.Q1.O4 D. 5
1.1.1.Q1.A Correct Answer: C

1.1.1.Q2 Which chamber receives deoxygenated blood from the body?
1.1.1.Q2.O1 A. Left Atrium
1.1.1.Q2.O2 B. Right Atrium
1.1.1.Q2.O3 C. Left Ventricle
1.1.1.Q2.O4 D. Right Ventricle
1.1.1.Q2.A Correct Answer: B`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 18,
    title: "18. DO NOT USE",
    color: "red",
    content: (
      <div className="p-3 sm:p-4">
        <ul className="list-disc list-inside text-red-600 space-y-1 text-xs sm:text-sm ml-3">
          {[
            "Paste screenshots of text",
            "Use Canva exported text blocks",
            "Use malformed tables",
            "Break numbering hierarchy",
            "Use random heading names without codes",
            "Put assessment outside topic flow",
            "Use manual bullets without formatting consistency",
            "Broken copied tables from PDFs",
            "Screenshot tables",
            "Nested malformed tables",
            "Place images randomly (keep inside proper topic content)",
            "Change numbering manually midway",
            "Use duplicate question codes",
            "Mix chapter/topic structures",
            "Put plain MCQs without identifiers",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 19,
    title: "19. FINAL IMPORTANT NOTES",
    color: "red",
    content: (
      <div className="p-3 sm:p-4">
        <div className="bg-red-50 p-3 sm:p-4 rounded border-2 border-red-300 mb-4">
          <p className="font-bold text-red-800 text-sm sm:text-base mb-2">
            ⚠️ The LMS bulk import system is STRUCTURE-SENSITIVE!
          </p>
          <p className="text-xs sm:text-sm text-red-700">
            Even small formatting mistakes can:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-4 mt-1 space-y-0.5">
            {[
              "Break parsing",
              "Skip content",
              "Merge topics incorrectly",
              "Lose assessments",
              "Attach quiz to wrong topic",
              "Break hierarchy relationships",
              "Miss answers/options",
              "Lose descriptions",
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
                "Follow exact numbering",
                "Follow exact hierarchy",
                "Keep consistent formatting",
                "Keep assessments structured",
                "Keep heading/content linked properly",
                "Verify topic codes before submission",
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
                "Change numbering manually midway",
                "Use inconsistent codes",
                "Use random formatting",
                "Mix chapter/topic structures",
                "Put plain MCQs without identifiers",
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
    id: 20,
    title: "20. PRE-SUBMISSION CHECKLIST",
    color: "green",
    content: (
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {[
            "Module numbering verified",
            "Module description verified",
            "Chapter numbering verified",
            "Chapter description verified",
            "Topic numbering verified",
            "Topic description verified",
            "Heading codes verified",
            "Content codes verified",
            "Assessment type verified",
            "Assessment target verified",
            "All answers present",
            "All options present",
            "No duplicate question IDs",
            "HTML formatting clean",
            "Images properly placed",
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
                  LMS Content Writing & Bulk Import Guidelines
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Follow strictly for successful bulk import
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
                    The LMS bulk import system is structure-sensitive. Even
                    small formatting mistakes can: break parsing | skip content
                    | merge topics incorrectly | lose assessments | attach quiz
                    to wrong topic | break hierarchy | miss answers/options |
                    lose descriptions
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
                        Element
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
                      [
                        "Module",
                        "Module N: Title",
                        "Module 1: Cardiac Anatomy",
                      ],
                      [
                        "Module Desc",
                        "N.D Description",
                        "1.D This module covers...",
                      ],
                      [
                        "Chapter",
                        "Chapter N.N: Title",
                        "Chapter 1.1: Heart Structure",
                      ],
                      [
                        "Chapter Desc",
                        "N.N.D Description",
                        "1.1.D This chapter covers...",
                      ],
                      [
                        "Topic",
                        "Topic N.N.N: Title",
                        "Topic 1.1.1: Four Chambers",
                      ],
                      [
                        "Topic Desc",
                        "N.N.N.D Description",
                        "1.1.1.D This topic explains...",
                      ],
                      [
                        "Heading",
                        "N.N.N.HN Title",
                        "1.1.1.H1 Learning Objective",
                      ],
                      ["Content", "N.N.N.CN", "1.1.1.C1"],
                      ["Topic Quiz", "N.N.N.QN", "1.1.1.Q1 Question text"],
                      ["Module MCQ", "N.MMQN", "1.MMQ1 Question text"],
                      ["Chapter MCQ", "N.N.CHQN", "1.2.CHQ1 Question text"],
                      ["Level MCQ", "LN.LMQN", "L1.LMQ1 Question text"],
                      ["Case Title", "N.CTN", "1.CT1 Case Title"],
                      ["Case Desc", "N.CDN", "1.CD1 Description"],
                      ["Case MCQ", "N.CMQN", "1.CMQ1 Question text"],
                    ].map(([el, fmt, ex]) => (
                      <tr
                        key={el}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-2 border border-gray-200 font-medium text-gray-700">
                          {el}
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
