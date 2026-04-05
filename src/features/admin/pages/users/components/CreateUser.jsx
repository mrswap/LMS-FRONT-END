// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, SelectField } from "../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";

// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../common/layout";
// import { useTranslation } from "react-i18next";

// const CreateUser = () => {
//   const { t } = useTranslation();

//   const initialValues = {
//     levelName: "",
//     program: null,
//     description: "",
//   };

//   const validationSchema = Yup.object({
//     levelName: Yup.string().required("Level name is required"),
//     program: Yup.object().nullable().required("Parent program is required"),
//     description: Yup.string().required("Description is required"),
//   });

//   const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
//     console.log("Form submitted!", values);

//     try {
//       const formData = new FormData();

//       console.log("Submitting with data:", {
//         levelName: values.levelName,
//         program: values.program,
//         description: values.description,
//         thumbnail: thumbnail?.name,
//       });

//       alert("Level created successfully!");
//       resetForm();
//       removeThumbnail();
//     } catch (error) {
//       console.error("Submission error:", error);
//       setErrors({ submit: error.message });
//       alert("Failed to create level");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <PageLayout>
//       <div className=" p-8 rounded-lg border border-gray-300">
//         <PageHeader>
//           <PageHeaderLeft>
//             <PageTitle>{t("userManagement.create.title")}</PageTitle>
//             <PageSubtitle>{t("userManagement.create.subtitle")}</PageSubtitle>
//           </PageHeaderLeft>
//         </PageHeader>

//         <PageBody className="mt-4">
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//             enableReinitialize={true}
//           >
//             {({ isSubmitting, values, setFieldValue, handleSubmit }) => {
//               console.log("Formik values:", values);

//               return (
//                 <Form onSubmit={handleSubmit} className="space-y-8">
//                   {/* General Details */}
//                   <div>
//                     <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                       <span className="text-[18px] text-primary font-[700]">
//                         <AiOutlineExclamationCircle />
//                       </span>
//                       {t("userManagement.details.personalInfo")}
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                       <div>
//                         <TextInput
//                           name="levelName"
//                           label={t("userManagement.details.fullName")}
//                           placeholder={t(
//                             "userManagement.details.fullNamePlaceholder",
//                           )}
//                           required={true}
//                         />
//                       </div>
//                       <div>
//                         <TextInput
//                           name="email"
//                           label={t("userManagement.details.email")}
//                           placeholder={t(
//                             "userManagement.details.emailPlaceholder",
//                           )}
//                           required={true}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                       <div>
//                         <TextInput
//                           name="levelName"
//                           label={t("userManagement.details.phone")}
//                           placeholder={t(
//                             "userManagement.details.phonePlaceholder",
//                           )}
//                           required={true}
//                         />
//                       </div>
//                       <div>
//                         <SelectField
//                           name="program"
//                           label={t("userManagement.details.region")}
//                           placeholder={t(
//                             "userManagement.details.regionPlaceholder",
//                           )}
//                           required={true}
//                           options={[]}
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                       <div>
//                         <SelectField
//                           name="program"
//                           label={t("userManagement.details.role")}
//                           placeholder={t(
//                             "userManagement.details.rolePlaceholder",
//                           )}
//                           required={true}
//                           options={[]}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                     <span className="text-[18px] text-primary font-[700]">
//                       <AiOutlineExclamationCircle />
//                     </span>
//                     {t("userManagement.details.password")}
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
//                     <div>
//                       <TextInput
//                         name="levelName"
//                         label={t("userManagement.details.password")}
//                         placeholder={t(
//                           "userManagement.details.passwordPlaceholder",
//                         )}
//                         required={true}
//                       />
//                     </div>
//                     <div>
//                       <TextInput
//                         name="email"
//                         label={t("userManagement.details.confirmPassword")}
//                         placeholder={t(
//                           "userManagement.details.confirmPasswordPlaceholder",
//                         )}
//                         required={true}
//                       />
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="flex justify-end items-center pt-4">
//                     <div className="flex gap-3">
//                       <button
//                         type="button"
//                         className="px-4 py-2 border border-[#184994] rounded-md text-sm text-[#184994] hover:bg-gray-50"
//                       >
//                         {t("userManagement.actions.cancle")}
//                       </button>
//                       <button
//                         type="submit"
//                         disabled={isSubmitting}
//                         className="px-4 py-2 rounded-md text-sm text-white bg-accent disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
//                       >
//                         {isSubmitting
//                           ? t("userManagement.actions.creating")
//                           : t("userManagement.actions.createUser")}
//                       </button>
//                     </div>
//                   </div>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default CreateUser;

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { createUser } from "../../../../../redux/slice/userSlice";
import { useToast } from "../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUpload,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";

