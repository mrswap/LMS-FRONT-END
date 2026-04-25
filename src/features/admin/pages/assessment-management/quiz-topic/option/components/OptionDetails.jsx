import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../../common/form";
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
import {
  deleteOption,
  getOptionById,
  updateOption,
} from "../../../../../../../redux/slice/assessmentOptionSlice";
import { showConfirm } from "../../../../../../../redux/slice/confirmSlice";
// import { createOption } from "../../../../../../../redux/slice/assessmentOptionSlice";

const OptionDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { assessmentId, questionId, optionId } = useParams();

  const { option, isLoading, isError, message } = useSelector(
    (state) => state.option,
  );

  console.log("option", option);

  useEffect(() => {
    if (optionId) {
      dispatch(getOptionById(optionId));
    }
  }, [dispatch, optionId]);

  useEffect(() => {
    if (option?.option?.file) {
      setThumbnailPreview(option?.option?.file);
    }
  }, [option]);

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
    option_text: option?.option?.option_text || "",
    is_correct: option?.option?.is_correct === 1,
  };

  const validationSchema = Yup.object({
    option_text: Yup.string().required(
      t("option.validation.optionTextRequired"),
    ),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("option_text", values.option_text);
      formData.append("is_correct", values.is_correct ? 1 : 0);

      if (thumbnail) {
        formData.append("file", thumbnail);
      }

      const res = await dispatch(
        updateOption({
          questionId,
          optionId,
          data: formData,
        }),
      ).unwrap();

      toast.success(res.message || "Option updated successfully");

      resetForm();
      removeThumbnail();
      navigate(`/assessment-question-option/${assessmentId}/${questionId}`);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("option.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteOption(optionId)).unwrap();
      toast.success("question deleted successfully ");
      setTimeout(() => {
        navigate(`/assessment-question-option/${assessmentId}/${questionId}`);
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
              label: t("option.breadcrumb.questionOption"),
              path: `/assessment-question-option/${assessmentId}/${questionId}`,
            },
            {
              label: t("option.breadcrumb.view-option"),
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
            {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
              <Form onSubmit={handleSubmit} className="space-y-6">
                {/* Option Text */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle className="text-primary" />
                    {t("option.details.optionDetails")}
                  </h3>

                  <TextInput
                    name="option_text"
                    label={t("option.details.optionText")}
                    placeholder={t("option.details.optionTextPlaceholder")}
                    required
                  />
                </div>

                {/* Correct Answer */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={values.is_correct}
                    onChange={(e) =>
                      setFieldValue("is_correct", e.target.checked)
                    }
                  />
                  <label className="text-sm text-gray-700">
                    {t("option.details.isCorrect")}
                  </label>
                </div>

                {/* File Upload Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">
                      <FiImage />
                    </span>
                    {t("option.details.thumbnail")}
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
                          {t("option.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t("option.details.uploadSubText")}
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
                              {thumbnail?.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              {(thumbnail?.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              {t("option.details.changeImage")}
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
                      {t("option.actions.deleteOption")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                    >
                      {isSubmitting
                        ? t("option.actions.updating")
                        : t("option.actions.updateOption")}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default OptionDetails;
