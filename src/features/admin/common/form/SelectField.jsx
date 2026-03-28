import Select from "react-select";
import { Field, ErrorMessage } from "formik";

const SelectField = ({ name, options, ...props }) => {
  return (
    <div className="mb-4">
      <Field name={name}>
        {({ field, form }) => (
          <Select
            options={options}
            value={field.value}
            onChange={(option) => form.setFieldValue(name, option)}
            {...props}
          />
        )}
      </Field>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default SelectField;
