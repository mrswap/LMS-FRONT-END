import { Field, ErrorMessage } from "formik";

const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  className = "",
  isFormik = true,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-[#29324C] font-medium">{label}</label>
      )}

      {isFormik ? (
        <>
          <Field
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 focus:border-none focus-within:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg ${className}`}
          />
          <ErrorMessage
            name={name}
            component="div"
            className="text-red-500 text-sm"
          />
        </>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg ${className}`}
        />
      )}
    </div>
  );
};

export default TextInput;
