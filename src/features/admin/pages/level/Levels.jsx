// import { useState } from "react";
// import Select from "react-select";
// import { FiSearch } from "react-icons/fi";
// import CustomeTable from "../../common/table/CustomeTable";
// import { MdOutlineFilterAltOff } from "react-icons/md";
// import { Link, useNavigate } from "react-router-dom";

// const ITEMS_PER_PAGE = 5;

// const regionOptions = [
//   { value: "All", label: "Region: All" },
//   { value: "Asia", label: "Asia" },
//   { value: "Europe", label: "Europe" },
//   { value: "Africa", label: "Africa" },
//   { value: "North America", label: "North America" },
// ];

// const statusOptions = [
//   { value: "All", label: "Status: All" },
//   { value: "Active", label: "Active" },
//   { value: "Inactive", label: "Inactive" },
//   { value: "On Leave", label: "On Leave" },
// ];

// const Levels = () => {
//   const [search, setSearch] = useState("");
//   const [region, setRegion] = useState(regionOptions[0]);
//   const [status, setStatus] = useState(statusOptions[0]);

//   const navigate = useNavigate();

//   const users = [
//     {
//       id: "AV-9042",
//       name: "Sarah Anderson",
//       email: "s.anderson@medmail.com",
//       phone: "+1 555 012",
//       region: "North America",
//       programs: 4,
//       progress: 82,
//       status: "Active",
//     },
//     {
//       id: "AV-8731",
//       name: "James Wilson",
//       email: "j.wilson@healthcare.org",
//       phone: "+44 20 7946",
//       region: "Europe",
//       programs: 2,
//       progress: 45,
//       status: "On Leave",
//     },
//     {
//       id: "AV-7421",
//       name: "Priya Sharma",
//       email: "p.sharma@clinicnet.in",
//       phone: "+91 98001234",
//       region: "Asia",
//       programs: 3,
//       progress: 67,
//       status: "Active",
//     },

//     // 🔥 Auto Generated Users
//     ...Array.from({ length: 57 }, (_, i) => {
//       const names = [
//         "Amit Verma",
//         "Rohit Singh",
//         "Neha Gupta",
//         "Karan Mehta",
//         "Anjali Patel",
//         "Vikas Yadav",
//         "Sneha Kapoor",
//         "Rahul Jain",
//         "Pooja Sharma",
//         "Arjun Reddy",
//       ];

//       const regions = [
//         "Asia",
//         "Europe",
//         "Africa",
//         "North America",
//         "Middle East",
//       ];
//       const statuses = ["Active", "Inactive", "On Leave"];

//       const name = names[i % names.length];
//       const idNum = 1000 + i;

//       return {
//         id: `AV-${idNum}`,
//         name,
//         email: `${name.toLowerCase().replace(/ /g, ".")}@demo.com`,
//         phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
//         region: regions[i % regions.length],
//         programs: Math.floor(Math.random() * 5) + 1,
//         progress: Math.floor(Math.random() * 100),
//         status: statuses[i % statuses.length],
//       };
//     }),
//   ];

//   //  FILTER LOGIC
//   const filtered = users.filter((u) => {
//     const matchSearch =
//       u.name.toLowerCase().includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase()) ||
//       u.id.toLowerCase().includes(search.toLowerCase());

//     const matchRegion = region.value === "All" || u.region === region.value;

//     const matchStatus = status.value === "All" || u.status === status.value;

//     return matchSearch && matchRegion && matchStatus;
//   });

//   //  RESET
//   const resetFilters = () => {
//     setSearch("");
//     setRegion(regionOptions[0]);
//     setStatus(statusOptions[0]);
//   };

//   //  CUSTOM STYLES (react-select)
//   const customSelectStyles = {
//     control: (base) => ({
//       ...base,
//       borderRadius: "8px",
//       borderColor: "#E5E7EB",
//       minHeight: "38px",
//       boxShadow: "none",
//       cursor: "pointer",
//       fontSize: "14px",
//       backgroundColor: "#f3f4f6",
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "#2563EB"
//         : state.isFocused
//           ? "#EFF6FF"
//           : "#fff",
//       color: state.isSelected ? "#fff" : "#111",
//       fontSize: "14px",
//     }),
//     menu: (base) => ({
//       ...base,
//       borderRadius: "12px",
//       overflow: "hidden",
//     }),
//   };

