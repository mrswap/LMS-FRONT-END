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
// import { getAllModules } from "../../../../../../redux/slice/moduleSlice"; // Import module slice
// import CustomEditor from "../../../../common/CustomEditor";
// import Guidline from "./Guidline";
// import usePermission from "../../../../../../hooks/usePermission";
// import { createAutomatedImport } from "../../../../../../redux/slice/automatedAssessmentSlicer";

// const CreateAutomatedAssessment = () => {
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { hasPermission } = usePermission();

//   const { programs } = useSelector((state) => state.program);
//   const { levels, isLoading: isLevelLoading } = useSelector(
//     (state) => state.level,
//   );
//   const { modules, isLoading: isModuleLoading } = useSelector(
//     (state) => state.module,
//   );

//   const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
//   const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
//   const [isModulesLoaded, setIsModulesLoaded] = useState(false);
//   const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [filteredLevels, setFilteredLevels] = useState([]);
//   const [filteredModules, setFilteredModules] = useState([]);
//   const [htmlContent, setHtmlContent] = useState("");

//   // Load programs on mount
//   useEffect(() => {
//     const loadPrograms = async () => {
//       await dispatch(getAllPrograms());
//       setIsProgramsLoaded(true);
//     };
//     loadPrograms();
//   }, [dispatch]);

//   // Load levels when program is selected
//   useEffect(() => {
//     if (isProgramsLoaded && selectedProgram) {
//       const loadLevels = async () => {
//         await dispatch(getAllLevels());
//         setIsLevelsLoaded(true);
//       };
//       loadLevels();
//     }
//   }, [selectedProgram, isProgramsLoaded, dispatch]);

//   // Load modules when level is selected
//   useEffect(() => {
//     if (isLevelsLoaded && selectedLevel) {
//       const loadModules = async () => {
//         await dispatch(getAllModules());
//         setIsModulesLoaded(true);
//       };
//       loadModules();
//     }
//   }, [selectedLevel, isLevelsLoaded, dispatch]);

//   // Filter levels based on selected program
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

//   // Filter modules based on selected level
//   useEffect(() => {
//     if (selectedLevel && modules?.data && isModulesLoaded) {
//       const levelModules = modules.data.filter((module) => {
//         return (
//           module.level_id === selectedLevel.value ||
//           module.levelId === selectedLevel.value ||
//           module.level?.id === selectedLevel.value
//         );
//       });
//       setFilteredModules(levelModules);
//     } else {
//       setFilteredModules([]);
//     }
//   }, [selectedLevel, modules, isModulesLoaded]);

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

//   const moduleOptions =
//     filteredModules.map((mod) => ({
//       label: mod.title,
//       value: mod.id,
//     })) || [];

//   const validationSchema = Yup.object({
//     programName: Yup.object().nullable().required("Program is required"),
//     levelName: Yup.object().nullable().required("Level is required"),
//     moduleName: Yup.object().nullable().required("Module is required"), // Add module validation
//     htmlContent: Yup.string()
//       .required("Content is required")
//       .test("min-words", "Content must have at least 100 words", (value) => {
//         if (!value) return false;
//         const textWithoutHtml = value.replace(/<[^>]*>/g, "");
//         const words = textWithoutHtml
//           .trim()
//           .split(/\s+/)
//           .filter((word) => word.length > 0);
//         return words.length >= 100;
//       }),
//   });

//   const initialValues = {
//     programName: null,
//     levelName: null,
//     moduleName: null, // Add module initial value
//     htmlContent: "",
//   };

//   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
//     try {
//       const payload = {
//         program_id: values.programName.value,
//         level_id: values.levelName.value,
//         module_id: values.moduleName.value, // Add module_id to payload
//         html: values.htmlContent,
//         type: "both",
//       };

//       const res = await dispatch(createAutomatedImport(payload)).unwrap();

//       toast.success(res.message || "Import created successfully");

//       resetForm();
//       setSelectedProgram(null);
//       setSelectedLevel(null);
//       setFilteredLevels([]);
//       setFilteredModules([]);
//       setHtmlContent("");
//       setIsLevelsLoaded(false);
//       setIsModulesLoaded(false);
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || "Failed to create import");
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

//   const GuidelinesModal = () => (
//     <>
//       {showGuidelinesModal && (
//         <Guidline
//           open={showGuidelinesModal}
//           onClose={() => setShowGuidelinesModal(false)}
//           t={(key) => key}
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
//               <PageTitle>Create Automated Assessment</PageTitle>
//               <PageSubtitle>
//                 Create content for automated assessment import
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
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                           {/* Program Field */}
//                           <div>
//                             <SelectField
//                               name="programName"
//                               label="Parent Program"
//                               placeholder="Select Program"
//                               required={true}
//                               options={programOptions || []}
//                               onChange={(option) => {
//                                 setFieldValue("programName", option);
//                                 setFieldValue("levelName", null);
//                                 setFieldValue("moduleName", null); // Reset module when program changes
//                                 setSelectedProgram(option);
//                                 setSelectedLevel(null);
//                                 setIsLevelsLoaded(false);
//                                 setIsModulesLoaded(false);
//                               }}
//                             />
//                           </div>

