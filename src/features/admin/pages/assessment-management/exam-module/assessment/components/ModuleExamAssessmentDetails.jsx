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

const ModuleExamAssessmentDetails = () => {
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

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingModules, setLoadingModules] = useState(false);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
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
    if (!assessment) return;

    if (!programs?.data && !loadingPrograms) {
      setLoadingPrograms(true);
      dispatch(getAllPrograms()).finally(() => setLoadingPrograms(false));
    }

    if (!levels?.data && !loadingLevels) {
      setLoadingLevels(true);
      dispatch(getAllLevels()).finally(() => setLoadingLevels(false));
    }

    if (!modules?.data && !loadingModules) {
      setLoadingModules(true);
      dispatch(getAllModules()).finally(() => setLoadingModules(false));
    }
  }, [assessment]);

  useEffect(() => {
    if (
      !assessment?.hierarchy ||
      !programs?.data ||
      !levels?.data ||
      !modules?.data
    )
      return;

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

    setSelectedProgram(prog);
    setSelectedLevel(lev);
    setSelectedModule(mod);

    // Filter levels based on selected program
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

    // Filter modules based on selected level
    if (lev && modules?.data) {
      setFilteredModules(
        modules.data.filter(
          (m) =>
            m.level_id === lev.value ||
            m.levelId === lev.value ||
            m.level?.id === lev.value,
        ),
      );
    }

    setIsDataLoaded(true);
  }, [assessment, programs, levels, modules]);

  // Filter levels when program changes
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
    } else {
      setFilteredLevels([]);
    }
  }, [selectedProgram, levels]);

  // Filter modules when level changes
  useEffect(() => {
    if (selectedLevel && modules?.data) {
      setFilteredModules(
        modules.data.filter(
          (m) =>
            m.level_id === selectedLevel.value ||
            m.levelId === selectedLevel.value ||
            m.level?.id === selectedLevel.value,
        ),
      );
    } else {
      setFilteredModules([]);
    }
  }, [selectedLevel, modules]);

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("moduleExamAssessment.validation.invalidImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("moduleExamAssessment.validation.fileSizeExceeded"));
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

  const validationSchema = Yup.object({
    programId: Yup.object()
      .nullable()
      .required(t("moduleExamAssessment.validation.program_required")),
    levelId: Yup.object()
      .nullable()
      .required(t("moduleExamAssessment.validation.level_required")),
    moduleId: Yup.object()
      .nullable()
      .required(t("moduleExamAssessment.validation.module_required")),
    title: Yup.string().required(
      t("moduleExamAssessment.validation.title_required"),
    ),
    description: Yup.string().required(
      t("moduleExamAssessment.validation.description_required"),
    ),
    passing_score: Yup.number()
      .required(t("moduleExamAssessment.validation.passing_score_required"))
      .positive(t("moduleExamAssessment.validation.passing_score_positive")),
    total_marks: Yup.number()
      .required(t("moduleExamAssessment.validation.total_marks_required"))
      .positive(t("moduleExamAssessment.validation.total_marks_positive")),
    duration: Yup.number()
      .required(t("moduleExamAssessment.validation.duration_required"))
      .positive(t("moduleExamAssessment.validation.duration_positive")),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("type", "module");
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("passing_score", values.passing_score);
      formData.append("total_marks", values.total_marks);
      formData.append("duration", values.duration);
      formData.append("assessmentable_id", values.moduleId.value);
      formData.append("assessmentable_type", "App\\Models\\Module");

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      await dispatch(updateAssessmentById({ id, data: formData })).unwrap();
      toast.success(t("moduleExamAssessment.success.update"));
      navigate("/exam-module?type=module");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("moduleExamAssessment.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({
        message: t("moduleExamAssessment.details.deleteTextExam"),
      }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleAssessment(id)).unwrap();
      toast.success(t("moduleExamAssessment.success.delete"));
      setTimeout(() => navigate("/exam-module?type=module"), 1000);
    } catch (error) {
      toast.error(error?.message || t("moduleExamAssessment.error.delete"));
    }
  };

  //   if (isLoading || !isDataLoaded) {
  //     return <Loader />;
  //   }

  if (isError) return <Error message={message} />;

  const initialFormValues = {
    programId: selectedProgram,
    levelId: selectedLevel,
    moduleId: selectedModule,
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
              label: t("moduleExamAssessment.breadcrumb.examManagement"),
              path: "/exam-module",
            },
            { label: t("moduleExamAssessment.breadcrumb.view-exam") },
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
                    {t("moduleExamAssessment.details.moduleDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        name="programId"
                        label={t("moduleExamAssessment.details.parentProgram")}
                        placeholder={t(
                          "moduleExamAssessment.details.parentProgramPlaceholder",
                        )}
                        required
                        options={programOptions}
                        isLoading={loadingPrograms}
                        value={values.programId}
                        onChange={(option) => {
                          setFieldValue("programId", option);
                          setFieldValue("levelId", null);
                          setFieldValue("moduleId", null);
                          setSelectedProgram(option);
                          setSelectedLevel(null);
                          setSelectedModule(null);
                          setFilteredLevels([]);
                          setFilteredModules([]);
                        }}
                      />

                      <SelectField
                        name="levelId"
                        label={t("moduleExamAssessment.details.parentLevel")}
                        placeholder={t(
                          "moduleExamAssessment.details.parentLevelPlaceholder",
                        )}
                        required
                        options={levelOptions}
                        disabled={!values.programId}
                        isLoading={loadingLevels}
                        value={values.levelId}
                        onChange={(option) => {
                          setFieldValue("levelId", option);
                          setFieldValue("moduleId", null);
                          setSelectedLevel(option);
                          setSelectedModule(null);
                          setFilteredModules([]);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        name="moduleId"
                        label={t("moduleExamAssessment.details.selectModule")}
                        placeholder={t(
                          "moduleExamAssessment.details.selectModulePlaceholder",
                        )}
                        required
                        options={moduleOptions}
                        disabled={!values.levelId}
                        isLoading={loadingModules}
                        value={values.moduleId}
                        onChange={(option) => {
                          setFieldValue("moduleId", option);
                          setSelectedModule(option);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    {t("moduleExamAssessment.details.assessmentDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="title"
                        label={t("moduleExamAssessment.details.title")}
                        placeholder={t(
                          "moduleExamAssessment.details.titlePlaceholder",
                        )}
                        required
                        maxLength={150}
                      />
                      <TextInput
                        name="duration"
                        label={t("moduleExamAssessment.details.duration")}
                        placeholder={t(
                          "moduleExamAssessment.details.durationPlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="total_marks"
                        label={t("moduleExamAssessment.details.totalMarks")}
                        placeholder={t(
                          "moduleExamAssessment.details.totalMarksPlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                      <TextInput
                        name="passing_score"
                        label={t("moduleExamAssessment.details.passingScore")}
                        placeholder={t(
                          "moduleExamAssessment.details.passingScorePlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <TextareaField
                        name="description"
                        label={t("moduleExamAssessment.details.description")}
                        placeholder={t(
                          "moduleExamAssessment.details.descriptionPlaceholder",
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
                    {t("moduleExamAssessment.details.thumbnail")}
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
                          {t("moduleExamAssessment.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t("moduleExamAssessment.details.uploadSubText")}
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
                                {t(
                                  "moduleExamAssessment.details.currentThumbnail",
                                )}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              {t("moduleExamAssessment.details.changeImage")}
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
                        {t("moduleExamAssessment.actions.deleteExam")}
                      </button>
                    )}

                    {hasPermission("assessments.edit") && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("moduleExamAssessment.actions.updating")
                          : t("moduleExamAssessment.actions.updateExam")}
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

export default ModuleExamAssessmentDetails;
