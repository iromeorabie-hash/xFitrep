import React, { useState, useMemo } from "react";
import { Heart, Play, Clock, Eye, Shield, HeartCrack, Layers, FolderHeart, Edit3, Dumbbell } from "lucide-react";
import { Video, Category, User } from "../types";
import { TranslationSet } from "../data/translations";
import Mp4Thumbnail from "./Mp4Thumbnail";

interface FavoritesViewProps {
  t: TranslationSet;
  lang: "en" | "ar";
  videos: Video[];
  categories: Category[];
  currentUser: User;
  onOpenCategoryModal?: (video: Video) => void;
  onToggleFavorite: (videoId: string) => void;
  onPlayVideo: (video: Video) => void;
}

export default function FavoritesView({
  t,
  lang,
  videos,
  categories,
  currentUser,
  onOpenCategoryModal,
  onToggleFavorite,
  onPlayVideo
}: FavoritesViewProps) {
  const isRtl = lang === "ar";
  const [selectedWorkoutCategory, setSelectedWorkoutCategory] = useState<string>("all");

  // Get all favorited videos
  const favoriteVideos = useMemo(() => {
    return videos.filter((vid) => currentUser.favorites.includes(vid.id));
  }, [videos, currentUser.favorites]);

  // Map video ID to its assigned workout routine split category (defaulting to "Push" if unassigned)
  const favCategoriesMap = currentUser.favoriteCategories || {};

  // Find all unique routine categories present in the user's favorites
  const activeCategories = useMemo(() => {
    const set = new Set<string>();
    favoriteVideos.forEach((v) => {
      const cat = favCategoriesMap[v.id] || "Push";
      set.add(cat);
    });
    return Array.from(set);
  }, [favoriteVideos, favCategoriesMap]);

  // Filtered videos based on selected tab
  const displayedVideos = useMemo(() => {
    if (selectedWorkoutCategory === "all") return favoriteVideos;
    return favoriteVideos.filter((v) => (favCategoriesMap[v.id] || "Push") === selectedWorkoutCategory);
  }, [favoriteVideos, selectedWorkoutCategory, favCategoriesMap]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-emerald-500 fill-current" />
            {t.favsTitle}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isRtl 
              ? "فيديوهات التمارين المفضلة مقسّمة حسب الجدول والجلسة الرياضية (Push, Pull, Legs, Abs, Cardio...)"
              : "Your saved workout routines, organized neatly into workout splits & custom days."}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
              {isRtl ? "إجمالي التمارين المحفوظة" : "Saved Routines"}
            </span>
            <span className="text-base font-black text-emerald-400">
              {favoriteVideos.length} {isRtl ? "تمرين" : "Videos"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. WORKOUT SPLIT CATEGORY TABS */}
      {favoriteVideos.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <button
            onClick={() => setSelectedWorkoutCategory("all")}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              selectedWorkoutCategory === "all"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? "جميع التمارين" : "All Workout Splits"} ({favoriteVideos.length})</span>
          </button>

          {activeCategories.map((catName) => {
            const count = favoriteVideos.filter((v) => (favCategoriesMap[v.id] || "Push") === catName).length;
            const isSelected = selectedWorkoutCategory === catName;

            return (
              <button
                key={catName}
                onClick={() => setSelectedWorkoutCategory(catName)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>{catName}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-md font-mono ${
                  isSelected ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. GRID OF FAVORITED VIDEOS */}
      {favoriteVideos.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl py-16 px-6 text-center space-y-4">
          <HeartCrack className="w-12 h-12 text-zinc-600 mx-auto animate-bounce" />
          <h3 className="text-sm font-bold text-zinc-300">{t.favsEmpty}</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            {isRtl 
              ? "اضغط على زر الإعجاب (❤️) عند تصفح التمارين لإضافتها وتصنيفها في جدولك الرياضي."
              : "Click the heart icon on any exercise video to organize it into your Push/Pull/Legs splits."}
          </p>
        </div>
      ) : displayedVideos.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl py-12 px-6 text-center space-y-3">
          <Dumbbell className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">
            {isRtl ? `لا توجد تمارين في جدول "${selectedWorkoutCategory}"` : `No videos found in "${selectedWorkoutCategory}"`}
          </h3>
          <button
            onClick={() => setSelectedWorkoutCategory("all")}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            {isRtl ? "عرض جميع المفضلة" : "Show all saved workouts"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVideos.map((video) => {
            const categoryObj = categories.find((c) => c.id === video.categoryId);
            const assignedSplit = favCategoriesMap[video.id] || "Push";

            return (
              <div
                id={`fav-video-card-${video.id}`}
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

                  {/* Assigned Workout Routine Split Tag Overlay */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500 text-zinc-950 font-black text-[10px] shadow-lg border border-emerald-400">
                    <FolderHeart className="w-3 h-3" />
                    <span>{assignedSplit}</span>
                  </div>

                  {/* Edit Category / Remove Heart button */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    {onOpenCategoryModal && (
                      <button
                        onClick={() => onOpenCategoryModal(video)}
                        className="w-8 h-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:bg-zinc-950 transition-all cursor-pointer"
                        title={isRtl ? "تغيير تصنيف الجدول" : "Change workout category"}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onToggleFavorite(video.id)}
                      className="w-8 h-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center text-red-500 hover:bg-zinc-950 transition-all cursor-pointer"
                      title={isRtl ? "إزالة من المفضلة" : "Remove from Favorites"}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Play Hover Button */}
                  <button
                    onClick={() => onPlayVideo(video)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
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
