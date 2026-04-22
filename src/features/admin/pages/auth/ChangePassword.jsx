import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import TextInput from "../../common/form/TextInput";
import FormButton from "../../common/form/FormButton";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useToast } from "../../common/toast/ToastContext";
import { changePassword } from "../../../../redux/slice/authSlice";

const ChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  };

  const validationSchema = Yup.object({
    old_password: Yup.string().required(
      t("changePassword.validation.oldPassword"),
    ),
    new_password: Yup.string()
      .min(8, t("changePassword.validation.passwordMin"))
      .matches(/[A-Z]/, t("changePassword.validation.passwordUppercase"))
      .matches(/[0-9]/, t("changePassword.validation.passwordNumber"))
      .matches(/[!@#$%^&*]/, t("changePassword.validation.passwordSpecial"))
      .required(t("changePassword.validation.passwordRequired")),
    confirm_new_password: Yup.string()
      .oneOf(
        [Yup.ref("new_password")],
        t("changePassword.validation.passwordMatch"),
      )
      .required(t("changePassword.validation.confirmPasswordRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    const payload = {
      old_password: values.old_password,
      new_password: values.new_password,
      new_password_confirmation: values.confirm_new_password,
    };

    try {
      const res = await dispatch(changePassword(payload)).unwrap();
      toast.success(res?.message || "Password updated successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Center Container */}
      <div className="max-w-2xl mx-auto">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center text-[#1F3C88]">
            {t("changePassword.title")}
          </h2>

          <p className="text-sm text-gray-500 text-center mt-2 mb-8">
            {t("changePassword.subtitle")}
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Old Password */}
                <div className="relative">
                  <FiLock className="absolute top-[38px] left-3 text-gray-400" />

                  <TextInput
                    name="old_password"
                    label={t("changePassword.oldPassword")}
                    type={showOld ? "text" : "password"}
                    placeholder={t("changePassword.oldPasswordPlaceholder")}
                    className="!pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#22A699]"
                  />

                  <div
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  >
                    {showOld ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <FiLock className="absolute top-[38px] left-3 text-gray-400" />

                  <TextInput
                    name="new_password"
                    label={t("changePassword.newPassword")}
                    type={showNew ? "text" : "password"}
                    placeholder={t("changePassword.placeholderNew")}
                    className="!pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#22A699]"
                  />

                  <div
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  >
                    {showNew ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <FiLock className="absolute top-[38px] left-3 text-gray-400" />

                  <TextInput
                    name="confirm_new_password"
                    label={t("changePassword.confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("changePassword.placeholderConfirm")}
                    className="!pl-10 h-11 rounded-lg border-gray-300 focus:ring-2 focus:ring-[#22A699]"
                  />

                  <div
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>

                {/* Password Rules */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                    <li>{t("changePassword.rules.min")}</li>
                    <li>{t("changePassword.rules.uppercase")}</li>
                    <li>{t("changePassword.rules.number")}</li>
                    <li>{t("changePassword.rules.special")}</li>
                  </ul>
                </div>

                {/* Button */}
                <FormButton
                  text={
                    isSubmitting
                      ? t("changePassword.updating")
                      : t("changePassword.update")
                  }
                  loading={isSubmitting}
                  type="submit"
                  className="bg-gradient-to-r from-[#22A699] to-[#1d8f85] hover:opacity-90 text-white py-3 rounded-lg w-full font-medium shadow-sm"
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
