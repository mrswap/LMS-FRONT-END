// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useEffect } from "react";
// // // import { getThreads } from "../../../../redux/slice/supportSlice";
// // // import ThreadCard from "./ThreadCard";

// // // const ThreadList = () => {
// // //   const dispatch = useDispatch();

// // //   const { threads } = useSelector((state) => state.support);

// // //   useEffect(() => {
// // //     dispatch(getThreads({}));
// // //   }, []);

// // //   return (
// // //     <div
// // //       className="
// // //         w-[350px]
// // //         border-r
// // //         overflow-y-auto
// // //       "
// // //     >
// // //       {threads.map((thread) => (
// // //         <ThreadCard key={thread.id} thread={thread} />
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default ThreadList;

// // // components/chat/ThreadList.jsx
// // import { useDispatch, useSelector } from "react-redux";
// // import { useEffect, useState } from "react";
// // import { getThreads } from "../../../../redux/slice/supportSlice";
// // import ThreadCard from "./ThreadCard";
// // import { FiSearch, FiInbox } from "react-icons/fi";

// // const ThreadList = () => {
// //   const dispatch = useDispatch();
// //   const { threads } = useSelector((state) => state.support);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   useEffect(() => {
// //     dispatch(getThreads({}));
// //   }, [dispatch]);

// //   const filteredThreads = threads.filter(
// //     (thread) =>
// //       thread.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       thread.topic.title.toLowerCase().includes(searchTerm.toLowerCase()),
// //   );

// //   return (
// //     <div className="flex-1 overflow-y-auto">
// //       {/* Search Bar */}
// //       <div className="p-3 border-b border-gray-800">
// //         <div className="relative">
// //           <FiSearch className="absolute left-3 top-3 text-gray-500 text-sm" />
// //           <input
// //             type="text"
// //             placeholder="Search conversations..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full bg-gray-800 text-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
// //           />
// //         </div>
// //       </div>

// //       {/* Thread List */}
// //       <div className="divide-y divide-gray-800">
// //         {filteredThreads.length === 0 ? (
// //           <div className="flex flex-col items-center justify-center py-12 text-gray-500">
// //             <FiInbox size={32} className="mb-2" />
// //             <p className="text-sm">No conversations found</p>
// //           </div>
// //         ) : (
// //           filteredThreads.map((thread) => (
// //             <ThreadCard key={thread.id} thread={thread} />
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ThreadList;

// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { getThreads } from "../../../../redux/slice/supportSlice";
// import ThreadCard from "./ThreadCard";

// const ThreadList = () => {
//   const dispatch = useDispatch();
//   const { threads } = useSelector((state) => state.support);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     dispatch(getThreads({}));
//   }, [dispatch]);

//   const filteredThreads = threads.filter(
//     (thread) =>
//       thread.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       thread.topic.title.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="flex-1 overflow-y-auto">
//       {/* Simple Search Bar */}
//       <div className="p-3 border-b border-gray-200">
//         <input
//           type="text"
//           placeholder="Search conversations..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//         />
//       </div>

//       {/* Thread List */}
//       <div>
//         {filteredThreads.length === 0 ? (
//           <div className="text-center py-8 text-gray-500 text-sm">
//             No conversations found
//           </div>
//         ) : (
//           filteredThreads.map((thread) => (
//             <ThreadCard key={thread.id} thread={thread} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ThreadList;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getThreads } from "../../../../redux/slice/supportSlice";
import ThreadCard from "./ThreadCard";
import { FiSearch, FiInbox } from "react-icons/fi";

const ThreadList = () => {
  const dispatch = useDispatch();
  const { threads } = useSelector((state) => state.support);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getThreads({}));
  }, [dispatch]);

  const filteredThreads = threads.filter(
    (thread) =>
      thread.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.topic.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Modern Search Bar */}
      <div className="p-4 border-b border-gray-100">
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
      </div>

      {/* Thread List */}
      <div className="divide-y divide-gray-100">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FiInbox className="w-12 h-12 mb-3 stroke-1" />
            <p className="text-sm font-medium">No conversations</p>
            <p className="text-xs mt-1">All caught up!</p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadList;
