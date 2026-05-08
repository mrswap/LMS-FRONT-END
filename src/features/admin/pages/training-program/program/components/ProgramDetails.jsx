import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleProgram,
  getProgramById,
  updateProgramById,
} from "../../../../../../redux/slice/programSlice";
import { useToast } from "../../../../common/toast/ToastContext";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import usePermission from "../../../../../../hooks/usePermission";

const ProgramDetails = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const { id } = useParams();
  const toast = useToast();
  const { hasPermission } = usePermission();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { program, isLoading, isError, message } = useSelector(
    (state) => state.program,
  );

  useEffect(() => {
    if (id) {
      dispatch(getProgramById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (program?.thumbnail) {
      setThumbnailPreview(program.thumbnail);
    }
  }, [program]);

  const initialValues = {
    title: program?.title ?? "",
    description: program?.description ?? "",
    thumbnail: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required(t("program.validation.titleRequired")),
    description: Yup.string().required(
      t("program.validation.descriptionRequired"),
    ),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // ========== FUTURE: Add more fields if needed ==========
      // if (values.duration) formData.append("duration", values.duration);
      // if (values.level) formData.append("level", values.level.value);
      // if (values.instructor) formData.append("instructor", values.instructor);
      // ========== END FUTURE FIELDS ==========

      const res = await dispatch(
        updateProgramById({ id, data: formData }),
      ).unwrap();

      toast.success(res?.message || t("program.success.update"));
      navigate("/programs");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("program.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("program.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleProgram(id)).unwrap();
      toast.success(t("program.success.delete"));
      setTimeout(() => {
        navigate("/programs");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || t("program.error.delete"));
    }
  };

  const handleThumbnailUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("program.validation.imageRequired"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("program.validation.fileSize"));
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
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("program.breadcrumb.trainingProgram"),
              path: "/programs",
            },
            {
              label: t("program.breadcrumb.viewProgram"),
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
            {({ isSubmitting, setFieldValue, handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} className="space-y-8">
                  {/* General Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <span className="text-[18px] text-primary font-[700]">
                        <AiOutlineExclamationCircle />
                      </span>
                      {t("program.details.generalDetails")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <TextInput
                          name="title"
                          label={t("program.details.programTitle")}
                          placeholder={t(
                            "program.details.programTitlePlaceholder",
                          )}
                          required={true}
                          maxLength={150}
                        />
                      </div>

                      {/* ========== COMMENTED CODE - FUTURE FIELDS ==========
                      <div>
                        <TextInput
                          name="duration"
                          label={t("program.details.duration")}
                          placeholder={t("program.details.durationPlaceholder")}
                        />
                      </div>
                      ========== END COMMENTED CODE ========== */}
                    </div>

                    {/* ========== COMMENTED CODE - FUTURE SELECT FIELDS ==========
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-2">
                      <SelectField
                        name="level"
                        label={t("program.details.level")}
                        options={levelOptions}
                        placeholder={t("program.details.levelPlaceholder")}
                      />
                      <SelectField
                        name="status"
                        label={t("program.details.status")}
                        options={statusOptions}
                        placeholder={t("program.details.statusPlaceholder")}
                      />
                    </div>
                    ========== END COMMENTED CODE ========== */}

                    <div className="mt-2">
                      <TextareaField
                        name="description"
                        label={t("program.details.description")}
                        placeholder={t(
                          "program.details.descriptionPlaceholder",
                        )}
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
                      {t("program.details.thumbnail")}
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
                            {t("program.details.uploadText")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t("program.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="flex items-start gap-6">
                            <div className="relative group">
                              <img
                                src={thumbnailPreview}
                                alt={t("program.details.thumbnailAlt")}
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
                                  program?.thumbnail?.split("/").pop()}
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
                                {t("program.details.changeImage")}
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
                      {hasPermission("programs.delete") && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          {t("program.actions.deleteProgram")}
                        </button>
                      )}

                      {hasPermission("programs.edit") && (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 cursor-pointer"
                        >
                          {isSubmitting
                            ? t("program.actions.updating")
                            : t("program.actions.updateProgram")}
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

export default ProgramDetails;
