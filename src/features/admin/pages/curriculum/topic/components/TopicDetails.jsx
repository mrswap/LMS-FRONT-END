import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleTopic,
  getTopicById,
  updateTopicById,
} from "../../../../../../redux/slice/topicSlice";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";

const TopicDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topic, isLoading, isError, message } = useSelector(
    (state) => state.topic,
  );

  const { programs } = useSelector((state) => state.program);
  const programOptions = programs?.data?.map((prog) => ({
    label: prog.title,
    value: prog.id,
  }));
  const { levels } = useSelector((state) => state.level);
  const levelOptions = levels?.data?.map((lev) => ({
    label: lev.title,
    value: lev.id,
  }));
  const { modules } = useSelector((state) => state.module);
  const modulesOptions = modules?.data?.map((mod) => ({
    label: mod.title,
    value: mod.id,
  }));
  const { chapters } = useSelector((state) => state.chapter);
  const chaptersOptions = chapters?.data?.map((chap) => ({
    label: chap.title,
    value: chap.id,
  }));

  useEffect(() => {
    if (id) {
      dispatch(getTopicById(id));
      dispatch(getAllPrograms());
      dispatch(getAllLevels());
      dispatch(getAllModules());
      dispatch(getAllChapters());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (topic?.thumbnail) {
      setThumbnailPreview(topic.thumbnail);
    }
  }, [topic]);

  console.log("topic", topic);

  // const initialValues = {
  //   topicName: topic?.title || "",
  //   chapterName: topic?.chapter
  //     ? {
  //         label: topic.chapter.title,
  //         value: topic.chapter.id,
  //       }
  //     : null,
  //   moduleName: topic?.module
  //     ? {
  //         label: topic.module.title,
  //         value: topic.module.id,
  //       }
  //     : null,
  //   levelName: topic?.level
  //     ? {
  //         label: topic.level.title,
  //         value: topic.level.id,
  //       }
  //     : null,
  //   programName: topic?.program
  //     ? {
  //         label: topic.program.title,
  //         value: topic.program.id,
  //       }
  //     : null,
  //   description: topic?.description || "",
  //   thumbnail: topic?.thumbnail || null,
  // };

  const initialValues = {
    topicName: topic?.title || "",

    chapterName:
      chaptersOptions?.find((opt) => opt.value === topic?.chapter_id) || null,

    moduleName:
      modulesOptions?.find((opt) => opt.value === topic?.module_id) || null,

    levelName:
      levelOptions?.find((opt) => opt.value === topic?.level_id) || null,

    programName:
      programOptions?.find((opt) => opt.value === topic?.program_id) || null,

    description: topic?.description || "",
    thumbnail: topic?.thumbnail || null,
    duration: topic?.estimated_duration || "",
  };

  const validationSchema = Yup.object({
    topicName: Yup.string().required("Topic name is required"),
    duration: Yup.number()
      .typeError("Duration must be a number")
      .positive("Duration must be positive")
      .required("Duration is required"),
    chapterName: Yup.object().nullable().required("Parent chapter is required"),
    moduleName: Yup.object().nullable().required("Parent module is required"),
    levelName: Yup.object().nullable().required("Parent level is required"),
    programName: Yup.object().nullable().required("Parent program is required"),
    description: Yup.string().required("Description is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("valus", values);

    try {
      const formData = new FormData();

      formData.append("title", values.topicName);
      formData.append("estimated_duration", values.duration);
      formData.append("description", values.description);
      formData.append(
        "chapter_id",
        values.chapterName?.value || values.chapterName,
      );
      formData.append(
        "module_id",
        values.moduleName?.value || values.moduleName,
      );
      formData.append("level_id", values.levelName?.value || values.levelName);
      formData.append(
        "program_id",
        values.programName?.value || values.programName,
      );

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await dispatch(
        updateTopicById({ id, data: formData }),
      ).unwrap();

      toast.success(res.message || "Topic updated successfully");
      navigate("/topics");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this topic?",
    // );
    // if (!confirmDelete) return;

    const ok = await dispatch(
      showConfirm({ message: "Are you sure you want to delete this topic?" }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleTopic(id)).unwrap();
      toast.success("topic deleted successfully ");
      setTimeout(() => {
        navigate("/topics");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Delete failed ");
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
        {/* 🔹 Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: t("topic.breadcrumb.curriculum"),
              path: "/topics",
            },
            {
              label: t("topic.breadcrumb.view-topic"),
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
                          label={t("topic.details.chapterName")}
                          placeholder={t(
                            "topic.details.chapterNamePlaceholder",
                          )}
                          required={true}
                          options={chaptersOptions || []}
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
                          label={t("topic.details.moduleName")}
                          placeholder={t("topic.details.moduleNamePlaceholder")}
                          required={true}
                          options={modulesOptions || []}
                          disabled={true}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="levelName"
                          label={t("topic.details.levelName")}
                          placeholder={t("topic.details.levelNamePlaceholder")}
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
                          label="Duration (in minutes)"
                          placeholder={"Enter duration in minutes"}
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
                                {/* {thumbnail.name} */}
                                name
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {/* {(thumbnail.size / 1024).toFixed(2)} KB */}
                                size
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
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                      >
                        {/* {t("topic.actions.saveasDraft")} */}
                        Delete Topic
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("topic.actions.saving")
                          : t("topic.actions.saveandContinue")}
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

export default TopicDetails;
