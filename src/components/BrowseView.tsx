import { useState, useMemo } from "react";
import { Search, Heart, Play, Clock, Eye, Sparkles, Shield, Compass, CheckCircle } from "lucide-react";
import { Video, Category, User } from "../types";
import { TranslationSet } from "../data/translations";
import Mp4Thumbnail from "./Mp4Thumbnail";

interface BrowseViewProps {
  t: TranslationSet;
  lang: "en" | "ar";
  videos: Video[];
  categories: Category[];
  currentUser: User;
  onToggleFavorite: (videoId: string) => void;
  onPlayVideo: (video: Video) => void;
  remainingDays: number;
}

export default function BrowseView({
  t,
  lang,
  videos,
  categories,
  currentUser,
  onToggleFavorite,
  onPlayVideo,
  remainingDays
}: BrowseViewProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isRtl = lang === "ar";

  // Filter videos based on category and search (memoized for high performance)
  const filteredVideos = useMemo(() => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    return videos.filter((vid) => {
      const matchesCategory = selectedCategoryId === "all" || vid.categoryId === selectedCategoryId;
      if (!matchesCategory) return false;
      if (!cleanQuery) return true;
      return (
        vid.title.toLowerCase().includes(cleanQuery) ||
        vid.description.toLowerCase().includes(cleanQuery) ||
        vid.trainer.toLowerCase().includes(cleanQuery)
      );
    });
  }, [videos, selectedCategoryId, searchQuery]);

  // Calculate total subscription duration for circular indicator ratio
  const totalDays = currentUser.subscription?.durationDays && currentUser.subscription.durationDays > 0
    ? currentUser.subscription.durationDays
    : (currentUser.subscription?.plan === "Elite" ? 365 : currentUser.subscription?.plan === "Premium" ? 90 : 30);

  const daysRatio = totalDays > 0 ? Math.min(1, Math.max(0, remainingDays / totalDays)) : 1;

  const getPlanTranslation = (plan: string) => {
    if (lang === "ar") {
      switch (plan) {
        case "Basic": return "الأساسي (شهر)";
        case "Premium": return "الممتاز (٣ أشهر)";
        case "Elite": return "النخبة (سنة)";
        case "Custom": return "اشتراك مخصص";
        default: return "لا يوجد";
      }
    }
    return plan;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. COMPACT SUBSCRIPTION STATUS CARD */}
      <div className="w-full max-w-sm sm:max-w-md rounded-xl bg-zinc-900/90 border border-zinc-800/80 p-3 px-4 flex items-center justify-between gap-3 shadow-sm">
        {/* Left: Icon + Plan Name + Active Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="truncate text-left rtl:text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {getPlanTranslation(currentUser.subscription?.plan || "None")}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                {lang === "en" ? "Active" : "نشط"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
              {lang === "en" ? "Subscription Active" : "الاشتراك نشط حالياً"}
            </p>
          </div>
        </div>

        {/* Right: Compact Circular Countdown Indicator */}
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 48 48">
            {/* Background Track Circle */}
            <circle
              cx="24"
              cy="24"
              r="18"
              className="stroke-zinc-800"
              strokeWidth="3.5"
              fill="transparent"
            />
            {/* Progress Ring */}
            <circle
              cx="24"
              cy="24"
              r="18"
              className="stroke-emerald-400 transition-all duration-1000 ease-out"
              strokeWidth="3.5"
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={(2 * Math.PI * 18) * (1 - daysRatio)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Remaining Days in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-extrabold text-white leading-none font-mono">
              {remainingDays}
            </span>
            <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-tighter leading-none mt-0.5">
              {lang === "en" ? "days" : "يوم"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER HEADER */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-emerald-500" />
            {t.browseHeaderTitle}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === "en" 
              ? `Displaying ${filteredVideos.length} premium exercises` 
              : `نعرض الآن ${filteredVideos.length} تدريباً رياضياً ممتازاً`}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full lg:max-w-md">
          <span className={`absolute inset-y-0 flex items-center text-zinc-400 ${isRtl ? "left-3" : "right-3"}`}>
            <Search className="w-4 h-4" />
          </span>
          <input
            id="browse-video-search"
            type="text"
            placeholder={t.browseSearchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white rounded-xl py-3 px-4 outline-none transition-all ${
              isRtl ? "pl-10" : "pr-10"
            }`}
          />
        </div>
      </div>

      {/* 3. CATEGORY SCROLLBAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <button
          id="category-filter-all"
          onClick={() => setSelectedCategoryId("all")}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
            selectedCategoryId === "all"
              ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          {t.browseAllCategories}
        </button>
        {categories.map((cat) => (
          <button
            id={`category-filter-${cat.id}`}
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategoryId === cat.id
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. VIDEO GRID */}
      {filteredVideos.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl py-16 px-6 text-center space-y-4">
          <Search className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">{t.browseNoVideosFound}</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {lang === "en" 
              ? "Try adjusting your search query, clearing filters, or browsing other categories." 
              : "حاول تغيير كلمات البحث أو مسح الفلاتر أو تصفح الأقسام الأخرى."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isFav = currentUser.favorites.includes(video.id);
            const categoryObj = categories.find(c => c.id === video.categoryId);

            return (
              <div
                id={`video-card-${video.id}`}
                key={video.id}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/5"
              >
                {/* Visual Thumbnail Area */}
                <div className="relative aspect-video bg-zinc-950 overflow-hidden shrink-0">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Mp4Thumbnail videoUrl={video.url} className="w-full h-full" />
                  )}

                  {/* Dark transparent scrim overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                  {/* Play Hover Button */}
                  <button
                    onClick={() => onPlayVideo(video)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </button>

                  {/* Heart Favorite toggle (absolute) */}
                  <button
                    onClick={() => onToggleFavorite(video.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-zinc-950 transition-all cursor-pointer z-10"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 transition-transform duration-200 active:scale-125 ${
                        isFav ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-zinc-950/80 backdrop-blur-xs text-[10px] font-mono font-bold text-zinc-300 rounded-md border border-zinc-800/40 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {video.duration} {t.browseDurationLabel}
                  </span>
                </div>

                {/* Card Info Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Category Label */}
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      {categoryObj ? categoryObj.name : "Workout"}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-white text-base leading-snug tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {video.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {video.description}
                    </p>
                  </div>

                  {/* Trainer & Views Footer */}
                  <div className="flex items-center justify-between border-t border-zinc-850 pt-3 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      {video.trainer.slice(0, 18)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      {video.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
