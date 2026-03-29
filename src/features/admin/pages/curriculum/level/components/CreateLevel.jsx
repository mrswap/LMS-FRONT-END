// import React from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";

// import TextInput from "../../../../common/form/TextInput";
// import Checkbox from "../../../../common/form/Checkbox";
// import RadioGroup from "../../../../common/form/RadioGroup";
// import SelectField from "../../../../common/form/SelectField";
// import FormButton from "../../../../common/form/FormButton";
// import { IoShieldCheckmarkOutline } from "react-icons/io5";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// const CreateLevel = () => {
//   const initialValues = {
//     fullName: "",
//     email: "",
//     role: "",
//     duration: "",
//     description: "",
//     prerequisites: [],
//   };

//   const validationSchema = Yup.object({
//     fullName: Yup.string().required("Required"),
//     email: Yup.string().email("Invalid email").required("Required"),
//     role: Yup.object().required("Required"),
//   });

//   const onSubmit = (values) => {
//     console.log(values);
//   };

//   return (
//     <>
//       <div className="bg-white w-full max-w-4xl p-8 rounded-lg border border-gray-300">
//         {/* 🔹 Heading */}
//         <h1 className="text-2xl font-[700] text-primary">Level Management</h1>
//         <p className="text-[#29324C] text-[16px] mb-6">
//           Manage and organize training levels to structure the learning journey
//           from foundational knowledge to advanced clinical expertise.
//         </p>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={onSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-8">
//               {/* 🔹 General Details */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                   <span className="text-[18px] text-primary font-[700] ">
//                     <AiOutlineExclamationCircle />
//                   </span>{" "}
//                   General Details
//                 </h3>

//                 {/* Region */}
//                 {/* <div>
//                   <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
//                     Region
//                   </label>
//                   <SelectField
//                     name="region"
//                     placeholder="Select a region"
//                     options={[
//                       { label: "India", value: "india" },
//                       { label: "USA", value: "usa" },
//                     ]}
//                   />
//                 </div> */}

//                 {/* Full Name */}
//                 <div className="mb-4">
//                   <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
//                     Level Name
//                   </label>
//                   <TextInput
//                     name="levelName"
//                     placeholder="Level 1 — Foundation: Device Introduction & Core Concepts"
//                   />
//                 </div>

//                 {/* parent Program + Duration */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
//                       Parent Program
//                     </label>
//                     <TextInput
//                       name="prentProgram"
//                       placeholder="Pacemaker Training Curriculum -Interactive Self-Paced Modules"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
//                       Estimated Duration
//                     </label>
//                     <TextInput name="duration" placeholder="e.g. 12" />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="mt-4">
//                   <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     rows="4"
//                     placeholder="Write user description..."
//                     className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* 🔹 Requirements */}
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//                   <span className="text-blue-600">
//                     <IoShieldCheckmarkOutline />
//                   </span>{" "}
//                   Requirements & Prerequisites
//                 </h3>

//                 <p className="text-[14px] text-[#29324C] font-[600] mb-3">
//                   Select prerequisites
//                 </p>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
//                     <Checkbox name="prerequisites" value="level1" />
//                     <div>
//                       <p className="text-[14px] text-[#29324C] font-[600]">
//                         Basic Level
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         Introductory Level
//                       </p>
//                     </div>
//                   </div>

//                   <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
//                     <Checkbox name="prerequisites" value="compliance" />
//                     <div>
//                       <p className="text-[14px] text-[#29324C] font-[600]">
//                         Core Compliance
//                       </p>
//                       <p className="text-xs text-gray-400">Required basics</p>
//                     </div>
//                   </div>

//                   <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
//                     <Checkbox name="prerequisites" value="softskills" />
//                     <div>
//                       <p className="text-[14px] text-[#29324C] font-[600]">
//                         Soft Skills
//                       </p>
//                       <p className="text-xs text-gray-400">Communication</p>
//                     </div>
//                   </div>

//                   <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
//                     <Checkbox name="prerequisites" value="ops" />
//                     <div>
//                       <p className="text-[14px] text-[#29324C] font-[600]">
//                         Operational
//                       </p>
//                       <p className="text-xs text-gray-400">Field work</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end">
//                   <button type="button" className="text-blue-600 text-sm  mt-3">
//                     + Add Custom Prerequisite
//                   </button>
//                 </div>
//               </div>

//               {/* 🔹 Preview Card */}
//               <div className="border border-gray-300 bg-[#F8FAFC] p-4 rounded-lg flex items-center gap-4">
//                 <div className="w-12 h-12 bg-blue-200 rounded-md"></div>
//                 <div>
//                   <p className="text-sm font-semibold">User Preview</p>
//                   <p className="text-xs text-gray-500">
//                     This user will be visible after creation.
//                   </p>
//                 </div>
//               </div>

