import { useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { GiBookCover } from "react-icons/gi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";

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
  const navigate = useNavigate();

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
      backgroundColor: "#F8FAFC",
    }),
  };

  const columns = [
    {
      header: "Level Name",
      render: (row) => (
        <div
        // className="cursor-pointer"
        >
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
      render: () => (
        <button
          onClick={() => navigate("level-details")}
          className="text-gray-800 text-lg cursor-pointer"
        >
          <FaEye />
        </button>
      ),
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

      <div className="flex gap-4 w-full mt-4">
        {/* TOTAL LEVELS Card */}
        <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
              <HiOutlineSquare3Stack3D className="text-xl" />
            </div>

            <div>
              <h3 className="text-[12px] text-[#29324C] font-[700]">
                TOTAL LEVELS
              </h3>
              <p className="text-2xl font-bold text-gray-800 ">42</p>
            </div>
          </div>
        </div>

        {/* ACTIVE Card */}
        <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <IoIosCheckmarkCircleOutline className="text-xl" />
            </div>

            <div>
              <h3 className="text-[12px] text-[#29324C] font-[700]">ACTIVE</h3>
              <p className="text-2xl font-bold text-gray-800">35</p>
            </div>
          </div>
        </div>

        {/* AVG CHAPTERS/LEVEL Card */}
        <div className="flex-1 border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <GiBookCover className="text-xl" />
            </div>

            <div>
              <h3 className="text-[12px] text-[#29324C] font-[700]">
                AVG CHAPTERS/LEVEL
              </h3>
              <p className="text-2xl font-bold text-gray-800">14.2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Levels;
