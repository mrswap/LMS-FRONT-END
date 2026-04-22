import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

import TextInput from "../../common/form/TextInput";
import FormButton from "../../common/form/FormButton";
import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useToast } from "../../common/toast/ToastContext";
import { resetPassword } from "../../../../redux/slice/authSlice";

const ResetPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  //  Get token from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  //  Validation Schema (resetPassword keys)
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, t("resetPassword.validation.passwordMin"))
      .matches(/[A-Z]/, t("resetPassword.validation.passwordUppercase"))
      .matches(/[0-9]/, t("resetPassword.validation.passwordNumber"))
      .matches(/[!@#$%^&*]/, t("resetPassword.validation.passwordSpecial"))
      .required(t("resetPassword.validation.passwordRequired")),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("resetPassword.validation.passwordMatch"))
      .required(t("resetPassword.validation.confirmPasswordRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const payload = {
      password: values.password,
      password_confirmation: values.confirmPassword,
      token: token,
    };

    try {
      const res = await dispatch(resetPassword(payload)).unwrap();
      toast.success(res?.message || "Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Password reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="logo" className="w-[200px]" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-[#1F3C88]">
          {t("resetPassword.title")}
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          {t("resetPassword.subtitle")}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* New Password */}
              <div className="relative">
                <FiLock className="absolute top-9 left-3 text-primary" />

                <TextInput
                  name="password"
                  label={t("resetPassword.newPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("resetPassword.placeholderNew")}
                  className="!pl-10"
                />

                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FiLock className="absolute top-9 left-3 text-primary" />

                <TextInput
                  name="confirmPassword"
                  label={t("resetPassword.confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("resetPassword.placeholderConfirm")}
                  className="!pl-10"
                />

                <div
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-400"
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              {/* Password Rules */}
              <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
                <li>{t("resetPassword.rules.min")}</li>
                <li>{t("resetPassword.rules.uppercase")}</li>
                <li>{t("resetPassword.rules.number")}</li>
                <li>{t("resetPassword.rules.special")}</li>
              </ul>

              {/* Button */}
              <FormButton
                text={
                  isSubmitting
                    ? t("resetPassword.updating")
                    : t("resetPassword.update")
                }
                loading={isSubmitting}
                type="submit"
                className="bg-[#22A699] hover:bg-[#1d8f85] text-white py-2.5 rounded-lg w-full"
              />
            </Form>
          )}
        </Formik>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 my-4">
        © 2025 Avante Medical LMS · v2.1.0
      </p>
    </div>
  );
};

export default ResetPassword;