//                           {/* Level Field */}
//                           <div>
//                             <SelectField
//                               name="levelName"
//                               label="Parent Level"
//                               placeholder="Select Level"
//                               required={true}
//                               options={levelOptions || []}
//                               disabled={!values.programName}
//                               isLoading={isLevelLoading}
//                               onChange={(option) => {
//                                 setFieldValue("levelName", option);
//                                 setFieldValue("moduleName", null); // Reset module when level changes
//                                 setSelectedLevel(option);
//                                 setIsModulesLoaded(false);
//                               }}
//                             />
//                           </div>

//                           {/* Module Field - New */}
//                           <div>
//                             <SelectField
//                               name="moduleName"
//                               label="Parent Module"
//                               placeholder="Select Module"
//                               required={true}
//                               options={moduleOptions || []}
//                               disabled={!values.levelName}
//                               isLoading={isModuleLoading}
//                               onChange={(option) => {
//                                 setFieldValue("moduleName", option);
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
//                           (Click for guidelines)
//                         </span>
//                       </h3>

//                       <div className="mb-2">
//                         <CustomEditor
//                           value={htmlContent}
//                           onChange={handleContentChange}
//                           placeholder="Write your content here..."
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
//                                 Content meets requirement ({wordCount} words)
//                               </div>
//                             )}
//                           {values.htmlContent && wordCount < 100 && (
//                             <div className="text-orange-500 text-xs sm:text-sm flex items-center gap-1">
//                               <AiOutlineWarning className="text-orange-500" />
//                               Need {100 - wordCount} more words (currently{" "}
//                               {wordCount})
//                             </div>
//                           )}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => setShowGuidelinesModal(true)}
//                           className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
//                         >
//                           <AiOutlineQuestionCircle className="text-sm" /> View
//                           Guidelines
//                         </button>
//                       </div>
//                     </div>

//                     {hasPermission("imports.create") && (
//                       <div className="flex justify-end items-center pt-4">
//                         <div className="flex gap-3">
//                           <button
//                             type="submit"
//                             disabled={
//                               isSubmitting ||
//                               !values.programName ||
//                               !values.levelName ||
//                               !values.moduleName || // Add module validation
//                               !values.htmlContent ||
//                               wordCount < 100
//                             }
//                             className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                           >
//                             {isSubmitting ? "Creating..." : "Create Content"}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </Form>
//                 );
//               }}
//             </Formik>
//           </PageBody>
//         </div>
//       </PageLayout>

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

// export default CreateAutomatedAssessment;

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
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import CustomEditor from "../../../../common/CustomEditor";
import Guidline from "./Guidline";
import usePermission from "../../../../../../hooks/usePermission";
import { createAutomatedImport } from "../../../../../../redux/slice/automatedAssessmentSlicer";
import { useTranslation } from "react-i18next";

