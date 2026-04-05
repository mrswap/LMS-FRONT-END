import { useState } from "react";

const StatusToggle = ({ value, onToggle }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await onToggle(!value);
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${value ? "bg-accent" : "bg-gray-300"}
          ${isUpdating ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${value ? "translate-x-6" : "translate-x-1"}
            ${isUpdating ? "scale-75" : ""}
          `}
        />
      </button>

      {isUpdating ? (
        <svg
          className="w-4 h-4 animate-spin text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <span
          className={`text-sm font-medium ${
            value ? "text-green-700" : "text-gray-500"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      )}
    </div>
  );
};

export default StatusToggle;
