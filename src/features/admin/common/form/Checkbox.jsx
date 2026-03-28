import { Field, ErrorMessage } from "formik";

const Checkbox = ({ label, name, className, isFormik = true, ...props }) => {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2">
        {isFormik ? (
          <Field type="checkbox" className={`${className}`} name={name} />
        ) : (
          <input
            type="checkbox"
            className={`${className}`}
            name={name}
            {...props}
          />
        )}
        <span className={`${className}`}> {label}</span>
      </label>

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

export default Checkbox;
