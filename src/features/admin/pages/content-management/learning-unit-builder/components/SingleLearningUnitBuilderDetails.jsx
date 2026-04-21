import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import {
  deleteSingleContent,
  getContentById,
  updateSingleContentById,
} from "../../../../../../redux/slice/unitBuilderSlice";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { FiImage, FiType } from "react-icons/fi";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import Loader from "../../../../common/Loader";

// Memoized TextEditor component (same as before, but editable)
const TextEditor = memo(({ value, onChange, id, isActive }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: "Write your content here...",
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

  // Handle text changes
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

  // Set initial value and handle value updates
  useEffect(() => {
    if (!quill) return;

    // Set initial value when quill is first ready
    if (isFirstRender.current && value) {
      isUpdatingFromProps.current = true;
      quill.root.innerHTML = value || "<p><br></p>";
      isFirstRender.current = false;
    }
    // Handle subsequent value updates
    else if (!isFirstRender.current && isActive) {
      const currentValue = quill.root.innerHTML;
      if (value !== currentValue) {
        isUpdatingFromProps.current = true;
        quill.root.innerHTML = value || "<p><br></p>";
      }
    }
  }, [quill, value, isActive]);

  // Handle enable/disable
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
    <div className="quill-wrapper" style={{ minHeight: "250px" }}>
      <div ref={quillRef} style={{ height: "200px" }} />
    </div>
  );
});

TextEditor.displayName = "TextEditor";

const SingleLearningUnitBuilderDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { content, loading } = useSelector((state) => state.content);
  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topic_id");

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  // Local content state for editing
  const [localContent, setLocalContent] = useState({
    type: "text",
    title: "",
    content: "",
    media_shortcut: "",
    order: 1,
  });

  // Fetch content data
  useEffect(() => {
    if (id && topicId) {
      dispatch(getContentById({ topicId, id }));
      dispatch(getAllPrograms());
      dispatch(getAllLevels());
      dispatch(getAllModules());
      dispatch(getAllChapters());
      dispatch(getAllTopics());
    }
  }, [dispatch, id, topicId]);

  // Set local content when API data loads
  useEffect(() => {
    if (content) {
      setLocalContent({
        type: content.type || "text",
        title: content.title || "",
        content: content.content || "",
        media_shortcut: content.media_shortcut || "",
        order: content.order || 1,
      });
    }
  }, [content]);

  // Filter levels based on selected program
  useEffect(() => {
    if (selectedProgram && levels?.data) {
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
  }, [selectedProgram, levels]);

  // Filter modules based on selected level
  useEffect(() => {
    if (selectedLevel && modules?.data) {
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
  }, [selectedLevel, modules]);

  // Filter chapters based on selected module
  useEffect(() => {
    if (selectedModule && chapters?.data) {
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
  }, [selectedModule, chapters]);

  // Filter topics based on selected chapter
  useEffect(() => {
    if (selectedChapter && topics?.data) {
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
  }, [selectedChapter, topics]);

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

  // Set initial selected values from API response
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

  const handleContentChange = (field, value) => {
    setLocalContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (newType) => {
    setLocalContent((prev) => ({
      ...prev,
      type: newType,
      ...(newType === "text" ? { media_shortcut: "" } : {}),
    }));
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();

      formData.append("title", localContent.title);
      formData.append("type", localContent.type);
      formData.append("content", localContent.content);
      formData.append("order", localContent.order);

      if (localContent.type === "media" && localContent.media_shortcut) {
        formData.append("media_shortcut", localContent.media_shortcut);
      }

      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      await dispatch(
        updateSingleContentById({
          topicId,
          id,
          data: formData,
        }),
      ).unwrap();

      toast.success("Content updated successfully ");
      navigate("/learning-unit");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("learningUnitBuilder.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleContent({ topicId, id })).unwrap();
      toast.success("content deleted successfully ");
      setTimeout(() => {
        navigate("/learning-unit");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Delete failed ");
    }
  };

  if (loading && !content) {
    return (
      <PageLayout>
        <div className="p-8 rounded-lg border border-gray-300">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">
              <Loader />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!content && !loading) {
    return (
      <PageLayout>
        <div className="p-8 rounded-lg border border-gray-300">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">No content found</div>
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
              label: "Edit Content",
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
                  {/* General Details - Editable */}
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
                            disabled={!values.programName}
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
                            disabled={!values.levelName}
                            value={values.moduleName}
                            onChange={(option) => {
                              setFieldValue("moduleName", option);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedModule(option);
                              setSelectedChapter(null);
                              setSelectedTopic(null);
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
                            disabled={!values.moduleName}
                            value={values.chapterName}
                            onChange={(option) => {
                              setFieldValue("chapterName", option);
                              setFieldValue("topicName", null);
                              setSelectedChapter(option);
                              setSelectedTopic(null);
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
                            disabled={!values.chapterName}
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

                  {/* Content Section - Editable with your editor */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.content.content")}
                    </h3>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {/* Type Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("learningUnitBuilder.details.content.type")}
                        </label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => handleTypeChange("text")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                              localContent.type === "text"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            <FiType size={16} />
                            {t("learningUnitBuilder.details.content.text")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTypeChange("media")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                              localContent.type === "media"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            <FiImage size={16} />
                            {t("learningUnitBuilder.details.content.media")}
                          </button>
                        </div>
                      </div>

                      {/* Title Field */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("learningUnitBuilder.details.content.title")}
                        </label>
                        <input
                          type="text"
                          value={localContent.title}
                          onChange={(e) =>
                            handleContentChange("title", e.target.value)
                          }
                          placeholder="Enter title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Conditional Fields based on type */}
                      {localContent.type === "text" ? (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("learningUnitBuilder.details.content.content")}
                          </label>
                          <TextEditor
                            key="text-editor"
                            id="content-editor"
                            value={localContent.content}
                            onChange={(value) =>
                              handleContentChange("content", value)
                            }
                            isActive={true}
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
                              value={localContent.media_shortcut}
                              onChange={(e) =>
                                handleContentChange(
                                  "media_shortcut",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g., yt_123, /uploads/video.mp4, https://youtu.be/..."
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
                              key="media-editor"
                              id="media-editor"
                              value={localContent.content}
                              onChange={(value) =>
                                handleContentChange("content", value)
                              }
                              isActive={true}
                            />
                          </div>

                          {/* Media Preview */}
                          {localContent.media_shortcut && (
                            <div className="mt-2 p-2 bg-gray-100 rounded">
                              <p className="text-xs text-gray-500 mb-1">
                                {t(
                                  "learningUnitBuilder.details.content.preview",
                                )}
                                :
                              </p>
                              {localContent.media_shortcut.match(
                                /\.(jpeg|jpg|gif|png|webp)$/i,
                              ) ? (
                                <img
                                  src={localContent.media_shortcut}
                                  alt="Preview"
                                  className="mt-1 max-h-32 object-contain"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              ) : localContent.media_shortcut.match(
                                  /\.(mp4|webm|ogg)$/i,
                                ) ? (
                                <video
                                  src={localContent.media_shortcut}
                                  controls
                                  className="mt-1 max-h-32"
                                />
                              ) : (
                                <p className="text-xs text-gray-600">
                                  {t(
                                    "learningUnitBuilder.details.content.media",
                                  )}
                                  : {localContent.media_shortcut}
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                      >
                        {t("learningUnitBuilder.actions.deleteContent")}
                      </button>
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

export default SingleLearningUnitBuilderDetails;
