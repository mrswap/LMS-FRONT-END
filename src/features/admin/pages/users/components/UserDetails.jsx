// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import { TextInput, SelectField } from "../../../common/form";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import {
//   PageLayout,
//   PageHeader,
//   PageHeaderLeft,
//   PageHeaderRight,
//   PageTitle,
//   PageSubtitle,
//   PageBody,
// } from "../../../common/layout";
// import { useTranslation } from "react-i18next";
// import Breadcrumb from "../../../common/layout/Breadcrumb";
// import CustomeTable from "../../../common/table/CustomeTable";

// const UserDetails = () => {
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

//   const data = [
//     {
//       certificate: "Safety Training",
//       issueDate: "10 Feb 2024",
//       status: t("userManagement.details.certificates.completed"),
//     },
//     {
//       certificate: "Basic Training",
//       issueDate: "15 Mar 2024",
//       status: t("userManagement.details.certificates.completed"),
//     },
//   ];

//   const columns = [
//     {
//       header: t("userManagement.details.certificates.columns.certificate"),
//       accessor: "certificate",
//     },
//     {
//       header: t("userManagement.details.certificates.columns.issueDate"),
//       accessor: "issueDate",
//     },
//     {
//       header: t("userManagement.details.certificates.columns.status"),
//       accessor: "status",
//       render: (row) => <span className="text-green-600">{row.status}</span>,
//     },
//     {
//       header: t("userManagement.details.certificates.columns.actions"),
//       accessor: "actions",
//       render: () => <span>👁</span>,
//     },
//   ];

//   return (
//     <PageLayout>
//       {/* 🔹 Breadcrumb */}
//       <Breadcrumb
//         items={[
//           {
//             label: t("userManagement.breadcrumb.users"),
//             path: "/assign-training",
//           },
//           {
//             label: t("userManagement.breadcrumb.viewUserProfile"),
//           },
//         ]}
//       />
//       <div className=" p-6 rounded-lg border border-gray-300">
//         {/* profile */}
//         <div className="flex justify-between items-start p-6 border-b border-gray-300">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               🌿
//             </div>
//             <div>
//               <h2 className="text-primary font-[700]">Johnathan</h2>
//               <p className="text-[16px] text-[#29324C] font-[400]">
//                 {t("userManagement.details.header.id")}: 0986-9842 •{" "}
//                 {t("userManagement.details.header.role")}
//               </p>
//             </div>
//           </div>

//           <span className="text-xs px-3 py-1 bg-[#D2EBDF7D] text-green-600 rounded-full">
//             <span className="text-[#6B7280]">
//               {t("userManagement.details.header.accountStatus")}:
//             </span>{" "}
//             <span className="text-[#02829A]">
//               {t("userManagement.details.header.active")}
//             </span>
//           </span>
//         </div>

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
//                           ? t("userManagement.actions.updating")
//                           : t("userManagement.actions.udpateUser")}
//                       </button>
//                     </div>
//                   </div>
//                 </Form>
//               );
//             }}
//           </Formik>
//         </PageBody>
//       </div>

//       {/* 🔹 Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//         <div className="bg-white p-4 rounded-lg border border-gray-300 text-sm">
//           <p className="text-gray-500">
//             {t("userManagement.details.stats.lastLogin")}
//           </p>
//           <p className="font-semibold">
//             {t("userManagement.details.stats.hoursAgo", { count: 2 })}
//           </p>
//         </div>

//         <div className="bg-white p-4 rounded-lg border border-gray-300 text-sm">
//           <p className="text-gray-500">
//             {t("userManagement.details.stats.courses")}
//           </p>
//           <p className="font-semibold">
//             {t("userManagement.details.stats.coursesCount", { count: 24 })}
//           </p>
//         </div>

//         <div className="bg-white p-4 rounded-lg border border-gray-300 text-sm">
//           <p className="text-gray-500">
//             {t("userManagement.details.stats.completionRate")}
//           </p>
//           <p className="font-semibold">
//             98% {t("userManagement.details.stats.perfect")}
//           </p>
//         </div>
//       </div>

