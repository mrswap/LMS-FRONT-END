// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput } from "../../../common/form";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../common/layout";
// import { useToast } from "../../../common/toast/ToastContext";
// import { FiImage, FiUpload, FiX } from "react-icons/fi";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";
// import {
//   getSiteSettings,
//   updateSiteSettings,
// } from "../../../../../redux/slice/systemSettingSlice";
// import Loader from "../../../common/Loader";
// import Error from "../../../common/Error";

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
//   }, [quill, onChange]);

//   return <div ref={quillRef} />;
// };

// const SystemSetting = () => {
//   const { t } = useTranslation();
//   const toast = useToast();
//   const dispatch = useDispatch();
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);

//   const { settings, isLoading, isError, message } = useSelector(
//     (state) => state.systemSetting,
//   );

//   useEffect(() => {
//     dispatch(getSiteSettings());
//   }, [dispatch]);

//   useEffect(() => {
//     if (settings?.company_logo) {
//       setLogoPreview(settings.company_logo);
//     }
//   }, [settings]);

//   const initialValues = {
//     company_logo: settings?.company_logo || null,
//     company_bio: settings?.company_bio || "",
//     app_ios_store: settings?.app_ios_store || "",
//     app_ios_download: settings?.app_ios_download || "",
//     app_android_store: settings?.app_android_store || "",
//     app_android_download: settings?.app_android_download || "",
//     contact_heading: settings?.contact_heading || "",
//     contact_text: settings?.contact_text || "",
//     contact_phone: settings?.contact_phone || "",
//     contact_email: settings?.contact_email || "",
//     social_facebook: settings?.social_facebook || "",
//     social_linkedin: settings?.social_linkedin || "",
//     social_instagram: settings?.social_instagram || "",
//     social_twitter: settings?.social_twitter || "",
//     footer_text: settings?.footer_text || "",
//     about_us: settings?.about_us || "",
//     privacy_policy: settings?.privacy_policy || "",
//     terms_conditions: settings?.terms_conditions || "",
//   };

//   const validationSchema = Yup.object({
//     company_bio: Yup.string().max(500, t("systemSettings.validation.bioMax")),
//     contact_phone: Yup.string().matches(
//       /^[+]?[\d\s-]+$/,
//       t("systemSettings.validation.phoneInvalid"),
//     ),
//     contact_email: Yup.string().email(
//       t("systemSettings.validation.emailInvalid"),
//     ),
//     app_ios_store: Yup.string().url(t("systemSettings.validation.urlInvalid")),
//     app_ios_download: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     app_android_store: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     app_android_download: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     social_facebook: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     social_linkedin: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     social_instagram: Yup.string().url(
//       t("systemSettings.validation.urlInvalid"),
//     ),
//     social_twitter: Yup.string().url(t("systemSettings.validation.urlInvalid")),
//   });

//   const handleLogoUpload = (event, setFieldValue) => {
//     const file = event.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         toast.error(t("systemSettings.validation.imageType"));
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error(t("systemSettings.validation.imageSize"));
//         return;
//       }

//       setLogoFile(file);
//       setFieldValue("company_logo", file);
//       const reader = new FileReader();
//       reader.onloadend = () => setLogoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeLogo = (setFieldValue) => {
//     setLogoFile(null);
//     setLogoPreview(settings?.company_logo || null);
//     setFieldValue("company_logo", settings?.company_logo || null);
//   };

//   const onSubmit = async (values, { setSubmitting }) => {
//     try {
//       const formData = new FormData();

//       // Append all text fields
//       Object.keys(values).forEach((key) => {
//         if (key !== "company_logo" && values[key]) {
//           formData.append(key, values[key]);
//         }
//       });

//       // Append logo if changed
//       if (logoFile) {
//         formData.append("company_logo", logoFile);
//       }

//       const res = await dispatch(updateSiteSettings(formData)).unwrap();
//       toast.success(res?.message || t("systemSettings.success.update"));

//       // Refresh settings after update
//       await dispatch(getSiteSettings());
//     } catch (error) {
//       console.error("Error updating settings:", error);
//       toast.error(error?.message || t("systemSettings.error.update"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <PageLayout>
//         <div className="p-8 rounded-lg border border-gray-300">
//           <Loader />
//         </div>
//       </PageLayout>
//     );
//   }

