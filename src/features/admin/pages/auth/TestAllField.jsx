import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../common/form/TextInput";
import Checkbox from "../../common/form/Checkbox";
import RadioGroup from "../../common/form/RadioGroup";
import SelectField from "../../common/form/SelectField";
import FormButton from "../../common/form/FormButton";

const LoginTest = () => {
  const initialValues = {
    email: "",
    password: "",
    username: "",
    gender: "",
    country: "",
    skills: [],
    remember: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6).required("Required"),
    username: Yup.string().required("Username required"),
    gender: Yup.string().required("Select gender"),
    country: Yup.object().required("Select country"),
    remember: Yup.boolean(),
  });

  const onSubmit = (values) => {
    console.log("🔥 Form Data:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🔥 Form Testing Page
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <TextInput name="email" placeholder="Enter Email" />

              {/* Password */}
              <TextInput
                name="password"
                type="password"
                placeholder="Password"
              />

              {/* Username */}
              <TextInput name="username" placeholder="Username" />

              {/* Radio */}
              <RadioGroup
                name="gender"
                label="Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />

              {/* React Select */}
              <SelectField
                name="country"
                options={[
                  { label: "India", value: "india" },
                  { label: "USA", value: "usa" },
                ]}
                placeholder="Select Country"
              />

              {/* Multi Select */}
              <SelectField
                name="skills"
                isMulti
                options={[
                  { label: "React", value: "react" },
                  { label: "Node", value: "node" },
                  { label: "MongoDB", value: "mongo" },
                ]}
                placeholder="Select Skills"
              />

              {/* Checkbox */}
              <Checkbox name="remember" label="Remember me" />

              {/* Submit */}
              <FormButton text="Submit Test Form" loading={isSubmitting} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginTest;
