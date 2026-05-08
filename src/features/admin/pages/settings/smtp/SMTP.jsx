import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput } from "../../../common/form/index";
import {
  PageLayout,
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageHeaderRight,
} from "../../../common/layout";
import Breadcrumb from "../../../common/layout/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useToast } from "../../../common/toast/ToastContext";
import Select from "react-select";

import {
  getSmtp,
  updateSmtp,
  sendTestMail,
} from "../../../../../redux/slice/smtpSlice";
import SendTestMailModal from "./SendTestMailModal";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../../hooks/usePermission";

const SmtpSettings = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { smtp } = useSelector((state) => state.smtp);
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(getSmtp());
  }, [dispatch]);

  const encryptionOptions = [
    { label: t("smtp.encryption.ssl"), value: "ssl" },
    { label: t("smtp.encryption.tls"), value: "tls" },
  ];

  const initialValues = {
    mailer: smtp?.mailer || "smtp",
    host: smtp?.host || "",
    port: smtp?.port || "",
    username: smtp?.username || "",
    password: smtp?.password || "",
    encryption: smtp?.encryption || "ssl",
    from_address: smtp?.from_address || "",
    from_name: smtp?.from_name || "",
  };

  const validationSchema = Yup.object({
    mailer: Yup.string().required(t("smtp.validation.mailerRequired")),
    host: Yup.string().required(t("smtp.validation.hostRequired")),
    port: Yup.string().required(t("smtp.validation.portRequired")),
    username: Yup.string().required(t("smtp.validation.usernameRequired")),
    password: Yup.string().required(t("smtp.validation.passwordRequired")),
    encryption: Yup.string().required(t("smtp.validation.encryptionRequired")),
    from_address: Yup.string()
      .email(t("smtp.validation.invalidEmail"))
      .required(t("smtp.validation.fromAddressRequired")),
    from_name: Yup.string().required(t("smtp.validation.fromNameRequired")),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateSmtp(values)).unwrap();
      await dispatch(getSmtp());
      toast.success(t("smtp.success.update"));
    } catch {
      toast.error(t("smtp.error.update"));
    } finally {
      setSubmitting(false);
    }
  };

  const [sending, setSending] = useState(false);

  const handleSendMail = async () => {
    try {
      setSending(true);
      await dispatch(sendTestMail({ email })).unwrap();
      toast.success(t("smtp.success.testMail"));
      setOpenModal(false);
      setEmail("");
    } catch {
      toast.error(t("smtp.error.testMail"));
    } finally {
      setSending(false);
    }
  };

  if (!hasPermission("smtp.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("smtp.list.title")}</PageTitle>
          <PageSubtitle>{t("smtp.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight />
      </PageHeader>

      <PageBody>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput
                  name="mailer"
                  label={t("smtp.details.mailer")}
                  placeholder={t("smtp.details.mailerPlaceholder")}
                  required
                  maxLength={255}
                />
                <TextInput
                  name="host"
                  label={t("smtp.details.host")}
                  placeholder={t("smtp.details.hostPlaceholder")}
                  required
                  maxLength={255}
                />
                <TextInput
                  name="port"
                  label={t("smtp.details.port")}
                  placeholder={t("smtp.details.portPlaceholder")}
                  required
                  maxLength={255}
                />
                <TextInput
                  name="username"
                  label={t("smtp.details.username")}
                  placeholder={t("smtp.details.usernamePlaceholder")}
                  required
                  maxLength={255}
                />
                <TextInput
                  name="password"
                  label={t("smtp.details.password")}
                  placeholder={t("smtp.details.passwordPlaceholder")}
                  required
                  maxLength={255}
                />

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t("smtp.details.encryption")}
                  </label>
                  <Select
                    options={encryptionOptions}
                    value={encryptionOptions.find(
                      (opt) => opt.value === values.encryption,
                    )}
                    required={true}
                    onChange={(selected) =>
                      setFieldValue("encryption", selected.value)
                    }
                    placeholder={t("smtp.details.encryptionPlaceholder")}
                  />
                </div>

                <TextInput
                  name="from_address"
                  label={t("smtp.details.fromAddress")}
                  placeholder={t("smtp.details.fromAddressPlaceholder")}
                  required
                  maxLength={255}
                />

                <TextInput
                  name="from_name"
                  label={t("smtp.details.fromName")}
                  placeholder={t("smtp.details.fromNamePlaceholder")}
                  required
                  maxLength={255}
                />
              </div>

              <div className="flex justify-end gap-3">
                {hasPermission("smtp.test") && (
                  <button
                    type="button"
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2 border rounded-md border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                  >
                    {t("smtp.actions.sendTestMail")}
                  </button>
                )}

                {hasPermission("smtp.edit") && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white px-4 py-2 rounded cursor-pointer hover:bg-opacity-90 transition"
                  >
                    {isSubmitting
                      ? t("smtp.actions.updating")
                      : t("smtp.actions.updateSMTP")}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>

      <SendTestMailModal
        open={openModal}
        email={email}
        setEmail={setEmail}
        onClose={() => setOpenModal(false)}
        onSend={handleSendMail}
        loading={sending}
        t={t}
      />
    </PageLayout>
  );
};

export default SmtpSettings;
