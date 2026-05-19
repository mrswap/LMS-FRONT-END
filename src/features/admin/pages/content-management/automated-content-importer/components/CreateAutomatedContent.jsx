// import { useState, useEffect } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { SelectField } from "../../../../common/form";
// import {
//   AiOutlineExclamationCircle,
//   AiOutlineQuestionCircle,
//   AiOutlineClose,
//   AiOutlineCheckCircle,
//   AiOutlineWarning,
//   AiOutlineInfoCircle,
// } from "react-icons/ai";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../common/layout";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useNavigate } from "react-router-dom";
// import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
// import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
// import CustomEditor from "../../../../common/CustomEditor";
// import { createAutomatedImport } from "../../../../../../redux/slice/automatedContentSlicer";
// import Guidline from "./Guidline";

// const CreateAutomatedContent = () => {
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();

//   const { programs } = useSelector((state) => state.program);
//   const { levels, isLoading: isLevelLoading } = useSelector(
//     (state) => state.level,
//   );

//   const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
//   const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
//   const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [filteredLevels, setFilteredLevels] = useState([]);
//   const [htmlContent, setHtmlContent] = useState("");

//   useEffect(() => {
//     const loadPrograms = async () => {
//       await dispatch(getAllPrograms());
//       setIsProgramsLoaded(true);
//     };
//     loadPrograms();
//   }, [dispatch]);

//   useEffect(() => {
//     if (isProgramsLoaded && selectedProgram) {
//       const loadLevels = async () => {
//         await dispatch(getAllLevels());
//         setIsLevelsLoaded(true);
//       };
//       loadLevels();
//     }
//   }, [selectedProgram, isProgramsLoaded, dispatch]);

//   useEffect(() => {
//     if (selectedProgram && levels?.data && isLevelsLoaded) {
//       const programLevels = levels.data.filter((level) => {
//         return (
//           level.program_id === selectedProgram.value ||
//           level.programId === selectedProgram.value ||
//           level.program?.id === selectedProgram.value
//         );
//       });
//       setFilteredLevels(programLevels);
//     } else {
//       setFilteredLevels([]);
//     }
//   }, [selectedProgram, levels, isLevelsLoaded]);

//   const programOptions =
//     programs?.data?.map((prog) => ({
//       label: prog.title,
//       value: prog.id,
//     })) || [];

//   const levelOptions =
//     filteredLevels.map((lev) => ({
//       label: lev.title,
//       value: lev.id,
//     })) || [];

//   const validationSchema = Yup.object({
//     programName: Yup.object().nullable().required("Program is required"),
//     levelName: Yup.object().nullable().required("Level is required"),
//     htmlContent: Yup.string()
//       .required("Content is required")
//       .test(
//         "min-words",
//         "Content must be at least 100 words. Click the (?) icon to view formatting guidelines.",
//         (value) => {
//           if (!value) return false;
//           const textWithoutHtml = value.replace(/<[^>]*>/g, "");
//           const words = textWithoutHtml
//             .trim()
//             .split(/\s+/)
//             .filter((word) => word.length > 0);
//           return words.length >= 100;
//         },
//       ),
//   });

//   const initialValues = {
//     programName: null,
//     levelName: null,
//     htmlContent: "",
//   };

//   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
//     try {
//       const payload = {
//         program_id: values.programName.value,
//         level_id: values.levelName.value,
//         html: values.htmlContent,
//       };

//       const res = await dispatch(createAutomatedImport(payload)).unwrap();

//       toast.success(res.message || "Content created successfully");