//   const columns = [
//     { header: "User ID", accessor: "id" },
//     {
//       header: "Name",
//       render: (row) => (
//         <p
//           className="font-semibold text-gray-800 cursor-pointer"
//           onClick={() => {
//             console.log("clicked");
//             navigate("user-details");
//           }}
//         >
//           {row.name}
//         </p>
//       ),
//     },
//     {
//       header: "Contact",
//       render: (row) => (
//         <div>
//           <p className="text-sm">{row.email}</p>
//           <p className="text-xs text-gray-400">{row.phone}</p>
//         </div>
//       ),
//     },
//     { header: "Region", accessor: "region" },
//     {
//       header: "Programs",
//       render: (row) => (
//         <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
//           {row.programs} Active
//         </span>
//       ),
//     },
//     {
//       header: "Progress",
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <div className="w-20 h-2 bg-gray-200 rounded-full">
//             <div
//               className="h-full bg-blue-500 rounded-full"
//               style={{ width: `${row.progress}%` }}
//             />
//           </div>
//           <span className="text-xs font-semibold">{row.progress}%</span>
//         </div>
//       ),
//     },
//     {
//       header: "Status",
//       render: (row) => {
//         const styles = {
//           Active: "bg-green-100 text-green-800",
//           "On Leave": "bg-yellow-100 text-yellow-800",
//           Inactive: "bg-red-100 text-red-800",
//         };

