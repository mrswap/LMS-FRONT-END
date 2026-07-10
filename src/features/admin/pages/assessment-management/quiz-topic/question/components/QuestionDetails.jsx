import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField } from "../../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
} from "react-icons/md";
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../../../../common/layout/Breadcrumb";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
import {
  deleteQuestion,
  getQuestionById,
  updateQuestionById,
} from "../../../../../../../redux/slice/assessmentQuestionSlice";
import usePermission from "../../../../../../../hooks/usePermission";

const QuestionDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { hasPermission } = usePermission();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

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
    if (question?.question?.file) {
      setThumbnailPreview(question?.question?.file);
    }
  }, [question]);

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("question.validation.invalidImage"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("question.validation.fileSizeExceeded"));
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
    question_text: question?.question?.question_text || "",
    marks: question?.question?.marks || "",
    order: question?.question?.order || "",
    is_case: question?.question?.is_case || false,
    case_title: question?.question?.case_title || "",
    case_text: question?.question?.case_text || "",
  };

  const validationSchema = Yup.object({
    question_text: Yup.string().required(
      t("question.validation.questionTextRequired"),
    ),
    order: Yup.number()
      .required(t("question.validation.orderRequired"))
      .positive(t("question.validation.orderPositive"))
      .integer(t("question.validation.orderInteger")),
    case_title: Yup.string().when("is_case", {
      is: true,
      then: (schema) =>
        schema.required(t("question.validation.caseTitleRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    case_text: Yup.string().when("is_case", {
      is: true,
      then: (schema) =>
        schema.required(t("question.validation.caseTextRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("question_text", values.question_text);
      formData.append("order", values.order);

      if (type === "module") {
        // formData.append("is_case", values.is_case);
        formData.append("is_case", values.is_case ? "1" : "0");
        if (values.is_case) {
          formData.append("case_title", values.case_title);
          formData.append("case_text", values.case_text);
        }
      }

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      const res = await dispatch(
        updateQuestionById({
          questionId: questionId,
          assessmentId: assessmentId,
          data: formData,
        }),
      ).unwrap();
      toast.success(res?.message || t("question.success.update"));

      resetForm();
      removeThumbnail();
      navigate(`/assessment-question/${assessmentId}?type=${type}`);
    } catch (error) {
      console.error("Error details:", error);
      setErrors({ submit: error.message });
      toast.error(error?.message || t("question.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("question.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteQuestion(questionId)).unwrap();
      toast.success(t("question.success.delete"));
      setTimeout(() => {
        navigate(`/assessment-question/${assessmentId}?type=${type}`);
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Delete failed ");
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("question.breadcrumb.assessmentQuestion"),
              path: `/assessment-question/${assessmentId}?type=${type}`,
            },
            { label: t("question.breadcrumb.viewQuestion") },
          ]}
        />

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, handleSubmit, values, setFieldValue }) => {
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
                          maxLength={250}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                          name="order"
                          label={t("question.details.order")}
                          placeholder={t("question.details.orderPlaceholder")}
                          type="number"
                          required={true}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Case Configuration - Only show when type is module */}
                  {type === "module" && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <HiOutlineDocumentText className="text-green-600 text-lg" />
                        {t("question.details.caseConfig")}
                      </h3>

                      <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                        {/* Checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer group mb-6">
                          <div className="relative">
                            {values.is_case ? (
                              <MdOutlineCheckBox className="w-5 h-5 text-accent" />
                            ) : (
                              <MdOutlineCheckBoxOutlineBlank className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={values.is_case}
                            onChange={(e) => {
                              setFieldValue("is_case", e.target.checked);
                              if (!e.target.checked) {
                                setFieldValue("case_title", "");
                                setFieldValue("case_text", "");
                              }
                            }}
                            className="hidden"
                          />
                          <span className="text-sm font-medium text-gray-700 select-none">
                            {t("question.details.enableCase")}
                          </span>
                        </label>

                        {/* Case Title and Case Text Fields - Show when checkbox is checked */}
                        {values.is_case && (
                          <div className="space-y-4 pt-4 border-t border-gray-200">
                            <TextInput
                              name="case_title"
                              label={t("question.details.caseTitle")}
                              placeholder={t(
                                "question.details.caseTitlePlaceholder",
                              )}
                              required={true}
                            />

                            <TextareaField
                              name="case_text"
                              label={t("question.details.caseText")}
                              placeholder={t(
                                "question.details.caseTextPlaceholder",
                              )}
                              rows={6}
                              required={true}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                                {thumbnail?.name ||
                                  question?.question?.file?.split("/").pop()}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {thumbnail &&
                                  (thumbnail?.size / 1024).toFixed(2)}{" "}
                                KB
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
                      {hasPermission("questions.delete") && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                        >
                          {t("question.actions.deleteQuestion")}
                        </button>
                      )}

                      {hasPermission("questions.edit") && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                        >
                          {isSubmitting
                            ? t("question.actions.updating")
                            : t("question.actions.updateQuestion")}
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

export default QuestionDetails;
