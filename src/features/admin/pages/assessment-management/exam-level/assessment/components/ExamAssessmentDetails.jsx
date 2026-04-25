// import { useState, useRef, useEffect, useMemo } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import {
//   SelectField,
//   TextInput,
//   TextareaField,
// } from "../../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FiUpload, FiX, FiImage } from "react-icons/fi";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "../../../../../common/toast/ToastContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAllPrograms } from "../../../../../../../redux/slice/programSlice";
// import { getAllLevels } from "../../../../../../../redux/slice/levelSlice";
// import { getAllModules } from "../../../../../../../redux/slice/moduleSlice";
// import { getAllChapters } from "../../../../../../../redux/slice/chapterSlice";
// import { getAllTopics } from "../../../../../../../redux/slice/topicSlice";
// import {
//   deleteSingleAssessment,
//   getAssessmentById,
// } from "../../../../../../../redux/slice/assissmentSlice";
// import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
// import Breadcrumb from "../../../../../common/layout/Breadcrumb";
// import Loader from "../../../../../common/Loader";

// // Defined outside component to keep stable reference
// const ASSESSMENT_TYPE_OPTIONS = [
//   { label: "Topic", value: "topic" },
//   { label: "Level", value: "level" },
// ];

// const ExamAssessmentDetails = () => {
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const { assessment, isLoading } = useSelector((state) => state.assessment);

//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { assessmentId: id } = useParams();

//   const { programs } = useSelector((state) => state.program);
//   const { levels } = useSelector((state) => state.level);
//   const { modules } = useSelector((state) => state.module);
//   const { chapters } = useSelector((state) => state.chapter);
//   const { topics } = useSelector((state) => state.topic);

//   // ─── Selected state for cascading dropdowns ───────────────────────────────
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [selectedAssessmentType, setSelectedAssessmentType] = useState(null);

//   // ─── Load tracking ────────────────────────────────────────────────────────
//   const [programsLoaded, setProgramsLoaded] = useState(false);
//   const [levelsLoaded, setLevelsLoaded] = useState(false);
//   const [modulesLoaded, setModulesLoaded] = useState(false);
//   const [chaptersLoaded, setChaptersLoaded] = useState(false);
//   const [topicsLoaded, setTopicsLoaded] = useState(false);

//   const [loadingLevels, setLoadingLevels] = useState(false);
//   const [loadingModules, setLoadingModules] = useState(false);
//   const [loadingChapters, setLoadingChapters] = useState(false);
//   const [loadingTopics, setLoadingTopics] = useState(false);

//   // ─── Filtered dropdown data ───────────────────────────────────────────────
//   const [filteredLevels, setFilteredLevels] = useState([]);
//   const [filteredModules, setFilteredModules] = useState([]);
//   const [filteredChapters, setFilteredChapters] = useState([]);
//   const [filteredTopics, setFilteredTopics] = useState([]);
//   const [filteredProgramsForLevel, setFilteredProgramsForLevel] = useState([]);

//   // ─── Fetch assessment on mount ────────────────────────────────────────────
//   useEffect(() => {
//     if (id) {
//       dispatch(getAssessmentById(id));
//     }
//   }, [dispatch, id]);

//   // ─── Set assessment type from API response ────────────────────────────────
//   useEffect(() => {
//     if (assessment?.type) {
//       const typeOption = ASSESSMENT_TYPE_OPTIONS.find(
//         (opt) => opt.value === assessment.type,
//       );
//       if (typeOption) {
//         setSelectedAssessmentType(typeOption);
//       }
//     }
//   }, [assessment]);

//   // ─── Set thumbnail preview if assessment has a file ───────────────────────
//   useEffect(() => {
//     if (assessment?.file) {
//       setThumbnailPreview(assessment.file);
//     }
//   }, [assessment]);

//   // ─── Load programs initially ──────────────────────────────────────────────
//   useEffect(() => {
//     if (!programsLoaded) {
//       dispatch(getAllPrograms()).then(() => setProgramsLoaded(true));
//     }
//   }, [dispatch, programsLoaded]);

//   // ─── Load levels when program selected (Topic type) ──────────────────────
//   useEffect(() => {
//     if (
//       selectedProgram &&
//       selectedAssessmentType?.value === "topic" &&
//       !levelsLoaded &&
//       !loadingLevels
//     ) {
//       setLoadingLevels(true);
//       dispatch(getAllLevels()).then(() => {
//         setLevelsLoaded(true);
//         setLoadingLevels(false);
//       });
//     }
//   }, [
//     selectedProgram,
//     selectedAssessmentType,
//     dispatch,
//     levelsLoaded,
//     loadingLevels,
//   ]);

//   // ─── Filter levels by program ─────────────────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedProgram &&
//       levels?.data &&
//       selectedAssessmentType?.value === "topic"
//     ) {
//       const programLevels = levels.data.filter(
//         (level) =>
//           level.program_id === selectedProgram.value ||
//           level.programId === selectedProgram.value ||
//           level.program?.id === selectedProgram.value,
//       );
//       setFilteredLevels(programLevels);
//     } else {
//       setFilteredLevels([]);
//     }
//   }, [selectedProgram, levels, selectedAssessmentType]);

//   // ─── Load modules when level selected ────────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedLevel &&
//       selectedAssessmentType?.value === "topic" &&
//       !modulesLoaded &&
//       !loadingModules
//     ) {
//       setLoadingModules(true);
//       dispatch(getAllModules()).then(() => {
//         setModulesLoaded(true);
//         setLoadingModules(false);
//       });
//     }
//   }, [
//     selectedLevel,
//     selectedAssessmentType,
//     dispatch,
//     modulesLoaded,
//     loadingModules,
//   ]);

//   // ─── Filter modules by level ──────────────────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedLevel &&
//       modules?.data &&
//       selectedAssessmentType?.value === "topic"
//     ) {
//       const levelModules = modules.data.filter(
//         (module) =>
//           module.level_id === selectedLevel.value ||
//           module.levelId === selectedLevel.value ||
//           module.level?.id === selectedLevel.value,
//       );
//       setFilteredModules(levelModules);
//     } else {
//       setFilteredModules([]);
//     }
//   }, [selectedLevel, modules, selectedAssessmentType]);

