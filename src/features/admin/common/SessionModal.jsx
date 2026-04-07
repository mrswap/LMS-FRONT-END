import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SessionModal = ({ open, onContinue, onLogout }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl p-6 text-center"
      >
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-full bg-yellow-100">
          ⏳
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          {/* Session Expiring */}
          {t("sessionModal.title")}
        </h2>

        {/* Desc */}
        <p className="text-sm text-gray-500 mt-2">
          {/* You’ve been inactive. You’ll be logged out soon. */}
          {t("sessionModal.description")}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onContinue}
            className="flex-1 py-2 rounded-lg bg-accent text-white cursor-pointer transition"
          >
            {/* Continue */}
            {t("sessionModal.continue")}
          </button>

          <button
            onClick={onLogout}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white cursor-pointer transition"
          >
            {/* Logout */}
            {t("sessionModal.logout")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionModal;
