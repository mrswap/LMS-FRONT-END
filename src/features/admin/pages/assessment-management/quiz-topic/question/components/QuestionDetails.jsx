import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField } from "../../../../../common/form";
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
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
import {
  deleteQuestion,
  getQuestionById,
} from "../../../../../../../redux/slice/assessmentQuestionSlice";

const QuestionDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { assessmentId, questionId } = useParams();
  const { question, isLoading, isError, message } = useSelector(
    (state) => state.question,
  );

  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionById(questionId));
    }
  }, [dispatch, questionId]);

  useEffect(() => {
    if (question?.thumbnail) {
      setThumbnailPreview(question.thumbnail);
    }
  }, [question]);

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
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
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const initialValues = {
    question_text: "",
    marks: "",
    order: "",
  };

  const validationSchema = Yup.object({
    question_text: Yup.string().required(
      t("question.validation.questionTextRequired"),
    ),

    marks: Yup.number()
      .required(t("question.validation.marksRequired"))
      .positive(t("question.validation.marksPositive"))
      .integer(t("question.validation.marksInteger")),

    order: Yup.number()
      .required(t("question.validation.orderRequired"))
      .positive(t("question.validation.orderPositive"))
      .integer(t("question.validation.orderInteger")),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // IMPORTANT: Send assessment_id separately, not inside FormData if the API expects it in the URL
      // The createQuestion thunk already adds assessmentId to the URL
      // So we only send the question data in FormData
      formData.append("question_text", values.question_text);
      formData.append("marks", values.marks); // Changed from 'mark' to 'marks'
      formData.append("order", values.order);

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      console.log("Assessment ID:", assessmentId);
      console.log("Payload being sent:", Object.fromEntries(formData));

      // const res = await dispatch(
      //   createQuestion({
      //     assessmentId: assessmentId,
      //     data: formData,
      //   }),
      // ).unwrap();
      // toast.success(res.message || "Question updated successfully");

      // // Reset form after successful submission
      // resetForm();
      // removeThumbnail();
      // navigate(`/assessment-question/${assessmentId}`);
    } catch (error) {
      console.error("Error details:", error);
      setErrors({ submit: error.message });
      toast.error(error?.message || error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("question.details.deleteText") }),
    );

    if (!ok) return;

    // try {
    //   await dispatch(deleteQuestion(id)).unwrap();
    //   toast.success("question deleted successfully ");
    //   setTimeout(() => {
    //     navigate("/assessment/questionId");
    //   }, 1000);
    // } catch (error) {
    //   toast.error(error?.message || "Delete failed ");
    // }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("question.breadcrumb.assessmentQuestion"),
              path: "/assessment-question/19",
            },
            {
              label: t("question.breadcrumb.view-question"),
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
            {({ isSubmitting, handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit} className="space-y-8">
                  {/* Question Text Field */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("question.details.questionDetails")}
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <TextareaField
                          name="question_text"
                          label={t("question.details.questionText")}
                          placeholder={t(
                            "question.details.questionTextPlaceholder",
                          )}
                          rows={4}
                          required={true}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          name="marks"
                          label={t("question.details.marks")}
                          placeholder={t("question.details.marksPlaceholder")}
                          type="number"
                          required={true}
                        />

                        <TextInput
                          name="order"
                          label={t("question.details.order")}
                          placeholder={t("question.details.orderPlaceholder")}
                          type="number"
                          required={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">
                        <FiImage />
                      </span>
                      {t("question.details.thumbnail")}
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
                            {t("question.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("question.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex items-start gap-6">
                            <div className="relative group">
                              <img
                                src={thumbnailPreview}
                                alt="Preview"
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
                                {t("question.details.changeImage")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                      >
                        {t("question.actions.deleteQuestion")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("question.actions.updating")
                          : t("question.actions.updateQuestion")}
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

export default QuestionDetails;
