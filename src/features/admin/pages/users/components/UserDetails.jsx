// import React from "react";

// const UserDetails = () => {
//   return (
//     <div className="min-h-screen bg-[#F5F7FB] p-6">
//       {/* 🔹 Breadcrumb */}
//       <p className="text-sm text-gray-500 mb-4">
//         Users &gt; <span className="text-gray-700">View User Profile</span>
//       </p>

//       {/* 🔹 Top Card */}
//       <div className="bg-white border rounded-xl p-6 shadow-sm">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               🌿
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold">Johnathan</h2>
//               <p className="text-sm text-gray-500">
//                 ID: 0986-9842 • Medical Instructor
//               </p>
//             </div>
//           </div>

//           <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">
//             Account Status: Active
//           </span>
//         </div>

//         {/* 🔹 Details Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal Details */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Personal Details
//             </h3>

//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs text-gray-500">Full Name</label>
//                 <div className="bg-gray-100 p-2 rounded">Johnathan Doe</div>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-500">Email Address</label>
//                 <div className="bg-gray-100 p-2 rounded">
//                   j.doe@avantemedical.com
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-500">Phone Number</label>
//                 <div className="bg-gray-100 p-2 rounded">+1 (555) 012-3456</div>
//               </div>
//             </div>
//           </div>

//           {/* Professional Details */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">
//               Professional Details
//             </h3>

//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs text-gray-500">Role</label>
//                 <div className="bg-gray-100 p-2 rounded">Practitioner</div>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-500">Region</label>
//                 <div className="bg-gray-100 p-2 rounded">Select a region</div>
//               </div>

//               <div>
//                 <label className="text-xs text-gray-500">
//                   Assigned Curriculum
//                 </label>
//                 <div className="flex gap-2 mt-1">
//                   <span className="text-xs bg-gray-200 px-2 py-1 rounded">
//                     ACLS
//                   </span>
//                   <span className="text-xs bg-gray-200 px-2 py-1 rounded">
//                     Trauma Care
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bio */}
//         <div className="mt-6">
//           <label className="text-xs text-gray-500">Brief Biography</label>
//           <div className="bg-gray-100 p-3 rounded mt-1 text-sm">
//             Lead instructor for Advanced Cardiac Life Support with over 12 years
//             of experience in emergency response training.
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button className="px-4 py-2 border border-red-400 text-red-500 rounded-md text-sm">
//             Delete User
//           </button>
//           <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
//             Edit User
//           </button>
//         </div>
//       </div>

//       {/* 🔹 Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//         <div className="bg-white p-4 rounded-lg border text-sm">
//           <p className="text-gray-500">Last Login</p>
//           <p className="font-semibold">2 hours ago</p>
//         </div>

//         <div className="bg-white p-4 rounded-lg border text-sm">
//           <p className="text-gray-500">Courses Completed</p>
//           <p className="font-semibold">24 Courses</p>
//         </div>

//         <div className="bg-white p-4 rounded-lg border text-sm">
//           <p className="text-gray-500">Completion Rate</p>
//           <p className="font-semibold">98% Perfect</p>
//         </div>
//       </div>

//       {/* 🔹 Training Programs */}
//       <div className="bg-white border rounded-xl p-6 mt-6">
//         <div className="flex justify-between mb-4">
//           <h3 className="text-sm font-semibold text-gray-700">
//             Current Training Programs
//           </h3>
//           <span className="text-xs text-blue-600 cursor-pointer">View All</span>
//         </div>

//         {/* Item */}
//         <div className="mb-4">
//           <p className="text-sm font-medium">
//             Advanced Cardiac Life Support (ACLS)
//           </p>
//           <div className="w-full bg-gray-200 h-2 rounded mt-1">
//             <div className="bg-blue-600 h-2 rounded w-[85%]"></div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Progress: 85%</span>
//             <span>15/18 Modules</span>
//           </div>
//         </div>

//         <div className="mb-4">
//           <p className="text-sm font-medium">
//             Patient Data Privacy & HIPAA Compliance
//           </p>
//           <div className="w-full bg-gray-200 h-2 rounded mt-1">
//             <div className="bg-green-500 h-2 rounded w-[100%]"></div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Progress: 100%</span>
//             <span>Completed</span>
//           </div>
//         </div>

