import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaVideo,
  FaImage,
  FaHeadphones,
  FaBookOpen,
} from "react-icons/fa";
import { MdArrowBack, MdPictureAsPdf } from "react-icons/md";
import Loader from "../../../../common/Loader";
import { PageLayout, PageBody } from "../../../../common/layout";
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

// Common Content Wrapper - same layout for all content types
const ContentWrapper = ({ children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="p-6">{children}</div>
  </div>
);

const SingleContentPreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { topicId, contentId } = useParams();
  const hasMarkedRead = useRef(false);

  const { currentContent, isLoading, isError, message } = useSelector(
    (state) => state.content,
  );

  const content = currentContent?.current;

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

  useEffect(() => {
    if (topicId && contentId) {
      dispatch(getSingleContent({ topicId, contentId }));
      hasMarkedRead.current = false;
    }
  }, [topicId, contentId, dispatch]);

  const renderTextContent = () => (
    <ContentWrapper>
      <RichTextContent htmlContent={content?.body || content?.content} />
    </ContentWrapper>
  );

  const renderVideoContent = () => {
    const videoUrl = content?.meta?.full_url || content?.media?.full_url;

    const embedUrl = getEmbedUrl(videoUrl);

    const isDirectVideo = videoUrl?.match(/\.(mp4|webm|ogg)$/i);

    return (
      <ContentWrapper>
        {/* Direct Video */}
        {isDirectVideo ? (
          <video controls className="w-full rounded-lg">
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : embedUrl ? (
          /* YouTube / Vimeo */
          <iframe
            src={embedUrl}
            title={content?.title}
            className="w-full h-[500px] rounded-lg"
            allowFullScreen
          />
        ) : (
          /* Fallback */
          <iframe
            src={videoUrl}
            title={content?.title}
            className="w-full h-[500px] rounded-lg border"
          />
        )}

        {content?.content && (
          <div className="mt-6">
            <RichTextContent htmlContent={content?.body || content?.content} />
          </div>
        )}
      </ContentWrapper>
    );
  };

  const renderPDFContent = () => {
    const pdfUrl =
      content?.meta?.full_url ||
      content?.media?.full_url ||
      content?.pdf_url ||
      content?.content;

    return (
      <ContentWrapper>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 h-[650px]">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            title={content?.title}
            className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] border-0"
            style={{
              border: "none",
              overflow: "hidden",
            }}
          />
        </div>

        {content?.content && (
          <div className="mt-6">
            <RichTextContent htmlContent={content?.body || content?.content} />
          </div>
        )}
      </ContentWrapper>
    );
  };

  const renderAudioContent = () => {
    const audioUrl =
      content?.meta?.full_url ||
      content?.media?.full_url ||
      content?.audio_url ||
      content?.content;

    return (
      <ContentWrapper>
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeadphones className="text-4xl text-green-600" />
          </div>

          <audio controls className="w-full mb-4">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        {content?.content && (
          <div className="mt-6 text-left">
            <RichTextContent htmlContent={content?.body || content?.content} />
          </div>
        )}
      </ContentWrapper>
    );
  };

  const renderImageContent = () => {
    const imageUrl =
      content?.meta?.full_url ||
      content?.media?.full_url ||
      content?.image_url ||
      content?.content;

    return (
      <ContentWrapper>
        <div className="flex justify-center bg-gray-100 rounded-lg p-4">
          <img
            src={imageUrl}
            alt={content?.title}
            className="max-w-full h-auto object-contain max-h-[600px] rounded-lg shadow"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400?text=Image+Not+Found";
            }}
          />
        </div>

        {content?.content && (
          <div className="mt-6">
            <RichTextContent htmlContent={content?.body || content?.content} />
          </div>
        )}
      </ContentWrapper>
    );
  };

  const renderContent = () => {
    if (!content) return null;

    switch (content?.type) {
      case "image":
        return renderImageContent();

      case "media":
        if (content?.meta?.type === "video") return renderVideoContent();
        if (content?.meta?.type === "audio") return renderAudioContent();
        if (content?.meta?.type === "image") return renderImageContent();
        if (content?.meta?.type === "document") return renderPDFContent();
        return renderTextContent();

      default:
        if (content?.type === "text") return renderTextContent();
        if (content?.type === "video") return renderVideoContent();
        if (content?.type === "pdf") return renderPDFContent();
        if (content?.type === "audio") return renderAudioContent();
        return renderTextContent();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) return <Error message={message} />;

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FaFileAlt className="text-3xl text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t("singlePreviewContent.notFound.title")}
        </h3>
        <p className="text-gray-500 mb-6">
          {t("singlePreviewContent.notFound.description")}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
        >
          {t("singlePreviewContent.notFound.button")}
        </button>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="p-8 rounded-lg border border-gray-300">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} />
          Back
        </button>

        <PageBody className="mt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
          <div className="mb-10">{renderContent()}</div>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default SingleContentPreview;
