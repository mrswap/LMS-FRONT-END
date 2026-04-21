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
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import { createTopic } from "../../../../../../redux/slice/topicSlice";
import { createBulkContent } from "../../../../../../redux/slice/unitBuilderSlice";

const CreateLearningUnitBuilder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [contentSections, setContentSections] = useState([]);

  useEffect(() => {
    dispatch(getAllPrograms());
    dispatch(getAllLevels());
    dispatch(getAllModules());
    dispatch(getAllChapters());
    dispatch(getAllTopics());
  }, [dispatch]);

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

  const initialValues = {
    programName: null,
    levelName: null,
    moduleName: null,
    chapterName: null,
    topicName: null,
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

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();
      const apiSections = contentSections.map((section, index) => {
        const apiSection = {
          type: section.type,
          title: section.title,
          content:
            section.type === "text" ? section.content : section.content || "",
          order: index + 1,
        };

        // Add media_shortcut only for media type
        if (section.type === "media" && section.media_shortcut) {
          apiSection.media_shortcut = section.media_shortcut;
        }

        return apiSection;
      });

      formData.append("sections", JSON.stringify(apiSections));

      const payload = {
        topic_id: values.topicName.value,
        sections: apiSections,
      };

      console.log("Payload to be sent to API:", payload);

      const res = await dispatch(
        createBulkContent({
          topicId: values.topicName.value,
          data: payload,
        }),
      ).unwrap();
      toast.success(res.message || "Learning Unit created successfully");

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
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("learningUnitBuilder.create.title")}</PageTitle>
            <PageSubtitle>
              {t("learningUnitBuilder.create.subtitle")}
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
                      {t("learningUnitBuilder.details.content.contentSection")}
                    </h3>

                    <DynamicContentSection
                      sections={contentSections}
                      onSectionsChange={setContentSections}
                      titleLabel={t(
                        "learningUnitBuilder.details.content.contentTitle",
                      )}
                      editorLabel={t(
                        "learningUnitBuilder.details.content.content",
                      )}
                      mediaLabel={t(
                        "learningUnitBuilder.details.content.mediaUrlShortcut",
                      )}
                      addButtonText={t(
                        "learningUnitBuilder.details.content.addButtonSection",
                      )}
                      removeButtonText={t(
                        "learningUnitBuilder.details.content.removeSection",
                      )}
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

export default CreateLearningUnitBuilder;
