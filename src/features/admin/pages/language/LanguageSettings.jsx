import { useState, useEffect } from "react";
import CustomeTable from "../../common/table/CustomeTable";
import { FiSearch } from "react-icons/fi";
import i18n from "../../../../i18n/index";
import { useTranslation } from "react-i18next";

const initialLanguages = [
  { id: "LANG001", name: "ENGLISH", status: "Active" },
  { id: "LANG002", name: "HINDI", status: "Inactive" },
  { id: "LANG003", name: "PUNJABI", status: "Inactive" },
];

const StatusBadge = ({ status }) => {
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
      {status}
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

  // ✅ Load from localStorage
  const [languages, setLanguages] = useState(() => {
    const saved = localStorage.getItem("languages");
    return saved ? JSON.parse(saved) : initialLanguages;
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  //  Save to localStorage whenever changes
  useEffect(() => {
    localStorage.setItem("languages", JSON.stringify(languages));
  }, [languages]);

  // ── Filter ──
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

          //  change app language
          i18n.changeLanguage(langCode);

          //  save in localStorage
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

    setShowModal(false);
  };
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

        {/* <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 shadow-sm rounded-lg bg-white text-sm font-semibold text-gray-700">
            {t("language.exportTranslation")}
          </button>

          <button className="px-4 py-2 bg-accent text-white rounded-[8px] text-sm font-semibold">
            {t("language.addLanguage")}
          </button>
        </div> */}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-300 rounded-2xl p-3 flex items-center gap-3 mb-4">
        {/* SEARCH */}
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
            render: (val) => <StatusBadge status={val} />,
          },
          {
            key: "actions",
            label: t("language.colums.actions"),
            render: (_, row) => (
              <div className="flex gap-2 justify-center">
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-800">
                  <EyeIcon />
                </button>

                <button
                  onClick={() => toggleStatus(row.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500"
                >
                  <CheckIcon />
                </button>
              </div>
            ),
          },
        ]}
        data={filtered}
        emptyText="No languages found."
      />
    </div>
  );
}
