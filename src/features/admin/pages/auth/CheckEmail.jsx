import { FiMail, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

import logo from "../../../../assets/admin/AvanteMedicalLogoBlue.png";
import success from "../../../../assets/admin/success-right.png";
import { useTranslation } from "react-i18next";

const CheckEmail = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEF2F6] px-4">
      {/* Logo */}
      <div className="text-center mb-6">
        <img
          src={logo}
          alt="Avante Medical"
          className="w-[190px] h-[110px] object-contain"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {/* Heading */}
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <img src={success} alt="" />
          </div>
          <h2 className="text-2xl text-center font-bold text-primary">
            {t("checkEmail.title")}
          </h2>
          <p className="text-[#64748B] text-sm text-center mt-2">
            {t("checkEmail.subtitle")}
          </p>
          <p className="text-primary text-sm text-center font-semibold">
            sarah@avante.com
          </p>
        </div>

        <div>
          <button
            className={`w-full bg-[#22A699] hover:bg-[#1c8c82] font-bold text-white py-2 rounded-lg cursor-pointer`}
          >
            {t("checkEmail.openApp")}{" "}
          </button>
          <button
            className={`mt-2 w-full  text-gray-800 hover:text-gray-900 border border-primary border-2 py-2 rounded-lg cursor-pointer`}
          >
            {t("checkEmail.resend")}
          </button>
        </div>

        {/* Sign in link */}
        <div className="mt-6 text-center text-sm text-[#64748B]">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-[#64748B] text-sm hover:text-[#1F3C88] transition-colors"
          >
            <FiArrowLeft className="mr-1" size={16} />
            {t("checkEmail.back")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 my-4">
        © 2025 Avante Medical LMS · v2.1.0
      </p>
    </div>
  );
};

export default CheckEmail;
