import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectField } from "../../../../common/form";
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
} from "../../../../common/layout";
import { useToast } from "../../../../common/toast/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaUpload,
  FaExchangeAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { createDesignation } from "../../../../../../redux/slice/designationSlice";

const CreateDesignation = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    label: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required(t("designation.validation.nameRequired")),
    label: Yup.string().required(t("designation.validation.labelRequired")),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("label", values.email);

      await dispatch(createDesignation(formData)).unwrap();
      toast.success("Designation created successfully ");
      resetForm();
      navigate("/designation");
    } catch (error) {
      toast.error(error?.message || "Error creating designation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{t("designation.create.title")}</PageTitle>
            <PageSubtitle>{t("designation.create.subtitle")}</PageSubtitle>
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded cursor-pointer"
                  >
                    {isSubmitting
                      ? t("designation.actions.creating")
                      : t("designation.actions.createDesignation")}
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

export default CreateDesignation;
