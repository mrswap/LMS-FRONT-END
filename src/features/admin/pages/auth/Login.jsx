import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import TextInput from "../../common/form/TextInput";
import FormButton from "../../common/form/FormButton";

import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/slice/authSlice";
import { useTranslation } from "react-i18next";
import { useToast } from "../../common/toast/ToastContext";

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { isLoading } = useSelector((state) => state.auth);

  const initialValues = {
    email: "ajaycharve109@gmail.com",
    password: "12345678",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("login.validation.emailRequired"))
      .required(t("login.validation.emailInvalid")),
    password: Yup.string().required(t("login.validation.passwordRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await dispatch(loginUser(values)).unwrap();
      toast.success(res?.message || t("login.success"));
      navigate("/");
    } catch (err) {
      toast.error(err?.message || t("login.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/* Logo */}
      <div className="text-center mb-4">
        <img src={logo} alt="logo" className="w-[190px] h-[110px]" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl text-primary font-bold">
            {t("login.title")}
          </h2>
          <p className="text-[#64748B] text-sm mt-1">{t("login.subtitle")}</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="space-y-5">
              {/* Email */}
              <div className="relative">
                <FiMail className="absolute top-7 sm:top-9 left-3 text-primary" />
                <TextInput
                  name="email"
                  label={t("login.emailLabel")}
                  placeholder={t("login.emailPlaceholder")}
                  className="!pl-10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-[#29324C] font-medium">
                    {t("login.passwordLabel")}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-primary font-semibold hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                <div className="relative">
                  <FiLock className="absolute top-1.5 sm:top-3 left-3 text-primary" />

                  <TextInput
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    className="!pl-10 !pr-10"
                  />

                  {/* Eye Toggle */}
                  {showPassword ? (
                    <FiEyeOff
                      onClick={() => setShowPassword(false)}
                      className="absolute top-1.5 sm:top-3 right-3 text-gray-400 cursor-pointer"
                    />
                  ) : (
                    <FiEye
                      onClick={() => setShowPassword(true)}
                      className="absolute top-1.5 sm:top-3 right-3 text-gray-400 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* Button */}
              <FormButton
                text={isLoading ? t("login.signingIn") : t("login.button")}
                className="cursor-pointer"
                loading={isLoading}
                type="submit"
              />

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>{t("login.trouble")}</p>
                <span className="text-[#1F3C88] font-medium cursor-pointer hover:underline">
                  {t("login.contactAdmin")}
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Bottom */}
      <p className="text-xs text-gray-400 my-4">
        © 2025 Avante Medical LMS - v2.1.0
      </p>
    </div>
  );
};

export default Login;
