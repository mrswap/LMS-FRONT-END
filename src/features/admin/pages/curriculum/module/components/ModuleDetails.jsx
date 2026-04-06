import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

import { PageLayout, PageBody } from "../../../../common/layout";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleModule,
  getModuleById,
  updateModuleById,
} from "../../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";

const ModuleDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { module, isLoading, isError, message } = useSelector(
    (state) => state.module,
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

  useEffect(() => {
    if (id) {
      dispatch(getModuleById(id));
      dispatch(getAllPrograms());
      dispatch(getAllLevels());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (module?.thumbnail) {
      setThumbnailPreview(module.thumbnail);
    }
  }, [module]);

  const initialValues = {
    moduleName: module?.title || "",
    levelName: module?.level
      ? {
          label: module.level.title,
          value: module.level.id,
        }
      : null,
    programName: module?.program
      ? {
          label: module.program.title,
          value: module.program.id,
        }
      : null,
    description: module?.description || "",
    thumbnail: module?.thumbnail || null,
  };

  const validationSchema = Yup.object({
    moduleName: Yup.string().required("Module name is required"),
    levelName: Yup.object().nullable().required("Parent level is required"),
    programName: Yup.object().nullable().required("Parent program is required"),
    description: Yup.string().required("Description is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.moduleName);
      formData.append("description", values.description);
      formData.append("level_id", values.levelName?.value || values.levelName);
      formData.append(
        "program_id",
        values.programName?.value || values.programName,
      );

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      console.log("Submitting with data:", {
        title: values.title,
        description: values.description,
        program: values.programName.value,
        thumbnail: thumbnail?.name,
      });

      const res = await dispatch(
        updateModuleById({ id, data: formData }),
      ).unwrap();

      toast.success(res.message || "Module updated successfully");
      navigate("/modules");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: "Are you sure you want to delete this module?" }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleModule(id)).unwrap();
      toast.success("module deleted successfully ");
      setTimeout(() => {
        navigate("/modules");
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
        <Breadcrumb
          items={[
            {
              label: t("module.breadcrumb.curriculum"),
              path: "/modules",
            },
            {
              label: t("module.breadcrumb.view-module"),
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
                          options={levelOptions || []}
                          onChange={(option) => {
                            setFieldValue("levelName", option);

                            const selectedLevel = levels.data.find(
                              (lev) => lev.id === option.value,
                            );

                            if (selectedLevel) {
                              setFieldValue("programName", {
                                label: selectedLevel.program.title,
                                value: selectedLevel.program.id,
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
                        options={programOptions || []}
                        disabled={true}
                      />
                    </div>

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("module.details.description")}
                        placeholder={t("module.details.descriptionPlaceholder")}
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
                            {t("module.details.clickToUpload")}
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
                                {t("module.details.changeImage")}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🔹 Footer */}
                  <div className="flex justify-end items-center pt-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 cursor-pointer"
                      >
                        {t("module.actions.deleteModule")}
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent cursor-pointer"
                      >
                        {isSubmitting
                          ? t("module.actions.updating")
                          : t("module.actions.updateModule")}
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

export default ModuleDetails;
