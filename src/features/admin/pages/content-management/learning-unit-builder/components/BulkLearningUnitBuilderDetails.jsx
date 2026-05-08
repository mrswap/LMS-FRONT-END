// import { useState, useEffect, useRef, memo } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { SelectField } from "../../../../common/form";
// import { AiOutlineExclamationCircle, AiOutlineDelete } from "react-icons/ai";
// import { FiPlus, FiEye, FiTrash2 } from "react-icons/fi";
// import { PageLayout, PageBody } from "../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
// import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
// import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
// import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
// import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
// import Breadcrumb from "../../../../common/layout/Breadcrumb";
// import {
//   deleteSingleContent,
//   getBulkContentById,
//   getContentById,
//   updateBulkContent,
// } from "../../../../../../redux/slice/unitBuilderSlice";
// import { useQuill } from "react-quilljs";
// import { FiImage, FiType } from "react-icons/fi";
// import Loader from "../../../../common/Loader";
// import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
// import usePermission from "../../../../../../hooks/usePermission";
// import PublishedDropdown from "../../../../common/PublishedDropdown";
// import { updatePublishStatus } from "../../../../../../redux/slice/commonSlice";

// const TextEditor = memo(({ value, onChange, id, isActive, t }) => {
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "clean"],
//       ],
//     },
//   });

//   const isFirstRender = useRef(true);
//   const isUpdatingFromProps = useRef(false);

//   useEffect(() => {
//     if (!quill) return;

//     const handleTextChange = () => {
//       if (isUpdatingFromProps.current) {
//         isUpdatingFromProps.current = false;
//         return;
//       }
//       const newValue = quill.root.innerHTML;
//       onChange(newValue);
//     };

//     quill.on("text-change", handleTextChange);
//     return () => {
//       quill.off("text-change", handleTextChange);
//     };
//   }, [quill, onChange]);

//   useEffect(() => {
//     if (!quill) return;

//     if (isFirstRender.current && value) {
//       isUpdatingFromProps.current = true;
//       quill.root.innerHTML = value || "<p><br></p>";
//       isFirstRender.current = false;
//     } else if (!isFirstRender.current && isActive) {
//       const currentValue = quill.root.innerHTML;
//       if (value !== currentValue) {
//         isUpdatingFromProps.current = true;
//         quill.root.innerHTML = value || "<p><br></p>";
//       }
//     }
//   }, [quill, value, isActive]);

//   useEffect(() => {
//     if (!quill) return;
//     if (isActive) {
//       quill.enable();
//     } else {
//       quill.disable();
//     }
//   }, [quill, isActive]);

//   if (!isActive) return null;

//   return (
//     <div className="quill-wrapper" style={{ minHeight: "350px" }}>
//       <div ref={quillRef} style={{ height: "350px" }} />
//     </div>
//   );
// });

// TextEditor.displayName = "TextEditor";

// const BulkLearningUnitBuilderDetails = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const { hasPermission } = usePermission();

//   const { bulkContent: content, isLoading: loading } = useSelector(
//     (state) => state.content,
//   );

//   // console.log("contentcome", content);

//   const { programs } = useSelector((state) => state.program);
//   const { levels } = useSelector((state) => state.level);
//   const { modules } = useSelector((state) => state.module);
//   const { chapters } = useSelector((state) => state.chapter);
//   const { topics } = useSelector((state) => state.topic);
//   const { id } = useParams();

//   const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
//   const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
//   const [isModulesLoaded, setIsModulesLoaded] = useState(false);
//   const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
//   const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [selectedTopic, setSelectedTopic] = useState(null);

//   const [filteredLevels, setFilteredLevels] = useState([]);
//   const [filteredModules, setFilteredModules] = useState([]);
//   const [filteredChapters, setFilteredChapters] = useState([]);
//   const [filteredTopics, setFilteredTopics] = useState([]);

//   const [localContents, setLocalContents] = useState([]);

//   useEffect(() => {
//     if (id) {
//       dispatch(getBulkContentById({ id }));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (content?.topic) {
//       const programVal = {
//         label: content.topic.program.title,
//         value: content.topic.program.id,
//       };
//       const levelVal = {
//         label: content.topic.level.title,
//         value: content.topic.level.id,
//       };
//       const moduleVal = {
//         label: content.topic.module.title,
//         value: content.topic.module.id,
//       };
//       const chapterVal = {
//         label: content.topic.chapter.title,
//         value: content.topic.chapter.id,
//       };
//       const topicVal = {
//         label: content.topic.title,
//         value: content.topic.id,
//       };

//       setSelectedProgram(programVal);
//       setSelectedLevel(levelVal);
//       setSelectedModule(moduleVal);
//       setSelectedChapter(chapterVal);
//       setSelectedTopic(topicVal);
//     }
//   }, [content]);

//   useEffect(() => {
//     if (content && !isProgramsLoaded) {
//       const loadPrograms = async () => {
//         await dispatch(getAllPrograms());
//         setIsProgramsLoaded(true);
//       };
//       loadPrograms();
//     }
//   }, [content, isProgramsLoaded, dispatch]);

//   useEffect(() => {
//     if (isProgramsLoaded && selectedProgram && !isLevelsLoaded) {
//       const loadLevels = async () => {
//         await dispatch(getAllLevels());
//         setIsLevelsLoaded(true);
//       };
//       loadLevels();
//     }
//   }, [selectedProgram, isProgramsLoaded, isLevelsLoaded, dispatch]);

//   useEffect(() => {
//     if (isLevelsLoaded && selectedLevel && !isModulesLoaded) {
//       const loadModules = async () => {
//         await dispatch(getAllModules());
//         setIsModulesLoaded(true);
//       };
//       loadModules();
//     }
//   }, [selectedLevel, isLevelsLoaded, isModulesLoaded, dispatch]);

