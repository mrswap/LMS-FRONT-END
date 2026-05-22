import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import {
  FiUser,
  FiMail,
  FiBookOpen,
  FiFolder,
  FiTag,
  FiMessageSquare,
  FiLoader,
  FiChevronUp,
  FiChevronDown,
  FiCheckCircle,
  FiRotateCcw,
} from "react-icons/fi";
import {
  resolveThread,
  reopenThread,
  addRealtimeMessage,
} from "../../../../redux/slice/supportSlice";
import useSupportSocket from "../../../../hooks/useSupportSocket";
import Loader from "../../common/Loader";
import { useTranslation } from "react-i18next";
import usePermission from "../../../../hooks/usePermission";

const ChatWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedThread, messagesByThread, loading, actionLoading } =
    useSelector((state) => state.support);
  const token = localStorage.getItem("token");
  const { hasPermission } = usePermission();

  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const messages = selectedThread
    ? messagesByThread[selectedThread.id] || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useSupportSocket({
    threadId: selectedThread?.id,
    token: token,
    onMessageReceived: (message) => {
      console.log("Admin received message:", message);
      dispatch(addRealtimeMessage(message));
    },
  });

  const handleResolve = async () => {
    if (!selectedThread) return;
    setIsActionLoading(true);
    try {
      await dispatch(resolveThread(selectedThread.id)).unwrap();
    } catch (error) {
      console.error("Failed to resolve thread:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReopen = async () => {
    if (!selectedThread) return;
    setIsActionLoading(true);
    try {
      await dispatch(reopenThread(selectedThread.id)).unwrap();
    } catch (error) {
      console.error("Failed to reopen thread:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white h-full">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FiMessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-700 font-semibold mb-1">
            {t("support.chat.noConversationSelected")}
          </h3>
          <p className="text-gray-400 text-sm">
            {t("support.chat.selectThreadToStart")}
          </p>
        </div>
      </div>
    );
  }

  const {
    user,
    topic,
    module: moduleData,
    level,
    program,
    status,
  } = selectedThread;

  const showResolveButton = status === "open" || status === "reopened";
  const showReopenButton = status === "resolved";

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with User Info */}
      <div className="border-b border-gray-100 bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiUser className="text-blue-600" size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-800 truncate">
                {user?.name || t("support.chat.unknownUser")}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                <span className="truncate">
                  {user?.email || t("support.chat.noEmail")}
                </span>
                <span>•</span>
                <span className="truncate">
                  {user?.mobile || t("support.chat.noMobile")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Resolve Button */}
            {hasPermission("support.resolve") && showResolveButton && (
              <button
                onClick={handleResolve}
                disabled={isActionLoading || actionLoading}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FiCheckCircle className="w-3.5 h-3.5" />
                )}
                {t("support.chat.resolve")}
              </button>
            )}

            {/* Reopen Button */}
            {hasPermission("support.reopen") && showReopenButton && (
              <button
                onClick={handleReopen}
                disabled={isActionLoading || actionLoading}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FiRotateCcw className="w-3.5 h-3.5" />
                )}
                {t("support.chat.reopen")}
              </button>
            )}

            {/* Status Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                status === "open"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : status === "resolved"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : status === "reopened"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              {status === "open"
                ? t("support.status.open")
                : status === "resolved"
                  ? t("support.status.resolved")
                  : status === "reopened"
                    ? t("support.status.reopened")
                    : t("support.status.open")}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Metadata Section */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <button
          onClick={() => setIsMetadataOpen(!isMetadataOpen)}
          className="w-full px-5 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {t("support.chat.courseDetails")}
            </span>
            <span className="text-xs text-gray-400">
              (
              {isMetadataOpen ? t("support.chat.hide") : t("support.chat.show")}
              )
            </span>
          </div>
          {isMetadataOpen ? (
            <FiChevronUp className="text-gray-400" size={14} />
          ) : (
            <FiChevronDown className="text-gray-400" size={14} />
          )}
        </button>

        {isMetadataOpen && (
          <div className="px-5 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-baseline gap-2 text-sm">
              <FiBookOpen className="text-blue-600" size={12} />
              <span className="text-gray-500 w-16 flex-shrink-0">
                {t("support.chat.program")}:
              </span>
              <span className="text-gray-800 break-words flex-1">
                {program?.title || t("support.chat.na")}
              </span>
            </div>

            <div className="flex items-baseline gap-2 text-sm">
              <FiFolder className="text-purple-600" size={12} />
              <span className="text-gray-500 w-16 flex-shrink-0">
                {t("support.chat.level")}:
              </span>
              <span className="text-gray-800 break-words flex-1">
                {level?.title || t("support.chat.na")}
              </span>
            </div>

            <div className="flex items-baseline gap-2 text-sm">
              <FiTag className="text-green-600" size={12} />
              <span className="text-gray-500 w-16 flex-shrink-0">
                {t("support.chat.module")}:
              </span>
              <span className="text-gray-800 break-words flex-1">
                {moduleData?.title || t("support.chat.na")}
              </span>
            </div>

            <div className="flex items-baseline gap-2 text-sm">
              <FiMail className="text-orange-600" size={12} />
              <span className="text-gray-500 w-16 flex-shrink-0">
                {t("support.chat.topic")}:
              </span>
              <span className="text-blue-600 font-medium break-words flex-1">
                {topic?.title || t("support.chat.na")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FiMail className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">
                {t("support.chat.noMessages")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("support.chat.sendReplyToStart")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.tempId || msg.id || index}
                message={msg}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Disable Chat Input for Resolved Threads */}
      {status === "resolved" ? (
        hasPermission("support.reopen") ? (
          <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">
              {t("support.chat.threadResolved")}

              <button
                onClick={handleReopen}
                disabled={isActionLoading}
                className="ml-2 text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
              >
                {isActionLoading
                  ? t("common.loading")
                  : t("support.chat.reopenToContinue")}
              </button>
            </p>
          </div>
        ) : (
          <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">
              {t("support.chat.threadResolved")}
            </p>
          </div>
        )
      ) : (
        <ChatInput threadId={selectedThread.id} />
      )}
    </div>
  );
};

export default ChatWindow;
