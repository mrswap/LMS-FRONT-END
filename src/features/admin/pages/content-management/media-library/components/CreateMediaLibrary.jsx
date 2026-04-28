// import { useState, useRef } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, TextareaField, SelectField } from "../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FiUpload, FiX, FiLink } from "react-icons/fi";

// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../common/layout";

// import { useTranslation } from "react-i18next";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createMedia } from "../../../../../../redux/slice/mediaLibrarySlice";

// const CreateMediaLibrary = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const { t } = useTranslation();
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const typeOptions = [
//     { label: "Image", value: "image" },
//     { label: "Video", value: "video" },
//     { label: "Audio", value: "audio" },
//     { label: "Document", value: "document" },
//   ];

//   const initialValues = {
//     title: "",
//     description: "",
//     type: null,
//     file: null,
//     externalUrl: "",
//   };

//   const validationSchema = Yup.object({
//     title: Yup.string().required(t("mediaLibrary.validation.titleRequired")),
//     type: Yup.object()
//       .nullable()
//       .required(t("mediaLibrary.validation.typeRequired")),
//     description: Yup.string().required(
//       t("mediaLibrary.validation.descriptionRequired"),
//     ),
//     //   externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
//     // }).test(
//     //   "file-or-url",
//     //   t("mediaLibrary.validation.fileOrUrlRequired"),
//     //   (values) => {
//     //     return values.file || values.externalUrl;
//     //   },
//   });

//   const handleFileUpload = (event, setFieldValue) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setFieldValue("file", selectedFile);

//     if (selectedFile.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(selectedFile);
//     } else {
//       setPreview(null);
//     }
//   };

//   const removeFile = (setFieldValue) => {
//     setFile(null);
//     setPreview(null);

//     if (setFieldValue) {
//       setFieldValue("file", null);
//     }

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current.click();

//   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
//     try {
//       const formData = new FormData();

//       formData.append("title", values.title);
//       formData.append("type", values.type.value);
//       formData.append("description", values.description);
//       if (values.file) {
//         formData.append("file", values.file);
//       }
//       if (values.externalUrl) {
//         formData.append("external_url", values.externalUrl);
//       }
//       for (let [key, val] of formData.entries()) {
//         console.log(key, val);
//       }

//       const res = await dispatch(createMedia(formData)).unwrap();
//       toast.success(res.message || "Media created successfully ");
//       resetForm();
//       removeFile();
//       navigate("/media-library");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || "Something went wrong ❌");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <PageHeader>
//           <PageHeaderLeft>
//             <PageTitle>{t("mediaLibrary.create.title")}</PageTitle>
//             <PageSubtitle>{t("mediaLibrary.create.subtitle")}</PageSubtitle>
//           </PageHeaderLeft>
//         </PageHeader>

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({ isSubmitting, setFieldValue, handleSubmit, errors }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Details */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
//                     <AiOutlineExclamationCircle />
//                     {t("mediaLibrary.details.generalDetails")}
//                   </h3>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <TextInput
//                       name="title"
//                       label={t("mediaLibrary.details.mediaName")}
//                       placeholder={t(
//                         "mediaLibrary.details.mediaNamePlaceholder",
//                       )}
//                       required
//                     />

//                     <SelectField
//                       name="type"
//                       label={t("mediaLibrary.details.type")}
//                       placeholder={t("mediaLibrary.details.typePlaceholder")}
//                       options={typeOptions}
//                       required
//                     />
//                   </div>

//                   <div className="mt-4">
//                     <TextareaField
//                       name="description"
//                       label={t("mediaLibrary.details.description")}
//                       placeholder={t(
//                         "mediaLibrary.details.descriptionPlaceholder",
//                       )}
//                       rows={4}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* External URL */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FiLink />
//                     {t("mediaLibrary.details.externalUrl")}
//                   </h3>

//                   <TextInput
//                     name="externalUrl"
//                     label={t("mediaLibrary.details.externalUrl")}
//                     placeholder={t(
//                       "mediaLibrary.details.externalUrlPlaceholder",
//                     )}
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4">
//                     {t("mediaLibrary.details.uploadFile")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       onChange={(e) => handleFileUpload(e, setFieldValue)}
//                       className="hidden"
//                     />

//                     {!file ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("mediaLibrary.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {t("mediaLibrary.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-4">
//                         {preview && (
//                           <img
//                             src={preview}
//                             className="w-20 h-20 object-cover rounded"
//                           />
//                         )}

//                         <div className="flex-1">
//                           <p className="text-sm font-medium">{file.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {(file.size / 1024).toFixed(2)} KB
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => removeFile(setFieldValue)}
//                           className="text-red-500"
//                         >
//                           <FiX />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Error */}
//                   {errors && errors["file-or-url"] && (
//                     <p className="text-red-500 text-sm mt-2">
//                       {errors["file-or-url"]}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <div className="flex justify-end items-center pt-4">
//                   <div className="flex gap-3">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                     >
//                       {isSubmitting
//                         ? t("mediaLibrary.actions.creating")
//                         : t("mediaLibrary.actions.createMedia")}
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

// export default CreateMediaLibrary;

// import { useState, useRef } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, TextareaField, SelectField } from "../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FiUpload, FiX, FiLink } from "react-icons/fi";

// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../../common/layout";

// import { useTranslation } from "react-i18next";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createMedia } from "../../../../../../redux/slice/mediaLibrarySlice";

// const CreateMediaLibrary = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const { t } = useTranslation();
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Fixed: Dynamic type options with i18n
//   const typeOptions = [
//     { label: t("mediaLibrary.types.image"), value: "image" },
//     { label: t("mediaLibrary.types.video"), value: "video" },
//     { label: t("mediaLibrary.types.audio"), value: "audio" },
//     { label: t("mediaLibrary.types.document"), value: "document" },
//   ];

//   const initialValues = {
//     title: "",
//     description: "",
//     type: null,
//     file: null,
//     externalUrl: "",
//   };

//   // ✅ Fixed: Proper validation with file OR URL condition
//   const validationSchema = Yup.object({
//     title: Yup.string().required(t("mediaLibrary.validation.titleRequired")),
//     type: Yup.object()
//       .nullable()
//       .required(t("mediaLibrary.validation.typeRequired")),
//     description: Yup.string().required(
//       t("mediaLibrary.validation.descriptionRequired"),
//     ),
//     externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
//   }).test(
//     "file-or-url",
//     t("mediaLibrary.validation.fileOrUrlRequired"),
//     (values) => {
//       return values.file || values.externalUrl;
//     },
//   );

//   const handleFileUpload = (event, setFieldValue) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     // ✅ Fixed: File validation
//     if (
//       !selectedFile.type.startsWith("image/") &&
//       !selectedFile.type.startsWith("video/") &&
//       !selectedFile.type.startsWith("audio/") &&
//       !selectedFile.type.startsWith("application/")
//     ) {
//       toast.error(t("mediaLibrary.validation.invalidFileType"));
//       return;
//     }

//     if (selectedFile.size > 10 * 1024 * 1024) {
//       toast.error(t("mediaLibrary.validation.fileSize"));
//       return;
//     }

//     setFile(selectedFile);
//     setFieldValue("file", selectedFile);
//     setFieldValue("externalUrl", ""); // Clear URL when file is uploaded

//     if (selectedFile.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onloadend = () => setPreview(reader.result);
//       reader.readAsDataURL(selectedFile);
//     } else {
//       setPreview(null);
//     }
//   };

//   const removeFile = (setFieldValue) => {
//     setFile(null);
//     setPreview(null);
//     if (setFieldValue) {
//       setFieldValue("file", null);
//     }
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerFileUpload = () => fileInputRef.current.click();

//   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
//     try {
//       const formData = new FormData();

//       formData.append("title", values.title);
//       formData.append("type", values.type.value);
//       formData.append("description", values.description);

//       if (values.file) {
//         formData.append("file", values.file);
//       }
//       if (values.externalUrl) {
//         formData.append("external_url", values.externalUrl);
//       }

//       // ========== FUTURE: Add more fields if needed ==========
//       // formData.append("tags", values.tags);
//       // formData.append("alt_text", values.alt_text);
//       // ========== END FUTURE FIELDS ==========

//       const res = await dispatch(createMedia(formData)).unwrap();
//       toast.success(res?.message || t("mediaLibrary.success.create"));
//       resetForm();
//       removeFile();
//       navigate("/media-library");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || t("mediaLibrary.error.create"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <PageHeader>
//           <PageHeaderLeft>
//             <PageTitle>{t("mediaLibrary.create.title")}</PageTitle>
//             <PageSubtitle>{t("mediaLibrary.create.subtitle")}</PageSubtitle>
//           </PageHeaderLeft>
//         </PageHeader>

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({
//               isSubmitting,
//               setFieldValue,
//               handleSubmit,
//               errors,
//               values,
//             }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Details */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
//                     <AiOutlineExclamationCircle />
//                     {t("mediaLibrary.details.generalDetails")}
//                   </h3>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <TextInput
//                       name="title"
//                       label={t("mediaLibrary.details.mediaName")}
//                       placeholder={t(
//                         "mediaLibrary.details.mediaNamePlaceholder",
//                       )}
//                       required
//                     />

//                     <SelectField
//                       name="type"
//                       label={t("mediaLibrary.details.type")}
//                       placeholder={t("mediaLibrary.details.typePlaceholder")}
//                       options={typeOptions}
//                       required
//                     />
//                   </div>

//                   <div className="mt-4">
//                     <TextareaField
//                       name="description"
//                       label={t("mediaLibrary.details.description")}
//                       placeholder={t(
//                         "mediaLibrary.details.descriptionPlaceholder",
//                       )}
//                       rows={4}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* External URL */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                     <FiLink />
//                     {t("mediaLibrary.details.externalUrl")}
//                   </h3>

//                   <TextInput
//                     name="externalUrl"
//                     label={t("mediaLibrary.details.externalUrl")}
//                     placeholder={t(
//                       "mediaLibrary.details.externalUrlPlaceholder",
//                     )}
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         setFieldValue("externalUrl", e.target.value);
//                         if (file) removeFile(setFieldValue);
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4">
//                     {t("mediaLibrary.details.uploadFile")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       onChange={(e) => handleFileUpload(e, setFieldValue)}
//                       className="hidden"
//                     />

//                     {!file ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("mediaLibrary.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {t("mediaLibrary.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-4">
//                         {preview && (
//                           <img
//                             src={preview}
//                             alt={t("mediaLibrary.details.previewAlt")}
//                             className="w-20 h-20 object-cover rounded"
//                           />
//                         )}
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">{file.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {(file.size / 1024).toFixed(2)} KB
//                           </p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeFile(setFieldValue)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <FiX />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Global Error for file-or-url */}
//                   {errors && errors["file-or-url"] && (
//                     <p className="text-red-500 text-sm mt-2">
//                       {errors["file-or-url"]}
//                     </p>
//                   )}
//                 </div>

//                 {/* Submit */}
//                 <div className="flex justify-end items-center pt-4">
//                   <div className="flex gap-3">
//                     {/* ========== COMMENTED CODE - CANCEL BUTTON ==========
//                     <button
//                       type="button"
//                       onClick={() => navigate("/media-library")}
//                       className="px-4 py-2 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 cursor-pointer"
//                     >
//                       {t("mediaLibrary.actions.cancel")}
//                     </button>
//                     ========== END COMMENTED CODE ========== */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 cursor-pointer"
//                     >
//                       {isSubmitting
//                         ? t("mediaLibrary.actions.creating")
//                         : t("mediaLibrary.actions.createMedia")}
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

// export default CreateMediaLibrary;

import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiUpload, FiX, FiLink } from "react-icons/fi";

import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../../common/layout";

import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMedia } from "../../../../../../redux/slice/mediaLibrarySlice";

// Allowed extensions configuration
const ALLOWED_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov", "avi", "mkv"],
  audio: ["mp3", "wav", "aac"],
  document: ["pdf", "doc", "docx", "xls", "xlsx"],
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CreateMediaLibrary = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const typeOptions = [
    { label: t("mediaLibrary.types.image"), value: "image" },
    { label: t("mediaLibrary.types.video"), value: "video" },
    { label: t("mediaLibrary.types.audio"), value: "audio" },
    { label: t("mediaLibrary.types.document"), value: "document" },
  ];

  const initialValues = {
    title: "",
    description: "",
    type: null,
    file: null,
    externalUrl: "",
  };

  // Validation schema with file extension validation
  const validationSchema = Yup.object({
    title: Yup.string()
      .required(t("mediaLibrary.validation.titleRequired"))
      .min(3, "Title must be at least 3 characters")
      .max(255, "Title must not exceed 255 characters"),
    type: Yup.object()
      .nullable()
      .required(t("mediaLibrary.validation.typeRequired")),
    description: Yup.string()
      .required(t("mediaLibrary.validation.descriptionRequired"))
      .min(10, "Description must be at least 10 characters"),
    externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
    file: Yup.mixed()
      .nullable()
      .test("file-size", "File size should be less than 10MB", (value) => {
        if (!value) return true;
        return value.size <= MAX_FILE_SIZE;
      })
      .test(
        "file-extension",
        "Invalid file format for selected type",
        function (value) {
          const { type, externalUrl } = this.parent;

          // Skip if no file or if external URL is provided
          if (!value || externalUrl) return true;
          if (!type) return true;

          const ext = value.name.split(".").pop().toLowerCase();
          const allowedExtensions = ALLOWED_EXTENSIONS[type.value];

          if (!allowedExtensions) return false;
          return allowedExtensions.includes(ext);
        },
      ),
  }).test(
    "file-or-url",
    t("mediaLibrary.validation.fileOrUrlRequired"),
    (values) => {
      return values.file || values.externalUrl;
    },
  );

  // Validate file extension based on selected type
  const validateFileExtension = (file, type) => {
    if (!type) {
      toast.error("Please select media type first");
      return false;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    const allowedExtensions = ALLOWED_EXTENSIONS[type];

    if (!allowedExtensions.includes(ext)) {
      toast.error(
        `Invalid ${type} format. Allowed: ${allowedExtensions.join(", ")}`,
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = (event, setFieldValue, currentType) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
      return;
    }

    // Validate extension based on selected type
    const typeToUse = currentType || selectedType;
    if (!validateFileExtension(selectedFile, typeToUse)) {
      event.target.value = ""; // Clear input
      return;
    }

    setFile(selectedFile);
    setFieldValue("file", selectedFile);
    setFieldValue("externalUrl", ""); // Clear URL when file is uploaded

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const removeFile = (setFieldValue) => {
    setFile(null);
    setPreview(null);
    if (setFieldValue) {
      setFieldValue("file", null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    if (!selectedType) {
      toast.error("Please select media type first");
      return;
    }
    fileInputRef.current.click();
  };

  const handleTypeChange = (option, setFieldValue, currentFile) => {
    setSelectedType(option?.value);
    setFieldValue("type", option);

    // If file exists and type changed, validate the file again
    if (currentFile && option) {
      const ext = currentFile.name.split(".").pop().toLowerCase();
      const allowedExtensions = ALLOWED_EXTENSIONS[option.value];

      if (!allowedExtensions.includes(ext)) {
        toast.error(
          `Current file (.${ext}) is not allowed for ${option.value}. Please upload a new file.`,
        );
        removeFile(setFieldValue);
      }
    }
  };

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      // Pre-submit validation for file extension
      if (values.file && values.type) {
        const ext = values.file.name.split(".").pop().toLowerCase();
        const allowedExtensions = ALLOWED_EXTENSIONS[values.type.value];

        if (!allowedExtensions.includes(ext)) {
          toast.error(
            `File extension .${ext} is not allowed for ${values.type.value}`,
          );
          setSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type.value);
      formData.append("description", values.description);

      if (values.file) {
        formData.append("file", values.file);
      }
      if (values.externalUrl) {
        formData.append("external_url", values.externalUrl);
      }

      const res = await dispatch(createMedia(formData)).unwrap();
      toast.success(res?.message || t("mediaLibrary.success.create"));
      resetForm();
      removeFile();
      setSelectedType(null);
      navigate("/media-library");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("mediaLibrary.error.create"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("mediaLibrary.create.title")}</PageTitle>
            <PageSubtitle>{t("mediaLibrary.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              isSubmitting,
              setFieldValue,
              handleSubmit,
              errors,
              values,
              touched,
            }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                {/* Details Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("mediaLibrary.details.generalDetails")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="title"
                      label={t("mediaLibrary.details.mediaName")}
                      placeholder={t(
                        "mediaLibrary.details.mediaNamePlaceholder",
                      )}
                      required
                    />

                    <SelectField
                      name="type"
                      label={t("mediaLibrary.details.type")}
                      placeholder={t("mediaLibrary.details.typePlaceholder")}
                      options={typeOptions}
                      required
                      onChange={(option) =>
                        handleTypeChange(option, setFieldValue, values.file)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <TextareaField
                      name="description"
                      label={t("mediaLibrary.details.description")}
                      placeholder={t(
                        "mediaLibrary.details.descriptionPlaceholder",
                      )}
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* External URL Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiLink />
                    {t("mediaLibrary.details.externalUrl")}
                  </h3>

                  <TextInput
                    name="externalUrl"
                    label={t("mediaLibrary.details.externalUrl")}
                    placeholder={t(
                      "mediaLibrary.details.externalUrlPlaceholder",
                    )}
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue("externalUrl", e.target.value);
                        if (file) removeFile(setFieldValue);
                      } else {
                        setFieldValue("externalUrl", "");
                      }
                    }}
                  />
                </div>

                {/* File Upload Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">
                    {t("mediaLibrary.details.uploadFile")}
                  </h3>

                  <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mkv,.mp3,.wav,.aac,.pdf,.doc,.docx,.xls,.xlsx"
                      onChange={(e) =>
                        handleFileUpload(e, setFieldValue, values.type?.value)
                      }
                      className="hidden"
                    />

                    {!file ? (
                      <div
                        onClick={triggerFileUpload}
                        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
                      >
                        <FiUpload className="text-4xl text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          {t("mediaLibrary.details.uploadText")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {values.type?.value
                            ? `Allowed: ${ALLOWED_EXTENSIONS[values.type.value].join(", ").toUpperCase()} (Max 10MB)`
                            : t("mediaLibrary.details.uploadSubText")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {preview && (
                          <img
                            src={preview}
                            alt={t("mediaLibrary.details.previewAlt")}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        {!preview && values.type?.value === "video" && (
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Video</span>
                          </div>
                        )}
                        {!preview && values.type?.value === "audio" && (
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">Audio</span>
                          </div>
                        )}
                        {!preview && values.type?.value === "document" && (
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              Document
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Type: {values.type?.value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(setFieldValue)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File validation errors */}
                  {touched.file && errors.file && (
                    <p className="text-red-500 text-sm mt-2">{errors.file}</p>
                  )}

                  {/* Global error for file-or-url */}
                  {errors && errors["file-or-url"] && !errors.file && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors["file-or-url"]}
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/media-library");
                      }}
                      className="px-4 py-2 rounded-md text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {t("mediaLibrary.actions.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      {isSubmitting
                        ? t("mediaLibrary.actions.creating")
                        : t("mediaLibrary.actions.createMedia")}
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

export default CreateMediaLibrary;