//         <div>
//           <p className="text-sm font-medium">
//             Introduction to Robotic Surgery Systems
//           </p>
//           <div className="w-full bg-gray-200 h-2 rounded mt-1">
//             <div className="bg-yellow-500 h-2 rounded w-[40%]"></div>
//           </div>
//           <div className="flex justify-between text-xs text-gray-500 mt-1">
//             <span>Progress: 40%</span>
//             <span>6/15 Modules</span>
//           </div>
//         </div>
//       </div>

//       {/* 🔹 Certificates Table */}
//       <div className="bg-white border rounded-xl p-6 mt-6">
//         <table className="w-full text-sm">
//           <thead className="text-gray-500 text-xs">
//             <tr className="text-left border-b">
//               <th className="py-2">Certificate</th>
//               <th>Issue Date</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr className="border-b">
//               <td className="py-2">Safety Training</td>
//               <td>10 Feb 2024</td>
//               <td className="text-green-600">Completed</td>
//               <td>👁</td>
//             </tr>

//             <tr>
//               <td className="py-2">Basic Training</td>
//               <td>15 Mar 2024</td>
//               <td className="text-green-600">Completed</td>
//               <td>👁</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserDetails;

import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../../common/form/TextInput";
import SelectField from "../../../common/form/SelectField";
import CustomeTable from "../../../common/table/CustomeTable";

const UserDetails = () => {
  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
    region: "",
    role: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    region: Yup.object().required("Required"),
    role: Yup.object().required("Required"),
  });

  const data = [
    {
      certificate: "Safety Training",
      issueDate: "10 Feb 2024",
      status: "Completed",
    },
    {
      certificate: "Basic Training",
      issueDate: "15 Mar 2024",
      status: "Completed",
    },
  ];

  const columns = [
    {
      header: "Certificate",
      accessor: "certificate",
    },
    {
      header: "Issue Date",
      accessor: "issueDate",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <span className="text-green-600">{row.status}</span>,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: () => <span>👁</span>,
    },
  ];

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
          View User Profile
        </span>
      </p>

      {/* 🔹 Card */}
      <div className="bg-white rounded-lg border border-gray-300 w-full">
        <div className="flex justify-between items-start p-6 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              🌿
            </div>
            <div>
              <h2 className="text-primary font-[700]">Johnathan</h2>
              <p className="text-[16px] text-[#29324C] font-[400]">
                ID: 0986-9842 • Medical Instructor
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 bg-[#D2EBDF7D] text-green-600 rounded-full">
            <span className="text-[#6B7280]"> Account Status:</span>{" "}
            <span className="text-[#02829A]">Active</span>
          </span>
        </div>

        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">
                {/* 🔹 Personal Info */}
                <div>
                  <h2 className="text-[18px] text-[#090F31] font-[700] ">
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

                {/* 🔹 Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-5 py-2 rounded-md border border-red-500 text-red-500 cursor-pointer"
                  >
                    Delete User
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md border text-white bg-accent cursor-pointer"
                  >
                    Edit User
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-300 text-sm">
          <p className="text-gray-500">Last Login</p>
          <p className="font-semibold">2 hours ago</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-300  text-sm">
          <p className="text-gray-500">Courses Completed</p>
          <p className="font-semibold">24 Courses</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-300  text-sm">
          <p className="text-gray-500">Completion Rate</p>
          <p className="font-semibold">98% Perfect</p>
        </div>
      </div>

      {/* 🔹 Training Programs */}
      <div className="bg-white border border-gray-300  rounded-xl p-6 mt-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Current Training Programs
          </h3>
          <span className="text-xs text-blue-600 cursor-pointer">View All</span>
        </div>

        {/* Item */}
        <div className="mb-4">
          <p className="text-sm font-medium">
            Advanced Cardiac Life Support (ACLS)
          </p>
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div className="bg-blue-600 h-2 rounded w-[85%]"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progress: 85%</span>
            <span>15/18 Modules</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium">
            Patient Data Privacy & HIPAA Compliance
          </p>
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div className="bg-green-500 h-2 rounded w-[100%]"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progress: 100%</span>
            <span>Completed</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">
            Introduction to Robotic Surgery Systems
          </p>
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div className="bg-yellow-500 h-2 rounded w-[40%]"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progress: 40%</span>
            <span>6/15 Modules</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden mt-4">
        <CustomeTable columns={columns} data={data} itemsPerPage={5} />
      </div>
    </div>
  );
};

export default UserDetails;