//   // ─── Load chapters when module selected ──────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedModule &&
//       selectedAssessmentType?.value === "topic" &&
//       !chaptersLoaded &&
//       !loadingChapters
//     ) {
//       setLoadingChapters(true);
//       dispatch(getAllChapters()).then(() => {
//         setChaptersLoaded(true);
//         setLoadingChapters(false);
//       });
//     }
//   }, [
//     selectedModule,
//     selectedAssessmentType,
//     dispatch,
//     chaptersLoaded,
//     loadingChapters,
//   ]);

//   // ─── Filter chapters by module ────────────────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedModule &&
//       chapters?.data &&
//       selectedAssessmentType?.value === "topic"
//     ) {
//       const moduleChapters = chapters.data.filter(
//         (chapter) =>
//           chapter.module_id === selectedModule.value ||
//           chapter.moduleId === selectedModule.value ||
//           chapter.module?.id === selectedModule.value,
//       );
//       setFilteredChapters(moduleChapters);
//     } else {
//       setFilteredChapters([]);
//     }
//   }, [selectedModule, chapters, selectedAssessmentType]);

//   // ─── Load topics when chapter selected ───────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedChapter &&
//       selectedAssessmentType?.value === "topic" &&
//       !topicsLoaded &&
//       !loadingTopics
//     ) {
//       setLoadingTopics(true);
//       dispatch(getAllTopics()).then(() => {
//         setTopicsLoaded(true);
//         setLoadingTopics(false);
//       });
//     }
//   }, [
//     selectedChapter,
//     selectedAssessmentType,
//     dispatch,
//     topicsLoaded,
//     loadingTopics,
//   ]);

//   // ─── Filter topics by chapter ─────────────────────────────────────────────
//   useEffect(() => {
//     if (
//       selectedChapter &&
//       topics?.data &&
//       selectedAssessmentType?.value === "topic"
//     ) {
//       const chapterTopics = topics.data.filter(
//         (topic) =>
//           topic.chapter_id === selectedChapter.value ||
//           topic.chapterId === selectedChapter.value ||
//           topic.chapter?.id === selectedChapter.value,
//       );
//       setFilteredTopics(chapterTopics);
//     } else {
//       setFilteredTopics([]);
//     }
//   }, [selectedChapter, topics, selectedAssessmentType]);

//   // ─── Level type: load levels when program selected ────────────────────────
//   useEffect(() => {
//     if (
//       selectedAssessmentType?.value === "level" &&
//       selectedProgram &&
//       !levelsLoaded &&
//       !loadingLevels
//     ) {
//       setLoadingLevels(true);
//       dispatch(getAllLevels()).then(() => {
//         setLevelsLoaded(true);
//         setLoadingLevels(false);
//       });
//     }
//   }, [
//     selectedAssessmentType,
//     selectedProgram,
//     dispatch,
//     levelsLoaded,
//     loadingLevels,
//   ]);

//   // ─── Level type: filter programs ─────────────────────────────────────────
//   useEffect(() => {
//     if (selectedAssessmentType?.value === "level" && programs?.data) {
//       setFilteredProgramsForLevel(programs.data);
//     } else {
//       setFilteredProgramsForLevel([]);
//     }
//   }, [selectedAssessmentType, programs]);

//   // ─── Handlers ─────────────────────────────────────────────────────────────
//   const handleThumbnailUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error(t("assessment.validation.invalidImage"));
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(t("assessment.validation.fileSizeExceeded"));
//       return;
//     }

//     setThumbnail(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setThumbnailPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeThumbnail = () => {
//     setThumbnail(null);
//     setThumbnailPreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current?.click();

//   // ─── Dropdown options ─────────────────────────────────────────────────────
//   const programOptions =
//     programs?.data?.map((prog) => ({ label: prog.title, value: prog.id })) ||
//     [];

//   const levelOptions = filteredLevels.map((lev) => ({
//     label: lev.title,
//     value: lev.id,
//   }));

//   const moduleOptions = filteredModules.map((mod) => ({
//     label: mod.title,
//     value: mod.id,
//   }));

//   const chapterOptions = filteredChapters.map((chapter) => ({
//     label: chapter.title,
//     value: chapter.id,
//   }));

//   const topicOptions = filteredTopics.map((topic) => ({
//     label: topic.title,
//     value: topic.id,
//   }));

//   const programOptionsForLevel = filteredProgramsForLevel.map((prog) => ({
//     label: prog.title,
//     value: prog.id,
//   }));

//   const getLevelsForProgram = () => {
//     if (selectedProgram && levels?.data) {
//       return levels.data
//         .filter(
//           (level) =>
//             level.program_id === selectedProgram.value ||
//             level.programId === selectedProgram.value ||
//             level.program?.id === selectedProgram.value,
//         )
//         .map((level) => ({ label: level.title, value: level.id }));
//     }
//     return [];
//   };

//   // ─── Initial values — pre-filled from API response ────────────────────────
//   // enableReinitialize={true} ensures these update once `assessment` arrives
//   const initialValues = useMemo(() => {
//     const typeOption = assessment?.type
//       ? (ASSESSMENT_TYPE_OPTIONS.find((opt) => opt.value === assessment.type) ??
//         null)
//       : null;

//     return {
//       assessmentType: typeOption,
//       // Topic type cascade — these need full chain data to resolve;
//       // they stay null until user re-selects (or you add reverse-lookup logic later)
//       programName: null,
//       levelName: null,
//       moduleName: null,
//       chapterName: null,
//       topicId: null,
//       // Level type
//       programForLevel: null,
//       levelForAssessment: null,
//       // Common fields — directly from API
//       title: assessment?.title ?? "",
//       description: assessment?.description ?? "",
//       passing_score: assessment?.passing_score ?? "",
//       total_marks: assessment?.total_marks ?? "",
//       duration: assessment?.duration ?? "",
//     };
//   }, [assessment]);

