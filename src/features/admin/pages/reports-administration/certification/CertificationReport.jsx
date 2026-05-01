import { useEffect, useState } from "react";
import Select from "react-select";
import CustomeTable from "../../../common/table/CustomeTable";
import {
  FaEnvelope,
  FaUser,
  FaCertificate,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import { LuFilterX } from "react-icons/lu";
import { getAllCertifications } from "../../../../../redux/slice/reportSlice";
import { getAllUsers } from "../../../../../redux/slice/userSlice";

const ITEMS_PER_PAGE = 10;

// Dummy data for certification report
const getDummyCertificationData = () => {
  return [
    {
      id: 1,
      user_name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      employee_id: "EMP001",
      certification_name: "Advanced JavaScript Certification",
      type: "topic",
      type_value: "JavaScript Programming",
      issue_date: "2026-03-15T10:30:00.000000Z",
      expiry_date: "2028-03-15T10:30:00.000000Z",
      status: "active",
      status_value: 1,
      score: 92,
      percentage: "92.00",
      certificate_id: "CERT-JS-001-2026",
      issued_by: "Admin User",
    },
    {
      id: 2,
      user_name: "Priya Sharma",
      email: "priya.sharma@example.com",
      employee_id: "EMP003",
      certification_name: "Level 1 Completion Certificate",
      type: "level",
      type_value: "Beginner Level",
      issue_date: "2026-03-10T14:20:00.000000Z",
      expiry_date: "2027-03-10T14:20:00.000000Z",
      status: "active",
      status_value: 1,
      score: 88,
      percentage: "88.00",
      certificate_id: "CERT-L1-003-2026",
      issued_by: "Admin User",
    },
    {
      id: 3,
      user_name: "Amit Patel",
      email: "amit.patel@example.com",
      employee_id: "EMP005",
      certification_name: "React Development Certification",
      type: "topic",
      type_value: "React Framework",
      issue_date: "2026-02-28T09:15:00.000000Z",
      expiry_date: "2028-02-28T09:15:00.000000Z",
      status: "active",
      status_value: 1,
      score: 95,
      percentage: "95.00",
      certificate_id: "CERT-REACT-005-2026",
      issued_by: "Admin User",
    },
    {
      id: 4,
      user_name: "Neha Gupta",
      email: "neha.gupta@example.com",
      employee_id: "EMP007",
      certification_name: "Level 2 Completion Certificate",
      type: "level",
      type_value: "Intermediate Level",
      issue_date: "2026-02-20T11:45:00.000000Z",
      expiry_date: "2027-02-20T11:45:00.000000Z",
      status: "revoked",
      status_value: 0,
      score: 65,
      percentage: "65.00",
      certificate_id: "CERT-L2-007-2026",
      issued_by: "Admin User",
      revoked_date: "2026-03-01T10:00:00.000000Z",
      revoked_reason: "Assessment violation",
    },
    {
      id: 5,
      user_name: "Vikram Singh",
      email: "vikram.singh@example.com",
      employee_id: "EMP009",
      certification_name: "Python Programming Certification",
      type: "topic",
      type_value: "Python Core",
      issue_date: "2026-02-15T16:30:00.000000Z",
      expiry_date: "2028-02-15T16:30:00.000000Z",
      status: "active",
      status_value: 1,
      score: 89,
      percentage: "89.00",
      certificate_id: "CERT-PY-009-2026",
      issued_by: "Admin User",
    },
    {
      id: 6,
      user_name: "Anjali Verma",
      email: "anjali.verma@example.com",
      employee_id: "EMP011",
      certification_name: "Level 3 Completion Certificate",
      type: "level",
      type_value: "Advanced Level",
      issue_date: "2026-02-10T13:00:00.000000Z",
      expiry_date: "2027-02-10T13:00:00.000000Z",
      status: "active",
      status_value: 1,
      score: 94,
      percentage: "94.00",
      certificate_id: "CERT-L3-011-2026",
      issued_by: "Admin User",
    },
    {
      id: 7,
      user_name: "Rahul Mehta",
      email: "rahul.mehta@example.com",
      employee_id: "EMP013",
      certification_name: "Database Management Certification",
      type: "topic",
      type_value: "SQL & Database",
      issue_date: "2026-02-05T10:00:00.000000Z",
      expiry_date: "2028-02-05T10:00:00.000000Z",
      status: "revoked",
      status_value: 0,
      score: 72,
      percentage: "72.00",
      certificate_id: "CERT-DB-013-2026",
      issued_by: "Admin User",
      revoked_date: "2026-02-28T15:30:00.000000Z",
      revoked_reason: "Policy violation",
    },
    {
      id: 8,
      user_name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      employee_id: "EMP015",
      certification_name: "Level 1 Completion Certificate",
      type: "level",
      type_value: "Beginner Level",
      issue_date: "2026-01-28T09:30:00.000000Z",
      expiry_date: "2027-01-28T09:30:00.000000Z",
      status: "active",
      status_value: 1,
      score: 87,
      percentage: "87.00",
      certificate_id: "CERT-L1-015-2026",
      issued_by: "Admin User",
    },
    {
      id: 9,
      user_name: "Manish Joshi",
      email: "manish.joshi@example.com",
      employee_id: "EMP017",
      certification_name: "AWS Cloud Certification",
      type: "topic",
      type_value: "Cloud Computing",
      issue_date: "2026-01-20T14:15:00.000000Z",
      expiry_date: "2028-01-20T14:15:00.000000Z",
      status: "active",
      status_value: 1,
      score: 91,
      percentage: "91.00",
      certificate_id: "CERT-AWS-017-2026",
      issued_by: "Admin User",
    },
    {
      id: 10,
      user_name: "Pooja Nair",
      email: "pooja.nair@example.com",
      employee_id: "EMP019",
      certification_name: "Level 2 Completion Certificate",
      type: "level",
      type_value: "Intermediate Level",
      issue_date: "2026-01-15T11:20:00.000000Z",
      expiry_date: "2027-01-15T11:20:00.000000Z",
      status: "revoked",
      status_value: 0,
      score: 68,
      percentage: "68.00",
      certificate_id: "CERT-L2-019-2026",
      issued_by: "Admin User",
      revoked_date: "2026-02-10T09:00:00.000000Z",
      revoked_reason: "Incomplete assessment",
    },
  ];
};

const CertificationReport = () => {
  const dispatch = useDispatch();
  const {
    certifications: certificationReports,
    loadingCertifications,
    isError,
    message,
  } = useSelector((state) => state.report);

  const { users } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Type options - Topic/Level
  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "topic", label: "Topic" },
    { value: "level", label: "Level" },
  ];

  // Status options - Active (1) / Revoked (0)
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "1", label: "Active" },
    { value: "0", label: "Revoked" },
  ];

  const userOptions = [
    { value: "", label: "All Users" },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  // Use dummy data if API returns empty data
  const getCertificationData = () => {
    if (certificationReports?.data && certificationReports.data.length > 0) {
      return certificationReports.data;
    }
    // Return dummy data for development
    return getDummyCertificationData();
  };

  const getPaginationData = () => {
    const data = getCertificationData();
    const meta = certificationReports?.meta || {};
    return {
      current_page: meta?.current_page || 1,
      last_page: meta?.last_page || Math.ceil(data.length / ITEMS_PER_PAGE),
      total: meta?.total || data.length,
    };
  };

  const fetchCertificationReports = (overridePage) => {
    const params = {
      page: overridePage ?? page,
      per_page: ITEMS_PER_PAGE,
      ...(search && { search: search }),
      ...(selectedUser?.value &&
        selectedUser.value !== "" && { user_id: selectedUser.value }),
      ...(selectedType?.value &&
        selectedType.value !== "" && { type: selectedType.value }),
      ...(selectedStatus?.value &&
        selectedStatus.value !== "" && { status: selectedStatus.value }),
    };
    dispatch(getAllCertifications(params));
    dispatch(getAllUsers());
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchCertificationReports(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedUser, selectedType, selectedStatus]);

  useEffect(() => {
    fetchCertificationReports(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedUser(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setPage(1);
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "8px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
    }),
  };

  const getStatusBadgeColor = (status) => {
    if (status?.toLowerCase() === "active" || status === 1 || status === "1") {
      return "bg-green-100 text-green-700";
    }
    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status?.toLowerCase() === "active" || status === 1 || status === "1") {
      return <FaCheckCircle className="text-green-500" />;
    }
    return <FaTimesCircle className="text-red-500" />;
  };

  const getTypeBadgeColor = (type) => {
    if (type?.toLowerCase() === "topic") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-purple-100 text-purple-700";
  };

  const columns = [
    {
      header: "User Details",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">{row?.user_name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaEnvelope size={10} />
              {row?.email}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FaUser size={10} />
              {row?.employee_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Certificate Details",
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="font-medium text-gray-800 flex items-center gap-2">
            <FaCertificate className="text-blue-500" />
            {row?.certification_name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ID: {row?.certificate_id}
          </p>
          <p className="text-xs text-gray-500">Issued by: {row?.issued_by}</p>
        </div>
      ),
    },
    {
      header: "Type",
      render: (row) => (
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(row?.type)}`}
          >
            {row?.type?.toUpperCase()}
          </span>
          <p className="text-xs text-gray-500 mt-1">{row?.type_value}</p>
        </div>
      ),
    },
    {
      header: "Score",
      render: (row) => (
        <div className="text-center">
          <p className="font-bold text-lg text-gray-800">{row?.score}%</p>
          <p className="text-xs text-gray-500">Percentage</p>
        </div>
      ),
    },
    {
      header: "Issue Date",
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <FaCalendarAlt size={12} />
            {new Date(row?.issue_date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row?.issue_date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      header: "Expiry Date",
      render: (row) => (
        <div className="min-w-[100px]">
          <p className="text-sm text-gray-600">
            {new Date(row?.expiry_date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(row?.expiry_date).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <div>
          <div className="flex items-center gap-2">
            {getStatusIcon(row?.status)}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(row?.status)}`}
            >
              {row?.status?.toUpperCase()}
            </span>
          </div>
          {row?.status === "revoked" && row?.revoked_reason && (
            <p className="text-xs text-red-500 mt-1">
              Reason: {row?.revoked_reason}
            </p>
          )}
        </div>
      ),
    },
  ];

  const getTableData = () => {
    let data = getCertificationData();

    // Apply local filtering for dummy data
    if (
      certificationReports?.data?.length === 0 ||
      !certificationReports?.data
    ) {
      if (search) {
        data = data.filter(
          (item) =>
            item.user_name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase()) ||
            item.employee_id.toLowerCase().includes(search.toLowerCase()) ||
            item.certification_name
              .toLowerCase()
              .includes(search.toLowerCase()),
        );
      }
      if (selectedUser?.value && selectedUser.value !== "") {
        // Filter by user (in dummy data, we'll filter by employee_id or name)
        const selectedUserObj = userOptions.find(
          (u) => u.value === selectedUser.value,
        );
        if (selectedUserObj) {
          data = data.filter(
            (item) =>
              item.user_name === selectedUserObj.label ||
              item.email === selectedUserObj.email,
          );
        }
      }
      if (selectedType?.value && selectedType.value !== "") {
        data = data.filter((item) => item.type === selectedType.value);
      }
      if (selectedStatus?.value && selectedStatus.value !== "") {
        data = data.filter(
          (item) => item.status_value === parseInt(selectedStatus.value),
        );
      }
    }

    return data;
  };

  if (loadingCertifications && !getTableData().length) return <Loader />;
  if (isError) return <Error message={message} />;

  const tableData = getTableData();
  const pagination = getPaginationData();

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>Certification Report</PageTitle>
          <PageSubtitle>
            Track and manage user certifications, their status and validity
          </PageSubtitle>
        </PageHeaderLeft>
        <PageHeaderRight />
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="w-full">
            <div
              className="flex items-center bg-gray-50 border border-gray-200 
                      hover:border-blue-500 focus-within:border-blue-500
                      rounded-xl px-4 py-2.5 transition-all"
            >
              <FiSearch className="text-gray-400 text-base" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user name, email, employee ID or certificate name..."
                className="bg-transparent outline-none px-3 text-sm w-full placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={userOptions}
                styles={customSelectStyles}
                isSearchable={true}
                placeholder="Select User"
              />
            </div>

            <div>
              <Select
                value={selectedType}
                onChange={setSelectedType}
                options={typeOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder="Select Type"
              />
            </div>

            <div>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder="Select Status"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg cursor-pointer
                text-gray-500 hover:text-white hover:bg-red-500 transition-all border border-gray-200"
              >
                <LuFilterX size={18} />
                <span className="text-sm">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <CustomeTable
            columns={columns}
            data={tableData}
            serverSide={false}
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            totalItems={tableData.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      </PageBody>
    </PageLayout>
  );
};

export default CertificationReport;
