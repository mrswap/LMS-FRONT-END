// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaFileAlt,
//   FaVideo,
//   FaImage,
//   FaHeadphones,
//   FaCode,
//   FaExpand,
//   FaCompress,
//   FaArrowLeft,
//   FaFilePdf,
// } from "react-icons/fa";
// import Loader from "../../../../common/Loader";
// import { PageLayout } from "../../../../common/layout";
// import { getSingleContent } from "../../../../../../redux/slice/unitBuilderSlice";
// import { useTranslation } from "react-i18next";
// import Error from "../../../../common/Error";
// import { HiSpeakerWave } from "react-icons/hi2";
// import { FaPause, FaPlay } from "react-icons/fa";
// import { PiVinylRecordFill } from "react-icons/pi";
// import { GiSoundWaves } from "react-icons/gi";

// const RichTextContent = ({ htmlContent }) => {
//   if (!htmlContent) return null;
//   const contentRef = useRef(null);
//   const [displayHTML, setDisplayHTML] = useState(htmlContent || "");
//   const [isTranslating, setIsTranslating] = useState(false);
//   const isCancelledRef = useRef(false);
//   const docRef = useRef(null);
//   const blockElsRef = useRef([]);
//   const translatedSetRef = useRef(new Set());
//   const observerRef = useRef(null);

//   const translateText = async (text, targetLang) => {
//     try {
//       const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
//       const res = await fetch(url);
//       if (!res.ok) return text;
//       const data = await res.json();
//       return data[0]
//         .map((item) => item[0])
//         .filter(Boolean)
//         .join("");
//     } catch {
//       return text;
//     }
//   };

//   const translateElement = async (docEl, targetLang) => {
//     if (isCancelledRef.current) return;

//     const textNodes = [];
//     const walk = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT, null);
//     let node;
//     while ((node = walk.nextNode())) {
//       if (node.textContent.trim()) textNodes.push(node);
//     }

//     for (const n of textNodes) {
//       if (isCancelledRef.current) return;
//       if (!n.textContent.trim()) continue;
//       const translated = await translateText(n.textContent.trim(), targetLang);
//       if (isCancelledRef.current) return;
//       n.textContent = translated;
//     }

//     if (!isCancelledRef.current) {
//       setDisplayHTML(docRef.current.body.innerHTML);
//     }
//   };

//   // Step 1: htmlContent change hone pe doc prepare karo
//   useEffect(() => {
//     const lang = localStorage.getItem("appLanguage") || "en";
//     if (!htmlContent) return;

//     isCancelledRef.current = false;
//     translatedSetRef.current = new Set();
//     blockElsRef.current = [];

//     if (observerRef.current) {
//       observerRef.current.disconnect();
//       observerRef.current = null;
//     }

//     if (lang === "en") {
//       setDisplayHTML(htmlContent);
//       return;
//     }

//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlContent, "text/html");
//     docRef.current = doc;

//     const blockEls = Array.from(
//       doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th"),
//     ).filter((el) => el.textContent.trim());

//     if (blockEls.length === 0) {
//       // Koi block nahi — poora body translate karo
//       setIsTranslating(true);
//       translateElement(doc.body, lang).finally(() => {
//         if (!isCancelledRef.current) setIsTranslating(false);
//       });
//       return;
//     }

//     // data-tid lagao
//     blockEls.forEach((el, idx) => el.setAttribute("data-tid", String(idx)));
//     blockElsRef.current = blockEls;

//     // data-tid wala HTML render karo
//     setDisplayHTML(doc.body.innerHTML);

//     return () => {
//       isCancelledRef.current = true;
//       if (observerRef.current) observerRef.current.disconnect();
//       setIsTranslating(false);
//     };
//   }, [htmlContent]);

//   // Step 2: displayHTML render hone ke baad observer lagao
//   useEffect(() => {
//     const lang = localStorage.getItem("appLanguage") || "en";
//     if (lang === "en") return;
//     if (!contentRef.current) return;
//     if (blockElsRef.current.length === 0) return;
//     if (isCancelledRef.current) return;

//     // Purana observer disconnect karo
//     if (observerRef.current) observerRef.current.disconnect();

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) return;

//           const tid = entry.target.getAttribute("data-tid");
//           if (tid === null) return;
//           if (translatedSetRef.current.has(tid)) return;

//           translatedSetRef.current.add(tid);
//           observer.unobserve(entry.target);

//           const docEl = blockElsRef.current[Number(tid)];
//           if (!docEl) return;

//           setIsTranslating(true);
//           translateElement(docEl, lang).finally(() => {
//             if (isCancelledRef.current) return;
//             if (translatedSetRef.current.size >= blockElsRef.current.length) {
//               setIsTranslating(false);
//             }
//           });
//         });
//       },
//       {
//         root: null,
//         rootMargin: "400px 0px",
//         threshold: 0,
//       },
//     );