//   // ─── Validation ───────────────────────────────────────────────────────────
//   // const validationSchema = Yup.object({
//   //   assessmentType: Yup.object()
//   //     .nullable()
//   //     .required("Assessment type is required"),
//   //   programName: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "topic",
//   //       then: (schema) => schema.required("Program is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   levelName: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "topic",
//   //       then: (schema) => schema.required("Level is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   moduleName: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "topic",
//   //       then: (schema) => schema.required("Module is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   chapterName: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "topic",
//   //       then: (schema) => schema.required("Chapter is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   topicId: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "topic",
//   //       then: (schema) => schema.required("Topic is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   programForLevel: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "level",
//   //       then: (schema) => schema.required("Program is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   levelForAssessment: Yup.object()
//   //     .nullable()
//   //     .when("assessmentType", {
//   //       is: (val) => val?.value === "level",
//   //       then: (schema) => schema.required("Level is required"),
//   //       otherwise: (schema) => schema.nullable(),
//   //     }),
//   //   title: Yup.string().required("Title is required"),
//   //   description: Yup.string().nullable(),
//   //   passing_score: Yup.number()
//   //     .required("Passing score is required")
//   //     .positive("Passing score must be positive"),
//   //   total_marks: Yup.number()
//   //     .required("Total marks is required")
//   //     .positive("Total marks must be positive"),
//   //   duration: Yup.number()
//   //     .nullable()
//   //     .transform((value, originalValue) =>
//   //       originalValue === "" ? null : value,
//   //     ),
//   // });

//   const validationSchema = Yup.object({
//     assessmentType: Yup.object()
//       .nullable()
//       .required(t("assessment.validation.assessment_type_required")),

//     programName: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "topic",
//         then: (schema) =>
//           schema.required(t("assessment.validation.program_required")),
//       }),

//     levelName: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "topic",
//         then: (schema) =>
//           schema.required(t("assessment.validation.level_required")),
//       }),

//     moduleName: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "topic",
//         then: (schema) =>
//           schema.required(t("assessment.validation.module_required")),
//       }),

//     chapterName: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "topic",
//         then: (schema) =>
//           schema.required(t("assessment.validation.chapter_required")),
//       }),

//     topicId: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "topic",
//         then: (schema) =>
//           schema.required(t("assessment.validation.topic_required")),
//       }),

//     programForLevel: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "level",
//         then: (schema) =>
//           schema.required(t("assessment.validation.program_required")),
//       }),

//     levelForAssessment: Yup.object()
//       .nullable()
//       .when("assessmentType", {
//         is: (val) => val?.value === "level",
//         then: (schema) =>
//           schema.required(t("assessment.validation.level_required")),
//       }),

//     title: Yup.string().required(t("assessment.validation.title_required")),

//     description: Yup.string().required(
//       t("assessment.validation.description_required"),
//     ),

//     passing_score: Yup.number()
//       .required(t("assessment.validation.passing_score_required"))
//       .positive(t("assessment.validation.passing_score_positive")),

//     total_marks: Yup.number()
//       .required(t("assessment.validation.total_marks_required"))
//       .positive(t("assessment.validation.total_marks_positive")),

//     duration: Yup.number()
//       .required(t("assessment.validation.duration_required"))
//       .positive(t("assessment.validation.duration_positive")),
//   });

//   // ─── Submit ───────────────────────────────────────────────────────────────
//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const formData = new FormData();

//       formData.append("type", values.assessmentType.value);
//       formData.append("title", values.title);
//       if (values.description)
//         formData.append("description", values.description);
//       formData.append("passing_score", values.passing_score);
//       formData.append("total_marks", values.total_marks);
//       if (values.duration) formData.append("duration", values.duration);

//       if (values.assessmentType?.value === "topic") {
//         formData.append("assessmentable_id", values.topicId.value);
//         formData.append("assessmentable_type", "App\\Models\\Topic");
//       } else {
//         formData.append("assessmentable_id", values.levelForAssessment.value);
//         formData.append("assessmentable_type", "App\\Models\\Level");
//       }

//       if (thumbnail) {
//         formData.append("file", thumbnail);
//       }

//       console.log("Update payload:", Object.fromEntries(formData));

//       // TODO: dispatch update action here
//       // await dispatch(updateAssessment({ id, formData })).unwrap();
//       // toast.success("Assessment updated successfully");
//       // navigate("/assissment");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("assessment.details.deleteText") }),
//     );

//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleAssessment(id)).unwrap();
//       toast.success("assessment deleted successfully ");
//       setTimeout(() => {
//         navigate("/assessment");
//       }, 1000);
//     } catch (error) {
//       toast.error(error?.message || "Delete failed ");
//     }
//   };

//   // ─── Render ───────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("assessment.breadcrumb.assessment"),
//               path: "/assessment",
//             },
//             {
//               label: t("assessment.breadcrumb.view-assessment"),
//             },
//           ]}
//         />

//         <PageBody className="mt-6">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
//               return (
//                 <Form onSubmit={handleSubmit} className="space-y-8">
//                   {/* ── Assessment Type ── */}
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                       <span className="text-[18px] text-primary font-[700]">
//                         <AiOutlineExclamationCircle />
//                       </span>
//                       {t("assessment.details.assessmentConfiguration")}
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <SelectField
//                         name="assessmentType"
//                         label={t("assessment.details.assessmentFor")}
//                         placeholder={t(
//                           "assessment.details.assessmentForPlaceholder",
//                         )}
//                         required={true}
//                         options={ASSESSMENT_TYPE_OPTIONS}
//                         onChange={(option) => {
//                           setFieldValue("assessmentType", option);
//                           setFieldValue("programName", null);
//                           setFieldValue("levelName", null);
//                           setFieldValue("moduleName", null);
//                           setFieldValue("chapterName", null);
//                           setFieldValue("topicId", null);
//                           setFieldValue("programForLevel", null);
//                           setFieldValue("levelForAssessment", null);
//                           setSelectedAssessmentType(option);
//                           setSelectedProgram(null);
//                           setSelectedLevel(null);
//                           setSelectedModule(null);
//                           setSelectedChapter(null);
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* ── Topic type cascade fields ── */}
//                   {values.assessmentType?.value === "topic" && (
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                         <span className="text-[18px] text-primary font-[700]">
//                           <AiOutlineExclamationCircle />
//                         </span>
//                         {t("assessment.details.generalDetails")}
//                       </h3>

