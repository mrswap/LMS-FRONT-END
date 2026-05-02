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
import { createModule } from "../../../../../../redux/slice/moduleSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import Loader from "../../../../common/Loader";

const CreateModule = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { programs, isLoading: programsLoading } = useSelector(
    (state) => state.program,
  );
  const { levels, isLoading: levelsLoading } = useSelector(
    (state) => state.level,
  );

  // Sequential API calls on component mount
  useEffect(() => {
    const fetchSequentialData = async () => {
      try {
        // First fetch programs
        await dispatch(getAllPrograms()).unwrap();

        // Then fetch levels
        await dispatch(getAllLevels()).unwrap();

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("module.error.fetchData"));
      }
    };

    fetchSequentialData();
  }, [dispatch, toast, t]);

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

  const initialValues = {
    moduleName: "",
    description: "",
    levelName: null,
    programName: null,
    thumbnail: null,
  };

  const validationSchema = Yup.object({
    moduleName: Yup.string().required(
      t("module.validation.moduleNameRequired"),
    ),
    levelName: Yup.object()
      .nullable()
      .required(t("module.validation.levelRequired")),
    programName: Yup.object()
      .nullable()
      .required(t("module.validation.programRequired")),
    description: Yup.string().required(
      t("module.validation.descriptionRequired"),
    ),
  });

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.moduleName);
      formData.append("level_id", values.levelName.value);
      formData.append("program_id", values.programName.value);
      formData.append("description", values.description);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await dispatch(createModule(formData)).unwrap();
      toast.success(res?.message || t("module.success.create"));
      resetForm();
      removeThumbnail();
      navigate("/modules");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("module.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("module.validation.imageRequired"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("module.validation.fileSize"));
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
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("module.create.title")}</PageTitle>
            <PageSubtitle>{t("module.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

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
                      {t("module.details.generalDetails")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <TextInput
                          name="moduleName"
                          label={t("module.details.moduleName")}
                          placeholder={t(
                            "module.details.moduleNamePlaceholder",
                          )}
                          required={true}
                          maxLength={150}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="levelName"
                          label={t("module.details.parentLevel")}
                          placeholder={t(
                            "module.details.parentLevelPlaceholder",
                          )}
                          required={true}
                          options={levelOptions}
                          isLoading={levelsLoading}
                          onChange={(option) => {
                            setFieldValue("levelName", option);
                            const selectedLevel = levels?.data?.find(
                              (lev) => lev.id === option.value,
                            );
                            if (selectedLevel) {
                              setFieldValue("programName", {
                                label: selectedLevel.program?.title,
                                value: selectedLevel.program?.id,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <SelectField
                        name="programName"
                        label={t("module.details.parentProgram")}
                        placeholder={t(
                          "module.details.perentProgramPlaceholder",
                        )}
                        required={true}
                        options={programOptions}
                        isLoading={programsLoading}
                        disabled={!values.levelName}
                      />
                      {/* ========== COMMENTED CODE - FUTURE FIELDS ==========
                      <TextInput
                        name="duration"
                        label={t("module.details.duration")}
                        placeholder={t("module.details.durationPlaceholder")}
                      />
                      ========== END COMMENTED CODE ========== */}
                    </div>

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("module.details.description")}
                        placeholder={t("module.details.descriptionPlaceholder")}
                        rows={4}
                        required={true}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">
                        <FiImage />
                      </span>
                      {t("module.details.thumbnail")}
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
                            {t("module.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("module.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex items-start gap-6">
                            <div className="relative group">
                              <img
                                src={thumbnailPreview}
                                alt={t("module.details.thumbnailAlt")}
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
                                {t("module.details.changeImage")}
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
                        className="px-4 cursor-pointer py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                      >
                        {isSubmitting
                          ? t("module.actions.creating")
                          : t("module.actions.createModule")}
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

export default CreateModule;
