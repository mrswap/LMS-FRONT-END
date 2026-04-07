import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { PageLayout, PageBody } from "../../../common/layout";
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
import { showConfirm } from "../../../../../redux/slice/confirmSlice";
import {
  FaUserCircle,
  FaUpload,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";

const UserDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const { user } = useSelector((state) => state.user);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getUserById(id));
  }, [id]);

  useEffect(() => {
    if (user?.profile_image) {
      setPreview(user.profile_image);
    }
  }, [user]);

  const roleOptions = [{ label: "Sales", value: "sales" }];

  // const departmentOptions = [
  //   { label: "Sales", value: "sales" },
  //   { label: "HR", value: "hr" },
  // ];

  // const designationOptions = [
  //   { label: "Executive", value: "executive" },
  //   { label: "Manager", value: "manager" },
  // ];

  const regionOptions = [
    { label: "India", value: "india" },
    { label: "USA", value: "usa" },
  ];

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    employee_id: user?.employee_id || "",
    role: roleOptions.find((r) => r.value === user?.role) || null,
    // department:
    //   departmentOptions.find((d) => d.value === user?.department) || null,
    // designation:
    //   designationOptions.find((d) => d.value === user?.designation) || null,
    region: regionOptions.find((r) => r.value === user?.region) || null,
    city: user?.city || "",
    mobile: user?.mobile || "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  };

  // const validationSchema = Yup.object({
  //   name: Yup.string().required(),
  //   email: Yup.string().email().required(),
  // });

  const validationSchema = Yup.object({
    name: Yup.string().required(t("userManagement.validation.nameRequired")),
    email: Yup.string()
      .email(t("userManagement.validation.emailInvalid"))
      .required(t("userManagement.validation.emailRequired")),
    role: Yup.object().required(t("userManagement.validation.roleRequired")),
    // department: Yup.object().required(
    //   t("userManagement.validation.departmentRequired"),
    // ),
    // designation: Yup.object().required(
    //   t("userManagement.validation.designationRequired"),
    // ),
    region: Yup.object().required(
      t("userManagement.validation.regionRequired"),
    ),
    city: Yup.string().required(t("userManagement.validation.cityRequired")),
    mobile: Yup.string().required(
      t("userManagement.validation.mobileRequired"),
    ),
    // password: Yup.string()
    //   .min(6, t("userManagement.validation.passwordMin"))
    //   .required(t("userManagement.validation.passwordRequired")),
    // confirmPassword: Yup.string()
    //   .oneOf(
    //     [Yup.ref("password")],
    //     t("userManagement.validation.passwordMatch"),
    //   )
    //   .required(t("userManagement.validation.confirmPasswordRequired")),
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
      formData.append("designation", "executive");

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
    // if (!window.confirm("Delete this user?")) return;
    const ok = await dispatch(
      showConfirm({ message: t("userManagement.details.deleteText") }),
    );

    if (!ok) return;

    await dispatch(deleteSingleUser(id));
    toast.success("User deleted ");
    navigate("/assign-training");
  };

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label: t("userManagement.breadcrumb.users"),
            path: "/assign-training",
          },
          { label: t("userManagement.breadcrumb.viewUserProfile") },
        ]}
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
            {t("userManagement.actions.deleteUser")}
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
                  <AiOutlineExclamationCircle />{" "}
                  {t("userManagement.details.personalInfo")}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput
                    name="name"
                    label={t("userManagement.details.fullName")}
                    placeholder={t(
                      "userManagement.details.fullNamePlaceholder",
                    )}
                  />
                  <TextInput
                    name="email"
                    label={t("userManagement.details.email")}
                    placeholder={t("userManagement.details.emailPlaceholder")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput
                    name="mobile"
                    label={t("userManagement.details.phone")}
                    placeholder={t("userManagement.details.phonePlaceholder")}
                  />
                  <TextInput
                    name="employee_id"
                    label={t("userManagement.details.employeeId")}
                    placeholder={t(
                      "userManagement.details.employeeIdPlaceholder",
                    )}
                    disabled
                  />
                </div>

                {/* <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    name="department"
                    label={t("userManagement.details.department")}
                    placeholder={t(
                      "userManagement.details.departmentPlaceholder",
                    )}
                    options={departmentOptions}
                  />
                  <SelectField
                    name="designation"
                    label={t("userManagement.details.designation")}
                    placeholder={t(
                      "userManagement.details.designationPlaceholder",
                    )}
                    options={designationOptions}
                  />
                </div> */}

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    name="region"
                    label={t("userManagement.details.region")}
                    placeholder={t("userManagement.details.regionPlaceholder")}
                    options={regionOptions}
                  />
                  <TextInput
                    name="city"
                    label={t("userManagement.details.city")}
                    placeholder={t("userManagement.details.cityPlaceholder")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <SelectField
                    name="role"
                    label={t("userManagement.details.role")}
                    placeholder={t("userManagement.details.rolePlaceholder")}
                    options={roleOptions}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t("userManagement.details.profileImage")}
                  </label>

                  {!preview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      </div>

                      <label className="bg-accent  text-white px-4 py-2 rounded-md text-sm cursor-pointer transition flex items-center gap-2">
                        <FaUpload className="w-3.5 h-3.5" />
                        {t("userManagement.details.uploadImage")}
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

                {/* PASSWORD */}
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput
                    name="password"
                    label={t("userManagement.details.newPassword")}
                    placeholder={t(
                      "userManagement.details.newPasswordPlaceholder",
                    )}
                    type="password"
                  />
                  <TextInput
                    name="confirmPassword"
                    label={t("userManagement.details.confirmPassword")}
                    placeholder={t(
                      "userManagement.details.confirmPasswordPlaceholder",
                    )}
                    type="password"
                  />
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white px-4 py-2 rounded cursor-pointer"
                  >
                    {isSubmitting
                      ? t("userManagement.actions.updating")
                      : t("userManagement.actions.updateUser")}
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