//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <SelectField
//                             name="programName"
//                             label={t("assessment.details.parentProgram")}
//                             placeholder={t(
//                               "assessment.details.perentProgramPlaceholder",
//                             )}
//                             required={true}
//                             options={programOptions}
//                             isLoading={!programsLoaded}
//                             onChange={(option) => {
//                               setFieldValue("programName", option);
//                               setFieldValue("levelName", null);
//                               setFieldValue("moduleName", null);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicId", null);
//                               setSelectedProgram(option);
//                               setSelectedLevel(null);
//                               setSelectedModule(null);
//                               setSelectedChapter(null);
//                             }}
//                           />

//                           <SelectField
//                             name="levelName"
//                             label={t("assessment.details.parentLevel")}
//                             placeholder={t(
//                               "assessment.details.parentLevelPlaceholder",
//                             )}
//                             required={true}
//                             options={levelOptions}
//                             disabled={!values.programName}
//                             isLoading={loadingLevels}
//                             onChange={(option) => {
//                               setFieldValue("levelName", option);
//                               setFieldValue("moduleName", null);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicId", null);
//                               setSelectedLevel(option);
//                               setSelectedModule(null);
//                               setSelectedChapter(null);
//                             }}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <SelectField
//                             name="moduleName"
//                             label={t("assessment.details.parentModule")}
//                             placeholder={t(
//                               "assessment.details.parentModulePlaceholder",
//                             )}
//                             required={true}
//                             options={moduleOptions}
//                             disabled={!values.levelName}
//                             isLoading={loadingModules}
//                             onChange={(option) => {
//                               setFieldValue("moduleName", option);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicId", null);
//                               setSelectedModule(option);
//                               setSelectedChapter(null);
//                             }}
//                           />

//                           <SelectField
//                             name="chapterName"
//                             label={t("assessment.details.parentChapter")}
//                             placeholder={t(
//                               "assessment.details.parentChapterPlaceholder",
//                             )}
//                             required={true}
//                             options={chapterOptions}
//                             disabled={!values.moduleName}
//                             isLoading={loadingChapters}
//                             onChange={(option) => {
//                               setFieldValue("chapterName", option);
//                               setFieldValue("topicId", null);
//                               setSelectedChapter(option);
//                             }}
//                           />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <SelectField
//                             name="topicId"
//                             label={t("assessment.details.topicName")}
//                             placeholder={t(
//                               "assessment.details.topicNamePlaceholder",
//                             )}
//                             required={true}
//                             options={topicOptions}
//                             disabled={!values.chapterName}
//                             isLoading={loadingTopics}
//                             onChange={(option) => {
//                               setFieldValue("topicId", option);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* ── Level type fields ── */}
//                   {values.assessmentType?.value === "level" && (
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                         <span className="text-[18px] text-primary font-[700]">
//                           <AiOutlineExclamationCircle />
//                         </span>
//                         {t("assessment.details.levelAssessmentDetails")}
//                       </h3>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <SelectField
//                           name="programForLevel"
//                           label={t("assessment.details.parentProgram")}
//                           placeholder={t(
//                             "assessment.details.parentProgramPlaceholder",
//                           )}
//                           required={true}
//                           options={programOptionsForLevel}
//                           isLoading={!programsLoaded}
//                           onChange={(option) => {
//                             setFieldValue("programForLevel", option);
//                             setFieldValue("levelForAssessment", null);
//                             setSelectedProgram(option);
//                           }}
//                         />

//                         <SelectField
//                           name="levelForAssessment"
//                           label={t("assessment.details.selectLevel")}
//                           placeholder={t(
//                             "assessment.details.selectLevelPlaceholder",
//                           )}
//                           required={true}
//                           options={getLevelsForProgram()}
//                           disabled={!values.programForLevel}
//                           isLoading={loadingLevels}
//                           onChange={(option) => {
//                             setFieldValue("levelForAssessment", option);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* ── Common details (shown when type is selected) ── */}
//                   {(values.assessmentType?.value === "topic" ||
//                     values.assessmentType?.value === "level") && (
//                     <>
//                       <div>
//                         <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                           {t("assessment.details.assessmentDetails")}
//                         </h3>

//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <TextInput
//                               name="title"
//                               label={t("assessment.details.title")}
//                               placeholder={t(
//                                 "assessment.details.titlePlaceholder",
//                               )}
//                               required={true}
//                             />

//                             <TextInput
//                               name="duration"
//                               label={t("assessment.details.duration")}
//                               placeholder={t(
//                                 "assessment.details.durationPlaceholder",
//                               )}
//                               type="number"
//                             />
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <TextInput
//                               name="total_marks"
//                               label={t("assessment.details.totalMarks")}
//                               placeholder={t(
//                                 "assessment.details.totalMarksPlaceholder",
//                               )}
//                               type="number"
//                               required={true}
//                             />

//                             <TextInput
//                               name="passing_score"
//                               label={t("assessment.details.passingScore")}
//                               placeholder={t(
//                                 "assessment.details.passingScorePlaceholder",
//                               )}
//                               type="number"
//                               required={true}
//                             />
//                           </div>

//                           <div className="grid grid-cols-1 gap-4">
//                             <TextareaField
//                               name="description"
//                               label={t("assessment.details.description")}
//                               placeholder={t(
//                                 "assessment.details.descriptionPlaceholder",
//                               )}
//                               rows={4}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* ── Thumbnail ── */}
//                       <div>
//                         <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                           <span className="text-blue-600">
//                             <FiImage />
//                           </span>
//                           {t("assessment.details.thumbnail")}
//                         </h3>

