import { Field, ErrorMessage } from "formik";

const RadioGroup = ({ label, name, options = [], isFormik = true }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1">{label}</label>}

      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1">
            {isFormik ? (
              <Field type="radio" name={name} value={opt.value} />
            ) : (
              <input type="radio" name={name} value={opt.value} />
            )}
            {opt.label}
          </label>
        ))}
      </div>

      {isFormik && (
        <ErrorMessage
          name={name}
          component="div"
          className="text-red-500 text-sm"
        />
      )}
    </div>
  );
};

export default RadioGroup;
