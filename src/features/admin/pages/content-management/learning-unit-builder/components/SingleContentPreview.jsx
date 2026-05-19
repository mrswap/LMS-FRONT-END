// import React, { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaFileAlt,
//   FaVideo,
//   FaImage,
//   FaHeadphones,
//   FaBookOpen,
// } from "react-icons/fa";
// import { MdArrowBack, MdPictureAsPdf } from "react-icons/md";
// import Loader from "../../../../common/Loader";
// import { PageLayout, PageBody } from "../../../../common/layout";
// import { getSingleContent } from "../../../../../../redux/slice/unitBuilderSlice";
// import { useTranslation } from "react-i18next";
// import Error from "../../../../common/Error";

// // Common component for HTML content with styles
// const RichTextContent = ({ htmlContent }) => {
//   if (!htmlContent) return null;

//   return (
//     <>
//       <div
//         className="custom-content"
//         dangerouslySetInnerHTML={{ __html: htmlContent }}
//       />
//       <style>{`
//         .custom-content p {
//           margin: 0 0 16px;
//           line-height: 1.8;
//         }
//         .custom-content h1,
//         .custom-content h2,
//         .custom-content h3,
//         .custom-content h4,
//         .custom-content h5,
//         .custom-content h6 {
//           margin: 24px 0 16px;
//           font-weight: 700;
//           line-height: 1.4;
//         }
//         .custom-content ul,
//         .custom-content ol {
//           margin: 0 0 16px;
//           padding-left: 24px;
//         }
//         .custom-content li {
//           margin-bottom: 8px;
//         }
//         .custom-content hr {
//           margin: 24px 0;
//           border: none;
//           border-top: 1px solid #d1d5db;
//         }
//         .custom-content table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//           border: 1px solid #d1d5db;
//         }
//         .custom-content td,
//         .custom-content th {
//           border: 1px solid #d1d5db;
//           padding: 12px;
//           vertical-align: top;
//         }
//         .custom-content th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .custom-content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 8px;
//         }
//       `}</style>
//     </>
//   );
// };

// // Common Content Wrapper - same layout for all content types
// const ContentWrapper = ({ children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//     <div className="p-6">{children}</div>
//   </div>
// );

// const SingleContentPreview = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { topicId, contentId } = useParams();
//   const hasMarkedRead = useRef(false);

//   const { currentContent, isLoading, isError, message } = useSelector(
//     (state) => state.content,
//   );

//   const content = currentContent?.current;

//   const getEmbedUrl = (url) => {
//     if (!url) return null;

//     // YouTube
//     if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
//       let videoId = "";

//       if (url.includes("youtube.com/watch")) {
//         videoId = new URL(url).searchParams.get("v");
//       } else {
//         videoId = url.split("/").pop();
//       }

//       return `https://www.youtube.com/embed/${videoId}`;
//     }

//     // Vimeo
//     if (url.includes("vimeo.com")) {
//       const videoId = url.split("/").pop();
//       return `https://player.vimeo.com/video/${videoId}`;
//     }

//     return null;
//   };

//   useEffect(() => {
//     if (topicId && contentId) {
//       dispatch(getSingleContent({ topicId, contentId }));
//       hasMarkedRead.current = false;
//     }
//   }, [topicId, contentId, dispatch]);

//   const renderTextContent = () => (
//     <ContentWrapper>
//       <RichTextContent htmlContent={content?.body || content?.content} />
//     </ContentWrapper>
//   );

//   const renderVideoContent = () => {
//     const videoUrl = content?.meta?.full_url || content?.media?.full_url;

//     const embedUrl = getEmbedUrl(videoUrl);

//     const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

//     return (
//       <ContentWrapper>
//         {/* Direct Video */}
//         {isDirectVideo ? (
//           <video controls className="w-full rounded-lg">
//             <source src={videoUrl} type="video/mp4" />
//           </video>
//         ) : embedUrl ? (
//           /* YouTube / Vimeo */
//           <iframe
//             src={embedUrl}
//             title={content?.title}
//             className="w-full h-[500px] rounded-lg"
//             allowFullScreen
//           />
//         ) : (
//           /* Fallback */
//           <iframe
//             src={videoUrl}
//             title={content?.title}
//             className="w-full h-[500px] rounded-lg border"
//           />
//         )}

//         {content?.content && (
//           <div className="mt-6">
//             <RichTextContent htmlContent={content?.body || content?.content} />
//           </div>
//         )}
//       </ContentWrapper>
//     );
//   };

