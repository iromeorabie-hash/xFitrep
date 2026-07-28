import React, { useState } from "react";
import { 
  X, Heart, Plus, Check, Trash2, Dumbbell, Flame, Zap, Shield, 
  Activity, HeartPulse, Footprints, Target, Sparkles, BicepsFlexed 
} from "lucide-react";
import { Video } from "../types";

interface WorkoutCategoryModalProps {
  video: Video;
  currentCategory?: string;
  isAlreadyFavorite: boolean;
  onSave: (videoId: string, category: string) => void;
  onRemove: (videoId: string) => void;
  onClose: () => void;
  lang: "en" | "ar";
}

const PRESET_SPLITS = [
  { id: "Push", labelEn: "Push (Chest, Shoulders, Triceps)", labelAr: "دفع (صدر، أكتاف، ترايسبس)", icon: Dumbbell, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "Pull", labelEn: "Pull (Back, Biceps, Rear Delts)", labelAr: "سحب (ظهر، بايسبس، أكتاف خلفية)", icon: BicepsFlexed, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "Legs", labelEn: "Legs (Quads, Hamstrings, Calves)", labelAr: "أرجل (فخذ، خلفيات، بطات)", icon: Footprints, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "Abs", labelEn: "Abs & Core Routine", labelAr: "عضلات البطن والمركز", icon: Shield, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "Cardio", labelEn: "Cardio & Fat Burn HIIT", labelAr: "كارديو وحرق دهون", icon: HeartPulse, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { id: "Upper Body", labelEn: "Upper Body", labelAr: "الجزء العلوي", icon: Flame, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { id: "Lower Body", labelEn: "Lower Body", labelAr: "الجزء السفلي", icon: Activity, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { id: "Full Body", labelEn: "Full Body Circuit", labelAr: "تمارين الجسم بالكامل", icon: Sparkles, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
];

export default function WorkoutCategoryModal({
  video,
  currentCategory = "Push",
  isAlreadyFavorite,
  onSave,
  onRemove,
  onClose,
  lang,
}: WorkoutCategoryModalProps) {
  const isRtl = lang === "ar";

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory || "Push");
  const [customInput, setCustomInput] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    Boolean(currentCategory && !PRESET_SPLITS.some(p => p.id === currentCategory))
  );

  const handleConfirmSave = () => {
    const finalCategory = isCustomMode && customInput.trim() ? customInput.trim() : selectedCategory;
    onSave(video.id, finalCategory || "Push");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isRtl ? "إضافة إلى جدول التمرين" : "Assign Workout Routine Category"}
              </h3>
              <p className="text-xs text-zinc-400">
                {isRtl ? "تصنيف التمرين في المفضلة لسهولة الوصول" : "Organize video into your personal workout split"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Snippet */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3 flex items-center gap-3">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-16 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
              <Dumbbell className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{video.title}</h4>
            <span className="text-[10px] text-emerald-400 font-mono">
              {video.duration} {isRtl ? "دقيقة" : "mins"} • {video.trainer}
            </span>
          </div>
        </div>

        {/* Select Preset Split or Custom */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider block">
            {isRtl ? "اختر تقسيم الجدول (Workout Split):" : "Select Workout Split Category:"}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {PRESET_SPLITS.map((split) => {
              const active = !isCustomMode && selectedCategory === split.id;
              const IconComp = split.icon;
              return (
                <button
                  key={split.id}
                  type="button"
                  onClick={() => {
                    setIsCustomMode(false);
                    setSelectedCategory(split.id);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left rtl:text-right flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/5"
                      : "bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                      active
                        ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-sm"
                        : `${split.color}`
                    }`}>
                      <IconComp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="truncate">{isRtl ? split.labelAr : split.labelEn}</span>
                  </span>
                  {active && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Category Input */}
          <div className="pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1.5 mb-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? "+ إنشاء اسم جدول مخصص جديد" : "+ Create Custom Routine Category"}</span>
            </button>

            {isCustomMode && (
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={isRtl ? "مثال: جدول السبت، تمارين المنزل، الإطالات..." : "e.g., Saturday Pump, Home Dumbbells, Morning Stretch"}
                className="w-full px-4 py-3 bg-zinc-950 border border-emerald-500/50 rounded-2xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 animate-in fade-in duration-200"
                autoFocus
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {isAlreadyFavorite && (
            <button
              type="button"
              onClick={() => onRemove(video.id)}
              className="w-full sm:w-auto px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isRtl ? "إزالة من المفضلة" : "Remove from Favorites"}</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-2xl text-xs cursor-pointer transition-colors"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleConfirmSave}
              className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-102"
            >
              <Check className="w-4 h-4" />
              <span>{isRtl ? "حفظ إلى الجدول" : "Save to Favorites"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
