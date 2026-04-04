import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiMail, FiArrowLeft } from "react-icons/fi";

import TextInput from "../../common/form/TextInput";
import FormButton from "../../common/form/FormButton";

import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/* Logo */}
      <div className="text-center mb-6">
        <img
          src={logo}
          alt="Avante Medical"
          className="w-[190px] h-[110px] object-contain"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {/* Back to sign in */}
        <div className="w-full max-w-md mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-[#64748B] text-sm hover:text-[#1F3C88] transition-colors"
          >
            <FiArrowLeft className="mr-1" size={16} />
            {t("forgotPassword.back")}
          </button>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <span className="bg-[#EFF6FF] px-3 py-3 rounded-full">
              <FiMail size={20} className="text-primary" />
            </span>
          </div>
          <h2 className="text-2xl text-center font-bold text-primary">
            {t("forgotPassword.title")}
          </h2>
          <p className="text-[#64748B] text-sm text-center mt-2">
            {t("forgotPassword.subtitle")}
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-[#1E2A3E] mb-2">
                  {t("forgotPassword.emailLabel")}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <FiMail size={18} className="text-primary" />
                  </div>
                  <TextInput
                    name="email"
                    type="email"
                    placeholder={t("forgotPassword.emailPlaceholder")}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3C88]/20 focus:border-[#1F3C88] text-sm"
                  />
                </div>
              </div>

              {/* Send Link Button */}
              <FormButton
                text={
                  isSubmitting
                    ? t("forgotPassword.sending")
                    : t("forgotPassword.button")
                }
                className="cursor-pointer"
                loading={isSubmitting}
                type="submit"
              />

              {/* Help text */}
              <div className="text-center text-sm text-[#64748B]">
                <p>
                  {t("forgotPassword.notReceived")}{" "}
                  <Link
                    to="/check-email"
                    // type="button"
                    className="text-[#1F3C88] hover:underline font-medium"
                  >
                    {t("forgotPassword.spam")}
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>

        {/* Sign in link */}
        <div className="mt-6 text-center text-sm text-[#64748B]">
          <p>
            {t("forgotPassword.rememberYourPassword")}{" "}
            <a
              href="/signin"
              className="text-[#1F3C88] font-medium hover:underline"
            >
              {t("forgotPassword.signIn")}
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 my-4">
        © 2025 Avante Medical LMS · v2.1.0
      </p>
    </div>
  );
};

export default ForgotPassword;
