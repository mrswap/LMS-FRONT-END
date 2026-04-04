import { Field, ErrorMessage } from "formik";

const Checkbox = ({
  label,
  name,
  className = "",
  isFormik = true,
  ...props
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
        {isFormik ? (
          <Field
            type="checkbox"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${className}`}
            name={name}
          />
        ) : (
          <input
            type="checkbox"
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${className}`}
            name={name}
            {...props}
          />
        )}
        <span className={`text-xs sm:text-sm ${className}`}>{label}</span>
      </label>

      {isFormik && (
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-xs sm:text-sm mt-1"
        />
      )}
    </div>
  );
};

export default Checkbox;
