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
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../../redux/slice/topicSlice";
import { createAssessment } from "../../../../../../../redux/slice/assissmentSlice";

const CreateAssessment = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const [programsLoaded, setProgramsLoaded] = useState(false);
  const [levelsLoaded, setLevelsLoaded] = useState(false);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [chaptersLoaded, setChaptersLoaded] = useState(false);
  const [topicsLoaded, setTopicsLoaded] = useState(false);

  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    if (!programsLoaded) {
      dispatch(getAllPrograms()).then(() => setProgramsLoaded(true));
    }
  }, [dispatch, programsLoaded]);

  useEffect(() => {
    if (selectedProgram && !levelsLoaded && !loadingLevels) {
      setLoadingLevels(true);
      dispatch(getAllLevels()).then(() => {
        setLevelsLoaded(true);
        setLoadingLevels(false);
      });
    }
  }, [selectedProgram, dispatch, levelsLoaded, loadingLevels]);

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

  useEffect(() => {
    if (selectedLevel && !modulesLoaded && !loadingModules) {
      setLoadingModules(true);
      dispatch(getAllModules()).then(() => {
        setModulesLoaded(true);
        setLoadingModules(false);
      });
    }
  }, [selectedLevel, dispatch, modulesLoaded, loadingModules]);

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

  useEffect(() => {
    if (selectedModule && !chaptersLoaded && !loadingChapters) {
      setLoadingChapters(true);
      dispatch(getAllChapters()).then(() => {
        setChaptersLoaded(true);
        setLoadingChapters(false);
      });
    }
  }, [selectedModule, dispatch, chaptersLoaded, loadingChapters]);

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

  useEffect(() => {
    if (selectedChapter && !topicsLoaded && !loadingTopics) {
      setLoadingTopics(true);
      dispatch(getAllTopics()).then(() => {
        setTopicsLoaded(true);
        setLoadingTopics(false);
      });
    }
  }, [selectedChapter, dispatch, topicsLoaded, loadingTopics]);

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

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("quizAssessment.validation.invalidImage"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("quizAssessment.validation.fileSizeExceeded"));
        return;
      }

      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current.click();

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
    programId: null,
    levelId: null,
    moduleId: null,
    chapterId: null,
    topicId: null,
    title: "",
    description: "",
    passing_score: "",
    total_marks: "",
    duration: "",
  };

  const validationSchema = Yup.object({
    programId: Yup.object()
      .nullable()
      .required(t("quizAssessment.validation.program_required")),
    levelId: Yup.object()
      .nullable()
      .required(t("quizAssessment.validation.level_required")),
    moduleId: Yup.object()
      .nullable()
      .required(t("quizAssessment.validation.module_required")),
    chapterId: Yup.object()
      .nullable()
      .required(t("quizAssessment.validation.chapter_required")),
    topicId: Yup.object()
      .nullable()
      .required(t("quizAssessment.validation.topic_required")),
    title: Yup.string().required(t("quizAssessment.validation.title_required")),
    description: Yup.string().required(
      t("quizAssessment.validation.description_required"),
    ),
    passing_score: Yup.number()
      .required(t("quizAssessment.validation.passing_score_required"))
      .positive(t("quizAssessment.validation.passing_score_positive")),
    total_marks: Yup.number()
      .required(t("quizAssessment.validation.total_marks_required"))
      .positive(t("quizAssessment.validation.total_marks_positive")),
    duration: Yup.number()
      .required(t("quizAssessment.validation.duration_required"))
      .positive(t("quizAssessment.validation.duration_positive")),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("type", "topic");
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("passing_score", values.passing_score);
      formData.append("total_marks", values.total_marks);
      formData.append("duration", values.duration);
      formData.append("assessmentable_id", values.topicId.value);
      formData.append("assessmentable_type", "App\\Models\\Topic");

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      const res = await dispatch(createAssessment(formData)).unwrap();
      toast.success(res.message || t("quizAssessment.success.create"));

      resetForm();
      removeThumbnail();
      setSelectedProgram(null);
      setSelectedLevel(null);
      setSelectedModule(null);
      setSelectedChapter(null);
      setFilteredLevels([]);
      setFilteredModules([]);
      setFilteredChapters([]);
      setFilteredTopics([]);

      navigate("/assessment");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("quizAssessment.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("quizAssessment.create.quizTitle")}</PageTitle>
            <PageSubtitle>
              {t("quizAssessment.create.quizSubtitle")}
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
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("quizAssessment.details.topicDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          name="programId"
                          label={t("quizAssessment.details.parentProgram")}
                          placeholder={t(
                            "quizAssessment.details.parentProgramPlaceholder",
                          )}
                          required={true}
                          options={programOptions}
                          isLoading={!programsLoaded}
                          onChange={(option) => {
                            setFieldValue("programId", option);
                            setFieldValue("levelId", null);
                            setFieldValue("moduleId", null);
                            setFieldValue("chapterId", null);
                            setFieldValue("topicId", null);
                            setSelectedProgram(option);
                            setSelectedLevel(null);
                            setSelectedModule(null);
                            setSelectedChapter(null);
                          }}
                        />

                        <SelectField
                          name="levelId"
                          label={t("quizAssessment.details.parentLevel")}
                          placeholder={t(
                            "quizAssessment.details.parentLevelPlaceholder",
                          )}
                          required={true}
                          options={levelOptions}
                          disabled={!values.programId}
                          isLoading={loadingLevels}
                          onChange={(option) => {
                            setFieldValue("levelId", option);
                            setFieldValue("moduleId", null);
                            setFieldValue("chapterId", null);
                            setFieldValue("topicId", null);
                            setSelectedLevel(option);
                            setSelectedModule(null);
                            setSelectedChapter(null);
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          name="moduleId"
                          label={t("quizAssessment.details.parentModule")}
                          placeholder={t(
                            "quizAssessment.details.parentModulePlaceholder",
                          )}
                          required={true}
                          options={moduleOptions}
                          disabled={!values.levelId}
                          isLoading={loadingModules}
                          onChange={(option) => {
                            setFieldValue("moduleId", option);
                            setFieldValue("chapterId", null);
                            setFieldValue("topicId", null);
                            setSelectedModule(option);
                            setSelectedChapter(null);
                          }}
                        />

                        <SelectField
                          name="chapterId"
                          label={t("quizAssessment.details.parentChapter")}
                          placeholder={t(
                            "quizAssessment.details.parentChapterPlaceholder",
                          )}
                          required={true}
                          options={chapterOptions}
                          disabled={!values.moduleId}
                          isLoading={loadingChapters}
                          onChange={(option) => {
                            setFieldValue("chapterId", option);
                            setFieldValue("topicId", null);
                            setSelectedChapter(option);
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          name="topicId"
                          label={t("quizAssessment.details.topicName")}
                          placeholder={t(
                            "quizAssessment.details.topicNamePlaceholder",
                          )}
                          required={true}
                          options={topicOptions}
                          disabled={!values.chapterId}
                          isLoading={loadingTopics}
                          onChange={(option) => {
                            setFieldValue("topicId", option);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      {t("quizAssessment.details.assessmentDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          name="title"
                          label={t("quizAssessment.details.title")}
                          placeholder={t(
                            "quizAssessment.details.titlePlaceholder",
                          )}
                          required={true}
                          maxLength={150}
                        />

                        <TextInput
                          name="duration"
                          label={t("quizAssessment.details.duration")}
                          placeholder={t(
                            "quizAssessment.details.durationPlaceholder",
                          )}
                          type="number"
                          required={true}
                          maxLength={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          name="total_marks"
                          label={t("quizAssessment.details.totalMarks")}
                          placeholder={t(
                            "quizAssessment.details.totalMarksPlaceholder",
                          )}
                          type="number"
                          required={true}
                          maxLength={3}
                        />

                        <TextInput
                          name="passing_score"
                          label={t("quizAssessment.details.passingScore")}
                          placeholder={t(
                            "quizAssessment.details.passingScorePlaceholder",
                          )}
                          type="number"
                          required={true}
                          maxLength={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <TextareaField
                          name="description"
                          label={t("quizAssessment.details.description")}
                          placeholder={t(
                            "quizAssessment.details.descriptionPlaceholder",
                          )}
                          rows={4}
                          required={true}
                          maxLength={500}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">
                        <FiImage />
                      </span>
                      {t("quizAssessment.details.thumbnail")}
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
                            {t("quizAssessment.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("quizAssessment.details.uploadSubText")}
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
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                {thumbnail.name}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {(thumbnail.size / 1024).toFixed(2)} KB
                              </p>
                              <button
                                type="button"
                                onClick={triggerFileUpload}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <FiUpload className="text-sm" />
                                {t("quizAssessment.details.changeImage")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("quizAssessment.actions.creating")
                          : t("quizAssessment.actions.createQuiz")}
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

export default CreateAssessment;
