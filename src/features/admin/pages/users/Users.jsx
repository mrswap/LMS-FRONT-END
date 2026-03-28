import { useState } from "react";
import Select from "react-select";
import { FiSearch } from "react-icons/fi";
import CustomeTable from "../../common/table/CustomeTable";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const regionOptions = [
  { value: "All", label: "Region: All" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Africa", label: "Africa" },
  { value: "North America", label: "North America" },
];

const statusOptions = [
  { value: "All", label: "Status: All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "On Leave", label: "On Leave" },
];

const Users = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(regionOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);

  const navigate = useNavigate();

  const users = [
    {
      id: "AV-9042",
      name: "Sarah Anderson",
      email: "s.anderson@medmail.com",
      phone: "+1 555 012",
      region: "North America",
      programs: 4,
      progress: 82,
      status: "Active",
    },
    {
      id: "AV-8731",
      name: "James Wilson",
      email: "j.wilson@healthcare.org",
      phone: "+44 20 7946",
      region: "Europe",
      programs: 2,
      progress: 45,
      status: "On Leave",
    },
    {
      id: "AV-7421",
      name: "Priya Sharma",
      email: "p.sharma@clinicnet.in",
      phone: "+91 98001234",
      region: "Asia",
      programs: 3,
      progress: 67,
      status: "Active",
    },

    // 🔥 Auto Generated Users
    ...Array.from({ length: 57 }, (_, i) => {
      const names = [
        "Amit Verma",
        "Rohit Singh",
        "Neha Gupta",
        "Karan Mehta",
        "Anjali Patel",
        "Vikas Yadav",
        "Sneha Kapoor",
        "Rahul Jain",
        "Pooja Sharma",
        "Arjun Reddy",
      ];

      const regions = [
        "Asia",
        "Europe",
        "Africa",
        "North America",
        "Middle East",
      ];
      const statuses = ["Active", "Inactive", "On Leave"];

      const name = names[i % names.length];
      const idNum = 1000 + i;

      return {
        id: `AV-${idNum}`,
        name,
        email: `${name.toLowerCase().replace(/ /g, ".")}@demo.com`,
        phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
        region: regions[i % regions.length],
        programs: Math.floor(Math.random() * 5) + 1,
        progress: Math.floor(Math.random() * 100),
        status: statuses[i % statuses.length],
      };
    }),
  ];

  //  FILTER LOGIC
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());

    const matchRegion = region.value === "All" || u.region === region.value;

    const matchStatus = status.value === "All" || u.status === status.value;

    return matchSearch && matchRegion && matchStatus;
  });

  //  RESET
  const resetFilters = () => {
    setSearch("");
    setRegion(regionOptions[0]);
    setStatus(statusOptions[0]);
  };

  //  CUSTOM STYLES (react-select)
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
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2563EB"
        : state.isFocused
          ? "#EFF6FF"
          : "#fff",
      color: state.isSelected ? "#fff" : "#111",
      fontSize: "14px",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
    }),
  };

  const columns = [
    { header: "User ID", accessor: "id" },
    {
      header: "Name",
      render: (row) => (
        <p
          className="font-semibold text-gray-800 cursor-pointer"
          onClick={() => {
            console.log("clicked");
            navigate("user-details");
          }}
        >
          {row.name}
        </p>
      ),
    },
    {
      header: "Contact",
      render: (row) => (
        <div>
          <p className="text-sm">{row.email}</p>
          <p className="text-xs text-gray-400">{row.phone}</p>
        </div>
      ),
    },
    { header: "Region", accessor: "region" },
    {
      header: "Programs",
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
          {row.programs} Active
        </span>
      ),
    },
    {
      header: "Progress",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{row.progress}%</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const styles = {
          Active: "bg-green-100 text-green-800",
          "On Leave": "bg-yellow-100 text-yellow-800",
          Inactive: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[row.status]}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-primary text-[28px] font-[700]">
            User Management
          </h1>
          <p className="text-[16px] text-[#29324C] font-[500] mt-1">
            Manage, audit, and support medical professional accounts across all
            regions.
          </p>
        </div>

        <Link
          to="create-user"
          className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
        >
          + Create User
        </Link>
      </div>

      {/*  FILTER BAR */}
      <div className="bobg-white rder border-gray-300 rounded-2xl p-3 flex items-center gap-3 border border-gray-300 ">
        {/* SEARCH */}
        <div className="flex items-center bg-[#F8FAFC]  border border-gray-300 hover:border-blue-500  focus:border-blue-500 rounded-xl px-3 py-2 w-[480px]">
          <FiSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID or phone..."
            className="bg-transparent outline-none px-2 text-sm w-full "
          />
        </div>

        {/* REGION */}
        <div className="w-[180px]">
          <Select
            value={region}
            onChange={setRegion}
            options={regionOptions}
            styles={customSelectStyles}
            isSearchable={false}
          />
        </div>

        {/* STATUS */}
        <div className="w-[180px]">
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
          <span>
            <MdOutlineFilterAltOff
              className="text-[#64748B] group-hover:text-[#334155] transition duration-200 cursor-pointer"
              size={18}
            />
          </span>

          <button
            onClick={resetFilters}
            className="text-[#64748B] text-sm font-[600] group-hover:text-[#334155] transition duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className=" overflow-hidden mt-4">
        <CustomeTable
          columns={columns}
          data={filtered}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      <div className="flex gap-4 w-full mt-4">
        {/* Card 1 */}
        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-sx transition">
          <h3 className="text-[#6B7280] text-[14px] text-sm font-medium">
            Total Active Professionals
          </h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">1200</p>
          <p className="text-sm text-[#6B7280] text-[12px] mt-1">
            12% from this month
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
          <h3 className="text-[#6B7280] text-[14px] font-medium">
            Average Progress
          </h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">68%</p>
          <p className="text-[#6B7280] text-[12px] mt-1">
            5% increase this week
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex-1 border border-gray-300 rounded-xl p-5 bg-white shadow-xs transition">
          <h3 className="text-[#6B7280] text-[14px] font-medium">
            Pending Approvals
          </h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">32</p>
          <p className="text-[#6B7280] text-[14px] mt-1">8 requests waiting</p>
        </div>
      </div>
    </div>
  );
};

export default Users;
