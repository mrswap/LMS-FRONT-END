import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getThreads } from "../../../../redux/slice/supportSlice";
import ThreadCard from "./ThreadCard";
import { FiSearch, FiInbox, FiUser, FiFilter } from "react-icons/fi";
import Select from "react-select";
import { getAllUsers } from "../../../../redux/slice/userSlice";

const ThreadList = () => {
  const dispatch = useDispatch();
  const { threads, loading } = useSelector((state) => state.support);
  const { users } = useSelector((state) => state.user);

  // Initially sab empty string
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch threads when filters change
  useEffect(() => {
    const params = {};

    // Sirf tabhi add karo jab value ho (not empty string)
    if (debouncedSearch && debouncedSearch.trim() !== "") {
      params.search = debouncedSearch;
    }
    if (selectedUser?.value) {
      // value empty string nahi bhejenge
      params.user_id = selectedUser.value;
    }
    if (selectedStatus?.value) {
      // value empty string nahi bhejenge
      params.status = selectedStatus.value;
    }

    dispatch(getThreads(params));
    const prms = {
      role: "sales",
    };
    dispatch(getAllUsers(prms));
  }, [dispatch, debouncedSearch, selectedUser, selectedStatus]);

  // User options - empty string as default value
  const userOptions = [
    { value: "", label: "All Users" },
    ...(users?.data?.map((user) => ({
      value: user.id,
      label: user.name,
      email: user.email,
    })) || []),
  ];

  // Status options - empty string as default value
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Active" },
    { value: "resolved", label: "Resolved" },
    { value: "reopened", label: "Reopened" },
  ];

  // Custom select styles
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "12px",
      borderColor: "#E5E7EB",
      minHeight: "38px",
      boxShadow: "none",
      fontSize: "14px",
      backgroundColor: "#F8FAFC",
      "&:hover": {
        borderColor: "#3B82F6",
      },
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#3B82F6" : isFocused ? "#EFF6FF" : "white",
      color: isSelected ? "white" : "#1F2937",
      "&:active": {
        backgroundColor: "#3B82F6",
      },
    }),
  };

  // Clear all filters - sabko null/empty pe reset
  const clearFilters = () => {
    setSelectedUser(null); // null means "All Users" selected
    setSelectedStatus(null); // null means "All Status" selected
    setSearchTerm("");
    setDebouncedSearch("");
  };

  // Check if any filter is active
  const isFilterActive =
    selectedUser?.value || selectedStatus?.value || searchTerm;

  return (
    <div className="flex-1 overflow-y-auto h-full">
      {/* Filters Section */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3">
          {/* User Filter */}
          <div className="flex-1 min-w-[180px]">
            <Select
              value={selectedUser}
              onChange={setSelectedUser}
              options={userOptions}
              styles={customSelectStyles}
              isSearchable={true}
              placeholder={
                <div className="flex items-center gap-2">
                  <FiUser size={14} />
                  <span>Filter by user...</span>
                </div>
              }
              noOptionsMessage={() => "No users found"}
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[160px]">
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              styles={customSelectStyles}
              isSearchable={false}
              placeholder={
                <div className="flex items-center gap-2">
                  <FiFilter size={14} />
                  <span>Filter by status...</span>
                </div>
              }
            />
          </div>

          {/* Clear Filters Button */}
          {isFilterActive && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1"
            >
              <FiFilter size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Thread List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : threads?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FiInbox className="w-12 h-12 mb-3 stroke-1" />
            <p className="text-sm font-medium">No conversations</p>
            <p className="text-xs mt-1">
              {isFilterActive ? "Try changing your filters" : "All caught up!"}
            </p>
          </div>
        ) : (
          threads?.data?.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadList;
