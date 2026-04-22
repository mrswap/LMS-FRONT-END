import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../common/form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiUpload, FiX } from "react-icons/fi";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

import {
  createFaq,
  deleteSingleFaq,
  getFaqById,
} from "../../../../../../redux/slice/faqSlice";
import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
import {
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageLayout,
  PageSubtitle,
  PageTitle,
} from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";

const QuillEditor = ({ value, onChange }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"], // ✅ sirf link allow
        ["clean"],
      ],
    },
  });

  // set value
  useEffect(() => {
    if (quill && value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill, value]);

  // change handler
  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      onChange(quill.root.innerHTML);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  return <div ref={quillRef} />;
};

// const QuillEditor = ({ value, onChange }) => {
//   const { quill, quillRef } = useQuill({ theme: "snow" });

//   // set value
//   useEffect(() => {
//     if (quill && value) {
//       quill.clipboard.dangerouslyPasteHTML(value);
//     }
//   }, [quill, value]);

//   // change handler
//   useEffect(() => {
//     if (!quill) return;

//     const handler = () => {
//       onChange(quill.root.innerHTML);
//     };

//     quill.on("text-change", handler);

//     return () => {
//       quill.off("text-change", handler);
//     };
//   }, [quill]);

//   return <div ref={quillRef} />;
// };

const FaqDetails = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { levels } = useSelector((state) => state.level);
  const { modules } = useSelector((state) => state.module);
  const { chapters } = useSelector((state) => state.chapter);
  const { topics } = useSelector((state) => state.topic);
  const { id } = useParams();

  const [type, setType] = useState({ value: "all", label: "All Type" });
  const [selectedOption, setSelectedOption] = useState(null);

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const { faq, isLoading, isError, message } = useSelector(
    (state) => state.faq,
  );

  useEffect(() => {
    if (id) {
      dispatch(getFaqById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (faq?.image) {
      setImagePreview(faq.image);
    }
  }, [faq]);

  // OPTIONS
  const levelOption =
    levels?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const moduleOption =
    modules?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const chapterOption =
    chapters?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const topicOption =
    topics?.data?.map((i) => ({ value: i.id, label: i.title })) || [];

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "level", label: "Level" },
    { value: "module", label: "Module" },
    { value: "chapter", label: "Chapter" },
    { value: "topic", label: "Topic" },
  ];

  const getOptions = () => {
    switch (type.value) {
      case "level":
        return levelOption;
      case "module":
        return moduleOption;
      case "chapter":
        return chapterOption;
      case "topic":
        return topicOption;
      default:
        return [];
    }
  };

  useEffect(() => {
    dispatch(getAllTopics());
    dispatch(getAllChapters());
    dispatch(getAllModules());
    dispatch(getAllLevels());
  }, []);

  const initialValues = {
    question: faq?.question || "",
    answer: faq?.answer || "",
    type: "all",
    selectedId: "",
    image: faq?.image || null,
  };

  const validationSchema = Yup.object({
    question: Yup.string()
      .required("Question is required")
      .min(5, "Question must be at least 5 characters"),
    answer: Yup.string()
      .required("Answer is required")
      .min(10, "Answer must be at least 10 characters"),
    type: Yup.string().required("Type is required"),
    selectedId: Yup.string().when("type", {
      is: (type) => type !== "all",
      then: (schema) => schema.required("Please select an option"),
      otherwise: (schema) => schema.notRequired(),
    }),
    image: Yup.mixed()
      .nullable()
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return true;
        return value && value.type.startsWith("image/");
      })
      .test("fileSize", "File size should be less than 5MB", (value) => {
        if (!value) return true;
        return value && value.size <= 5 * 1024 * 1024;
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("type", type.value);
      formData.append("id", selectedOption?.value || "");
      formData.append("question", values.question);
      formData.append("answer", values.answer);

      if (image) {
        formData.append("image", image);
      }

      const res = await dispatch(createFaq(formData)).unwrap();
      toast.success("FAQ created successfully!");
      resetForm();
      setImage(null);
      setImagePreview(null);
      setType({ value: "all", label: "All Type" });
      setSelectedOption(null);
      navigate("/faq");
    } catch (err) {
      console.error("Error ❌", err);
      toast.error("Failed to create FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = () => fileInputRef.current.click();

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("faq.details.deleteText") }),
    );

    if (!ok) return;

    try {
      await dispatch(deleteSingleFaq(id)).unwrap();
      toast.success("faq deleted successfully ");
      setTimeout(() => {
        navigate("/faq");
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Delete failed ");
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("faq.breadcrumb.contentManagement"),
              path: "/faq",
            },
            {
              label: t("faq.breadcrumb.view-faq"),
            },
          ]}
        />
        <PageBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ setFieldValue, values, errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  {/* TYPE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("faq.details.type")}
                    </label>
                    <Select
                      value={type}
                      options={typeOptions}
                      onChange={(val) => {
                        setType(val);
                        setSelectedOption(null);
                        setFieldValue("type", val?.value);
                      }}
                      placeholder={t("faq.details.typePlaceholder")}
                    />
                    {touched.type && errors.type && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.type}
                      </div>
                    )}
                  </div>

                  {/* DYNAMIC SELECT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("faq.details.typeId")}
                    </label>
                    <Select
                      value={selectedOption}
                      onChange={(val) => {
                        setSelectedOption(val);
                        setFieldValue("selectedId", val?.value);
                      }}
                      options={getOptions()}
                      isDisabled={type.value === "all"}
                      placeholder={t("faq.details.typeIdPlaceholder")}
                    />
                    {touched.selectedId && errors.selectedId && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.selectedId}
                      </div>
                    )}
                  </div>
                </div>

                {/* QUESTION */}
                <TextInput
                  name="question"
                  label={t("faq.details.question")}
                  placeholder={t("faq.details.questionPlaceholder")}
                />

                {/* ANSWER */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("faq.details.answer")}
                  </label>
                  <QuillEditor
                    value={values.answer}
                    onChange={(val) => setFieldValue("answer", val)}
                  />
                  {touched.answer && errors.answer && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.answer}
                    </div>
                  )}
                </div>

                {/* IMAGE - Replaced thumbnail with word/image */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">
                      <FiImage />
                    </span>
                    {t("faq.details.image")}
                  </h3>

                  <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {!imagePreview ? (
                      <div
                        onClick={triggerFileUpload}
                        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
                      >
                        <FiUpload className="text-4xl text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          {t("faq.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">(Max size: 5MB)</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex items-start gap-6">
                          <div className="relative group">
                            <img
                              src={imagePreview}
                              alt="Image Preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              {image?.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              {(image?.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                              type="button"
                              onClick={triggerFileUpload}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <FiUpload className="text-sm" />
                              {t("faq.details.changeImage")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {touched.image && errors.image && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.image}
                    </div>
                  )}
                </div>

                {/* SUBMIT
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button> */}
                {/* Footer */}
                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-gray-50"
                    >
                      {t("faq.actions.deleteFaq")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
                    >
                      {isSubmitting
                        ? t("faq.actions.updating")
                        : t("faq.actions.updateFaq")}
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

export default FaqDetails;
