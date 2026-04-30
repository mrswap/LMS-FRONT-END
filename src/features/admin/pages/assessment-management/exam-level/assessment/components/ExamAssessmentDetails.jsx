// import { useState, useRef, useEffect } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import {
//   SelectField,
//   TextInput,
//   TextareaField,
// } from "../../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FiUpload, FiX, FiImage } from "react-icons/fi";
// import { PageLayout } from "../../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import { useToast } from "../../../../../common/toast/ToastContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { getAllPrograms } from "../../../../../../../redux/slice/programSlice";
// import { getAllLevels } from "../../../../../../../redux/slice/levelSlice";
// import {
//   deleteSingleAssessment,
//   getAssessmentById,
//   updateAssessmentById,
// } from "../../../../../../../redux/slice/assissmentSlice";
// import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
// import Breadcrumb from "../../../../../common/layout/Breadcrumb";
// import Loader from "../../../../../common/Loader";

// const AssessmentDetails = () => {
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

//   // Selected state for dropdowns
//   const [selectedProgram, setSelectedProgram] = useState(null);
//   const [selectedLevel, setSelectedLevel] = useState(null);

//   // Loading flags for API calls
//   const [loadingPrograms, setLoadingPrograms] = useState(false);
//   const [loadingLevels, setLoadingLevels] = useState(false);

//   // Filtered dropdown data
//   const [filteredLevels, setFilteredLevels] = useState([]);

//   // Flag: hierarchy selections have been set
//   const [isDataLoaded, setIsDataLoaded] = useState(false);

//   // ─── 1. Fetch assessment on mount ───────────────────────────────────────────
//   useEffect(() => {
//     if (id) {
//       dispatch(getAssessmentById(id));
//     }
//   }, [dispatch, id]);

//   // ─── 2. Set thumbnail preview ────────────────────────────────────────────────
//   useEffect(() => {
//     if (assessment?.assessment?.file) {
//       setThumbnailPreview(assessment.assessment.file);
//     }
//   }, [assessment]);

//   // ─── 3. Load all required master data (programs, levels) ────────────────────
//   useEffect(() => {
//     if (!assessment) return;

//     // Load Programs
//     if (!programs?.data && !loadingPrograms) {
//       setLoadingPrograms(true);
//       dispatch(getAllPrograms()).finally(() => setLoadingPrograms(false));
//     }

//     // Load Levels
//     if (!levels?.data && !loadingLevels) {
//       setLoadingLevels(true);
//       dispatch(getAllLevels()).finally(() => setLoadingLevels(false));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [assessment]);

//   // ─── 4. Once master data is available, derive selected values & filtered lists
//   useEffect(() => {
//     if (!assessment?.hierarchy || !programs?.data || !levels?.data) return;

//     const { hierarchy } = assessment;

//     // ── Set selected dropdown values ──────────────────────────────────────────
//     const prog = hierarchy.program
//       ? { label: hierarchy.program.title, value: hierarchy.program.id }
//       : null;

//     const lev = hierarchy.level
//       ? { label: hierarchy.level.title, value: hierarchy.level.id }
//       : null;

//     setSelectedProgram(prog);
//     setSelectedLevel(lev);

//     // ── Filter cascaded lists ─────────────────────────────────────────────────
//     if (prog && levels?.data) {
//       setFilteredLevels(
//         levels.data.filter(
//           (l) =>
//             l.program_id === prog.value ||
//             l.programId === prog.value ||
//             l.program?.id === prog.value,
//         ),
//       );
//     }

//     setIsDataLoaded(true);
//   }, [assessment, programs, levels]);

//   // ─── 5. Re-filter on manual dropdown changes ──────────────────────────────
//   useEffect(() => {
//     if (selectedProgram && levels?.data) {
//       setFilteredLevels(
//         levels.data.filter(
//           (l) =>
//             l.program_id === selectedProgram.value ||
//             l.programId === selectedProgram.value ||
//             l.program?.id === selectedProgram.value,
//         ),
//       );
//     }
//   }, [selectedProgram, levels]);

//   // ─── Thumbnail handlers ───────────────────────────────────────────────────
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
//     setThumbnailPreview(assessment?.assessment?.file || null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current?.click();

//   // ─── Dropdown options ─────────────────────────────────────────────────────
//   const programOptions =
//     programs?.data?.map((p) => ({ label: p.title, value: p.id })) || [];

//   const levelOptions = filteredLevels.map((l) => ({
//     label: l.title,
//     value: l.id,
//   }));

//   // ─── Validation schema ────────────────────────────────────────────────────
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

