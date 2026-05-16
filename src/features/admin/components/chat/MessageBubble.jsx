import { formatDistanceToNow } from "date-fns";
import { FiUser, FiHelpCircle, FiPaperclip, FiCheck } from "react-icons/fi";

const MessageBubble = ({ message }) => {
  const isAdmin = message.is_admin === true;

  return (
    <div className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[70%] ${message.pending ? "opacity-70" : ""}`}>
        <div
          className={`flex items-center gap-2 mb-1.5 ${
            !isAdmin && "justify-end"
          }`}
        >
          {isAdmin ? (
            <>
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiHelpCircle size={12} className="text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">
                Support Team
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-blue-600">
                {message.sender?.name || "User"}
              </span>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser size={12} className="text-blue-600" />
              </div>
            </>
          )}
          {message.pending && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FiCheck size={10} />
              Sending...
            </span>
          )}
        </div>

        <div
          className={`rounded-2xl px-4 py-2.5 shadow-sm ${
            isAdmin
              ? "bg-white border border-gray-200 text-gray-800"
              : "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </p>

          {message.attachment && (
            <div className="mt-2">
              {message.attachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                <img
                  src={message.attachment}
                  alt="Attachment"
                  className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-90 transition border"
                  onClick={() => window.open(message.attachment, "_blank")}
                />
              ) : (
                <a
                  href={message.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs inline-flex items-center gap-1.5 mt-1 ${
                    isAdmin ? "text-blue-600" : "text-white/90"
                  }`}
                >
                  <FiPaperclip size={12} />
                  View Attachment
                </a>
              )}
            </div>
          )}
        </div>

        {message.created_at && (
          <div
            className={`text-xs text-gray-400 mt-1 ${!isAdmin && "text-right"}`}
          >
            {formatDistanceToNow(new Date(message.created_at), {
              addSuffix: true,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
