import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
import countryOptions from "../../../../../utils/countries.json";
import { getAllRoles } from "../../../../../redux/slice/rolesSlice";
import { getAllDesignation } from "../../../../../redux/slice/designationSlice";

const CreateUser = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { roles } = useSelector((state) => state.role);
  const { designations } = useSelector((state) => state.designation);

  useEffect(() => {
    dispatch(getAllDesignation());
    dispatch(getAllRoles());
  }, []);

  console.log("roles", roles);
  console.log("designation", designations);

  const roleOptions = roles?.map((role) => ({
    label: role.label,
    value: role.id,
  }));

  const designationOptions = designations?.map((des) => ({
    label: des.name,
    value: des.id,
  }));

  const regionOptions = countryOptions;

  const initialValues = {
    name: "",
    email: "",
    employee_id: "",
    department: "",
    role: null,
    designation: null,
    region: null,
    city: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("userManagement.validation.nameRequired")),
    email: Yup.string()
      .email(t("userManagement.validation.emailInvalid"))
      .required(t("userManagement.validation.emailRequired")),
    role: Yup.object().required(t("userManagement.validation.roleRequired")),
    designation: Yup.object().required(
      t("userManagement.validation.designationRequired"),
    ),
    department: Yup.string().required(
      t("userManagement.validation.departmentRequired"),
    ),
    region: Yup.object().required(
      t("userManagement.validation.regionRequired"),
    ),
    city: Yup.string().required(t("userManagement.validation.cityRequired")),
    mobile: Yup.string().required(
      t("userManagement.validation.mobileRequired"),
    ),
    password: Yup.string()
      .min(6, t("userManagement.validation.passwordMin"))
      .required(t("userManagement.validation.passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        t("userManagement.validation.passwordMatch"),
      )
      .required(t("userManagement.validation.confirmPasswordRequired")),
  });

  const generateEmployeeId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${random}`;
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("values", values);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("employee_id", generateEmployeeId());
      formData.append("role_id", values.role?.value);
      formData.append("designation_id", values.designation?.value);
      formData.append("region", values.region?.value);
      formData.append("city", values.city);
      formData.append("mobile", values.mobile);
      formData.append("password", values.password);
      formData.append("department", values.department);

      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }

      await dispatch(createUser(formData)).unwrap();
      toast.success(t("userManagement.success.create"));
      resetForm();
      setPreview(null);
      navigate("/assign-training");
    } catch (error) {
      toast.error(error?.message || t("userManagement.error.create"));
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
            {({ isSubmitting, setFieldValue, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("userManagement.details.personalInfo")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="name"
                      label={t("userManagement.details.fullName")}
                      placeholder={t(
                        "userManagement.details.fullNamePlaceholder",
                      )}
                      required
                      maxLength={155}
                    />
                    <TextInput
                      name="email"
                      label={t("userManagement.details.email")}
                      placeholder={t("userManagement.details.emailPlaceholder")}
                      required
                      maxLength={255}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="mobile"
                      label={t("userManagement.details.phone")}
                      placeholder={t("userManagement.details.phonePlaceholder")}
                      required
                    />
                    <TextInput
                      name="department"
                      label={t("userManagement.details.department")}
                      placeholder={t(
                        "userManagement.details.departmentPlaceholder",
                      )}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="region"
                      label={t("userManagement.details.region")}
                      options={regionOptions}
                      required
                    />
                    <TextInput
                      name="city"
                      label={t("userManagement.details.city")}
                      placeholder={t("userManagement.details.cityPlaceholder")}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="role"
                      label={t("userManagement.details.role")}
                      placeholder={t("userManagement.details.rolePlaceholder")}
                      options={roleOptions}
                      required
                    />
                    <SelectField
                      name="designation"
                      label={t("userManagement.details.designation")}
                      placeholder={t(
                        "userManagement.details.designationPlaceholder",
                      )}
                      options={designationOptions}
                      required
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t("userManagement.details.profileImage")}
                    </label>
                    {!preview ? (
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                          <FaUserCircle className="w-10 h-10 text-gray-400" />
                        </div>
                        <label className="bg-accent text-white px-4 py-2 rounded-md text-sm cursor-pointer transition flex items-center gap-2">
                          <FaUpload className="w-3.5 h-3.5" />
                          {t("userManagement.details.uploadImage")}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFieldValue("profile_image", file);
                              if (file) setPreview(URL.createObjectURL(file));
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <img
                          src={preview}
                          className="w-24 h-24 block object-cover rounded-full border-2 border-blue-400"
                          alt="Profile preview"
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
                                if (file) setPreview(URL.createObjectURL(file));
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

                {/* Password */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <AiOutlineExclamationCircle />
                    {t("userManagement.details.createPassword")}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <TextInput
                      name="password"
                      label={t("userManagement.details.password")}
                      placeholder={t(
                        "userManagement.details.passwordPlaceholder",
                      )}
                      type="password"
                      required
                      maxLength={50}
                    />
                    <TextInput
                      name="confirmPassword"
                      label={t("userManagement.details.confirmPassword")}
                      placeholder={t(
                        "userManagement.details.confirmPasswordPlaceholder",
                      )}
                      type="password"
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded cursor-pointer"
                  >
                    {isSubmitting
                      ? t("userManagement.actions.creating")
                      : t("userManagement.actions.createUser")}
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
