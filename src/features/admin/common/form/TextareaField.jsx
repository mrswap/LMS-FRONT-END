import { Field, ErrorMessage } from "formik";

const TextareaField = ({
  label,
  name,
  rows = 4,
  placeholder = "",
  className = "",
  required = false,
  ...props
}) => {
  const baseTextareaClass = `w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`;

  return (
    <div className="mb-3 sm:mb-4">
      {label && (
        <label className="block mb-1 sm:mb-1.5 text-[#29324C] font-medium text-xs sm:text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Field name={name}>
        {({ field, meta }) => (
          <>
            <textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              className={baseTextareaClass}
              {...props}
            />
            {meta.touched && meta.error && (
              <div className="text-red-500 text-xs sm:text-sm mt-1">
                {meta.error}
              </div>
            )}
          </>
        )}
      </Field>
    </div>
  );
};

export default TextareaField;