//   if (isError) {
//     return (
//       <PageLayout>
//         <div className="p-8 rounded-lg border border-gray-300">
//           <Error message={message} />
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <PageHeader>
//           <PageHeaderLeft>
//             <PageTitle>{t("systemSettings.title")}</PageTitle>
//             <PageSubtitle>{t("systemSettings.subtitle")}</PageSubtitle>
//           </PageHeaderLeft>
//         </PageHeader>

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({ isSubmitting, setFieldValue, values, errors, touched }) => (
//               <Form className="space-y-8">
//                 {/* Company Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.companyInfo")}
//                   </h3>

//                   {/* Company Logo */}
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                       {t("systemSettings.fields.companyLogo")}
//                     </label>
//                     <div className="border border-gray-300 bg-[#F8FAFC] p-6 rounded-lg">
//                       {!logoPreview ? (
//                         <div className="flex flex-col items-center justify-center">
//                           <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-3">
//                             <FiImage className="w-10 h-10 text-gray-400" />
//                           </div>
//                           <label className="bg-accent text-white px-4 py-2 rounded-md text-sm cursor-pointer transition flex items-center gap-2">
//                             <FiUpload className="w-3.5 h-3.5" />
//                             {t("systemSettings.actions.uploadLogo")}
//                             <input
//                               type="file"
//                               accept="image/*"
//                               hidden
//                               onChange={(e) =>
//                                 handleLogoUpload(e, setFieldValue)
//                               }
//                             />
//                           </label>
//                         </div>
//                       ) : (
//                         <div className="flex items-start gap-6">
//                           <div className="relative group">
//                             <img
//                               src={logoPreview}
//                               alt={t("systemSettings.fields.companyLogo")}
//                               className="w-32 h-32 object-contain rounded-lg border border-gray-300 shadow-sm bg-white p-2"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeLogo(setFieldValue)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
//                             >
//                               <FiX className="text-xs" />
//                             </button>
//                           </div>
//                           <div>
//                             <label className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition flex items-center gap-2">
//                               <FiUpload className="w-3.5 h-3.5" />
//                               {t("systemSettings.actions.changeLogo")}
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 hidden
//                                 onChange={(e) =>
//                                   handleLogoUpload(e, setFieldValue)
//                                 }
//                               />
//                             </label>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-1 gap-4">
//                     <TextInput
//                       name="company_bio"
//                       label={t("systemSettings.fields.companyBio")}
//                       placeholder={t("systemSettings.placeholders.companyBio")}
//                       as="textarea"
//                       rows={3}
//                       maxLength={500}
//                     />
//                   </div>
//                 </div>

//                 {/* App Links */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.appLinks")}
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <TextInput
//                       name="app_ios_store"
//                       label={t("systemSettings.fields.iosStore")}
//                       placeholder={t("systemSettings.placeholders.iosStore")}
//                     />
//                     <TextInput
//                       name="app_ios_download"
//                       label={t("systemSettings.fields.iosDownload")}
//                       placeholder={t("systemSettings.placeholders.iosDownload")}
//                     />
//                     <TextInput
//                       name="app_android_store"
//                       label={t("systemSettings.fields.androidStore")}
//                       placeholder={t(
//                         "systemSettings.placeholders.androidStore",
//                       )}
//                     />
//                     <TextInput
//                       name="app_android_download"
//                       label={t("systemSettings.fields.androidDownload")}
//                       placeholder={t(
//                         "systemSettings.placeholders.androidDownload",
//                       )}
//                     />
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.contactInfo")}
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <TextInput
//                       name="contact_heading"
//                       label={t("systemSettings.fields.contactHeading")}
//                       placeholder={t(
//                         "systemSettings.placeholders.contactHeading",
//                       )}
//                     />
//                     <TextInput
//                       name="contact_text"
//                       label={t("systemSettings.fields.contactText")}
//                       placeholder={t("systemSettings.placeholders.contactText")}
//                     />
//                     <TextInput
//                       name="contact_phone"
//                       label={t("systemSettings.fields.contactPhone")}
//                       placeholder={t(
//                         "systemSettings.placeholders.contactPhone",
//                       )}
//                     />
//                     <TextInput
//                       name="contact_email"
//                       label={t("systemSettings.fields.contactEmail")}
//                       placeholder={t(
//                         "systemSettings.placeholders.contactEmail",
//                       )}
//                       type="email"
//                     />
//                   </div>
//                 </div>

//                 {/* Social Media Links */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.socialLinks")}
//                   </h3>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     <TextInput
//                       name="social_facebook"
//                       label={t("systemSettings.fields.facebook")}
//                       placeholder={t("systemSettings.placeholders.facebook")}
//                     />
//                     <TextInput
//                       name="social_linkedin"
//                       label={t("systemSettings.fields.linkedin")}
//                       placeholder={t("systemSettings.placeholders.linkedin")}
//                     />
//                     <TextInput
//                       name="social_instagram"
//                       label={t("systemSettings.fields.instagram")}
//                       placeholder={t("systemSettings.placeholders.instagram")}
//                     />
//                     <TextInput
//                       name="social_twitter"
//                       label={t("systemSettings.fields.twitter")}
//                       placeholder={t("systemSettings.placeholders.twitter")}
//                     />
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.footer")}
//                   </h3>
//                   <TextInput
//                     name="footer_text"
//                     label={t("systemSettings.fields.footerText")}
//                     placeholder={t("systemSettings.placeholders.footerText")}
//                     maxLength={255}
//                   />
//                 </div>

//                 {/* Content Pages */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
//                     {t("systemSettings.sections.contentPages")}
//                   </h3>

//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("systemSettings.fields.aboutUs")}
//                     </label>
//                     <QuillEditor
//                       value={values.about_us}
//                       onChange={(val) => setFieldValue("about_us", val)}
//                     />
//                     {touched.about_us && errors.about_us && (
//                       <div className="text-red-500 text-xs mt-1">
//                         {errors.about_us}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("systemSettings.fields.privacyPolicy")}
//                     </label>
//                     <QuillEditor
//                       value={values.privacy_policy}
//                       onChange={(val) => setFieldValue("privacy_policy", val)}
//                     />
//                     {touched.privacy_policy && errors.privacy_policy && (
//                       <div className="text-red-500 text-xs mt-1">
//                         {errors.privacy_policy}
//                       </div>
//                     )}
//                   </div>

//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("systemSettings.fields.termsConditions")}
//                     </label>
//                     <QuillEditor
//                       value={values.terms_conditions}
//                       onChange={(val) => setFieldValue("terms_conditions", val)}
//                     />
//                     {touched.terms_conditions && errors.terms_conditions && (
//                       <div className="text-red-500 text-xs mt-1">
//                         {errors.terms_conditions}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Footer Actions */}
//                 <div className="flex justify-end gap-3 pt-4 border-t">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="px-6 py-2 bg-accent text-white rounded-md text-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting
//                       ? t("systemSettings.actions.saving")
//                       : t("systemSettings.actions.saveSettings")}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default SystemSetting;

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../common/form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useToast } from "../../../common/toast/ToastContext";
import {
  FiImage,
  FiUpload,
  FiX,
  FiSave,
  FiInfo,
  FiLink,
  FiMail,
  FiPhone,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiSmartphone,
  FiGlobe,
  FiFileText,
} from "react-icons/fi";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../../../../../redux/slice/systemSettingSlice";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";

