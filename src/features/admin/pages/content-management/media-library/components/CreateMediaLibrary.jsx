import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiLink } from "react-icons/fi";

import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";

import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMedia } from "../../../../../../redux/slice/mediaLibrarySlice";

// Allowed extensions configuration
const ALLOWED_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov", "avi", "mkv"],
  audio: ["mp3", "wav", "aac"],
  document: ["pdf", "doc", "docx", "xls", "xlsx"],
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CreateMediaLibrary = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [videoInputMethod, setVideoInputMethod] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const typeOptions = [
    { label: t("mediaLibrary.types.image"), value: "image" },
    { label: t("mediaLibrary.types.video"), value: "video" },
    { label: t("mediaLibrary.types.audio"), value: "audio" },
    { label: t("mediaLibrary.types.document"), value: "document" },
  ];

  const videoInputOptions = [
    { label: t("mediaLibrary.videoInput.uploadFile"), value: "file" },
    { label: t("mediaLibrary.videoInput.externalUrl"), value: "url" },
  ];

  const initialValues = {
    title: "",
    description: "",
    type: null,
    file: null,
    externalUrl: "",
    videoInputMethod: null,
  };

  const getValidationSchema = () => {
    let schema = Yup.object({
      title: Yup.string()
        .required(t("mediaLibrary.validation.titleRequired"))
        .min(3, t("mediaLibrary.validation.titleMin"))
        .max(255, t("mediaLibrary.validation.titleMax")),
      type: Yup.object()
        .nullable()
        .required(t("mediaLibrary.validation.typeRequired")),
      description: Yup.string()
        .required(t("mediaLibrary.validation.descriptionRequired"))
        .min(10, t("mediaLibrary.validation.descriptionMin")),
    });

    if (selectedType?.value === "video") {
      schema = schema.shape({
        videoInputMethod: Yup.object()
          .nullable()
          .required(t("mediaLibrary.validation.videoInputMethodRequired")),
      });

      if (videoInputMethod === "file") {
        schema = schema.shape({
          file: Yup.mixed()
            .nullable()
            .required(t("mediaLibrary.validation.fileRequired"))
            .test(
              "file-size",
              t("mediaLibrary.validation.fileSizeExceeded"),
              (value) => {
                if (!value) return true;
                return value.size <= MAX_FILE_SIZE;
              },
            )
            .test(
              "file-extension",
              t("mediaLibrary.validation.invalidVideoFormat"),
              function (value) {
                if (!value) return true;
                const ext = value.name.split(".").pop().toLowerCase();
                return ALLOWED_EXTENSIONS.video.includes(ext);
              },
            ),
          externalUrl: Yup.string().nullable(),
        });
      } else if (videoInputMethod === "url") {
        schema = schema.shape({
          externalUrl: Yup.string()
            .url(t("mediaLibrary.validation.invalidUrl"))
            .required(t("mediaLibrary.validation.urlRequired")),
          file: Yup.mixed().nullable(),
        });
      }
    } else if (selectedType?.value && selectedType?.value !== "video") {
      schema = schema.shape({
        file: Yup.mixed()
          .nullable()
          .required(t("mediaLibrary.validation.fileRequired"))
          .test(
            "file-size",
            t("mediaLibrary.validation.fileSizeExceeded"),
            (value) => {
              if (!value) return true;
              return value.size <= MAX_FILE_SIZE;
            },
          )
          .test("file-extension", function (value) {
            if (!value) return true;
            const ext = value.name.split(".").pop().toLowerCase();
            const allowedExtensions = ALLOWED_EXTENSIONS[selectedType.value];
            return allowedExtensions.includes(ext);
          }),
        externalUrl: Yup.string().nullable(),
      });
    }

    return schema;
  };

  const handleFileUpload = (event, setFieldValue) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(t("mediaLibrary.validation.fileSizeExceeded"));
      return;
    }

    const typeValue = selectedType?.value;
    if (typeValue) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();
      const allowedExtensions = ALLOWED_EXTENSIONS[typeValue];

      if (!allowedExtensions.includes(ext)) {
        toast.error(
          t("mediaLibrary.validation.invalidFileFormat", {
            type: typeValue,
            formats: allowedExtensions.join(", "),
          }),
        );
        event.target.value = "";
        return;
      }
    }

    setFile(selectedFile);
    setFieldValue("file", selectedFile);
    setFieldValue("externalUrl", "");

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleVideoInputMethodChange = (option, setFieldValue) => {
    setVideoInputMethod(option?.value);
    setFieldValue("videoInputMethod", option);

    if (file) {
      removeFile(setFieldValue);
    }
    setFieldValue("externalUrl", "");
  };

  const removeFile = (setFieldValue) => {
    setFile(null);
    setPreview(null);
    if (setFieldValue) {
      setFieldValue("file", null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    if (!selectedType) {
      toast.error(t("mediaLibrary.validation.selectTypeFirst"));
      return;
    }

    if (selectedType?.value === "video" && !videoInputMethod) {
      toast.error(t("mediaLibrary.validation.selectUploadMethodFirst"));
      return;
    }

    fileInputRef.current.click();
  };

  const handleTypeChange = (option, setFieldValue) => {
    setSelectedType(option);
    setFieldValue("type", option);

    setVideoInputMethod(null);
    setFieldValue("videoInputMethod", null);
    removeFile(setFieldValue);
    setFieldValue("externalUrl", "");
  };

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      if (selectedType?.value === "video") {
        if (!videoInputMethod) {
          toast.error(t("mediaLibrary.validation.selectUploadMethodFirst"));
          setSubmitting(false);
          return;
        }

        if (videoInputMethod === "file" && !values.file) {
          toast.error(t("mediaLibrary.validation.fileRequired"));
          setSubmitting(false);
          return;
        }

        if (videoInputMethod === "url" && !values.externalUrl) {
          toast.error(t("mediaLibrary.validation.urlRequired"));
          setSubmitting(false);
          return;
        }
      } else if (selectedType?.value && selectedType?.value !== "video") {
        if (!values.file) {
          toast.error(t("mediaLibrary.validation.fileRequired"));
          setSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", selectedType.value);
      formData.append("description", values.description);

      if (values.file) {
        formData.append("file", values.file);
      }
      if (values.externalUrl) {
        formData.append("external_url", values.externalUrl);
      }

      const res = await dispatch(createMedia(formData)).unwrap();
      toast.success(res?.message || t("mediaLibrary.success.create"));
      resetForm();
      removeFile();
      setSelectedType(null);
      setVideoInputMethod(null);
      navigate("/media-library");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("mediaLibrary.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("mediaLibrary.create.title")}</PageTitle>
            <PageSubtitle>{t("mediaLibrary.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema}
            onSubmit={onSubmit}
            validateOnChange={true}
            validateOnBlur={true}
            enableReinitialize={true}
          >
            {({
              isSubmitting,
              setFieldValue,
              handleSubmit,
              errors,
              values,
              touched,
            }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("mediaLibrary.details.generalDetails")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="title"
                      label={t("mediaLibrary.details.mediaName")}
                      placeholder={t(
                        "mediaLibrary.details.mediaNamePlaceholder",
                      )}
                      required
                      maxLength={150}
                    />

                    <SelectField
                      name="type"
                      label={t("mediaLibrary.details.type")}
                      placeholder={t("mediaLibrary.details.typePlaceholder")}
                      options={typeOptions}
                      required
                      onChange={(option) =>
                        handleTypeChange(option, setFieldValue)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <TextareaField
                      name="description"
                      label={t("mediaLibrary.details.description")}
                      placeholder={t(
                        "mediaLibrary.details.descriptionPlaceholder",
                      )}
                      rows={4}
                      required
                      maxLength={500}
                    />
                  </div>
                </div>

                {selectedType?.value === "video" && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FiLink />
                      {t("mediaLibrary.details.selectInputMethod")}
                    </h3>

                    <SelectField
                      name="videoInputMethod"
                      label={t("mediaLibrary.details.uploadMethod")}
                      placeholder={t(
                        "mediaLibrary.details.uploadMethodPlaceholder",
                      )}
                      options={videoInputOptions}
                      required
                      onChange={(option) =>
                        handleVideoInputMethodChange(option, setFieldValue)
                      }
                    />

                    {touched.videoInputMethod && errors.videoInputMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.videoInputMethod}
                      </p>
                    )}
                  </div>
                )}

                {(!selectedType?.value ||
                  selectedType?.value === "image" ||
                  selectedType?.value === "audio" ||
                  selectedType?.value === "document" ||
                  (selectedType?.value === "video" &&
                    videoInputMethod === "file")) && (
                  <div>
                    <h3 className="text-sm font-semibold mb-4">
                      {t("mediaLibrary.details.uploadFile")}
                    </h3>

                    <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={
                          selectedType?.value === "image"
                            ? ".jpg,.jpeg,.png,.webp"
                            : selectedType?.value === "video"
                              ? ".mp4,.mov,.avi,.mkv"
                              : selectedType?.value === "audio"
                                ? ".mp3,.wav,.aac"
                                : selectedType?.value === "document"
                                  ? ".pdf,.doc,.docx,.xls,.xlsx"
                                  : "*"
                        }
                        onChange={(e) => handleFileUpload(e, setFieldValue)}
                        className="hidden"
                      />

                      {!file ? (
                        <div
                          onClick={triggerFileUpload}
                          className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
                        >
                          <FiUpload className="text-4xl text-gray-400 mb-3" />
                          <p className="text-sm text-gray-600 mb-1">
                            {t("mediaLibrary.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {selectedType?.value
                              ? t("mediaLibrary.details.allowedFormats", {
                                  formats: ALLOWED_EXTENSIONS[
                                    selectedType.value
                                  ]
                                    .join(", ")
                                    .toUpperCase(),
                                })
                              : t("mediaLibrary.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {preview && (
                            <img
                              src={preview}
                              alt={t("mediaLibrary.details.previewAlt")}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          {!preview && selectedType?.value === "video" && (
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                {t("mediaLibrary.types.video")}
                              </span>
                            </div>
                          )}
                          {!preview && selectedType?.value === "audio" && (
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                {t("mediaLibrary.types.audio")}
                              </span>
                            </div>
                          )}
                          {!preview && selectedType?.value === "document" && (
                            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                {t("mediaLibrary.types.document")}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {t("mediaLibrary.details.fileType")}:{" "}
                              {selectedType?.value}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(setFieldValue)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      )}
                    </div>

                    {touched.file && errors.file && (
                      <p className="text-red-500 text-sm mt-2">{errors.file}</p>
                    )}
                  </div>
                )}

                {selectedType?.value === "video" &&
                  videoInputMethod === "url" && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <FiLink />
                        {t("mediaLibrary.details.externalUrl")}
                      </h3>

                      <TextInput
                        name="externalUrl"
                        label={t("mediaLibrary.details.externalUrl")}
                        placeholder={t(
                          "mediaLibrary.details.externalUrlPlaceholder",
                        )}
                        maxLength={250}
                      />

                      {touched.externalUrl && errors.externalUrl && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.externalUrl}
                        </p>
                      )}
                    </div>
                  )}

                <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/media-library")}
                      className="px-4 py-2 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {t("mediaLibrary.actions.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      {isSubmitting
                        ? t("mediaLibrary.actions.creating")
                        : t("mediaLibrary.actions.createMedia")}
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

export default CreateMediaLibrary;
