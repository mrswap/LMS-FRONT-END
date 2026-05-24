import { useDispatch, useSelector } from "react-redux";
import { getSingleThread } from "../../../../redux/slice/supportSlice";
import { FiMessageCircle, FiChevronRight } from "react-icons/fi";

const ThreadCard = ({ thread }) => {
  const dispatch = useDispatch();
  const { selectedThread } = useSelector((state) => state.support);
  const isActive = selectedThread?.id === thread.id;

  return (
    <div
      onClick={() => dispatch(getSingleThread(thread.id))}
      className={` 
        group relative px-4 py-3 cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500"
            : "hover:bg-gray-50/80 border-l-4 border-transparent"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-semibold text-sm truncate ${
                isActive ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {thread.user.name}
            </h3>
            {thread.unread_messages_count > 0 && (
              <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                {thread.unread_messages_count}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 truncate mb-1">
            {thread?.topic?.title}
          </p>

          <p className="text-xs text-gray-400 truncate">
            {thread.latest_message?.message || "No messages yet"}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <FiMessageCircle className="text-gray-400 text-xs" />
            <span className="text-xs text-gray-400">
              {thread.messages_count || 0} messages
            </span>
          </div>
        </div>

        <FiChevronRight
          className={`text-gray-400 transition-transform group-hover:translate-x-0.5 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>
    </div>
  );
};

export default ThreadCard;