const QuillEditor = ({ value, onChange, label }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "clean"],
        ["blockquote", "code-block"],
      ],
    },
    placeholder: `Enter ${label?.toLowerCase() || "content"}...`,
  });

  useEffect(() => {
    if (quill && value) {
      if (quill.root.innerHTML !== value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [quill, value]);

  useEffect(() => {
    if (!quill) return;
    const handler = () => {
      const html = quill.root.innerHTML;
      if (html !== value) {
        onChange(html);
      }
    };
    quill.on("text-change", handler);
    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, onChange, value]);

  return (
    <div className="quill-wrapper">
      <div ref={quillRef} className="bg-white" />
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
  >
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h3 className="text-base font-semibold text-gray-800 tracking-wide">
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoBox = ({ children }) => (
  <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
    <FiInfo className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </div>
);

const SystemSetting = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const { settings, isLoading, isError, message } = useSelector(
    (state) => state.systemSetting,
  );

  useEffect(() => {
    dispatch(getSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings?.company_logo) {
      setLogoPreview(settings.company_logo);
    }
  }, [settings]);

  const initialValues = {
    company_logo: settings?.company_logo || null,
    company_bio: settings?.company_bio || "",
    app_ios_store: settings?.app_ios_store || "",
    app_ios_download: settings?.app_ios_download || "",
    app_android_store: settings?.app_android_store || "",
    app_android_download: settings?.app_android_download || "",
    contact_heading: settings?.contact_heading || "",
    contact_text: settings?.contact_text || "",
    contact_phone: settings?.contact_phone || "",
    contact_email: settings?.contact_email || "",
    social_facebook: settings?.social_facebook || "",
    social_linkedin: settings?.social_linkedin || "",
    social_instagram: settings?.social_instagram || "",
    social_twitter: settings?.social_twitter || "",
    footer_text: settings?.footer_text || "",
    about_us: settings?.about_us || "",
    privacy_policy: settings?.privacy_policy || "",
    terms_conditions: settings?.terms_conditions || "",
  };

  const validationSchema = Yup.object({
    company_bio: Yup.string().max(500, t("systemSettings.validation.bioMax")),
    contact_phone: Yup.string().matches(
      /^[+]?[\d\s-]+$/,
      t("systemSettings.validation.phoneInvalid"),
    ),
    contact_email: Yup.string().email(
      t("systemSettings.validation.emailInvalid"),
    ),
    app_ios_store: Yup.string().url(t("systemSettings.validation.urlInvalid")),
    app_ios_download: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    app_android_store: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    app_android_download: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    social_facebook: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    social_linkedin: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    social_instagram: Yup.string().url(
      t("systemSettings.validation.urlInvalid"),
    ),
    social_twitter: Yup.string().url(t("systemSettings.validation.urlInvalid")),
  });

  const handleLogoUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("systemSettings.validation.imageType"));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("systemSettings.validation.imageSize"));
        return;
      }

      setLogoFile(file);
      setFieldValue("company_logo", file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (setFieldValue) => {
    setLogoFile(null);
    setLogoPreview(settings?.company_logo || null);
    setFieldValue("company_logo", settings?.company_logo || null);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== "company_logo" && values[key]) {
          formData.append(key, values[key]);
        }
      });

      if (logoFile) {
        formData.append("company_logo", logoFile);
      }

      const res = await dispatch(updateSiteSettings(formData)).unwrap();
      toast.success(res?.message || t("systemSettings.success.update"));
      await dispatch(getSiteSettings());
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error?.message || t("systemSettings.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={message} />;
  }

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("systemSettings.title")}</PageTitle>
            <PageSubtitle>{t("systemSettings.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form className="space-y-6">
                {/* Company Information */}
                <SectionCard
                  title={t("systemSettings.sections.companyInfo")}
                  icon={FiGlobe}
                >
                  {/* Company Logo */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t("systemSettings.fields.companyLogo")}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 transition-all hover:border-gray-400">
                      {!logoPreview ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-28 h-28 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                            <FiImage className="w-8 h-8 text-gray-400" />
                          </div>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                            <FiUpload className="w-4 h-4" />
                            {t("systemSettings.actions.uploadLogo")}
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) =>
                                handleLogoUpload(e, setFieldValue)
                              }
                            />
                          </label>
                          <InfoBox>
                            Recommended: PNG or JPG, max 2MB, 200x200px
                          </InfoBox>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <img
                                src={logoPreview}
                                alt={t("systemSettings.fields.companyLogo")}
                                className="w-24 h-24 object-contain rounded-lg border border-gray-200 shadow-sm bg-white p-2"
                              />
                              <button
                                type="button"
                                onClick={() => removeLogo(setFieldValue)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                            <div>
                              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                                <FiUpload className="w-4 h-4" />
                                {t("systemSettings.actions.changeLogo")}
                                <input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  onChange={(e) =>
                                    handleLogoUpload(e, setFieldValue)
                                  }
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <TextInput
                    name="company_bio"
                    label={t("systemSettings.fields.companyBio")}
                    placeholder={t("systemSettings.placeholders.companyBio")}
                    as="textarea"
                    rows={3}
                    maxLength={500}
                    required
                  />
                </SectionCard>

                {/* App Links */}
                <SectionCard
                  title={t("systemSettings.sections.appLinks")}
                  icon={FiSmartphone}
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <TextInput
                      name="app_ios_store"
                      label={t("systemSettings.fields.iosStore")}
                      placeholder={t("systemSettings.placeholders.iosStore")}
                      maxLength={255}
                      required
                    />
                    <TextInput
                      name="app_ios_download"
                      label={t("systemSettings.fields.iosDownload")}
                      placeholder={t("systemSettings.placeholders.iosDownload")}
                      maxLength={255}
                      required
                    />
                    <TextInput
                      name="app_android_store"
                      label={t("systemSettings.fields.androidStore")}
                      placeholder={t(
                        "systemSettings.placeholders.androidStore",
                      )}
                      required
                      maxLength={255}
                    />
                    <TextInput
                      name="app_android_download"
                      label={t("systemSettings.fields.androidDownload")}
                      placeholder={t(
                        "systemSettings.placeholders.androidDownload",
                      )}
                      required
                      maxLength={255}
                    />
                  </div>
                </SectionCard>

                {/* Contact Information */}
                <SectionCard
                  title={t("systemSettings.sections.contactInfo")}
                  icon={FiMail}
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <TextInput
                      name="contact_heading"
                      label={t("systemSettings.fields.contactHeading")}
                      placeholder={t(
                        "systemSettings.placeholders.contactHeading",
                      )}
                      required
                      maxLength={255}
                    />
                    <TextInput
                      name="contact_text"
                      label={t("systemSettings.fields.contactText")}
                      placeholder={t("systemSettings.placeholders.contactText")}
                      required
                      maxLength={255}
                    />
                    <div className="relative">
                      <TextInput
                        name="contact_phone"
                        label={t("systemSettings.fields.contactPhone")}
                        placeholder={t(
                          "systemSettings.placeholders.contactPhone",
                        )}
                        className="!pl-10 !pr-10"
                        required
                      />
                      <FiPhone className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <TextInput
                        name="contact_email"
                        label={t("systemSettings.fields.contactEmail")}
                        placeholder={t(
                          "systemSettings.placeholders.contactEmail",
                        )}
                        type="email"
                        className="!pl-10 !pr-10"
                        required
                      />
                      <FiMail className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </SectionCard>

                {/* Social Media Links */}
                <SectionCard
                  title={t("systemSettings.sections.socialLinks")}
                  icon={FiLink}
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="relative">
                      <TextInput
                        name="social_facebook"
                        label={t("systemSettings.fields.facebook")}
                        placeholder={t("systemSettings.placeholders.facebook")}
                        className="!pl-10 !pr-10 "
                        required
                        maxLength={255}
                      />
                      <FiFacebook className="absolute left-3 top-9 w-4 h-4 text-blue-600" />
                    </div>
                    <div className="relative">
                      <TextInput
                        name="social_linkedin"
                        label={t("systemSettings.fields.linkedin")}
                        placeholder={t("systemSettings.placeholders.linkedin")}
                        className="!pl-10 !pr-10"
                        required
                        maxLength={255}
                      />
                      <FiLinkedin className="absolute left-3 top-9 w-4 h-4 text-blue-700" />
                    </div>
                    <div className="relative">
                      <TextInput
                        name="social_instagram"
                        label={t("systemSettings.fields.instagram")}
                        placeholder={t("systemSettings.placeholders.instagram")}
                        className="!pl-10 !pr-10"
                        required
                        maxLength={255}
                      />
                      <FiInstagram className="absolute left-3 top-9 w-4 h-4 text-pink-600" />
                    </div>
                    <div className="relative">
                      <TextInput
                        name="social_twitter"
                        label={t("systemSettings.fields.twitter")}
                        placeholder={t("systemSettings.placeholders.twitter")}
                        className="!pl-10 !pr-10"
                        required
                        maxLength={255}
                      />
                      <FiTwitter className="absolute left-3 top-9 w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </SectionCard>

                {/* Footer */}
                <SectionCard
                  title={t("systemSettings.sections.footer")}
                  icon={FiFileText}
                >
                  <TextInput
                    name="footer_text"
                    label={t("systemSettings.fields.footerText")}
                    placeholder={t("systemSettings.placeholders.footerText")}
                    maxLength={255}
                    required
                  />
                </SectionCard>

                {/* Content Pages */}
                <SectionCard
                  title={t("systemSettings.sections.contentPages")}
                  icon={FiFileText}
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("systemSettings.fields.aboutUs")}
                      </label>
                      <QuillEditor
                        value={values.about_us}
                        onChange={(val) => setFieldValue("about_us", val)}
                        label="About Us"
                      />
                      {touched.about_us && errors.about_us && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.about_us}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("systemSettings.fields.privacyPolicy")}
                      </label>
                      <QuillEditor
                        value={values.privacy_policy}
                        onChange={(val) => setFieldValue("privacy_policy", val)}
                        label="Privacy Policy"
                      />
                      {touched.privacy_policy && errors.privacy_policy && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.privacy_policy}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("systemSettings.fields.termsConditions")}
                      </label>
                      <QuillEditor
                        value={values.terms_conditions}
                        onChange={(val) =>
                          setFieldValue("terms_conditions", val)
                        }
                        label="Terms & Conditions"
                      />
                      {touched.terms_conditions && errors.terms_conditions && (
                        <div className="text-red-500 text-xs mt-1">
                          {errors.terms_conditions}
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium shadow-sm"
                  >
                    <FiSave className="w-4 h-4" />
                    {isSubmitting
                      ? t("systemSettings.actions.saving")
                      : t("systemSettings.actions.saveSettings")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default SystemSetting;
