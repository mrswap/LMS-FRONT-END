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
}) => {
  const baseInputClass = `${className} w-full px-2 sm:px-3 py-1.5 sm:py-2
   border border-gray-300 focus:border-none
   focus-within:outline-none focus:ring-1 focus:ring-blue-500
    rounded-md text-xs sm:text-sm transition-all duration-200 `;

  // const baseInputClass = `w-full py-2 pr-2 border border-gray-300 focus:outline-none
  //  focus:ring-1 focus:ring-blue-500 rounded-md text-sm transition-all duration-200`;

  return (
    <div className="mb-3 sm:mb-4">
      {label && (
        <label className="block mb-1 sm:mb-1.5 text-[#29324C] font-medium text-xs sm:text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}{" "}
          {/* 👈 same logic */}
        </label>
      )}

      {isFormik ? (
        <>
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${baseInputClass}`}
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
        />
      )}
    </div>
  );
};

export default TextInput;
