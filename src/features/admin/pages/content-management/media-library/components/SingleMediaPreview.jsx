import React, { useEffect, useState, useRef } from "react";
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
  FaCode,
  FaExpand,
  FaCompress,
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
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const fullscreenContainerRef = useRef(null);

  const { singleMedia, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  useEffect(() => {
    if (id) {
      dispatch(getMediaById(id));
    }
  }, [id, dispatch]);

  // Load H5P resizer script dynamically
  useEffect(() => {
    if (singleMedia?.type === "h5p" && singleMedia?.full_url) {
      const scriptId = "h5p-resizer-script";

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

        script.onerror = () => {
          console.error("Failed to load H5P Resizer script");
        };

        document.head.appendChild(script);
      }
    }
  }, [singleMedia]);

  // Fullscreen scrolling fix
  useEffect(() => {
    if (isFullscreen) {
      // Disable body scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Add custom styles for better scrolling
      const styleId = "fullscreen-scroll-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          .fullscreen-scroll-container {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            height: 100% !important;
            max-height: 100% !important;
          }
          .fullscreen-scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          .fullscreen-scroll-container::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .fullscreen-scroll-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .fullscreen-scroll-container::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          .fullscreen-iframe-wrapper {
            min-height: 100%;
            display: flex;
            flex-direction: column;
          }
          .fullscreen-iframe-wrapper iframe {
            flex: 1;
            min-height: calc(100vh - 60px);
          }
        `;
        document.head.appendChild(style);
      }

      return () => {
        // Cleanup
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) existingStyle.remove();
      };
    }
  }, [isFullscreen]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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

  // Handle iframe resize messages
  useEffect(() => {
    const handleResizeMessage = (event) => {
      if (event.data && event.data.type === "resize" && iframeRef.current) {
        const height = event.data.height;
        if (height && iframeRef.current) {
          iframeRef.current.style.height = height + "px";
        }
      }
    };

    window.addEventListener("message", handleResizeMessage);
    return () => window.removeEventListener("message", handleResizeMessage);
  }, []);

  // H5P Preview Renderer with fullscreen scrolling fix
  const renderH5PPreview = () => {
    const h5pUrl = singleMedia?.full_url || singleMedia?.external_url;
    const cleanUrl = h5pUrl?.split("?")[0];

    // FULLSCREEN MODE - With scrolling fix
    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            {/* Fixed Header - doesn't scroll */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/media-library")}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FaArrowLeft size={14} />
                  <span>{t("mediaLibrary.preview.backToLibrary")}</span>
                </button>
                <div className="h-5 w-px bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-700">
                  {singleMedia?.title}
                </span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaCompress size={14} />
                <span>{t("mediaLibrary.preview.exitFullscreen")}</span>
              </button>
            </div>

            {/* Scrollable Container - YAHAN SCROLLING HOGA */}
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
                        {t("mediaLibrary.preview.interactiveH5pContent")}
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
                        allowFullScreen="allowfullscreen"
                        allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                        title={singleMedia?.title}
                        style={{
                          display: "block",
                          minHeight: "calc(100vh - 120px)",
                          height: "auto",
                        }}
                        onLoad={() => {
                          console.log("Fullscreen H5P iframe loaded");
                          setTimeout(() => {
                            if (
                              iframeRef.current &&
                              iframeRef.current.contentWindow
                            ) {
                              iframeRef.current.contentWindow.postMessage(
                                "resize",
                                "*",
                              );
                              // Force iframe height to be scrollable
                              if (iframeRef.current.contentDocument) {
                                const body =
                                  iframeRef.current.contentDocument.body;
                                if (body) {
                                  body.style.overflowY = "auto";
                                }
                              }
                            }
                          }, 500);
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

    // NORMAL MODE (Not fullscreen)
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaCode className="text-blue-600 text-sm" />
            <span className="text-xs font-medium text-gray-700">
              {t("mediaLibrary.preview.interactiveH5pContent")}
            </span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
            title={t("mediaLibrary.preview.fullscreen")}
          >
            <FaExpand size={14} />
            <span className="text-xs">
              {t("mediaLibrary.preview.fullscreen")}
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
            allowFullScreen="allowfullscreen"
            allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
            title={singleMedia?.title}
            onLoad={() => {
              console.log("H5P iframe loaded");
              setTimeout(() => {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                  iframeRef.current.contentWindow.postMessage("resize", "*");
                }
              }, 500);
            }}
          />
        </div>
      </div>
    );
  };

  const renderVideoPreview = () => {
    const videoUrl = singleMedia?.full_url || singleMedia?.file;
    const embedUrl = getEmbedUrl(videoUrl);
    const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <span className="text-xs font-medium text-gray-700">
            {t("mediaLibrary.preview.videoPreview")}
          </span>
        </div>
        <div className="h-[450px]">
          {isDirectVideo ? (
            <video controls className="w-full h-full">
              <source src={videoUrl} type="video/mp4" />
              {t("mediaLibrary.preview.videoNotSupported")}
            </video>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={singleMedia?.title}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded">
              <FaVideo className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <span className="text-xs font-medium text-gray-700">
            {t("mediaLibrary.preview.imagePreview")}
          </span>
        </div>
        <div className="h-[550px] overflow-auto p-4">
          <div className="flex justify-center items-center min-h-full">
            <img
              src={imageUrl}
              alt={singleMedia?.title}
              className="max-w-full h-auto object-contain rounded shadow-sm"
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
          <span className="text-xs font-medium text-gray-700">
            {t("mediaLibrary.preview.audioPreview")}
          </span>
        </div>
        <div className="p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeadphones className="text-2xl text-green-600" />
            </div>
            <audio controls className="w-full">
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <span className="text-xs font-medium text-gray-700">
              {t("mediaLibrary.preview.pdfPreview")}
            </span>
          </div>
          <div className=" overflow-y-auto custom-scrollbar">
            <iframe
              src={`${docUrl}#toolbar=0&navpanes=0`}
              title={singleMedia?.title}
              className="w-full border-0"
              style={{
                minHeight: "calc(100vh - 120px)",
                height: "auto",
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-8 text-center">
          <FaFilePdf className="text-5xl text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-medium mb-1">{singleMedia?.title}</h3>
          <p className="text-gray-500 text-sm">
            {t("mediaLibrary.preview.documentPreviewNotAvailable")}
          </p>
          <a
            href={docUrl}
            download
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            {t("mediaLibrary.preview.downloadDocument")}
          </a>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!singleMedia) return null;

    switch (singleMedia?.type) {
      case "h5p":
        return renderH5PPreview();
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
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-8 text-center">
              <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaFileAlt className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t("mediaLibrary.preview.notFound.title")}
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            {message || t("mediaLibrary.preview.notFound.description")}
          </p>
          <button
            onClick={() => navigate("/media-library")}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            {t("mediaLibrary.preview.backToLibrary")}
          </button>
        </div>
      </PageLayout>
    );
  }

  // Main return - Sirf content scroll hoga
  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header Section - Fixed, doesn't scroll */}
        <button
          onClick={() => navigate("/media-library")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <FaArrowLeft size={16} />
          <span className="text-sm font-medium">
            {t("mediaLibrary.preview.back")}
          </span>
        </button>
        <PageHeader>
          <PageHeaderLeft>
            <PageTitle>{singleMedia?.title}</PageTitle>
            <PageSubtitle>
              {t("mediaLibrary.preview.type")}: {singleMedia?.type}
            </PageSubtitle>
          </PageHeaderLeft>
          <PageHeaderRight>
            <button
              onClick={() => copyToClipboard(singleMedia?.shortcode)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              {copied ? (
                <>
                  <IoMdCheckmark className="text-green-500" size={14} />
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

        {/* Content Section - ONLY THIS SCROLLS */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SingleMediaPreview;