//                         <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                           <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept="image/*"
//                             onChange={handleThumbnailUpload}
//                             className="hidden"
//                           />

//                           {!thumbnailPreview ? (
//                             <div
//                               onClick={triggerFileUpload}
//                               className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                             >
//                               <FiUpload className="text-4xl text-gray-400 mb-3" />
//                               <p className="text-sm text-gray-600 mb-1">
//                                 {t("assessment.details.uploadText")}
//                               </p>
//                               <p className="text-xs text-gray-400">
//                                 {t("assessment.details.uploadSubText")}
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="relative">
//                               <div className="flex items-start gap-6">
//                                 <div className="relative group">
//                                   <img
//                                     src={thumbnailPreview}
//                                     alt="Thumbnail Preview"
//                                     className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={removeThumbnail}
//                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                                   >
//                                     <FiX className="text-xs" />
//                                   </button>
//                                 </div>
//                                 <div className="flex-1">
//                                   {thumbnail ? (
//                                     <>
//                                       <p className="text-sm font-semibold text-gray-700 mb-1">
//                                         {thumbnail.name}
//                                       </p>
//                                       <p className="text-xs text-gray-500 mb-3">
//                                         {(thumbnail.size / 1024).toFixed(2)} KB
//                                       </p>
//                                     </>
//                                   ) : (
//                                     <p className="text-sm font-semibold text-gray-700 mb-3">
//                                       Current thumbnail
//                                     </p>
//                                   )}
//                                   <button
//                                     type="button"
//                                     onClick={triggerFileUpload}
//                                     className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                                   >
//                                     <FiUpload className="text-sm" />
//                                     {t("assessment.details.changeImage")}
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* ── Footer ── */}
//                       <div className="flex justify-end items-center pt-4">
//                         <div className="flex gap-3">
//                           <button
//                             type="button"
//                             onClick={handleDelete}
//                             className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
//                           >
//                             {t("assessment.actions.deleteAssessment")}
//                           </button>
//                           <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                           >
//                             {isSubmitting
//                               ? t("assessment.actions.updating")
//                               : t("assessment.actions.updateAssessment")}
//                           </button>
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </Form>
//               );
//             }}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default ExamAssessmentDetails;

// import { useState, useRef, useEffect, useMemo } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import {
//   SelectField,
//   TextInput,
//   TextareaField,
// } from "../../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FiUpload, FiX, FiImage } from "react-icons/fi";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "../../../../../common/toast/ToastContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAllPrograms } from "../../../../../../../redux/slice/programSlice";
// import { getAllLevels } from "../../../../../../../redux/slice/levelSlice";
// import {
//   deleteSingleAssessment,
//   getAssessmentById,
//   //   updateAssessment,
// } from "../../../../../../../redux/slice/assissmentSlice";
// import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
// import Breadcrumb from "../../../../../common/layout/Breadcrumb";
// import Loader from "../../../../../common/Loader";

// const ExamAssessmentDetails = () => {
//   const [thumbnail, setThumbnail] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const { assessment, isLoading } = useSelector((state) => state.assessment);

//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { assessmentId: id } = useParams();

//   const { programs } = useSelector((state) => state.program);
//   const { levels } = useSelector((state) => state.level);

//   const [selectedProgram, setSelectedProgram] = useState(null);

//   // Load tracking
//   const [programsLoaded, setProgramsLoaded] = useState(false);
//   const [levelsLoaded, setLevelsLoaded] = useState(false);

//   const [loadingLevels, setLoadingLevels] = useState(false);

//   const [filteredLevels, setFilteredLevels] = useState([]);

//   // Fetch assessment on mount
//   useEffect(() => {
//     if (id) {
//       dispatch(getAssessmentById(id));
//     }
//   }, [dispatch, id]);

//   // Set thumbnail preview if assessment has a file
//   useEffect(() => {
//     if (assessment?.file) {
//       setThumbnailPreview(assessment.file);
//     }
//   }, [assessment]);

//   // Set selected program and level from assessment data
//   useEffect(() => {
//     if (assessment?.assessmentable && assessment.type === "level") {
//       // Fetch programs first if not loaded
//       if (!programsLoaded) {
//         dispatch(getAllPrograms()).then(() => setProgramsLoaded(true));
//       }

//       // Fetch levels if not loaded
//       if (!levelsLoaded && !loadingLevels) {
//         setLoadingLevels(true);
//         dispatch(getAllLevels()).then(() => {
//           setLevelsLoaded(true);
//           setLoadingLevels(false);
//         });
//       }
//     }
//   }, [assessment, dispatch, programsLoaded, levelsLoaded, loadingLevels]);

//   // Set selected program and level once data is loaded
//   useEffect(() => {
//     if (assessment?.assessmentable && programs?.data && levels?.data) {
//       const levelId = assessment.assessmentable.id;
//       const level = levels.data.find((l) => l.id === levelId);

//       if (level) {
//         const program = programs.data.find(
//           (p) => p.id === level.program_id || p.id === level.programId,
//         );

//         if (program) {
//           setSelectedProgram({ label: program.title, value: program.id });
//         }

//         setFilteredLevels([level]);
//       }
//     }
//   }, [assessment, programs, levels]);

//   // Load programs initially
//   useEffect(() => {
//     if (!programsLoaded) {
//       dispatch(getAllPrograms()).then(() => setProgramsLoaded(true));
//     }
//   }, [dispatch, programsLoaded]);

//   // Load levels when program is selected
//   useEffect(() => {
//     if (selectedProgram && !levelsLoaded && !loadingLevels) {
//       setLoadingLevels(true);
//       dispatch(getAllLevels()).then(() => {
//         setLevelsLoaded(true);
//         setLoadingLevels(false);
//       });
//     }
//   }, [selectedProgram, dispatch, levelsLoaded, loadingLevels]);

