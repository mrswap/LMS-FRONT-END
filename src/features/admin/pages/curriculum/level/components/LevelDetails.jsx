import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteSingleLevel,
  getLevelById,
  updateLevelById,
} from "../../../../../../redux/slice/levelSlice";
import { getAllPrograms } from "../../../../../../redux/slice/programSlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";

const LevelDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { level, isLoading, isError, message } = useSelector(
    (state) => state.level,
  );
  const { programs } = useSelector((state) => state.program);

  const programOptions = programs?.data?.map((prog) => ({
    label: prog.title,
    value: prog.id,
  }));

  useEffect(() => {
    if (id) {
      dispatch(getLevelById(id));
      dispatch(getAllPrograms());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (level?.thumbnail) {
      setThumbnailPreview(level.thumbnail);
    }
  }, [level]);

  const initialValues = {
    levelName: level?.title || "",
    description: level?.description || "",
    programName: level?.program
      ? {
          label: level.program.title,
          value: level.program.id,
        }
      : null,
    thumbnail: level?.thumbnail || null,
  };

  const validationSchema = Yup.object({
    levelName: Yup.string().required("Level name is required"),
    programName: Yup.object().nullable().required("Parent program is required"),
    description: Yup.string().required("Description is required"),
  });

  // const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
  //   console.log("Form submitted!", values);

  //   try {
  //     const formData = new FormData();

  //     formData.append("levelName", values.levelName);
  //     formData.append("program", values.program?.value || values.program);
  //     formData.append("description", values.description);

  //     if (thumbnail) {
  //       formData.append("thumbnail", thumbnail);
  //     }

  //     console.log("Submitting with data:", {
  //       levelName: values.levelName,
  //       program: values.program,
  //       description: values.description,
  //       thumbnail: thumbnail?.name,
  //     });

  //     // API call ke liye
  //     // const response = await fetch("/api/levels", {
  //     //   method: "POST",
  //     //   body: formData,
  //     // });

  //     // if (!response.ok) throw new Error("Submission failed");

  //     alert("Level created successfully!");
  //     resetForm();
  //     removeThumbnail();
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     setErrors({ submit: error.message });
  //     alert("Failed to create level");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("values", values);

    try {
      const formData = new FormData();

      formData.append("title", values.levelName);
      formData.append("description", values.description);
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
        updateLevelById({ id, data: formData }),
      ).unwrap();

      toast.success(res.message || "Level updated successfully");
      navigate("/levels");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || "Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  // const handleDelete = async () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this level?",
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     await dispatch(deleteSingleLevel(id)).unwrap();
  //     toast.success("level deleted successfully ");
  //     setTimeout(() => {
  //       navigate("/levels");
  //     }, 1000);
  //   } catch (error) {
  //     toast.error(error?.message || "Delete failed ");
  //   }
  // };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: "Are you sure you want to delete this level?" }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleLevel(id)).unwrap();
      toast.success("level deleted successfully");
      navigate("/levels");
    } catch (error) {
      toast.error(error?.message || "Delete failed");
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

  {
    isLoading && <p>Loading...</p>;
  }

  {
    isError && <p style={{ color: "red" }}>{message}</p>;
  }

  return (
    <PageLayout>
      <div className=" p-8 rounded-lg border border-gray-300">
        {/* 🔹 Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: t("levels.breadcrumb.curriculum"),
              path: "/levels",
            },
            {
              label: t("levels.breadcrumb.view-level"),
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
                      {/* General Details */}
                      {t("levels.details.generalDetails")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <TextInput
                          name="levelName"
                          label={t("levels.details.levelName")}
                          placeholder={t("levels.details.levelNamePlaceholder")}
                          required={true}
                        />
                      </div>
                      <div>
                        <SelectField
                          name="programName"
                          label={t("levels.details.parentProgram")}
                          placeholder={t(
                            "levels.details.perentProgramPlaceholder",
                          )}
                          required={true}
                          options={programOptions}
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("levels.details.description")}
                        placeholder={t("levels.details.descriptionPlaceholder")}
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
                      {/* Level Thumbnail */}
                      {t("levels.details.thumbnail")}
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
                            {t("levels.details.clickToUpload")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("levels.details.uploadSubText")}
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
                                {t("levels.details.changeImage")}
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
                        {/* {t("common.delete")} */}
                        Delete Level
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent cursor-pointer"
                      >
                        {t("levels.actions.save")}
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

export default LevelDetails;
