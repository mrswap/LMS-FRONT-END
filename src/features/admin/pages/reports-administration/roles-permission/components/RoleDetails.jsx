import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../../common/form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { PageLayout, PageBody } from "../../../../common/layout";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../../../common/toast/ToastContext";
import {
  deleteSingleUser,
  getUserById,
  updateUserById,
} from "../../../../../../redux/slice/userSlice";
import { showConfirm } from "../../../../../../redux/slice/confirmSlice";
import {
  FaUserCircle,
  FaUpload,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";
import {
  deleteSingleRole,
  getRoleById,
  updateRoleById,
} from "../../../../../../redux/slice/rolesSlice";

const RoleDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { role } = useSelector((state) => state.role);

  console.log(" role:", role);

  useEffect(() => {
    dispatch(getRoleById(id));
  }, [id]);

  const initialValues = {
    name: role?.name || "",
    label: role?.label || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("role.validation.nameRequired")),
    label: Yup.string().required(t("role.validation.labelRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("label", values.label);

      await dispatch(updateRoleById({ id, data: formData })).unwrap();

      toast.success("Role updated ");
      navigate("/roles-permission");
    } catch (err) {
      toast.error("Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("role.details.deleteText") }),
    );

    if (!ok) return;

    await dispatch(deleteSingleRole(id));
    toast.success("Role deleted ");
    navigate("/roles-permission");
  };

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label: t("role.breadcrumb.role"),
            path: "/roles-permission",
          },
          { label: t("role.breadcrumb.viewRole") },
        ]}
      />

      <PageBody>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, isSubmitting, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  name="name"
                  label={t("role.details.name")}
                  placeholder={t("role.details.namePlaceholder")}
                  required
                />
                <TextInput
                  name="label"
                  label={t("role.details.label")}
                  placeholder={t("role.details.labelPlaceholder")}
                  required
                />
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-500 rounded-md text-sm text-red-500 cursor-pointer"
                  >
                    {t("role.actions.deleteRole")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white px-4 py-2 rounded cursor-pointer"
                  >
                    {isSubmitting
                      ? t("role.actions.updating")
                      : t("role.actions.updateRole")}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>
    </PageLayout>
  );
};

export default RoleDetails;