//   // Filter levels based on selected program
//   useEffect(() => {
//     if (selectedProgram && levels?.data) {
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
//   }, [selectedProgram, levels]);

//   const handleThumbnailUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error(t("assessment.validation.invalidImage"));
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(t("assessment.validation.fileSizeExceeded"));
//       return;
//     }

//     setThumbnail(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setThumbnailPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const removeThumbnail = () => {
//     setThumbnail(null);
//     setThumbnailPreview(assessment?.file || null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current?.click();

//   // Dropdown options
//   const programOptions =
//     programs?.data?.map((prog) => ({ label: prog.title, value: prog.id })) ||
//     [];

//   const levelOptions = filteredLevels.map((lev) => ({
//     label: lev.title,
//     value: lev.id,
//   }));

//   // Initial values from API response
//   const initialValues = useMemo(() => {
//     return {
//       programId:
//         assessment?.assessmentable?.program_id ||
//         assessment?.assessmentable?.programId ||
//         null,
//       levelId: assessment?.assessmentable?.id || null,
//       title: assessment?.title ?? "",
//       description: assessment?.description ?? "",
//       passing_score: assessment?.passing_score ?? "",
//       total_marks: assessment?.total_marks ?? "",
//       duration: assessment?.duration ?? "",
//     };
//   }, [assessment]);

//   // Validation schema
//   const validationSchema = Yup.object({
//     programId: Yup.object()
//       .nullable()
//       .required(t("assessment.validation.program_required")),
//     levelId: Yup.object()
//       .nullable()
//       .required(t("assessment.validation.level_required")),
//     title: Yup.string().required(t("assessment.validation.title_required")),
//     description: Yup.string().required(
//       t("assessment.validation.description_required"),
//     ),
//     passing_score: Yup.number()
//       .required(t("assessment.validation.passing_score_required"))
//       .positive(t("assessment.validation.passing_score_positive")),
//     total_marks: Yup.number()
//       .required(t("assessment.validation.total_marks_required"))
//       .positive(t("assessment.validation.total_marks_positive")),
//     duration: Yup.number()
//       .required(t("assessment.validation.duration_required"))
//       .positive(t("assessment.validation.duration_positive")),
//   });

//   // Submit handler
//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const formData = new FormData();

//       // Append _method for PUT request
//       formData.append("_method", "PUT");
//       formData.append("type", "level");
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("passing_score", values.passing_score);
//       formData.append("total_marks", values.total_marks);
//       formData.append("duration", values.duration);
//       formData.append("assessmentable_id", values.levelId.value);
//       formData.append("assessmentable_type", "App\\Models\\Level");

//       if (thumbnail) {
//         formData.append("file", thumbnail);
//       }

//       console.log("Update payload:", Object.fromEntries(formData));

//       //   await dispatch(updateAssessment({ id, data: formData })).unwrap();
//       //   toast.success("Assessment updated successfully");
//       //   navigate("/assissment");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("assessment.details.deleteText") }),
//     );

//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleAssessment(id)).unwrap();
//       toast.success("Assessment deleted successfully");
//       setTimeout(() => {
//         navigate("/assessment");
//       }, 1000);
//     } catch (error) {
//       toast.error(error?.message || "Delete failed");
//     }
//   };

//   // Render
//   if (isLoading) {
//     return <Loader />;
//   }

//   // Helper to get selected program object
//   const getSelectedProgramObject = () => {
//     if (initialValues.programId && programs?.data) {
//       const program = programs.data.find(
//         (p) => p.id === initialValues.programId,
//       );
//       if (program) {
//         return { label: program.title, value: program.id };
//       }
//     }
//     return null;
//   };

//   // Helper to get selected level object
//   const getSelectedLevelObject = () => {
//     if (initialValues.levelId && levels?.data) {
//       const level = levels.data.find((l) => l.id === initialValues.levelId);
//       if (level) {
//         return { label: level.title, value: level.id };
//       }
//     }
//     return null;
//   };

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("assessment.breadcrumb.examManagement"),
//               path: "/assessment",
//             },
//             {
//               label: t("assessment.breadcrumb.view-exam"),
//             },
//           ]}
//         />

//         <PageBody className="mt-6">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({ isSubmitting, values, setFieldValue, handleSubmit }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Program and Level Selection */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     <span className="text-[18px] text-primary font-[700]">
//                       <AiOutlineExclamationCircle />
//                     </span>
//                     {t("assessment.details.levelDetails")}
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Program Selection */}
//                     <SelectField
//                       name="programId"
//                       label={t("assessment.details.parentProgram")}
//                       placeholder={t(
//                         "assessment.details.parentProgramPlaceholder",
//                       )}
//                       required={true}
//                       options={programOptions}
//                       isLoading={!programsLoaded}
//                       value={getSelectedProgramObject()}
//                       onChange={(option) => {
//                         setFieldValue("programId", option);
//                         setFieldValue("levelId", null);
//                         setSelectedProgram(option);
//                       }}
//                     />

//                     {/* Level Selection */}
//                     <SelectField
//                       name="levelId"
//                       label={t("assessment.details.selectLevel")}
//                       placeholder={t(
//                         "assessment.details.selectLevelPlaceholder",
//                       )}
//                       required={true}
//                       options={levelOptions}
//                       disabled={!values.programId && !selectedProgram}
//                       isLoading={loadingLevels}
//                       value={getSelectedLevelObject()}
//                       onChange={(option) => {
//                         setFieldValue("levelId", option);
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Assessment Details */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     {t("assessment.details.assessmentDetails")}
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TextInput
//                         name="title"
//                         label={t("assessment.details.title")}
//                         placeholder={t("assessment.details.titlePlaceholder")}
//                         required={true}
//                       />

//                       <TextInput
//                         name="duration"
//                         label={t("assessment.details.duration")}
//                         placeholder={t(
//                           "assessment.details.durationPlaceholder",
//                         )}
//                         type="number"
//                         required={true}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <TextInput
//                         name="total_marks"
//                         label={t("assessment.details.totalMarks")}
//                         placeholder={t(
//                           "assessment.details.totalMarksPlaceholder",
//                         )}
//                         type="number"
//                         required={true}
//                       />

