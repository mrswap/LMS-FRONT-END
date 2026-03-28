import { useState, useEffect } from "react";
import CustomeTable from "../../common/table/CustomeTable";
import { FiSearch } from "react-icons/fi";
import i18n from "../../../../i18n/index";

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
  // ✅ Load from localStorage
  const [languages, setLanguages] = useState(() => {
    const saved = localStorage.getItem("languages");
    return saved ? JSON.parse(saved) : initialLanguages;
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newLang, setNewLang] = useState({
    id: "",
    name: "",
    status: "Active",
  });

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

    setNewLang({ id: "", name: "", status: "Active" });
    setShowModal(false);
  };
  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Language Management
          </h1>
          <p className="text-sm text-[#29324C] font-[500] mt-1 max-w-md">
            Manage system languages and translations for the platform interface
            and learning content.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 shadow-sm rounded-lg bg-white text-sm font-semibold text-gray-700">
            Export Translation
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-accent text-white rounded-[8px] text-sm font-semibold"
          >
            + Add Language
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-300 rounded-2xl p-3 flex items-center gap-3 mb-4">
        {/* SEARCH */}
        <div className="flex items-center bg-[#F8FAFC] border border-gray-300 hover:border-gray-400 rounded-xl px-3 py-2 w-full">
          <FiSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Language"
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>
      </div>

      {/* Table */}
      <CustomeTable
        columns={[
          { key: "id", label: "LANGUAGE ID" },
          { key: "name", label: "LANGUAGE NAME" },
          {
            key: "status",
            label: "STATUS",
            render: (val) => <StatusBadge status={val} />,
          },
          {
            key: "actions",
            label: "ACTIONS",
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

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-96"
          >
            <h2 className="text-lg font-bold mb-4">Add Language</h2>

            <input
              placeholder="Language ID"
              value={newLang.id}
              onChange={(e) =>
                setNewLang((p) => ({ ...p, id: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <input
              placeholder="Language Name"
              value={newLang.name}
              onChange={(e) =>
                setNewLang((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <select
              value={newLang.status}
              onChange={(e) =>
                setNewLang((p) => ({ ...p, status: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="flex-1 bg-green-500 text-white rounded-lg py-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
