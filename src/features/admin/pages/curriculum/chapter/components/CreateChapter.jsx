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
import { createChapter } from "../../../../../../redux/slice/chapterSlice";

const CreateChapter = () => {
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

  useEffect(() => {
    dispatch(getAllPrograms());
    dispatch(getAllLevels());
    dispatch(getAllModules());
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

  const initialValues = {
    chapterName: "",
    description: "",
    moduleName: null,
    levelName: null,
    programName: null,
    thumbnail: null,
  };

  const validationSchema = Yup.object({
    chapterName: Yup.string().required("Chapter name is required"),
    moduleName: Yup.object().nullable().required("Module name is required"),
    levelName: Yup.object().nullable().required("Level name is required"),
    programName: Yup.object().nullable().required("Parent program is required"),
    description: Yup.string().required("Description is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    console.log("Form submitted!", values);

    try {
      const formData = new FormData();

      formData.append("title", values.chapterName);
      formData.append("module_id", values.moduleName.value);
      formData.append("level_id", values.levelName.value);
      formData.append("program_id", values.programName.value);
      formData.append("description", values.description);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      const res = await dispatch(createChapter(formData)).unwrap();
      toast.success(res.message || "Chapter created successfully ");
      resetForm();
      removeThumbnail();
      navigate("/chapters");
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
            <PageTitle>{t("chapter.create.title")}</PageTitle>
            <PageSubtitle>{t("chapter.create.subtitle")}</PageSubtitle>
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
                      {t("chapter.details.generalDetails")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <TextInput
                          name="chapterName"
                          label={t("chapter.details.chapterName")}
                          placeholder={t(
                            "chapter.details.chapterNamePlaceholder",
                          )}
                          required={true}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="moduleName"
                          label={t("chapter.details.moduleName")}
                          placeholder={t(
                            "chapter.details.moduleNamePlaceholder",
                          )}
                          required={true}
                          options={moduleOptions || []}
                          onChange={(option) => {
                            setFieldValue("moduleName", option);

                            const selectedModule = modules.data.find(
                              (chap) => chap.id === option.value,
                            );

                            if (selectedModule) {
                              setFieldValue("levelName", {
                                label: selectedModule.level.title,
                                value: selectedModule.level.id,
                              });

                              setFieldValue("programName", {
                                label: selectedModule.program.title,
                                value: selectedModule.program.id,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <SelectField
                          name="levelName"
                          label={t("chapter.details.levelName")}
                          placeholder={t(
                            "chapter.details.levelNamePlaceholder",
                          )}
                          required={true}
                          options={levelOptions || []}
                          disabled={true}
                        />
                      </div>
                      <SelectField
                        name="programName"
                        label={t("chapter.details.parentProgram")}
                        placeholder={t(
                          "chapter.details.perentProgramPlaceholder",
                        )}
                        required={true}
                        options={programOptions || []}
                        disabled={true}
                      />
                    </div>

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("chapter.details.description")}
                        placeholder={t(
                          "chapter.details.descriptionPlaceholder",
                        )}
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
                      {t("chapter.details.thumbnail")}
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
                            {t("chapter.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("chapter.details.uploadSubText")}
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
                                {t("chapter.details.changeImage")}
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
                      {/* <button
                        type="button"
                        className="px-4 py-2 border border-[#184994] rounded-md text-sm text-[#184994] hover:bg-gray-50"
                      >
                        {t("chapter.actions.saveasDraft")}
                      </button> */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("chapter.actions.saving")
                          : t("chapter.actions.saveandContinue")}
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

export default CreateChapter;