//   useEffect(() => {
//     if (isModulesLoaded && selectedModule && !isChaptersLoaded) {
//       const loadChapters = async () => {
//         await dispatch(getAllChapters());
//         setIsChaptersLoaded(true);
//       };
//       loadChapters();
//     }
//   }, [selectedModule, isModulesLoaded, isChaptersLoaded, dispatch]);

//   useEffect(() => {
//     if (isChaptersLoaded && selectedChapter && !isTopicsLoaded) {
//       const loadTopics = async () => {
//         await dispatch(getAllTopics());
//         setIsTopicsLoaded(true);
//       };
//       loadTopics();
//     }
//   }, [selectedChapter, isChaptersLoaded, isTopicsLoaded, dispatch]);

//   useEffect(() => {
//     if (content?.data && Array.isArray(content.data)) {
//       const contentsArray = content.data.map((item) => ({
//         id: item.id,
//         type: item.type || "text",
//         title: item.title || "",
//         content: item.content || "",
//         media_shortcut: item.media_shortcode || item.media_shortcut || "",
//         order: item.order || 1,
//         isFromApi: true, // Mark that this came from API
//         publish_status: item.publish_status || "",
//       }));
//       // Sort by order
//       contentsArray.sort((a, b) => a.order - b.order);
//       setLocalContents(contentsArray);
//     }
//   }, [content]);

//   // Add new section handler
//   const handleAddSection = () => {
//     const newSection = {
//       id: null, // New section won't have an ID until saved
//       type: "text",
//       title: "",
//       content: "",
//       media_shortcut: "",
//       order: localContents.length + 1,
//       isFromApi: false, // Mark that this is a new local section
//     };
//     setLocalContents((prev) => [...prev, newSection]);

//     // Scroll to the new section
//     setTimeout(() => {
//       const newSectionElement = document.getElementById(
//         `section-${localContents.length}`,
//       );
//       if (newSectionElement) {
//         newSectionElement.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }
//     }, 100);
//   };

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

//   useEffect(() => {
//     if (selectedModule && chapters?.data && isChaptersLoaded) {
//       const moduleChapters = chapters.data.filter((chapter) => {
//         return (
//           chapter.module_id === selectedModule.value ||
//           chapter.moduleId === selectedModule.value ||
//           chapter.module?.id === selectedModule.value
//         );
//       });
//       setFilteredChapters(moduleChapters);
//     } else {
//       setFilteredChapters([]);
//     }
//   }, [selectedModule, chapters, isChaptersLoaded]);

//   useEffect(() => {
//     if (selectedChapter && topics?.data && isTopicsLoaded) {
//       const chapterTopics = topics.data.filter((topic) => {
//         return (
//           topic.chapter_id === selectedChapter.value ||
//           topic.chapterId === selectedChapter.value ||
//           topic.chapter?.id === selectedChapter.value
//         );
//       });
//       setFilteredTopics(chapterTopics);
//     } else {
//       setFilteredTopics([]);
//     }
//   }, [selectedChapter, topics, isTopicsLoaded]);

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

//   const chapterOptions =
//     filteredChapters.map((chapter) => ({
//       label: chapter.title,
//       value: chapter.id,
//     })) || [];

//   const topicOptions =
//     filteredTopics.map((topic) => ({
//       label: topic.title,
//       value: topic.id,
//     })) || [];

//   const initialValues = {
//     programName: selectedProgram,
//     levelName: selectedLevel,
//     moduleName: selectedModule,
//     chapterName: selectedChapter,
//     topicName: selectedTopic,
//   };

//   const validationSchema = Yup.object({
//     programName: Yup.object()
//       .nullable()
//       .required(t("learningUnitBuilder.validation.programRequired")),
//     levelName: Yup.object()
//       .nullable()
//       .required(t("learningUnitBuilder.validation.levelRequired")),
//     moduleName: Yup.object()
//       .nullable()
//       .required(t("learningUnitBuilder.validation.moduleRequired")),
//     chapterName: Yup.object()
//       .nullable()
//       .required(t("learningUnitBuilder.validation.chapterRequired")),
//     topicName: Yup.object()
//       .nullable()
//       .required(t("learningUnitBuilder.validation.topicRequired")),
//   });

//   const handleContentChange = (index, field, value) => {
//     setLocalContents((prev) => {
//       const updated = [...prev];
//       updated[index] = {
//         ...updated[index],
//         [field]: value,
//       };
//       return updated;
//     });
//   };

//   const handleTypeChange = (index, newType) => {
//     setLocalContents((prev) => {
//       const updated = [...prev];
//       updated[index] = {
//         ...updated[index],
//         type: newType,
//         ...(newType === "text" ? { media_shortcut: "" } : {}),
//       };
//       return updated;
//     });
//   };

//   // Preview handler - navigate to single content view
//   const handlePreview = (contentId) => {
//     if (contentId) {
//       navigate(`/learning-unit/preview/${id}/${contentId}`);
//     }
//   };

//   // Delete content handler
//   const handleDeleteContent = async (index, contentId) => {
//     // If it's a new section (no ID), just remove from local state
//     if (!contentId) {
//       setLocalContents((prev) => prev.filter((_, i) => i !== index));
//       toast.success(t("learningUnitBuilder.success.delete"));
//       return;
//     }

//     // If it's an existing section, call API
//     const ok = await dispatch(
//       showConfirm({ message: t("learningUnitBuilder.details.deleteText") }),
//     );

//     if (!ok) return;

