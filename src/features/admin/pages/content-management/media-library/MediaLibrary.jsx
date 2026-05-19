import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PageLayout,
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  PageTitle,
  PageSubtitle,
  PageBody,
} from "../../../common/layout";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMedia,
  updateSingleMediaStatus,
} from "../../../../../redux/slice/mediaLibrarySlice";
import { FiSearch, FiCopy, FiPlay, FiX, FiEye } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";
import usePermission from "../../../../../hooks/usePermission";
import VideoPlayerModal from "../../../common/VideoPlayerModal";
import StatusToggle from "../../../common/StatusToggle";
import { IoMdCheckmark } from "react-icons/io";

const ITEMS_PER_PAGE = 6;

const MediaLibrary = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  const { media, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  const fetchMedia = (overridePage) => {
    const params = {
      search: search || "",
      type: activeTab !== "all" ? activeTab : "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllMedia(params));
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await dispatch(
        updateSingleMediaStatus({ id, status: newStatus }),
      ).unwrap();
      fetchMedia(page);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchMedia(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchMedia(page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchMedia(1);
  }, [activeTab]);

  const copyToClipboard = async (shortcode, id, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shortcode);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopiedId(null);
    }
  };

  const viewDetails = (id, e) => {
    e.stopPropagation();
    navigate(`media-details/${id}`);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const tabs = [
    { key: "all", label: t("mediaLibrary.list.tabs.all") },
    { key: "video", label: t("mediaLibrary.list.tabs.videos") },
    { key: "image", label: t("mediaLibrary.list.tabs.images") },
    { key: "document", label: t("mediaLibrary.list.tabs.documents") },
    { key: "audio", label: t("mediaLibrary.list.tabs.audio") },
    { key: "h5p", label: t("mediaLibrary.list.tabs.h5p") }, // Added H5P tab
  ];

  const mediaData = media?.data || media || [];

  const filteredData =
    activeTab === "all"
      ? mediaData
      : mediaData.filter((item) => item.type === activeTab);

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎬";
      case "audio":
        return "🎵";
      case "document":
        return "📄";
      case "h5p":
        return "📚"; // Using book emoji for H5P content
      default:
        return "📁";
    }
  };

  const getThumbnailPreview = (item) => {
    if (item.type === "h5p") {
      // For H5P, show a special placeholder with H5P logo
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-6xl mb-2">📚</div>
          <div className="text-xs text-purple-600 font-medium px-2 py-1 bg-purple-100 rounded">
            H5P
          </div>
          {item.external_url && (
            <div className="text-xs text-gray-500 mt-2 px-2 text-center truncate max-w-full">
              {item.external_url}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading && !mediaData.length) return <Loader />;
  if (isError) return <Error message={message} />;

  if (!hasPermission("media.view")) {
    return null;
  }

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("mediaLibrary.list.title")}</PageTitle>
          <PageSubtitle>{t("mediaLibrary.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>

        <PageHeaderRight>
          {hasPermission("media.create") && (
            <Link
              to="create-media"
              className="bg-accent hover:opacity-90 text-white whitespace-nowrap px-4 py-2 rounded text-sm font-medium transition shadow-sm"
            >
              + {t("mediaLibrary.actions.uploadMedia")}
            </Link>
          )}
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        {/* Search Bar */}
        <div className="bg-white border border-gray-200 rounded mb-6 p-4 shadow-sm">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("mediaLibrary.list.searchPlaceholder")}
              className="w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-5">
          <div className="flex gap-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 text-sm transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-sm transition-all duration-200 group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gray-100">
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.full_url || item.file}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => viewDetails(item.id, e)}
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-md"
                          title={t("mediaLibrary.actions.viewDetails")}
                        >
                          <FiEye
                            size={16}
                            className="text-gray-700 cursor-pointer"
                          />
                        </button>
                      </div>
                    </>
                  ) : item.type === "image" && (item.full_url || item.file) ? (
                    <img
                      src={item.full_url || item.file}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "h5p" ? (
                    <>
                      {getThumbnailPreview(item)}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <button
                          onClick={(e) => viewDetails(item.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-all w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                          title={t("mediaLibrary.actions.viewDetails")}
                        >
                          <FiEye
                            size={16}
                            className="text-gray-700 cursor-pointer"
                          />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-40">
                        {getFileIcon(item.type)}
                      </span>
                    </div>
                  )}

                  {item.type !== "video" && item.type !== "h5p" && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <button
                        onClick={(e) => viewDetails(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-all w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
                        title={t("mediaLibrary.actions.viewDetails")}
                      >
                        <FiEye
                          size={16}
                          className="text-gray-700 cursor-pointer"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {item.creator_name || t("mediaLibrary.list.unknownCreator")}
                  </p>

                  {/* Shortcode with Copy Button */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <code className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded truncate">
                      {item.shortcode}
                    </code>
                    <button
                      onClick={(e) =>
                        copyToClipboard(item.shortcode, item.id, e)
                      }
                      className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      title={t("mediaLibrary.actions.copyShortcode")}
                    >
                      {copiedId === item.id ? (
                        <IoMdCheckmark className="text-green-500" size={12} />
                      ) : (
                        <FiCopy
                          size={12}
                          className="text-gray-400 cursor-pointer hover:text-gray-600"
                        />
                      )}
                    </button>
                  </div>

                  {/* STATUS TOGGLE */}
                  <div className="flex items-center justify-between cursor-pointer mt-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`preview/${item.id}`);
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold
                       cursor-pointer text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150"
                    >
                      <FiEye size={14} />
                      {t("mediaLibrary.actions.preview")}
                    </button>
                    <StatusToggle
                      value={item.status}
                      onToggle={async (newStatus) => {
                        await handleStatusToggle(item.id, newStatus);
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400 text-sm">
              {t("mediaLibrary.list.noDataFound")}
            </div>
          )}
        </div>

        {/* Pagination */}
        {media?.last_page > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 cursor-pointer"
            >
              {t("mediaLibrary.pagination.previous")}
            </button>
            <span className="px-3 py-1 text-sm">
              {t("mediaLibrary.pagination.page")} {page}{" "}
              {t("mediaLibrary.pagination.of")} {media.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(media.last_page, p + 1))}
              disabled={page === media.last_page}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 cursor-pointer"
            >
              {t("mediaLibrary.pagination.next")}
            </button>
          </div>
        )}
      </PageBody>
    </PageLayout>
  );
};

export default MediaLibrary;
