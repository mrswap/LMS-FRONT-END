import { useState, useEffect, useRef, memo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle, AiOutlineDelete } from "react-icons/ai";
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
  getBulkContentById,
  //   deleteContent,
} from "../../../../../../redux/slice/unitBuilderSlice";
import { useQuill } from "react-quilljs";
import { FiImage, FiType } from "react-icons/fi";
import Loader from "../../../../common/Loader";

const TextEditor = memo(({ value, onChange, id, isActive, t }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "clean"],
      ],
    },
  });

  const isFirstRender = useRef(true);
  const isUpdatingFromProps = useRef(false);

  useEffect(() => {
    if (!quill) return;

    const handleTextChange = () => {
      if (isUpdatingFromProps.current) {
        isUpdatingFromProps.current = false;
        return;
      }
      const newValue = quill.root.innerHTML;
      onChange(newValue);
    };

    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill, onChange]);

  useEffect(() => {
    if (!quill) return;

    if (isFirstRender.current && value) {
      isUpdatingFromProps.current = true;
      quill.root.innerHTML = value || "<p><br></p>";
      isFirstRender.current = false;
    } else if (!isFirstRender.current && isActive) {
      const currentValue = quill.root.innerHTML;
      if (value !== currentValue) {
        isUpdatingFromProps.current = true;
        quill.root.innerHTML = value || "<p><br></p>";
      }
    }
  }, [quill, value, isActive]);

  useEffect(() => {
    if (!quill) return;
    if (isActive) {
      quill.enable();
    } else {
      quill.disable();
    }
  }, [quill, isActive]);

  if (!isActive) return null;

  return (
    <div className="quill-wrapper" style={{ minHeight: "350px" }}>
      <div ref={quillRef} style={{ height: "350px" }} />
    </div>
  );
});

TextEditor.displayName = "TextEditor";

const BulkLearningUnitBuilderDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

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
      }));
      // Sort by order
      contentsArray.sort((a, b) => a.order - b.order);
      setLocalContents(contentsArray);
    }
  }, [content]);

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

  // Delete content handler
  const handleDeleteContent = async (index, contentId) => {
    if (!contentId) {
      toast.error(t("learningUnitBuilder.error.delete.noId"));
      return;
    }

    // Show confirmation dialog
    const confirmDelete = window.confirm(
      t("learningUnitBuilder.details.content.deleteConfirm") ||
        "Are you sure you want to delete this content?",
    );

    if (!confirmDelete) return;

    try {
      // Call delete API
      const result = await dispatch(deleteContent({ id: contentId })).unwrap();

      if (result.success) {
        // Remove from local state
        setLocalContents((prev) => {
          const updated = [...prev];
          updated.splice(index, 1);
          // Re-sort orders after deletion
          return updated.map((item, idx) => ({
            ...item,
            order: idx + 1,
          }));
        });
        toast.success(
          t("learningUnitBuilder.success.delete") ||
            "Content deleted successfully",
        );
      } else {
        toast.error(result.message || t("learningUnitBuilder.error.delete"));
      }
    } catch (error) {
      toast.error(error?.message || t("learningUnitBuilder.error.delete"));
    }
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      console.log("Contents to save:", localContents);
      toast.success(t("learningUnitBuilder.success.update"));
      navigate("/learning-unit");
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
              label: t("learningUnitBuilder.breadcrumb.contentManagement"),
              path: "/learning-unit",
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

                  {/* Multiple Content Sections - Ek ke niche ek with Order */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.content.content")}
                    </h3>

                    {localContents.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="mb-8 border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                      >
                        {/* Delete Icon - Top Right Section */}
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(index, item.id)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer transition-colors p-1 rounded-full hover:bg-red-50"
                          title={t(
                            "learningUnitBuilder.details.content.delete",
                          )}
                        >
                          <AiOutlineDelete size={20} />
                        </button>

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
                  </div>

                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("learningUnitBuilder.actions.updating")
                          : t("learningUnitBuilder.actions.updateContent")}
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
  );
};

export default BulkLearningUnitBuilderDetails;
