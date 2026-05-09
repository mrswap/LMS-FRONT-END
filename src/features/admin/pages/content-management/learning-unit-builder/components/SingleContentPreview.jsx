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
import {
  PageLayout,
  PageBody,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
} from "../../../../common/layout";
import Breadcrumb from "../../../../common/layout/Breadcrumb";
import { getSingleContent } from "../../../../../../redux/slice/unitBuilderSlice";
import { useTranslation } from "react-i18next";

const SingleContentPreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { topicId, contentId } = useParams();
  const hasMarkedRead = useRef(false); // Prevent multiple API calls

  const { currentContent, isLoading } = useSelector((state) => state.content);

  // console.log("currentContent", currentContent);

  const content = currentContent?.current;
  const topic = currentContent?.topic;
  const navigation = currentContent?.navigation;

  useEffect(() => {
    if (topicId && contentId) {
      dispatch(getSingleContent({ topicId, contentId }));
      // Reset the read flag when content changes
      hasMarkedRead.current = false;
    }
  }, [topicId, contentId, dispatch]);

  const getContentIcon = () => {
    switch (content?.type) {
      case "text":
        return <FaBookOpen className="text-blue-600" />;
      case "video":
        return <FaVideo className="text-purple-600" />;
      case "pdf":
        return <MdPictureAsPdf className="text-red-600" />;
      case "audio":
        return <FaHeadphones className="text-green-600" />;
      case "image":
        return <FaImage className="text-pink-600" />;
      default:
        return <FaFileAlt className="text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (content?.type) {
      case "text":
        return t("singlePreviewContent.types.text");
      case "video":
        return t("singlePreviewContent.types.video");
      case "pdf":
        return t("singlePreviewContent.types.pdf");
      case "audio":
        return t("singlePreviewContent.types.audio");
      case "image":
        return t("singlePreviewContent.types.image");
      default:
        return content?.type;
    }
  };

  const renderTextContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* <div
          // className="prose prose-lg prose-slate max-w-none custom-content"
          className="max-w-none custom-content"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: content?.body || content?.content,
            }}
          />
          <style>{`
  .custom-content {
    line-height: 1.8;
    color: #1f2937;
  }

  .custom-content p {
    margin-bottom: 18px;
    line-height: 1.9;
  }

  .custom-content h1,
  .custom-content h2,
  .custom-content h3,
  .custom-content h4 {
    margin-top: 28px;
    margin-bottom: 16px;
    font-weight: 700;
    line-height: 1.4;
  }

  .custom-content ul,
  .custom-content ol {
    margin-top: 16px;
    margin-bottom: 20px;
    padding-left: 24px;
  }

  .custom-content li {
    margin-bottom: 10px;
    line-height: 1.8;
  }

  .custom-content hr {
    margin: 32px 0;
    border: none;
    border-top: 1px solid #d1d5db;
  }

  .custom-content img {
    margin: 24px auto;
    border-radius: 12px;
    max-width: 100%;
  }

  .custom-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    border: 1px solid #d1d5db;
  }

  .custom-content td,
  .custom-content th {
    border: 1px solid #d1d5db;
    padding: 14px;
    text-align: left;
    vertical-align: top;
  }

  .custom-content th {
    background: #f3f4f6;
    font-weight: 600;
  }

  .custom-content tr:nth-child(even) {
    background: #f9fafb;
  }
`}</style>
        </div> */}

        <div className="max-w-none custom-content">
          <div
            dangerouslySetInnerHTML={{
              __html: content?.body || content?.content,
            }}
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
        </div>
      </div>
    </div>
  );

  const renderVideoContent = () => (
    <div className="bg-black rounded-xl overflow-hidden shadow-xl">
      <video controls className="w-full" poster={content?.thumbnail}>
        <source src={content?.video_url || content?.content} type="video/mp4" />
      </video>
    </div>
  );

  const renderPDFContent = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
        <span className="text-sm flex items-center gap-2">
          <MdPictureAsPdf className="text-red-400" />
          {t("singlePreviewContent.pdf.title")}
        </span>
        <a
          href={content?.pdf_url || content?.content}
          download
          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition"
        >
          {t("singlePreviewContent.pdf.download")}
        </a>
      </div>
      <iframe
        src={content?.pdf_url || content?.content}
        className="w-full h-[650px]"
        title={content?.title}
      />
    </div>
  );

  const renderAudioContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaHeadphones className="text-4xl text-green-600" />
        </div>
        <audio controls className="w-full mb-4">
          <source src={content?.audio_url || content?.content} />
        </audio>
        {content?.description && (
          <p className="text-gray-600 text-sm mt-4">{content.description}</p>
        )}
      </div>
    </div>
  );

  const renderImageContent = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <img
        src={content?.image_url || content?.content}
        alt={content?.title}
        className="w-full h-auto object-contain max-h-[600px] bg-white"
      />
      {content?.description && (
        <div className="p-4 bg-white border-t border-gray-200">
          <p className="text-gray-600 text-sm">{content.description}</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (!content) return null;

    switch (content?.type) {
      case "text":
        return renderTextContent();
      case "video":
        return renderVideoContent();
      case "pdf":
        return renderPDFContent();
      case "audio":
        return renderAudioContent();
      case "image":
      case "media":
        return renderImageContent();
      default:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-yellow-800">
              {t("singlePreviewContent.unsupported")} {content?.type}
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

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
          {t("singlePreviewContent.notFound.button")}
        </button>

        <PageBody className="mt-4">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

          {/* Content Area */}
          <div className="mb-10">{renderContent()}</div>
        </PageBody>
      </div>
    </PageLayout>
  );
};

export default SingleContentPreview;
