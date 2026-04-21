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
    dispatch(
      getAllMedia({
        search: search || "",
        page: overridePage ?? page,
        limit: ITEMS_PER_PAGE,
      }),
    );
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchMedia(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // useEffect(() => {
  //   fetchMedia(page);
  // }, [page]);

  const tabs = [
    { key: "all", label: t("mediaLibrary.list.tabs.all") },
    { key: "videos", label: t("mediaLibrary.list.tabs.videos") },
    { key: "images", label: t("mediaLibrary.list.tabs.images") },
    { key: "documents", label: t("mediaLibrary.list.tabs.documents") },
    { key: "audio", label: t("mediaLibrary.list.tabs.audio") },
  ];

  const filteredData =
    activeTab === "all"
      ? media
      : media?.filter((item) => item.type === activeTab);

  if (isLoading && !media?.data?.length) return <Loader />;
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
            className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold"
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
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === tab.key ? "bg-primary text-white" : "bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`media-details/${item.id}`)}
                className="bg-white rounded-xl shadow cursor-pointer overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {item.type === "image" ? (
                    <img
                      src={item.full_url || item.file}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <div className="text-3xl">🎬</div>
                  ) : item.type === "audio" ? (
                    <div className="text-3xl">🎵</div>
                  ) : (
                    <div className="text-3xl">📄</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold truncate">{item.title}</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.creator_name}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Shortcode: {item.shortcode}
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
      </PageBody>
    </PageLayout>
  );
};

export default MediaLibrary;