//       {/* 🔹 Training Programs */}
//       <div className="bg-white border border-gray-300 rounded-xl p-6 mt-6">
//         <div className="flex justify-between mb-4">
//           <h3 className="text-sm font-semibold text-gray-700">
//             {t("userManagement.details.training.title")}
//           </h3>
//           <span className="text-xs text-blue-600 cursor-pointer">
//             {t("userManagement.details.training.viewAll")}
//           </span>
//         </div>

//         <div className="mb-4">
//           <p className="text-sm font-medium">
//             Advanced Cardiac Life Support (ACLS)
//           </p>
//           <div className="w-full bg-gray-200 h-2 rounded mt-1">
//             <div className="bg-blue-600 h-2 rounded w-[85%]"></div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>
//               {t("userManagement.details.training.progress", { value: 85 })}
//             </span>
//             <span>
//               {t("userManagement.details.training.modules", {
//                 completed: 15,
//                 total: 18,
//               })}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-hidden mt-4">
//         <CustomeTable columns={columns} data={data} itemsPerPage={5} />
//       </div>
//     </PageLayout>
//   );
// };

// export default UserDetails;

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../common/layout/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../../common/toast/ToastContext";
import {
  deleteSingleUser,
  getUserById,
  updateUserById,
} from "../../../../../redux/slice/userSlice";

const UserDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const { user } = useSelector((state) => state.user);

  // console.log("User from Redux:", user);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getUserById(id));
  }, [id]);

  useEffect(() => {
    if (user?.profile_image) {
      setPreview(user.profile_image);
    }
  }, [user]);

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

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    employee_id: user?.employee_id || "",
    role: roleOptions.find((r) => r.value === user?.role) || null,
    department:
      departmentOptions.find((d) => d.value === user?.department) || null,
    designation:
      designationOptions.find((d) => d.value === user?.designation) || null,
    region: regionOptions.find((r) => r.value === user?.region) || null,
    city: user?.city || "",
    mobile: user?.mobile || "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
  });

  const onSubmit = async (values, { setSubmitting }) => {
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

      if (values.password) {
        formData.append("password", values.password);
      }

      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }

      await dispatch(updateUserById({ id, data: formData })).unwrap();

      toast.success("User updated ");
      navigate("/assign-training");
    } catch (err) {
      toast.error("Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this user?")) return;

    await dispatch(deleteSingleUser(id));
    toast.success("User deleted ");
    navigate("/assign-training");
  };

  return (
    <PageLayout>
      <Breadcrumb
        items={[{ label: "Users", path: "/users" }, { label: "User Details" }]}
      />

      <div className="p-6 border border-gray-300 rounded-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src={preview || "/default-user.png"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold">{user?.name}</h2>
              <p className="text-sm text-gray-500">
                ID: {user?.employee_id} • {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete User
          </button>
        </div>

        <PageBody>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, isSubmitting, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="space-y-6">
                {/* PERSONAL */}
                <h3 className="flex items-center gap-2 font-semibold">
                  <AiOutlineExclamationCircle /> Personal Info
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput name="name" label="Name" />
                  <TextInput name="email" label="Email" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput name="mobile" label="Mobile" />
                  <TextInput name="employee_id" label="Employee ID" disabled />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    name="department"
                    label="Department"
                    options={departmentOptions}
                  />
                  <SelectField
                    name="designation"
                    label="Designation"
                    options={designationOptions}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    name="region"
                    label="Region"
                    options={regionOptions}
                  />
                  <TextInput name="city" label="City" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField name="role" label="Role" options={roleOptions} />
                </div>

                {/* IMAGE */}
                <div>
                  <label>Profile Image</label>

                  {!preview ? (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValue("profile_image", file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  ) : (
                    <div className="flex gap-4 items-center">
                      <img src={preview} className="w-20 h-20 rounded" />

                      <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
                        Change
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFieldValue("profile_image", file);
                            setPreview(URL.createObjectURL(file));
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
                </div>

                {/* PASSWORD */}
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput
                    name="password"
                    label="New Password"
                    type="password"
                  />
                  <TextInput
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                  />
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {isSubmitting ? "Updating..." : "Update User"}
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

export default UserDetails;
