import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  FiUpload,
  FiX,
  FiLink,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
} from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMediaById,
  updateMediaById,
  deleteSingleMedia,
} from "../../../../../../redux/slice/mediaLibrarySlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import usePermission from "../../../../../../hooks/usePermission";

const ALLOWED_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov", "avi", "mkv"],
  audio: ["mp3", "wav", "aac"],
  document: ["pdf", "doc", "docx", "xls", "xlsx"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MediaLibraryDetails = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [videoInputMethod, setVideoInputMethod] = useState(null);
  const [documentInputMethod, setDocumentInputMethod] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { hasPermission } = usePermission();

  const { singleMedia, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  const videoInputOptions = [
    { label: t("mediaLibrary.videoInput.uploadFile"), value: "file" },
    { label: t("mediaLibrary.videoInput.externalUrl"), value: "url" },
  ];

  const documentInputOptions = [
    { label: t("mediaLibrary.documentInput.uploadFile"), value: "file" },
    { label: t("mediaLibrary.documentInput.externalUrl"), value: "url" },
  ];

  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id)).finally(() => setInitialLoading(false));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!singleMedia) return;

    if (singleMedia?.full_url) {
      setPreview(singleMedia.full_url);
    }

    if (singleMedia?.type) {
      setSelectedType(singleMedia.type);
    }

    if (singleMedia?.type === "video") {
      if (singleMedia?.external_url) {
        setVideoInputMethod("url");
        setFile(null);
        setPreview(null);
        setIsFileChanged(false);
      } else if (singleMedia?.full_url) {
        setVideoInputMethod("file");
        setFile(singleMedia.full_url);
        setPreview(singleMedia.full_url);
        setIsFileChanged(false);
      }
    } else if (singleMedia?.type === "document") {
      if (singleMedia?.external_url) {
        setDocumentInputMethod("url");
        setFile(null);
        setPreview(null);
        setIsFileChanged(false);
      } else if (singleMedia?.full_url) {
        setDocumentInputMethod("file");
        setFile(singleMedia.full_url);
        setPreview(singleMedia.full_url);
        setIsFileChanged(false);
      }
    } else if (singleMedia?.type === "h5p") {
      // H5P only uses external URL
      setFile(null);
      setPreview(null);
      setIsFileChanged(false);
    } else if (
      singleMedia?.type &&
      singleMedia?.type !== "video" &&
      singleMedia?.type !== "document" &&
      singleMedia?.type !== "h5p"
    ) {
      if (singleMedia?.full_url) {
        setFile(singleMedia.full_url);
        setPreview(singleMedia.full_url);
        setIsFileChanged(false);
      }
    }
  }, [singleMedia]);

  const typeOptions = [
    { label: t("mediaLibrary.types.image"), value: "image" },
    { label: t("mediaLibrary.types.video"), value: "video" },
    { label: t("mediaLibrary.types.audio"), value: "audio" },
    { label: t("mediaLibrary.types.document"), value: "document" },
    { label: t("mediaLibrary.types.h5p"), value: "h5p" }, // Added H5P option
  ];

  const getInitialValues = () => {
    let typeOption = null;
    if (singleMedia?.type) {
      typeOption = typeOptions.find((opt) => opt.value === singleMedia.type);
    }

    let videoInputMethodOption = null;
    if (singleMedia?.type === "video") {
      if (singleMedia?.external_url) {
        videoInputMethodOption = {
          label: t("mediaLibrary.videoInput.externalUrl"),
          value: "url",
        };
      } else if (singleMedia?.full_url) {
        videoInputMethodOption = {
          label: t("mediaLibrary.videoInput.uploadFile"),
          value: "file",
        };
      }
    }

    let documentInputMethodOption = null;
    if (singleMedia?.type === "document") {
      if (singleMedia?.external_url) {
        documentInputMethodOption = {
          label: t("mediaLibrary.documentInput.externalUrl"),
          value: "url",
        };
      } else if (singleMedia?.full_url) {
        documentInputMethodOption = {
          label: t("mediaLibrary.documentInput.uploadFile"),
          value: "file",
        };
      }
    }

    return {
      title: singleMedia?.title || "",
      type: typeOption,
      description: singleMedia?.description || "",
      file: singleMedia?.full_url || null,
      externalUrl: singleMedia?.external_url || "",
      videoInputMethod: videoInputMethodOption,
      documentInputMethod: documentInputMethodOption,
    };
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

    if (selectedType === "video") {
      schema = schema.shape({
        videoInputMethod: Yup.object()
          .nullable()
          .required(t("mediaLibrary.validation.videoInputMethodRequired")),
      });

      if (videoInputMethod === "file") {
        schema = schema.shape({
          file: Yup.mixed()
            .nullable()
            .test(
              "file-size",
              t("mediaLibrary.validation.fileSizeExceeded"),
              (value) => {
                if (!value) return true;
                if (typeof value === "string") return true;
                return value.size <= MAX_FILE_SIZE;
              },
            )
            .test(
              "file-extension",
              t("mediaLibrary.validation.invalidVideoFormat"),
              function (value) {
                if (!value) return true;
                if (typeof value === "string") return true;
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
    } else if (selectedType === "document") {
      schema = schema.shape({
        documentInputMethod: Yup.object()
          .nullable()
          .required(t("mediaLibrary.validation.documentInputMethodRequired")),
      });

      if (documentInputMethod === "file") {
        schema = schema.shape({
          file: Yup.mixed()
            .nullable()
            .test(
              "file-size",
              t("mediaLibrary.validation.fileSizeExceeded"),
              (value) => {
                if (!value) return true;
                if (typeof value === "string") return true;
                return value.size <= MAX_FILE_SIZE;
              },
            )
            .test("file-extension", function (value) {
              if (!value) return true;
              if (typeof value === "string") return true;
              const ext = value.name.split(".").pop().toLowerCase();
              return ALLOWED_EXTENSIONS.document.includes(ext);
            }),
          externalUrl: Yup.string().nullable(),
        });
      } else if (documentInputMethod === "url") {
        schema = schema.shape({
          externalUrl: Yup.string()
            .url(t("mediaLibrary.validation.invalidUrl"))
            .required(t("mediaLibrary.validation.urlRequired")),
          file: Yup.mixed().nullable(),
        });
      }
    } else if (selectedType === "h5p") {
      // H5P only requires external URL
      schema = schema.shape({
        externalUrl: Yup.string()
          .url(t("mediaLibrary.validation.invalidUrl"))
          .required(t("mediaLibrary.validation.urlRequired")),
        file: Yup.mixed().nullable(),
      });
    } else if (
      selectedType &&
      selectedType !== "video" &&
      selectedType !== "document" &&
      selectedType !== "h5p"
    ) {
      schema = schema.shape({
        file: Yup.mixed()
          .nullable()
          .required(t("mediaLibrary.validation.fileRequired"))
          .test(
            "file-size",
            t("mediaLibrary.validation.fileSizeExceeded"),
            (value) => {
              if (!value) return true;
              if (typeof value === "string") return true;
              return value.size <= MAX_FILE_SIZE;
            },
          )
          .test("file-extension", function (value) {
            if (!value) return true;
            if (typeof value === "string") return true;
            const ext = value.name.split(".").pop().toLowerCase();
            const allowedExtensions = ALLOWED_EXTENSIONS[selectedType];
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
      event.target.value = "";
      return;
    }

    const typeValue = selectedType;
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
    setIsFileChanged(true);
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
    const method = option?.value;
    setVideoInputMethod(method);
    setFieldValue("videoInputMethod", option);

    if (file && typeof file !== "string") {
      removeFile(setFieldValue);
    }
    setFieldValue("externalUrl", "");

    if (
      method === "file" &&
      singleMedia?.full_url &&
      !singleMedia?.external_url
    ) {
      setFile(singleMedia.full_url);
      setIsFileChanged(false);
      setFieldValue("file", singleMedia.full_url);
      setPreview(singleMedia.full_url);
    } else if (method === "url" && singleMedia?.external_url) {
      setFieldValue("externalUrl", singleMedia.external_url);
      setFile(null);
      setPreview(null);
      setIsFileChanged(false);
    }
  };

  const handleDocumentInputMethodChange = (option, setFieldValue) => {
    const method = option?.value;
    setDocumentInputMethod(method);
    setFieldValue("documentInputMethod", option);

    if (file && typeof file !== "string") {
      removeFile(setFieldValue);
    }
    setFieldValue("externalUrl", "");

    if (
      method === "file" &&
      singleMedia?.full_url &&
      !singleMedia?.external_url
    ) {
      setFile(singleMedia.full_url);
      setIsFileChanged(false);
      setFieldValue("file", singleMedia.full_url);
      setPreview(singleMedia.full_url);
    } else if (method === "url" && singleMedia?.external_url) {
      setFieldValue("externalUrl", singleMedia.external_url);
      setFile(null);
      setPreview(null);
      setIsFileChanged(false);
    }
  };

  const removeFile = (setFieldValue) => {
    setFile(null);
    setIsFileChanged(false);
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

    // Don't allow file upload for H5P type
    if (selectedType === "h5p") {
      toast.error(t("mediaLibrary.validation.h5pNoFileUpload"));
      return;
    }

    if (selectedType === "video" && !videoInputMethod) {
      toast.error(t("mediaLibrary.validation.selectUploadMethodFirst"));
      return;
    }

    if (selectedType === "document" && !documentInputMethod) {
      toast.error(t("mediaLibrary.validation.selectUploadMethodFirst"));
      return;
    }

    fileInputRef.current.click();
  };

  const handleTypeChange = (option, setFieldValue) => {
    const newType = option?.value;
    setSelectedType(newType);
    setFieldValue("type", option);

    setVideoInputMethod(null);
    setDocumentInputMethod(null);
    setFieldValue("videoInputMethod", null);
    setFieldValue("documentInputMethod", null);
    removeFile(setFieldValue);
    setFieldValue("externalUrl", "");
    setIsFileChanged(false);
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("mediaLibrary.details.deleteText") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleMedia(id)).unwrap();
      toast.success(t("mediaLibrary.success.delete"));
      navigate("/media-library");
    } catch (error) {
      toast.error(error?.message || t("mediaLibrary.error.delete"));
    }
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (selectedType === "video") {
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
      } else if (selectedType === "document") {
        if (!documentInputMethod) {
          toast.error(t("mediaLibrary.validation.selectUploadMethodFirst"));
          setSubmitting(false);
          return;
        }

        if (documentInputMethod === "file" && !values.file) {
          toast.error(t("mediaLibrary.validation.fileRequired"));
          setSubmitting(false);
          return;
        }

        if (documentInputMethod === "url" && !values.externalUrl) {
          toast.error(t("mediaLibrary.validation.urlRequired"));
          setSubmitting(false);
          return;
        }
      } else if (selectedType === "h5p") {
        // H5P only requires external URL
        if (!values.externalUrl) {
          toast.error(t("mediaLibrary.validation.urlRequired"));
          setSubmitting(false);
          return;
        }
      } else if (
        selectedType &&
        selectedType !== "video" &&
        selectedType !== "document" &&
        selectedType !== "h5p"
      ) {
        if (!values.file && !isFileChanged) {
          toast.error(t("mediaLibrary.validation.fileRequired"));
          setSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", selectedType);
      formData.append("description", values.description);

      if (
        selectedType !== "video" &&
        selectedType !== "document" &&
        selectedType !== "h5p"
      ) {
        if (isFileChanged && values.file && typeof values.file !== "string") {
          formData.append("file", values.file);
        }
      }

      if (selectedType === "video") {
        if (videoInputMethod === "file") {
          if (values.file && typeof values.file !== "string") {
            formData.append("file", values.file);
          }
        } else if (videoInputMethod === "url" && values.externalUrl) {
          formData.append("external_url", values.externalUrl);
        }
      }

      if (selectedType === "document") {
        if (documentInputMethod === "file") {
          if (values.file && typeof values.file !== "string") {
            formData.append("file", values.file);
          }
        } else if (documentInputMethod === "url" && values.externalUrl) {
          formData.append("external_url", values.externalUrl);
        }
      }

      if (selectedType === "h5p" && values.externalUrl) {
        formData.append("external_url", values.externalUrl);
      }

      const res = await dispatch(
        updateMediaById({ id, data: formData }),
      ).unwrap();
      toast.success(res?.message || t("mediaLibrary.success.update"));
      navigate("/media-library");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("mediaLibrary.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <FiImage className="text-4xl text-blue-500" />;
      case "video":
        return <FiVideo className="text-4xl text-red-500" />;
      case "audio":
        return <FiMusic className="text-4xl text-green-500" />;
      case "document":
        return <FiFile className="text-4xl text-orange-500" />;
      case "h5p":
        return <FiLink className="text-4xl text-purple-500" />;
      default:
        return <FiFile className="text-4xl text-gray-500" />;
    }
  };

  const shouldShowInputMethod = () => {
    return selectedType === "video" || selectedType === "document";
  };

  const getCurrentInputMethod = () => {
    if (selectedType === "video") return videoInputMethod;
    if (selectedType === "document") return documentInputMethod;
    return null;
  };

  const getInputMethodOptions = () => {
    if (selectedType === "video") return videoInputOptions;
    if (selectedType === "document") return documentInputOptions;
    return [];
  };

  const getInputMethodName = () => {
    if (selectedType === "video") return "videoInputMethod";
    if (selectedType === "document") return "documentInputMethod";
    return "";
  };

  const getInputMethodError = (touched, errors) => {
    if (selectedType === "video") {
      return touched.videoInputMethod && errors.videoInputMethod;
    }
    if (selectedType === "document") {
      return touched.documentInputMethod && errors.documentInputMethod;
    }
    return null;
  };

  const getInputMethodErrorMessage = (errors) => {
    if (selectedType === "video") return errors.videoInputMethod;
    if (selectedType === "document") return errors.documentInputMethod;
    return null;
  };

  const shouldShowFileUpload = () => {
    if (!selectedType) return true;

    // H5P should never show file upload
    if (selectedType === "h5p") return false;

    if (selectedType === "video") {
      return videoInputMethod === "file";
    }

    if (selectedType === "document") {
      return documentInputMethod === "file";
    }

    return selectedType === "image" || selectedType === "audio";
  };

  const shouldShowUrlInput = () => {
    if (selectedType === "video" && videoInputMethod === "url") return true;
    if (selectedType === "document" && documentInputMethod === "url")
      return true;
    // Always show URL input for H5P type
    if (selectedType === "h5p") return true;
    return false;
  };

  const handleInputMethodChange = (option, setFieldValue) => {
    if (selectedType === "video") {
      handleVideoInputMethodChange(option, setFieldValue);
    } else if (selectedType === "document") {
      handleDocumentInputMethodChange(option, setFieldValue);
    }
  };

  if (initialLoading || isLoading) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("mediaLibrary.breadcrumb.contentManagement"),
              path: "/media-library",
            },
            {
              label: t("mediaLibrary.breadcrumb.view-media"),
            },
          ]}
        />

        <PageBody className="mt-4">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
            validateOnChange={true}
            validateOnBlur={true}
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

                {shouldShowInputMethod() && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FiLink />
                      {t("mediaLibrary.details.selectInputMethod")}
                    </h3>

                    <SelectField
                      name={getInputMethodName()}
                      label={t("mediaLibrary.details.uploadMethod")}
                      placeholder={t(
                        "mediaLibrary.details.uploadMethodPlaceholder",
                      )}
                      options={getInputMethodOptions()}
                      required
                      onChange={(option) =>
                        handleInputMethodChange(option, setFieldValue)
                      }
                    />

                    {getInputMethodError(touched, errors) && (
                      <p className="text-red-500 text-sm mt-1">
                        {getInputMethodErrorMessage(errors)}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowFileUpload() ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-4">
                      {t("mediaLibrary.details.uploadFile")}
                    </h3>

                    <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={
                          selectedType === "image"
                            ? ".jpg,.jpeg,.png,.webp"
                            : selectedType === "video"
                              ? ".mp4,.mov,.avi,.mkv"
                              : selectedType === "audio"
                                ? ".mp3,.wav,.aac"
                                : selectedType === "document"
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
                            {selectedType
                              ? t("mediaLibrary.details.allowedFormats", {
                                  formats: ALLOWED_EXTENSIONS[selectedType]
                                    .join(", ")
                                    .toUpperCase(),
                                })
                              : t("mediaLibrary.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {preview && selectedType === "image" && (
                            <img
                              src={preview}
                              alt={t("mediaLibrary.details.previewAlt")}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}

                          {(!preview || selectedType !== "image") &&
                            selectedType === "video" &&
                            preview && (
                              <video
                                src={preview}
                                controls
                                className="w-40 h-24 rounded"
                              />
                            )}

                          {(!preview ||
                            (selectedType !== "image" &&
                              selectedType !== "video")) && (
                            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                              {getFileIcon(selectedType)}
                            </div>
                          )}

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {typeof file === "string"
                                ? t("mediaLibrary.details.currentFile")
                                : file?.name}
                            </p>
                            {file && typeof file !== "string" && (
                              <>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {t("mediaLibrary.details.newFileToUpload")}
                                </p>
                              </>
                            )}
                            {typeof file === "string" && (
                              <>
                                <p className="text-xs text-gray-500 break-all">
                                  {file.split("/").pop()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {t("mediaLibrary.details.currentServerFile")}
                                </p>
                              </>
                            )}
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
                ) : null}

                {shouldShowUrlInput() && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FiLink />
                      {selectedType === "h5p"
                        ? t("mediaLibrary.details.h5pUrl")
                        : t("mediaLibrary.details.externalUrl")}
                    </h3>

                    <TextInput
                      name="externalUrl"
                      label={
                        selectedType === "h5p"
                          ? t("mediaLibrary.details.h5pUrl")
                          : t("mediaLibrary.details.externalUrl")
                      }
                      placeholder={
                        selectedType === "h5p"
                          ? t("mediaLibrary.details.h5pUrlPlaceholder")
                          : t("mediaLibrary.details.externalUrlPlaceholder")
                      }
                      maxLength={250}
                    />

                    {selectedType === "h5p" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t("mediaLibrary.details.h5pHelpText")}
                      </p>
                    )}

                    {touched.externalUrl && errors.externalUrl && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.externalUrl}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    {hasPermission("media.delete") && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        {t("mediaLibrary.actions.deleteMedia")}
                      </button>
                    )}

                    {hasPermission("media.edit") && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        {isSubmitting
                          ? t("mediaLibrary.actions.updating")
                          : t("mediaLibrary.actions.updateMedia")}
                      </button>
                    )}
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

export default MediaLibraryDetails;
