import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { createTopic } from "../../../../../../redux/slice/topicSlice";

const CreateTopic = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { programs } = useSelector((state) => state.program);
  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);

  useEffect(() => {
    dispatch(getAllPrograms());
    dispatch(getAllLevels());
    dispatch(getAllModules());
    dispatch(getAllChapters());
  }, [dispatch]);

  const programOptions =
    programs?.data?.map((prog) => ({
      label: prog.title,
      value: prog.id,
    })) || [];

  const levelOptions =
    levels?.data?.map((lev) => ({
      label: lev.title,
      value: lev.id,
    })) || [];

  const moduleOptions =
    modules?.data?.map((mod) => ({
      label: mod.title,
      value: mod.id,
    })) || [];

  const chapterOptions =
    chapters?.data?.map((chap) => ({
      label: chap.title,
      value: chap.id,
    })) || [];

  const initialValues = {
    topicName: "",
    description: "",
    duration: "",
    chapterName: null,
    moduleName: null,
    levelName: null,
    programName: null,
    thumbnail: null,
  };

  // const validationSchema = Yup.object({
  //   topicName: Yup.string().required("Topic name is required"),
  //   duration: Yup.number()
  //     .typeError("Duration must be a number")
  //     .positive("Duration must be positive")
  //     .required("Duration is required"),
  //   chapterName: Yup.object().nullable().required("Chapter name is required"),
  //   moduleName: Yup.object().nullable().required("Module name is required"),
  //   levelName: Yup.object().nullable().required("Level name is required"),
  //   programName: Yup.object().nullable().required("Parent program is required"),
  //   description: Yup.string().required("Description is required"),
  // });

  const validationSchema = Yup.object({
    topicName: Yup.string().required(t("topic.validation.topicNameRequired")),
    duration: Yup.number()
      .typeError(t("topic.validation.durationNumber"))
      .positive(t("topic.validation.durationPositive"))
      .required(t("topic.validation.durationRequired")),
    chapterName: Yup.object()
      .nullable()
      .required(t("topic.validation.chapterRequired")),
    moduleName: Yup.object()
      .nullable()
      .required(t("topic.validation.moduleRequired")),
    levelName: Yup.object()
      .nullable()
      .required(t("topic.validation.levelRequired")),
    programName: Yup.object()
      .nullable()
      .required(t("topic.validation.programRequired")),
    description: Yup.string().required(
      t("topic.validation.descriptionRequired"),
    ),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    console.log("Form submitted!", values);

    try {
      const formData = new FormData();

      formData.append("title", values.topicName);
      formData.append("chapter_id", values.chapterName.value);
      formData.append("module_id", values.moduleName.value);
      formData.append("level_id", values.levelName.value);
      formData.append("program_id", values.programName.value);
      formData.append("description", values.description);
      formData.append("estimated_duration", values.duration);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      const res = await dispatch(createTopic(formData)).unwrap();
      toast.success(res.message || "Topic created successfully ");
      resetForm();
      removeThumbnail();
      navigate("/topics");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
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

  return (
    <PageLayout>
      <div className=" p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("topic.create.title")}</PageTitle>
            <PageSubtitle>{t("topic.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} className="space-y-8">
                  {/* General Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("topic.details.generalDetails")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <TextInput
                          name="topicName"
                          label={t("topic.details.topicName")}
                          placeholder={t("topic.details.topicNamePlaceholder")}
                          required={true}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="chapterName"
                          label={t("topic.details.parentChapter")}
                          placeholder={t(
                            "topic.details.parentChapterPlaceholder",
                          )}
                          required={true}
                          options={chapterOptions || []}
                          onChange={(option) => {
                            setFieldValue("chapterName", option);

                            const selectedChapter = chapters.data.find(
                              (chap) => chap.id === option.value,
                            );

                            if (selectedChapter) {
                              setFieldValue("moduleName", {
                                label: selectedChapter.module.title,
                                value: selectedChapter.module.id,
                              });

                              setFieldValue("levelName", {
                                label: selectedChapter.level.title,
                                value: selectedChapter.level.id,
                              });

                              setFieldValue("programName", {
                                label: selectedChapter.program.title,
                                value: selectedChapter.program.id,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <SelectField
                          name="moduleName"
                          label={t("topic.details.parentModule")}
                          placeholder={t(
                            "topic.details.parentModulePlaceholder",
                          )}
                          required={true}
                          options={moduleOptions || []}
                          disabled={true}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="levelName"
                          label={t("topic.details.parentLevel")}
                          placeholder={t(
                            "topic.details.parentLevelPlaceholder",
                          )}
                          required={true}
                          options={levelOptions || []}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <SelectField
                        name="programName"
                        label={t("topic.details.parentProgram")}
                        placeholder={t(
                          "topic.details.perentProgramPlaceholder",
                        )}
                        required={true}
                        options={programOptions || []}
                        disabled={true}
                      />
                      <div>
                        <TextInput
                          name="duration"
                          type="number"
                          label={t("topic.details.duration")}
                          placeholder={t("topic.details.durationPlaceholder")}
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("topic.details.description")}
                        placeholder={t("topic.details.descriptionPlaceholder")}
                        rows={4}
                        required={true}
                      />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">
                        <FiImage />
                      </span>
                      {t("topic.details.thumbnail")}
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
                            {t("topic.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("topic.details.uploadSubText")}
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
                                {t("topic.details.changeImage")}
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
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("topic.actions.creating")
                          : t("topic.actions.createTopic")}
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

export default CreateTopic;