//   // ─── Submit handler ───────────────────────────────────────────────────────
//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       const formData = new FormData();
//       // formData.append("_method", "PUT");
//       formData.append("type", "level");
//       formData.append("title", values.title);
//       formData.append("description", values.description);
//       formData.append("passing_score", values.passing_score);
//       formData.append("total_marks", values.total_marks);
//       formData.append("duration", values.duration);
//       formData.append("program_id", values.programId.value);
//       formData.append("level_id", values.levelId.value);

//       if (thumbnail) {
//         formData.append("file", thumbnail);
//       }

//       // await dispatch(updateAssessment({ id, data: formData })).unwrap();
//       // toast.success(t("assessment.messages.updateSuccess"));
//       // navigate("/assessment");
//       await dispatch(updateAssessmentById({ id, data: formData })).unwrap();
//       toast.success("Updated Exam");
//       navigate("/exam-level");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || t("assessment.messages.updateError"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Delete handler ───────────────────────────────────────────────────────
//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("assessment.details.deleteTextExam") }),
//     );
//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleAssessment(id)).unwrap();
//       toast.success(t("assessment.messages.deleteSuccess"));
//       setTimeout(() => navigate("/assessment"), 1000);
//     } catch (error) {
//       toast.error(error?.message || t("assessment.messages.deleteError"));
//     }
//   };

//   // ─── Guard: show loader until everything is ready ─────────────────────────
//   if (isLoading || !isDataLoaded) {
//     return <Loader />;
//   }

//   // ─── Derived initial values (computed once isDataLoaded = true) ───────────
//   const initialFormValues = {
//     programId: selectedProgram,
//     levelId: selectedLevel,
//     title: assessment?.assessment?.title ?? "",
//     description: assessment?.assessment?.description ?? "",
//     passing_score: assessment?.assessment?.passing_score ?? "",
//     total_marks: assessment?.assessment?.total_marks ?? "",
//     duration: assessment?.assessment?.duration ?? "",
//   };

//   // ─── Render ───────────────────────────────────────────────────────────────
//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("assessment.breadcrumb.examManagement"),
//               path: "/exam-levelssment",
//             },
//             { label: t("assessment.breadcrumb.view-exam") },
//           ]}
//         />

//         <div className="mt-6">
//           <Formik
//             enableReinitialize={true}
//             initialValues={initialFormValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({ isSubmitting, values, setFieldValue, handleSubmit }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* ── Level Details (Static Level) ─────────────────────────────────────── */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     <span className="text-[18px] text-primary font-[700]">
//                       <AiOutlineExclamationCircle />
//                     </span>
//                     {t("assessment.details.levelDetails")}
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {/* Program */}
//                       <SelectField
//                         name="programId"
//                         label={t("assessment.details.parentProgram")}
//                         placeholder={t(
//                           "assessment.details.perentProgramPlaceholder",
//                         )}
//                         required
//                         options={programOptions}
//                         isLoading={loadingPrograms}
//                         value={values.programId}
//                         onChange={(option) => {
//                           setFieldValue("programId", option);
//                           setFieldValue("levelId", null);
//                           setSelectedProgram(option);
//                           setSelectedLevel(null);
//                           setFilteredLevels([]);
//                         }}
//                       />

//                       {/* Level */}
//                       <SelectField
//                         name="levelId"
//                         label={t("assessment.details.selectLevel")}
//                         placeholder={t(
//                           "assessment.details.selectLevelPlaceholder",
//                         )}
//                         required
//                         options={levelOptions}
//                         disabled={!values.programId}
//                         isLoading={loadingLevels}
//                         value={values.levelId}
//                         onChange={(option) => {
//                           setFieldValue("levelId", option);
//                           setSelectedLevel(option);
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── Assessment Details ──────────────────────────────────── */}
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
//                         required
//                         maxLength={150}
//                       />
//                       <TextInput
//                         name="duration"
//                         label={t("assessment.details.duration")}
//                         placeholder={t(
//                           "assessment.details.durationPlaceholder",
//                         )}
//                         type="number"
//                         required
//                         maxLength={3}
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
//                         required
//                         maxLength={3}
//                       />
//                       <TextInput
//                         name="passing_score"
//                         label={t("assessment.details.passingScore")}
//                         placeholder={t(
//                           "assessment.details.passingScorePlaceholder",
//                         )}
//                         type="number"
//                         required
//                         maxLength={3}
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
//                         required
//                         maxLength={500}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── Thumbnail ───────────────────────────────────────────── */}
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
//                                 {t("assessment.details.currentThumbnail")}
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

