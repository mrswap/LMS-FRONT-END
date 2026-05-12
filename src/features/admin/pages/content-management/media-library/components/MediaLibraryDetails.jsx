// import { useState, useRef, useEffect } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, TextareaField, SelectField } from "../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import {
//   FiUpload,
//   FiX,
//   FiLink,
//   FiImage,
//   FiVideo,
//   FiMusic,
//   FiFile,
// } from "react-icons/fi";
// import { PageLayout, PageBody } from "../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getMediaById,
//   updateMediaById,
//   deleteSingleMedia,
// } from "../../../../../../redux/slice/mediaLibrarySlice";
// import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
// import Breadcrumb from "../../../../common/layout/Breadcrumb";
// import Loader from "../../../../common/Loader";
// import Error from "../../../../common/Error";
// import usePermission from "../../../../../../hooks/usePermission";

// // Allowed extensions configuration
// const ALLOWED_EXTENSIONS = {
//   image: ["jpg", "jpeg", "png", "webp"],
//   video: ["mp4", "mov", "avi", "mkv"],
//   audio: ["mp3", "wav", "aac"],
//   document: ["pdf", "doc", "docx", "xls", "xlsx"],
// };

// // Max file size: 10MB
// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const MediaLibraryDetails = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const fileInputRef = useRef(null);
//   const { t } = useTranslation();
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { hasPermission } = usePermission();

//   const { singleMedia, isLoading, isError, message } = useSelector(
//     (state) => state.media,
//   );

//   console.log("singleMedai", singleMedia);

//   // Fetch media data
//   useEffect(() => {
//     if (id) {
//       dispatch(getMediaById(id)).finally(() => setInitialLoading(false));
//     }
//   }, [dispatch, id]);

//   // Set preview from existing media
//   useEffect(() => {
//     if (singleMedia?.full_url) {
//       setPreview(singleMedia.full_url);
//     }

//     if (singleMedia?.type) {
//       setSelectedType(singleMedia.type);
//     }
//   }, [singleMedia]);

//   const typeOptions = [
//     { label: t("mediaLibrary.types.image"), value: "image" },
//     { label: t("mediaLibrary.types.video"), value: "video" },
//     { label: t("mediaLibrary.types.audio"), value: "audio" },
//     { label: t("mediaLibrary.types.document"), value: "document" },
//   ];

//   const initialValues = {
//     title: singleMedia?.title || "",
//     type: typeOptions?.find((opt) => opt.value === singleMedia?.type) || null,
//     description: singleMedia?.description || "",
//     file: singleMedia?.full_url || null,
//     externalUrl: singleMedia?.external_url || "",
//   };

//   // Validation schema with file extension validation
//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .required(t("mediaLibrary.validation.titleRequired"))
//       .min(3, "Title must be at least 3 characters")
//       .max(255, "Title must not exceed 255 characters"),
//     type: Yup.object()
//       .nullable()
//       .required(t("mediaLibrary.validation.typeRequired")),
//     description: Yup.string()
//       .required(t("mediaLibrary.validation.descriptionRequired"))
//       .min(10, "Description must be at least 10 characters"),
//     externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
//     // file: Yup.mixed()
//     //   .nullable()
//     //   .test("file-size", "File size should be less than 10MB", (value) => {
//     //     if (!value) return true;
//     //     return value.size <= MAX_FILE_SIZE;
//     //   })
//     file: Yup.mixed()
//       .nullable()
//       .test("file-size", "File size should be less than 10MB", (value) => {
//         if (!value) return true;

//         if (typeof value === "string") return true;

//         return value.size <= MAX_FILE_SIZE;
//       })
//       // .test(
//       //   "file-extension",
//       //   "Invalid file format for selected type",
//       //   function (value) {
//       //     const { type, externalUrl } = this.parent;

//       //     // Skip if no file or if external URL is provided
//       //     if (!value || externalUrl) return true;
//       //     if (!type) return true;

//       //     const ext = value.name.split(".").pop().toLowerCase();
//       //     const allowedExtensions = ALLOWED_EXTENSIONS[type.value];

//       //     if (!allowedExtensions) return false;
//       //     return allowedExtensions.includes(ext);
//       //   },
//       // ),
//       .test(
//         "file-extension",
//         "Invalid file format for selected type",
//         function (value) {
//           const { type, externalUrl } = this.parent;

//           if (!value || externalUrl) return true;

//           if (!type) return true;

//           // existing file url
//           if (typeof value === "string") return true;

//           const ext = value.name.split(".").pop().toLowerCase();

//           const allowedExtensions = ALLOWED_EXTENSIONS[type.value];

//           if (!allowedExtensions) return false;

//           return allowedExtensions.includes(ext);
//         },
//       ),
//   });

//   // // Validate file extension based on selected type
//   // const validateFileExtension = (file, type) => {
//   //   if (!type) {
//   //     toast.error("Please select media type first");
//   //     return false;
//   //   }

//   //   // const ext = file.name.split(".").pop().toLowerCase();
//   //   if (typeof values.file === "string") return;

//   //   const ext = values.file.name.split(".").pop().toLowerCase();
//   //   const allowedExtensions = ALLOWED_EXTENSIONS[type];

//   //   if (!allowedExtensions.includes(ext)) {
//   //     toast.error(
//   //       `Invalid ${type} format. Allowed: ${allowedExtensions.join(", ")}`,
//   //     );
//   //     return false;
//   //   }

