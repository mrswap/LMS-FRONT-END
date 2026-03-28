import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FiMail, FiLock, FiEye } from "react-icons/fi";

import TextInput from "../../common/form/TextInput";
import Checkbox from "../../common/form/Checkbox";
import FormButton from "../../common/form/FormButton";

import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";
import { Link } from "react-router-dom";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setTimeout(() => setSubmitting(false), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/*  Logo */}
      <div className="text-center">
        <img src={logo} alt="" className="w-[190px] h-[110px]" />
      </div>

      {/*  Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl  text-primary font-bold">Welcome back</h2>
          <p className="text-[#64748B] text-sm mt-1">
            Sign in to your Avante admin account
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/*  Email */}
              <div>
                <label className="text-sm text-[#29324C] font-medium mb-1 block">
                  Email or Employee ID
                </label>

                <div className="relative">
                  <FiMail className="absolute top-3 left-3 text-primary" />
                  <TextInput
                    name="email"
                    placeholder="Enter your email or employee ID"
                    className="pl-10 h-11 border rounded-lg"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-[#29324C] font-medium ">
                    Password
                  </label>
                  <Link
                    // type="button"
                    // onClick={}
                    to="/forgot-password"
                    className="text-primary font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <FiLock className="absolute top-3 left-3 text-primary" />
                  <TextInput
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 border rounded-lg"
                  />
                  <FiEye className="absolute top-3 right-3 text-gray-400 cursor-pointer" />
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <Checkbox
                  name="remember"
                  className="text-[#64748B]"
                  label="Remember me for 30 days"
                />
              </div>

              <FormButton
                text={`${isSubmitting ? "Signing In..." : "Sign In"}`}
                className="cursor-pointer"
                loading={isSubmitting}
                type="submit"
              />

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Having trouble signing in? </p>
                <span className="text-[#1F3C88] font-medium cursor-pointer hover:underline">
                  Contact your system administrator
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Bottom text */}
      <p className="text-xs text-gray-400 my-4 ">
        © 2025 Avante Medical LMS - v2.1.0
      </p>
    </div>
  );
};

export default Login;