const CreateAutomatedAssessment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { programs } = useSelector((state) => state.program);
  const { levels, isLoading: isLevelLoading } = useSelector(
    (state) => state.level,
  );
  const { modules, isLoading: isModuleLoading } = useSelector(
    (state) => state.module,
  );

  const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
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
    if (isLevelsLoaded && selectedLevel) {
      const loadModules = async () => {
        await dispatch(getAllModules());
        setIsModulesLoaded(true);
      };
      loadModules();
    }
  }, [selectedLevel, isLevelsLoaded, dispatch]);

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

  useEffect(() => {
    if (selectedLevel && modules?.data && isModulesLoaded) {
      const levelModules = modules.data.filter((module) => {
        return (
          module.level_id === selectedLevel.value ||
          module.levelId === selectedLevel.value ||
          module.level?.id === selectedLevel.value
        );
      });
      setFilteredModules(levelModules);
    } else {
      setFilteredModules([]);
    }
  }, [selectedLevel, modules, isModulesLoaded]);

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

  const moduleOptions =
    filteredModules.map((mod) => ({
      label: mod.title,
      value: mod.id,
    })) || [];

  const validationSchema = Yup.object({
    programName: Yup.object()
      .nullable()
      .required(t("automatedAssessmentImporter.validation.programRequired")),
    levelName: Yup.object()
      .nullable()
      .required(t("automatedAssessmentImporter.validation.levelRequired")),
    moduleName: Yup.object()
      .nullable()
      .required(t("automatedAssessmentImporter.validation.moduleRequired")),
    htmlContent: Yup.string().required(
      t("automatedAssessmentImporter.validation.contentRequired"),
    ),
  });

  const initialValues = {
    programName: null,
    levelName: null,
    moduleName: null,
    htmlContent: "",
  };

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const payload = {
        program_id: values.programName.value,
        level_id: values.levelName.value,
        module_id: values.moduleName.value,
        html: values.htmlContent,
        type: "both",
      };

      const res = await dispatch(createAutomatedImport(payload)).unwrap();

      toast.success(
        res.message || t("automatedAssessmentImporter.success.create"),
      );

      resetForm();
      setSelectedProgram(null);
      setSelectedLevel(null);
      setFilteredLevels([]);
      setFilteredModules([]);
      setHtmlContent("");
      setIsLevelsLoaded(false);
      setIsModulesLoaded(false);
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(
        error?.message || t("automatedAssessmentImporter.error.create"),
      );
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
              <PageTitle>
                {t("automatedAssessmentImporter.create.title")}
              </PageTitle>
              <PageSubtitle>
                {t("automatedAssessmentImporter.create.subtitle")}
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
                        {t("automatedAssessmentImporter.create.generalDetails")}
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <AiOutlineQuestionCircle className="text-base sm:text-lg" />
                        </button>
                      </h3>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                          <div>
                            <SelectField
                              name="programName"
                              label={t(
                                "automatedAssessmentImporter.create.parentProgram",
                              )}
                              placeholder={t(
                                "automatedAssessmentImporter.create.selectProgram",
                              )}
                              required={true}
                              options={programOptions || []}
                              onChange={(option) => {
                                setFieldValue("programName", option);
                                setFieldValue("levelName", null);
                                setFieldValue("moduleName", null);
                                setSelectedProgram(option);
                                setSelectedLevel(null);
                                setIsLevelsLoaded(false);
                                setIsModulesLoaded(false);
                              }}
                            />
                          </div>

                          <div>
                            <SelectField
                              name="levelName"
                              label={t(
                                "automatedAssessmentImporter.create.parentLevel",
                              )}
                              placeholder={t(
                                "automatedAssessmentImporter.create.selectLevel",
                              )}
                              required={true}
                              options={levelOptions || []}
                              disabled={!values.programName}
                              isLoading={isLevelLoading}
                              onChange={(option) => {
                                setFieldValue("levelName", option);
                                setFieldValue("moduleName", null);
                                setSelectedLevel(option);
                                setIsModulesLoaded(false);
                              }}
                            />
                          </div>

                          <div>
                            <SelectField
                              name="moduleName"
                              label={t(
                                "automatedAssessmentImporter.create.parentModule",
                              )}
                              placeholder={t(
                                "automatedAssessmentImporter.create.selectModule",
                              )}
                              required={true}
                              options={moduleOptions || []}
                              disabled={!values.levelName}
                              isLoading={isModuleLoading}
                              onChange={(option) => {
                                setFieldValue("moduleName", option);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
                        <AiOutlineExclamationCircle className="text-primary text-base sm:text-lg" />
                        {t("automatedAssessmentImporter.create.contentSection")}
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="ml-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <AiOutlineQuestionCircle className="text-base sm:text-lg" />
                        </button>
                        <span className="text-xs text-gray-400 ml-1">
                          (
                          {t(
                            "automatedAssessmentImporter.create.clickForGuidelines",
                          )}
                          )
                        </span>
                      </h3>

                      <div className="mb-2">
                        <CustomEditor
                          value={htmlContent}
                          onChange={handleContentChange}
                          placeholder={t(
                            "automatedAssessmentImporter.create.editorPlaceholder",
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
                          {values.htmlContent && !errors.htmlContent && (
                            <div className="text-green-600 text-xs sm:text-sm flex items-center gap-1">
                              <AiOutlineCheckCircle className="text-green-600" />
                              {t(
                                "automatedAssessmentImporter.create.contentReady",
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
                          {t(
                            "automatedAssessmentImporter.create.viewGuidelines",
                          )}
                        </button>
                      </div>
                    </div>

                    {hasPermission("imports.create") && (
                      <div className="flex justify-end items-center pt-4">
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={
                              isSubmitting ||
                              !values.programName ||
                              !values.levelName ||
                              !values.moduleName ||
                              !values.htmlContent
                            }
                            className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                          >
                            {isSubmitting
                              ? t(
                                  "automatedAssessmentImporter.actions.creating",
                                )
                              : t(
                                  "automatedAssessmentImporter.actions.createContent",
                                )}
                          </button>
                        </div>
                      </div>
                    )}
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

export default CreateAutomatedAssessment;
