import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import DynamicContentSection from "./DynamicContentSection";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import { createTopic } from "../../../../../../redux/slice/topicSlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { getContentById } from "../../../../../../redux/slice/unitBuilderSlice";
import CreateLearningUnitBuilder from "./CreateLearningUnitBuilder";

const LearningUnitBuilderDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { content } = useSelector((state) => state.content);
  console.log("content", content);
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

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [contentSections, setContentSections] = useState([]);

  // useEffect(() => {
  //   if (id) {
  //     dispatch(getContentById({ topicId: 1, id }));
  //     dispatch(getAllPrograms());
  //     dispatch(getAllLevels());
  //     dispatch(getAllModules());
  //     dispatch(getAllChapters());
  //     dispatch(getAllTopics());
  //   }
  // }, [dispatch, id]);

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

  // const initialValues = {
  //   programName: null,
  //   levelName: null,
  //   moduleName: null,
  //   chapterName: null,
  //   topicName: null,
  // };

  const initialValues = {
    programName: content?.topic?.program
      ? {
          label: content.topic.program.title,
          value: content.topic.program.id,
        }
      : null,

    levelName: content?.topic?.level
      ? {
          label: content.topic.level.title,
          value: content.topic.level.id,
        }
      : null,

    moduleName: content?.topic?.module
      ? {
          label: content.topic.module.title,
          value: content.topic.module.id,
        }
      : null,

    chapterName: content?.topic?.chapter
      ? {
          label: content.topic.chapter.title,
          value: content.topic.chapter.id,
        }
      : null,

    topicName: content?.topic
      ? {
          label: content.topic.title,
          value: content.topic.id,
        }
      : null,
  };

  useEffect(() => {
    if (content) {
      setContentSections([
        {
          id: content.id,
          type: content.type,
          title: content.title,
          content: content.content,
          media_shortcut: content.media_shortcut || "",
        },
      ]);
    }
  }, [content]);

  useEffect(() => {
    if (content?.topic) {
      setSelectedProgram({
        label: content.topic.program.title,
        value: content.topic.program.id,
      });

      setSelectedLevel({
        label: content.topic.level.title,
        value: content.topic.level.id,
      });

      setSelectedModule({
        label: content.topic.module.title,
        value: content.topic.module.id,
      });

      setSelectedChapter({
        label: content.topic.chapter.title,
        value: content.topic.chapter.id,
      });
    }
  }, [content]);

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

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.topicName.label);
      formData.append("program_id", values.programName.value);
      formData.append("level_id", values.levelName.value);
      formData.append("module_id", values.moduleName.value);
      formData.append("chapter_id", values.chapterName.value);
      formData.append("topic_id", values.topicName.value);

      // Convert internal sections to API format (remove id, add media_shortcut)
      const apiSections = contentSections.map((section, index) => {
        const apiSection = {
          type: section.type,
          title: section.title,
          content:
            section.type === "text" ? section.content : section.content || "",
          order: index + 1, // Ensure proper ordering
        };

        // Add media_shortcut only for media type
        if (section.type === "media" && section.media_shortcut) {
          apiSection.media_shortcut = section.media_shortcut;
        }

        return apiSection;
      });

      formData.append("sections", JSON.stringify(apiSections));

      // Log all form data
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": ", pair[1]);
      // }

      const res = await dispatch(CreateLearningUnitBuilder(formData)).unwrap();
      toast.success(res.message || "Learning Unit created successfully");

      // Reset form after successful submission
      resetForm();
      setSelectedProgram(null);
      setSelectedLevel(null);
      setSelectedModule(null);
      setSelectedChapter(null);
      setFilteredLevels([]);
      setFilteredModules([]);
      setFilteredChapters([]);
      setFilteredTopics([]);
      setContentSections([]);

      navigate("/learning-unit");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Something went wrong ");
    } finally {
      setSubmitting(false);
    }
  };

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
              label: t("learningUnitBuilder.breadcrumb.view-content"),
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
                  {/* General Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("learningUnitBuilder.details.generalDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {/* Program Selection */}
                        <div>
                          <SelectField
                            name="programName"
                            label={t(
                              "learningUnitBuilder.details.parentProgram",
                            )}
                            placeholder={t(
                              "learningUnitBuilder.details.perentProgramPlaceholder",
                            )}
                            required={true}
                            options={programOptions || []}
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
                            }}
                          />
                        </div>

                        {/* Level Selection */}
                        <div>
                          <SelectField
                            name="levelName"
                            label={t("learningUnitBuilder.details.parentLevel")}
                            placeholder={t(
                              "learningUnitBuilder.details.parentLevelPlaceholder",
                            )}
                            required={true}
                            options={levelOptions || []}
                            disabled={!values.programName}
                            onChange={(option) => {
                              setFieldValue("levelName", option);
                              setFieldValue("moduleName", null);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedLevel(option);
                              setSelectedModule(null);
                              setSelectedChapter(null);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {/* Module Selection */}
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
                            options={moduleOptions || []}
                            disabled={!values.levelName}
                            onChange={(option) => {
                              setFieldValue("moduleName", option);
                              setFieldValue("chapterName", null);
                              setFieldValue("topicName", null);
                              setSelectedModule(option);
                              setSelectedChapter(null);
                            }}
                          />
                        </div>

                        {/* Chapter Selection - NEW */}
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
                            options={chapterOptions || []}
                            disabled={!values.moduleName}
                            onChange={(option) => {
                              setFieldValue("chapterName", option);
                              setFieldValue("topicName", null);
                              setSelectedChapter(option);
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {/* Topic Selection */}
                        <div>
                          <SelectField
                            name="topicName"
                            label={t("learningUnitBuilder.details.parentTopic")}
                            placeholder={t(
                              "learningUnitBuilder.details.parentTopicPlaceholder",
                            )}
                            required={true}
                            options={topicOptions || []}
                            disabled={!values.chapterName}
                            onChange={(option) => {
                              setFieldValue("topicName", option);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Content Sections */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      Content Sections
                    </h3>

                    <DynamicContentSection
                      sections={contentSections}
                      onSectionsChange={setContentSections}
                      titleLabel="Section Title"
                      editorLabel="Content"
                      mediaLabel="Media URL/Shortcut"
                      addButtonText="Add New Section"
                      removeButtonText="Remove Section"
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting || !values.topicName}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("learningUnitBuilder.actions.creating")
                          : t("learningUnitBuilder.actions.createContent")}
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

export default LearningUnitBuilderDetails;
