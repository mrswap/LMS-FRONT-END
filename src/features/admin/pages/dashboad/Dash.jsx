import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  FiUsers,
  FiZap,
  FiBook,
  FiAward,
  FiChevronDown,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
  FiUser,
  FiUserPlus,
  FiFileText,
} from "react-icons/fi";

const activityData = [
  { week: "WEEK 1", value: 40 },
  { week: "", value: 55 },
  { week: "WEEK 2", value: 35 },
  { week: "", value: 42 },
  { week: "WEEK 3", value: 75 },
  { week: "", value: 60 },
  { week: "WEEK 4", value: 90 },
];

const departmentData = [
  { dept: "SURGERY", value: 72 },
  { dept: "ER", value: 58 },
  { dept: "ICU", value: 85 },
  { dept: "RADIOLOGY", value: 63 },
  { dept: "CARDIO", value: 79 },
];

const DEPT_COLORS = ["#4f8ef7", "#6dd6c2", "#a78bfa", "#f59e0b", "#f472b6"];

const PASS_RATE = 85;
const CIRCUMFERENCE = 2 * Math.PI * 52;
const DASH = (PASS_RATE / 100) * CIRCUMFERENCE;

function StatCard({ icon: Icon, label, value, change, positive }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-2 shadow-sm border border-gray-100 flex-1 min-w-[140px]">
      <div className="flex items-center justify-between">
        <div className="bg-blue-50 rounded-xl p-2">
          <Icon className="text-blue-500 text-lg" />
        </div>
        <span
          className={`text-xs font-semibold ${
            positive ? "text-green-500" : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <p className="text-gray-400 text-xs mt-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function DataAnalyticsDashboard() {
  const [period, setPeriod] = useState("Last 30 Days");

  return (
    <div className="">
      <div className=" space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Data Analytics Overview
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Real-time performance metrics across all medical departments.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-4 flex-wrap">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value="12,840"
            change="+12%"
            positive
          />
          <StatCard
            icon={FiZap}
            label="Active Learners"
            value="3,120"
            change="+5%"
            positive
          />
          <StatCard
            icon={FiBook}
            label="Programs"
            value="86"
            change="-2%"
            positive={false}
          />
          <StatCard
            icon={FiAward}
            label="Certificates"
            value="4,250"
            change="+18%"
            positive
          />
        </div>

        {/* Charts Row */}
        <div className="flex gap-4 flex-wrap">
          {/* Area Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-[2] min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700 text-base">
                User Activity Trend
              </h2>
              <button
                className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                onClick={() => {}}
              >
                {period} <FiChevronDown />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart
                data={activityData}
                margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: "#b0b7c3" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 12px #0001",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f8ef7"
                  strokeWidth={2.5}
                  fill="url(#blueGrad)"
                  dot={{ r: 4, fill: "#4f8ef7", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 min-w-[200px] flex flex-col">
            <h2 className="font-semibold text-gray-700 text-base mb-4">
              Quiz Performance
            </h2>
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <div className="relative flex items-center justify-center">
                <svg width="130" height="130" className="-rotate-90">
                  <circle
                    cx="65"
                    cy="65"
                    r="52"
                    fill="none"
                    stroke="#eef0f6"
                    strokeWidth="10"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r="52"
                    fill="none"
                    stroke="#4f8ef7"
                    strokeWidth="10"
                    strokeDasharray={`${DASH} ${CIRCUMFERENCE - DASH}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-800">85%</span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                    Pass Rate
                  </span>
                </div>
              </div>
              <div className="w-full space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    Passed
                  </span>
                  <span className="font-semibold text-gray-700">2,652</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
                    Retake Needed
                  </span>
                  <span className="font-semibold text-gray-500">468</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex gap-4 flex-wrap">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-[2] min-w-[260px]">
            <h2 className="font-semibold text-gray-700 text-base mb-4">
              Completion Rate by Department
            </h2>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={departmentData}
                margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                barSize={28}
              >
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 9, fill: "#b0b7c3" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 12px #0001",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DEPT_COLORS[index % DEPT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 flex-1 min-w-[220px]">
            {/* Critical Alerts */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiAlertTriangle className="text-orange-400 text-base" />
                <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">
                  Critical Alerts
                </span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  15 users failed mandatory HIPAA certification retake.
                </li>
                <li className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  Compliance window closing for 'Surgical Safety' in 48h.
                </li>
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1">
              <h2 className="font-bold text-gray-600 text-xs tracking-widest uppercase mb-3">
                Recent Activity
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 flex-shrink-0">
                    <FiFileText className="text-blue-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      John Doe completed "Vascular Anatomy"
                    </p>
                    <p className="text-[10px] text-gray-400">2 minutes ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1.5 flex-shrink-0">
                    <FiUserPlus className="text-green-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      50 new residents enrolled from ER
                    </p>
                    <p className="text-[10px] text-gray-400">1 hour ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-1.5 flex-shrink-0">
                    <FiAward className="text-purple-500 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">
                      Certificate issued to Dr. Maria Garcia
                    </p>
                    <p className="text-[10px] text-gray-400">3 hours ago</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
