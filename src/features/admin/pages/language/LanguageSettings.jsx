import { useState, useEffect } from "react";
import CustomeTable from "../../common/table/CustomeTable";
import { FiSearch } from "react-icons/fi";
import i18n from "../../../../i18n/index";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../hooks/usePermission";

const initialLanguages = [
  { id: "LANG001", name: "ENGLISH", status: "Active" },
  { id: "LANG002", name: "HINDI", status: "Inactive" },
  { id: "LANG003", name: "PUNJABI", status: "Inactive" },
];

const StatusBadge = ({ status, t }) => {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
      ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {isActive ? t("language.active") : t("language.inactive")}
    </span>
  );
};

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <ellipse cx="10" cy="10" rx="8" ry="5" stroke="#fff" strokeWidth="1.6" />
    <circle cx="10" cy="10" r="2.5" fill="#fff" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path
      d="M4 10l5 5 7-8"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LanguageManagement() {
  const { t } = useTranslation();
  const { hasPermission } = usePermission();

  const [languages, setLanguages] = useState(() => {
    const saved = localStorage.getItem("languages");
    return saved ? JSON.parse(saved) : initialLanguages;
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newLang, setNewLang] = useState({
    id: "",
    name: "",
    status: "Inactive",
  });

  useEffect(() => {
    localStorage.setItem("languages", JSON.stringify(languages));
  }, [languages]);

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = (id) => {
    setLanguages((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const langCode =
            l.name === "ENGLISH"
              ? "en"
              : l.name === "HINDI"
                ? "hi"
                : l.name === "PUNJABI"
                  ? "pa"
                  : "en";

          i18n.changeLanguage(langCode);
          localStorage.setItem("appLanguage", langCode);

          return { ...l, status: "Active" };
        } else {
          return { ...l, status: "Inactive" };
        }
      }),
    );
  };

  const handleAdd = () => {
    if (!newLang.id.trim() || !newLang.name.trim()) return;

    setLanguages((prev) => {
      let updated = [...prev];

      if (newLang.status === "Active") {
        updated = updated.map((l) => ({ ...l, status: "Inactive" }));

        const langCode =
          newLang.name.toUpperCase() === "ENGLISH"
            ? "en"
            : newLang.name.toUpperCase() === "HINDI"
              ? "hi"
              : newLang.name.toUpperCase() === "PUNJABI"
                ? "pa"
                : "en";

        i18n.changeLanguage(langCode);
        localStorage.setItem("appLanguage", langCode);
      }

      return [...updated, { ...newLang, name: newLang.name.toUpperCase() }];
    });

    setNewLang({ id: "", name: "", status: "Inactive" });
    setShowModal(false);
  };

  if (!hasPermission("languages.view")) {
    return null;
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">
            {t("language.title")}
          </h1>
          <p className="text-sm text-[#29324C] font-[500] mt-1 max-w-md">
            {t("language.desc")}
          </p>
        </div>

        {/* ========== COMMENTED CODE - FUTURE USE ==========
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 shadow-sm rounded-lg bg-white text-sm font-semibold text-gray-700">
            {t("language.exportTranslation")}
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-accent text-white rounded-[8px] text-sm font-semibold cursor-pointer"
          >
            {t("language.addLanguage")}
          </button>
        </div>
        ========== END COMMENTED CODE ========== */}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-300 rounded-2xl p-3 flex items-center gap-3 mb-4">
        <div className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-gray-400 rounded-xl px-3 py-2 w-full">
          <FiSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("language.searchPlaceholder")}
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Table */}
      <CustomeTable
        columns={[
          { key: "id", label: t("language.colums.langId") },
          { key: "name", label: t("language.colums.langName") },
          {
            key: "status",
            label: t("language.colums.status"),
            render: (val, row) => <StatusBadge status={val} t={t} />,
          },
          {
            key: "actions",
            label: t("language.colums.actions"),
            render: (_, row) => (
              <div className="flex gap-2 justify-center">
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-800 cursor-pointer">
                  <EyeIcon />
                </button>
                <button
                  onClick={() => toggleStatus(row.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 cursor-pointer"
                >
                  <CheckIcon />
                </button>
              </div>
            ),
          },
        ]}
        data={filtered}
        emptyText={t("language.colums.noData")}
      />

      {/* ========== COMMENTED CODE - ADD MODAL (FUTURE USE) ==========
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{t("language.addLanguage")}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("language.langIdPlaceholder")}
                value={newLang.id}
                onChange={(e) => setNewLang({ ...newLang, id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                placeholder={t("language.langNamePlaceholder")}
                value={newLang.name}
                onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                value={newLang.status}
                onChange={(e) => setNewLang({ ...newLang, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Active">{t("language.active")}</option>
                <option value="Inactive">{t("language.inactive")}</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {t("language.cancel")}
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-accent text-white rounded-lg"
              >
                {t("language.add")}
              </button>
            </div>
          </div>
        </div>
      )}
      ========== END COMMENTED CODE ========== */}
    </div>
  );
}
