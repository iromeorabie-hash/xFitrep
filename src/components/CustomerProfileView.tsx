import React, { useState, useEffect } from "react";
import { User, CustomerProfile, DietPlan, Meal } from "../types";
import { 
  User as UserIcon, Camera, Save, Sparkles, RefreshCw, Sliders, CheckCircle, 
  AlertTriangle, Flame, Dumbbell, Apple, Heart, Activity, ShieldCheck, ChevronDown, ChevronUp, Clock, Plus, Minus
} from "lucide-react";
import { TranslationSet } from "../data/translations";

interface CustomerProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => Promise<void>;
  lang: "en" | "ar";
  isAdminView?: boolean;
  t: TranslationSet;
}

const HEALTH_CONDITIONS_LIST = [
  "Diabetes", "Hypertension", "Heart Condition", "PCOS", "Thyroid", "High Cholesterol"
];

const ALLERGIES_LIST = [
  "Nuts", "Lactose/Dairy", "Gluten", "Eggs", "Seafood", "Soy", "Shellfish", "Sesame"
];

const PREFERENCES_LIST = [
  "High-Protein", "Low-Carb", "Keto", "Vegetarian", "Vegan", "Mediterranean", "Halal"
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
];

export default function CustomerProfileView({ user, onUpdateUser, lang, isAdminView = false, t }: CustomerProfileViewProps) {
  const isRtl = lang === "ar";

  // Existing or Default Profile State
  const initialProfile: CustomerProfile = user.profile || {
    profilePicture: "",
    age: 26,
    height: 175,
    weight: 75,
    fitnessGoal: "Muscle Building",
    activityLevel: "Moderately Active",
    cuisine: "Egyptian",
    budgetLevel: "Medium / Balanced",
    healthConditions: [],
    allergies: [],
    foodPreferences: ["High-Protein"],
    dislikedFoods: ""
  };

  const [profile, setProfile] = useState<CustomerProfile>(initialProfile);
  const [userName, setUserName] = useState<string>(user.name || "");
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(user.dietPlan || null);

  // Saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // AI Diet Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genStep, setGenStep] = useState<string>("");

  // Interactive Sliders / Counters for Macro Customization
  const [customCalories, setCustomCalories] = useState<number>(dietPlan?.targetCalories || 2200);
  const [customProtein, setCustomProtein] = useState<number>(dietPlan?.targetProtein || 150);
  const [customCarbs, setCustomCarbs] = useState<number>(dietPlan?.targetCarbs || 220);
  const [customFats, setCustomFats] = useState<number>(dietPlan?.targetFats || 70);

  // Sync sliders when dietPlan updates
  useEffect(() => {
    if (dietPlan) {
      setCustomCalories(dietPlan.targetCalories);
      setCustomProtein(dietPlan.targetProtein);
      setCustomCarbs(dietPlan.targetCarbs);
      setCustomFats(dietPlan.targetFats);
    }
  }, [dietPlan]);

  // Profile Picture File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === "en" ? "Image size must be less than 5MB" : "يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfile(prev => ({ ...prev, profilePicture: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Toggle Health Conditions
  const toggleHealthCondition = (item: string) => {
    setProfile(prev => {
      const current = prev.healthConditions || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, healthConditions: updated };
    });
  };

  // Toggle Allergies
  const toggleAllergy = (item: string) => {
    setProfile(prev => {
      const current = prev.allergies || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, allergies: updated };
    });
  };

  // Toggle Preferences
  const togglePreference = (item: string) => {
    setProfile(prev => {
      const current = prev.foodPreferences || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, foodPreferences: updated };
    });
  };

  // Save Profile to Firestore
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const updatedUser: User = {
      ...user,
      name: userName,
      profile,
      dietPlan: dietPlan || undefined
    };

    try {
      await onUpdateUser(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Call AI Endpoint to Generate Diet
  const handleGenerateAIDiet = async (overrideMacros?: { calories: number; protein: number; carbs: number; fats: number }) => {
    setIsGenerating(true);
    setGenError(null);
    setGenStep(lang === "en" ? "Analyzing health conditions and allergies..." : "جاري تحليل الحالة الصحية والحساسية الغذائية...");

    try {
      const targetMacros = overrideMacros || {
        calories: customCalories,
        protein: customProtein,
        carbs: customCarbs,
        fats: customFats
      };

      const res = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: userName,
            ...profile
          },
          customMacros: targetMacros
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate AI diet plan.");
      }

      setDietPlan(data.dietPlan);

      // Auto save updated plan to user record
      const updatedUser: User = {
        ...user,
        name: userName,
        profile,
        dietPlan: data.dietPlan
      };
      await onUpdateUser(updatedUser);

    } catch (err: any) {
      setGenError(err.message || "An error occurred while generating diet plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate dynamic scaled meals when macro sliders are moved
  const getScaledMeals = (): Meal[] => {
    if (!dietPlan || !dietPlan.meals.length) return [];
    
    // Original total calories
    const origCal = dietPlan.targetCalories || 2000;
    if (origCal <= 0) return dietPlan.meals;

    const scale = customCalories / origCal;

    return dietPlan.meals.map(m => ({
      ...m,
      calories: Math.round(m.calories * scale),
      protein: Math.round(m.protein * scale),
      carbs: Math.round(m.carbs * scale),
      fats: Math.round(m.fats * scale)
    }));
  };

  const displayedMeals = getScaledMeals();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      
      {/* HEADER TITLE */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-800 border-2 border-emerald-500/40 overflow-hidden flex items-center justify-center shadow-lg">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-emerald-400" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl cursor-pointer shadow-lg transition-transform hover:scale-110">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{userName || user.name}</h1>
              {isAdminView && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  Admin Editing
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              {lang === "en" 
                ? "Customer Profile, Health Conditions & AI Diet Plan Generator" 
                : "ملف المشترك، البيانات الصحية ومولد النظام الغذائي بالذكاء الاصطناعي"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{lang === "en" ? "Save Profile Changes" : "حفظ التغييرات"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">
            {lang === "en" ? "Customer profile saved successfully!" : "تم حفظ بيانات المشترك بنجاح!"}
          </span>
        </div>
      )}

      {/* SECTION 1: CUSTOMER PROFILE INPUT FIELDS */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Activity className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === "en" ? "1. Customer Health & Fitness Metrics" : "1. البيانات الصحية والقياسات"}
          </h2>
        </div>

        {/* Basic Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Name" : "الاسم الكامل"}
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Full Name"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Age (Years)" : "العمر (سنة)"}
            </label>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-1">
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, age: Math.max(10, (p.age || 25) - 1) }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={profile.age || 25}
                onChange={(e) => setProfile(p => ({ ...p, age: parseInt(e.target.value) || 25 }))}
                className="w-full text-center bg-transparent text-white font-bold focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, age: (p.age || 25) + 1 }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Height (cm)" : "الطول (سم)"}
            </label>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-1">
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, height: Math.max(100, (p.height || 170) - 1) }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={profile.height || 170}
                onChange={(e) => setProfile(p => ({ ...p, height: parseInt(e.target.value) || 170 }))}
                className="w-full text-center bg-transparent text-white font-bold focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, height: (p.height || 170) + 1 }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Current Weight (kg)" : "الوزن الحالي (كجم)"}
            </label>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-1">
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, weight: Math.max(30, (p.weight || 70) - 1) }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={profile.weight || 70}
                onChange={(e) => setProfile(p => ({ ...p, weight: parseInt(e.target.value) || 70 }))}
                className="w-full text-center bg-transparent text-white font-bold focus:outline-none"
              />
              <button 
                type="button"
                onClick={() => setProfile(p => ({ ...p, weight: (p.weight || 70) + 1 }))}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Goals, Cuisine, Budget & Activity Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Fitness Goal" : "الهدف الرياضي"}
            </label>
            <select
              value={profile.fitnessGoal || "Muscle Building"}
              onChange={(e) => setProfile(p => ({ ...p, fitnessGoal: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Weight Loss">Weight Loss (تنزيل الوزن)</option>
              <option value="Weight Gain">Weight Gain (زيادة الوزن)</option>
              <option value="Muscle Building">Muscle Building (بناء العضلات)</option>
              <option value="Maintenance">Maintenance (المحافظة على الوزن)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Cuisine / Cuisine Type" : "نوع المطبخ / الوجبات"}
            </label>
            <select
              value={profile.cuisine || "Egyptian"}
              onChange={(e) => setProfile(p => ({ ...p, cuisine: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Egyptian">Egyptian (مطبخ مصري - فول، بيض، دجاج، كشري)</option>
              <option value="Middle Eastern">Middle Eastern / Oriental (شرقي - مشويات، أرز)</option>
              <option value="Western">Western (غربي - ستيك، أومليت، سالمون)</option>
              <option value="Mediterranean">Mediterranean (بحر متوسط - زيت زيتون، أسماك)</option>
              <option value="Asian">Asian (آسيوي)</option>
              <option value="International">International (عالمي متنوع)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Budget Level" : "مستوى الميزانية"}
            </label>
            <select
              value={profile.budgetLevel || "Medium / Balanced"}
              onChange={(e) => setProfile(p => ({ ...p, budgetLevel: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Low / Budget-Friendly">Low / Budget-Friendly (اقتصادي - بيض، جبن، عدس)</option>
              <option value="Medium / Balanced">Medium / Balanced (متوسط - دجاج، لحم، أرز)</option>
              <option value="High / Premium">High / Premium (فاخر - سالمون، أفوكادو، مكملات)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {lang === "en" ? "Activity Level" : "مستوى النشاط اليومي"}
            </label>
            <select
              value={profile.activityLevel || "Moderately Active"}
              onChange={(e) => setProfile(p => ({ ...p, activityLevel: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="Sedentary">Sedentary (خامل - مكتب)</option>
              <option value="Lightly Active">Lightly Active (نشاط خفيف 1-2 يوم/أسبوع)</option>
              <option value="Moderately Active">Moderately Active (نشاط متوسط 3-5 أيام/أسبوع)</option>
              <option value="Very Active">Very Active (نشاط عالي 6-7 أيام/أسبوع)</option>
            </select>
          </div>
        </div>

        {/* Multi-Select: Health Conditions */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span>{lang === "en" ? "Health Conditions" : "الحالات الصحية والطبية"}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {HEALTH_CONDITIONS_LIST.map((item) => {
              const active = profile.healthConditions?.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleHealthCondition(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    active 
                      ? "bg-red-500/20 border-red-500 text-red-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {active ? "✓ " : "+ "}{item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Select: Food Allergies */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lang === "en" ? "Food Allergies & Intolerances (STRICT EXCLUSION)" : "الحساسية الغذائية (استبعاد تام)"}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ALLERGIES_LIST.map((item) => {
              const active = profile.allergies?.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAllergy(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    active 
                      ? "bg-amber-500/20 border-amber-500 text-amber-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {active ? "🚫 " : "+ "}{item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Select: Dietary Preferences */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Apple className="w-4 h-4 text-emerald-400" />
            <span>{lang === "en" ? "Dietary Preferences" : "التفضيلات الغذائية"}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {PREFERENCES_LIST.map((item) => {
              const active = profile.foodPreferences?.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => togglePreference(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    active 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {active ? "✓ " : "+ "}{item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Disliked Foods Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {lang === "en" ? "Disliked Foods / Ingredients" : "أطعمة لا تفضلها"}
          </label>
          <input
            type="text"
            value={profile.dislikedFoods || ""}
            onChange={(e) => setProfile(p => ({ ...p, dislikedFoods: e.target.value }))}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-white focus:border-emerald-500 focus:outline-none"
            placeholder={lang === "en" ? "e.g., Mushrooms, Cilantro, Spicy peppers" : "مثال: الفطر، الكزبرة، الفلفل الحار"}
          />
        </div>
      </div>

      {/* SECTION 2: AI DIET GENERATOR & INTERACTIVE MACRO SLIDERS */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-white">
                {lang === "en" ? "2. AI-Powered Diet Generator" : "2. مولد النظام الغذائي الذكي"}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lang === "en" 
                  ? "Custom meal plan generated using Gemini AI & customized macro targets"
                  : "خطة وجبات مخصصة بالكامل بالذكاء الاصطناعي بناءً على بياناتك والحساسية"}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGenerateAIDiet()}
            disabled={isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 fill-current" />
            )}
            <span>
              {dietPlan 
                ? (lang === "en" ? "Regenerate AI Meal Plan" : "إعادة توليد النظام الغذائي")
                : (lang === "en" ? "Generate Custom AI Meal Plan" : "توليد النظام الغذائي الذكي")}
            </span>
          </button>
        </div>

        {/* Active Allergies Exclusions Banner */}
        {profile.allergies && profile.allergies.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center gap-3 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              {lang === "en"
                ? `Safety Exclusions Active: Guaranteeing zero ingredients matching (${profile.allergies.join(", ")})`
                : `حماية واستبعاد الحساسية نشطة: نضمن خلو الوجبات تماماً من (${profile.allergies.join(", ")})`}
            </span>
          </div>
        )}

        {genError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{genError}</span>
          </div>
        )}

        {/* Loading Spinner with Progress Steps */}
        {isGenerating && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-white font-bold text-lg animate-pulse">{genStep}</p>
            <p className="text-xs text-zinc-500 max-w-md">
              {lang === "en" 
                ? "Checking allergy constraints, calculating macro ratios, and structuring recipes..." 
                : "جاري التدقيق في استبعاد الحساسية، حساب السعرات، وتجهيز الوصفات..."}
            </p>
          </div>
        )}

        {/* INTERACTIVE MACRO SLIDERS / COUNTERS */}
        <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {lang === "en" ? "Interactive Macronutrient Counters & Sliders" : "أدوات التحكم بالسعرات والماكروز"}
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              {lang === "en" ? "Real-time meal portion auto-scaler" : "تعديل تلقائي للوجبات بمرونة"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calories Slider & Counter */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Flame className="w-4 h-4" /> Total Calories
                </span>
                <span className="text-white font-black text-base">{customCalories} kcal</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="50"
                value={customCalories}
                onChange={(e) => setCustomCalories(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setCustomCalories(c => Math.max(1200, c - 50))}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  -50 kcal
                </button>
                <button
                  onClick={() => setCustomCalories(c => c + 50)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  +50 kcal
                </button>
              </div>
            </div>

            {/* Protein Slider & Counter */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Dumbbell className="w-4 h-4" /> Protein
                </span>
                <span className="text-white font-black text-base">{customProtein} g</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="5"
                value={customProtein}
                onChange={(e) => setCustomProtein(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setCustomProtein(p => Math.max(50, p - 5))}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  -5g
                </button>
                <button
                  onClick={() => setCustomProtein(p => p + 5)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  +5g
                </button>
              </div>
            </div>

            {/* Carbs Slider & Counter */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Apple className="w-4 h-4" /> Carbs
                </span>
                <span className="text-white font-black text-base">{customCarbs} g</span>
              </div>
              <input
                type="range"
                min="50"
                max="450"
                step="5"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setCustomCarbs(c => Math.max(50, c - 5))}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  -5g
                </button>
                <button
                  onClick={() => setCustomCarbs(c => c + 5)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  +5g
                </button>
              </div>
            </div>

            {/* Fats Slider & Counter */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Heart className="w-4 h-4" /> Healthy Fats
                </span>
                <span className="text-white font-black text-base">{customFats} g</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={customFats}
                onChange={(e) => setCustomFats(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setCustomFats(f => Math.max(20, f - 5))}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  -5g
                </button>
                <button
                  onClick={() => setCustomFats(f => f + 5)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                >
                  +5g
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DISPLAY DIET PLAN MEALS */}
        {dietPlan && !isGenerating && (
          <div className="space-y-6">
            {/* Diet Plan Summary Header */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 p-6 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-emerald-400">
                    {lang === "en" ? "Nutritional Strategy & Meal Plan" : "الخطة الغذائية والوجبات الموصى بها"}
                  </h3>
                  <p className="text-sm text-zinc-300 mt-1">
                    {(lang === "ar" && dietPlan.summaryAr) ? dietPlan.summaryAr : dietPlan.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {customCalories} {lang === "en" ? "Calories Total" : "إجمالي السعرات"}
                  </span>
                </div>
              </div>
              {(dietPlan.dietaryNotes || dietPlan.dietaryNotesAr) && (
                <p className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  ⚠️ {(lang === "ar" && dietPlan.dietaryNotesAr) ? dietPlan.dietaryNotesAr : dietPlan.dietaryNotes}
                </p>
              )}
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedMeals.map((meal) => {
                // Ensure food names in the nutrition plans are always written in Arabic as requested
                const mealTitle = meal.titleAr || meal.title;
                const mealDesc = meal.descriptionAr || meal.description;
                const mealIngredients = (meal.ingredientsAr && meal.ingredientsAr.length) 
                  ? meal.ingredientsAr 
                  : meal.ingredients;
                const mealInstructions = meal.instructionsAr || meal.instructions;

                const mealTypeLabel = lang === "ar" 
                  ? (meal.type === "Breakfast" ? "الإفطار" : meal.type === "Lunch" ? "الغداء" : meal.type === "Dinner" ? "العشاء" : "وجبة خفيفة")
                  : meal.type;

                return (
                  <div 
                    key={meal.id || meal.type}
                    className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        {mealTypeLabel}
                      </span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" /> {meal.calories} {lang === "en" ? "kcal" : "سعرة"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{mealTitle}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{mealDesc}</p>
                    </div>

                    {/* Macros breakdown badge */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <span className="block text-zinc-500 font-bold">{lang === "en" ? "Protein" : "بروتين"}</span>
                        <span className="font-extrabold text-emerald-400">{meal.protein}g</span>
                      </div>
                      <div>
                        <span className="block text-zinc-500 font-bold">{lang === "en" ? "Carbs" : "كارب"}</span>
                        <span className="font-extrabold text-blue-400">{meal.carbs}g</span>
                      </div>
                      <div>
                        <span className="block text-zinc-500 font-bold">{lang === "en" ? "Fats" : "دهون"}</span>
                        <span className="font-extrabold text-purple-400">{meal.fats}g</span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                        {lang === "en" ? "Ingredients:" : "المكونات:"}
                      </span>
                      <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                        {mealIngredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Preparation instructions */}
                    <div className="space-y-1 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                      <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
                        {lang === "en" ? "Preparation:" : "طريقة التحضير:"}
                      </span>
                      <p className="text-xs text-zinc-400">{mealInstructions}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
