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
import { getAllModules } from "../../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../../redux/slice/chapterSlice";
import { getAllTopics } from "../../../../../../../redux/slice/topicSlice";
import {
  deleteSingleAssessment,
  getAssessmentById,
  updateAssessmentById,
} from "../../../../../../../redux/slice/assissmentSlice";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import Loader from "../../../../../common/Loader";
import usePermission from "../../../../../../../hooks/usePermission";
import Error from "../../../../../common/Error";

const AssessmentDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { hasPermission } = usePermission();

  const { assessment, isLoading, isError, message } = useSelector(
    (state) => state.assessment,
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { assessmentId: id } = useParams();

  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);

  const [isProgramsLoaded, setIsProgramsLoaded] = useState(false);
  const [isLevelsLoaded, setIsLevelsLoaded] = useState(false);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);
  const [isChaptersLoaded, setIsChaptersLoaded] = useState(false);
  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getAssessmentById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (assessment?.assessment?.file) {
      setThumbnailPreview(assessment.assessment.file);
    }
  }, [assessment]);

  useEffect(() => {
    if (assessment && !isProgramsLoaded) {
      dispatch(getAllPrograms()).then(() => {
        setIsProgramsLoaded(true);
      });
    }
  }, [assessment, isProgramsLoaded, dispatch]);

  useEffect(() => {
    if (isProgramsLoaded && selectedProgram && !isLevelsLoaded) {
      dispatch(getAllLevels()).then(() => {
        setIsLevelsLoaded(true);
      });
    }
  }, [selectedProgram, isProgramsLoaded, isLevelsLoaded, dispatch]);

  useEffect(() => {
    if (isLevelsLoaded && selectedLevel && !isModulesLoaded) {
      dispatch(getAllModules()).then(() => {
        setIsModulesLoaded(true);
      });
    }
  }, [selectedLevel, isLevelsLoaded, isModulesLoaded, dispatch]);

  useEffect(() => {
    if (isModulesLoaded && selectedModule && !isChaptersLoaded) {
      dispatch(getAllChapters()).then(() => {
        setIsChaptersLoaded(true);
      });
    }
  }, [selectedModule, isModulesLoaded, isChaptersLoaded, dispatch]);

  useEffect(() => {
    if (isChaptersLoaded && selectedChapter && !isTopicsLoaded) {
      dispatch(getAllTopics()).then(() => {
        setIsTopicsLoaded(true);
      });
    }
  }, [selectedChapter, isChaptersLoaded, isTopicsLoaded, dispatch]);

  useEffect(() => {
    if (!assessment?.hierarchy || !isProgramsLoaded) return;

    const { hierarchy } = assessment;

    const prog = hierarchy.program
      ? { label: hierarchy.program.title, value: hierarchy.program.id }
      : null;

    const lev = hierarchy.level
      ? { label: hierarchy.level.title, value: hierarchy.level.id }
      : null;

    const mod = hierarchy.module
      ? { label: hierarchy.module.title, value: hierarchy.module.id }
      : null;

    const chap = hierarchy.chapter
      ? { label: hierarchy.chapter.title, value: hierarchy.chapter.id }
      : null;

    setSelectedProgram(prog);
    if (lev) setSelectedLevel(lev);
    if (mod) setSelectedModule(mod);
    if (chap) setSelectedChapter(chap);

    if (prog && levels?.data && isLevelsLoaded) {
      setFilteredLevels(
        levels.data.filter(
          (l) =>
            l.program_id === prog.value ||
            l.programId === prog.value ||
            l.program?.id === prog.value,
        ),
      );
    }

    if (lev && modules?.data && isModulesLoaded) {
      setFilteredModules(
        modules.data.filter(
          (m) =>
            m.level_id === lev.value ||
            m.levelId === lev.value ||
            m.level?.id === lev.value,
        ),
      );
    }

    if (mod && chapters?.data && isChaptersLoaded) {
      setFilteredChapters(
        chapters.data.filter(
          (c) =>
            c.module_id === mod.value ||
            c.moduleId === mod.value ||
            c.module?.id === mod.value,
        ),
      );
    }

    if (chap && topics?.data && isTopicsLoaded) {
      setFilteredTopics(
        topics.data.filter(
          (tp) =>
            tp.chapter_id === chap.value ||
            tp.chapterId === chap.value ||
            tp.chapter?.id === chap.value,
        ),
      );
    }

    setIsDataLoaded(true);
  }, [
    assessment,
    isProgramsLoaded,
    isLevelsLoaded,
    isModulesLoaded,
    isChaptersLoaded,
    isTopicsLoaded,
    levels,
    modules,
    chapters,
    topics,
  ]);

  useEffect(() => {
    if (selectedProgram && levels?.data && isLevelsLoaded) {
      setFilteredLevels(
        levels.data.filter(
          (l) =>
            l.program_id === selectedProgram.value ||
            l.programId === selectedProgram.value ||
            l.program?.id === selectedProgram.value,
        ),
      );
    }
  }, [selectedProgram, levels, isLevelsLoaded]);

  useEffect(() => {
    if (selectedLevel && modules?.data && isModulesLoaded) {
      setFilteredModules(
        modules.data.filter(
          (m) =>
            m.level_id === selectedLevel.value ||
            m.levelId === selectedLevel.value ||
            m.level?.id === selectedLevel.value,
        ),
      );
    }
  }, [selectedLevel, modules, isModulesLoaded]);

  useEffect(() => {
    if (selectedModule && chapters?.data && isChaptersLoaded) {
      setFilteredChapters(
        chapters.data.filter(
          (c) =>
            c.module_id === selectedModule.value ||
            c.moduleId === selectedModule.value ||
            c.module?.id === selectedModule.value,
        ),
      );
    }
  }, [selectedModule, chapters, isChaptersLoaded]);

  useEffect(() => {
    if (selectedChapter && topics?.data && isTopicsLoaded) {
      setFilteredTopics(
        topics.data.filter(
          (tp) =>
            tp.chapter_id === selectedChapter.value ||
            tp.chapterId === selectedChapter.value ||
            tp.chapter?.id === selectedChapter.value,
        ),
      );
    }
  }, [selectedChapter, topics, isTopicsLoaded]);

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(assessment?.assessment?.file || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const programOptions =
    programs?.data?.map((p) => ({ label: p.title, value: p.id })) || [];

  const levelOptions = filteredLevels.map((l) => ({
    label: l.title,
    value: l.id,
  }));

  const moduleOptions = filteredModules.map((m) => ({
    label: m.title,
    value: m.id,
  }));

  const chapterOptions = filteredChapters.map((c) => ({
    label: c.title,
    value: c.id,
  }));

  const topicOptions = filteredTopics.map((tp) => ({
    label: tp.title,
    value: tp.id,
  }));

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

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
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

      await dispatch(updateAssessmentById({ id, data: formData })).unwrap();
      toast.success(t("quizAssessment.success.update"));
      navigate("/assessment");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("quizAssessment.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("quizAssessment.details.deleteTextQuiz") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleAssessment(id)).unwrap();
      toast.success(t("quizAssessment.success.delete"));
      setTimeout(() => navigate("/assessment"), 1000);
    } catch (error) {
      toast.error(error?.message || t("quizAssessment.error.delete"));
    }
  };

  if (isLoading || !isDataLoaded) {
    return <Loader />;
  }

  if (isError) return <Error message={message} />;

  const initialFormValues = {
    programId: selectedProgram,
    levelId: selectedLevel,
    moduleId: selectedModule,
    chapterId: selectedChapter,
    topicId: assessment?.hierarchy?.topic
      ? {
          label: assessment.hierarchy.topic.title,
          value: assessment.hierarchy.topic.id,
        }
      : null,
    title: assessment?.assessment?.title ?? "",
    description: assessment?.assessment?.description ?? "",
    passing_score: assessment?.assessment?.passing_score ?? "",
    total_marks: assessment?.assessment?.total_marks ?? "",
    duration: assessment?.assessment?.duration ?? "",
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("quizAssessment.breadcrumb.quizManagement"),
              path: "/assessment",
            },
            { label: t("quizAssessment.breadcrumb.view-quiz") },
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
                        required
                        options={programOptions}
                        isLoading={!isProgramsLoaded}
                        value={values.programId}
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
                          setFilteredLevels([]);
                          setFilteredModules([]);
                          setFilteredChapters([]);
                          setFilteredTopics([]);
                          setIsLevelsLoaded(false);
                          setIsModulesLoaded(false);
                          setIsChaptersLoaded(false);
                          setIsTopicsLoaded(false);
                        }}
                      />

                      <SelectField
                        name="levelId"
                        label={t("quizAssessment.details.parentLevel")}
                        placeholder={t(
                          "quizAssessment.details.parentLevelPlaceholder",
                        )}
                        required
                        options={levelOptions}
                        disabled={!values.programId || !isProgramsLoaded}
                        isLoading={!isLevelsLoaded && selectedProgram}
                        value={values.levelId}
                        onChange={(option) => {
                          setFieldValue("levelId", option);
                          setFieldValue("moduleId", null);
                          setFieldValue("chapterId", null);
                          setFieldValue("topicId", null);
                          setSelectedLevel(option);
                          setSelectedModule(null);
                          setSelectedChapter(null);
                          setFilteredModules([]);
                          setFilteredChapters([]);
                          setFilteredTopics([]);
                          setIsModulesLoaded(false);
                          setIsChaptersLoaded(false);
                          setIsTopicsLoaded(false);
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
                        required
                        options={moduleOptions}
                        disabled={!values.levelId || !isLevelsLoaded}
                        isLoading={!isModulesLoaded && selectedLevel}
                        value={values.moduleId}
                        onChange={(option) => {
                          setFieldValue("moduleId", option);
                          setFieldValue("chapterId", null);
                          setFieldValue("topicId", null);
                          setSelectedModule(option);
                          setSelectedChapter(null);
                          setFilteredChapters([]);
                          setFilteredTopics([]);
                          setIsChaptersLoaded(false);
                          setIsTopicsLoaded(false);
                        }}
                      />

                      <SelectField
                        name="chapterId"
                        label={t("quizAssessment.details.parentChapter")}
                        placeholder={t(
                          "quizAssessment.details.parentChapterPlaceholder",
                        )}
                        required
                        options={chapterOptions}
                        disabled={!values.moduleId || !isModulesLoaded}
                        isLoading={!isChaptersLoaded && selectedModule}
                        value={values.chapterId}
                        onChange={(option) => {
                          setFieldValue("chapterId", option);
                          setFieldValue("topicId", null);
                          setSelectedChapter(option);
                          setFilteredTopics([]);
                          setIsTopicsLoaded(false);
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
                        required
                        options={topicOptions}
                        disabled={!values.chapterId || !isChaptersLoaded}
                        isLoading={!isTopicsLoaded && selectedChapter}
                        value={values.topicId}
                        onChange={(option) => setFieldValue("topicId", option)}
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
                        required
                        maxLength={150}
                      />
                      <TextInput
                        name="duration"
                        label={t("quizAssessment.details.duration")}
                        placeholder={t(
                          "quizAssessment.details.durationPlaceholder",
                        )}
                        type="number"
                        required
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
                        required
                        maxLength={3}
                      />
                      <TextInput
                        name="passing_score"
                        label={t("quizAssessment.details.passingScore")}
                        placeholder={t(
                          "quizAssessment.details.passingScorePlaceholder",
                        )}
                        type="number"
                        required
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
                        required
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
                                {t("quizAssessment.details.currentThumbnail")}
                              </p>
                            )}
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
                    {hasPermission("assessments.delete") && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                      >
                        {t("quizAssessment.actions.deleteQuiz")}
                      </button>
                    )}

                    {hasPermission("assessments.edit") && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("quizAssessment.actions.updating")
                          : t("quizAssessment.actions.updateQuiz")}
                      </button>
                    )}
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
