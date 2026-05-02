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
import { getAllMedia } from "../../../../../redux/slice/mediaLibrarySlice";
import { FiSearch } from "react-icons/fi";
import Loader from "../../../common/Loader";
import Error from "../../../common/Error";

const ITEMS_PER_PAGE = 6;

const MediaLibrary = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { media, isLoading, isError, message } = useSelector(
    (state) => state.media,
  );

  const fetchMedia = (overridePage) => {
    const params = {
      search: search || "",
      page: overridePage ?? page,
      limit: ITEMS_PER_PAGE,
    };
    dispatch(getAllMedia(params));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchMedia(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // ✅ Fixed: Uncommented and fixed pagination effect
  useEffect(() => {
    fetchMedia(page);
  }, [page]);

  // ✅ Fixed: Dynamic tabs with i18n
  const tabs = [
    { key: "all", label: t("mediaLibrary.list.tabs.all"), type: null },
    { key: "videos", label: t("mediaLibrary.list.tabs.videos"), type: "video" },
    { key: "images", label: t("mediaLibrary.list.tabs.images"), type: "image" },
    {
      key: "documents",
      label: t("mediaLibrary.list.tabs.documents"),
      type: "document",
    },
    { key: "audio", label: t("mediaLibrary.list.tabs.audio"), type: "audio" },
  ];

  const filteredData =
    activeTab === "all"
      ? media
      : media?.filter((item) => item.type === activeTab);

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
      default:
        return "📁";
    }
  };

  if (isLoading && !media?.length) return <Loader />;
  if (isError) return <Error message={message} />;

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderLeft>
          <PageTitle>{t("mediaLibrary.list.title")}</PageTitle>
          <PageSubtitle>{t("mediaLibrary.list.subtitle")}</PageSubtitle>
        </PageHeaderLeft>

        <PageHeaderRight>
          <Link
            to="create-media"
            className="bg-accent text-white whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
          >
            {t("mediaLibrary.actions.uploadMedia")}
          </Link>
        </PageHeaderRight>
      </PageHeader>

      <PageBody>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="w-full">
            <div
              className="flex items-center bg-gray-50 border border-gray-200
              hover:border-blue-500 focus-within:border-blue-500
              rounded-xl px-4 py-2.5 transition-all"
            >
              <FiSearch className="text-gray-400 text-base" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("mediaLibrary.list.searchPlaceholder")}
                className="bg-transparent outline-none px-3 text-sm w-full placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`media-details/${item.id}`)}
                className="bg-white rounded-xl shadow cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {item.type === "image" && (item.full_url || item.file) ? (
                    <img
                      src={item.full_url || item.file}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl">{getFileIcon(item.type)}</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.creator_name || t("mediaLibrary.list.unknownCreator")}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {t("mediaLibrary.list.shortcode")}: {item.shortcode}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400">
              {t("mediaLibrary.list.noDataFound")}
            </div>
          )}
        </div>

        {/* ========== COMMENTED CODE - PAGINATION (FUTURE USE) ==========
        {media?.last_page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                {t("common.previous")}
              </button>
              <span className="px-3 py-1">
                {t("common.page")} {page} {t("common.of")} {media?.last_page}
              </span>
              <button
                onClick={() => setPage(p => Math.min(media?.last_page, p + 1))}
                disabled={page === media?.last_page}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        )}
        ========== END COMMENTED CODE ========== */}
      </PageBody>
    </PageLayout>
  );
};

export default MediaLibrary;
