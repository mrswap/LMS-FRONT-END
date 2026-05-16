import ChatWindow from "../components/chat/ChatWindow";
import ThreadList from "../components/chat/ThreadList";
import { FiMessageSquare, FiChevronRight } from "react-icons/fi";

const AdminSupportPage = () => {
  return (
    <div className="flex h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl overflow-hidden border border-gray-200/50">
      {/* Sidebar - Modern Glass */}
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <FiMessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-xs text-gray-500">Customer conversations</p>
            </div>
          </div>
        </div>
        <ThreadList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white">
        <ChatWindow />
      </div>
    </div>
  );
};

export default AdminSupportPage;
