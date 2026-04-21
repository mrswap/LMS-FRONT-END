import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Memoized TextEditor component
const TextEditor = memo(({ value, onChange, id, isActive }) => {
  const { t } = useTranslation();
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: t("learningUnitBuilder.details.content.editorPlaceholder"),
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "clean"],
      ],
    },
  });

  const isFirstRender = useRef(true);
  const isUpdatingFromProps = useRef(false);

  // Handle text changes
  useEffect(() => {
    if (!quill) return;

    const handleTextChange = () => {
      if (isUpdatingFromProps.current) {
        isUpdatingFromProps.current = false;
        return;
      }

      const newValue = quill.root.innerHTML;
      onChange(newValue);
    };

    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill, onChange]);

  // Update editor when external value changes
  useEffect(() => {
    if (!quill) return;

    if (!isFirstRender.current && isActive) {
      const currentValue = quill.root.innerHTML;
      if (value !== currentValue) {
        isUpdatingFromProps.current = true;
        quill.root.innerHTML = value || "<p><br></p>";
      }
    }
    isFirstRender.current = false;
  }, [quill, value, isActive]);

  // Handle active state
  useEffect(() => {
    if (!quill) return;

    if (isActive) {
      quill.enable();
    } else {
      quill.disable();
    }
  }, [quill, isActive]);

  if (!isActive) return null;

  return (
    <div className="quill-wrapper" style={{ minHeight: "250px" }}>
      <div ref={quillRef} style={{ height: "200px" }} />
    </div>
  );
});

TextEditor.displayName = "TextEditor";

// Section component - Removed memo to avoid complex re-render issues
const Section = ({ section, onUpdate, onRemove }) => {
  const { t } = useTranslation();
  // Local state for immediate UI updates
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localMediaShortcut, setLocalMediaShortcut] = useState(
    section.media_shortcut || "",
  );
  const titleTimeoutRef = useRef(null);
  const mediaTimeoutRef = useRef(null);

  // Sync local state when section prop changes
  useEffect(() => {
    setLocalTitle(section.title);
    setLocalMediaShortcut(section.media_shortcut || "");
  }, [section.title, section.media_shortcut]);

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setLocalTitle(newValue);

    if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, "title", newValue);
    }, 300);
  };

  const handleMediaShortcutChange = (e) => {
    const newValue = e.target.value;
    setLocalMediaShortcut(newValue);

    if (mediaTimeoutRef.current) clearTimeout(mediaTimeoutRef.current);
    mediaTimeoutRef.current = setTimeout(() => {
      onUpdate(section.id, "media_shortcut", newValue);
    }, 300);
  };

  const handleTypeChange = (newType) => {
    onUpdate(section.id, "type", newType);
    if (newType === "text") {
      onUpdate(section.id, "media_shortcut", "");
      setLocalMediaShortcut("");
    }
  };

  const handleContentChange = useCallback(
    (value) => {
      onUpdate(section.id, "content", value);
    },
    [section.id, onUpdate],
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
      <div className="absolute top-2 left-2 text-xs text-gray-400">
        {t("learningUnitBuilder.details.content.order")}: {section.order}
      </div>

      <button
        type="button"
        onClick={() => onRemove(section.id)}
        className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
        title="Remove Section"
      >
        <FiTrash2 size={18} />
      </button>

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

      {/* Title Field - Using local state for smooth typing */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("learningUnitBuilder.details.content.sectionTitle")}
        </label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Enter section title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Conditional Fields */}
      {section.type === "text" ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("learningUnitBuilder.details.content.content")}
          </label>
          <TextEditor
            key={section.id} // Important: Unique key for each editor
            id={section.id}
            value={section.content}
            onChange={handleContentChange}
            isActive={section.type === "text"}
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.mediaShortcut")}
            </label>
            <input
              type="text"
              value={localMediaShortcut}
              onChange={handleMediaShortcutChange}
              placeholder="e.g., yt_123, /uploads/video.mp4, https://youtu.be/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("learningUnitBuilder.details.content.description")}
            </label>
            <TextEditor
              key={`${section.id}-desc`} // Unique key
              id={`${section.id}-desc`}
              value={section.content}
              onChange={handleContentChange}
              isActive={section.type === "media"}
            />
          </div>

          {section.media_shortcut && (
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
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

// Main Component
const DynamicContentSection = ({
  sections = [],
  onSectionsChange,
  addButtonText = "Add New Section",
}) => {
  const [localSections, setLocalSections] = useState(sections);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const updateParent = useCallback(
    (newSections) => {
      setLocalSections(newSections);

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        onSectionsChange(newSections);
      }, 500); // Increased debounce for better performance
    },
    [onSectionsChange],
  );

  const addSection = useCallback(() => {
    const newSection = {
      id: Date.now(),
      type: "text",
      title: "",
      content: "",
      media_shortcut: "",
      order: localSections.length + 1,
    };
    updateParent([...localSections, newSection]);
  }, [localSections, updateParent]);

  const removeSection = useCallback(
    (id) => {
      const updatedSections = localSections.filter((s) => s.id !== id);
      updatedSections.forEach((section, idx) => {
        section.order = idx + 1;
      });
      updateParent(updatedSections);
    },
    [localSections, updateParent],
  );

  const updateSection = useCallback(
    (id, field, value) => {
      const updatedSections = localSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section,
      );
      updateParent(updatedSections);
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
        />
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FiPlus size={18} />
        {addButtonText}
      </button>
    </div>
  );
};

export default DynamicContentSection;