//     observerRef.current = observer;

//     // Saare data-tid elements observe karo
//     const realEls = contentRef.current.querySelectorAll("[data-tid]");
//     realEls.forEach((el) => {
//       const tid = el.getAttribute("data-tid");
//       // Already translated nahi hai toh observe karo
//       if (!translatedSetRef.current.has(tid)) {
//         observer.observe(el);
//       }
//     });

//     return () => {
//       observer.disconnect();
//     };
//   }, [displayHTML]); // displayHTML change hone pe dobara observe lagao

//   if (!htmlContent) return null;

//   return (
//     <>
//       <div
//         ref={contentRef}
//         className="custom-content"
//         dangerouslySetInnerHTML={{ __html: displayHTML }}
//       />

//       {isTranslating && (
//         <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
//           <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
//           <span>Translating...</span>
//         </div>
//       )}

//       <style>{`
//         .custom-content p { margin: 0 0 16px; line-height: 1.8; }
//         .custom-content h1, .custom-content h2, .custom-content h3,
//         .custom-content h4, .custom-content h5, .custom-content h6 {
//           margin: 24px 0 16px; font-weight: 700; line-height: 1.4;
//         }
//         .custom-content ul, .custom-content ol { margin: 0 0 16px; padding-left: 24px; }
//         .custom-content li { margin-bottom: 8px; }
//         .custom-content hr { margin: 24px 0; border: none; border-top: 1px solid #d1d5db; }
//         .custom-content table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #d1d5db; }
//         .custom-content td, .custom-content th { border: 1px solid #d1d5db; padding: 12px; vertical-align: top; }
//         .custom-content th { background-color: #f3f4f6; font-weight: 600; }
//         .custom-content img { max-width: 100%; height: auto; border-radius: 8px; }
//       `}</style>
//     </>
//   );
// };

// const SingleContentPreview = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { topicId, contentId } = useParams();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const iframeRef = useRef(null);
//   const fullscreenContainerRef = useRef(null);
//   const [showAudioPlayer, setShowAudioPlayer] = useState(false);

//   const { currentContent, isLoading, isError, message } = useSelector(
//     (state) => state.content,
//   );

//   const content = currentContent?.current;

//   // Load H5P resizer script dynamically
//   useEffect(() => {
//     const mediaType = content?.media?.type || content?.type;
//     if (mediaType === "h5p" && content?.media?.full_url) {
//       const scriptId = "h5p-resizer-script-content";

//       if (!document.getElementById(scriptId)) {
//         const script = document.createElement("script");
//         script.id = scriptId;
//         script.src = "https://abc10nst.h5p.com/js/h5p-resizer.js";
//         script.charset = "UTF-8";
//         script.async = true;

//         script.onload = () => {
//           // console.log("H5P Resizer script loaded successfully");
//           if (window.H5P && window.H5P.resize) {
//             window.H5P.resize();
//           }
//         };

//         document.head.appendChild(script);
//       }
//     }
//   }, [content]);

//   // Fullscreen scrolling fix
//   useEffect(() => {
//     if (isFullscreen) {
//       document.body.style.overflow = "hidden";
//       document.documentElement.style.overflow = "hidden";

//       return () => {
//         document.body.style.overflow = "";
//         document.documentElement.style.overflow = "";
//       };
//     }
//   }, [isFullscreen]);

//   const getEmbedUrl = (url) => {
//     if (!url) return null;

//     if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
//       let videoId = "";
//       if (url.includes("youtube.com/watch")) {
//         videoId = new URL(url).searchParams.get("v");
//       } else {
//         videoId = url.split("/").pop();
//       }
//       return `https://www.youtube.com/embed/${videoId}`;
//     }

//     if (url.includes("vimeo.com")) {
//       const videoId = url.split("/").pop();
//       return `https://player.vimeo.com/video/${videoId}`;
//     }

//     return null;
//   };

//   useEffect(() => {
//     if (topicId && contentId) {
//       dispatch(getSingleContent({ topicId, contentId }));
//     }
//   }, [topicId, contentId, dispatch]);

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//   };

//   const renderH5PContent = () => {
//     const h5pUrl = content?.media?.full_url || content?.content;
//     const cleanUrl = h5pUrl?.split("?")[0];

//     if (isFullscreen) {
//       return (
//         <div className="fixed inset-0 z-50 bg-white">
//           <div className="h-full flex flex-col">
//             <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center shadow-sm">
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={toggleFullscreen}
//                   className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
//                 >
//                   <FaCompress size={14} />
//                   <span>
//                     {t("singlePreviewContent.exitFullscreen") ||
//                       "Exit Fullscreen"}
//                   </span>
//                 </button>
//                 <div className="h-5 w-px bg-gray-300"></div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {content?.title}
//                 </span>
//               </div>
//             </div>