//   const renderPDFContent = () => {
//     const pdfUrl =
//       content?.meta?.full_url ||
//       content?.media?.full_url ||
//       content?.pdf_url ||
//       content?.content;

//     return (
//       <ContentWrapper>
//         <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 h-[650px]">
//           <iframe
//             src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//             title={content?.title}
//             className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] border-0"
//             style={{
//               border: "none",
//               overflow: "hidden",
//             }}
//           />
//         </div>

//         {content?.content && (
//           <div className="mt-6">
//             <RichTextContent htmlContent={content?.body || content?.content} />
//           </div>
//         )}
//       </ContentWrapper>
//     );
//   };

//   const renderAudioContent = () => {
//     const audioUrl =
//       content?.meta?.full_url ||
//       content?.media?.full_url ||
//       content?.audio_url ||
//       content?.content;

//     return (
//       <ContentWrapper>
//         <div className="max-w-md mx-auto text-center">
//           <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
//             <FaHeadphones className="text-4xl text-green-600" />
//           </div>

//           <audio controls className="w-full mb-4">
//             <source src={audioUrl} type="audio/mpeg" />
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//         {content?.content && (
//           <div className="mt-6 text-left">
//             <RichTextContent htmlContent={content?.body || content?.content} />
//           </div>
//         )}
//       </ContentWrapper>
//     );
//   };

//   const renderImageContent = () => {
//     const imageUrl =
//       content?.meta?.full_url ||
//       content?.media?.full_url ||
//       content?.image_url ||
//       content?.content;

//     return (
//       <ContentWrapper>
//         <div className="flex justify-center bg-gray-100 rounded-lg p-4">
//           <img
//             src={imageUrl}
//             alt={content?.title}
//             className="max-w-full h-auto object-contain max-h-[600px] rounded-lg shadow"
//             onError={(e) => {
//               e.target.src =
//                 "https://placehold.co/600x400?text=Image+Not+Found";
//             }}
//           />
//         </div>

//         {content?.content && (
//           <div className="mt-6">
//             <RichTextContent htmlContent={content?.body || content?.content} />
//           </div>
//         )}
//       </ContentWrapper>
//     );
//   };

//   const renderContent = () => {
//     if (!content) return null;

//     switch (content?.type) {
//       case "image":
//         return renderImageContent();

//       case "media":
//         if (content?.meta?.type === "video") return renderVideoContent();
//         if (content?.meta?.type === "audio") return renderAudioContent();
//         if (content?.meta?.type === "image") return renderImageContent();
//         if (content?.meta?.type === "document") return renderPDFContent();
//         return renderTextContent();

//       default:
//         if (content?.type === "text") return renderTextContent();
//         if (content?.type === "video") return renderVideoContent();
//         if (content?.type === "pdf") return renderPDFContent();
//         if (content?.type === "audio") return renderAudioContent();
//         return renderTextContent();
//     }
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (isError) return <Error message={message} />;

//   if (!content) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
//         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//           <FaFileAlt className="text-3xl text-gray-400" />
//         </div>
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">
//           {t("singlePreviewContent.notFound.title")}
//         </h3>
//         <p className="text-gray-500 mb-6">
//           {t("singlePreviewContent.notFound.description")}
//         </p>
//         <button
//           onClick={() => navigate(-1)}
//           className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
//         >
//           {t("singlePreviewContent.notFound.button")}
//         </button>
//       </div>
//     );
//   }

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
//         >
//           <MdArrowBack size={18} />
//           Back
//         </button>

//         <PageBody className="mt-4">
//           <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
//           <div className="mb-10">{renderContent()}</div>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default SingleContentPreview;

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

// // Common component for HTML content with styles
// const RichTextContent = ({ htmlContent }) => {
//   if (!htmlContent) return null;

