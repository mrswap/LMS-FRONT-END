import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../../common/form/TextInput";
import SelectField from "../../../common/form/SelectField";
import FormButton from "../../../common/form/FormButton";

const CreateUser = () => {
  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
    region: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    region: Yup.object().required("Required"),
    role: Yup.object().required("Required"),
    password: Yup.string().min(6).required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const onSubmit = (values) => {
    console.log("🔥 User:", values);
  };

  return (
    <div>
      {/* 🔹 Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="text-[#6B7280] text-[14px]">Users </span>
        {" > "}
        <span className="text-[#090F31] text-[14px] font-semibold">
          Create New User
        </span>
      </p>

      {/* 🔹 Heading */}
      <h1 className="text-2xl font-[700] text-primary">Create New User</h1>
      <p className="text-[#29324C] text-[16px] mb-6">
        Onboard a new medical professional or staff member to the Avante
        platform.
      </p>

      {/* 🔹 Card */}
      <div className="bg-white rounded-lg  p-6 border border-gray-300 w-full">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {/* 🔹 Personal Info */}
              <div>
                <h2 className="text-[18px] text-[#090F31] font-[700] mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Full Name
                    </label>
                    <TextInput
                      name="fullName"
                      placeholder="Johnathan Doe"
                      className="border focus:border-none focus-within:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Email Address
                    </label>
                    <TextInput
                      name="email"
                      placeholder="john.doe@avantemedical.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Phone Number
                    </label>
                    <TextInput name="phone" placeholder="+1 (555) 000-0000" />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Region
                    </label>
                    <SelectField
                      name="region"
                      placeholder="Select a region"
                      options={[
                        { label: "India", value: "india" },
                        { label: "USA", value: "usa" },
                      ]}
                    />
                  </div>

                  {/* Role */}
                  <div className="md:col-span-1">
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Role
                    </label>
                    <SelectField
                      name="role"
                      placeholder="Practitioner"
                      options={[
                        { label: "Practitioner", value: "practitioner" },
                        { label: "Admin", value: "admin" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* 🔹 Password Section */}
              <div>
                <h2 className="text-[18px] text-[#090F31] font-[700] mb-3 block">
                  Create Password
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Password
                    </label>
                    <TextInput
                      name="password"
                      type="password"
                      placeholder="Create Password"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Confirm Password
                    </label>
                    <TextInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              </div>

              {/* 🔹 Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="px-5 py-2 rounded-md border border-[#184994] text-[#184994] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-md border text-white bg-accent cursor-pointer"
                >
                  Create User
                </button>

                {/* <FormButton text="Create User" loading={isSubmitting}  className="" /> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* 🔹 Bottom Footer */}
      <div className="text-center text-xs text-gray-400 mt-6 tracking-wide">
        SECURE REGISTRATION • GDPR COMPLIANT • HIPAA READY
      </div>
    </div>
  );
};

export default CreateUser;