//             <div
//               ref={fullscreenContainerRef}
//               className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50"
//               style={{
//                 WebkitOverflowScrolling: "touch",
//                 position: "relative",
//               }}
//             >
//               <div className="min-h-full w-full p-4">
//                 <div className="max-w-7xl mx-auto">
//                   <div className="bg-white rounded-lg shadow-lg">
//                     <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//                       <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//                         <FaCode className="text-blue-600" />
//                         {t("singlePreviewContent.h5p.interactive") ||
//                           "Interactive H5P Content"}
//                       </span>
//                     </div>
//                     <div
//                       className="w-full"
//                       style={{
//                         minHeight: "calc(100vh - 120px)",
//                         height: "auto",
//                       }}
//                     >
//                       <iframe
//                         ref={iframeRef}
//                         src={cleanUrl}
//                         width="100%"
//                         height="100%"
//                         frameBorder="0"
//                         allowFullScreen
//                         allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
//                         title={content?.title}
//                         style={{
//                           display: "block",
//                           minHeight: "calc(100vh - 120px)",
//                           height: "auto",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center rounded-t-lg">
//           <div className="flex items-center gap-2">
//             <FaCode className="text-blue-600 text-sm" />
//             <span className="text-xs font-medium text-gray-700">
//               {t("singlePreviewContent.h5p.interactive") ||
//                 "Interactive H5P Content"}
//             </span>
//           </div>
//           <button
//             onClick={toggleFullscreen}
//             className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
//             title={t("singlePreviewContent.fullscreen") || "Fullscreen"}
//           >
//             <FaExpand size={14} />
//             <span className="text-xs">
//               {t("singlePreviewContent.fullscreen") || "Fullscreen"}
//             </span>
//           </button>
//         </div>
//         <div className="h-[550px]">
//           <iframe
//             ref={iframeRef}
//             src={cleanUrl}
//             width="100%"
//             height="100%"
//             frameBorder="0"
//             allowFullScreen
//             allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
//             title={content?.title}
//           />
//         </div>
//         {content?.content && (
//           <div className="p-6 border-t border-gray-200">
//             <RichTextContent htmlContent={content?.content} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderPDFContent = () => {
//     const pdfUrl = content?.media?.full_url || content?.content;

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//           <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//             <FaFilePdf className="text-red-500" />
//             {t("singlePreviewContent.pdf.title") || "PDF Document"}
//           </span>
//         </div>
//         <div className="h-[calc(100vh-200px)] min-h-[550px]">
//           <iframe
//             src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
//             title={content?.title}
//             className="w-full h-full border-0"
//           />
//         </div>
//         {content?.content && content?.content !== "<p>hello</p>" && (
//           <div className="p-6 border-t border-gray-200">
//             <RichTextContent htmlContent={content?.content} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderVideoContent = () => {
//     const videoUrl = content?.media?.full_url || content?.media?.external_url;
//     const embedUrl = getEmbedUrl(videoUrl);
//     const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//           <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//             <FaVideo className="text-blue-500" />
//             {t("singlePreviewContent.types.video") || "Video Content"}
//           </span>
//         </div>
//         <div className="h-[550px]">
//           {isDirectVideo ? (
//             <video controls className="w-full h-full">
//               <source src={videoUrl} type="video/mp4" />
//             </video>
//           ) : embedUrl ? (
//             <iframe
//               src={embedUrl}
//               title={content?.title}
//               className="w-full h-full"
//               allowFullScreen
//             />
//           ) : (
//             <div className="text-center py-12 bg-gray-50 rounded">
//               <FaVideo className="text-5xl text-gray-400 mx-auto mb-3" />
//               <p className="text-gray-500 text-sm">
//                 {t("singlePreviewContent.videoNotAvailable") ||
//                   "Video preview not available"}
//               </p>
//             </div>
//           )}
//         </div>
//         {content?.content && (
//           <div className="p-6 border-t border-gray-200">
//             <RichTextContent htmlContent={content?.content} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderImageContent = () => {
//     const imageUrl = content?.media?.full_url || content?.content;

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//           <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//             <FaImage className="text-green-500" />
//             {t("singlePreviewContent.types.image") || "Image Content"}
//           </span>
//         </div>
//         <div className="h-[550px] overflow-auto p-4">
//           <div className="flex justify-center items-center min-h-full">
//             <img
//               src={imageUrl}
//               alt={content?.title}
//               className="max-w-full h-auto object-contain rounded shadow-sm"
//               onError={(e) => {
//                 e.target.src =
//                   "https://placehold.co/600x400?text=Image+Not+Found";
//               }}
//             />
//           </div>
//         </div>
//         {content?.content && (
//           <div className="p-6 border-t border-gray-200">
//             <RichTextContent htmlContent={content?.content} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderAudioContent = () => {
//     const audioUrl = content?.media?.full_url || content?.content;

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//           <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//             <FaHeadphones className="text-purple-500" />
//             {t("singlePreviewContent.types.audio") || "Audio Content"}
//           </span>
//         </div>
//         <div className="p-6">
//           <div className="max-w-md mx-auto text-center">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaHeadphones className="text-2xl text-green-600" />
//             </div>
//             <audio controls className="w-full">
//               <source src={audioUrl} type="audio/mpeg" />
//               {t("singlePreviewContent.audioNotSupported") ||
//                 "Your browser does not support the audio element."}
//             </audio>
//           </div>
//         </div>
//         {content?.content && (
//           <div className="p-6 border-t border-gray-200">
//             <RichTextContent htmlContent={content?.content} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderTextContent = () => {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
//           <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
//             <FaFileAlt className="text-gray-500" />
//             {t("singlePreviewContent.types.text") || "Text Content"}
//           </span>
//         </div>
//         <div className="p-6">
//           <RichTextContent htmlContent={content?.content || content?.body} />
//         </div>
//       </div>
//     );
//   };