//       resetForm();
//       setSelectedProgram(null);
//       setFilteredLevels([]);
//       setHtmlContent("");
//       setIsLevelsLoaded(false);
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || "Error creating content");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getWordCount = (content) => {
//     if (!content) return 0;
//     const textWithoutHtml = content.replace(/<[^>]*>/g, "");
//     return textWithoutHtml
//       .trim()
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;
//   };

//   // Fully Responsive Guidelines Modal with Complete 20 Rules
//   const GuidelinesModal = () => (
//     <>
//       {showGuidelinesModal && (
//         <Guidline
//           open={showGuidelinesModal}
//           onClose={() => setShowGuidelinesModal(false)}
//         />
//       )}
//     </>
//   );

//   return (
//     <>
//       <PageLayout>
//         <div className="p-4 sm:p-6 md:p-8 rounded-lg border border-gray-300 relative">
//           <PageHeader>
//             <PageHeaderLeft>
//               <PageTitle>LMS Content Generator</PageTitle>
//               <PageSubtitle>
//                 Create structure-sensitive content for bulk import | Minimum 100
//                 words required
//               </PageSubtitle>
//             </PageHeaderLeft>
//           </PageHeader>

//           <PageBody className="mt-4">
//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={onSubmit}
//               enableReinitialize={true}
//             >
//               {({
//                 isSubmitting,
//                 values,
//                 setFieldValue,
//                 handleSubmit,
//                 errors,
//                 touched,
//               }) => {
//                 const handleContentChange = (content) => {
//                   setFieldValue("htmlContent", content);
//                   setHtmlContent(content);
//                 };

//                 const wordCount = getWordCount(values.htmlContent);

//                 return (
//                   <Form
//                     onSubmit={handleSubmit}
//                     className="space-y-6 sm:space-y-8"
//                   >
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
//                         <AiOutlineExclamationCircle className="text-primary text-base sm:text-lg" />
//                         General Details
//                         <button
//                           type="button"
//                           onClick={() => setShowGuidelinesModal(true)}
//                           className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
//                         >
//                           <AiOutlineQuestionCircle className="text-base sm:text-lg" />
//                         </button>
//                       </h3>

//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                           <div>
//                             <SelectField
//                               name="programName"
//                               label="Parent Program"
//                               placeholder="Select program..."
//                               required={true}
//                               options={programOptions || []}
//                               onChange={(option) => {
//                                 setFieldValue("programName", option);
//                                 setFieldValue("levelName", null);
//                                 setSelectedProgram(option);
//                                 setIsLevelsLoaded(false);
//                               }}
//                             />
//                           </div>

//                           <div>
//                             <SelectField
//                               name="levelName"
//                               label="Parent Level"
//                               placeholder="Select level..."
//                               required={true}
//                               options={levelOptions || []}
//                               disabled={!values.programName}
//                               isLoading={isLevelLoading}
//                               onChange={(option) => {
//                                 setFieldValue("levelName", option);
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
//                         <AiOutlineExclamationCircle className="text-primary text-base sm:text-lg" />
//                         Content Section
//                         <button
//                           type="button"
//                           onClick={() => setShowGuidelinesModal(true)}
//                           className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
//                         >
//                           <AiOutlineQuestionCircle className="text-base sm:text-lg" />
//                         </button>
//                         <span className="text-xs text-gray-400 ml-1">
//                           (Click ? for guidelines)
//                         </span>
//                       </h3>

//                       <div className="mb-2">
//                         <CustomEditor
//                           value={htmlContent}
//                           onChange={handleContentChange}
//                           placeholder={`Example:
// Module 1: Cardiac Anatomy

// Chapter 1.1: Heart Structure

// Topic 1.1.1: Four Chambers

// 1.1.1.H1 Learning Objective
// 1.1.1.C1 Your content here...`}
//                         />
//                       </div>

//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
//                         <div>
//                           {errors.htmlContent && touched.htmlContent && (
//                             <div className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
//                               <AiOutlineExclamationCircle className="text-red-500" />
//                               {errors.htmlContent}
//                             </div>
//                           )}
//                           {values.htmlContent &&
//                             !errors.htmlContent &&
//                             wordCount >= 100 && (
//                               <div className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
//                                 <AiOutlineCheckCircle className="text-green-600" />
//                                 Content meets requirement ({wordCount}/100
//                                 words)
//                               </div>
//                             )}
//                           {values.htmlContent && wordCount < 100 && (
//                             <div className="text-orange-500 text-xs sm:text-sm flex items-center gap-1">
//                               <AiOutlineWarning className="text-orange-500" />
//                               {wordCount}/100 words - Need {100 - wordCount}{" "}
//                               more words
//                             </div>
//                           )}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => setShowGuidelinesModal(true)}
//                           className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
//                         >
//                           <AiOutlineQuestionCircle className="text-sm" /> View
//                           Complete Formatting Guidelines
//                         </button>
//                       </div>
//                     </div>

//                     <div className="flex justify-end items-center pt-4">
//                       <div className="flex gap-3">
//                         <button
//                           type="submit"
//                           disabled={
//                             isSubmitting ||
//                             !values.levelName ||
//                             !values.htmlContent ||
//                             wordCount < 100
//                           }
//                           className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                         >
//                           {isSubmitting ? "Creating..." : "Create Content"}
//                         </button>
//                       </div>
//                     </div>
//                   </Form>
//                 );
//               }}
//             </Formik>
//           </PageBody>
//         </div>
//       </PageLayout>

//       {/* Floating Help Button - Responsive */}
//       <button
//         onClick={() => setShowGuidelinesModal(true)}
//         className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-gray-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all hover:scale-105 z-40"
//       >
//         <AiOutlineQuestionCircle className="text-xl sm:text-2xl" />
//       </button>

//       <GuidelinesModal />
//     </>
//   );
// };

// export default CreateAutomatedContent;

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import CustomEditor from "../../../../common/CustomEditor";
import { createAutomatedImport } from "../../../../../../redux/slice/automatedContentSlicer";
import Guidline from "./Guidline";
import { useTranslation } from "react-i18next";

const CreateAutomatedContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { programs } = useSelector((state) => state.program);
  const { levels, isLoading: isLevelLoading } = useSelector(
    (state) => state.level,
  );

  const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      await dispatch(getAllPrograms());
      setIsProgramsLoaded(true);
    };
    loadPrograms();
  }, [dispatch]);

  useEffect(() => {
    if (isProgramsLoaded && selectedProgram) {
      const loadLevels = async () => {
        await dispatch(getAllLevels());
        setIsLevelsLoaded(true);
      };
      loadLevels();
    }
  }, [selectedProgram, isProgramsLoaded, dispatch]);

  useEffect(() => {
    if (selectedProgram && levels?.data && isLevelsLoaded) {
      const programLevels = levels.data.filter((level) => {
        return (
          level.program_id === selectedProgram.value ||
          level.programId === selectedProgram.value ||
          level.program?.id === selectedProgram.value
        );
      });
      setFilteredLevels(programLevels);
    } else {
      setFilteredLevels([]);
    }
  }, [selectedProgram, levels, isLevelsLoaded]);

  const programOptions =
    programs?.data?.map((prog) => ({
      label: prog.title,
      value: prog.id,
    })) || [];

  const levelOptions =
    filteredLevels.map((lev) => ({
      label: lev.title,
      value: lev.id,
    })) || [];

  const validationSchema = Yup.object({
    programName: Yup.object()
      .nullable()
      .required(t("automatedImporter.validation.programRequired")),
    levelName: Yup.object()
      .nullable()
      .required(t("automatedImporter.validation.levelRequired")),
    htmlContent: Yup.string()
      .required(t("automatedImporter.validation.contentRequired"))
      .test(
        "min-words",
        t("automatedImporter.validation.minWords"),
        (value) => {
          if (!value) return false;
          const textWithoutHtml = value.replace(/<[^>]*>/g, "");
          const words = textWithoutHtml
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
          return words.length >= 100;
        },
      ),
  });

  const initialValues = {
    programName: null,
    levelName: null,
    htmlContent: "",
  };

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const payload = {
        program_id: values.programName.value,
        level_id: values.levelName.value,
        html: values.htmlContent,
      };

      const res = await dispatch(createAutomatedImport(payload)).unwrap();

      toast.success(res.message || t("automatedImporter.success.create"));

      resetForm();
      setSelectedProgram(null);
      setFilteredLevels([]);
      setHtmlContent("");
      setIsLevelsLoaded(false);
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("automatedImporter.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  const getWordCount = (content) => {
    if (!content) return 0;
    const textWithoutHtml = content.replace(/<[^>]*>/g, "");
    return textWithoutHtml
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const GuidelinesModal = () => (
    <>
      {showGuidelinesModal && (
        <Guidline
          open={showGuidelinesModal}
          onClose={() => setShowGuidelinesModal(false)}
          t={t}
        />
      )}
    </>
  );

  return (
    <>
      <PageLayout>
        <div className="p-4 sm:p-6 md:p-8 rounded-lg border border-gray-300 relative">
          <PageHeader>
            <PageHeaderLeft>
              <PageTitle>{t("automatedImporter.create.title")}</PageTitle>
              <PageSubtitle>
                {t("automatedImporter.create.subtitle")}
              </PageSubtitle>
            </PageHeaderLeft>
          </PageHeader>

          <PageBody className="mt-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {({
                isSubmitting,
                values,
                setFieldValue,
                handleSubmit,
                errors,
                touched,
              }) => {
                const handleContentChange = (content) => {
                  setFieldValue("htmlContent", content);
                  setHtmlContent(content);
                };

                const wordCount = getWordCount(values.htmlContent);

                return (
                  <Form
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                        <AiOutlineExclamationCircle className="text-primary text-base sm:text-lg" />
                        {t("automatedImporter.create.generalDetails")}
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <AiOutlineQuestionCircle className="text-base sm:text-lg" />
                        </button>
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <SelectField
                              name="programName"
                              label={t(
                                "automatedImporter.create.parentProgram",
                              )}
                              placeholder={t(
                                "automatedImporter.create.selectProgram",
                              )}
                              required={true}
                              options={programOptions || []}
                              onChange={(option) => {
                                setFieldValue("programName", option);
                                setFieldValue("levelName", null);
                                setSelectedProgram(option);
                                setIsLevelsLoaded(false);
                              }}
                            />
                          </div>

                          <div>
                            <SelectField
                              name="levelName"
                              label={t("automatedImporter.create.parentLevel")}
                              placeholder={t(
                                "automatedImporter.create.selectLevel",
                              )}
                              required={true}
                              options={levelOptions || []}
                              disabled={!values.programName}
                              isLoading={isLevelLoading}
                              onChange={(option) => {
                                setFieldValue("levelName", option);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                        <AiOutlineExclamationCircle className="text-primary text-base sm:text-lg" />
                        {t("automatedImporter.create.contentSection")}
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <AiOutlineQuestionCircle className="text-base sm:text-lg" />
                        </button>
                        <span className="text-xs text-gray-400 ml-1">
                          ({t("automatedImporter.create.clickForGuidelines")})
                        </span>
                      </h3>

                      <div className="mb-2">
                        <CustomEditor
                          value={htmlContent}
                          onChange={handleContentChange}
                          placeholder={t(
                            "automatedImporter.create.editorPlaceholder",
                          )}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                        <div>
                          {errors.htmlContent && touched.htmlContent && (
                            <div className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                              <AiOutlineExclamationCircle className="text-red-500" />
                              {errors.htmlContent}
                            </div>
                          )}
                          {values.htmlContent &&
                            !errors.htmlContent &&
                            wordCount >= 100 && (
                              <div className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
                                <AiOutlineCheckCircle className="text-green-600" />
                                {t(
                                  "automatedImporter.create.contentMeetsRequirement",
                                  { wordCount },
                                )}
                              </div>
                            )}
                          {values.htmlContent && wordCount < 100 && (
                            <div className="text-orange-500 text-xs sm:text-sm flex items-center gap-1">
                              <AiOutlineWarning className="text-orange-500" />
                              {t(
                                "automatedImporter.create.contentNeedsMoreWords",
                                { wordCount, remaining: 100 - wordCount },
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          <AiOutlineQuestionCircle className="text-sm" />{" "}
                          {t("automatedImporter.create.viewGuidelines")}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end items-center pt-4">
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            !values.levelName ||
                            !values.htmlContent ||
                            wordCount < 100
                          }
                          className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                        >
                          {isSubmitting
                            ? t("automatedImporter.actions.creating")
                            : t("automatedImporter.actions.createContent")}
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </PageBody>
        </div>
      </PageLayout>

      <button
        onClick={() => setShowGuidelinesModal(true)}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-gray-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all hover:scale-105 z-40"
      >
        <AiOutlineQuestionCircle className="text-xl sm:text-2xl" />
      </button>

      <GuidelinesModal />
    </>
  );
};

export default CreateAutomatedContent;
