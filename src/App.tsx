import React, { useState, useEffect } from "react";
import { User, Category, Video, Subscription } from "./types";
import { translations } from "./data/translations";
import LandingView from "./components/LandingView";
import AuthView from "./components/AuthView";
import BrowseView from "./components/BrowseView";
import FavoritesView from "./components/FavoritesView";
import AdminView from "./components/AdminView";
import CustomerProfileView from "./components/CustomerProfileView";
import VideoModal from "./components/VideoModal";
import WorkoutCategoryModal from "./components/WorkoutCategoryModal";
import SettingsModal from "./components/SettingsModal";
import SubscriptionRequestForm from "./components/SubscriptionRequestForm";
import { 
  Dumbbell, Play, Heart, Users, Shield, LogOut, LogIn, UserPlus, 
  Globe, LayoutDashboard, ChevronRight, AlertTriangle, MessageCircle, Clock,
  Lock, CheckCircle, ShieldX, Apple, Settings, User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, onSnapshot } from "firebase/firestore";
import { 
  db, 
  seedFirestoreIfNeeded, 
  addOrUpdateUserFirestore, 
  addOrUpdateCategoryFirestore, 
  deleteCategoryFirestore, 
  addOrUpdateVideoFirestore, 
  deleteVideoFirestore,
  handleFirestoreError,
  OperationType
} from "./data/firebase";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "register" | "browse" | "favorites" | "admin-login" | "admin" | "profile">("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  // Database lists
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  // Active watching video & modal states
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [categoryModalVideo, setCategoryModalVideo] = useState<Video | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync HTML document direction and language when lang state changes
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // Set up Firebase Firestore real-time snapshot listeners
  useEffect(() => {
    let unsubscribeUsers: () => void = () => {};
    let unsubscribeCategories: () => void = () => {};
    let unsubscribeVideos: () => void = () => {};

    async function initFirebase() {
      // 1. Seed if empty
      try {
        await seedFirestoreIfNeeded();
      } catch (err) {
        console.error("Firestore seeding error:", err);
      }

      // 2. Setup real-time listeners
      unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const usersList: User[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const subscription = data.subscription || {
            plan: "None",
            activatedAt: null,
            expiresAt: null,
            durationDays: 0
          };
          usersList.push({ id: doc.id, ...data, subscription } as User);
        });
        setUsers(usersList);

        // Also sync currently logged in user state automatically if changed by admin
        let activeId: string | null = null;
        const savedUser = localStorage.getItem("fitrep_current_user");
        if (savedUser) {
          try {
            activeId = JSON.parse(savedUser).id;
          } catch {}
        }

        if (activeId) {
          const synced = usersList.find((u: User) => u.id === activeId);
          if (synced) {
            setCurrentUser(synced);
            localStorage.setItem("fitrep_current_user", JSON.stringify(synced));
          }
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "users");
      });

      unsubscribeCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
        const categoriesList: Category[] = [];
        snapshot.forEach((doc) => {
          categoriesList.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(categoriesList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "categories");
      });

      unsubscribeVideos = onSnapshot(collection(db, "videos"), (snapshot) => {
        const videosList: Video[] = [];
        snapshot.forEach((doc) => {
          videosList.push({ id: doc.id, ...doc.data() } as Video);
        });
        setVideos(videosList);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "videos");
      });
    }

    initFirebase();

    // 3. Fetch active auth and language states from localStorage
    const savedUser = localStorage.getItem("fitrep_current_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && !parsed.subscription) {
          parsed.subscription = {
            plan: "None",
            activatedAt: null,
            expiresAt: null,
            durationDays: 0
          };
        }
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Error reading saved user", e);
      }
    }

    const savedAdmin = localStorage.getItem("fitrep_is_admin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    }

    const savedLang = localStorage.getItem("fitrep_lang");
    if (savedLang === "ar" || savedLang === "en") {
      setLang(savedLang as any);
    }

    return () => {
      unsubscribeUsers();
      unsubscribeCategories();
      unsubscribeVideos();
    };
  }, []);

  // Switch languages and save choice
  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    setLang(nextLang);
    localStorage.setItem("fitrep_lang", nextLang);
  };

  // Helper: calculate remaining days
  const calculateDaysLeft = (expiresAt: string | null) => {
    if (!expiresAt) return 0;
    const diffTime = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const userRemainingDays = currentUser && currentUser.subscription ? calculateDaysLeft(currentUser.subscription.expiresAt) : 0;
  const isSubscriptionActive = currentUser && currentUser.status === "approved" && userRemainingDays > 0;

  // ---------------------------------------------------------------------------
  // AUTH ACTIONS
  // ---------------------------------------------------------------------------
  const handleRegister = async (name: string, phone: string, pass: string) => {
    const exists = users.some(u => u.phone === phone);
    if (exists) {
      return { success: false, error: lang === "en" ? "Phone number already registered." : "رقم الهاتف مسجل بالفعل." };
    }

    const newUser: User = {
      id: "user-" + Date.now(),
      name,
      phone,
      password: pass,
      status: "pending",
      subscription: {
        plan: "None",
        activatedAt: null,
        expiresAt: null,
        durationDays: 0
      },
      favorites: [],
      createdAt: new Date().toISOString()
    };

    try {
      await addOrUpdateUserFirestore(newUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: lang === "en" ? "Registration failed. Try again." : "فشل التسجيل. حاول مرة أخرى." };
    }
  };

  const handleLogin = (phone: string, pass: string) => {
    const found = users.find(u => u.phone === phone && u.password === pass);
    if (!found) {
      return { success: false, error: lang === "en" ? "Invalid phone or password." : "خطأ في رقم الهاتف أو كلمة المرور." };
    }

    // Set user
    setCurrentUser(found);
    localStorage.setItem("fitrep_current_user", JSON.stringify(found));
    setIsAdmin(false);
    localStorage.removeItem("fitrep_is_admin");

    // Route based on subscription status
    if (found.status === "approved") {
      const remaining = calculateDaysLeft(found.subscription.expiresAt);
      if (remaining > 0) {
        setCurrentView("browse");
      } else {
        setCurrentView("browse"); // We'll show the subscription guard screen in browse view
      }
    } else {
      setCurrentView("browse"); // We will render corresponding pending/rejected status templates nicely
    }

    return { success: true };
  };

  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    if (adminUser === "Ramadan" && adminPass === "Poiuy8995") {
      setIsAdmin(true);
      localStorage.setItem("fitrep_is_admin", "true");
      setCurrentUser(null);
      localStorage.removeItem("fitrep_current_user");
      setCurrentView("admin");
      // Clear admin login form
      setAdminUser("");
      setAdminPass("");
    } else {
      setAdminError(lang === "en" ? "Incorrect username or password." : "اسم المستخدم أو كلمة المرور غير صحيحة.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("fitrep_current_user");
    localStorage.removeItem("fitrep_is_admin");
    setCurrentView("landing");
  };

  // ---------------------------------------------------------------------------
  // CORE DATABASE INTERACTIONS (REAL-TIME CLOUD FIRESTORE)
  // ---------------------------------------------------------------------------
  const handleOpenCategoryModal = (video: Video) => {
    setCategoryModalVideo(video);
  };

  const handleToggleFavorite = (videoId: string) => {
    if (!currentUser) return;
    const foundVideo = videos.find((v) => v.id === videoId);
    if (foundVideo) {
      setCategoryModalVideo(foundVideo);
    }
  };

  const handleSaveFavoriteCategory = async (videoId: string, workoutCategory: string) => {
    if (!currentUser) return;

    const isFav = currentUser.favorites.includes(videoId);
    let nextFavs = [...currentUser.favorites];
    if (!isFav) {
      nextFavs.push(videoId);
    }

    const nextCatMap = {
      ...(currentUser.favoriteCategories || {}),
      [videoId]: workoutCategory,
    };

    const updatedUser = {
      ...currentUser,
      favorites: nextFavs,
      favoriteCategories: nextCatMap,
    };

    try {
      await addOrUpdateUserFirestore(updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("fitrep_current_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error saving favorite workout category:", err);
    } finally {
      setCategoryModalVideo(null);
    }
  };

  const handleRemoveFavorite = async (videoId: string) => {
    if (!currentUser) return;

    const nextFavs = currentUser.favorites.filter((id) => id !== videoId);
    const nextCatMap = { ...(currentUser.favoriteCategories || {}) };
    delete nextCatMap[videoId];

    const updatedUser = {
      ...currentUser,
      favorites: nextFavs,
      favoriteCategories: nextCatMap,
    };

    try {
      await addOrUpdateUserFirestore(updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("fitrep_current_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error removing favorite:", err);
    } finally {
      setCategoryModalVideo(null);
    }
  };

  const handleApproveUser = async (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (!found) return;
    
    let updated = { 
      ...found, 
      status: "approved" as const,
      subscription: found.subscription || {
        plan: "None" as const,
        activatedAt: null,
        expiresAt: null,
        durationDays: 0
      }
    };
    
    // Auto-activate requested plan if exists
    if (found.subscriptionRequest) {
      const { plan } = found.subscriptionRequest;
      let days = 30;
      if (plan === "Basic") days = 30;
      else if (plan === "Premium") days = 90;
      else if (plan === "Elite") days = 365;

      const activatedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      
      updated = {
        ...updated,
        subscription: {
          plan,
          activatedAt,
          expiresAt,
          durationDays: days
        },
        subscriptionRequest: undefined
      };
    }

    try {
      await addOrUpdateUserFirestore(updated);
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await addOrUpdateUserFirestore(updatedUser);
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        localStorage.setItem("fitrep_current_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
    }
  };

  const handleRejectUser = async (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (!found) return;
    const updated = { 
      ...found, 
      status: "rejected" as const, 
      subscription: { plan: "None" as const, activatedAt: null, expiresAt: null, durationDays: 0 },
      subscriptionRequest: undefined
    };
    try {
      await addOrUpdateUserFirestore(updated);
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  const handleUpdateUserSubscription = async (
    userId: string,
    plan: "Basic" | "Premium" | "Elite" | "Custom",
    days: number,
    customExpiryDate?: string
  ) => {
    const found = users.find(u => u.id === userId);
    if (!found) return;

    const activatedAt = new Date().toISOString();
    let expiresAt = "";

    if (plan === "Custom" && customExpiryDate) {
      expiresAt = new Date(customExpiryDate).toISOString();
    } else {
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    }

    const updated = {
      ...found,
      subscription: {
        plan,
        activatedAt,
        expiresAt,
        durationDays: days
      },
      subscriptionRequest: undefined
    };

    try {
      await addOrUpdateUserFirestore(updated);
    } catch (err) {
      console.error("Error updating subscription:", err);
    }
  };

  const handleRequestSubscription = async (
    plan: "Basic" | "Premium" | "Elite" | "Custom",
    paymentRef: string,
    notes?: string
  ) => {
    if (!currentUser) return;

    const subscriptionRequest = {
      plan,
      paymentRef,
      notes,
      submittedAt: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      status: "pending" as const, // Send back to pending review
      subscriptionRequest
    };

    try {
      await addOrUpdateUserFirestore(updatedUser);
      setCurrentUser(updatedUser);
      localStorage.setItem("fitrep_current_user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error requesting subscription:", err);
      throw err;
    }
  };

  const handleCreateCategory = async (name: string, description: string) => {
    const newCat: Category = {
      id: "cat-" + Date.now(),
      name,
      description
    };
    try {
      await addOrUpdateCategoryFirestore(newCat);
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleUpdateCategory = async (id: string, name: string, description: string) => {
    const newCat: Category = { id, name, description };
    try {
      await addOrUpdateCategoryFirestore(newCat);
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryFirestore(id);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleAddVideo = async (videoData: Omit<Video, "id" | "views" | "createdAt">) => {
    const newVideo: Video = {
      ...videoData,
      id: "vid-" + Date.now(),
      views: Math.floor(Math.random() * 60) + 12, // Pre-lively video
      createdAt: new Date().toISOString()
    };
    try {
      await addOrUpdateVideoFirestore(newVideo);
    } catch (err) {
      console.error("Error adding video:", err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideoFirestore(id);
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  const handlePlayVideo = async (video: Video) => {
    // Increment view count directly in Firestore
    const updated = { ...video, views: video.views + 1 };
    try {
      await addOrUpdateVideoFirestore(updated);
    } catch (err) {
      console.error("Error playing video:", err);
    }
    setActiveVideo(video);
  };

  const t = translations[lang];
  const isRtl = lang === "ar";

  // Calculate stats for landing page display
  const stats = {
    activeMembers: users.filter(u => u.status === "approved" && calculateDaysLeft(u.subscription.expiresAt) > 0).length + 48, // seed booster
    totalViews: videos.reduce((sum, v) => sum + v.views, 0) + 124500, // seed booster
    premiumVideos: videos.length
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* STICKY HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => setCurrentView("landing")}
            className="flex items-center text-left focus:outline-hidden cursor-pointer group"
          >
            <img 
              src="https://i.postimg.cc/XN25zxCG/1000234956-removebg-preview.png" 
              alt="Logo" 
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Nav Links based on Auth Status */}
          {(!currentUser || isAdmin) && (
            <nav className="hidden md:flex items-center gap-1.5 bg-zinc-900/60 p-1 border border-zinc-850 rounded-2xl">
              <button
                id="nav-home-btn"
                onClick={() => setCurrentView("landing")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  currentView === "landing"
                    ? (isAdmin ? "bg-purple-600 text-white" : "bg-emerald-500 text-zinc-950")
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.navHome}
              </button>

              {/* If Admin is logged in */}
              {isAdmin && (
                <>
                  <button
                    id="nav-admin-btn"
                    onClick={() => setCurrentView("admin")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      currentView === "admin"
                        ? "bg-purple-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {t.navAdmin}
                  </button>
                  <button
                    id="nav-admin-browse-preview"
                    onClick={() => setCurrentView("browse")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      currentView === "browse"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {t.navBrowse} (Preview)
                  </button>
                </>
              )}

              {/* Logged out triggers */}
              {!currentUser && !isAdmin && (
                <>
                  <button
                    id="nav-login-link"
                    onClick={() => setCurrentView("login")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      currentView === "login" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {t.navLogin}
                  </button>
                  <button
                    id="nav-register-link"
                    onClick={() => setCurrentView("register")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      currentView === "register" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {t.navRegister}
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Toolbar: Lang Toggle, Admin Badge, Logout */}
          <div className="flex items-center gap-3">
            {/* Lang switcher */}
            <button
              id="lang-toggle-btn"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.languageLabel}</span>
            </button>

            {/* Admin Badge */}
            {isAdmin && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Panel</span>
              </div>
            )}

            {/* Logout button */}
            {(currentUser || isAdmin) && (
              <button
                id="header-logout-btn"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                title={t.navLogout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* PERSISTENT USER PROFILE CARD BANNER (Directly below website logo & header bar across ALL pages) */}
      {currentUser && (
        <section
          id="persistent-user-profile-banner"
          className="bg-zinc-900/90 border-b border-zinc-800/80 px-4 md:px-8 py-3 transition-all duration-300 sticky top-[65px] z-30 backdrop-blur-md shadow-lg"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: User Profile Avatar & Personal Info */}
            <div
              onClick={() => setCurrentView("profile")}
              className="flex items-center gap-3.5 cursor-pointer group min-w-0"
              title="Click to manage profile and AI Diet plan"
            >
              <div className="relative shrink-0">
                {currentUser.profile?.profilePicture ? (
                  <img
                    src={currentUser.profile.profilePicture}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-xl flex items-center justify-center border-2 border-emerald-400 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] font-black text-zinc-950 shadow-xs">
                  ✓
                </div>
              </div>

              <div className="min-w-0 text-left rtl:text-right">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                    {currentUser.name || "Customer Account"}
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                    {currentUser.subscription?.plan !== "None" ? `${currentUser.subscription?.plan} Plan` : (isRtl ? "عضوية نشطة" : "Active Member")}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {currentUser.phone} • {currentUser.profile?.fitnessGoal ? `${isRtl ? "الهدف: " : "Goal: "}${currentUser.profile.fitnessGoal}` : (isRtl ? "الملف الشخصي ونظام التغذية الذكي" : "Customer Profile & AI Nutrition")}
                </p>
              </div>
            </div>

            {/* Right: Quick Navigation Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCurrentView("profile")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "profile"
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? "الملف والدايت" : "Profile & Diet"}</span>
              </button>

              <button
                onClick={() => setCurrentView("browse")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "browse"
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{isRtl ? "المكتبة" : "Library"}</span>
              </button>

              <button
                onClick={() => setCurrentView("favorites")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === "favorites"
                    ? "bg-emerald-500 text-zinc-950 shadow-md"
                    : "bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>{isRtl ? "المفضلة" : "Favorites"}</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* MOBILE HEADER SUB-NAVBAR FOR FASTER RESPONSIVE NAVIGATION */}
      {!currentUser && (
        <div className="md:hidden sticky top-[69px] z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/40 py-2 px-4 flex items-center justify-center gap-3 overflow-x-auto">
          <button
            onClick={() => setCurrentView("landing")}
            className={`px-3 py-1 text-xs font-bold rounded-lg ${
              currentView === "landing" ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-500"
            }`}
          >
            {t.navHome}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setCurrentView("admin")}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  currentView === "admin" ? "bg-purple-600 text-white" : "text-zinc-500"
                }`}
              >
                {t.navAdmin}
              </button>
              <button
                onClick={() => setCurrentView("browse")}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  currentView === "browse" ? "bg-purple-900/20 text-purple-300 border border-purple-500/30" : "text-zinc-500"
                }`}
              >
                Browse Preview
              </button>
            </>
          )}

          {!isAdmin && (
            <>
              <button
                onClick={() => setCurrentView("login")}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  currentView === "login" ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-500"
                }`}
              >
                {t.navLogin}
              </button>
              <button
                onClick={() => setCurrentView("register")}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  currentView === "register" ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-500"
                }`}
              >
                {t.navRegister}
              </button>
            </>
          )}
        </div>
      )}

      {/* MAIN VIEW CONTROLLER GRID CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        {/* VIEW ROUTING CONTROLLER */}
        {(() => {
          switch (currentView) {
            case "landing":
              return (
                <LandingView
                  t={t}
                  lang={lang}
                  onNavigate={setCurrentView}
                  isLoggedIn={!!currentUser}
                  isAdmin={isAdmin}
                  stats={stats}
                />
              );

            case "login":
            case "register":
              return (
                <AuthView
                  t={t}
                  lang={lang}
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  initialMode={currentView}
                />
              );

            case "favorites":
              if (!currentUser) {
                return (
                  <div className="max-w-md mx-auto py-16 text-center space-y-4">
                    <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-sm font-bold text-zinc-300">
                      {lang === "en" ? "Sign in required" : "يلزم تسجيل الدخول"}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lang === "en" ? "Please log in to view saved routines." : "يرجى تسجيل الدخول لعرض تمارينك المفضلة."}
                    </p>
                    <button
                      onClick={() => setCurrentView("login")}
                      className="px-5 py-2.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-xl"
                    >
                      {t.navLogin}
                    </button>
                  </div>
                );
              }
              return (
                <FavoritesView
                  t={t}
                  lang={lang}
                  videos={videos}
                  categories={categories}
                  currentUser={currentUser}
                  onOpenCategoryModal={handleOpenCategoryModal}
                  onToggleFavorite={handleRemoveFavorite}
                  onPlayVideo={handlePlayVideo}
                />
              );

            case "profile":
              if (!currentUser) {
                return (
                  <div className="max-w-md mx-auto py-16 text-center space-y-4">
                    <Lock className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-sm font-bold text-zinc-300">
                      {lang === "en" ? "Sign in required" : "يلزم تسجيل الدخول"}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lang === "en" ? "Please log in to manage your customer profile and AI diet plan." : "يرجى تسجيل الدخول لإدارة ملفك الشخصي ونظامك الغذائي بالذكاء الاصطناعي."}
                    </p>
                    <button
                      onClick={() => setCurrentView("login")}
                      className="px-5 py-2.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {t.navLogin}
                    </button>
                  </div>
                );
              }
              return (
                <CustomerProfileView
                  user={currentUser}
                  onUpdateUser={handleUpdateUser}
                  lang={lang}
                  t={t}
                />
              );

            case "browse":
              // Route Protection: Ensure user is authorized & active
              // If Admin, bypass safety to allow previewing content!
              if (isAdmin) {
                // Return BrowseView with a mock Admin user context so it doesn't crash
                const mockAdminUser: User = {
                  id: "admin-pre",
                  name: "Administrator Preview",
                  phone: "Ramadan Admin",
                  status: "approved",
                  subscription: { plan: "Elite", activatedAt: null, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), durationDays: 365 },
                  favorites: [],
                  createdAt: ""
                };
                return (
                  <div className="space-y-4">
                    <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-xl font-mono">
                      🚨 ADMIN VIEW PREVIEW MODE • Testing video playback & categories
                    </div>
                    <BrowseView
                      t={t}
                      lang={lang}
                      videos={videos}
                      categories={categories}
                      currentUser={mockAdminUser}
                      onToggleFavorite={() => {}}
                      onPlayVideo={handlePlayVideo}
                      remainingDays={365}
                    />
                  </div>
                );
              }

              if (!currentUser) {
                return (
                  <div className="max-w-md mx-auto py-16 text-center space-y-4">
                    <Lock className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-sm font-bold text-zinc-300">
                      {lang === "en" ? "Subscription Access Guard" : "بوابة المشتركين المقفلة"}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lang === "en" 
                        ? "The exclusive Fit Rep streaming library requires an approved subscriber log in with active days remaining." 
                        : "يتطلب تصفح مكتبة فيديوهات فت ريب الحصرية تسجيل الدخول بحساب مشترك مفعل وباقة سارية."}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setCurrentView("login")}
                        className="px-5 py-2.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {t.navLogin}
                      </button>
                      <button
                        onClick={() => setCurrentView("register")}
                        className="px-5 py-2.5 bg-zinc-800 text-white border border-zinc-750 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {t.navRegister}
                      </button>
                    </div>
                  </div>
                );
              }

              // Active state filters:
              // CASE A: User is Pending review
              if (currentUser.status === "pending") {
                return (
                  <div className="max-w-xl mx-auto py-12 px-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-6 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto">
                      <Clock className="w-7 h-7 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white">{t.statusPendingTitle}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{t.statusPendingDesc}</p>
                    </div>
                    
                    <div className="border-t border-zinc-850 pt-5 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Provide this information to Admin (Coach Ramadan):</span>
                      <div className="bg-zinc-950 p-3 rounded-xl font-mono text-xs text-zinc-300 flex justify-around">
                        <span>Name: {currentUser.name}</span>
                        <span>Phone: {currentUser.phone}</span>
                      </div>
                    </div>

                    {currentUser.subscriptionRequest ? (
                      <div className="bg-purple-950/20 border border-purple-900/30 rounded-2xl p-5 text-left space-y-3 font-sans">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-bold block flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Subscription Request Under Review:
                        </span>
                        <div className="text-xs text-zinc-300 space-y-2">
                          <div>Plan Type: <span className="text-white font-black bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">{currentUser.subscriptionRequest.plan}</span></div>
                          <div>Payment Reference: <span className="text-emerald-400 font-mono font-bold">{currentUser.subscriptionRequest.paymentRef}</span></div>
                          {currentUser.subscriptionRequest.notes && (
                            <div>Notes: <span className="text-zinc-400 italic">"{currentUser.subscriptionRequest.notes}"</span></div>
                          )}
                          <div className="text-[10px] text-zinc-500 font-mono mt-2 pt-2 border-t border-purple-950/40">
                            Submitted on {new Date(currentUser.subscriptionRequest.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <SubscriptionRequestForm
                        onSuccess={handleRequestSubscription}
                        lang={lang}
                      />
                    )}
                  </div>
                );
              }

              // CASE B: User is Rejected
              if (currentUser.status === "rejected") {
                return (
                  <div className="max-w-lg mx-auto py-12 px-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-5 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                      <ShieldX className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-red-500">{t.statusRejectedTitle}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{t.statusRejectedDesc}</p>
                  </div>
                );
              }

              // CASE C: User is Approved, but subscription plan has expired / or not active
              if (!isSubscriptionActive) {
                return (
                  <div className="max-w-xl mx-auto py-12 px-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center space-y-6 animate-in fade-in" dir={isRtl ? "rtl" : "ltr"}>
                    <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white">{t.statusNoSubscriptionTitle}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{t.statusNoSubscriptionDesc}</p>
                    </div>

                    <div className="bg-zinc-950/80 p-4 rounded-xl text-left text-xs text-zinc-300 font-sans border border-zinc-850">
                      <span className="font-bold text-white block mb-2 text-center text-emerald-400">Available Plans:</span>
                      <ul className="space-y-1.5 list-disc pl-5">
                        <li><strong>Basic Plan</strong>: 1 Month (30 Days of Workout Library access)</li>
                        <li><strong>Premium Plan</strong>: 3 Months (90 Days of full access)</li>
                        <li><strong>Elite Plan</strong>: 1 Year (365 Days of unhindered tutorials)</li>
                        <li><strong>Custom Plan</strong>: Customized based on specific days/dates configured by Coach Ramadan</li>
                      </ul>
                    </div>

                    <p className="text-[10px] text-zinc-500 font-mono mb-4">
                      Your current plan is: {!currentUser.subscription || currentUser.subscription.plan === "None" ? "No subscription active" : `Expired ${currentUser.subscription.plan}`} • Expiry date: {currentUser.subscription?.expiresAt ? new Date(currentUser.subscription.expiresAt).toLocaleDateString() : "Never activated"}
                    </p>

                    {currentUser.subscriptionRequest ? (
                      <div className="bg-purple-950/20 border border-purple-900/30 rounded-2xl p-5 text-left space-y-3 font-sans">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-bold block flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Renewal Request Under Review:
                        </span>
                        <div className="text-xs text-zinc-300 space-y-2">
                          <div>Plan Type: <span className="text-white font-black bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">{currentUser.subscriptionRequest.plan}</span></div>
                          <div>Payment Reference: <span className="text-emerald-400 font-mono font-bold">{currentUser.subscriptionRequest.paymentRef}</span></div>
                          {currentUser.subscriptionRequest.notes && (
                            <div>Notes: <span className="text-zinc-400 italic">"{currentUser.subscriptionRequest.notes}"</span></div>
                          )}
                          <div className="text-[10px] text-zinc-500 font-mono mt-2 pt-2 border-t border-purple-950/40">
                            Submitted on {new Date(currentUser.subscriptionRequest.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <SubscriptionRequestForm
                        onSuccess={handleRequestSubscription}
                        lang={lang}
                      />
                    )}
                  </div>
                );
              }

              // Normal display for active approved user
              return (
                <BrowseView
                  t={t}
                  lang={lang}
                  videos={videos}
                  categories={categories}
                  currentUser={currentUser}
                  onToggleFavorite={handleToggleFavorite}
                  onPlayVideo={handlePlayVideo}
                  remainingDays={userRemainingDays}
                />
              );

            case "admin-login":
              return (
                <div className="max-w-md mx-auto my-8 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
                  <div className="bg-zinc-900 border border-purple-900/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Admin corner glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

                    <div className="text-center space-y-2 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-3">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-black text-white">Fit Rep Admin Portal</h2>
                      <p className="text-xs text-zinc-400">Authorized Coach Administration Only</p>
                    </div>

                    {adminError && (
                      <div className="p-4 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {adminError}
                      </div>
                    )}

                    <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400">Username</label>
                        <input
                          id="admin-username-input"
                          type="text"
                          placeholder="e.g. Ramadan"
                          value={adminUser}
                          onChange={(e) => setAdminUser(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3.5 px-4 outline-none transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-400">Password</label>
                        <input
                          id="admin-password-input"
                          type="password"
                          placeholder="••••••••"
                          value={adminPass}
                          onChange={(e) => setAdminPass(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3.5 px-4 outline-none transition-all"
                          required
                        />
                      </div>

                      <button
                        id="admin-login-submit-btn"
                        type="submit"
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl tracking-wide transition-all shadow-md shadow-purple-500/10 cursor-pointer"
                      >
                        Verify & Access Console
                      </button>
                    </form>
                    
                    <div className="mt-6 text-center text-[10px] text-zinc-500">
                      Standard users should use the home client credentials form instead.
                    </div>
                  </div>
                </div>
              );

            case "admin":
              // Route Protection: Ensure admin status
              if (!isAdmin) {
                return (
                  <div className="max-w-md mx-auto py-16 text-center space-y-4">
                    <Shield className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-sm font-bold text-zinc-300">Access Restricted</h3>
                    <p className="text-xs text-zinc-500">This action requires elevated administrative tokens.</p>
                    <button
                      onClick={() => setCurrentView("admin-login")}
                      className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
                    >
                      Verify Administration Login
                    </button>
                  </div>
                );
              }
              return (
                <AdminView
                  users={users}
                  categories={categories}
                  videos={videos}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                  onUpdateUserSubscription={handleUpdateUserSubscription}
                  onUpdateUser={handleUpdateUser}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onAddVideo={handleAddVideo}
                  onDeleteVideo={handleDeleteVideo}
                />
              );

            default:
              return null;
          }
        })()}

      </main>

      {/* FULL RESPONSIVE VIDEO PLAYING DIALOG MODAL */}
      {activeVideo && (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          lang={lang}
        />
      )}

      {/* WORKOUT CATEGORY SELECTION MODAL */}
      {categoryModalVideo && (
        <WorkoutCategoryModal
          video={categoryModalVideo}
          currentCategory={currentUser?.favoriteCategories?.[categoryModalVideo.id] || "Push"}
          isAlreadyFavorite={Boolean(currentUser?.favorites.includes(categoryModalVideo.id))}
          onSave={handleSaveFavoriteCategory}
          onRemove={handleRemoveFavorite}
          onClose={() => setCategoryModalVideo(null)}
          lang={lang}
        />
      )}

      {/* GLOBAL SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onToggleLanguage={toggleLanguage}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => {
          if (isAdmin) {
            setCurrentView("admin");
          } else {
            setCurrentView("admin-login");
          }
        }}
        onOpenProfile={() => setCurrentView("profile")}
        t={t}
      />

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-10 mt-16 text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
          {/* Bottom Settings Button (Only located at the bottom of the website) */}
          <button
            id="footer-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850 text-xs font-bold text-zinc-200 hover:text-emerald-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg group"
          >
            <Settings className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
            <span>{isRtl ? "إعدادات التطبيق والتفضيلات" : "Application Settings & Preferences"}</span>
          </button>

          <p className="text-xs text-zinc-400">
            {t.footerCopyright}
          </p>

          <div className="flex justify-center items-center gap-4 text-xs text-zinc-500 font-mono uppercase tracking-wider">
            <button onClick={() => setCurrentView("landing")} className="hover:text-emerald-400 transition-colors cursor-pointer">{t.navHome}</button>
            <span>•</span>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-emerald-400 font-bold transition-colors cursor-pointer">{isRtl ? "الإعدادات" : "Settings"}</button>
            <span>•</span>
            <a href="https://wa.me/201044186025" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">WhatsApp Support (+20 1044186025)</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
