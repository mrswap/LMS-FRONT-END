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

const SmtpSettings = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { smtp } = useSelector((state) => state.smtp);
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(getSmtp());
  }, []);

  const encryptionOptions = [
    { label: "SSL", value: "ssl" },
    { label: "TSL", value: "tsl" },
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
    mailer: Yup.string().required("Mailer required"),
    host: Yup.string().required("Host required"),
    port: Yup.string().required("Port required"),
    username: Yup.string().required("Username required"),
    password: Yup.string().required("Password required"),
    encryption: Yup.string().required("Encryption required"),
    from_address: Yup.string().email("Invalid email").required("Required"),
    from_name: Yup.string().required("Required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateSmtp(values)).unwrap();
      await dispatch(getSmtp());
      toast.success("SMTP updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const [sending, setSending] = useState(false);

  const handleSendMail = async () => {
    try {
      setSending(true);

      await dispatch(sendTestMail({ email })).unwrap();

      toast.success("Mail sent");
      setOpenModal(false);
      setEmail("");
    } catch {
      toast.error("Mail failed");
    } finally {
      setSending(false);
    }
  };

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
                />
                <TextInput
                  name="host"
                  label={t("smtp.details.host")}
                  placeholder={t("smtp.details.hostPlaceholder")}
                  required
                />
                <TextInput
                  name="port"
                  label={t("smtp.details.port")}
                  placeholder={t("smtp.details.portPlaceholder")}
                  required
                />
                <TextInput
                  name="username"
                  label={t("smtp.details.username")}
                  placeholder={t("smtp.details.usernamePlaceholder")}
                  required
                />
                <TextInput
                  name="password"
                  label={t("smtp.details.password")}
                  placeholder={t("smtp.details.passwordPlaceholder")}
                  required
                />

                {/* ENCRYPTION SELECT */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    {t("smtp.details.encryption")}
                  </label>
                  <Select
                    options={encryptionOptions}
                    value={encryptionOptions.find(
                      (opt) => opt.value === values.encryption,
                    )}
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
                />

                <TextInput
                  name="from_name"
                  label={t("smtp.details.fromName")}
                  placeholder={t("smtp.details.fromNamePlaceholder")}
                  required
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className="px-4 py-2 border rounded-md border-gray-300 text-gray-700 cursor-pointer"
                >
                  {t("smtp.actions.sendTestMail")}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent text-white px-4 py-2 rounded cursor-pointer"
                >
                  {isSubmitting
                    ? t("smtp.actions.updating")
                    : t("smtp.actions.updateSMTP")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </PageBody>

      {/* ===== MODAL ===== */}
      <SendTestMailModal
        open={openModal}
        email={email}
        setEmail={setEmail}
        onClose={() => setOpenModal(false)}
        onSend={handleSendMail}
        loading={sending}
      />
    </PageLayout>
  );
};

export default SmtpSettings;
