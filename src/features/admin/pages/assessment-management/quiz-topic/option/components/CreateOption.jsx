import { useState, useRef } from "react";
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
import { useDispatch } from "react-redux";
import { useToast } from "../../../../../common/toast/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { createOption } from "../../../../../../../redux/slice/assessmentOptionSlice";

const CreateOption = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { assessmentId, questionId } = useParams();

  // console.log("assessmentId", assessmentId);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Invalid file type");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeded (5MB max)");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = () => fileInputRef.current.click();

  const initialValues = {
    option_text: "",
    is_correct: false,
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

      if (file) {
        formData.append("file", file);
      }

      const res = await dispatch(
        createOption({
          questionId,
          data: formData,
        }),
      ).unwrap();

      toast.success(res.message || "Option created successfully");

      resetForm();
      removeFile();
      navigate(`/assessment-question/${assessmentId}`);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("option.create.title")}</PageTitle>
            <PageSubtitle>{t("option.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
              <Form onSubmit={handleSubmit} className="space-y-6">
                {/* Option Text */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle className="text-primary" />
                    Option Details
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

                {/* File Upload */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FiImage className="text-blue-600" />
                    Upload Image
                  </h3>

                  <div className="border p-4 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {!preview ? (
                      <div
                        onClick={triggerUpload}
                        className="cursor-pointer border-dashed border-2 p-6 text-center"
                      >
                        <FiUpload className="text-2xl mx-auto mb-2" />
                        <p>Click to upload</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-32 h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1"
                        >
                          <FiX />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded"
                  >
                    {isSubmitting
                      ? t("option.actions.creating")
                      : t("option.actions.createOption")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default CreateOption;
