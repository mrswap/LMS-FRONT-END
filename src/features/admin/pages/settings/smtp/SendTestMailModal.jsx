import React from "react";
import { useTranslation } from "react-i18next";

const SendTestMailModal = ({
  open,
  email,
  setEmail,
  onClose,
  onSend,
  loading,
}) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[350px] space-y-4">
        <h2 className="text-lg font-semibold">
          {t("smtp.actions.sendTestMail")}
        </h2>

        <input
          type="email"
          placeholder={t("smtp.details.emailPlaceholder")}
          className="w-full border border-gray-300 focus:border-none p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded cursor-pointer"
          >
            {t("smtp.actions.cancel")}
          </button>

          <button
            onClick={onSend}
            disabled={loading}
            className="px-3 py-1 bg-accent text-white rounded flex items-center gap-2 cursor-pointer"
          >
            {loading
              ? t("smtp.actions.sendingTestMail")
              : t("smtp.actions.send")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SendTestMailModal;
