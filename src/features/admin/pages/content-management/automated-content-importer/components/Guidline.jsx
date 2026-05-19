import React from "react";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineInfoCircle,
} from "react-icons/ai";

const Guidline = ({ open, onClose }) => {
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
          {/* Modal Header - Sticky */}
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

          {/* Modal Body - Scrollable Responsive */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
            {/* Warning Banner - Responsive */}
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
                    to wrong topic | break hierarchy | miss answers/options
                  </p>
                </div>
              </div>
            </div>

            {/* Guidelines Sections - Responsive Grid for larger screens */}
            <div className="space-y-4">
              {/* 1. MODULE FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    1. MODULE FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    Every module MUST start exactly like this:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
                    Module 1: Cardiac Anatomy and Physiology
                  </code>
                  <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">
                    Examples:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-2 sm:ml-4 mb-3 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Module 2: Pacemaker Fundamentals
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Module 3: Lead Placement
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Module 4: Device Troubleshooting
                      </code>
                    </li>
                  </ul>
                  <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500 text-xs sm:text-sm">
                    <p className="font-semibold text-blue-800">Rules:</p>
                    <ul className="list-disc list-inside text-blue-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                      <li>Always start with "Module"</li>
                      <li>Always maintain numbering</li>
                      <li>Use colon ":"</li>
                      <li>Do NOT skip module numbers</li>
                      <li>One module can contain multiple chapters</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. CHAPTER FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    2. CHAPTER FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    Every chapter MUST start exactly like this:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
                    Chapter 1.1: Heart Structure
                  </code>
                  <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">
                    Examples:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-2 sm:ml-4 mb-3 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Chapter 1.2: Heart Valves
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Chapter 2.1: Pacemaker Components
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Chapter 3.4: Device Programming
                      </code>
                    </li>
                  </ul>
                  <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500 text-xs sm:text-sm">
                    <p className="font-semibold text-red-800">Do NOT use:</p>
                    <ul className="list-disc list-inside text-red-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                      <li>Chapter-1</li>
                      <li>CHAPTER</li>
                      <li>Chap</li>
                      <li>Missing colon</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. TOPIC FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    3. TOPIC FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    Every topic MUST start exactly like this:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
                    Topic 1.1.1: Four Chambers of the Heart
                  </code>
                  <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">
                    Examples:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-2 sm:ml-4 mb-3 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Topic 1.1.2: Blood Flow Pathways
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Topic 1.2.1: Mitral Valve
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        Topic 2.3.4: Lead Positioning
                      </code>
                    </li>
                  </ul>
                  <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500 text-xs sm:text-sm">
                    <p className="font-semibold text-blue-800">Rules:</p>
                    <ul className="list-disc list-inside text-blue-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                      <li>
                        Format:{" "}
                        <strong>Topic Module.Chapter.Topic: Title</strong>
                      </li>
                      <li>Do NOT skip numbering</li>
                      <li>Topic code MUST remain unique</li>
                      <li>Every topic belongs to one chapter only</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. HEADING FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    4. HEADING FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    All topic headings MUST use this exact structure:
                  </p>
                  <div className="space-y-1 mb-3">
                    <code className="block bg-gray-900 text-green-400 p-2 rounded-md font-mono text-xs sm:text-sm overflow-x-auto">
                      1.1.1.H1 Heading Name
                    </code>
                    <code className="block bg-gray-900 text-green-400 p-2 rounded-md font-mono text-xs sm:text-sm overflow-x-auto">
                      1.1.1.H2 Heading Name
                    </code>
                    <code className="block bg-gray-900 text-green-400 p-2 rounded-md font-mono text-xs sm:text-sm overflow-x-auto">
                      1.1.1.H3 Heading Name
                    </code>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1">
                    Examples:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm ml-2 sm:ml-4 mb-3 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        1.1.1.H1 Learning Objective
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        1.1.1.H2 Definition
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        1.1.1.H3 Explanation
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        1.1.1.H4 Clinical Importance
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded text-xs">
                        1.1.1.H5 Summary
                      </code>
                    </li>
                  </ul>
                  <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500 text-xs sm:text-sm">
                    <p className="font-semibold text-green-800">
                      Correct vs Wrong:
                    </p>
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
              </div>

              {/* 5. CONTENT FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    5. CONTENT FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    Every heading content MUST start like this:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
                    1.1.1.C1
                  </code>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Content belongs to latest heading. Content continues until
                    next heading, topic, chapter, or module.
                  </p>
                  <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                    <p className="font-semibold">Example:</p>
                    <code className="block mt-1 text-gray-700">
                      1.1.1.H1 Definition
                    </code>
                    <code className="block text-gray-700">
                      1.1.1.C1 The heart is a muscular organ responsible for
                      pumping blood.
                    </code>
                  </div>
                </div>
              </div>

              {/* 6-10. QUIZ / ASSESSMENT FORMAT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    6-10. QUIZ / ASSESSMENT FORMAT
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-gray-700 mb-2 text-xs sm:text-sm">
                    Assessment Block Format:
                  </p>
                  <code className="block bg-gray-900 text-green-400 p-2 sm:p-3 rounded-md font-mono text-xs sm:text-sm mb-3 overflow-x-auto">
                    Assessment (5 MCQs)
                  </code>
                  <div className="space-y-1 mb-3">
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm overflow-x-auto">
                      1.1.2.Q1 Which vessel carries blood from the RV to lungs?
                    </code>
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm ml-2 sm:ml-4 overflow-x-auto">
                      1.1.2.Q1.O1 A. Aorta
                    </code>
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm ml-2 sm:ml-4 overflow-x-auto">
                      1.1.2.Q1.O2 B. Pulmonary artery
                    </code>
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm ml-2 sm:ml-4 overflow-x-auto">
                      1.1.2.Q1.O3 C. Pulmonary vein
                    </code>
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm ml-2 sm:ml-4 overflow-x-auto">
                      1.1.2.Q1.O4 D. Superior vena cava
                    </code>
                    <code className="block bg-gray-100 p-2 rounded-md font-mono text-xs sm:text-sm overflow-x-auto">
                      1.1.2.Q1.A Correct Answer: B
                    </code>
                  </div>
                  <div className="bg-purple-50 p-2 sm:p-3 rounded border-l-4 border-purple-500 text-xs sm:text-sm">
                    <p className="font-semibold text-purple-800">Quiz Rules:</p>
                    <ul className="list-disc list-inside text-purple-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                      <li>Use exact Q numbering</li>
                      <li>Use exact O numbering (O1, O2, O3, O4)</li>
                      <li>Use exact A format</li>
                      <li>One correct answer only</li>
                      <li>Question code MUST match topic code</li>
                      <li>
                        Recommended: <strong>Correct Answer: B</strong>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-3 bg-gray-50 p-2 rounded text-xs">
                    <p className="font-semibold">Supported Answer Formats:</p>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>
                        <code>1.1.2.Q1.A Correct Answer: B</code>
                      </li>
                      <li>
                        <code>1.1.2.Q1.A Answer: B</code>
                      </li>
                      <li>
                        <code>1.1.2.Q1.A B</code>
                      </li>
                    </ul>
                    <p className="font-semibold mt-2">
                      Supported Option Formats:
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>
                        <code>A. Option</code> (Recommended)
                      </li>
                      <li>
                        <code>A) Option</code>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 11. HTML SUPPORT */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    11. HTML SUPPORT
                  </h3>
                </div>
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
                      "<table>",
                      "<tr>",
                      "<td>",
                      "<img>",
                      "<hr>",
                      "<div>",
                    ].map((tag) => (
                      <code
                        key={tag}
                        className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs"
                      >
                        {tag}
                      </code>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Images, Tables, UL/OL lists, Bullet points, Bold/Strong
                    text, Paragraphs, Divs, HR lines, Inline formatting
                  </p>
                  <div className="mt-2 bg-gray-50 p-2 rounded text-xs">
                    <p className="font-semibold">Image Format:</p>
                    <code className="block text-gray-700 mt-1">
                      {'<img src="image-url" />'}
                    </code>
                    <p className="font-semibold mt-2">Table Format (Good):</p>
                    <code className="block text-gray-700 mt-1 whitespace-pre-wrap">{`<table><tr><td>Column</td></tr></table>`}</code>
                  </div>
                </div>
              </div>

              {/* 12-14. DO NOT USE */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    12-14. DO NOT USE & GUIDELINES
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <ul className="list-disc list-inside text-red-600 space-y-1 text-xs sm:text-sm ml-2 sm:ml-4">
                    <li>Paste screenshots of text</li>
                    <li>Use Canva exported text blocks</li>
                    <li>Use malformed tables</li>
                    <li>Break numbering hierarchy</li>
                    <li>Use random heading names without codes</li>
                    <li>Put assessment outside topic flow</li>
                    <li>Use manual bullets without formatting consistency</li>
                    <li>Broken copied tables from PDFs</li>
                    <li>Screenshot tables</li>
                    <li>Nested malformed tables</li>
                    <li>
                      Place images randomly (keep inside proper topic content)
                    </li>
                  </ul>
                </div>
              </div>

              {/* 15-16. CONTENT WRITING RULES */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    15-16. CONTENT WRITING RULES & RECOMMENDED FLOW
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500">
                      <p className="font-semibold text-green-800 text-xs sm:text-sm">
                        DO ✓
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-green-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                        <li>Maintain exact numbering</li>
                        <li>Maintain exact hierarchy</li>
                        <li>Keep formatting clean</li>
                        <li>Keep topic codes accurate</li>
                        <li>Keep assessments inside correct topic</li>
                        <li>Keep heading codes matched properly</li>
                        <li>Keep MCQs structured</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500">
                      <p className="font-semibold text-red-800 text-xs sm:text-sm">
                        DO NOT ✗
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                        <li>Change numbering midway</li>
                        <li>Skip topic codes</li>
                        <li>Mix multiple topics together</li>
                        <li>Put random headings</li>
                        <li>Break hierarchy structure</li>
                        <li>Use duplicate question codes</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-800 text-xs sm:text-sm">
                      Recommended Topic Structure Flow:
                    </p>
                    <div className="mt-2 text-xs space-y-1">
                      <code className="block">
                        Topic → H1 Learning Objective → C1 Content
                      </code>
                      <code className="block">
                        → H2 Definition → C2 Content
                      </code>
                      <code className="block">
                        → H3 Explanation → C3 Content
                      </code>
                      <code className="block">
                        → H4 Clinical Importance → C4 Content
                      </code>
                      <code className="block">→ H5 Summary → C5 Content</code>
                      <code className="block">→ Assessment (5 MCQs)</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* 17. COMPLETE EXAMPLE */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    17. COMPLETE EXAMPLE
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md font-mono text-[10px] sm:text-xs overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{`Module 1: Cardiac Anatomy and Physiology

Chapter 1.1: Heart Structure

Topic 1.1.1: Four Chambers of the Heart

1.1.1.H1 Learning Objective

1.1.1.C1
By the end of this topic learners will be able to understand heart chambers.

1.1.1.H2 Definition

1.1.1.C2
The heart contains four chambers: right atrium, right ventricle, left atrium, and left ventricle.

1.1.1.H3 Explanation

1.1.1.C3
The right atrium receives deoxygenated blood from the body.
The right ventricle pumps blood to the lungs.
The left atrium receives oxygenated blood from the lungs.
The left ventricle pumps blood to the entire body.

Assessment (5 MCQs)

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
              </div>

              {/* 18-19. FINAL IMPORTANT NOTES */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    18-19. FINAL IMPORTANT NOTES & STRICT RULES
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="bg-red-50 p-3 sm:p-4 rounded border-2 border-red-300 mb-4">
                    <p className="font-bold text-red-800 text-sm sm:text-base mb-2">
                      ⚠️ The LMS bulk import system is STRUCTURE-SENSITIVE!
                    </p>
                    <p className="text-xs sm:text-sm text-red-700">
                      Even small formatting mistakes can:
                    </p>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-4 mt-1 space-y-0.5">
                      <li>break parsing</li>
                      <li>skip content</li>
                      <li>merge topics incorrectly</li>
                      <li>lose assessments</li>
                      <li>attach quiz to wrong topic</li>
                      <li>break hierarchy</li>
                      <li>miss answers/options</li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-green-50 p-2 sm:p-3 rounded border-l-4 border-green-500">
                      <p className="font-semibold text-green-800 text-xs sm:text-sm">
                        ALWAYS:
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-green-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                        <li>Follow exact numbering</li>
                        <li>Follow exact hierarchy</li>
                        <li>Keep consistent formatting</li>
                        <li>Keep assessments structured</li>
                        <li>Keep heading/content linked properly</li>
                        <li>Verify topic codes before submission</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-500">
                      <p className="font-semibold text-red-800 text-xs sm:text-sm">
                        NEVER:
                      </p>
                      <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 ml-2 sm:ml-4 mt-1 space-y-0.5">
                        <li>Change numbering manually midway</li>
                        <li>Use inconsistent codes</li>
                        <li>Use random formatting</li>
                        <li>Mix chapter/topic structures</li>
                        <li>Put plain MCQs without identifiers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 20. PRE-SUBMISSION CHECKLIST */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-3 sm:px-4 py-2 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    20. PRE-SUBMISSION CHECKLIST
                  </h3>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                    {[
                      "Module numbering verified",
                      "Chapter numbering verified",
                      "Topic numbering verified",
                      "Heading codes verified",
                      "Content codes verified",
                      "All assessments inside correct topics",
                      "All answers present",
                      "All options present",
                      "No duplicate question IDs",
                      "HTML formatting clean",
                      "No malformed tables",
                      "Images properly placed",
                      "Final proofreading completed",
                      "Minimum 100 words requirement met",
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
              </div>
            </div>
          </div>

          {/* Modal Footer - Sticky */}
          <div className="bg-white px-3 sm:px-6 py-3 border-t border-gray-200 flex justify-end rounded-b-lg sticky bottom-0 flex-shrink-0">
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

export default Guidline;
