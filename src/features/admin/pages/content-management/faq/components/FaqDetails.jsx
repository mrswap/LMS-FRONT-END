// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput } from "../../../../common/form";
// import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect, useRef } from "react";
// import Select from "react-select";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useNavigate, useParams } from "react-router-dom";
// import { FiImage, FiUpload, FiX } from "react-icons/fi";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";

// import {
//   updateFaqById,
//   deleteSingleFaq,
//   getFaqById,
// } from "../../../../../../redux/slice/faqSlice";
// import { getAllTopics } from "../../../../../../redux/slice/topicSlice";
// import { getAllChapters } from "../../../../../../redux/slice/chapterSlice";
// import { getAllModules } from "../../../../../../redux/slice/moduleSlice";
// import { getAllLevels } from "../../../../../../redux/slice/levelSlice";
// import {
//   PageBody,
//   PageHeader,
//   PageHeaderLeft,
//   PageLayout,
//   PageSubtitle,
//   PageTitle,
// } from "../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import Breadcrumb from "../../../../common/layout/Breadcrumb";
// import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
// import Loader from "../../../../common/Loader";
// import Error from "../../../../common/Error";

// const QuillEditor = ({ value, onChange }) => {
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     modules: {
//       toolbar: [
//         [{ header: [1, 2, false] }],
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//         ["clean"],
//       ],
//     },
//   });

//   useEffect(() => {
//     if (quill && value) {
//       quill.clipboard.dangerouslyPasteHTML(value);
//     }
//   }, [quill, value]);

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

// const FaqDetails = () => {
//   const dispatch = useDispatch();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const { levels } = useSelector((state) => state.level);
//   const { modules } = useSelector((state) => state.module);
//   const { chapters } = useSelector((state) => state.chapter);
//   const { topics } = useSelector((state) => state.topic);
//   const { id } = useParams();

//   const [type, setType] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);

//   const fileInputRef = useRef(null);
//   const { t } = useTranslation();

//   const { faq, isLoading, isError, message } = useSelector(
//     (state) => state.faq,
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(getFaqById(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (faq?.image) {
//       setImagePreview(faq.image);
//     }
//     if (faq?.type) {
//       const typeObj = typeOptions.find((opt) => opt.value === faq.type);
//       setType(typeObj || typeOptions[0]);

//       if (faq.type && faq.type_id) {
//         const dynamicOptions = getDynamicOptionsByType(faq.type);
//         const selected = dynamicOptions.find(
//           (opt) => opt.value === faq.type_id,
//         );
//         setSelectedOption(selected || null);
//       }
//     }
//   }, [faq]);

//   const levelOption =
//     levels?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
//   const moduleOption =
//     modules?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
//   const chapterOption =
//     chapters?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
//   const topicOption =
//     topics?.data?.map((i) => ({ value: i.id, label: i.title })) || [];

//   const typeOptions = [
//     { value: "all", label: t("faq.types.all") },
//     { value: "level", label: t("faq.types.level") },
//     { value: "module", label: t("faq.types.module") },
//     { value: "chapter", label: t("faq.types.chapter") },
//     { value: "topic", label: t("faq.types.topic") },
//   ];

//   const getOptions = () => {
//     switch (type?.value) {
//       case "level":
//         return levelOption;
//       case "module":
//         return moduleOption;
//       case "chapter":
//         return chapterOption;
//       case "topic":
//         return topicOption;
//       default:
//         return [];
//     }
//   };

//   const getDynamicOptionsByType = (typeValue) => {
//     switch (typeValue) {
//       case "level":
//         return levelOption;
//       case "module":
//         return moduleOption;
//       case "chapter":
//         return chapterOption;
//       case "topic":
//         return topicOption;
//       default:
//         return [];
//     }
//   };

//   useEffect(() => {
//     dispatch(getAllTopics());
//     dispatch(getAllChapters());
//     dispatch(getAllModules());
//     dispatch(getAllLevels());
//   }, [dispatch]);

//   const initialValues = {
//     question: faq?.question || "",
//     answer: faq?.answer || "",
//     image: faq?.image || null,
//   };

//   // ✅ Fixed: Validation schema with i18n
//   const validationSchema = Yup.object({
//     question: Yup.string()
//       .required(t("faq.validation.questionRequired"))
//       .min(5, t("faq.validation.questionMin")),
//     answer: Yup.string()
//       .required(t("faq.validation.answerRequired"))
//       .min(10, t("faq.validation.answerMin")),
//     // image: Yup.mixed()
//     //   .nullable()
//     //   .test("fileType", t("faq.validation.imageType"), (value) => {
//     //     if (!value) return true;
//     //     return value && value.type.startsWith("image/");
//     //   })
//     //   .test("fileSize", t("faq.validation.imageSize"), (value) => {
//     //     if (!value) return true;
//     //     return value && value.size <= 5 * 1024 * 1024;
//     //   }),
//   });

//   // ✅ Fixed: Using updateFaqById instead of createFaq
//   const handleSubmit = async (values, { setSubmitting }) => {
//     console.log("values", values);
//     try {
//       const formData = new FormData();

//       formData.append("question", values.question);
//       formData.append("answer", values.answer);

//       if (type?.value && type.value !== "all") {
//         formData.append("type", type.value);
//       }
//       if (selectedOption?.value) {
//         formData.append("type_id", selectedOption.value);
//       }
//       if (image && image !== faq?.image) {
//         formData.append("image", image);
//       }

//       // ========== FUTURE: Add more fields if needed ==========
//       // formData.append("order", values.order);
//       // formData.append("is_featured", values.is_featured);
//       // ========== END FUTURE FIELDS ==========

//       const res = await dispatch(
//         updateFaqById({ id, data: formData }),
//       ).unwrap();
//       toast.success(res?.message || t("faq.success.update"));
//       navigate("/faq");
//     } catch (err) {
//       console.error("Error ❌", err);
//       toast.error(err?.message || t("faq.error.update"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error(t("faq.validation.imageType"));
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(t("faq.validation.imageSize"));
//         return;
//       }

//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeImage = () => {
//     setImage(null);
//     setImagePreview(faq?.image || null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current.click();

//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("faq.details.deleteText") }),
//     );
//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleFaq(id)).unwrap();
//       toast.success(t("faq.success.delete"));
//       navigate("/faq");
//     } catch (error) {
//       toast.error(error?.message || t("faq.error.delete"));
//     }
//   };

//   if (isLoading) return <Loader />;
//   if (isError) return <Error message={message} />;

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             { label: t("faq.breadcrumb.contentManagement"), path: "/faq" },
//             { label: t("faq.breadcrumb.view-faq") },
//           ]}
//         />
//         <PageBody>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize={true}
//           >
//             {({ setFieldValue, values, errors, touched, isSubmitting }) => (
//               <Form className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                   {/* TYPE */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {t("faq.details.type")}
//                     </label>
//                     <Select
//                       value={type}
//                       options={typeOptions}
//                       onChange={(val) => {
//                         setType(val);
//                         setSelectedOption(null);
//                       }}
//                       placeholder={t("faq.details.typePlaceholder")}
//                     />
//                   </div>

//                   {/* DYNAMIC SELECT */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       {t("faq.details.typeId")}
//                     </label>
//                     <Select
//                       value={selectedOption}
//                       onChange={(val) => setSelectedOption(val)}
//                       options={getOptions()}
//                       isDisabled={!type || type?.value === "all"}
//                       placeholder={t("faq.details.typeIdPlaceholder")}
//                     />
//                   </div>
//                 </div>

//                 {/* QUESTION */}
//                 <TextInput
//                   name="question"
//                   label={t("faq.details.question")}
//                   placeholder={t("faq.details.questionPlaceholder")}
//                   maxLength={250}
//                 />

//                 {/* ANSWER */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t("faq.details.answer")}
//                   </label>
//                   <QuillEditor
//                     value={values.answer}
//                     onChange={(val) => setFieldValue("answer", val)}
//                   />
//                   {touched.answer && errors.answer && (
//                     <div className="text-red-500 text-xs mt-1">
//                       {errors.answer}
//                     </div>
//                   )}
//                 </div>

//                 {/* IMAGE */}
//                 <div className="mt-6">
//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     <span className="text-blue-600">
//                       <FiImage />
//                     </span>
//                     {t("faq.details.image")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />

//                     {!imagePreview ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("faq.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {t("faq.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="relative">
//                         <div className="flex items-start gap-6">
//                           <div className="relative group">
//                             <img
//                               src={imagePreview}
//                               alt={t("faq.details.imageAlt")}
//                               className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
//                             />
//                             <button
//                               type="button"
//                               onClick={removeImage}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                             >
//                               <FiX className="text-xs" />
//                             </button>
//                           </div>
//                           <div className="flex-1">
//                             <p className="text-sm font-semibold text-gray-700 mb-1">
//                               {image?.name ||
//                                 (faq?.image && t("faq.details.currentImage"))}
//                             </p>
//                             {image && (
//                               <p className="text-xs text-gray-500 mb-3">
//                                 {(image.size / 1024).toFixed(2)} KB
//                               </p>
//                             )}
//                             <button
//                               type="button"
//                               onClick={triggerFileUpload}
//                               className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                             >
//                               <FiUpload className="text-sm" />
//                               {t("faq.details.changeImage")}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {touched.image && errors.image && (
//                     <div className="text-red-500 text-xs mt-1">
//                       {errors.image}
//                     </div>
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end items-center pt-4">
//                   <div className="flex gap-3">
//                     {/* ========== COMMENTED CODE - CANCEL BUTTON ==========
//                     <button
//                       type="button"
//                       onClick={() => navigate("/faq")}
//                       className="px-4 py-2 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 cursor-pointer"
//                     >
//                       {t("faq.actions.cancel")}
//                     </button>
//                     ========== END COMMENTED CODE ========== */}
//                     <button
//                       type="button"
//                       onClick={handleDelete}
//                       className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
//                     >
//                       {t("faq.actions.deleteFaq")}
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 cursor-pointer"
//                     >
//                       {isSubmitting
//                         ? t("faq.actions.updating")
//                         : t("faq.actions.updateFaq")}
//                     </button>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default FaqDetails;

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../../common/form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import Select from "react-select";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiUpload, FiX } from "react-icons/fi";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

import {
  updateFaqById,
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
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";

const QuillEditor = ({ value, onChange }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
  });

  useEffect(() => {
    if (quill && value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill, value]);

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

const FaqDetails = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { levels, isLoading: levelsLoading } = useSelector(
    (state) => state.level,
  );
  const { modules, isLoading: modulesLoading } = useSelector(
    (state) => state.module,
  );
  const { chapters, isLoading: chaptersLoading } = useSelector(
    (state) => state.chapter,
  );
  const { topics, isLoading: topicsLoading } = useSelector(
    (state) => state.topic,
  );
  const { id } = useParams();

  const [type, setType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Track which data has been fetched
  const [fetchedTypes, setFetchedTypes] = useState({
    level: false,
    module: false,
    chapter: false,
    topic: false,
  });

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
    if (faq?.type) {
      const typeObj = typeOptions.find((opt) => opt.value === faq.type);
      setType(typeObj || typeOptions[0]);

      // if (faq.type && faq.type_id) {
      //   const dynamicOptions = getDynamicOptionsByType(faq.type);
      //   const selected = dynamicOptions.find(
      //     (opt) => opt.value === faq.type_id,
      //   );
      //   setSelectedOption(selected || null);
      // }

      if (faq?.type && faq?.reference?.id) {
        const dynamicOptions = getDynamicOptionsByType(faq.type);

        const selected = dynamicOptions.find(
          (opt) => opt.value === faq.reference.id,
        );

        setSelectedOption(
          selected || {
            value: faq.reference.id,
            label: faq.reference.title,
          },
        );
      }
    }
  }, [faq]);

  const levelOption =
    levels?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const moduleOption =
    modules?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const chapterOption =
    chapters?.data?.map((i) => ({ value: i.id, label: i.title })) || [];
  const topicOption =
    topics?.data?.map((i) => ({ value: i.id, label: i.title })) || [];

  const typeOptions = [
    { value: "all", label: t("faq.types.all") },
    { value: "level", label: t("faq.types.level") },
    { value: "module", label: t("faq.types.module") },
    { value: "chapter", label: t("faq.types.chapter") },
    { value: "topic", label: t("faq.types.topic") },
  ];

  const getOptions = () => {
    switch (type?.value) {
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

  const getDynamicOptionsByType = (typeValue) => {
    switch (typeValue) {
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

  // Function to fetch data based on type
  const fetchTypeSpecificData = useCallback(
    async (typeValue) => {
      switch (typeValue) {
        case "level":
          if (!fetchedTypes.level && !levelsLoading) {
            await dispatch(getAllLevels());
            setFetchedTypes((prev) => ({ ...prev, level: true }));
          }
          break;
        case "module":
          if (!fetchedTypes.module && !modulesLoading) {
            await dispatch(getAllModules());
            setFetchedTypes((prev) => ({ ...prev, module: true }));
          }
          break;
        case "chapter":
          if (!fetchedTypes.chapter && !chaptersLoading) {
            await dispatch(getAllChapters());
            setFetchedTypes((prev) => ({ ...prev, chapter: true }));
          }
          break;
        case "topic":
          if (!fetchedTypes.topic && !topicsLoading) {
            await dispatch(getAllTopics());
            setFetchedTypes((prev) => ({ ...prev, topic: true }));
          }
          break;
        default:
          break;
      }
    },
    [
      dispatch,
      fetchedTypes,
      levelsLoading,
      modulesLoading,
      chaptersLoading,
      topicsLoading,
    ],
  );

  // Handle type change
  const handleTypeChange = useCallback(
    async (selectedType) => {
      setType(selectedType);
      setSelectedOption(null);

      // Fetch only the data for the selected type
      if (selectedType?.value && selectedType.value !== "all") {
        await fetchTypeSpecificData(selectedType.value);
      }
    },
    [fetchTypeSpecificData],
  );

  const initialValues = {
    question: faq?.question || "",
    answer: faq?.answer || "",
    image: faq?.image || null,
  };

  // Validation schema with i18n
  const validationSchema = Yup.object({
    question: Yup.string()
      .required(t("faq.validation.questionRequired"))
      .min(5, t("faq.validation.questionMin")),
    answer: Yup.string()
      .required(t("faq.validation.answerRequired"))
      .min(10, t("faq.validation.answerMin")),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("values", values);
    try {
      const formData = new FormData();

      formData.append("question", values.question);
      formData.append("answer", values.answer);

      if (type?.value && type.value !== "all") {
        formData.append("type", type.value);
      }
      if (selectedOption?.value) {
        formData.append("type_id", selectedOption.value);
      }
      if (image && image !== faq?.image) {
        formData.append("image", image);
      }

      const res = await dispatch(
        updateFaqById({ id, data: formData }),
      ).unwrap();
      toast.success(res?.message || t("faq.success.update"));
      navigate("/faq");
    } catch (err) {
      console.error("Error ❌", err);
      toast.error(err?.message || t("faq.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("faq.validation.imageType"));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("faq.validation.imageSize"));
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
    setImagePreview(faq?.image || null);
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
      toast.success(t("faq.success.delete"));
      navigate("/faq");
    } catch (error) {
      toast.error(error?.message || t("faq.error.delete"));
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
    }),
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            { label: t("faq.breadcrumb.contentManagement"), path: "/faq" },
            { label: t("faq.breadcrumb.view-faq") },
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
                      onChange={handleTypeChange}
                      styles={customSelectStyles}
                      placeholder={t("faq.details.typePlaceholder")}
                    />
                  </div>

                  {/* DYNAMIC SELECT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("faq.details.typeId")}
                    </label>
                    <Select
                      value={selectedOption}
                      onChange={(val) => setSelectedOption(val)}
                      options={getOptions()}
                      styles={customSelectStyles}
                      isDisabled={!type || type?.value === "all"}
                      isLoading={
                        (type?.value === "level" && levelsLoading) ||
                        (type?.value === "module" && modulesLoading) ||
                        (type?.value === "chapter" && chaptersLoading) ||
                        (type?.value === "topic" && topicsLoading)
                      }
                    />
                  </div>
                </div>

                {/* QUESTION */}
                <TextInput
                  name="question"
                  label={t("faq.details.question")}
                  placeholder={t("faq.details.questionPlaceholder")}
                  maxLength={250}
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

                {/* IMAGE */}
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
                        <p className="text-xs text-gray-400">
                          {t("faq.details.uploadSubText")}
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex items-start gap-6">
                          <div className="relative group">
                            <img
                              src={imagePreview}
                              alt={t("faq.details.imageAlt")}
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
                              {image?.name ||
                                (faq?.image && t("faq.details.currentImage"))}
                            </p>
                            {image && (
                              <p className="text-xs text-gray-500 mb-3">
                                {(image.size / 1024).toFixed(2)} KB
                              </p>
                            )}
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

                {/* Footer */}
                <div className="flex justify-end items-center pt-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      {t("faq.actions.deleteFaq")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 cursor-pointer"
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