//     try {
//       await dispatch(
//         deleteSingleContent({ topicId: id, id: contentId }),
//       ).unwrap();
//       toast.success(t("learningUnitBuilder.success.delete"));
//       dispatch(getBulkContentById({ id }));
//     } catch (error) {
//       toast.error(error?.message || t("learningUnitBuilder.error.delete"));
//     }
//   };

//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const apiSections = localContents.map((section, index) => {
//         const apiSection = {
//           id: section.id, // IMPORTANT (update ke liye) - null for new sections
//           type: section.type,
//           title: section.title,
//           content:
//             section.type === "text" ? section.content : section.content || "",
//           order: index + 1,
//         };

//         if (section.type === "media" && section.media_shortcut) {
//           apiSection.meta = {
//             shortcode: section.media_shortcut,
//           };
//         }

//         return apiSection;
//       });

//       const payload = {
//         topic_id: values.topicName.value,
//         sections: apiSections,
//       };

//       const res = await dispatch(
//         updateBulkContent({
//           topicId: values.topicName.value,
//           data: payload,
//         }),
//       ).unwrap();

//       toast.success(t("learningUnitBuilder.success.update"));
//       navigate("/topics");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || t("learningUnitBuilder.error.update"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading && !content) {
//     return <Loader />;
//   }

//   if (!content && !loading) {
//     return (
//       <PageLayout>
//         <div className="p-8 rounded-lg border border-gray-300">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-gray-500">
//               {t("learningUnitBuilder.noContentFound")}
//             </div>
//           </div>
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("topic.list.title"),
//               path: "/topics",
//             },
//             {
//               label: t("learningUnitBuilder.breadcrumb.editContent"),
//             },
//           ]}
//         />

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
//               return (
//                 <Form onSubmit={handleSubmit} className="space-y-8">
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                       <span className="text-[18px] text-primary font-[700]">
//                         <AiOutlineExclamationCircle />
//                       </span>
//                       {t("learningUnitBuilder.details.generalDetails")}
//                     </h3>

//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                         <div>
//                           <SelectField
//                             name="programName"
//                             label={t(
//                               "learningUnitBuilder.details.parentProgram",
//                             )}
//                             placeholder={t(
//                               "learningUnitBuilder.details.parentProgramPlaceholder",
//                             )}
//                             required={true}
//                             options={programOptions}
//                             value={values.programName}
//                             onChange={(option) => {
//                               setFieldValue("programName", option);
//                               setFieldValue("levelName", null);
//                               setFieldValue("moduleName", null);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicName", null);
//                               setSelectedProgram(option);
//                               setSelectedLevel(null);
//                               setSelectedModule(null);
//                               setSelectedChapter(null);
//                               setSelectedTopic(null);
//                               setIsLevelsLoaded(false);
//                               setIsModulesLoaded(false);
//                               setIsChaptersLoaded(false);
//                               setIsTopicsLoaded(false);
//                             }}
//                           />
//                         </div>

//                         <div>
//                           <SelectField
//                             name="levelName"
//                             label={t("learningUnitBuilder.details.parentLevel")}
//                             placeholder={t(
//                               "learningUnitBuilder.details.parentLevelPlaceholder",
//                             )}
//                             required={true}
//                             options={levelOptions}
//                             disabled={!values.programName || !isProgramsLoaded}
//                             isLoading={!isLevelsLoaded && selectedProgram}
//                             value={values.levelName}
//                             onChange={(option) => {
//                               setFieldValue("levelName", option);
//                               setFieldValue("moduleName", null);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicName", null);
//                               setSelectedLevel(option);
//                               setSelectedModule(null);
//                               setSelectedChapter(null);
//                               setSelectedTopic(null);
//                               setIsModulesLoaded(false);
//                               setIsChaptersLoaded(false);
//                               setIsTopicsLoaded(false);
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                         <div>
//                           <SelectField
//                             name="moduleName"
//                             label={t(
//                               "learningUnitBuilder.details.parentModule",
//                             )}
//                             placeholder={t(
//                               "learningUnitBuilder.details.parentModulePlaceholder",
//                             )}
//                             required={true}
//                             options={moduleOptions}
//                             disabled={!values.levelName || !isLevelsLoaded}
//                             isLoading={!isModulesLoaded && selectedLevel}
//                             value={values.moduleName}
//                             onChange={(option) => {
//                               setFieldValue("moduleName", option);
//                               setFieldValue("chapterName", null);
//                               setFieldValue("topicName", null);
//                               setSelectedModule(option);
//                               setSelectedChapter(null);
//                               setSelectedTopic(null);
//                               setIsChaptersLoaded(false);
//                               setIsTopicsLoaded(false);
//                             }}
//                           />
//                         </div>

//                         <div>
//                           <SelectField
//                             name="chapterName"
//                             label={t(
//                               "learningUnitBuilder.details.parentChapter",
//                             )}
//                             placeholder={t(
//                               "learningUnitBuilder.details.parentChapterPlaceholder",
//                             )}
//                             required={true}
//                             options={chapterOptions}
//                             disabled={!values.moduleName || !isModulesLoaded}
//                             isLoading={!isChaptersLoaded && selectedModule}
//                             value={values.chapterName}
//                             onChange={(option) => {
//                               setFieldValue("chapterName", option);
//                               setFieldValue("topicName", null);
//                               setSelectedChapter(option);
//                               setSelectedTopic(null);
//                               setIsTopicsLoaded(false);
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                         <div>
//                           <SelectField
//                             name="topicName"
//                             label={t("learningUnitBuilder.details.parentTopic")}
//                             placeholder={t(
//                               "learningUnitBuilder.details.parentTopicPlaceholder",
//                             )}
//                             required={true}
//                             options={topicOptions}
//                             disabled={!values.chapterName || !isChaptersLoaded}
//                             isLoading={!isTopicsLoaded && selectedChapter}
//                             value={values.topicName}
//                             onChange={(option) => {
//                               setFieldValue("topicName", option);
//                               setSelectedTopic(option);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Multiple Content Sections */}
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                       <span className="text-[18px] text-primary font-[700]">
//                         <AiOutlineExclamationCircle />
//                       </span>
//                       {t("learningUnitBuilder.details.content.content")}
//                     </h3>

