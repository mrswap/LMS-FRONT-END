import Select from "react-select";
import { Field, ErrorMessage } from "formik";

const SelectField = ({
  name,
  label,
  options,
  placeholder = "Select...",
  required = false,
  disabled = false,
  ...props
}) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "32px",
      "@media (min-width: 640px)": {
        minHeight: "38px",
      },
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 0.4px #3B82F6" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0px 8px",
    }),
    input: (base) => ({
      ...base,
      margin: "0px",
      fontSize: "12px",
      "@media (min-width: 640px)": {
        fontSize: "14px",
      },
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "12px",
      "@media (min-width: 640px)": {
        fontSize: "14px",
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "12px",
      "@media (min-width: 640px)": {
        fontSize: "14px",
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "4px",
    }),
    ...props.styles,
  };

  return (
    <div className="mb-3 sm:mb-4">
      {label && (
        <label className="block mb-1 sm:mb-1.5 text-[#29324C] font-medium text-xs sm:text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Field name={name}>
        {({ field, form, meta }) => (
          <>
            <Select
              options={options}
              value={field.value}
              onChange={(option) => form.setFieldValue(name, option)}
              onBlur={() => form.setFieldTouched(name, true)}
              placeholder={placeholder}
              isDisabled={disabled}
              styles={customStyles}
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

export default SelectField;