//   const renderContent = () => {
//     if (!content) return null;

//     // Get media type from media object or direct type
//     const mediaType = content?.media?.type || content?.type;

//     switch (mediaType) {
//       case "h5p":
//         return renderH5PContent();
//       case "document":
//       case "pdf":
//         return renderPDFContent();
//       case "video":
//         return renderVideoContent();
//       case "image":
//         return renderImageContent();
//       case "audio":
//         return renderAudioContent();
//       case "text":
//         return renderTextContent();
//       default:
//         // Agar koi content hai to text ki tarah show karo
//         if (content?.content || content?.body) {
//           return renderTextContent();
//         }
//         return (
//           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
//             <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-3" />
//             <p className="text-gray-500">
//               {t("singlePreviewContent.noContent") || "No content available"}
//             </p>
//           </div>
//         );
//     }
//   };

//   if (isLoading) {
//     return (
//       <PageLayout>
//         <div className="flex justify-center items-center h-[80vh]">
//           <Loader />
//         </div>
//       </PageLayout>
//     );
//   }

//   if (isError || !content) {
//     return (
//       <PageLayout>
//         <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//             <FaFileAlt className="text-2xl text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//             {t("singlePreviewContent.notFound.title")}
//           </h3>
//           <p className="text-gray-500 text-sm mb-5">
//             {message || t("singlePreviewContent.notFound.description")}
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
//           >
//             {t("singlePreviewContent.notFound.button")}
//           </button>
//         </div>
//       </PageLayout>
//     );
//   }

//   // Main Layout - No Header Title/Subtitle, Sirf Back Button aur Content
//   // return (
//   //   <PageLayout>
//   //     <div className="h-full flex flex-col">
//   //       <button
//   //         onClick={() => navigate(-1)}
//   //         className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors mb-4 w-fit"
//   //       >
//   //         <FaArrowLeft size={16} />
//   //         <span className="text-sm font-medium">
//   //           {t("singlePreviewContent.back") || "Back"}
//   //         </span>
//   //       </button>

//   //       <div className="flex-1 overflow-y-auto">
//   //         <div className="pb-6">
//   //           <div className="max-w-6xl mx-auto">{renderContent()}</div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </PageLayout>
//   // );

//   return (
//     <PageLayout>
//       <div className="h-full flex flex-col">
//         {/* Header with Back button and Speaker button together */}
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors w-fit"
//           >
//             <FaArrowLeft size={16} />
//             <span className="text-sm font-medium">
//               {t("singlePreviewContent.back") || "Back"}
//             </span>
//           </button>

//           {/* Speaker button - bilkul TopicContent jaisa */}
//           {content?.audio_url && (
//             <button
//               onClick={() => setShowAudioPlayer(!showAudioPlayer)}
//               className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
//             >
//               <HiSpeakerWave className="text-xl text-gray-600" />
//             </button>
//           )}
//         </div>

//         {/* Audio Player - bilkul TopicContent jaisa */}
//         {showAudioPlayer && content?.audio_url && (
//           <div className="mb-6">
//             <ClassicAudioPlayer
//               audioUrl={content?.audio_url}
//               title={content?.title || "Audio Lesson"}
//             />
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto">
//           <div className="pb-6">
//             <div className="max-w-6xl mx-auto">{renderContent()}</div>
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   );
// };