const CreateUser = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

  // 🔥 Auto Generate Employee ID
  // const generateEmployeeId = () => {
  //   return Math.floor(1000 + Math.random() * 9000).toString();
  // };

  const generateEmployeeId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${random}`;
  };

  const initialValues = {
    name: "",
    email: "",
    employee_id: generateEmployeeId(),
    role: null,
    department: null,
    designation: null,
    region: null,
    city: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  };

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Sales", value: "sales" },
  ];

  const departmentOptions = [
    { label: "Sales", value: "sales" },
    { label: "HR", value: "hr" },
  ];

  const designationOptions = [
    { label: "Executive", value: "executive" },
    { label: "Manager", value: "manager" },
  ];

  const regionOptions = [
    { label: "India", value: "india" },
    { label: "USA", value: "usa" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email().required("Email is required"),
    role: Yup.object().required("Role required"),
    department: Yup.object().required("Department required"),
    designation: Yup.object().required("Designation required"),
    region: Yup.object().required("Region required"),
    city: Yup.string().required("City required"),
    mobile: Yup.string().required("Mobile required"),
    password: Yup.string().min(6).required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("employee_id", values.employee_id);
      formData.append("role", values.role?.value);
      formData.append("department", values.department?.value);
      formData.append("designation", values.designation?.value);
      formData.append("region", values.region?.value);
      formData.append("city", values.city);
      formData.append("mobile", values.mobile);
      formData.append("password", values.password);

      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }

      await dispatch(createUser(formData)).unwrap();

      toast.success("User created successfully ");
      resetForm();
      setPreview(null);
      navigate("/assign-training");
    } catch (error) {
      alert(error?.message || "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("userManagement.create.title")}</PageTitle>
            <PageSubtitle>{t("userManagement.create.subtitle")}</PageSubtitle>
          </PageHeaderLeft>
        </PageHeader>

        <PageBody className="mt-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, setFieldValue, handleSubmit, values }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                {/* PERSONAL INFO */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("userManagement.details.personalInfo")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput name="name" label="Full Name" required />
                    <TextInput name="email" label="Email" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput name="mobile" label="Phone" required />

                    <TextInput
                      name="employee_id"
                      label="Employee ID"
                      isDisabled={true}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="department"
                      label="Department"
                      options={departmentOptions}
                      required
                    />
                    <SelectField
                      name="designation"
                      label="Designation"
                      options={designationOptions}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="region"
                      label="Region"
                      options={regionOptions}
                      required
                    />
                    <TextInput name="city" label="City" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="role"
                      label="Role"
                      options={roleOptions}
                      required
                    />
                  </div>

                  {/* IMAGE */}
                  {/* <div className="mt-4">
                    <label className="block mb-2">Profile Image</label>

                    {!preview ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue("profile_image", file);
                          if (file) {
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    ) : (
                      <div className="flex gap-4 items-center">
                        <img
                          src={preview}
                          className="w-20 h-20 object-cover rounded border"
                        />

                        <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
                          Change
                          <input
                            type="file"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFieldValue("profile_image", file);
                              if (file) {
                                setPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => {
                            setPreview(null);
                            setFieldValue("profile_image", null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div> */}

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profile Image
                    </label>

                    {!preview ? (
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          <FaUserCircle className="w-10 h-10 text-gray-400" />
                        </div>

                        <label className="bg-accent  text-white px-4 py-2 rounded-md text-sm cursor-pointer transition flex items-center gap-2">
                          <FaUpload className="w-3.5 h-3.5" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFieldValue("profile_image", file);
                              if (file) {
                                setPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={preview}
                          className="w-24 h-24 block object-cover rounded-full border-2 border-blue-400"
                        />

                        <div className="flex justify-center gap-3 mt-2 w-24">
                          <label>
                            <FaExchangeAlt className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition" />
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setFieldValue("profile_image", file);
                                if (file) {
                                  setPreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setFieldValue("profile_image", null);
                            }}
                          >
                            <FaTrashAlt className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("userManagement.details.password")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                    <TextInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      required
                    />
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded cursor-pointer"
                  >
                    {isSubmitting ? "Creating..." : "Create User"}
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

export default CreateUser;
