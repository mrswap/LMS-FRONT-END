import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../common/form/TextInput";
import SelectField from "../../common/form/SelectField";
import {
  PageLayout,
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageHeaderRight,
} from "../../common/layout/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useToast } from "../../common/toast/ToastContext";
import { getProfile, updateProfile } from "../../../../redux/slice/authSlice";
import {
  FaUserCircle,
  FaUpload,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (profile?.profile_image) {
      setPreview(profile.profile_image);
    }
  }, [profile]);

  const regionOptions = [
    { label: "India 🇮🇳", value: "india" },
    { label: "United States 🇺🇸", value: "usa" },
    { label: "United Kingdom 🇬🇧", value: "uk" },
  ];

  const initialValues = {
    name: profile?.name || "",
    email: profile?.email || "",
    mobile: profile?.mobile || "",
    city: profile?.city || "",
    region: profile?.region
      ? { label: profile.region, value: profile.region }
      : null,
    profile_image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("profile.validation.nameRequired")),

    email: Yup.string()
      .email(t("profile.validation.emailInvalid"))
      .required(t("profile.validation.emailRequired")),

    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, t("profile.validation.mobileInvalid"))
      .required(t("profile.validation.mobileRequired")),

    city: Yup.string()
      .min(2, t("profile.validation.cityMin"))
      .required(t("profile.validation.cityRequired")),

    region: Yup.object().required(t("profile.validation.countryRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("mobile", values.mobile);
      formData.append("city", values.city);
      formData.append("region", values.region?.value);

      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }

      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <PageBody>
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("profile.title")}</PageTitle>
            <PageSubtitle>{t("profile.subtitle")}</PageSubtitle>
          </PageHeaderLeft>

          <PageHeaderRight>
            <Link
              to="/change-password"
              className=" border border-blue-500 text-blue-500 hover:text-blue-700 cursor-pointer  py-2 px-3 rounded-lg font-[400] text-sm"
            >
              {t("changePassword.title")}
            </Link>
          </PageHeaderRight>
        </PageHeader>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              {/* Image */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaUserCircle className="text-6xl text-gray-400" />
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer text-white">
                    <FaUpload />
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
                </div>

                {preview && (
                  <div className="flex gap-4">
                    <label className="cursor-pointer text-blue-600 flex items-center gap-1">
                      <FaExchangeAlt />
                      <input type="file" hidden />
                    </label>

                    <button
                      type="button"
                      className="text-red-500 flex items-center gap-1"
                      onClick={() => {
                        setPreview(null);
                        setFieldValue("profile_image", null);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  name="name"
                  label={t("profile.details.name")}
                  placeholder={t("profile.details.namePlaceholder")}
                  required
                  isDisabled={true}
                />
                <TextInput
                  name="email"
                  label={t("profile.details.email")}
                  placeholder={t("profile.details.emailPlaceholder")}
                  isDisabled
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  name="mobile"
                  label={t("profile.details.mobile")}
                  placeholder={t("profile.details.mobilePlaceholder")}
                  required
                />

                <TextInput
                  name="city"
                  label={t("profile.details.city")}
                  placeholder={t("profile.details.cityPlaceholder")}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <SelectField
                  name="region"
                  label={t("profile.details.country")}
                  options={regionOptions}
                  placeholder={t("profile.details.countryPlaceholder")}
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className=" bg-accent cursor-pointer text-white py-3 px-4 rounded-lg font-medium shadow"
                >
                  {isSubmitting
                    ? t("profile.actions.updating")
                    : t("profile.actions.updateProfile")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>
    </PageLayout>
  );
};

export default Profile;