//         return (
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[row.status]}`}
//           >
//             {row.status}
//           </span>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       {/* HEADER */}
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h1 className="text-primary text-[28px] font-[700]">
//             Level Management
//           </h1>
//           <p className="text-[16px] text-[#29324C] font-[500] mt-1">
//             Manage and organize training levels to structure the learning
//             journey from foundational knowledge to advanced clinical expertise.
//           </p>
//         </div>

//         <Link
//           to="create-user"
//           className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
//         >
//           + Add New Level
//         </Link>
//       </div>

//       {/*  FILTER BAR */}
//       <div className="bobg-white rder border-gray-300 rounded-2xl p-3 flex items-center gap-3 border border-gray-300 ">
//         {/* SEARCH */}
//         <div className="flex items-center bg-[#F8FAFC]  border border-gray-300 hover:border-blue-500  focus:border-blue-500 rounded-xl px-3 py-2 w-[480px]">
//           <FiSearch className="text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, email, ID or phone..."
//             className="bg-transparent outline-none px-2 text-sm w-full "
//           />
//         </div>

//         {/* REGION */}
//         <div className="w-[180px]">
//           <Select
//             value={region}
//             onChange={setRegion}
//             options={regionOptions}
//             styles={customSelectStyles}
//             isSearchable={false}
//           />
//         </div>

//         {/* STATUS */}
//         <div className="w-[180px]">
//           <Select
//             value={status}
//             onChange={setStatus}
//             options={statusOptions}
//             styles={customSelectStyles}
//             isSearchable={false}
//           />
//         </div>

//         {/* RESET */}
//         <div className="flex items-center gap-1 ml-auto cursor-pointer group">
//           <span>
//             <MdOutlineFilterAltOff
//               className="text-[#64748B] group-hover:text-[#334155] transition duration-200 cursor-pointer"
//               size={18}
//             />
//           </span>

//           <button
//             onClick={resetFilters}
//             className="text-[#64748B] text-sm font-[600] group-hover:text-[#334155] transition duration-200 cursor-pointer"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className=" overflow-hidden mt-4">
//         <CustomeTable
//           columns={columns}
//           data={filtered}
//           itemsPerPage={ITEMS_PER_PAGE}
//         />
//       </div>

//       <div className="flex gap-4 w-full mt-4">
//         {/* Card 1 */}
//         <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sx transition">
//           <h3 className="text-[#6B7280] text-[14px] text-sm font-medium">
//             Total Active Professionals
//           </h3>
//           <p className="text-2xl font-bold text-gray-800 mt-2">1200</p>
//           <p className="text-sm text-[#6B7280] text-[12px] mt-1">
//             12% from this month
//           </p>
//         </div>

//         {/* Card 2 */}
//         <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
//           <h3 className="text-[#6B7280] text-[14px] font-medium">
//             Average Progress
//           </h3>
//           <p className="text-2xl font-bold text-gray-800 mt-2">68%</p>
//           <p className="text-[#6B7280] text-[12px] mt-1">
//             5% increase this week
//           </p>
//         </div>

//         {/* Card 3 */}
//         <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
//           <h3 className="text-[#6B7280] text-[14px] font-medium">
//             Pending Approvals
//           </h3>
//           <p className="text-2xl font-bold text-gray-800 mt-2">32</p>
//           <p className="text-[#6B7280] text-[14px] mt-1">8 requests waiting</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Levels;

import { useState } from "react";
import Select from "react-select";
import CustomeTable from "../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const programOptions = [
  { value: "All", label: "By Program: All Programs" },
  { value: "Pacemaker", label: "Pacemaker" },
];

const statusOptions = [
  { value: "All", label: "By Status: All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Draft", label: "Draft" },
  { value: "Archived", label: "Archived" },
];

const Levels = () => {
  const [program, setProgram] = useState(programOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);

  const levels = [
    {
      id: "L-001",
      name: "Level 1 — Foundation: Device Introduction",
      program: "Pacemaker",
      chapters: 24,
      duration: "12 Weeks",
      status: "Active",
    },
    {
      id: "L-042",
      name: "System Components",
      program: "Pacemaker",
      chapters: 10,
      duration: "4 Weeks",
      status: "Active",
    },
    {
      id: "L-058",
      name: "Procedural Workflows",
      program: "Pacemaker",
      chapters: 18,
      duration: "8 Weeks",
      status: "Draft",
    },
    {
      id: "L-102",
      name: "Workflows, Configurations",
      program: "Pacemaker",
      chapters: 15,
      duration: "6 Weeks",
      status: "Archived",
    },
  ];

  // FILTER LOGIC
  const filtered = levels.filter((lvl) => {
    const matchProgram =
      program.value === "All" || lvl.program === program.value;

    const matchStatus = status.value === "All" || lvl.status === status.value;

    return matchProgram && matchStatus;
  });

  const resetFilters = () => {
    setProgram(programOptions[0]);
    setStatus(statusOptions[0]);
  };

  // SELECT STYLE (same as your old)
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#f3f4f6",
    }),
  };

  // TABLE COLUMNS (IMPORTANT 🔥)
  const columns = [
    {
      header: "Level Name",
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-400">ID: {row.id}</p>
        </div>
      ),
    },
    {
      header: "Parent Program",
      accessor: "program",
    },
    {
      header: "Total Chapters",
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
          {row.chapters} Chapters
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: "duration",
    },
    {
      header: "Status",
      render: (row) => {
        const styles = {
          Active: "bg-green-100 text-green-700",
          Draft: "bg-yellow-100 text-yellow-700",
          Archived: "bg-gray-200 text-gray-600",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[row.status]}`}
          >
            {row.status.toUpperCase()}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: () => <button className="text-blue-600 text-lg">👁</button>,
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-primary text-[28px] font-[700]">
            Level Management
          </h1>
          <p className="text-[16px] text-[#29324C] font-[500] mt-1">
            Manage and organize training levels to structure the learning
            journey from foundational knowledge to advanced clinical expertise.
          </p>
        </div>

        <Link
          to="create-level"
          className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Add New Level
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-gray-300 rounded-xl p-3 flex items-center gap-3">
        <span className="text-gray-500 text-sm font-semibold">FILTERS</span>

        <div className="w-[220px]">
          <Select
            value={program}
            onChange={setProgram}
            options={programOptions}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>

        <div className="w-[220px]">
          <Select
            value={status}
            onChange={setStatus}
            options={statusOptions}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>

        {/* RESET */}
        <div className="flex items-center gap-1 ml-auto cursor-pointer group">
          <MdOutlineFilterAltOff className="text-gray-500" size={18} />

          <button
            onClick={resetFilters}
            className="text-gray-600 text-sm font-semibold"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-4">
        <CustomeTable
          columns={columns}
          data={filtered}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* STATS */}
      <div className="flex gap-4 w-full mt-4">
        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white">
          <h3 className="text-gray-500 text-sm">TOTAL LEVELS</h3>
          <p className="text-2xl font-bold mt-2">42</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white">
          <h3 className="text-gray-500 text-sm">ACTIVE</h3>
          <p className="text-2xl font-bold mt-2">35</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white">
          <h3 className="text-gray-500 text-sm">AVG CHAPTERS/LEVEL</h3>
          <p className="text-2xl font-bold mt-2">14.2</p>
        </div>
      </div>
    </div>
  );
};

export default Levels;