//                     {localContents.map(
//                       (item, index) => (
//                         console.log("item", item),
//                         (
//                           <div
//                             id={`section-${index}`}
//                             key={item.id || `new-${index}`}
//                             className="mb-8 border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
//                           >
//                             {/* Action Buttons - Top Right Section */}
//                             <div className="absolute top-4 right-4 flex gap-2">
//                               {/* Published Dropdown */}
//                               <div onClick={(e) => e.preventDefault()}>
//                                 <PublishedDropdown
//                                   value={item?.publish_status}
//                                   onToggle={async (newStatus) => {
//                                     await dispatch(
//                                       updatePublishStatus({
//                                         type: "topic_content",
//                                         id: item.id,
//                                         publish_status: newStatus,
//                                       }),
//                                     ).unwrap();
//                                     dispatch(getBulkContentById({ id }));
//                                   }}
//                                 />
//                               </div>

//                               {/* Preview Button - Only for API content */}
//                               {hasPermission("content-preview") &&
//                                 item.isFromApi &&
//                                 item.id && (
//                                   <button
//                                     type="button"
//                                     onClick={() => handlePreview(item.id)}
//                                     className="flex items-center gap-1 px-3 py-1 text-xs font-semibold cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
//                                     title={t(
//                                       "learningUnitBuilder.details.content.preview",
//                                     )}
//                                   >
//                                     <FiEye size={18} />
//                                     <span className="text-sm">
//                                       {t(
//                                         "learningUnitBuilder.details.content.preview",
//                                       )}
//                                     </span>
//                                   </button>
//                                 )}

//                               {/* Delete Button */}
//                               {hasPermission("content.delete") && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDeleteContent(index, item.id)
//                                   }
//                                   className="text-red-500 hover:text-red-700 cursor-pointer transition-colors p-1 rounded-full hover:bg-red-50"
//                                   title={t(
//                                     "learningUnitBuilder.details.content.delete",
//                                   )}
//                                 >
//                                   <FiTrash2 size={18} />
//                                 </button>
//                               )}
//                             </div>

//                             <div className="mb-4">
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Order : {item.order}
//                               </label>
//                               <div className="flex gap-4">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleTypeChange(index, "text")
//                                   }
//                                   className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//                                     item.type === "text"
//                                       ? "bg-blue-500 text-white"
//                                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                   }`}
//                                 >
//                                   <FiType size={16} />
//                                   {t(
//                                     "learningUnitBuilder.details.content.text",
//                                   )}
//                                 </button>
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleTypeChange(index, "media")
//                                   }
//                                   className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
//                                     item.type === "media"
//                                       ? "bg-blue-500 text-white"
//                                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                                   }`}
//                                 >
//                                   <FiImage size={16} />
//                                   {t(
//                                     "learningUnitBuilder.details.content.media",
//                                   )}
//                                 </button>
//                               </div>
//                             </div>

//                             <div className="mb-4">
//                               <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 {t(
//                                   "learningUnitBuilder.details.content.sectionTitle",
//                                 )}
//                               </label>
//                               <input
//                                 type="text"
//                                 value={item.title}
//                                 maxLength={150}
//                                 onChange={(e) =>
//                                   handleContentChange(
//                                     index,
//                                     "title",
//                                     e.target.value,
//                                   )
//                                 }
//                                 placeholder={t(
//                                   "learningUnitBuilder.details.content.sectionTitlePlaceholder",
//                                 )}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                               />
//                             </div>

//                             {item.type === "text" ? (
//                               <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                   {t(
//                                     "learningUnitBuilder.details.content.content",
//                                   )}
//                                 </label>
//                                 <TextEditor
//                                   key={`text-editor-${index}`}
//                                   id={`content-editor-${index}`}
//                                   value={item.content}
//                                   onChange={(value) =>
//                                     handleContentChange(index, "content", value)
//                                   }
//                                   isActive={true}
//                                   t={t}
//                                 />
//                               </div>
//                             ) : (
//                               <>
//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     {t(
//                                       "learningUnitBuilder.details.content.mediaShortcut",
//                                     )}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={item.media_shortcut}
//                                     maxLength={250}
//                                     onChange={(e) =>
//                                       handleContentChange(
//                                         index,
//                                         "media_shortcut",
//                                         e.target.value,
//                                       )
//                                     }
//                                     placeholder={t(
//                                       "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
//                                     )}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                   />
//                                 </div>

//                                 <div className="mb-4">
//                                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     {t(
//                                       "learningUnitBuilder.details.content.description",
//                                     )}
//                                   </label>
//                                   <TextEditor
//                                     key={`media-editor-${index}`}
//                                     id={`media-editor-${index}`}
//                                     value={item.content}
//                                     onChange={(value) =>
//                                       handleContentChange(
//                                         index,
//                                         "content",
//                                         value,
//                                       )
//                                     }
//                                     isActive={true}
//                                     t={t}
//                                   />
//                                 </div>

