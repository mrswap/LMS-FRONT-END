import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

import TextInput from "../../common/form/TextInput";
import FormButton from "../../common/form/FormButton";
import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .matches(/[A-Z]/, "At least 1 uppercase letter")
      .matches(/[0-9]/, "At least 1 number")
      .matches(/[!@#$%^&*]/, "At least 1 special character")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src={logo} alt="logo" className="w-[200px] object-contain" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-[#1F3C88]">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Update your password to keep your account secure.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>

                <div className="relative mt-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>

                  <TextInput
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1F3C88]/20 focus:border-[#1F3C88]"
                  />

                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative mt-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>

                  <TextInput
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#1F3C88]/20 focus:border-[#1F3C88]"
                  />

                  <div
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </div>
                </div>
              </div>

              {/* Password Rules */}
              <ul className="text-xs text-gray-500 space-y-1 pl-4 list-disc">
                <li>Minimum 8 characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
                <li>At least 1 special character</li>
              </ul>

              {/* Button */}
              <FormButton
                text={isSubmitting ? "Updating..." : "Update Password"}
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

export default ChangePassword;
