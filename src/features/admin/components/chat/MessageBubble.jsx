import { formatDistanceToNow } from "date-fns";
import {
  FiUser,
  FiHelpCircle,
  FiPaperclip,
  FiCheck,
  FiCpu,
  FiStar,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const MessageBubble = ({ message }) => {
  const { t } = useTranslation();

  const isAI = message.is_ai === true;
  const isSuperAdmin =
    message.sender?.role_id === 1 && message.is_admin === true;
  const isAdmin = message.is_admin === true && !isSuperAdmin && !isAI;

  // AI Messages - Right side, Purple highlight
  if (isAI) {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[70%] ${message.pending ? "opacity-70" : ""}`}>
          <div className="flex items-center gap-2 mb-1.5 justify-end">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <FiCpu size={12} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600">
              AVANTE-AI
            </span>
            {message.pending && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FiCheck size={10} />
                {t("support.message.sending")}
              </span>
            )}
          </div>
          <div className="rounded-2xl px-4 py-2.5 shadow-sm bg-purple-50 border border-purple-200 text-gray-800">
            {/* <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.message}
            </p> */}
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-3 mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-2">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-5 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-5 mb-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-sm">{children}</li>
                ),
              }}
            >
              {message.message}
            </ReactMarkdown>
            {message.attachment && (
              <div className="mt-2">
                {message.attachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={message.attachment}
                    alt={t("support.message.attachment")}
                    className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-90 transition border"
                    onClick={() => window.open(message.attachment, "_blank")}
                  />
                ) : (
                  <a
                    href={message.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1.5 mt-1 text-purple-600"
                  >
                    <FiPaperclip size={12} />
                    {t("support.message.viewAttachment")}
                  </a>
                )}
              </div>
            )}
          </div>
          {message.created_at && (
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Super Admin Messages - Right side, Light Blue highlight
  if (isSuperAdmin) {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[70%] ${message.pending ? "opacity-70" : ""}`}>
          <div className="flex items-center gap-2 mb-1.5 justify-end">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
              <FiStar size={12} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600">
              {message.sender?.name || "Super Admin"}
            </span>
            <span className="text-[10px] bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              Super Admin
            </span>
            {message.pending && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FiCheck size={10} />
                {t("support.message.sending")}
              </span>
            )}
          </div>
          <div className="rounded-2xl px-4 py-2.5 shadow-sm bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 text-blue-600">
            {/* <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.message}
            </p> */}
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-3 mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-2">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-5 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-5 mb-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-sm">{children}</li>
                ),
              }}
            >
              {message.message}
            </ReactMarkdown>
            {message.attachment && (
              <div className="mt-2">
                {message.attachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={message.attachment}
                    alt={t("support.message.attachment")}
                    className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-90 transition border"
                    onClick={() => window.open(message.attachment, "_blank")}
                  />
                ) : (
                  <a
                    href={message.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1.5 mt-1 text-blue-600"
                  >
                    <FiPaperclip size={12} />
                    {t("support.message.viewAttachment")}
                  </a>
                )}
              </div>
            )}
          </div>
          {message.created_at && (
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal Admin/Staff Messages - Right side, Default style
  if (isAdmin) {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[70%] ${message.pending ? "opacity-70" : ""}`}>
          <div className="flex items-center gap-2 mb-1.5 justify-end">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiHelpCircle size={12} className="text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {message.sender?.name || t("support.message.supportTeam")}
            </span>
            {message.pending && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <FiCheck size={10} />
                {t("support.message.sending")}
              </span>
            )}
          </div>
          <div className="rounded-2xl px-4 py-2.5 shadow-sm bg-white border border-gray-200 text-gray-800">
            {/* <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.message}
            </p> */}
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mt-3 mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-2">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-5 mb-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-5 mb-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-sm">{children}</li>
                ),
              }}
            >
              {message.message}
            </ReactMarkdown>
            {message.attachment && (
              <div className="mt-2">
                {message.attachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={message.attachment}
                    alt={t("support.message.attachment")}
                    className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-90 transition border"
                    onClick={() => window.open(message.attachment, "_blank")}
                  />
                ) : (
                  <a
                    href={message.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1.5 mt-1 text-blue-600"
                  >
                    <FiPaperclip size={12} />
                    {t("support.message.viewAttachment")}
                  </a>
                )}
              </div>
            )}
          </div>
          {message.created_at && (
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // User/Sales Messages - Left side (Original style)
  return (
    <div className="flex justify-start">
      <div className={`max-w-[70%] ${message.pending ? "opacity-70" : ""}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
            <FiUser size={12} className="text-blue-600" />
          </div>
          <span className="text-xs font-medium text-blue-600">
            {message.sender?.name || t("support.message.user")}
          </span>
          {message.pending && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <FiCheck size={10} />
              {t("support.message.sending")}
            </span>
          )}
        </div>
        <div className="rounded-2xl px-4 py-2.5 shadow-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md">
          {/* <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.message}
          </p> */}
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mt-3 mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold mt-3 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-sm leading-relaxed mb-2">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-5 mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-5 mb-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 text-sm">{children}</li>
              ),
            }}
          >
            {message.message}
          </ReactMarkdown>
          {message.attachment && (
            <div className="mt-2">
              {message.attachment.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                <img
                  src={message.attachment}
                  alt={t("support.message.attachment")}
                  className="max-w-[200px] max-h-[150px] rounded-lg cursor-pointer hover:opacity-90 transition border"
                  onClick={() => window.open(message.attachment, "_blank")}
                />
              ) : (
                <a
                  href={message.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs inline-flex items-center gap-1.5 mt-1 text-white/90"
                >
                  <FiPaperclip size={12} />
                  {t("support.message.viewAttachment")}
                </a>
              )}
            </div>
          )}
        </div>
        {message.created_at && (
          <div className="text-xs text-gray-400 mt-1">
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
