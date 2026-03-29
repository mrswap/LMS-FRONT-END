// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
// } from "recharts";
// import {
//   FiTrendingUp,
//   FiUsers,
//   FiBookOpen,
//   FiAward,
//   FiAlertTriangle,
//   FiClock,
//   FiZap,
// } from "react-icons/fi";

// const Dashboard = () => {
//   const userActivityData = [
//     { name: "WEEK 1", users: 4200 },
//     { name: "WEEK 2", users: 3100 },
//     { name: "WEEK 3", users: 6800 },
//     { name: "WEEK 4", users: 12840 },
//   ];

//   const departmentData = [
//     { name: "SURGERY", rate: 8, color: "#3b82f6" },
//     { name: "EENT", rate: 10, color: "#10b981" },
//     { name: "ICU", rate: 10, color: "#f59e0b" },
//     { name: "RADIOLOGY", rate: 10, color: "#8b5cf6" },
//     { name: "CARDIOLOGY", rate: 10, color: "#ef4444" },
//   ];

//   const recentActivities = [
//     {
//       text: 'John Doe completed "Vascular Anatomy"',
//       time: "2 months ago",
//       icon: "📘",
//       color: "bg-blue-50",
//     },
//     {
//       text: "50 new residents enrolled from ER",
//       time: "Just now",
//       icon: "👥",
//       color: "bg-green-50",
//     },
//     {
//       text: "Certificate issued to Dr. Marie Garcia",
//       time: "3 hours ago",
//       icon: "📜",
//       color: "bg-purple-50",
//     },
//   ];

//   const quizData = [
//     { name: "Passed", value: 85, color: "#3b82f6" },
//     { name: "Failed", value: 15, color: "#e5e7eb" },
//   ];

//   const statsCards = [
//     {
//       label: "Total Users",
//       value: "12,840",
//       change: "+12%",
//       changeColor: "text-green-500",
//       icon: FiUsers,
//       iconBg: "bg-blue-50",
//       iconColor: "text-blue-500",
//     },
//     {
//       label: "Active Learners",
//       value: "3,120",
//       change: "+5%",
//       changeColor: "text-green-500",
//       icon: FiZap,
//       iconBg: "bg-yellow-50",
//       iconColor: "text-yellow-500",
//     },
//     {
//       label: "Programs",
//       value: "86",
//       change: "-2%",
//       changeColor: "text-red-500",
//       icon: FiBookOpen,
//       iconBg: "bg-green-50",
//       iconColor: "text-green-500",
//     },
//     {
//       label: "Certificates",
//       value: "4,250",
//       change: "+18%",
//       changeColor: "text-green-500",
//       icon: FiAward,
//       iconBg: "bg-gray-50",
//       iconColor: "text-gray-500",
//     },
//   ];

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-800">
//           Data Analytics Overview
//         </h1>
//         <p className="text-gray-500 text-sm mt-0.5">
//           Real-time performance metrics across all medical departments.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {statsCards.map((card, idx) => {
//           const Icon = card.icon;
//           return (
//             <div
//               key={idx}
//               className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div
//                   className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}
//                 >
//                   <Icon className={`${card.iconColor} text-lg`} size={18} />
//                 </div>
//                 <span className={`text-xs font-semibold ${card.changeColor}`}>
//                   {card.change}
//                 </span>
//               </div>
//               <p className="text-gray-500 text-xs">{card.label}</p>
//               <p className="text-2xl font-bold text-gray-800 mt-0.5">
//                 {card.value}
//               </p>
//             </div>
//           );
//         })}
//       </div>

