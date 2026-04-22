import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiLink } from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMediaById,
  updateMediaById,
} from "../../../../../../redux/slice/mediaLibrarySlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";

const MediaLibraryDetails = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { singleMedia, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (singleMedia?.file) {
      setFile(singleMedia.file);
    }
  }, [singleMedia]);

  console.log("singleMedia", singleMedia);

  const typeOptions = [
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
    { label: "Audio", value: "audio" },
    { label: "Document", value: "document" },
  ];

  const initialValues = {
    title: singleMedia?.title || "",
    type: typeOptions?.find((opt) => opt.value === singleMedia?.type) || null,
    description: singleMedia?.description || "",
    file: null,
    externalUrl: singleMedia?.external_url || "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required(t("mediaLibrary.validation.titleRequired")),
    type: Yup.object()
      .nullable()
      .required(t("mediaLibrary.validation.typeRequired")),
    description: Yup.string().required(
      t("mediaLibrary.validation.descriptionRequired"),
    ),
    //   externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
    // }).test(
    //   "file-or-url",
    //   t("mediaLibrary.validation.fileOrUrlRequired"),
    //   (values) => {
    //     return values.file || values.externalUrl;
    //   },
  });

  const handleFileUpload = (event, setFieldValue) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFieldValue("file", selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const removeFile = (setFieldValue) => {
    setFile(null);
    setPreview(null);

    if (setFieldValue) {
      setFieldValue("file", null);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("type", values.type.value);
      formData.append("description", values.description);
      if (values.file) {
        formData.append("file", values.file);
      }
      if (values.externalUrl) {
        formData.append("external_url", values.externalUrl);
      }
      for (let [key, val] of formData.entries()) {
        console.log(key, val);
      }

      const res = await dispatch(
        updateMediaById({ id, data: formData }),
      ).unwrap();
      toast.success(res.message || "Media created successfully ");
      resetForm();
      removeFile();
      navigate("/media-library");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

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
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, setFieldValue, handleSubmit, errors }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                {/* Details */}
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
                    />

                    <SelectField
                      name="type"
                      label={t("mediaLibrary.details.type")}
                      placeholder={t("mediaLibrary.details.typePlaceholder")}
                      options={typeOptions}
                      required
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
                    />
                  </div>
                </div>

                {/* External URL */}
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
                  />
                </div>

                {/* File Upload */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    {t("mediaLibrary.details.uploadFile")}
                  </h3>

                  <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
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
                          {t("mediaLibrary.details.uploadSubText")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {preview && (
                          <img
                            src={preview}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}

                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(setFieldValue)}
                          className="text-red-500"
                        >
                          <FiX />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {errors && errors["file-or-url"] && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors["file-or-url"]}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                    >
                      {isSubmitting
                        ? t("mediaLibrary.actions.updating")
                        : t("mediaLibrary.actions.updateMedia")}
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

export default MediaLibraryDetails;