//                                 {item.media_shortcut && (
//                                   <div className="mt-2 p-2 bg-gray-100 rounded">
//                                     <p className="text-xs text-gray-500 mb-1">
//                                       {t(
//                                         "learningUnitBuilder.details.content.preview",
//                                       )}
//                                       :
//                                     </p>
//                                     {item.media_shortcut.match(
//                                       /\.(jpeg|jpg|gif|png|webp)$/i,
//                                     ) ? (
//                                       <img
//                                         src={item.media_shortcut}
//                                         alt="Preview"
//                                         className="mt-1 max-h-32 object-contain"
//                                         onError={(e) =>
//                                           (e.target.style.display = "none")
//                                         }
//                                       />
//                                     ) : item.media_shortcut.match(
//                                         /\.(mp4|webm|ogg)$/i,
//                                       ) ? (
//                                       <video
//                                         src={item.media_shortcut}
//                                         controls
//                                         className="mt-1 max-h-32"
//                                       />
//                                     ) : (
//                                       <p className="text-xs text-gray-600">
//                                         {t(
//                                           "learningUnitBuilder.details.content.media",
//                                         )}
//                                         : {item.media_shortcut}
//                                       </p>
//                                     )}
//                                   </div>
//                                 )}
//                               </>
//                             )}
//                           </div>
//                         )
//                       ),
//                     )}

//                     {/* Add Section Button - Bottom */}
//                     <div className="flex justify-center mt-6 mb-4">
//                       <button
//                         type="button"
//                         onClick={handleAddSection}
//                         className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
//                       >
//                         <FiPlus size={18} />
//                         {t(
//                           "learningUnitBuilder.details.content.addButtonSection",
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex justify-end items-center pt-4">
//                     <div className="flex gap-3">
//                       {hasPermission("content.bulk-edit") && (
//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                         >
//                           {isSubmitting
//                             ? t("learningUnitBuilder.actions.updating")
//                             : t("learningUnitBuilder.actions.updateContent")}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default BulkLearningUnitBuilderDetails;

import { useState, useEffect, useRef, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle, AiOutlineDelete } from "react-icons/ai";
import { FiPlus, FiEye, FiTrash2 } from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import {
  deleteSingleContent,
  getBulkContentById,
  getContentById,
  updateBulkContent,
} from "../../../../../../redux/slice/unitBuilderSlice";
import { FiImage, FiType } from "react-icons/fi";
import Loader from "../../../../common/Loader";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import usePermission from "../../../../../../hooks/usePermission";
import PublishedDropdown from "../../../../common/PublishedDropdown";
import { updatePublishStatus } from "../../../../../../redux/slice/commonSlice";

// TipTap Editor Imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  FiBold,
  FiItalic,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiTable,
  FiLink as FiLinkIcon,
} from "react-icons/fi";

// ─── TipTap Text Editor with Table Support ─────────────────────────────────────────────
const TextEditor = memo(({ value, onChange, id, isActive, t }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder:
          t("learningUnitBuilder.details.content.editorPlaceholder") ||
          "Write something...",
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "min-w-full border-collapse",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value || "",
    editable: isActive,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Update content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isActive);
    }
  }, [editor, isActive]);

  // Toolbar functions
  const addTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");
    if (rows && cols) {
      editor
        ?.chain()
        .focus()
        .insertTable({
          rows: parseInt(rows),
          cols: parseInt(cols),
          withHeaderRow: true,
        })
        .run();
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!isActive) return null;

  return (
    <div className="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="toolbar border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("bold") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Bold"
        >
          <FiBold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("italic") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Italic"
        >
          <FiItalic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("underline") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Underline"
        >
          <span className="underline text-sm">U</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headers */}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "paragraph") {
              editor?.chain().focus().setParagraph().run();
            } else {
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: parseInt(value) })
                .run();
            }
          }}
          className="p-1 rounded border border-gray-300 text-sm bg-white"
          value={(() => {
            if (editor?.isActive("heading", { level: 1 })) return "1";
            if (editor?.isActive("heading", { level: 2 })) return "2";
            if (editor?.isActive("heading", { level: 3 })) return "3";
            if (editor?.isActive("heading", { level: 4 })) return "4";
            return "paragraph";
          })()}
        >
          <option value="paragraph">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("bulletList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Bullet List"
        >
          <FiList size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("orderedList") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Numbered List"
        >
          <span className="font-bold text-sm">1.</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive({ textAlign: "left" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Align Left"
        >
          <FiAlignLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive({ textAlign: "center" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Align Center"
        >
          <FiAlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive({ textAlign: "right" }) ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Align Right"
        >
          <FiAlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Table */}
        <button
          type="button"
          onClick={addTable}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Insert Table"
        >
          <FiTable size={16} />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
          title="Insert Image"
        >
          <FiImage size={16} />
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor?.isActive("link") ? "bg-gray-200 text-blue-600" : "text-gray-700"}`}
          title="Insert Link"
        >
          <FiLinkIcon size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Table Row/Column Operations (only show when inside a table) */}
        {editor?.isActive("table") && (
          <>
            <button
              type="button"
              onClick={() => editor?.chain().focus().addRowBefore().run()}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
              title="Add Row Above"
            >
              + Row ↑
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
              title="Add Row Below"
            >
              + Row ↓
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().addColumnBefore().run()}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
              title="Add Column Left"
            >
              + Col ←
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
              title="Add Column Right"
            >
              + Col →
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().deleteRow().run()}
              className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
              title="Delete Row"
            >
              - Row
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
              title="Delete Column"
            >
              - Col
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().deleteTable().run()}
              className="p-2 rounded hover:bg-red-100 transition-colors text-red-600 text-xs font-medium"
              title="Delete Table"
            >
              Delete Table
            </button>
          </>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="tiptap-content" />

      <style>{`
        .tiptap-content .ProseMirror {
          min-height: 300px;
          padding: 1rem;
        }
        .tiptap-content .ProseMirror:focus {
          outline: none;
        }
        .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .tiptap-content td,
        .tiptap-content th {
          border: 1px solid #ddd;
          padding: 8px;
          position: relative;
        }
        .tiptap-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .tiptap-content .selectedCell {
          background-color: #e0f2fe;
        }
        .tiptap-content p {
          margin: 0 0 1rem;
        }
        .tiptap-content ul, 
        .tiptap-content ol {
          padding-left: 1.5rem;
          margin: 0 0 1rem;
        }
        .tiptap-content li {
          margin: 0.25rem 0;
        }
        .tiptap-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .tiptap-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        .tiptap-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.75rem 0 0.5rem;
        }
        .tiptap-content img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
          border-radius: 0.5rem;
        }
        .tiptap-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
});

