import { useState, useEffect, useRef, memo, useCallback } from "react";
import { FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";
import usePermission from "../../../../../../hooks/usePermission";
import CustomEditor from "../../../../common/CustomEditor";

// ─── Section Component ───────────────────────────────────────────────────────────
const Section = ({
  section,
  onUpdate,
  onRemove,
  t,
  hasBulkPermission,
  isOnlySection,
}) => {
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localMediaShortcut, setLocalMediaShortcut] = useState(
    section.media_shortcut || "",
  );
  const titleTimeoutRef = useRef(null);
  const mediaTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalTitle(section.title);
    setLocalMediaShortcut(section.media_shortcut || "");
  }, [section.title, section.media_shortcut]);

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setLocalTitle(newValue);
    clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, { title: newValue });
    }, 300);
  };

  const handleMediaShortcutChange = (e) => {
    const newValue = e.target.value;
    setLocalMediaShortcut(newValue);
    clearTimeout(mediaTimeoutRef.current);
    mediaTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, { media_shortcut: newValue });
    }, 300);
  };

  const handleTypeChange = (newType) => {
    if (newType === section.type) return;

    const updates = {
      type: newType,
      editorKey: `${section.id}-${newType}-${Date.now()}`,
    };

    if (newType === "text") {
      updates.media_shortcut = "";
      setLocalMediaShortcut("");
    }

    onUpdate(section.id, updates);
  };

  const handleContentChange = useCallback(
    (value) => onUpdate(section.id, { content: value }),
    [section.id, onUpdate],
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
      <div className="absolute top-2 left-2 text-xs text-gray-400">
        {t("learningUnitBuilder.details.content.order")}: {section.order}
      </div>

      {(hasBulkPermission || !isOnlySection) && (
        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
          title={t("learningUnitBuilder.details.content.removeSection")}
        >
          <FiTrash2 size={18} />
        </button>
      )}

      <div className="mb-4 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("learningUnitBuilder.details.content.type")}
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange("text")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              section.type === "text"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiType size={16} />
            {t("learningUnitBuilder.details.content.text")}
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              section.type === "media"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiImage size={16} />
            {t("learningUnitBuilder.details.content.media")}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("learningUnitBuilder.details.content.sectionTitle")}
        </label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder={t(
            "learningUnitBuilder.details.content.sectionTitlePlaceholder",
          )}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          maxLength={150}
        />
      </div>

      {section.type === "text" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("learningUnitBuilder.details.content.content")}
          </label>
          <CustomEditor
            key={section.editorKey || `${section.id}-text`}
            value={section.content}
            onChange={handleContentChange}
            placeholder={t(
              "learningUnitBuilder.details.content.editorPlaceholder",
            )}
          />
        </div>
      )}

      {section.type === "media" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.mediaShortcut")}
            </label>
            <input
              type="text"
              value={localMediaShortcut}
              onChange={handleMediaShortcutChange}
              placeholder={t(
                "learningUnitBuilder.details.content.mediaShortcutPlaceholder",
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              maxLength={250}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.description")}
            </label>
            <CustomEditor
              key={`${section.editorKey || section.id}-desc`}
              value={section.content}
              onChange={handleContentChange}
              placeholder={t(
                "learningUnitBuilder.details.content.editorPlaceholder",
              )}
            />
          </div>

          {section.media_shortcut && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p className="text-xs text-gray-500 mb-1">
                {t("learningUnitBuilder.details.content.preview")}:
              </p>
              {section.media_shortcut.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img
                  src={section.media_shortcut}
                  alt="Preview"
                  className="mt-1 max-h-32 object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : section.media_shortcut.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={section.media_shortcut}
                  controls
                  className="mt-1 max-h-32"
                />
              ) : (
                <p className="text-xs text-gray-600">
                  {t("learningUnitBuilder.details.content.media")}:{" "}
                  {section.media_shortcut}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── DynamicContentSection Component ───────────────────────────────────────────
const DynamicContentSection = ({
  sections = [],
  onSectionsChange,
  addButtonText = "Add New Section",
  t,
}) => {
  const [localSections, setLocalSections] = useState(sections);
  const updateTimeoutRef = useRef(null);
  const { hasPermission } = usePermission();

  const hasBulkPermission = hasPermission("content.bulk-create");

  useEffect(() => {
    if (sections.length === 0 && localSections.length === 0) {
      const defaultSection = {
        id: Date.now(),
        type: "text",
        title: "",
        content: "",
        media_shortcut: "",
        order: 1,
        editorKey: `default-${Date.now()}-text`,
      };
      setLocalSections([defaultSection]);
      onSectionsChange([defaultSection]);
    }
  }, []);

  useEffect(() => {
    if (sections.length > 0 && localSections.length === 0) {
      setLocalSections(sections);
    }
  }, [sections]);

  const updateParent = useCallback(
    (newSections) => {
      setLocalSections(newSections);
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        onSectionsChange(newSections);
      }, 500);
    },
    [onSectionsChange],
  );

  const addSection = useCallback(() => {
    if (!hasBulkPermission) return;

    const id = Date.now();
    const newSection = {
      id,
      type: "text",
      title: "",
      content: "",
      media_shortcut: "",
      order: localSections.length + 1,
      editorKey: `${id}-text-init`,
    };
    updateParent([...localSections, newSection]);
  }, [localSections, updateParent, hasBulkPermission]);

  const removeSection = useCallback(
    (id) => {
      if (!hasBulkPermission && localSections.length === 1) return;

      const updated = localSections
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, order: idx + 1 }));
      updateParent(updated);
    },
    [localSections, updateParent, hasBulkPermission],
  );

  const updateSection = useCallback(
    (id, updates) => {
      const updated = localSections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      );
      updateParent(updated);
    },
    [localSections, updateParent],
  );

  return (
    <div className="space-y-6">
      {localSections.map((section) => (
        <Section
          key={section.id}
          section={section}
          onUpdate={updateSection}
          onRemove={removeSection}
          t={t}
          hasBulkPermission={hasBulkPermission}
          isOnlySection={!hasBulkPermission && localSections.length === 1}
        />
      ))}

      {hasBulkPermission && (
        <button
          type="button"
          onClick={addSection}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <FiPlus size={18} />
          {addButtonText}
        </button>
      )}
    </div>
  );
};

export default DynamicContentSection;
