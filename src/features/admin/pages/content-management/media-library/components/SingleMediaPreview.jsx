// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaFileAlt,
//   FaVideo,
//   FaImage,
//   FaHeadphones,
//   FaFilePdf,
//   FaArrowLeft,
//   FaCopy,
// } from "react-icons/fa";
// import { IoMdCheckmark } from "react-icons/io";
// import {
//   PageLayout,
//   PageBody,
//   PageHeader,
//   PageHeaderLeft,
//   PageTitle,
//   PageSubtitle,
//   PageHeaderRight,
// } from "../../../../common/layout";
// import { getMediaById } from "../../../../../../redux/slice/mediaLibrarySlice";
// import Loader from "../../../../common/Loader";
// import { useTranslation } from "react-i18next";

// const SingleMediaPreview = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [copied, setCopied] = React.useState(false);

//   const { singleMedia, isLoading, isError, message } = useSelector(
//     (state) => state.media,
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(getMediaById(id));
//     }
//   }, [id, dispatch]);

//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

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

//   const renderVideoPreview = () => {
//     const videoUrl = singleMedia?.full_url || singleMedia?.file;
//     const embedUrl = getEmbedUrl(videoUrl);
//     const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

//     return (
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6">
//           {isDirectVideo ? (
//             <video controls className="w-full rounded-lg">
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : embedUrl ? (
//             <iframe
//               src={embedUrl}
//               title={singleMedia?.title}
//               className="w-full h-[500px] rounded-lg"
//               allowFullScreen
//             />
//           ) : (
//             <div className="text-center py-12 bg-gray-50 rounded-lg">
//               <FaVideo className="text-6xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">Video preview not available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderImagePreview = () => {
//     const imageUrl = singleMedia?.full_url || singleMedia?.file;

//     return (
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6">
//           <div className="flex justify-center bg-gray-50 rounded-lg p-4">
//             <img
//               src={imageUrl}
//               alt={singleMedia?.title}
//               className="max-w-full h-auto object-contain max-h-[600px] rounded-lg shadow"
//               onError={(e) => {
//                 e.target.src =
//                   "https://placehold.co/600x400?text=Image+Not+Found";
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderAudioPreview = () => {
//     const audioUrl = singleMedia?.full_url || singleMedia?.file;

//     return (
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6">
//           <div className="max-w-md mx-auto text-center">
//             <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FaHeadphones className="text-4xl text-green-600" />
//             </div>
//             <audio controls className="w-full mb-4">
//               <source src={audioUrl} type="audio/mpeg" />
//               Your browser does not support the audio element.
//             </audio>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderDocumentPreview = () => {
//     const docUrl = singleMedia?.full_url || singleMedia?.file;
//     const isPDF = docUrl?.toLowerCase().endsWith(".pdf");

//     if (isPDF) {
//       return (
//         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//           <div className="relative overflow-hidden rounded-2xl bg-white h-[650px]">
//             <iframe
//               src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//               title={singleMedia?.title}
//               className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] border-0"
//               style={{ border: "none", overflow: "hidden" }}
//             />
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-6 text-center">
//           <FaFilePdf className="text-6xl text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-medium mb-2">{singleMedia?.title}</h3>
//           <p className="text-gray-500">
//             Preview not available for this document
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderContent = () => {
//     if (!singleMedia) return null;

//     switch (singleMedia?.type) {
//       case "video":
//         return renderVideoPreview();
//       case "image":
//         return renderImagePreview();
//       case "audio":
//         return renderAudioPreview();
//       case "document":
//         return renderDocumentPreview();
//       default:
//         return (
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="p-12 text-center">
//               <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 Preview not available for this file type
//               </p>
//             </div>
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

//   if (isError || !singleMedia) {
//     return (
//       <PageLayout>
//         <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
//           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//             <FaFileAlt className="text-3xl text-gray-400" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">
//             {t("mediaLibrary.preview.notFound.title") || "Media not found"}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {message || t("mediaLibrary.preview.notFound.description")}
//           </p>
//           <button
//             onClick={() => navigate("/media-library")}
//             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
//           >
//             Back to Media Library
//           </button>
//         </div>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout>
//       <div className="p-8 rounded-lg border border-gray-300">
//         <PageHeader>
//           <PageHeaderLeft>
//             <button
//               onClick={() => navigate("/media-library")}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
//             >
//               <FaArrowLeft size={18} />
//               Back
//             </button>
//           </PageHeaderLeft>
//           <PageHeaderRight>
//             <button
//               onClick={() => copyToClipboard(singleMedia?.shortcode)}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
//             >
//               {copied ? (
//                 <>
//                   <IoMdCheckmark className="text-green-500" size={16} />
//                   <span>Copied!</span>
//                 </>
//               ) : (
//                 <>
//                   <FaCopy size={14} />
//                   <span>Copy Shortcode</span>
//                 </>
//               )}
//             </button>
//           </PageHeaderRight>
//         </PageHeader>

//         {/* Main Preview Content */}
//         <PageBody className="mt-4">
//           <PageTitle> {singleMedia?.title}</PageTitle>
//           <PageSubtitle>Type: {singleMedia?.type}</PageSubtitle>
//           <div>{renderContent()}</div>
//         </PageBody>
//       </div>
//     </PageLayout>
//   );
// };

// export default SingleMediaPreview;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaVideo,
  FaImage,
  FaHeadphones,
  FaFilePdf,
  FaArrowLeft,
  FaCopy,
} from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import {
  PageLayout,
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageTitle,
  PageSubtitle,
  PageHeaderRight,
} from "../../../../common/layout";
import { getMediaById } from "../../../../../../redux/slice/mediaLibrarySlice";
import Loader from "../../../../common/Loader";
import { useTranslation } from "react-i18next";

const SingleMediaPreview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const { singleMedia, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id));
    }
  }, [id, dispatch]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes("youtube.com/watch") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v");
      } else {
        videoId = url.split("/").pop();
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return null;
  };

  const renderVideoPreview = () => {
    const videoUrl = singleMedia?.full_url || singleMedia?.file;
    const embedUrl = getEmbedUrl(videoUrl);
    const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          {isDirectVideo ? (
            <video controls className="w-full rounded-lg">
              <source src={videoUrl} type="video/mp4" />
              {t("mediaLibrary.preview.videoNotSupported")}
            </video>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={singleMedia?.title}
              className="w-full h-[500px] rounded-lg"
              allowFullScreen
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaVideo className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {t("mediaLibrary.preview.videoPreviewNotAvailable")}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderImagePreview = () => {
    const imageUrl = singleMedia?.full_url || singleMedia?.file;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center bg-gray-50 rounded-lg p-4">
            <img
              src={imageUrl}
              alt={singleMedia?.title}
              className="max-w-full h-auto object-contain max-h-[600px] rounded-lg shadow"
              onError={(e) => {
                e.target.src = t(
                  "mediaLibrary.preview.imageNotFoundPlaceholder",
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAudioPreview = () => {
    const audioUrl = singleMedia?.full_url || singleMedia?.file;

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeadphones className="text-4xl text-green-600" />
            </div>
            <audio controls className="w-full mb-4">
              <source src={audioUrl} type="audio/mpeg" />
              {t("mediaLibrary.preview.audioNotSupported")}
            </audio>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentPreview = () => {
    const docUrl = singleMedia?.full_url || singleMedia?.file;
    const isPDF = docUrl?.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="relative overflow-hidden rounded-2xl bg-white h-[650px]">
            <iframe
              src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              title={singleMedia?.title}
              className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] border-0"
              style={{ border: "none", overflow: "hidden" }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <FaFilePdf className="text-6xl text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{singleMedia?.title}</h3>
          <p className="text-gray-500">
            {t("mediaLibrary.preview.documentPreviewNotAvailable")}
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!singleMedia) return null;

    switch (singleMedia?.type) {
      case "video":
        return renderVideoPreview();
      case "image":
        return renderImagePreview();
      case "audio":
        return renderAudioPreview();
      case "document":
        return renderDocumentPreview();
      default:
        return (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {t("mediaLibrary.preview.filePreviewNotAvailable")}
              </p>
            </div>
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

  if (isError || !singleMedia) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FaFileAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t("mediaLibrary.preview.notFound.title")}
          </h3>
          <p className="text-gray-500 mb-6">
            {message || t("mediaLibrary.preview.notFound.description")}
          </p>
          <button
            onClick={() => navigate("/media-library")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
          >
            {t("mediaLibrary.preview.backToLibrary")}
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <PageHeader>
          <PageHeaderLeft>
            <button
              onClick={() => navigate("/media-library")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              <FaArrowLeft size={18} />
              {t("mediaLibrary.preview.back")}
            </button>
          </PageHeaderLeft>
          <PageHeaderRight>
            <button
              onClick={() => copyToClipboard(singleMedia?.shortcode)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {copied ? (
                <>
                  <IoMdCheckmark className="text-green-500" size={16} />
                  <span>{t("mediaLibrary.preview.copied")}</span>
                </>
              ) : (
                <>
                  <FaCopy size={14} />
                  <span>{t("mediaLibrary.preview.copyShortcode")}</span>
                </>
              )}
            </button>
          </PageHeaderRight>
        </PageHeader>

        <PageBody className="mt-4">
          <PageTitle>{singleMedia?.title}</PageTitle>
          <PageSubtitle>
            {t("mediaLibrary.preview.type")}: {singleMedia?.type}
          </PageSubtitle>
          <div>{renderContent()}</div>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default SingleMediaPreview;