// export default SingleContentPreview;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaVideo,
  FaImage,
  FaHeadphones,
  FaCode,
  FaExpand,
  FaCompress,
  FaArrowLeft,
  FaFilePdf,
  FaSearchPlus,
  FaSearchMinus,
  FaTimes,
} from "react-icons/fa";
import Loader from "../../../../common/Loader";
import { PageLayout } from "../../../../common/layout";
import { getSingleContent } from "../../../../../../redux/slice/unitBuilderSlice";
import { useTranslation } from "react-i18next";
import Error from "../../../../common/Error";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaPause, FaPlay } from "react-icons/fa";
import { PiVinylRecordFill } from "react-icons/pi";
import { GiSoundWaves } from "react-icons/gi";

// ---------- ImageZoomModal ----------
// Global lightbox: listens for "open-image-zoom" CustomEvent from anywhere
// (rich text images, dedicated image content, etc.).
// Only 2 controls: zoom-in and zoom-out icons.
const ImageZoomModal = () => {
  const [image, setImage] = useState(null); // { src, alt }
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const STEP = 0.5;

  const clampScale = (s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  useEffect(() => {
    const handleOpen = (e) => {
      setImage(e.detail);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    };
    window.addEventListener("open-image-zoom", handleOpen);
    return () => window.removeEventListener("open-image-zoom", handleOpen);
  }, []);

  useEffect(() => {
    if (image) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [image]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!image) return;
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const close = () => setImage(null);

  const zoomIn = () => setScale((s) => clampScale(+(s + STEP).toFixed(2)));
  const zoomOut = () =>
    setScale((s) => {
      const next = clampScale(+(s - STEP).toFixed(2));
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };
  const handleMouseUp = () => setIsDragging(false);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/95 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
          title="Zoom out"
        >
          <FaSearchMinus size={15} />
        </button>
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/95 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
          title="Zoom in"
        >
          <FaSearchPlus size={15} />
        </button>
        <button
          onClick={close}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/95 text-gray-700 hover:bg-white shadow-sm cursor-pointer"
          title="Close"
        >
          <FaTimes size={16} />
        </button>
      </div>

      <div
        className="w-full h-full flex items-center justify-center overflow-hidden px-6"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          draggable={false}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            maxHeight: "85vh",
            maxWidth: "90vw",
          }}
          className="object-contain select-none rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

// ---------- ClassicAudioPlayer ----------
const ClassicAudioPlayer = ({
  audioUrl,
  title = "Audio Lesson",
  playerKey,
}) => {
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };
  }, [audioUrl, playerKey]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="professional-audio-player">
      <style>{`
        .professional-audio-player {
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 16px 20px;
          transition: all 0.2s ease;
        }
        .professional-audio-player:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-color: #dee2e6;
        }
        .professional-audio-player .icon-container {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          transition: all 0.2s ease;
        }
        .professional-audio-player .play-btn {
          background: #3b82f6;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        .professional-audio-player .play-btn:hover {
          background: #2563eb;
          transform: scale(1.02);
          box-shadow: 0 2px 6px rgba(59,130,246,0.3);
        }
        .professional-audio-player .play-btn:active {
          transform: scale(0.98);
        }
        .professional-audio-player .time-display {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: 500;
          color: #6c757d;
        }
        .professional-audio-player input[type="range"] {
          -webkit-appearance: none;
          background: #e9ecef;
          height: 4px;
          border-radius: 4px;
          cursor: pointer;
        }
        .professional-audio-player input[type="range"]:focus {
          outline: none;
        }
        .professional-audio-player input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .professional-audio-player input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #2563eb;
        }
        .professional-audio-player .progress-bg {
          background: #e9ecef;
          border-radius: 4px;
          height: 4px;
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .professional-audio-player .progress-fill {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 4px;
          height: 100%;
          width: 0%;
          transition: width 0.1s linear;
          position: relative;
        }
        .professional-audio-player .title-text {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          letter-spacing: -0.2px;
        }
        .professional-audio-player .subtitle {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .professional-audio-player .wave-playing {
          animation: subtlePulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
        <div className="icon-container hidden sm:flex items-center justify-center w-12 h-12 rounded-xl">
          {isPlaying ? (
            <GiSoundWaves className="text-xl text-gray-600 wave-playing" />
          ) : (
            <PiVinylRecordFill className="text-xl text-gray-500" />
          )}
        </div>

        <button
          onClick={toggleAudio}
          className="play-btn w-10 h-10 rounded-full flex items-center justify-center text-white transition-all cursor-pointer"
        >
          {isPlaying ? (
            <FaPause size={14} />
          ) : (
            <FaPlay size={14} className="ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="title-text truncate">{title}</h3>
            <span className="subtitle hidden sm:inline">
              {t("topicContent.audio.classicAudio")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="time-display min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <div className="progress-bg">
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 2 }}
              />
            </div>
            <span className="time-display min-w-[40px] text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

const RichTextContent = ({ htmlContent }) => {
  if (!htmlContent) return null;
  const contentRef = useRef(null);
  const [displayHTML, setDisplayHTML] = useState(htmlContent || "");
  const [isTranslating, setIsTranslating] = useState(false);
  const isCancelledRef = useRef(false);
  const docRef = useRef(null);
  const blockElsRef = useRef([]);
  const translatedSetRef = useRef(new Set());
  const observerRef = useRef(null);

  const translateText = async (text, targetLang) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) return text;
      const data = await res.json();
      return data[0]
        .map((item) => item[0])
        .filter(Boolean)
        .join("");
    } catch {
      return text;
    }
  };

  const translateElement = async (docEl, targetLang) => {
    if (isCancelledRef.current) return;

    const textNodes = [];
    const walk = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walk.nextNode())) {
      if (node.textContent.trim()) textNodes.push(node);
    }

    for (const n of textNodes) {
      if (isCancelledRef.current) return;
      if (!n.textContent.trim()) continue;
      const translated = await translateText(n.textContent.trim(), targetLang);
      if (isCancelledRef.current) return;
      n.textContent = translated;
    }

    if (!isCancelledRef.current) {
      setDisplayHTML(docRef.current.body.innerHTML);
    }
  };

  // Step 1: htmlContent change hone pe doc prepare karo
  useEffect(() => {
    const lang = localStorage.getItem("appLanguage") || "en";
    if (!htmlContent) return;

    isCancelledRef.current = false;
    translatedSetRef.current = new Set();
    blockElsRef.current = [];

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (lang === "en") {
      setDisplayHTML(htmlContent);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    docRef.current = doc;

    const blockEls = Array.from(
      doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li, td, th"),
    ).filter((el) => el.textContent.trim());

    if (blockEls.length === 0) {
      // Koi block nahi — poora body translate karo
      setIsTranslating(true);
      translateElement(doc.body, lang).finally(() => {
        if (!isCancelledRef.current) setIsTranslating(false);
      });
      return;
    }

    // data-tid lagao
    blockEls.forEach((el, idx) => el.setAttribute("data-tid", String(idx)));
    blockElsRef.current = blockEls;

    // data-tid wala HTML render karo
    setDisplayHTML(doc.body.innerHTML);

    return () => {
      isCancelledRef.current = true;
      if (observerRef.current) observerRef.current.disconnect();
      setIsTranslating(false);
    };
  }, [htmlContent]);

  // Step 2: displayHTML render hone ke baad observer lagao
  useEffect(() => {
    const lang = localStorage.getItem("appLanguage") || "en";
    if (lang === "en") return;
    if (!contentRef.current) return;
    if (blockElsRef.current.length === 0) return;
    if (isCancelledRef.current) return;

    // Purana observer disconnect karo
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const tid = entry.target.getAttribute("data-tid");
          if (tid === null) return;
          if (translatedSetRef.current.has(tid)) return;

          translatedSetRef.current.add(tid);
          observer.unobserve(entry.target);

          const docEl = blockElsRef.current[Number(tid)];
          if (!docEl) return;

          setIsTranslating(true);
          translateElement(docEl, lang).finally(() => {
            if (isCancelledRef.current) return;
            if (translatedSetRef.current.size >= blockElsRef.current.length) {
              setIsTranslating(false);
            }
          });
        });
      },
      {
        root: null,
        rootMargin: "400px 0px",
        threshold: 0,
      },
    );

    observerRef.current = observer;

    // Saare data-tid elements observe karo
    const realEls = contentRef.current.querySelectorAll("[data-tid]");
    realEls.forEach((el) => {
      const tid = el.getAttribute("data-tid");
      // Already translated nahi hai toh observe karo
      if (!translatedSetRef.current.has(tid)) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [displayHTML]); // displayHTML change hone pe dobara observe lagao

  // Step 3: images pe click-to-zoom lagao (TopicContent jaisa)
  // displayHTML change hone pe (translation ke baad bhi) dobara attach karo
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const images = container.querySelectorAll("img");

    const handleClick = (e) => {
      const img = e.currentTarget;
      window.dispatchEvent(
        new CustomEvent("open-image-zoom", {
          detail: { src: img.src, alt: img.alt || "" },
        }),
      );
    };

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.setAttribute("title", "Click to zoom");
      img.addEventListener("click", handleClick);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", handleClick);
      });
    };
  }, [displayHTML]);

  if (!htmlContent) return null;

  return (
    <>
      <div
        ref={contentRef}
        className="custom-content"
        dangerouslySetInnerHTML={{ __html: displayHTML }}
      />

      {isTranslating && (
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span>Translating...</span>
        </div>
      )}

      <style>{`
        .custom-content p { margin: 0 0 16px; line-height: 1.8; }
        .custom-content h1, .custom-content h2, .custom-content h3,
        .custom-content h4, .custom-content h5, .custom-content h6 {
          margin: 24px 0 16px; font-weight: 700; line-height: 1.4;
        }
        .custom-content ul, .custom-content ol { margin: 0 0 16px; padding-left: 24px; }
        .custom-content li { margin-bottom: 8px; }
        .custom-content hr { margin: 24px 0; border: none; border-top: 1px solid #d1d5db; }
        .custom-content table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #d1d5db; }
        .custom-content td, .custom-content th { border: 1px solid #d1d5db; padding: 12px; vertical-align: top; }
        .custom-content th { background-color: #f3f4f6; font-weight: 600; }
        .custom-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .custom-content img:hover {
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
      `}</style>
    </>
  );
};

const SingleContentPreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { topicId, contentId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const fullscreenContainerRef = useRef(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const { currentContent, isLoading, isError, message } = useSelector(
    (state) => state.content,
  );

  const content = currentContent?.current;

  // Load H5P resizer script dynamically
  useEffect(() => {
    const mediaType = content?.media?.type || content?.type;
    if (mediaType === "h5p" && content?.media?.full_url) {
      const scriptId = "h5p-resizer-script-content";

      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://abc10nst.h5p.com/js/h5p-resizer.js";
        script.charset = "UTF-8";
        script.async = true;

        script.onload = () => {
          if (window.H5P && window.H5P.resize) {
            window.H5P.resize();
          }
        };

        document.head.appendChild(script);
      }
    }
  }, [content]);

  // Fullscreen scrolling fix
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    }
  }, [isFullscreen]);

  const getEmbedUrl = (url) => {
    if (!url) return null;

    if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v");
      } else {
        videoId = url.split("/").pop();
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
  };

  useEffect(() => {
    if (topicId && contentId) {
      dispatch(getSingleContent({ topicId, contentId }));
    }
  }, [topicId, contentId, dispatch]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderH5PContent = () => {
    const h5pUrl = content?.media?.full_url || content?.content;
    const cleanUrl = h5pUrl?.split("?")[0];

    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaCompress size={14} />
                  <span>
                    {t("singlePreviewContent.exitFullscreen") ||
                      "Exit Fullscreen"}
                  </span>
                </button>
                <div className="h-5 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-700">
                  {content?.title}
                </span>
              </div>
            </div>

            <div
              ref={fullscreenContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50"
              style={{
                WebkitOverflowScrolling: "touch",
                position: "relative",
              }}
            >
              <div className="min-h-full w-full p-4">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-white rounded-lg shadow-lg">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
                      <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                        <FaCode className="text-blue-600" />
                        {t("singlePreviewContent.h5p.interactive") ||
                          "Interactive H5P Content"}
                      </span>
                    </div>
                    <div
                      className="w-full"
                      style={{
                        minHeight: "calc(100vh - 120px)",
                        height: "auto",
                      }}
                    >
                      <iframe
                        ref={iframeRef}
                        src={cleanUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                        title={content?.title}
                        style={{
                          display: "block",
                          minHeight: "calc(100vh - 120px)",
                          height: "auto",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <FaCode className="text-blue-600 text-sm" />
            <span className="text-xs font-medium text-gray-700">
              {t("singlePreviewContent.h5p.interactive") ||
                "Interactive H5P Content"}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            title={t("singlePreviewContent.fullscreen") || "Fullscreen"}
          >
            <FaExpand size={14} />
            <span className="text-xs">
              {t("singlePreviewContent.fullscreen") || "Fullscreen"}
            </span>
          </button>
        </div>
        <div className="h-[550px]">
          <iframe
            ref={iframeRef}
            src={cleanUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
            title={content?.title}
          />
        </div>
        {content?.content && (
          <div className="p-6 border-t border-gray-200">
            <RichTextContent htmlContent={content?.content} />
          </div>
        )}
      </div>
    );
  };

  const renderPDFContent = () => {
    const pdfUrl = content?.media?.full_url || content?.content;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaFilePdf className="text-red-500" />
            {t("singlePreviewContent.pdf.title") || "PDF Document"}
          </span>
        </div>
        <div className="h-[calc(100vh-200px)] min-h-[550px]">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title={content?.title}
            className="w-full h-full border-0"
          />
        </div>
        {content?.content && content?.content !== "<p>hello</p>" && (
          <div className="p-6 border-t border-gray-200">
            <RichTextContent htmlContent={content?.content} />
          </div>
        )}
      </div>
    );
  };

  const renderVideoContent = () => {
    const videoUrl = content?.media?.full_url || content?.media?.external_url;
    const embedUrl = getEmbedUrl(videoUrl);
    const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaVideo className="text-blue-500" />
            {t("singlePreviewContent.types.video") || "Video Content"}
          </span>
        </div>
        <div className="h-[550px]">
          {isDirectVideo ? (
            <video controls className="w-full h-full">
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={content?.title}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded">
              <FaVideo className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {t("singlePreviewContent.videoNotAvailable") ||
                  "Video preview not available"}
              </p>
            </div>
          )}
        </div>
        {content?.content && (
          <div className="p-6 border-t border-gray-200">
            <RichTextContent htmlContent={content?.content} />
          </div>
        )}
      </div>
    );
  };

  const renderImageContent = () => {
    const imageUrl = content?.media?.full_url || content?.content;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaImage className="text-green-500" />
            {t("singlePreviewContent.types.image") || "Image Content"}
          </span>
        </div>
        <div className="h-[550px] overflow-auto p-4">
          <div className="flex justify-center items-center min-h-full">
            <img
              src={imageUrl}
              alt={content?.title}
              title="Click to zoom"
              className="max-w-full h-auto object-contain rounded shadow-sm cursor-zoom-in hover:opacity-95 transition"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-image-zoom", {
                    detail: { src: imageUrl, alt: content?.title || "" },
                  }),
                )
              }
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/600x400?text=Image+Not+Found";
              }}
            />
          </div>
        </div>
        {content?.content && (
          <div className="p-6 border-t border-gray-200">
            <RichTextContent htmlContent={content?.content} />
          </div>
        )}
      </div>
    );
  };

  const renderAudioContent = () => {
    const audioUrl = content?.media?.full_url || content?.content;
    const audioKey = `audio-${content?.id}-${audioUrl}`;

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaHeadphones className="text-purple-500" />
            {t("singlePreviewContent.types.audio") || "Audio Content"}
          </span>
        </div>
        <div className="p-6">
          <div className="max-w-md mx-auto">
            <ClassicAudioPlayer
              playerKey={audioKey}
              audioUrl={audioUrl}
              title={content?.title || t("topicContent.audio.lesson")}
            />
          </div>
        </div>
        {content?.content && (
          <div className="p-6 border-t border-gray-200">
            <RichTextContent htmlContent={content?.content} />
          </div>
        )}
      </div>
    );
  };

  const renderTextContent = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaFileAlt className="text-gray-500" />
            {t("singlePreviewContent.types.text") || "Text Content"}
          </span>
        </div>
        <div className="p-6">
          <RichTextContent htmlContent={content?.content || content?.body} />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!content) return null;

    // Get media type from media object or direct type
    const mediaType = content?.media?.type || content?.type;

    switch (mediaType) {
      case "h5p":
        return renderH5PContent();
      case "document":
      case "pdf":
        return renderPDFContent();
      case "video":
        return renderVideoContent();
      case "image":
        return renderImageContent();
      case "audio":
        return renderAudioContent();
      case "text":
        return renderTextContent();
      default:
        // Agar koi content hai to text ki tarah show karo
        if (content?.content || content?.body) {
          return renderTextContent();
        }
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {t("singlePreviewContent.noContent") || "No content available"}
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <Loader />
        </div>
      </PageLayout>
    );
  }

  if (isError || !content) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaFileAlt className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t("singlePreviewContent.notFound.title")}
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            {message || t("singlePreviewContent.notFound.description")}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            {t("singlePreviewContent.notFound.button")}
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header with Back button and Speaker button together */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors w-fit"
          >
            <FaArrowLeft size={16} />
            <span className="text-sm font-medium">
              {t("singlePreviewContent.back") || "Back"}
            </span>
          </button>

          {/* Speaker button - bilkul TopicContent jaisa */}
          {content?.audio_url && (
            <button
              onClick={() => setShowAudioPlayer(!showAudioPlayer)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              <HiSpeakerWave className="text-xl text-gray-600" />
            </button>
          )}
        </div>

        {/* Audio Player - bilkul TopicContent jaisa */}
        {showAudioPlayer && content?.audio_url && (
          <div className="mb-6">
            <ClassicAudioPlayer
              playerKey={`audio-content-${content?.id}`}
              audioUrl={content?.audio_url}
              title={content?.title || "Audio Lesson"}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="pb-6">
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </div>
        </div>
      </div>

      <ImageZoomModal />
    </PageLayout>
  );
};

export default SingleContentPreview;
