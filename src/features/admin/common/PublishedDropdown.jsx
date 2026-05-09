import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiCheck,
  FiChevronDown,
  FiAlertCircle,
  FiX,
  FiGlobe,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const PublishedDropdown = ({ value, onToggle }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const statusOptions = [
    {
      value: "draft",
      label: t("publishedDropdown.status.draft"),
      icon: <FiAlertCircle size={16} />,
    },
    {
      value: "unpublished",
      label: t("publishedDropdown.status.unpublished"),
      icon: <FiX size={16} />,
    },
    {
      value: "published",
      label: t("publishedDropdown.status.published"),
      icon: <FiGlobe size={16} />,
    },
  ];

  const currentStatus =
    statusOptions.find((opt) => opt.value === value) || statusOptions[0];

  const handleStatusChange = async (newStatus) => {
    if (newStatus.value === value || isUpdating) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    setIsOpen(false);

    try {
      await onToggle(newStatus.value);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const toggleDropdown = () => {
    if (!isUpdating) {
      if (!isOpen) {
        updateDropdownPosition();
      }
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Button styles
  const getButtonStyles = () => {
    switch (value) {
      case "published":
        return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100";
      case "draft":
        return "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100";
      case "unpublished":
        return "bg-red-50 border-red-200 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
    }
  };

  // Icon color
  const getIconColor = () => {
    switch (value) {
      case "published":
        return "text-green-600";
      case "draft":
        return "text-yellow-600";
      case "unpublished":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Get styles for each option based on its type
  const getOptionStyles = (optionValue, isSelected) => {
    const baseStyles = {
      published: {
        bg: "bg-green-50",
        hoverBg: "hover:bg-green-100",
        text: "text-green-700",
        icon: "text-green-600",
        selectedBg: "bg-green-100",
        border: "border-green-200",
      },
      draft: {
        bg: "bg-yellow-50",
        hoverBg: "hover:bg-yellow-100",
        text: "text-yellow-700",
        icon: "text-yellow-600",
        selectedBg: "bg-yellow-100",
        border: "border-yellow-200",
      },
      unpublished: {
        bg: "bg-red-50",
        hoverBg: "hover:bg-red-100",
        text: "text-red-700",
        icon: "text-red-600",
        selectedBg: "bg-red-100",
        border: "border-red-200",
      },
    };

    const styles = baseStyles[optionValue] || baseStyles.published;

    if (isSelected) {
      return {
        containerClass: `${styles.selectedBg} ${styles.text}`,
        iconClass: styles.icon,
        textClass: `font-medium ${styles.text}`,
        checkClass: styles.icon,
        hoverClass: styles.hoverBg,
      };
    }

    return {
      containerClass: `bg-white ${styles.hoverBg}`,
      iconClass: `text-gray-400 group-hover:${styles.icon}`,
      textClass: `text-gray-600 group-hover:${styles.text}`,
      checkClass: styles.icon,
      hoverClass: styles.hoverBg,
    };
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        disabled={isUpdating}
        className={`
          relative inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg
          text-sm font-medium transition-all duration-200 border
          ${getButtonStyles()}
          ${isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className="flex items-center gap-2">
          <span className={getIconColor()}>{currentStatus.icon}</span>
          <span>{currentStatus.label}</span>
        </div>

        {isUpdating ? (
          <div className="relative">
            <div
              className={`w-4 h-4 border-2 rounded-full animate-spin ${
                value === "published"
                  ? "border-green-600 border-t-transparent"
                  : value === "draft"
                    ? "border-yellow-600 border-t-transparent"
                    : "border-red-600 border-t-transparent"
              }`}
            ></div>
          </div>
        ) : (
          <FiChevronDown
            className={`${getIconColor()} text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        !isUpdating &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              minWidth: "160px",
            }}
          >
            {statusOptions.map((option) => {
              const isSelected = value === option.value;
              const styles = getOptionStyles(option.value, isSelected);

              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option)}
                  className={`
                    group w-full px-3 py-2.5 flex items-center justify-between gap-2
                    text-sm transition-all duration-200 text-left
                    ${styles.containerClass}
                    ${styles.hoverClass}
                    ${isSelected ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`transition-all duration-200 ${styles.iconClass}`}
                    >
                      {option.icon}
                    </span>
                    <span
                      className={`transition-all duration-200 ${styles.textClass}`}
                    >
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <FiCheck
                      className={`${styles.checkClass} text-sm font-bold transition-all duration-200`}
                    />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default PublishedDropdown;