//   return (
//     <>
//       <div
//         className="custom-content"
//         dangerouslySetInnerHTML={{ __html: htmlContent }}
//       />
//       <style>{`
//         .custom-content p {
//           margin: 0 0 16px;
//           line-height: 1.8;
//         }
//         .custom-content h1,
//         .custom-content h2,
//         .custom-content h3,
//         .custom-content h4,
//         .custom-content h5,
//         .custom-content h6 {
//           margin: 24px 0 16px;
//           font-weight: 700;
//           line-height: 1.4;
//         }
//         .custom-content ul,
//         .custom-content ol {
//           margin: 0 0 16px;
//           padding-left: 24px;
//         }
//         .custom-content li {
//           margin-bottom: 8px;
//         }
//         .custom-content hr {
//           margin: 24px 0;
//           border: none;
//           border-top: 1px solid #d1d5db;
//         }
//         .custom-content table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//           border: 1px solid #d1d5db;
//         }
//         .custom-content td,
//         .custom-content th {
//           border: 1px solid #d1d5db;
//           padding: 12px;
//           vertical-align: top;
//         }
//         .custom-content th {
//           background-color: #f3f4f6;
//           font-weight: 600;
//         }
//         .custom-content img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 8px;
//         }
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
//           console.log("H5P Resizer script loaded successfully");
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
//                   <span>Exit Fullscreen</span>
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
//                         Interactive H5P Content
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
//               Interactive H5P Content
//             </span>
//           </div>
//           <button
//             onClick={toggleFullscreen}
//             className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
//             title="Fullscreen"
//           >
//             <FaExpand size={14} />
//             <span className="text-xs">Fullscreen</span>
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
//             PDF Document
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
//             Video Content
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
//                 Video preview not available
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
//             Image Content
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
//             Audio Content
//           </span>
//         </div>
//         <div className="p-6">
//           <div className="max-w-md mx-auto text-center">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaHeadphones className="text-2xl text-green-600" />
//             </div>
//             <audio controls className="w-full">
//               <source src={audioUrl} type="audio/mpeg" />
//               Your browser does not support the audio element.
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
//             Text Content
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

//     console.log("Media Type:", mediaType);
//     console.log("Content Data:", content);

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
//             <p className="text-gray-500">No content available</p>
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
//             Content Not Found
//           </h3>
//           <p className="text-gray-500 text-sm mb-5">
//             {message ||
//               "The content you're looking for doesn't exist or has been removed."}
//           </p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
//           >
//             Go Back
//           </button>
//         </div>
//       </PageLayout>
//     );
//   }

//   // Main Layout - No Header Title/Subtitle, Sirf Back Button aur Content
//   return (
//     <PageLayout>
//       <div className="h-full flex flex-col">
//         {/* Sirf Back Button - No Title/Subtitle */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors mb-4 w-fit"
//         >
//           <FaArrowLeft size={16} />
//           <span className="text-sm font-medium">Back</span>
//         </button>

//         {/* Content Section - Yahan sirf content show hoga */}
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
} from "react-icons/fa";
import Loader from "../../../../common/Loader";
import { PageLayout } from "../../../../common/layout";
import { getSingleContent } from "../../../../../../redux/slice/unitBuilderSlice";
import { useTranslation } from "react-i18next";
import Error from "../../../../common/Error";

// Common component for HTML content with styles
const RichTextContent = ({ htmlContent }) => {
  if (!htmlContent) return null;

  return (
    <>
      <div
        className="custom-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      <style>{`
        .custom-content p {
          margin: 0 0 16px;
          line-height: 1.8;
        }
        .custom-content h1,
        .custom-content h2,
        .custom-content h3,
        .custom-content h4,
        .custom-content h5,
        .custom-content h6 {
          margin: 24px 0 16px;
          font-weight: 700;
          line-height: 1.4;
        }
        .custom-content ul,
        .custom-content ol {
          margin: 0 0 16px;
          padding-left: 24px;
        }
        .custom-content li {
          margin-bottom: 8px;
        }
        .custom-content hr {
          margin: 24px 0;
          border: none;
          border-top: 1px solid #d1d5db;
        }
        .custom-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          border: 1px solid #d1d5db;
        }
        .custom-content td,
        .custom-content th {
          border: 1px solid #d1d5db;
          padding: 12px;
          vertical-align: top;
        }
        .custom-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .custom-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
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
          console.log("H5P Resizer script loaded successfully");
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
              className="max-w-full h-auto object-contain rounded shadow-sm"
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

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 rounded-t-lg">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
            <FaHeadphones className="text-purple-500" />
            {t("singlePreviewContent.types.audio") || "Audio Content"}
          </span>
        </div>
        <div className="p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeadphones className="text-2xl text-green-600" />
            </div>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              {t("singlePreviewContent.audioNotSupported") ||
                "Your browser does not support the audio element."}
            </audio>
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

  // Main Layout - No Header Title/Subtitle, Sirf Back Button aur Content
  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Sirf Back Button - No Title/Subtitle */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors mb-4 w-fit"
        >
          <FaArrowLeft size={16} />
          <span className="text-sm font-medium">
            {t("singlePreviewContent.back") || "Back"}
          </span>
        </button>

        {/* Content Section - Yahan sirf content show hoga */}
        <div className="flex-1 overflow-y-auto">
          <div className="pb-6">
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SingleContentPreview;
