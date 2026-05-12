import { useState, useRef, useEffect, useCallback } from "react";
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
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import usePermission from "../../../../../../hooks/usePermission";

const TopicDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const { topic, isLoading, isError, message } = useSelector(
    (state) => state.topic,
  );

  const { programs, isLoading: programsLoading } = useSelector(
    (state) => state.program,
  );
  const { levels, isLoading: levelsLoading } = useSelector(
    (state) => state.level,
  );
  const { modules, isLoading: modulesLoading } = useSelector(
    (state) => state.module,
  );
  const { chapters, isLoading: chaptersLoading } = useSelector(
    (state) => state.chapter,
  );

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

  const modulesOptions =
    modules?.data?.map((mod) => ({
      label: mod.title,
      value: mod.id,
    })) || [];

  const chaptersOptions =
    chapters?.data?.map((chap) => ({
      label: chap.title,
      value: chap.id,
    })) || [];

  // Fetch topic data first
  useEffect(() => {
    if (id) {
      dispatch(getTopicById(id));
    }
  }, [dispatch, id]);

  // When topic data is loaded, fetch all related data sequentially with loading
  useEffect(() => {
    const fetchAllData = async () => {
      if (topic?.id && !isDataLoaded) {
        try {
          // First fetch chapters
          await dispatch(getAllChapters()).unwrap();

          // Then fetch modules
          await dispatch(getAllModules()).unwrap();

          // Then fetch levels
          await dispatch(getAllLevels()).unwrap();

          // Then fetch programs
          await dispatch(getAllPrograms()).unwrap();

          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error(t("topic.error.fetchData"));
        }
      }
    };

    fetchAllData();
  }, [dispatch, topic?.id, isDataLoaded, toast, t]);

  useEffect(() => {
    if (topic?.thumbnail) {
      setThumbnailPreview(topic.thumbnail);
    }
  }, [topic]);

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

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
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

      toast.success(res?.message || t("topic.success.update"));
      navigate("/topics");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("topic.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("topic.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleTopic(id)).unwrap();
      toast.success(t("topic.success.delete"));
      setTimeout(() => {
        navigate("/topics");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || t("topic.error.delete"));
    }
  };

  const handleThumbnailUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("topic.validation.imageRequired"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("topic.validation.fileSize"));
        return;
      }

      setFieldValue("thumbnail", file);
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = (setFieldValue) => {
    setThumbnail(null);
    setThumbnailPreview(null);
    setFieldValue("thumbnail", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  if (isLoading) return <Loader />;
  // if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
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
            {({ isSubmitting, setFieldValue, values, handleSubmit }) => {
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
                          maxLength={150}
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
                          options={chaptersOptions}
                          isLoading={chaptersLoading}
                          onChange={(option) => {
                            setFieldValue("chapterName", option);
                            const selectedChapter = chapters?.data?.find(
                              (chap) => chap.id === option.value,
                            );
                            if (selectedChapter) {
                              setFieldValue("moduleName", {
                                label: selectedChapter.module?.title,
                                value: selectedChapter.module?.id,
                              });
                              setFieldValue("levelName", {
                                label: selectedChapter.level?.title,
                                value: selectedChapter.level?.id,
                              });
                              setFieldValue("programName", {
                                label: selectedChapter.program?.title,
                                value: selectedChapter.program?.id,
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
                          options={modulesOptions}
                          isLoading={modulesLoading}
                          disabled={!values.chapterName}
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
                          options={levelOptions}
                          isLoading={levelsLoading}
                          disabled={!values.chapterName}
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
                        options={programOptions}
                        isLoading={programsLoading}
                        disabled={!values.chapterName}
                      />
                      <div>
                        <TextInput
                          name="duration"
                          type="number"
                          label={t("topic.details.duration")}
                          placeholder={t("topic.details.durationPlaceholder")}
                          required={true}
                          maxLength={500}
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
                        onChange={(e) =>
                          handleThumbnailUpload(e, setFieldValue)
                        }
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
                                alt={t("topic.details.thumbnailAlt")}
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeThumbnail(setFieldValue)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                              >
                                <FiX className="text-xs" />
                              </button>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                {thumbnail?.name ||
                                  topic?.thumbnail?.split("/").pop()}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {thumbnail &&
                                  `${(thumbnail.size / 1024).toFixed(2)} KB`}
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
                      {hasPermission("topics.delete") && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          {t("topic.actions.deleteTopic")}
                        </button>
                      )}

                      {hasPermission("topics.edit") && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 cursor-pointer"
                        >
                          {isSubmitting
                            ? t("topic.actions.updating")
                            : t("topic.actions.updateTopic")}
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

export default TopicDetails;
