import React, { useEffect, useRef, useState } from "react";
import {
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageLayout,
  PageSubtitle,
  PageTitle,
} from "../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import {
  getCertificateSettings,
  getCertificateVariables,
  postCertificateSettings,
} from "../../../../../redux/slice/certificateSettingSlice";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { TextInput } from "../../../common/form/index";
import {
  FiPlus,
  FiSave,
  FiUpload,
  FiTrash2,
  FiInfo,
  FiCopy,
  FiCheck,
  FiPrinter,
} from "react-icons/fi";
import { useToast } from "../../../common/toast/ToastContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const CertificationSetting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [copiedVariable, setCopiedVariable] = useState(null);
  const fileInputRef = useRef(null);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: t("certificateSetting.editorPlaceholder"),
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    },
  });

  const { variables, settings, settingsLoading, variablesLoading, isSaving } =
    useSelector((state) => state.certificateSettings);

  useEffect(() => {
    dispatch(getCertificateVariables());
    dispatch(getCertificateSettings());
  }, [dispatch]);

  useEffect(() => {
    if (quill && settings?.data?.content) {
      quill.root.innerHTML = settings.data.content;
    }
    if (settings?.data?.company_logo) {
      setLogoPreview(settings.data.company_logo);
    }
  }, [quill, settings?.data]);

  const handleAddVariable = (variableKey, setFieldValue, values) => {
    if (quill) {
      const range = quill.getSelection();
      const cursorPosition = range ? range.index : quill.getLength();
      quill.insertText(cursorPosition, ` {{${variableKey}}} `);
      quill.setSelection(cursorPosition + ` {{${variableKey}}} `.length);
      const newContent = quill.root.innerHTML;
      setFieldValue("content", newContent);
    }
  };

  const handleCopyVariable = (variableKey) => {
    navigator.clipboard.writeText(`{{${variableKey}}}`);
    setCopiedVariable(variableKey);
    setTimeout(() => setCopiedVariable(null), 2000);
  };

  const handleLogoUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("certificateSetting.errors.logoSize"));
        return;
      }
      if (!file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
        toast.error(t("certificateSetting.errors.logoType"));
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFieldValue("company_logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (setFieldValue) => {
    setLogoPreview(null);
    setLogoFile(null);
    setFieldValue("company_logo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const content = quill ? quill.root.innerHTML : values.content;
      const updateData = {
        ...settings?.data,
        ...values,
        content: content,
        company_logo: logoPreview || values.company_logo || "",
      };

      await dispatch(postCertificateSettings(updateData)).unwrap();
      dispatch(getCertificateSettings());
      toast.success(t("certificateSetting.success.save"));
    } catch (error) {
      toast.error(error?.message || t("certificateSetting.errors.save"));
    } finally {
      setSubmitting(false);
    }
  };

  const variablesList = variables?.data || {};
  const settingsData = settings?.data || {};

  const validationSchema = Yup.object({
    company_name: Yup.string().max(100),
    certificate_heading: Yup.string().max(200),
    signer_name: Yup.string().max(100),
    signer_designation: Yup.string().max(100),
    footer_text: Yup.string().max(500),
    content: Yup.string(),
    company_logo: Yup.string(),
  });

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("certificateSetting.title")}</PageTitle>
          <PageSubtitle>{t("certificateSetting.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight />
      </PageHeader>

      <PageBody>
        <Formik
          initialValues={{
            company_name: settingsData.company_name || "",
            certificate_heading:
              settingsData.certificate_heading ||
              t("certificateSetting.defaultHeading"),
            signer_name: settingsData.signer_name || "",
            signer_designation: settingsData.signer_designation || "",
            footer_text: settingsData.footer_text || "",
            content: settingsData.content || "",
            company_logo: settingsData.company_logo || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ isSubmitting, values, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - Variables */}
                <div className="md:col-span-4 xl:col-span-3 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-6">
                    <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {t("certificateSetting.variables.title")}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {t("certificateSetting.variables.subtitle")}
                          </p>
                        </div>
                        <FiInfo className="text-gray-400 text-sm" />
                      </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto">
                      {variablesLoading ? (
                        <div className="text-center py-12">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                          <p className="text-sm text-gray-500 mt-3">
                            {t("certificateSetting.variables.loading")}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {Object.entries(variablesList).map(([key, label]) => {
                            const variableKey = key.replace(/{{|}}/g, "");
                            return (
                              <div
                                key={key}
                                className="group hover:bg-gray-50 transition-colors p-4"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {variableKey}
                                      </code>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCopyVariable(variableKey)
                                        }
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                                      >
                                        {copiedVariable === variableKey ? (
                                          <FiCheck
                                            className="text-green-600"
                                            size={12}
                                          />
                                        ) : (
                                          <FiCopy size={12} />
                                        )}
                                      </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      {label}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddVariable(
                                        variableKey,
                                        setFieldValue,
                                        values,
                                      )
                                    }
                                    className="ml-2 p-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    title={t(
                                      "certificateSetting.variables.insert",
                                    )}
                                  >
                                    <FiPlus
                                      size={14}
                                      className="text-gray-600"
                                    />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-8 xl:col-span-9 space-y-6">
                  {/* Basic Information with Logo */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900">
                        {t("certificateSetting.sections.certificateInfo")}
                      </h3>
                    </div>
                    <div className="p-6">
                      {/* Company Logo Upload inside Certificate Information */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {t("certificateSetting.fields.companyLogo")}
                        </label>
                        <div className="flex items-center gap-6">
                          {logoPreview ? (
                            <>
                              <div className="relative group">
                                <div className="w-24 h-24 border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center justify-center">
                                  <img
                                    src={logoPreview}
                                    alt="Company Logo"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveLogo(setFieldValue)
                                  }
                                  className="absolute -top-2 -right-2 p-1 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all"
                                >
                                  <FiTrash2
                                    size={12}
                                    className="text-gray-500"
                                  />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                {t("certificateSetting.buttons.changeLogo")}
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
                            >
                              <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">
                                {t("certificateSetting.buttons.uploadLogo")}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {t("certificateSetting.logoConstraints")}
                              </p>
                            </div>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={(e) => handleLogoUpload(e, setFieldValue)}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextInput
                          name="certificate_heading"
                          label={t(
                            "certificateSetting.fields.certificateHeading",
                          )}
                          placeholder={t(
                            "certificateSetting.placeholders.certificateHeading",
                          )}
                          className="rounded-md"
                          required
                          maxLength={250}
                        />
                        <TextInput
                          name="company_name"
                          label={t("certificateSetting.fields.companyName")}
                          placeholder={t(
                            "certificateSetting.placeholders.companyName",
                          )}
                          className="rounded-md"
                          maxLength={255}
                          required
                        />
                        <TextInput
                          name="signer_name"
                          label={t("certificateSetting.fields.signerName")}
                          placeholder={t(
                            "certificateSetting.placeholders.signerName",
                          )}
                          className="rounded-md"
                          required
                          maxLength={255}
                        />
                        <TextInput
                          name="signer_designation"
                          label={t(
                            "certificateSetting.fields.signerDesignation",
                          )}
                          placeholder={t(
                            "certificateSetting.placeholders.signerDesignation",
                          )}
                          className="rounded-md"
                          required
                          maxLength={255}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900">
                        {t("certificateSetting.sections.certificateContent")}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("certificateSetting.sections.contentSubtitle")}
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
                        <div ref={quillRef} style={{ height: 350 }} />
                      </div>
                      <input
                        type="hidden"
                        name="content"
                        value={values.content}
                      />
                      <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <FiInfo className="text-gray-400" />
                          {t("certificateSetting.tips.insertVariable")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                      <h3 className="font-medium text-gray-900">
                        {t("certificateSetting.sections.footerSettings")}
                      </h3>
                    </div>
                    <div className="p-6">
                      <TextInput
                        name="footer_text"
                        label={t("certificateSetting.fields.footerText")}
                        placeholder={t(
                          "certificateSetting.placeholders.footerText",
                        )}
                        className="rounded-md"
                        required
                        maxLength={255}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSaving}
                      className="px-6 py-2 bg-accent hover:opacity-90 cursor-pointer text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiSave size={16} />
                      {isSubmitting || isSaving
                        ? t("certificateSetting.buttons.saving")
                        : t("certificateSetting.buttons.saveSettings")}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>
    </PageLayout>
  );
};

export default CertificationSetting;