//   //   return true;
//   // };

//   // Validate file extension based on selected type
//   const validateFileExtension = (file, type) => {
//     if (!type) {
//       toast.error("Please select media type first");
//       return false;
//     }

//     // agar existing url string h to skip
//     if (typeof file === "string") return true;

//     const ext = file.name.split(".").pop().toLowerCase();

//     const allowedExtensions = ALLOWED_EXTENSIONS[type];

//     if (!allowedExtensions.includes(ext)) {
//       toast.error(
//         `Invalid ${type} format. Allowed: ${allowedExtensions.join(", ")}`,
//       );

//       return false;
//     }

//     return true;
//   };

//   const handleFileUpload = (event, setFieldValue, currentType) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     // Validate file size
//     if (selectedFile.size > MAX_FILE_SIZE) {
//       toast.error(
//         `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
//       );
//       event.target.value = "";
//       return;
//     }

//     // Validate extension based on selected type
//     const typeToUse = currentType || selectedType;
//     if (!validateFileExtension(selectedFile, typeToUse)) {
//       event.target.value = "";
//       return;
//     }

//     setFile(selectedFile);
//     setFieldValue("file", selectedFile);
//     setFieldValue("externalUrl", ""); // Clear URL when file is uploaded

//     // Create preview for images
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
//     setPreview(singleMedia?.file_url || null);
//     if (setFieldValue) {
//       setFieldValue("file", null);
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const triggerFileUpload = () => {
//     if (!selectedType && !file) {
//       toast.error("Please select media type first");
//       return;
//     }
//     fileInputRef.current.click();
//   };

//   const handleTypeChange = (option, setFieldValue, currentFile) => {
//     const newType = option?.value;
//     setSelectedType(newType);
//     setFieldValue("type", option);

//     // If file exists and type changed, validate the file again
//     if (currentFile && newType) {
//       const ext = currentFile.name.split(".").pop().toLowerCase();
//       const allowedExtensions = ALLOWED_EXTENSIONS[newType];

//       if (!allowedExtensions.includes(ext)) {
//         toast.error(
//           `Current file (.${ext}) is not allowed for ${newType}. Please upload a new file.`,
//         );
//         removeFile(setFieldValue);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("mediaLibrary.details.deleteText") }),
//     );
//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleMedia(id)).unwrap();
//       toast.success(t("mediaLibrary.success.delete"));
//       navigate("/media-library");
//     } catch (error) {
//       toast.error(error?.message || t("mediaLibrary.error.delete"));
//     }
//   };

//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       // Pre-submit validation for file extension
//       // if (values.file && values.type) {
//       //   // const ext = values.file.name.split(".").pop().toLowerCase();
//       //   if (typeof value === "string") return true;

//       //   const ext = value.name.split(".").pop().toLowerCase();
//       //   const allowedExtensions = ALLOWED_EXTENSIONS[values.type.value];

//       //   if (!allowedExtensions.includes(ext)) {
//       //     toast.error(
//       //       `File extension .${ext} is not allowed for ${values.type.value}`,
//       //     );
//       //     setSubmitting(false);
//       //     return;
//       //   }
//       // }

//       if (values.file && typeof values.file !== "string" && values.type) {
//         const ext = values.file.name.split(".").pop().toLowerCase();

//         const allowedExtensions = ALLOWED_EXTENSIONS[values.type.value];

//         if (!allowedExtensions.includes(ext)) {
//           toast.error(
//             `File extension .${ext} is not allowed for ${values.type.value}`,
//           );

//           setSubmitting(false);
//           return;
//         }
//       }

//       const formData = new FormData();

//       formData.append("title", values.title);
//       formData.append("type", values.type.value);
//       formData.append("description", values.description);

//       // if (values.file) {
//       //   formData.append("file", values.file);
//       // }

//       if (values.file && typeof values.file !== "string") {
//         formData.append("file", values.file);
//       } else {
//         formData.append("file", "");
//       }
//       if (values.externalUrl) {
//         formData.append("external_url", values.externalUrl);
//       }

//       // payload check
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const res = await dispatch(
//         updateMediaById({ id, data: formData }),
//       ).unwrap();

//       toast.success(res?.message || t("mediaLibrary.success.update"));
//       navigate("/media-library");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || t("mediaLibrary.error.update"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Get file icon for display
//   const getFileIcon = (type) => {
//     switch (type) {
//       case "image":
//         return <FiImage className="text-4xl text-blue-500" />;
//       case "video":
//         return <FiVideo className="text-4xl text-red-500" />;
//       case "audio":
//         return <FiMusic className="text-4xl text-green-500" />;
//       case "document":
//         return <FiFile className="text-4xl text-orange-500" />;
//       default:
//         return <FiFile className="text-4xl text-gray-500" />;
//     }
//   };

//   if (initialLoading || isLoading) return <Loader />;
//   // if (isError) return <Error message={message} />;
//   if (!singleMedia) return <Error message="Media not found" />;

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("mediaLibrary.breadcrumb.contentManagement"),
//               path: "/media-library",
//             },
//             {
//               label: t("mediaLibrary.breadcrumb.view-media"),
//             },
//           ]}
//         />

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({
//               isSubmitting,
//               setFieldValue,
//               handleSubmit,
//               errors,
//               values,
//               touched,
//             }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Details Section */}
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
//                       maxLength={150}
//                     />

//                     <SelectField
//                       name="type"
//                       label={t("mediaLibrary.details.type")}
//                       placeholder={t("mediaLibrary.details.typePlaceholder")}
//                       options={typeOptions}
//                       required
//                       onChange={(option) =>
//                         handleTypeChange(option, setFieldValue, values.file)
//                       }
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
//                       maxLength={500}
//                     />
//                   </div>
//                 </div>

//                 {/* External URL Section */}
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
//                     maxLength={250}
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         setFieldValue("externalUrl", e.target.value);
//                         if (file) removeFile(setFieldValue);
//                       } else {
//                         setFieldValue("externalUrl", "");
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* File Upload Section */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4">
//                     {t("mediaLibrary.details.uploadFile")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mkv,.mp3,.wav,.aac,.pdf,.doc,.docx,.xls,.xlsx"
//                       onChange={(e) =>
//                         handleFileUpload(e, setFieldValue, values.type?.value)
//                       }
//                       className="hidden"
//                     />

//                     {!file && !preview ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("mediaLibrary.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {values.type?.value
//                             ? `Allowed: ${ALLOWED_EXTENSIONS[values.type.value].join(", ").toUpperCase()} (Max 10MB)`
//                             : t("mediaLibrary.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-4">
//                         {/* Preview for images */}
//                         {preview && values.type?.value === "image" && (
//                           <img
//                             src={preview}
//                             alt={t("mediaLibrary.details.previewAlt")}
//                             className="w-20 h-20 object-cover rounded"
//                           />
//                         )}

//                         {/* Video Preview */}
//                         {preview && values.type?.value === "video" && (
//                           <video
//                             src={preview}
//                             controls
//                             className="w-40 h-24 rounded"
//                           />
//                         )}

//                         {/* Icons for other file types */}
//                         {!preview && values.type?.value && (
//                           <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
//                             {getFileIcon(values.type.value)}
//                           </div>
//                         )}

//                         <div className="flex-1">
//                           <p className="text-sm font-medium">
//                             {file?.name || (preview && "Current file")}
//                           </p>
//                           {file && (
//                             <>
//                               <p className="text-xs text-gray-500">
//                                 {(file.size / 1024).toFixed(2)} KB
//                               </p>
//                               <p className="text-xs text-blue-600 mt-1">
//                                 New file to be uploaded
//                               </p>
//                             </>
//                           )}
//                           {!file && preview && (
//                             <p className="text-xs text-gray-500">
//                               Current file from server
//                             </p>
//                           )}
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => removeFile(setFieldValue)}
//                           className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
//                         >
//                           <FiX size={20} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* File validation errors */}
//                   {touched.file && errors.file && (
//                     <p className="text-red-500 text-sm mt-2">{errors.file}</p>
//                   )}
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end items-center pt-4 border-t border-gray-200">
//                   <div className="flex gap-3">
//                     {hasPermission("media.delete") && (
//                       <button
//                         type="button"
//                         onClick={handleDelete}
//                         className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
//                       >
//                         {t("mediaLibrary.actions.deleteMedia")}
//                       </button>
//                     )}

//                     {hasPermission("media.edit") && (
//                       <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="px-4 py-2 rounded-md text-sm text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
//                       >
//                         {isSubmitting
//                           ? t("mediaLibrary.actions.updating")
//                           : t("mediaLibrary.actions.updateMedia")}
//                       </button>
//                     )}
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

// export default MediaLibraryDetails;

// import { useState, useRef, useEffect } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, TextareaField, SelectField } from "../../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import {
//   FiUpload,
//   FiX,
//   FiLink,
//   FiImage,
//   FiVideo,
//   FiMusic,
//   FiFile,
// } from "react-icons/fi";
// import { PageLayout, PageBody } from "../../../../common/layout";
// import { useTranslation } from "react-i18next";
// import { useToast } from "../../../../common/toast/ToastContext";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   getMediaById,
//   updateMediaById,
//   deleteSingleMedia,
// } from "../../../../../../redux/slice/mediaLibrarySlice";
// import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
// import Breadcrumb from "../../../../common/layout/Breadcrumb";
// import Loader from "../../../../common/Loader";
// import Error from "../../../../common/Error";
// import usePermission from "../../../../../../hooks/usePermission";

// // Allowed extensions configuration
// const ALLOWED_EXTENSIONS = {
//   image: ["jpg", "jpeg", "png", "webp"],
//   video: ["mp4", "mov", "avi", "mkv"],
//   audio: ["mp3", "wav", "aac"],
//   document: ["pdf", "doc", "docx", "xls", "xlsx"],
// };

// // Max file size: 10MB
// const MAX_FILE_SIZE = 10 * 1024 * 1024;

// const MediaLibraryDetails = () => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const fileInputRef = useRef(null);
//   const { t } = useTranslation();
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { hasPermission } = usePermission();

//   const { singleMedia, isLoading, isError, message } = useSelector(
//     (state) => state.media,
//   );

//   // console.log("singleMedai", singleMedia);

//   // Fetch media data
//   useEffect(() => {
//     if (id) {
//       dispatch(getMediaById(id)).finally(() => setInitialLoading(false));
//     }
//   }, [dispatch, id]);

//   // Set preview from existing media
//   useEffect(() => {
//     if (singleMedia?.full_url) {
//       setPreview(singleMedia.full_url);
//     }

//     if (singleMedia?.type) {
//       setSelectedType(singleMedia.type);
//     }
//   }, [singleMedia]);

//   const typeOptions = [
//     { label: t("mediaLibrary.types.image"), value: "image" },
//     { label: t("mediaLibrary.types.video"), value: "video" },
//     { label: t("mediaLibrary.types.audio"), value: "audio" },
//     { label: t("mediaLibrary.types.document"), value: "document" },
//   ];

//   const initialValues = {
//     title: singleMedia?.title || "",
//     type: typeOptions?.find((opt) => opt.value === singleMedia?.type) || null,
//     description: singleMedia?.description || "",
//     file: singleMedia?.full_url || null,
//     externalUrl: singleMedia?.external_url || "",
//   };

//   // Validation schema with file extension validation
//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .required(t("mediaLibrary.validation.titleRequired"))
//       .min(3, "Title must be at least 3 characters")
//       .max(255, "Title must not exceed 255 characters"),
//     type: Yup.object()
//       .nullable()
//       .required(t("mediaLibrary.validation.typeRequired")),
//     description: Yup.string()
//       .required(t("mediaLibrary.validation.descriptionRequired"))
//       .min(10, "Description must be at least 10 characters"),
//     externalUrl: Yup.string().url(t("mediaLibrary.validation.invalidUrl")),
//     file: Yup.mixed()
//       .nullable()
//       .test("file-size", "File size should be less than 10MB", (value) => {
//         if (!value) return true;

//         if (typeof value === "string") return true;

//         return value.size <= MAX_FILE_SIZE;
//       })
//       .test(
//         "file-extension",
//         "Invalid file format for selected type",
//         function (value) {
//           const { type, externalUrl } = this.parent;

//           if (!value || externalUrl) return true;

//           if (!type) return true;

//           // existing file url
//           if (typeof value === "string") return true;

//           const ext = value.name.split(".").pop().toLowerCase();

//           const allowedExtensions = ALLOWED_EXTENSIONS[type.value];

//           if (!allowedExtensions) return false;

//           return allowedExtensions.includes(ext);
//         },
//       ),
//   });

//   // Validate file extension based on selected type
//   const validateFileExtension = (file, type) => {
//     if (!type) {
//       toast.error("Please select media type first");
//       return false;
//     }

//     // agar existing url string h to skip
//     if (typeof file === "string") return true;

//     const ext = file.name.split(".").pop().toLowerCase();

//     const allowedExtensions = ALLOWED_EXTENSIONS[type];

//     if (!allowedExtensions.includes(ext)) {
//       toast.error(
//         `Invalid ${type} format. Allowed: ${allowedExtensions.join(", ")}`,
//       );

//       return false;
//     }

//     return true;
//   };

//   const handleFileUpload = (event, setFieldValue, currentType) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     // Validate file size
//     if (selectedFile.size > MAX_FILE_SIZE) {
//       toast.error(
//         `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
//       );
//       event.target.value = "";
//       return;
//     }

//     // Validate extension based on selected type
//     const typeToUse = currentType || selectedType;
//     if (!validateFileExtension(selectedFile, typeToUse)) {
//       event.target.value = "";
//       return;
//     }

//     setFile(selectedFile);
//     setFieldValue("file", selectedFile);
//     setFieldValue("externalUrl", ""); // Clear URL when file is uploaded

//     // Create preview for images
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
//     setPreview(singleMedia?.file_url || null);
//     if (setFieldValue) {
//       setFieldValue("file", null);
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const triggerFileUpload = () => {
//     if (!selectedType && !file) {
//       toast.error("Please select media type first");
//       return;
//     }
//     fileInputRef.current.click();
//   };

//   const handleTypeChange = (option, setFieldValue, currentFile) => {
//     const newType = option?.value;
//     setSelectedType(newType);
//     setFieldValue("type", option);

//     // If file exists and type changed, validate the file again
//     if (currentFile && newType) {
//       const ext = currentFile.name.split(".").pop().toLowerCase();
//       const allowedExtensions = ALLOWED_EXTENSIONS[newType];

//       if (!allowedExtensions.includes(ext)) {
//         toast.error(
//           `Current file (.${ext}) is not allowed for ${newType}. Please upload a new file.`,
//         );
//         removeFile(setFieldValue);
//       }
//     }
//   };

//   const handleDelete = async () => {
//     const ok = await dispatch(
//       showConfirm({ message: t("mediaLibrary.details.deleteText") }),
//     );
//     if (!ok) return;

//     try {
//       await dispatch(deleteSingleMedia(id)).unwrap();
//       toast.success(t("mediaLibrary.success.delete"));
//       navigate("/media-library");
//     } catch (error) {
//       toast.error(error?.message || t("mediaLibrary.error.delete"));
//     }
//   };

//   const onSubmit = async (values, { setSubmitting, setErrors }) => {
//     try {
//       // Pre-submit validation for file extension
//       if (values.file && typeof values.file !== "string" && values.type) {
//         const ext = values.file.name.split(".").pop().toLowerCase();

//         const allowedExtensions = ALLOWED_EXTENSIONS[values.type.value];

//         if (!allowedExtensions.includes(ext)) {
//           toast.error(
//             `File extension .${ext} is not allowed for ${values.type.value}`,
//           );

//           setSubmitting(false);
//           return;
//         }
//       }

//       const formData = new FormData();

//       formData.append("title", values.title);
//       formData.append("type", values.type.value);
//       formData.append("description", values.description);

//       if (values.file && typeof values.file !== "string") {
//         formData.append("file", values.file);
//       } else {
//         formData.append("file", "");
//       }
//       if (values.externalUrl) {
//         formData.append("external_url", values.externalUrl);
//       }

//       // payload check
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const res = await dispatch(
//         updateMediaById({ id, data: formData }),
//       ).unwrap();

//       toast.success(res?.message || t("mediaLibrary.success.update"));
//       navigate("/media-library");
//     } catch (error) {
//       setErrors({ submit: error.message });
//       toast.error(error?.message || t("mediaLibrary.error.update"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Get file icon for display
//   const getFileIcon = (type) => {
//     switch (type) {
//       case "image":
//         return <FiImage className="text-4xl text-blue-500" />;
//       case "video":
//         return <FiVideo className="text-4xl text-red-500" />;
//       case "audio":
//         return <FiMusic className="text-4xl text-green-500" />;
//       case "document":
//         return <FiFile className="text-4xl text-orange-500" />;
//       default:
//         return <FiFile className="text-4xl text-gray-500" />;
//     }
//   };

//   if (initialLoading || isLoading) return <Loader />;
//   // if (isError) return <Error message={message} />;
//   if (!singleMedia) return <Error message="Media not found" />;

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <Breadcrumb
//           items={[
//             {
//               label: t("mediaLibrary.breadcrumb.contentManagement"),
//               path: "/media-library",
//             },
//             {
//               label: t("mediaLibrary.breadcrumb.view-media"),
//             },
//           ]}
//         />

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({
//               isSubmitting,
//               setFieldValue,
//               handleSubmit,
//               errors,
//               values,
//               touched,
//             }) => (
//               <Form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Details Section */}
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
//                       maxLength={150}
//                     />

//                     <SelectField
//                       name="type"
//                       label={t("mediaLibrary.details.type")}
//                       placeholder={t("mediaLibrary.details.typePlaceholder")}
//                       options={typeOptions}
//                       required
//                       onChange={(option) =>
//                         handleTypeChange(option, setFieldValue, values.file)
//                       }
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
//                       maxLength={500}
//                     />
//                   </div>
//                 </div>

//                 {/* External URL Section */}
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
//                     maxLength={250}
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         setFieldValue("externalUrl", e.target.value);
//                         if (file) removeFile(setFieldValue);
//                       } else {
//                         setFieldValue("externalUrl", "");
//                       }
//                     }}
//                   />
//                 </div>

//                 {/* File Upload Section */}
//                 <div>
//                   <h3 className="text-sm font-semibold mb-4">
//                     {t("mediaLibrary.details.uploadFile")}
//                   </h3>

//                   <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mkv,.mp3,.wav,.aac,.pdf,.doc,.docx,.xls,.xlsx"
//                       onChange={(e) =>
//                         handleFileUpload(e, setFieldValue, values.type?.value)
//                       }
//                       className="hidden"
//                     />

//                     {!file && !preview ? (
//                       <div
//                         onClick={triggerFileUpload}
//                         className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors"
//                       >
//                         <FiUpload className="text-4xl text-gray-400 mb-3" />
//                         <p className="text-sm text-gray-600 mb-1">
//                           {t("mediaLibrary.details.uploadText")}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           {values.type?.value
//                             ? `Allowed: ${ALLOWED_EXTENSIONS[values.type.value].join(", ").toUpperCase()} (Max 10MB)`
//                             : t("mediaLibrary.details.uploadSubText")}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-4">
//                         {/* Preview for images */}
//                         {preview && values.type?.value === "image" && (
//                           <img
//                             src={preview}
//                             alt={t("mediaLibrary.details.previewAlt")}
//                             className="w-20 h-20 object-cover rounded"
//                           />
//                         )}

//                         {/* Video Preview */}
//                         {preview && values.type?.value === "video" && (
//                           <video
//                             src={preview}
//                             controls
//                             className="w-40 h-24 rounded"
//                           />
//                         )}

//                         {/* Icons for other file types */}
//                         {!preview && values.type?.value && (
//                           <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
//                             {getFileIcon(values.type.value)}
//                           </div>
//                         )}

//                         <div className="flex-1">
//                           <p className="text-sm font-medium">
//                             {file?.name || (preview && "Current file")}
//                           </p>
//                           {file && (
//                             <>
//                               <p className="text-xs text-gray-500">
//                                 {(file.size / 1024).toFixed(2)} KB
//                               </p>
//                               <p className="text-xs text-blue-600 mt-1">
//                                 New file to be uploaded
//                               </p>
//                             </>
//                           )}
//                           {!file && preview && (
//                             <p className="text-xs text-gray-500">
//                               Current file from server
//                             </p>
//                           )}
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => removeFile(setFieldValue)}
//                           className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
//                         >
//                           <FiX size={20} />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* File validation errors */}
//                   {touched.file && errors.file && (
//                     <p className="text-red-500 text-sm mt-2">{errors.file}</p>
//                   )}
//                 </div>

//                 {/* Footer Buttons */}
//                 <div className="flex justify-end items-center pt-4 border-t border-gray-200">
//                   <div className="flex gap-3">
//                     {hasPermission("media.delete") && (
//                       <button
//                         type="button"
//                         onClick={handleDelete}
//                         className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
//                       >
//                         {t("mediaLibrary.actions.deleteMedia")}
//                       </button>
//                     )}

//                     {hasPermission("media.edit") && (
//                       <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="px-4 py-2 rounded-md text-sm text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
//                       >
//                         {isSubmitting
//                           ? t("mediaLibrary.actions.updating")
//                           : t("mediaLibrary.actions.updateMedia")}
//                       </button>
//                     )}
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

// export default MediaLibraryDetails;

import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, TextareaField, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  FiUpload,
  FiX,
  FiLink,
  FiImage,
  FiVideo,
  FiMusic,
  FiFile,
} from "react-icons/fi";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../common/toast/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMediaById,
  updateMediaById,
  deleteSingleMedia,
} from "../../../../../../redux/slice/mediaLibrarySlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import Loader from "../../../../common/Loader";
import Error from "../../../../common/Error";
import usePermission from "../../../../../../hooks/usePermission";

// Allowed extensions configuration
const ALLOWED_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov", "avi", "mkv"],
  audio: ["mp3", "wav", "aac"],
  document: ["pdf", "doc", "docx", "xls", "xlsx"],
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MediaLibraryDetails = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [videoInputMethod, setVideoInputMethod] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFileChanged, setIsFileChanged] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { hasPermission } = usePermission();

  const { singleMedia, isLoading } = useSelector((state) => state.media);

  // Options for video input method
  const videoInputOptions = [
    { label: "Upload File", value: "file" },
    { label: "External URL", value: "url" },
  ];

  // Fetch media data
  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id)).finally(() => setInitialLoading(false));
    }
  }, [dispatch, id]);

  // Set initial data from existing media
  useEffect(() => {
    if (!singleMedia) return;

    if (singleMedia?.full_url) {
      setPreview(singleMedia.full_url);
    }

    if (singleMedia?.type) {
      setSelectedType(singleMedia.type);
    }

    // For VIDEO type - set video input method based on existing data
    if (singleMedia?.type === "video") {
      if (singleMedia?.external_url) {
        // Agar external URL hai
        setVideoInputMethod("url");
        setFile(null);
        setPreview(null);
        setIsFileChanged(false);
      } else if (singleMedia?.full_url) {
        // Agar file upload kiya tha pehle
        setVideoInputMethod("file");
        setFile(singleMedia.full_url);
        setPreview(singleMedia.full_url);
        setIsFileChanged(false);
      }
    }
    // For IMAGE/AUDIO/DOCUMENT - set existing file URL
    else if (singleMedia?.type && singleMedia?.type !== "video") {
      if (singleMedia?.full_url) {
        setFile(singleMedia.full_url);
        setPreview(singleMedia.full_url);
        setIsFileChanged(false);
      }
    }
  }, [singleMedia]);

  const typeOptions = [
    { label: t("mediaLibrary.types.image"), value: "image" },
    { label: t("mediaLibrary.types.video"), value: "video" },
    { label: t("mediaLibrary.types.audio"), value: "audio" },
    { label: t("mediaLibrary.types.document"), value: "document" },
  ];

  // Build initial values for Formik
  const getInitialValues = () => {
    let typeOption = null;
    if (singleMedia?.type) {
      typeOption = typeOptions.find((opt) => opt.value === singleMedia.type);
    }

    let videoInputMethodOption = null;
    if (singleMedia?.type === "video") {
      if (singleMedia?.external_url) {
        videoInputMethodOption = { label: "External URL", value: "url" };
      } else if (singleMedia?.full_url) {
        videoInputMethodOption = { label: "Upload File", value: "file" };
      }
    }

    return {
      title: singleMedia?.title || "",
      type: typeOption,
      description: singleMedia?.description || "",
      file: singleMedia?.full_url || null,
      externalUrl: singleMedia?.external_url || "",
      videoInputMethod: videoInputMethodOption,
    };
  };

  // Validation schema based on type and video input method
  const getValidationSchema = () => {
    let schema = Yup.object({
      title: Yup.string()
        .required(t("mediaLibrary.validation.titleRequired"))
        .min(3, "Title must be at least 3 characters")
        .max(255, "Title must not exceed 255 characters"),
      type: Yup.object()
        .nullable()
        .required(t("mediaLibrary.validation.typeRequired")),
      description: Yup.string().required(
        t("mediaLibrary.validation.descriptionRequired"),
      ),
      // .min(10, "Description must be at least 10 characters"),
    });

    // For video type
    if (selectedType === "video") {
      schema = schema.shape({
        videoInputMethod: Yup.object()
          .nullable()
          .required("Please select either Upload File or External URL"),
      });

      // If file upload method selected for video
      if (videoInputMethod === "file") {
        schema = schema.shape({
          file: Yup.mixed()
            .nullable()
            .test(
              "file-size",
              "File size should be less than 10MB",
              (value) => {
                if (!value) return true;
                if (typeof value === "string") return true;
                return value.size <= MAX_FILE_SIZE;
              },
            )
            .test(
              "file-extension",
              "Invalid video format. Allowed: mp4, mov, avi, mkv",
              function (value) {
                if (!value) return true;
                if (typeof value === "string") return true;
                const ext = value.name.split(".").pop().toLowerCase();
                return ALLOWED_EXTENSIONS.video.includes(ext);
              },
            ),
          externalUrl: Yup.string().nullable(),
        });
      }
      // If URL method selected for video
      else if (videoInputMethod === "url") {
        schema = schema.shape({
          externalUrl: Yup.string()
            .url("Please enter a valid URL")
            .required("Please enter an external URL"),
          file: Yup.mixed().nullable(),
        });
      }
    }
    // For non-video types (image, audio, document) - only file upload
    else if (selectedType && selectedType !== "video") {
      schema = schema.shape({
        file: Yup.mixed()
          .nullable()
          .required("Please upload a file")
          .test("file-size", "File size should be less than 10MB", (value) => {
            if (!value) return true;
            if (typeof value === "string") return true;
            return value.size <= MAX_FILE_SIZE;
          })
          .test(
            "file-extension",
            `Invalid file format for ${selectedType}`,
            function (value) {
              if (!value) return true;
              if (typeof value === "string") return true;
              const ext = value.name.split(".").pop().toLowerCase();
              const allowedExtensions = ALLOWED_EXTENSIONS[selectedType];
              return allowedExtensions.includes(ext);
            },
          ),
        externalUrl: Yup.string().nullable(),
      });
    }

    return schema;
  };

  const handleFileUpload = (event, setFieldValue) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      );
      event.target.value = "";
      return;
    }

    // Validate extension based on selected type
    const typeValue = selectedType;
    if (typeValue) {
      const ext = selectedFile.name.split(".").pop().toLowerCase();
      const allowedExtensions = ALLOWED_EXTENSIONS[typeValue];

      if (!allowedExtensions.includes(ext)) {
        toast.error(
          `Invalid ${typeValue} format. Allowed: ${allowedExtensions.join(", ")}`,
        );
        event.target.value = "";
        return;
      }
    }

    setFile(selectedFile);
    setIsFileChanged(true);
    setFieldValue("file", selectedFile);
    setFieldValue("externalUrl", "");

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleVideoInputMethodChange = (option, setFieldValue) => {
    const method = option?.value;
    setVideoInputMethod(method);
    setFieldValue("videoInputMethod", option);

    // Clear previous data when switching methods
    if (file && typeof file !== "string") {
      removeFile(setFieldValue);
    }
    setFieldValue("externalUrl", "");

    // Agar existing data hai to uske hisab se set karo
    if (
      method === "file" &&
      singleMedia?.full_url &&
      !singleMedia?.external_url
    ) {
      setFile(singleMedia.full_url);
      setIsFileChanged(false);
      setFieldValue("file", singleMedia.full_url);
      setPreview(singleMedia.full_url);
    } else if (method === "url" && singleMedia?.external_url) {
      setFieldValue("externalUrl", singleMedia.external_url);
      setFile(null);
      setPreview(null);
      setIsFileChanged(false);
    }
  };

  const removeFile = (setFieldValue) => {
    setFile(null);
    setIsFileChanged(false);
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

    if (selectedType === "video" && !videoInputMethod) {
      toast.error("Please select Upload File or External URL first");
      return;
    }

    fileInputRef.current.click();
  };

  const handleTypeChange = (option, setFieldValue) => {
    const newType = option?.value;
    setSelectedType(newType);
    setFieldValue("type", option);

    // Reset all states when type changes
    setVideoInputMethod(null);
    setFieldValue("videoInputMethod", null);
    removeFile(setFieldValue);
    setFieldValue("externalUrl", "");
    setIsFileChanged(false);
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("mediaLibrary.details.deleteText") }),
    );
    if (!ok) return;

    try {
      await dispatch(deleteSingleMedia(id)).unwrap();
      toast.success(t("mediaLibrary.success.delete"));
      navigate("/media-library");
    } catch (error) {
      toast.error(error?.message || t("mediaLibrary.error.delete"));
    }
  };

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Validation for video type
      if (selectedType === "video") {
        if (!videoInputMethod) {
          toast.error("Please select either Upload File or External URL");
          setSubmitting(false);
          return;
        }

        if (videoInputMethod === "file" && !values.file) {
          toast.error("Please upload a video file");
          setSubmitting(false);
          return;
        }

        if (videoInputMethod === "url" && !values.externalUrl) {
          toast.error("Please provide an external URL");
          setSubmitting(false);
          return;
        }
      }
      // For non-video types (image, audio, document)
      else if (selectedType && selectedType !== "video") {
        if (!values.file && !isFileChanged) {
          toast.error("Please upload a file");
          setSubmitting(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", selectedType);
      formData.append("description", values.description);

      // For non-video types - only send file if changed
      if (selectedType !== "video") {
        if (isFileChanged && values.file && typeof values.file !== "string") {
          // New file uploaded
          formData.append("file", values.file);
        }
        // If file not changed, don't send anything
      }

      // For video type
      if (selectedType === "video") {
        if (videoInputMethod === "file") {
          if (values.file && typeof values.file !== "string") {
            // New video file uploaded
            formData.append("file", values.file);
          }
          // If existing file not changed, don't send file
        } else if (videoInputMethod === "url" && values.externalUrl) {
          formData.append("external_url", values.externalUrl);
        }
      }

      const res = await dispatch(
        updateMediaById({ id, data: formData }),
      ).unwrap();

      toast.success(res?.message || t("mediaLibrary.success.update"));
      navigate("/media-library");
    } catch (error) {
      setErrors({ submit: error.message });
      toast.error(error?.message || t("mediaLibrary.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  // Get file icon for display
  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <FiImage className="text-4xl text-blue-500" />;
      case "video":
        return <FiVideo className="text-4xl text-red-500" />;
      case "audio":
        return <FiMusic className="text-4xl text-green-500" />;
      case "document":
        return <FiFile className="text-4xl text-orange-500" />;
      default:
        return <FiFile className="text-4xl text-gray-500" />;
    }
  };

  if (initialLoading || isLoading) return <Loader />;
  if (!singleMedia) return <Error message="Media not found" />;

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <Breadcrumb
          items={[
            {
              label: t("mediaLibrary.breadcrumb.contentManagement"),
              path: "/media-library",
            },
            {
              label: t("mediaLibrary.breadcrumb.view-media"),
            },
          ]}
        />

        <PageBody className="mt-4">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
            validateOnChange={true}
            validateOnBlur={true}
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
                      maxLength={150}
                    />

                    <SelectField
                      name="type"
                      label={t("mediaLibrary.details.type")}
                      placeholder={t("mediaLibrary.details.typePlaceholder")}
                      options={typeOptions}
                      required
                      onChange={(option) =>
                        handleTypeChange(option, setFieldValue)
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
                      maxLength={500}
                    />
                  </div>
                </div>

                {/* Video Input Method Selection - ONLY for video type */}
                {selectedType === "video" && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FiLink />
                      Select Input Method
                    </h3>

                    <SelectField
                      name="videoInputMethod"
                      label="Choose how to add video"
                      placeholder="Select upload method"
                      options={videoInputOptions}
                      required
                      onChange={(option) =>
                        handleVideoInputMethodChange(option, setFieldValue)
                      }
                    />

                    {touched.videoInputMethod && errors.videoInputMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.videoInputMethod}
                      </p>
                    )}
                  </div>
                )}

                {/* File Upload Section - For Image/Audio/Document OR Video with file method */}
                {selectedType && selectedType !== "video" ? (
                  // For Image, Audio, Document - always show file upload
                  <div>
                    <h3 className="text-sm font-semibold mb-4">
                      {t("mediaLibrary.details.uploadFile")}
                    </h3>

                    <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={
                          selectedType === "image"
                            ? ".jpg,.jpeg,.png,.webp"
                            : selectedType === "audio"
                              ? ".mp3,.wav,.aac"
                              : selectedType === "document"
                                ? ".pdf,.doc,.docx,.xls,.xlsx"
                                : "*"
                        }
                        onChange={(e) => handleFileUpload(e, setFieldValue)}
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
                            {selectedType
                              ? `Allowed: ${ALLOWED_EXTENSIONS[selectedType].join(", ").toUpperCase()} (Max 10MB)`
                              : t("mediaLibrary.details.uploadSubText")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {/* Preview for images */}
                          {preview && selectedType === "image" && (
                            <img
                              src={preview}
                              alt={t("mediaLibrary.details.previewAlt")}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}

                          {/* Audio & Document icons */}
                          {(!preview || selectedType !== "image") && (
                            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                              {getFileIcon(selectedType)}
                            </div>
                          )}

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {typeof file === "string"
                                ? `Current ${selectedType} file`
                                : file?.name}
                            </p>
                            {file && typeof file !== "string" && (
                              <>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  New file to be uploaded
                                </p>
                              </>
                            )}
                            {typeof file === "string" && (
                              <>
                                <p className="text-xs text-gray-500 break-all">
                                  {file.split("/").pop()}{" "}
                                  {/* Show just filename */}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Current file from server
                                </p>
                              </>
                            )}
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
                  </div>
                ) : selectedType === "video" && videoInputMethod === "file" ? (
                  // For Video with file method
                  <div>
                    <h3 className="text-sm font-semibold mb-4">
                      {t("mediaLibrary.details.uploadFile")}
                    </h3>

                    <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".mp4,.mov,.avi,.mkv"
                        onChange={(e) => handleFileUpload(e, setFieldValue)}
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
                            Allowed: MP4, MOV, AVI, MKV (Max 10MB)
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          {/* Video Preview */}
                          {preview && (
                            <video
                              src={preview}
                              controls
                              className="w-40 h-24 rounded"
                            />
                          )}

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {typeof file === "string"
                                ? "Current video file"
                                : file?.name}
                            </p>
                            {file && typeof file !== "string" && (
                              <>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  New file to be uploaded
                                </p>
                              </>
                            )}
                            {typeof file === "string" && (
                              <p className="text-xs text-gray-500 break-all mt-1">
                                {file.split("/").pop()}
                              </p>
                            )}
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
                  </div>
                ) : null}

                {/* External URL Section - ONLY for video with URL method */}
                {selectedType === "video" && videoInputMethod === "url" && (
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
                      maxLength={250}
                    />

                    {touched.externalUrl && errors.externalUrl && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.externalUrl}
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    {hasPermission("media.delete") && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        {t("mediaLibrary.actions.deleteMedia")}
                      </button>
                    )}

                    {hasPermission("media.edit") && (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md text-sm text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        {isSubmitting
                          ? t("mediaLibrary.actions.updating")
                          : t("mediaLibrary.actions.updateMedia")}
                      </button>
                    )}
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

export default MediaLibraryDetails;