TextEditor.displayName = "TextEditor";

// ─── Main Component ───────────────────────────────────────────────────────────
const BulkLearningUnitBuilderDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { bulkContent: content, isLoading: loading } = useSelector(
    (state) => state.content,
  );

  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);
  const { id } = useParams();

  const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  const [localContents, setLocalContents] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getBulkContentById({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (content?.topic) {
      const programVal = {
        label: content.topic.program.title,
        value: content.topic.program.id,
      };
      const levelVal = {
        label: content.topic.level.title,
        value: content.topic.level.id,
      };
      const moduleVal = {
        label: content.topic.module.title,
        value: content.topic.module.id,
      };
      const chapterVal = {
        label: content.topic.chapter.title,
        value: content.topic.chapter.id,
      };
      const topicVal = {
        label: content.topic.title,
        value: content.topic.id,
      };

      setSelectedProgram(programVal);
      setSelectedLevel(levelVal);
      setSelectedModule(moduleVal);
      setSelectedChapter(chapterVal);
      setSelectedTopic(topicVal);
    }
  }, [content]);

  useEffect(() => {
    if (content && !isProgramsLoaded) {
      const loadPrograms = async () => {
        await dispatch(getAllPrograms());
        setIsProgramsLoaded(true);
      };
      loadPrograms();
    }
  }, [content, isProgramsLoaded, dispatch]);

  useEffect(() => {
    if (isProgramsLoaded && selectedProgram && !isLevelsLoaded) {
      const loadLevels = async () => {
        await dispatch(getAllLevels());
        setIsLevelsLoaded(true);
      };
      loadLevels();
    }
  }, [selectedProgram, isProgramsLoaded, isLevelsLoaded, dispatch]);

  useEffect(() => {
    if (isLevelsLoaded && selectedLevel && !isModulesLoaded) {
      const loadModules = async () => {
        await dispatch(getAllModules());
        setIsModulesLoaded(true);
      };
      loadModules();
    }
  }, [selectedLevel, isLevelsLoaded, isModulesLoaded, dispatch]);

  useEffect(() => {
    if (isModulesLoaded && selectedModule && !isChaptersLoaded) {
      const loadChapters = async () => {
        await dispatch(getAllChapters());
        setIsChaptersLoaded(true);
      };
      loadChapters();
    }
  }, [selectedModule, isModulesLoaded, isChaptersLoaded, dispatch]);

  useEffect(() => {
    if (isChaptersLoaded && selectedChapter && !isTopicsLoaded) {
      const loadTopics = async () => {
        await dispatch(getAllTopics());
        setIsTopicsLoaded(true);
      };
      loadTopics();
    }
  }, [selectedChapter, isChaptersLoaded, isTopicsLoaded, dispatch]);

  useEffect(() => {
    if (content?.data && Array.isArray(content.data)) {
      const contentsArray = content.data.map((item) => ({
        id: item.id,
        type: item.type || "text",
        title: item.title || "",
        content: item.content || "",
        media_shortcut: item.media_shortcode || item.media_shortcut || "",
        order: item.order || 1,
        isFromApi: true,
        publish_status: item.publish_status || "",
      }));
      contentsArray.sort((a, b) => a.order - b.order);
      setLocalContents(contentsArray);
    }
  }, [content]);

  const handleAddSection = () => {
    const newSection = {
      id: null,
      type: "text",
      title: "",
      content: "",
      media_shortcut: "",
      order: localContents.length + 1,
      isFromApi: false,
    };
    setLocalContents((prev) => [...prev, newSection]);

    setTimeout(() => {
      const newSectionElement = document.getElementById(
        `section-${localContents.length}`,
      );
      if (newSectionElement) {
        newSectionElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

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

  useEffect(() => {
    if (selectedModule && chapters?.data && isChaptersLoaded) {
      const moduleChapters = chapters.data.filter((chapter) => {
        return (
          chapter.module_id === selectedModule.value ||
          chapter.moduleId === selectedModule.value ||
          chapter.module?.id === selectedModule.value
        );
      });
      setFilteredChapters(moduleChapters);
    } else {
      setFilteredChapters([]);
    }
  }, [selectedModule, chapters, isChaptersLoaded]);

  useEffect(() => {
    if (selectedChapter && topics?.data && isTopicsLoaded) {
      const chapterTopics = topics.data.filter((topic) => {
        return (
          topic.chapter_id === selectedChapter.value ||
          topic.chapterId === selectedChapter.value ||
          topic.chapter?.id === selectedChapter.value
        );
      });
      setFilteredTopics(chapterTopics);
    } else {
      setFilteredTopics([]);
    }
  }, [selectedChapter, topics, isTopicsLoaded]);

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

  const chapterOptions =
    filteredChapters.map((chapter) => ({
      label: chapter.title,
      value: chapter.id,
    })) || [];

  const topicOptions =
    filteredTopics.map((topic) => ({
      label: topic.title,
      value: topic.id,
    })) || [];

  const initialValues = {
    programName: selectedProgram,
    levelName: selectedLevel,
    moduleName: selectedModule,
    chapterName: selectedChapter,
    topicName: selectedTopic,
  };

  const validationSchema = Yup.object({
    programName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.programRequired")),
    levelName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.levelRequired")),
    moduleName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.moduleRequired")),
    chapterName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.chapterRequired")),
    topicName: Yup.object()
      .nullable()
      .required(t("learningUnitBuilder.validation.topicRequired")),
  });

  const handleContentChange = (index, field, value) => {
    setLocalContents((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleTypeChange = (index, newType) => {
    setLocalContents((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        type: newType,
        ...(newType === "text" ? { media_shortcut: "" } : {}),
      };
      return updated;
    });
  };

  const handlePreview = (contentId) => {
    if (contentId) {
      navigate(`/learning-unit/preview/${id}/${contentId}`);
    }
  };

  const handleDeleteContent = async (index, contentId) => {
    if (!contentId) {
      setLocalContents((prev) => prev.filter((_, i) => i !== index));
      toast.success(t("learningUnitBuilder.success.delete"));
      return;
    }

    const ok = await dispatch(
      showConfirm({ message: t("learningUnitBuilder.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(
        deleteSingleContent({ topicId: id, id: contentId }),
      ).unwrap();
      toast.success(t("learningUnitBuilder.success.delete"));
      dispatch(getBulkContentById({ id }));
    } catch (error) {
      toast.error(error?.message || t("learningUnitBuilder.error.delete"));
    }
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const apiSections = localContents.map((section, index) => {
        const apiSection = {
          id: section.id,
          type: section.type,
          title: section.title,
          content:
            section.type === "text" ? section.content : section.content || "",
          order: index + 1,
        };

        if (section.type === "media" && section.media_shortcut) {
          apiSection.meta = {
            shortcode: section.media_shortcut,
          };
        }

        return apiSection;
      });

      const payload = {
        topic_id: values.topicName.value,
        sections: apiSections,
      };

      const res = await dispatch(
        updateBulkContent({
          topicId: values.topicName.value,
          data: payload,
        }),
      ).unwrap();

      toast.success(t("learningUnitBuilder.success.update"));
      navigate("/topics");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("learningUnitBuilder.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !content) {
    return <Loader />;
  }

  if (!content && !loading) {
    return (
      <PageLayout>
        <div className="p-8 rounded-lg border border-gray-300">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">
              {t("learningUnitBuilder.noContentFound")}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("topic.list.title"),
              path: "/topics",
            },
            {
              label: t("learningUnitBuilder.breadcrumb.editContent"),
            },
          ]}
        />

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.generalDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <SelectField
                            name="programName"
                            label={t(
                              "learningUnitBuilder.details.parentProgram",
                            )}
                            placeholder={t(
                              "learningUnitBuilder.details.parentProgramPlaceholder",
                            )}
                            required={true}
                            options={programOptions}
                            value={values.programName}
                            onChange={(option) => {
                              setFieldValue("programName", option);
                              setFieldValue("levelName", null);
                              setFieldValue("moduleName", null);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedProgram(option);
                              setSelectedLevel(null);
                              setSelectedModule(null);
                              setSelectedChapter(null);
                              setSelectedTopic(null);
                              setIsLevelsLoaded(false);
                              setIsModulesLoaded(false);
                              setIsChaptersLoaded(false);
                              setIsTopicsLoaded(false);
                            }}
                          />
                        </div>

                        <div>
                          <SelectField
                            name="levelName"
                            label={t("learningUnitBuilder.details.parentLevel")}
                            placeholder={t(
                              "learningUnitBuilder.details.parentLevelPlaceholder",
                            )}
                            required={true}
                            options={levelOptions}
                            disabled={!values.programName || !isProgramsLoaded}
                            isLoading={!isLevelsLoaded && selectedProgram}
                            value={values.levelName}
                            onChange={(option) => {
                              setFieldValue("levelName", option);
                              setFieldValue("moduleName", null);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedLevel(option);
                              setSelectedModule(null);
                              setSelectedChapter(null);
                              setSelectedTopic(null);
                              setIsModulesLoaded(false);
                              setIsChaptersLoaded(false);
                              setIsTopicsLoaded(false);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <SelectField
                            name="moduleName"
                            label={t(
                              "learningUnitBuilder.details.parentModule",
                            )}
                            placeholder={t(
                              "learningUnitBuilder.details.parentModulePlaceholder",
                            )}
                            required={true}
                            options={moduleOptions}
                            disabled={!values.levelName || !isLevelsLoaded}
                            isLoading={!isModulesLoaded && selectedLevel}
                            value={values.moduleName}
                            onChange={(option) => {
                              setFieldValue("moduleName", option);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedModule(option);
                              setSelectedChapter(null);
                              setSelectedTopic(null);
                              setIsChaptersLoaded(false);
                              setIsTopicsLoaded(false);
                            }}
                          />
                        </div>

                        <div>
                          <SelectField
                            name="chapterName"
                            label={t(
                              "learningUnitBuilder.details.parentChapter",
                            )}
                            placeholder={t(
                              "learningUnitBuilder.details.parentChapterPlaceholder",
                            )}
                            required={true}
                            options={chapterOptions}
                            disabled={!values.moduleName || !isModulesLoaded}
                            isLoading={!isChaptersLoaded && selectedModule}
                            value={values.chapterName}
                            onChange={(option) => {
                              setFieldValue("chapterName", option);
                              setFieldValue("topicName", null);
                              setSelectedChapter(option);
                              setSelectedTopic(null);
                              setIsTopicsLoaded(false);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        <div>
                          <SelectField
                            name="topicName"
                            label={t("learningUnitBuilder.details.parentTopic")}
                            placeholder={t(
                              "learningUnitBuilder.details.parentTopicPlaceholder",
                            )}
                            required={true}
                            options={topicOptions}
                            disabled={!values.chapterName || !isChaptersLoaded}
                            isLoading={!isTopicsLoaded && selectedChapter}
                            value={values.topicName}
                            onChange={(option) => {
                              setFieldValue("topicName", option);
                              setSelectedTopic(option);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multiple Content Sections */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.content.content")}
                    </h3>

                    {localContents.map((item, index) => (
                      <div
                        id={`section-${index}`}
                        key={item.id || `new-${index}`}
                        className="mb-8 border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                      >
                        {/* Action Buttons - Top Right Section */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          {/* Published Dropdown */}
                          <div onClick={(e) => e.preventDefault()}>
                            <PublishedDropdown
                              value={item?.publish_status}
                              onToggle={async (newStatus) => {
                                await dispatch(
                                  updatePublishStatus({
                                    type: "topic_content",
                                    id: item.id,
                                    publish_status: newStatus,
                                  }),
                                ).unwrap();
                                dispatch(getBulkContentById({ id }));
                              }}
                            />
                          </div>

                          {/* Preview Button - Only for API content */}
                          {hasPermission("content-preview") &&
                            item.isFromApi &&
                            item.id && (
                              <button
                                type="button"
                                onClick={() => handlePreview(item.id)}
                                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                                title={t(
                                  "learningUnitBuilder.details.content.preview",
                                )}
                              >
                                <FiEye size={18} />
                                <span className="text-sm">
                                  {t(
                                    "learningUnitBuilder.details.content.preview",
                                  )}
                                </span>
                              </button>
                            )}

                          {/* Delete Button */}
                          {hasPermission("content.delete") && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteContent(index, item.id)
                              }
                              className="text-red-500 hover:text-red-700 cursor-pointer transition-colors p-1 rounded-full hover:bg-red-50"
                              title={t(
                                "learningUnitBuilder.details.content.delete",
                              )}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order : {item.order}
                          </label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => handleTypeChange(index, "text")}
                              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                item.type === "text"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <FiType size={16} />
                              {t("learningUnitBuilder.details.content.text")}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTypeChange(index, "media")}
                              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                item.type === "media"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <FiImage size={16} />
                              {t("learningUnitBuilder.details.content.media")}
                            </button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t(
                              "learningUnitBuilder.details.content.sectionTitle",
                            )}
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            maxLength={150}
                            onChange={(e) =>
                              handleContentChange(
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder={t(
                              "learningUnitBuilder.details.content.sectionTitlePlaceholder",
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {item.type === "text" ? (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t("learningUnitBuilder.details.content.content")}
                            </label>
                            <TextEditor
                              key={`text-editor-${index}`}
                              id={`content-editor-${index}`}
                              value={item.content}
                              onChange={(value) =>
                                handleContentChange(index, "content", value)
                              }
                              isActive={true}
                              t={t}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t(
                                  "learningUnitBuilder.details.content.mediaShortcut",
                                )}
                              </label>
                              <input
                                type="text"
                                value={item.media_shortcut}
                                maxLength={250}
                                onChange={(e) =>
                                  handleContentChange(
                                    index,
                                    "media_shortcut",
                                    e.target.value,
                                  )
                                }
                                placeholder={t(
                                  "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
                                )}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t(
                                  "learningUnitBuilder.details.content.description",
                                )}
                              </label>
                              <TextEditor
                                key={`media-editor-${index}`}
                                id={`media-editor-${index}`}
                                value={item.content}
                                onChange={(value) =>
                                  handleContentChange(index, "content", value)
                                }
                                isActive={true}
                                t={t}
                              />
                            </div>

                            {item.media_shortcut && (
                              <div className="mt-2 p-2 bg-gray-100 rounded">
                                <p className="text-xs text-gray-500 mb-1">
                                  {t(
                                    "learningUnitBuilder.details.content.preview",
                                  )}
                                  :
                                </p>
                                {item.media_shortcut.match(
                                  /\.(jpeg|jpg|gif|png|webp)$/i,
                                ) ? (
                                  <img
                                    src={item.media_shortcut}
                                    alt="Preview"
                                    className="mt-1 max-h-32 object-contain"
                                    onError={(e) =>
                                      (e.target.style.display = "none")
                                    }
                                  />
                                ) : item.media_shortcut.match(
                                    /\.(mp4|webm|ogg)$/i,
                                  ) ? (
                                  <video
                                    src={item.media_shortcut}
                                    controls
                                    className="mt-1 max-h-32"
                                  />
                                ) : (
                                  <p className="text-xs text-gray-600">
                                    {t(
                                      "learningUnitBuilder.details.content.media",
                                    )}
                                    : {item.media_shortcut}
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add Section Button - Bottom */}
                    <div className="flex justify-center mt-6 mb-4">
                      <button
                        type="button"
                        onClick={handleAddSection}
                        className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                      >
                        <FiPlus size={18} />
                        {t(
                          "learningUnitBuilder.details.content.addButtonSection",
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      {hasPermission("content.bulk-edit") && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                        >
                          {isSubmitting
                            ? t("learningUnitBuilder.actions.updating")
                            : t("learningUnitBuilder.actions.updateContent")}
                        </button>
                      )}
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default BulkLearningUnitBuilderDetails;
