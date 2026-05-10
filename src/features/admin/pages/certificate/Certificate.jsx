import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPrint,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaAward,
  FaMedal,
  FaGraduationCap,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaChartLine,
  FaQuestionCircle,
  FaStar,
  FaTrophy,
  FaRegClock,
  FaRegCheckCircle,
  FaDownload,
} from "react-icons/fa";
import { MdVerified, MdOutlineEmojiEvents } from "react-icons/md";
import { GiLaurelCrown, GiQuillInk } from "react-icons/gi";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../common/layout";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import { useTranslation } from "react-i18next";
import { getCertificateById } from "../../../../redux/slice/reportSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const certificateRef = useRef();
  const {
    currentCertificate: certificate,
    loadingCertificate,
    isError,
    message,
  } = useSelector((state) => state.report);

  useEffect(() => {
    if (id) {
      dispatch(getCertificateById(id));
    }
  }, [dispatch, id]);

  const handleDownload = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          // Inject hex color overrides to replace oklch
          const style = clonedDoc.createElement("style");
          style.innerHTML = `
          * {
            --tw-ring-color: #10b981 !important;
            --tw-shadow-color: rgba(0,0,0,0.1) !important;
          }

          /* Force all oklch-based colors to hex equivalents */
          .text-emerald-800, .text-emerald-900 { color: #065f46 !important; }
          .text-emerald-700 { color: #047857 !important; }
          .text-emerald-600 { color: #059669 !important; }
          .text-emerald-500 { color: #10b981 !important; }
          .text-emerald-400 { color: #34d399 !important; }

          .bg-emerald-700 { background-color: #047857 !important; }
          .bg-emerald-600 { background-color: #059669 !important; }
          .bg-emerald-500 { background-color: #10b981 !important; }
          .bg-emerald-200 { background-color: #a7f3d0 !important; }
          .bg-emerald-50  { background-color: #ecfdf5 !important; }

          .border-emerald-700 { border-color: #047857 !important; }
          .border-emerald-600 { border-color: #059669 !important; }
          .border-emerald-500 { border-color: #10b981 !important; }
          .border-emerald-300 { border-color: #6ee7b7 !important; }
          .border-emerald-200 { border-color: #a7f3d0 !important; }

          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-400 { color: #9ca3af !important; }

          .text-green-700 { color: #15803d !important; }
          .bg-green-600  { background-color: #16a34a !important; }

          .bg-blue-700  { background-color: #1d4ed8 !important; }
          .bg-blue-800  { background-color: #1e40af !important; }
          .bg-blue-900  { background-color: #1e3a8a !important; }

          .bg-white { background-color: #ffffff !important; }
          .text-white { color: #ffffff !important; }

          /* Gradient fallback */
          .bg-gradient-to-br {
            background: #ecfdf5 !important;
          }
        `;
          clonedDoc.head.appendChild(style);
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(
        pdfWidth / canvas.width,
        pdfHeight / canvas.height,
      );
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
      pdf.save(`${certificate_id || "certificate"}.pdf`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loadingCertificate) return <Loader />;
  if (isError) return <Error message={message} />;

  const { data } = certificate || {};
  const { design, meta, share_links, certificate_id, issued_at, content } =
    data || {};

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle className="flex items-center gap-2">
            {t("certificate.pageTitle")}
          </PageTitle>
          <PageSubtitle>{certificate_id}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-accent rounded-md hover:opacity-90 cursor-pointer shadow-md"
          >
            <FaDownload /> {t("certificate.downloadButton")}
          </button>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="flex justify-center items-center py-12 bg-gradient-to-br from-emerald-50 via-white to-teal-50 print:bg-white">
          {/* Classic Professional Certificate */}
          <div
            ref={certificateRef}
            className="w-full max-w-5xl bg-white shadow-2xl print:shadow-none relative overflow-hidden"
          >
            {/* Premium Border */}
            <div className="absolute inset-4 border-2 border-emerald-700 pointer-events-none"></div>
            <div className="absolute inset-6 border border-emerald-500 pointer-events-none"></div>
            <div className="absolute inset-7 border border-emerald-300 pointer-events-none"></div>

            {/* Corner Decorations */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-emerald-700"></div>
            <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-emerald-700"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-emerald-700"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-emerald-700"></div>

            {/* Decorative Icons at Corners */}
            <div className="absolute top-12 left-12 text-emerald-600 opacity-50">
              <GiLaurelCrown size={24} />
            </div>
            <div className="absolute top-12 right-12 text-emerald-600 opacity-50">
              <GiLaurelCrown size={24} />
            </div>
            <div className="absolute bottom-12 left-12 text-emerald-600 opacity-50">
              <GiQuillInk size={24} />
            </div>
            <div className="absolute bottom-12 right-12 text-emerald-600 opacity-50">
              <GiQuillInk size={24} />
            </div>

            {/* Main Content */}
            <div className="p-16 print:p-12 relative z-10">
              {/* Company Logo */}
              {design?.company_logo && (
                <div className="flex justify-center mb-6">
                  <img
                    src={design.company_logo}
                    alt={design.company_name}
                    className="h-20 object-contain"
                  />
                </div>
              )}

              {/* Company Name */}
              {design?.company_name && (
                <div className="text-center mb-2">
                  <h1 className="text-4xl font-serif font-bold text-emerald-800 tracking-wide">
                    {design.company_name}
                  </h1>
                </div>
              )}

              {/* Tagline */}
              {design?.tagline && (
                <div className="text-center mb-4">
                  <p className="text-sm text-emerald-600 italic tracking-wide">
                    {design.tagline}
                  </p>
                </div>
              )}

              {/* Decorative Line */}
              <div className="flex justify-center items-center gap-3 my-6">
                <div className="h-px w-20 bg-emerald-500"></div>
                <FaStar className="text-emerald-500 text-sm" />
                <div className="h-px w-20 bg-emerald-500"></div>
              </div>

              {/* Heading */}
              {design?.heading && (
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif text-emerald-700 uppercase tracking-wider">
                    {design.heading}
                  </h2>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <FaMedal className="text-emerald-600" />
                    <p className="text-sm text-emerald-600">
                      {t("certificate.ofAchievement")}
                    </p>
                    <FaMedal className="text-emerald-600" />
                  </div>
                </div>
              )}

              {/* Certificate Message */}
              <div className="text-center my-8">
                <p className="text-gray-600 text-lg">
                  {t("certificate.presentedTo")}
                </p>
                <div className="my-6">
                  <div className="inline-block border-b-4 border-emerald-600 px-16 pb-3">
                    <p className="text-5xl font-serif font-bold text-emerald-900 tracking-wide">
                      {meta?.user?.name || t("certificate.recipientName")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaIdCard className="text-emerald-600" />
                    {t("certificate.employeeId")}:{" "}
                    {meta?.user?.employee_id || "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEnvelope className="text-emerald-600" />
                    {meta?.user?.email || "-"}
                  </span>
                </div>
              </div>

              {/* Main Content - EXACTLY as from API */}
              {content && (
                <div className="my-10">
                  <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                      textAlign: "center",
                    }}
                  />
                </div>
              )}

              {/* PROFESSIONAL CLASSIC METRICS CARDS - Redesigned */}
              <div className="my-12">
                {/* Classic Three-Column Layout with Elegant Borders */}
                <div className="grid grid-cols-3 gap-8 border-t border-b border-emerald-200 py-8">
                  {/* Score Card - Classic Style */}
                  <div className="text-center relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3">
                      <FaChartLine className="text-emerald-600 text-xl" />
                    </div>
                    <div className="pt-4">
                      <div className="text-4xl font-serif font-bold text-emerald-800 mb-1">
                        {meta?.result?.percentage || 0}%
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t("certificate.achievementScore")}
                      </div>
                      <div className="text-sm text-gray-600">
                        {meta?.result?.score || 0} /{" "}
                        {meta?.questions?.total || 0}{" "}
                        {t("certificate.questions")}
                      </div>
                      <div className="w-12 h-px bg-emerald-300 mx-auto mt-3"></div>
                    </div>
                  </div>

                  {/* Status Card - Classic Style */}
                  <div className="text-center relative border-x border-emerald-200">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3">
                      {meta?.result?.status === "passed" ? (
                        <FaRegCheckCircle className="text-emerald-600 text-xl" />
                      ) : (
                        <FaAward className="text-emerald-600 text-xl" />
                      )}
                    </div>
                    <div className="pt-4 px-6">
                      <div className="text-3xl font-serif font-bold text-emerald-800 capitalize mb-1">
                        {meta?.result?.status === "passed"
                          ? t("certificate.passed")
                          : t("certificate.completed")}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t("certificate.finalStatus")}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("certificate.passingScore")}:{" "}
                        {meta?.result?.passing_score || 0}%
                      </div>
                      <div className="w-12 h-px bg-emerald-300 mx-auto mt-3"></div>
                    </div>
                  </div>

                  {/* Time Card - Classic Style */}
                  <div className="text-center relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3">
                      <FaRegClock className="text-emerald-600 text-xl" />
                    </div>
                    <div className="pt-4">
                      <div className="text-4xl font-serif font-bold text-emerald-800 mb-1">
                        {Math.floor((meta?.time?.time_taken_seconds || 0) / 60)}
                        :
                        {String(
                          Math.floor(
                            (meta?.time?.time_taken_seconds || 0) % 60,
                          ),
                        ).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        {t("certificate.timeTaken")}
                      </div>
                      <div className="text-sm text-gray-600">
                        {t("certificate.attempt")} #
                        {meta?.attempt?.attempt_id || 1}
                      </div>
                      <div className="w-12 h-px bg-emerald-300 mx-auto mt-3"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information - Classic Professional Grid */}
              <div className="my-10">
                <div className="border border-emerald-200 ">
                  {/* Header */}
                  <div className=" px-6 py-3 border-b border-emerald-200">
                    <h3 className="text-sm font-serif font-semibold text-emerald-800 uppercase tracking-wider">
                      {t("certificate.assessmentDetails")}
                    </h3>
                  </div>

                  {/* Content Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex items-start gap-3">
                        <div className="min-w-[32px]">
                          <FaCalendarAlt className="text-emerald-600 text-sm mt-0.5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {t("certificate.assessmentDate")}
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            {meta?.time?.submitted_at
                              ? new Date(
                                  meta.time.submitted_at,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "-"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="min-w-[32px]">
                          <FaQuestionCircle className="text-emerald-600 text-sm mt-0.5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {t("certificate.questionsAttempted")}
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            {meta?.questions?.attempted || 0} /{" "}
                            {meta?.questions?.total || 0}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="min-w-[32px]">
                          <FaTrophy className="text-emerald-600 text-sm mt-0.5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {t("certificate.correctAnswers")}
                          </div>
                          <div className="text-sm font-medium text-green-700">
                            {meta?.questions?.correct || 0}{" "}
                            {t("certificate.correct")}
                            {meta?.questions?.total && (
                              <span className="text-gray-500">
                                {" "}
                                (
                                {Math.round(
                                  (meta.questions.correct /
                                    meta.questions.total) *
                                    100,
                                )}
                                %)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="min-w-[32px]">
                          <FaGraduationCap className="text-emerald-600 text-sm mt-0.5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {t("certificate.courseType")}
                          </div>
                          <div className="text-sm font-medium text-gray-800 capitalize">
                            {meta?.context?.type || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mt-10 pt-6">
                {/* Left Column - Signature */}
                <div className="text-center">
                  {design?.signer_signature && (
                    <img
                      src={design.signer_signature}
                      alt={t("certificate.signature")}
                      className="h-16 mx-auto mb-3 object-contain"
                    />
                  )}
                  <div className="border-b-2 border-emerald-600 w-56 mx-auto"></div>
                  <p className="text-base font-serif font-semibold text-gray-800 mt-4">
                    {design?.signer_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {design?.signer_designation ||
                      t("certificate.authorizedSignatory")}
                  </p>
                </div>

                {/* Right Column - Date of Issue (Perfectly aligned with signature) */}
                <div className="text-center flex flex-col justify-end">
                  <div className="border-b-2 border-emerald-600 w-56 mx-auto"></div>
                  <p className="text-base font-serif font-semibold text-gray-800 mt-4">
                    {issued_at
                      ? new Date(issued_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("certificate.dateOfIssue")}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-12 pt-6 border-t border-gray-200">
                <p className="text-sm font-mono text-emerald-700">
                  {t("certificate.certificateId")}: {certificate_id}
                </p>
                {design?.footer_text && (
                  <p className="text-xs text-gray-500 mt-2">
                    {design.footer_text}
                  </p>
                )}
                <div className="flex justify-center items-center gap-1 mt-3 text-xs text-gray-400">
                  <MdVerified size={14} />
                  <span>{t("certificate.digitallyVerified")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Share Buttons */}
        {share_links && (
          <div className="flex justify-center gap-4 mt-8 pb-10 print:hidden">
            {share_links.whatsapp && (
              <button
                onClick={() => window.open(share_links.whatsapp, "_blank")}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                <FaWhatsapp /> {t("certificate.whatsapp")}
              </button>
            )}
            {share_links.facebook && (
              <button
                onClick={() => window.open(share_links.facebook, "_blank")}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition-colors duration-200 shadow-md"
              >
                <FaFacebook /> {t("certificate.facebook")}
              </button>
            )}
            {share_links.linkedin && (
              <button
                onClick={() => window.open(share_links.linkedin, "_blank")}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-900 transition-colors duration-200 shadow-md"
              >
                <FaLinkedin /> {t("certificate.linkedin")}
              </button>
            )}
          </div>
        )}
      </PageBody>
    </PageLayout>
  );
};

export default Certificate;