//       {/* User Activity Trend + Quiz Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* Line Chart */}
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-base font-semibold text-gray-800">
//               User Activity Trend
//             </h2>
//             <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none">
//               <option>Last 30 Days</option>
//               <option>Last 7 Days</option>
//               <option>Last 90 Days</option>
//             </select>
//           </div>
//           <div className="h-52">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={userActivityData}>
//                 <defs>
//                   <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                 <XAxis
//                   dataKey="name"
//                   stroke="#9ca3af"
//                   tick={{ fontSize: 11 }}
//                 />
//                 <YAxis
//                   stroke="#9ca3af"
//                   tick={{ fontSize: 11 }}
//                   tickFormatter={(v) => v.toLocaleString()}
//                 />
//                 <Tooltip
//                   formatter={(v) => [`${v.toLocaleString()} users`, "Activity"]}
//                   contentStyle={{
//                     backgroundColor: "white",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                     fontSize: "12px",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="users"
//                   stroke="#3b82f6"
//                   strokeWidth={2.5}
//                   dot={{
//                     fill: "#3b82f6",
//                     r: 4,
//                     strokeWidth: 2,
//                     stroke: "#fff",
//                   }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Quiz Performance */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//           <h2 className="text-base font-semibold text-gray-800 mb-4">
//             Quiz Performance
//           </h2>
//           <div className="flex flex-col items-center">
//             <div className="relative w-36 h-36">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={quizData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={48}
//                     outerRadius={60}
//                     paddingAngle={2}
//                     dataKey="value"
//                     stroke="none"
//                     startAngle={90}
//                     endAngle={-270}
//                   >
//                     {quizData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-2xl font-bold text-gray-800">85%</span>
//                 <span className="text-xs text-gray-400">PASS RATE</span>
//               </div>
//             </div>
//             <div className="w-full mt-4 space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="flex items-center gap-1.5 text-gray-600">
//                   <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
//                   Passed
//                 </span>
//                 <span className="font-semibold text-gray-700">2,662</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="flex items-center gap-1.5 text-gray-600">
//                   <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block"></span>
//                   Retake Needed
//                 </span>
//                 <span className="font-semibold text-gray-700">468</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Completion Rate + Critical Alerts + Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* Completion Rate by Department */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//           <h2 className="text-base font-semibold text-gray-800 mb-4">
//             Completion Rate by Department
//           </h2>
//           <div className="h-44">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={departmentData} barSize={22}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="#f3f4f6"
//                   vertical={false}
//                 />
//                 <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#9ca3af" />
//                 <YAxis
//                   tick={{ fontSize: 10 }}
//                   stroke="#9ca3af"
//                   domain={[0, 12]}
//                 />
//                 <Tooltip
//                   formatter={(v) => [`${v}%`, "Completion"]}
//                   contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
//                 />
//                 <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
//                   {departmentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Critical Alerts */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//           <div className="flex items-center gap-2 mb-4">
//             <FiAlertTriangle className="text-red-500" size={16} />
//             <h2 className="text-base font-semibold text-red-500 tracking-wide">
//               CRITICAL ALERTS
//             </h2>
//           </div>
//           <div className="space-y-3">
//             <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
//               <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
//               <p className="text-xs text-red-700 leading-relaxed">
//                 15 users failed mandatory HIPAA certification retake.{" "}
//                 <span className="text-red-400">2 hours ago</span>
//               </p>
//             </div>
//             <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
//               <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
//               <p className="text-xs text-orange-700 leading-relaxed">
//                 Compliance window closing for 'Surgical Safety' in 48h.{" "}
//                 <span className="text-orange-400">Just now</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
//           <div className="flex items-center gap-2 mb-4">
//             <FiClock className="text-gray-500" size={16} />
//             <h2 className="text-base font-semibold text-gray-700 tracking-wide">
//               RECENT ACTIVITY
//             </h2>
//           </div>
//           <div className="space-y-3">
//             {recentActivities.map((activity, idx) => (
//               <div
//                 key={idx}
//                 className={`flex items-start gap-3 p-2.5 ${activity.color} rounded-lg`}
//               >
//                 <div className="text-lg flex-shrink-0">{activity.icon}</div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs text-gray-800 font-medium leading-relaxed">
//                     {activity.text}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     {activity.time}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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
