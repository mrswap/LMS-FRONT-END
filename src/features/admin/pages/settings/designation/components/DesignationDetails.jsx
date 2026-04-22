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
  deleteSingleDesignation,
  getDesignationById,
  updateDesignationById,
} from "../../../../../../redux/slice/designationSlice";

const DesignationDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { designation } = useSelector((state) => state.designation);

  console.log(" designation:", designation);

  useEffect(() => {
    dispatch(getDesignationById(id));
  }, [id]);

  const initialValues = {
    name: designation?.name || "",
    label: designation?.label || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("designation.validation.nameRequired")),
    label: Yup.string().required(t("designation.validation.labelRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("label", values.label);

      await dispatch(updateDesignationById({ id, data: formData })).unwrap();

      toast.success("Designation updated ");
      navigate("/designation");
    } catch (err) {
      toast.error("Update failed ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok = await dispatch(
      showConfirm({ message: t("designation.details.deleteText") }),
    );

    if (!ok) return;

    await dispatch(deleteSingleDesignation(id));
    toast.success("Designation deleted ");
    navigate("/designation");
  };

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          {
            label: t("designation.breadcrumb.designation"),
            path: "/designation",
          },
          { label: t("designation.breadcrumb.viewDesignation") },
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
                  label={t("designation.details.name")}
                  placeholder={t("designation.details.namePlaceholder")}
                  required
                />
                <TextInput
                  name="label"
                  label={t("designation.details.label")}
                  placeholder={t("designation.details.labelPlaceholder")}
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
                    {t("designation.actions.deleteDesignation")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white px-4 py-2 rounded cursor-pointer"
                  >
                    {isSubmitting
                      ? t("designation.actions.updating")
                      : t("designation.actions.updateDesignation")}
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

export default DesignationDetails;
