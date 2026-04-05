import { Field, ErrorMessage } from "formik";

const RadioGroup = ({
  label,
  name,
  options = [],
  isFormik = true,
  className = "",
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      {label && (
        <label className="block mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium text-[#29324C]">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            {isFormik ? (
              <Field
                type="radio"
                name={name}
                value={opt.value}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
            ) : (
              <input
                type="radio"
                name={name}
                value={opt.value}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
            )}
            <span className="text-xs sm:text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

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

export default RadioGroup;
