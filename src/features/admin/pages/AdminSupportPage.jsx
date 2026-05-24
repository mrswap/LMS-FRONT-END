import ChatWindow from "../components/chat/ChatWindow";
import ThreadList from "../components/chat/ThreadList";
import { FiMessageSquare } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const AdminSupportPage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="
        flex
        h-[calc(100vh-56px)]
        sm:h-[calc(100vh-115px)]
        bg-gradient-to-br
        from-gray-50
        to-gray-100
        overflow-hidden
        border border-gray-300 rounded-lg
      "
    >
      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-white/95 backdrop-blur-sm border-r border-gray-300 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <FiMessageSquare className="w-4 h-4 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {t("support.title")}
              </h1>
              <p className="text-xs text-gray-500">{t("support.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-hidden">
          <ThreadList />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 min-w-0 bg-white">
        <ChatWindow />
      </div>
    </div>
  );
};

export default AdminSupportPage;