//               {/* 🔹 Footer */}
//               <div className="flex justify-end items-center pt-4">
//                 {/* <p className="text-xs text-gray-400">Auto-saved at 2:45 PM</p> */}

//                 <div className="flex gap-3">
//                   <button
//                     type="button"
//                     className="px-4 py-2 border border-[#184994] rounded-md text-sm text-[#184994]"
//                   >
//                     Save as Draft
//                   </button>

//                   <button
//                     type="button"
//                     className="px-4 py-2  rounded-md text-sm text-white bg-accent"
//                   >
//                     Save & Continue
//                   </button>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </>
//   );
// };

// export default CreateLevel;

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import TextInput from "../../../../common/form/TextInput";
import Checkbox from "../../../../common/form/Checkbox";
import RadioGroup from "../../../../common/form/RadioGroup";
import SelectField from "../../../../common/form/SelectField";
import FormButton from "../../../../common/form/FormButton";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
const CreateLevel = () => {
  const initialValues = {
    fullName: "",
    email: "",
    role: "",
    duration: "",
    description: "",
    prerequisites: [],
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    role: Yup.object().required("Required"),
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="bg-white w-full max-w-4xl p-8 rounded-lg border border-gray-300">
        {/* 🔹 Heading */}
        <h1 className="text-2xl font-[700] text-primary">Level Management</h1>
        <p className="text-[#29324C] text-[16px] mb-6">
          Manage and organize training levels to structure the learning journey
          from foundational knowledge to advanced clinical expertise.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-8">
              {/* 🔹 General Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-[18px] text-primary font-[700] ">
                    <AiOutlineExclamationCircle />
                  </span>{" "}
                  General Details
                </h3>

                {/* Region */}
                {/* <div>
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
                </div> */}

                {/* Full Name */}
                <div className="mb-4">
                  <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                    Level Name
                  </label>
                  <TextInput
                    name="levelName"
                    placeholder="Level 1 — Foundation: Device Introduction & Core Concepts"
                  />
                </div>

                {/* parent Program + Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Parent Program
                    </label>
                    <TextInput
                      name="prentProgram"
                      placeholder="Pacemaker Training Curriculum -Interactive Self-Paced Modules"
                    />
                  </div>

                  <div>
                    <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                      Estimated Duration
                    </label>
                    <TextInput name="duration" placeholder="e.g. 12" />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label className="text-[14px] text-[#29324C] font-[600] mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Write user description..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:border-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 🔹 Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">
                    <IoShieldCheckmarkOutline />
                  </span>{" "}
                  Requirements & Prerequisites
                </h3>

                <p className="text-[14px] text-[#29324C] font-[600] mb-3">
                  Select prerequisites
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
                    <Checkbox name="prerequisites" value="level1" />
                    <div>
                      <p className="text-[14px] text-[#29324C] font-[600]">
                        Basic Level
                      </p>
                      <p className="text-xs text-gray-400">
                        Introductory Level
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
                    <Checkbox name="prerequisites" value="compliance" />
                    <div>
                      <p className="text-[14px] text-[#29324C] font-[600]">
                        Core Compliance
                      </p>
                      <p className="text-xs text-gray-400">Required basics</p>
                    </div>
                  </div>

                  <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
                    <Checkbox name="prerequisites" value="softskills" />
                    <div>
                      <p className="text-[14px] text-[#29324C] font-[600]">
                        Soft Skills
                      </p>
                      <p className="text-xs text-gray-400">Communication</p>
                    </div>
                  </div>

                  <div className="border border-gray-300 bg-[#F8FAFC] rounded-lg p-3 flex items-start gap-2">
                    <Checkbox name="prerequisites" value="ops" />
                    <div>
                      <p className="text-[14px] text-[#29324C] font-[600]">
                        Operational
                      </p>
                      <p className="text-xs text-gray-400">Field work</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-blue-600 text-sm  mt-3">
                    + Add Custom Prerequisite
                  </button>
                </div>
              </div>

              {/* 🔹 Preview Card */}
              <div className="border border-gray-300 bg-[#F8FAFC] p-4 rounded-lg flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-200 rounded-md"></div>
                <div>
                  <p className="text-sm font-semibold">User Preview</p>
                  <p className="text-xs text-gray-500">
                    This user will be visible after creation.
                  </p>
                </div>
              </div>

              {/* 🔹 Footer */}
              <div className="flex justify-end items-center pt-4">
                {/* <p className="text-xs text-gray-400">Auto-saved at 2:45 PM</p> */}

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#184994] rounded-md text-sm text-[#184994]"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2  rounded-md text-sm text-white bg-accent"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default CreateLevel;
