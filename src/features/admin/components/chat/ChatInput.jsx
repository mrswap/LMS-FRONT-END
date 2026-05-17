// import { useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addOptimisticMessage,
//   addRealtimeMessage,
//   removeOptimisticMessage,
//   sendReply,
// } from "../../../../redux/slice/supportSlice";
// import { FiSend, FiPaperclip, FiX, FiImage } from "react-icons/fi";

// const ChatInput = ({ threadId }) => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   const handleSend = async () => {
//     if ((!text.trim() && !file) || isSending) return;

//     let previewUrl = null;
//     let tempId = null;

//     try {
//       setIsSending(true);
//       tempId = Date.now();
//       previewUrl = file ? URL.createObjectURL(file) : null;

//       const optimisticMessage = {
//         tempId,
//         id: tempId,
//         thread_id: threadId,
//         message: text,
//         attachment: previewUrl,
//         is_admin: true,
//         pending: true,
//         created_at: new Date().toISOString(),
//         sender: {
//           name: "Support Team",
//           is_admin: true,
//         },
//       };

//       dispatch(addOptimisticMessage(optimisticMessage));

//       const formData = new FormData();
//       formData.append("message", text);
//       if (file) {
//         formData.append("attachment", file);
//       }

//       const response = await dispatch(
//         sendReply({ threadId, formData }),
//       ).unwrap();

//       dispatch(removeOptimisticMessage(tempId));

//       dispatch(addRealtimeMessage(response.data));

//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }

//       setText("");
//       setFile(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto";
//       }
//     } catch (error) {
//       console.error("Send message error:", error);
//       if (tempId) {
//         dispatch(removeOptimisticMessage(tempId));
//       }
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleTextChange = (e) => {
//     setText(e.target.value);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         Math.min(e.target.scrollHeight, 120) + "px";
//     }
//   };

//   return (
//     <div className="border-t border-gray-100 bg-white p-4">
//       {/* File Preview */}
//       {file && (
//         <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
//           {file.type.startsWith("image/") ? (
//             <div className="relative">
//               <img
//                 src={URL.createObjectURL(file)}
//                 alt="Preview"
//                 className="w-10 h-10 object-cover rounded-lg"
//               />
//               <FiImage className="absolute -bottom-1 -right-1 text-gray-500 text-[10px] bg-white rounded-full p-0.5" />
//             </div>
//           ) : (
//             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//               <FiPaperclip size={14} className="text-gray-500" />
//             </div>
//           )}
//           <span className="text-sm flex-1 truncate text-gray-600">
//             {file.name}
//           </span>
//           <button
//             onClick={() => setFile(null)}
//             className="text-gray-400 hover:text-red-500 transition p-1"
//           >
//             <FiX size={16} />
//           </button>
//         </div>
//       )}

//       <div className="flex items-center gap-2">
//         <div className="flex-1 relative">
//           <textarea
//             ref={textareaRef}
//             value={text}
//             onChange={handleTextChange}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your reply..."
//             rows={1}
//             className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
//             style={{ minHeight: "44px", maxHeight: "120px" }}
//           />
//           <div className="absolute right-2 bottom-3">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={(e) => setFile(e.target.files[0])}
//               className="hidden"
//               id="file-upload"
//             />
//             <label
//               htmlFor="file-upload"
//               className="cursor-pointer text-gray-400 hover:text-gray-600 transition p-1 block"
//             >
//               <FiPaperclip size={18} />
//             </label>
//           </div>
//         </div>
//         {/*
//         <button
//           onClick={handleSend}
//           disabled={(!text.trim() && !file) || isSending}
//           className={`
//             rounded-xl px-5 py-2.5 transition-all duration-200 flex items-center gap-2 h-[44px]
//             ${
//               (!text.trim() && !file) || isSending
//                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg"
//             }
//           `}
//         >
//           {isSending ? (
//             <>
//               <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                 />
//               </svg>
//               <span className="text-sm">Sending</span>
//             </>
//           ) : (
//             <>
//               <FiSend size={16} />
//               <span className="text-sm">Send</span>
//             </>
//           )}
//         </button> */}
//         <button
//           onClick={handleSend}
//           disabled={!text.trim() || isSending}
//           className={`
//     rounded-xl px-5 py-2.5 transition-all duration-200 flex items-center gap-2 h-[44px]
//     ${
//       !text.trim() || isSending
//         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//         : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg"
//     }
//   `}
//         >
//           {isSending ? (
//             <>
//               <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                 />
//               </svg>

//               <span className="text-sm">Sending</span>
//             </>
//           ) : (
//             <>
//               <FiSend size={16} />
//               <span className="text-sm">Send</span>
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOptimisticMessage,
  addRealtimeMessage,
  removeOptimisticMessage,
  sendReply,
} from "../../../../redux/slice/supportSlice";
import { FiSend, FiPaperclip, FiX, FiImage } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ChatInput = ({ threadId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if ((!text.trim() && !file) || isSending) return;

    let previewUrl = null;
    let tempId = null;

    try {
      setIsSending(true);
      tempId = Date.now();
      previewUrl = file ? URL.createObjectURL(file) : null;

      const optimisticMessage = {
        tempId,
        id: tempId,
        thread_id: threadId,
        message: text,
        attachment: previewUrl,
        is_admin: true,
        pending: true,
        created_at: new Date().toISOString(),
        sender: {
          name: t("support.message.supportTeam"),
          is_admin: true,
        },
      };

      dispatch(addOptimisticMessage(optimisticMessage));

      const formData = new FormData();
      formData.append("message", text);
      if (file) {
        formData.append("attachment", file);
      }

      const response = await dispatch(
        sendReply({ threadId, formData }),
      ).unwrap();

      dispatch(removeOptimisticMessage(tempId));
      dispatch(addRealtimeMessage(response.data));

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setText("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Send message error:", error);
      if (tempId) {
        dispatch(removeOptimisticMessage(tempId));
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(e.target.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white p-4">
      {/* File Preview */}
      {file && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
          {file.type.startsWith("image/") ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={t("support.chat.preview")}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <FiImage className="absolute -bottom-1 -right-1 text-gray-500 text-[10px] bg-white rounded-full p-0.5" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiPaperclip size={14} className="text-gray-500" />
            </div>
          )}
          <span className="text-sm flex-1 truncate text-gray-600">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-red-500 transition p-1"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={t("support.chat.typeReply")}
            rows={1}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <div className="absolute right-2 bottom-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition p-1 block"
            >
              <FiPaperclip size={18} />
            </label>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          className={`
            rounded-xl px-5 py-2.5 transition-all duration-200 flex items-center gap-2 h-[44px]
            ${
              !text.trim() || isSending
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg"
            }
          `}
        >
          {isSending ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm">{t("support.chat.sending")}</span>
            </>
          ) : (
            <>
              <FiSend size={16} />
              <span className="text-sm">{t("support.chat.send")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