//                 {/* ── Footer ──────────────────────────────────────────────── */}
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
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default AssessmentDetails;

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
  updateAssessmentById,
} from "../../../../../../../redux/slice/assissmentSlice";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import Loader from "../../../../../common/Loader";

const ExamAssessmentDetails = () => {
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

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);

  const [filteredLevels, setFilteredLevels] = useState([]);
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
  }, [assessment]);

  useEffect(() => {
    if (!assessment?.hierarchy || !programs?.data || !levels?.data) return;

    const { hierarchy } = assessment;

    const prog = hierarchy.program
      ? { label: hierarchy.program.title, value: hierarchy.program.id }
      : null;

    const lev = hierarchy.level
      ? { label: hierarchy.level.title, value: hierarchy.level.id }
      : null;

    setSelectedProgram(prog);
    setSelectedLevel(lev);

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

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("examAssessment.validation.invalidImage"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("examAssessment.validation.fileSizeExceeded"));
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

  const validationSchema = Yup.object({
    programId: Yup.object()
      .nullable()
      .required(t("examAssessment.validation.program_required")),
    levelId: Yup.object()
      .nullable()
      .required(t("examAssessment.validation.level_required")),
    title: Yup.string().required(t("examAssessment.validation.title_required")),
    description: Yup.string().required(
      t("examAssessment.validation.description_required"),
    ),
    passing_score: Yup.number()
      .required(t("examAssessment.validation.passing_score_required"))
      .positive(t("examAssessment.validation.passing_score_positive")),
    total_marks: Yup.number()
      .required(t("examAssessment.validation.total_marks_required"))
      .positive(t("examAssessment.validation.total_marks_positive")),
    duration: Yup.number()
      .required(t("examAssessment.validation.duration_required"))
      .positive(t("examAssessment.validation.duration_positive")),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("type", "level");
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("passing_score", values.passing_score);
      formData.append("total_marks", values.total_marks);
      formData.append("duration", values.duration);
      formData.append("assessmentable_id", values.levelId.value);
      formData.append("assessmentable_type", "App\\Models\\Level");

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      await dispatch(updateAssessmentById({ id, data: formData })).unwrap();
      toast.success(t("examAssessment.success.update"));
      navigate("/exam-level");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("examAssessment.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("examAssessment.details.deleteTextExam") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleAssessment(id)).unwrap();
      toast.success(t("examAssessment.success.delete"));
      setTimeout(() => navigate("/exam-level"), 1000);
    } catch (error) {
      toast.error(error?.message || t("examAssessment.error.delete"));
    }
  };

  if (isLoading || !isDataLoaded) {
    return <Loader />;
  }

  const initialFormValues = {
    programId: selectedProgram,
    levelId: selectedLevel,
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
              label: t("examAssessment.breadcrumb.examManagement"),
              path: "/exam-level",
            },
            { label: t("examAssessment.breadcrumb.view-exam") },
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
                    {t("examAssessment.details.levelDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        name="programId"
                        label={t("examAssessment.details.parentProgram")}
                        placeholder={t(
                          "examAssessment.details.parentProgramPlaceholder",
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

                      <SelectField
                        name="levelId"
                        label={t("examAssessment.details.selectLevel")}
                        placeholder={t(
                          "examAssessment.details.selectLevelPlaceholder",
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

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    {t("examAssessment.details.assessmentDetails")}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="title"
                        label={t("examAssessment.details.title")}
                        placeholder={t(
                          "examAssessment.details.titlePlaceholder",
                        )}
                        required
                        maxLength={150}
                      />
                      <TextInput
                        name="duration"
                        label={t("examAssessment.details.duration")}
                        placeholder={t(
                          "examAssessment.details.durationPlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        name="total_marks"
                        label={t("examAssessment.details.totalMarks")}
                        placeholder={t(
                          "examAssessment.details.totalMarksPlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                      <TextInput
                        name="passing_score"
                        label={t("examAssessment.details.passingScore")}
                        placeholder={t(
                          "examAssessment.details.passingScorePlaceholder",
                        )}
                        type="number"
                        required
                        maxLength={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <TextareaField
                        name="description"
                        label={t("examAssessment.details.description")}
                        placeholder={t(
                          "examAssessment.details.descriptionPlaceholder",
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
                    {t("examAssessment.details.thumbnail")}
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
                          {t("examAssessment.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t("examAssessment.details.uploadSubText")}
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
                                {t("examAssessment.details.currentThumbnail")}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              {t("examAssessment.details.changeImage")}
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
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                    >
                      {t("examAssessment.actions.deleteExam")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                    >
                      {isSubmitting
                        ? t("examAssessment.actions.updating")
                        : t("examAssessment.actions.updateExam")}
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

export default ExamAssessmentDetails;