//                       <TextInput
//                         name="passing_score"
//                         label={t("assessment.details.passingScore")}
//                         placeholder={t(
//                           "assessment.details.passingScorePlaceholder",
//                         )}
//                         type="number"
//                         required={true}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                       <TextareaField
//                         name="description"
//                         label={t("assessment.details.description")}
//                         placeholder={t(
//                           "assessment.details.descriptionPlaceholder",
//                         )}
//                         rows={4}
//                         required={true}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Thumbnail Section */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     <span className="text-blue-600">
//                       <FiImage />
//                     </span>
//                     {t("assessment.details.thumbnail")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleThumbnailUpload}
//                       className="hidden"
//                     />

//                     {!thumbnailPreview ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("assessment.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {t("assessment.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="relative">
//                         <div className="flex items-start gap-6">
//                           <div className="relative group">
//                             <img
//                               src={thumbnailPreview}
//                               alt="Thumbnail Preview"
//                               className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
//                             />
//                             <button
//                               type="button"
//                               onClick={removeThumbnail}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                             >
//                               <FiX className="text-xs" />
//                             </button>
//                           </div>
//                           <div className="flex-1">
//                             {thumbnail ? (
//                               <>
//                                 <p className="text-sm font-semibold text-gray-700 mb-1">
//                                   {thumbnail.name}
//                                 </p>
//                                 <p className="text-xs text-gray-500 mb-3">
//                                   {(thumbnail.size / 1024).toFixed(2)} KB
//                                 </p>
//                               </>
//                             ) : (
//                               <p className="text-sm font-semibold text-gray-700 mb-3">
//                                 Current thumbnail
//                               </p>
//                             )}
//                             <button
//                               type="button"
//                               onClick={triggerFileUpload}
//                               className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                             >
//                               <FiUpload className="text-sm" />
//                               {t("assessment.details.changeImage")}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end items-center pt-4">
//                   <div className="flex gap-3">
//                     <button
//                       type="button"
//                       onClick={handleDelete}
//                       className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
//                     >
//                       {t("assessment.actions.deleteExam")}
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                     >
//                       {isSubmitting
//                         ? t("assessment.actions.updating")
//                         : t("assessment.actions.updateExam")}
//                     </button>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default ExamAssessmentDetails;

import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  SelectField,
  TextInput,
  TextareaField,
} from "../../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { PageLayout } from "../../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../../common/toast/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { getAllPrograms } from "../../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../../redux/slice/levelSlice";
import {
  deleteSingleAssessment,
  getAssessmentById,
} from "../../../../../../../redux/slice/assissmentSlice";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import Loader from "../../../../../common/Loader";

const AssessmentDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { assessment, isLoading } = useSelector((state) => state.assessment);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { assessmentId: id } = useParams();

  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);

  // Selected state for dropdowns
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Loading flags for API calls
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);

  // Filtered dropdown data
  const [filteredLevels, setFilteredLevels] = useState([]);

  // Flag: hierarchy selections have been set
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ─── 1. Fetch assessment on mount ───────────────────────────────────────────
  useEffect(() => {
    if (id) {
      dispatch(getAssessmentById(id));
    }
  }, [dispatch, id]);

  // ─── 2. Set thumbnail preview ────────────────────────────────────────────────
  useEffect(() => {
    if (assessment?.assessment?.file) {
      setThumbnailPreview(assessment.assessment.file);
    }
  }, [assessment]);

  // ─── 3. Load all required master data (programs, levels) ────────────────────
  useEffect(() => {
    if (!assessment) return;

    // Load Programs
    if (!programs?.data && !loadingPrograms) {
      setLoadingPrograms(true);
      dispatch(getAllPrograms()).finally(() => setLoadingPrograms(false));
    }

    // Load Levels
    if (!levels?.data && !loadingLevels) {
      setLoadingLevels(true);
      dispatch(getAllLevels()).finally(() => setLoadingLevels(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment]);

  // ─── 4. Once master data is available, derive selected values & filtered lists
  useEffect(() => {
    if (!assessment?.hierarchy || !programs?.data || !levels?.data) return;

    const { hierarchy } = assessment;

    // ── Set selected dropdown values ──────────────────────────────────────────
    const prog = hierarchy.program
      ? { label: hierarchy.program.title, value: hierarchy.program.id }
      : null;

    const lev = hierarchy.level
      ? { label: hierarchy.level.title, value: hierarchy.level.id }
      : null;

    setSelectedProgram(prog);
    setSelectedLevel(lev);

    // ── Filter cascaded lists ─────────────────────────────────────────────────
    if (prog && levels?.data) {
      setFilteredLevels(
        levels.data.filter(
          (l) =>
            l.program_id === prog.value ||
            l.programId === prog.value ||
            l.program?.id === prog.value,
        ),
      );
    }

    setIsDataLoaded(true);
  }, [assessment, programs, levels]);

  // ─── 5. Re-filter on manual dropdown changes ──────────────────────────────
  useEffect(() => {
    if (selectedProgram && levels?.data) {
      setFilteredLevels(
        levels.data.filter(
          (l) =>
            l.program_id === selectedProgram.value ||
            l.programId === selectedProgram.value ||
            l.program?.id === selectedProgram.value,
        ),
      );
    }
  }, [selectedProgram, levels]);

  // ─── Thumbnail handlers ───────────────────────────────────────────────────
  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("assessment.validation.invalidImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("assessment.validation.fileSizeExceeded"));
      return;
    }

    setThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(assessment?.assessment?.file || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  // ─── Dropdown options ─────────────────────────────────────────────────────
  const programOptions =
    programs?.data?.map((p) => ({ label: p.title, value: p.id })) || [];

  const levelOptions = filteredLevels.map((l) => ({
    label: l.title,
    value: l.id,
  }));

  // ─── Validation schema ────────────────────────────────────────────────────
  const validationSchema = Yup.object({
    programId: Yup.object()
      .nullable()
      .required(t("assessment.validation.program_required")),
    levelId: Yup.object()
      .nullable()
      .required(t("assessment.validation.level_required")),
    title: Yup.string().required(t("assessment.validation.title_required")),
    description: Yup.string().required(
      t("assessment.validation.description_required"),
    ),
    passing_score: Yup.number()
      .required(t("assessment.validation.passing_score_required"))
      .positive(t("assessment.validation.passing_score_positive")),
    total_marks: Yup.number()
      .required(t("assessment.validation.total_marks_required"))
      .positive(t("assessment.validation.total_marks_positive")),
    duration: Yup.number()
      .required(t("assessment.validation.duration_required"))
      .positive(t("assessment.validation.duration_positive")),
  });

  // ─── Submit handler ───────────────────────────────────────────────────────
  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("type", "submit");
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("passing_score", values.passing_score);
      formData.append("total_marks", values.total_marks);
      formData.append("duration", values.duration);
      formData.append("program_id", values.programId.value);
      formData.append("level_id", values.levelId.value);

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      // await dispatch(updateAssessment({ id, data: formData })).unwrap();
      // toast.success(t("assessment.messages.updateSuccess"));
      // navigate("/assessment");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("assessment.messages.updateError"));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("assessment.details.deleteTextExam") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleAssessment(id)).unwrap();
      toast.success(t("assessment.messages.deleteSuccess"));
      setTimeout(() => navigate("/assessment"), 1000);
    } catch (error) {
      toast.error(error?.message || t("assessment.messages.deleteError"));
    }
  };

  // ─── Guard: show loader until everything is ready ─────────────────────────
  if (isLoading || !isDataLoaded) {
    return <Loader />;
  }

  // ─── Derived initial values (computed once isDataLoaded = true) ───────────
  const initialFormValues = {
    programId: selectedProgram,
    levelId: selectedLevel,
    title: assessment?.assessment?.title ?? "",
    description: assessment?.assessment?.description ?? "",
    passing_score: assessment?.assessment?.passing_score ?? "",
    total_marks: assessment?.assessment?.total_marks ?? "",
    duration: assessment?.assessment?.duration ?? "",
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("assessment.breadcrumb.examManagement"),
              path: "/exam-levelssment",
            },
            { label: t("assessment.breadcrumb.view-exam") },
          ]}
        />

        <div className="mt-6">
          <Formik
            enableReinitialize={true}
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, values, setFieldValue, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Level Details (Static Level) ─────────────────────────────────────── */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-[18px] text-primary font-[700]">
                      <AiOutlineExclamationCircle />
                    </span>
                    {t("assessment.details.levelDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Program */}
                      <SelectField
                        name="programId"
                        label={t("assessment.details.parentProgram")}
                        placeholder={t(
                          "assessment.details.perentProgramPlaceholder",
                        )}
                        required
                        options={programOptions}
                        isLoading={loadingPrograms}
                        value={values.programId}
                        onChange={(option) => {
                          setFieldValue("programId", option);
                          setFieldValue("levelId", null);
                          setSelectedProgram(option);
                          setSelectedLevel(null);
                          setFilteredLevels([]);
                        }}
                      />

                      {/* Level */}
                      <SelectField
                        name="levelId"
                        label={t("assessment.details.selectLevel")}
                        placeholder={t(
                          "assessment.details.selectLevelPlaceholder",
                        )}
                        required
                        options={levelOptions}
                        disabled={!values.programId}
                        isLoading={loadingLevels}
                        value={values.levelId}
                        onChange={(option) => {
                          setFieldValue("levelId", option);
                          setSelectedLevel(option);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Assessment Details ──────────────────────────────────── */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    {t("assessment.details.assessmentDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="title"
                        label={t("assessment.details.title")}
                        placeholder={t("assessment.details.titlePlaceholder")}
                        required
                      />
                      <TextInput
                        name="duration"
                        label={t("assessment.details.duration")}
                        placeholder={t(
                          "assessment.details.durationPlaceholder",
                        )}
                        type="number"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="total_marks"
                        label={t("assessment.details.totalMarks")}
                        placeholder={t(
                          "assessment.details.totalMarksPlaceholder",
                        )}
                        type="number"
                        required
                      />
                      <TextInput
                        name="passing_score"
                        label={t("assessment.details.passingScore")}
                        placeholder={t(
                          "assessment.details.passingScorePlaceholder",
                        )}
                        type="number"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <TextareaField
                        name="description"
                        label={t("assessment.details.description")}
                        placeholder={t(
                          "assessment.details.descriptionPlaceholder",
                        )}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ── Thumbnail ───────────────────────────────────────────── */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">
                      <FiImage />
                    </span>
                    {t("assessment.details.thumbnail")}
                  </h3>

                  <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />

                    {!thumbnailPreview ? (
                      <div
                        onClick={triggerFileUpload}
                        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
                      >
                        <FiUpload className="text-4xl text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          {t("assessment.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t("assessment.details.uploadSubText")}
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex items-start gap-6">
                          <div className="relative group">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                          <div className="flex-1">
                            {thumbnail ? (
                              <>
                                <p className="text-sm font-semibold text-gray-700 mb-1">
                                  {thumbnail.name}
                                </p>
                                <p className="text-xs text-gray-500 mb-3">
                                  {(thumbnail.size / 1024).toFixed(2)} KB
                                </p>
                              </>
                            ) : (
                              <p className="text-sm font-semibold text-gray-700 mb-3">
                                {t("assessment.details.currentThumbnail")}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              {t("assessment.details.changeImage")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Footer ──────────────────────────────────────────────── */}
                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                    >
                      {t("assessment.actions.deleteExam")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                    >
                      {isSubmitting
                        ? t("assessment.actions.updating")
                        : t("assessment.actions.updateExam")}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </PageLayout>
  );
};

export default AssessmentDetails;
