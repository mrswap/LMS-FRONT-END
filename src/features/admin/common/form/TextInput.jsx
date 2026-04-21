import { Field, ErrorMessage } from "formik";

const TextInput = ({
  label,
  name,
  type = "text",
  placeholder = "",
  className = "",
  isFormik = true,
  value,
  onChange,
  required = false,
  isDisabled = false,
}) => {
  const baseInputClass = `
    ${className} w-full px-2 sm:px-3 py-1.5 sm:py-2
    border rounded-md text-xs sm:text-sm
    transition-all duration-200
    ${
      isDisabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
        : "bg-white border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
    }
  `;

  return (
    <div className="mb-3 sm:mb-4">
      {label && (
        <label className="block mb-1 sm:mb-1.5 text-[#29324C] font-medium text-xs sm:text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}{" "}
        </label>
      )}

      {isFormik ? (
        <>
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${baseInputClass}`}
            disabled={isDisabled}
          />
          <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-xs sm:text-sm mt-0.5 sm:mt-1"
          />
        </>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={baseInputClass}
          disabled={isDisabled}
        />
      )}
    </div>
  );
};

export default TextInput;
