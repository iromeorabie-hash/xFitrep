import React, { useState } from "react";
import {
  Users,
  Video as VideoIcon,
  Layers,
  Calendar,
  Check,
  X,
  Plus,
  Trash2,
  FolderPlus,
  Clock,
  UserCheck,
  UserX,
  CreditCard,
  UserPlus,
  Play,
  Eye,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Apple
} from "lucide-react";
import { User, Category, Video } from "../types";
import Mp4Thumbnail from "./Mp4Thumbnail";
import CustomerProfileView from "./CustomerProfileView";
import { translations } from "../data/translations";

interface AdminViewProps {
  users: User[];
  categories: Category[];
  videos: Video[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateUserSubscription: (
    userId: string,
    plan: "Basic" | "Premium" | "Elite" | "Custom",
    days: number,
    customExpiryDate?: string
  ) => void;
  onUpdateUser?: (updatedUser: User) => Promise<void>;
  onCreateCategory: (name: string, description: string) => void;
  onUpdateCategory: (id: string, name: string, description: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddVideo: (videoData: Omit<Video, "id" | "views" | "createdAt">) => void;
  onDeleteVideo: (id: string) => void;
}

export default function AdminView({
  users,
  categories,
  videos,
  onApproveUser,
  onRejectUser,
  onUpdateUserSubscription,
  onUpdateUser,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddVideo,
  onDeleteVideo
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "categories" | "videos" | "users" | "subscriptions">(
    "dashboard"
  );

  // States for Category CRUD
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatDesc, setEditingCatDesc] = useState("");

  // States for Video Upload
  const [vidTitle, setVidTitle] = useState("");
  const [vidUrl, setVidUrl] = useState("");
  const [vidCatId, setVidCatId] = useState("");
  const [vidDuration, setVidDuration] = useState(10);
  const [vidTrainer, setVidTrainer] = useState("");
  const [vidThumb, setVidThumb] = useState("");
  const [vidDesc, setVidDesc] = useState("");

  // States for User management & plan activation
  const [userFilter, setUserFilter] = useState<"pending" | "approved" | "all">("pending");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [editingProfileUser, setEditingProfileUser] = useState<User | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<"Basic" | "Premium" | "Elite" | "Custom">("Basic");
  const [customDays, setCustomDays] = useState(30);
  const [customDate, setCustomDate] = useState("");

  // Success / error banner states
  const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const triggerFeedback = (text: string, type: "success" | "error" = "success") => {
    setActionFeedback({ type, text });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  // 1. Dashboard calculations
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === "pending");
  const approvedUsers = users.filter((u) => u.status === "approved");
  const activeSubscriptions = approvedUsers.filter((u) => {
    if (!u.subscription.expiresAt) return false;
    return new Date(u.subscription.expiresAt).getTime() > Date.now();
  });
  const totalViews = videos.reduce((acc, curr) => acc + curr.views, 0);

  // Submit new category
  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      triggerFeedback("Category name cannot be empty", "error");
      return;
    }
    onCreateCategory(newCatName.trim(), newCatDesc.trim());
    setNewCatName("");
    setNewCatDesc("");
    triggerFeedback("Category created successfully!");
  };

  const handleUpdateCategorySubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editingCatName.trim()) {
      triggerFeedback("Category name cannot be empty", "error");
      return;
    }
    onUpdateCategory(id, editingCatName.trim(), editingCatDesc.trim());
    setEditingCatId(null);
    triggerFeedback("Category updated successfully!");
  };

  const handleDeleteCategoryClick = (id: string) => {
    // Check if there are videos linked to this category
    const linkedVideos = videos.filter((v) => v.categoryId === id);
    if (linkedVideos.length > 0) {
      triggerFeedback(
        `Cannot delete. This category is currently linked to ${linkedVideos.length} video(s).`,
        "error"
      );
      return;
    }
    onDeleteCategory(id);
    triggerFeedback("Category deleted successfully.");
  };

  // Submit new video
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidUrl.trim() || !vidCatId) {
      triggerFeedback("Please fill in Title, URL, and Category", "error");
      return;
    }
    onAddVideo({
      title: vidTitle.trim(),
      url: vidUrl.trim(),
      categoryId: vidCatId,
      duration: Number(vidDuration) || 10,
      trainer: vidTrainer.trim() || "Fit Rep Trainer",
      thumbnail: vidThumb.trim() || undefined,
      description: vidDesc.trim() || "A premium fitness training routine."
    });

    // Reset video form fields
    setVidTitle("");
    setVidUrl("");
    setVidDuration(10);
    setVidTrainer("");
    setVidThumb("");
    setVidDesc("");
    triggerFeedback("Premium workout video uploaded successfully!");
  };

  // Calculate remaining days helper
  const calculateDaysLeft = (expiresAt: string | null) => {
    if (!expiresAt) return 0;
    const diffTime = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Activate custom or standard plan for user
  const handleActivatePlan = (userId: string) => {
    let days = 30;
    if (selectedPlanType === "Basic") days = 30;
    else if (selectedPlanType === "Premium") days = 90;
    else if (selectedPlanType === "Elite") days = 365;
    else {
      // Custom plan
      if (customDate) {
        // Calculate days from current date to customDate
        const diff = new Date(customDate).getTime() - Date.now();
        days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      } else {
        days = customDays;
      }
    }

    onUpdateUserSubscription(userId, selectedPlanType, days, customDate || undefined);
    setExpandedUserId(null);
    triggerFeedback("Customer subscription updated successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER BANNER - PURPLE THEMED FOR ADMIN */}
      <div className="bg-purple-950/20 border border-purple-900/50 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Control Center
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Fit Rep Admin Console
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            Review pending registrations, authorize video streaming access, update subscription products, and manage the premium fitness video directory.
          </p>
        </div>

        <div className="shrink-0 flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Logged In As</span>
            <span className="font-bold text-white text-sm">Coach Ramadan</span>
          </div>
        </div>
      </div>

      {/* ACTION FEEDBACK ALERT */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 ${
            actionFeedback.type === "success"
              ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {actionFeedback.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionFeedback.text}</span>
        </div>
      )}

      {/* TAB SELECTOR BAR - PURPLE ADMIN SPECIAL */}
      <div className="flex items-center gap-1 bg-zinc-900/60 p-1 border border-zinc-800 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { id: "dashboard", label: "Dashboard", icon: Layers },
          { id: "categories", label: "Categories", icon: FolderPlus },
          { id: "videos", label: "Videos", icon: VideoIcon },
          { id: "users", label: "Users & Plans", icon: Users, badge: pendingUsers.length },
          { id: "subscriptions", label: "Subscriptions", icon: CreditCard }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`admin-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all select-none cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/15"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-3xl p-6 md:p-8">
        
        {/* ======================================================== */}
        {/* 1. DASHBOARD TAB */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Counters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Total Customers</span>
                <h3 className="text-3xl font-black text-white">{totalUsers}</h3>
                <span className="text-[10px] text-zinc-400 block">{approvedUsers.length} Approved • {pendingUsers.length} Pending</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block">Pending Approvals</span>
                <h3 className="text-3xl font-black text-red-400">{pendingUsers.length}</h3>
                <span className="text-[10px] text-zinc-400 block">Require review to grant browse access</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">Active Subscriptions</span>
                <h3 className="text-3xl font-black text-purple-400">{activeSubscriptions.length}</h3>
                <span className="text-[10px] text-zinc-400 block">Unexpired streaming permissions</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">Workout Directory Size</span>
                <h3 className="text-3xl font-black text-white">{videos.length}</h3>
                <span className="text-[10px] text-zinc-400 block">Across {categories.length} physical categories</span>
              </div>
            </div>

            {/* Quick overview panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Category stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Category Distributions
                </h4>
                <div className="space-y-3 pt-2">
                  {categories.map((cat) => {
                    const count = videos.filter((v) => v.categoryId === cat.id).length;
                    const pct = videos.length > 0 ? (count / videos.length) * 100 : 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 font-medium">{cat.name}</span>
                          <span className="text-zinc-400 font-mono">{count} videos ({Math.round(pct)}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-purple-400" />
                  Highest Viewed Sessions
                </h4>
                <div className="divide-y divide-zinc-800/60">
                  {[...videos]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 3)
                    .map((vid) => (
                      <div key={vid.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-zinc-200 block truncate max-w-xs">{vid.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{vid.trainer} • {vid.duration} mins</span>
                        </div>
                        <span className="text-xs font-bold text-purple-400 font-mono flex items-center gap-1 shrink-0">
                          <Eye className="w-3.5 h-3.5" />
                          {vid.views.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. CATEGORIES TAB */}
        {/* ======================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Split screen: Create Category vs List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Creator form */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 h-fit lg:col-span-1">
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">Add New Category</h4>
                  <p className="text-[10px] text-zinc-400">Classify physical routines dynamically</p>
                </div>
                
                <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Category Name</label>
                    <input
                      id="admin-cat-name"
                      type="text"
                      placeholder="e.g. Cardio Blast, Core Abs"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Short Description</label>
                    <textarea
                      id="admin-cat-desc"
                      rows={3}
                      placeholder="Specify focus areas or target muscle groups"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    id="admin-cat-submit"
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl tracking-wide transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Save Category
                  </button>
                </form>
              </div>

              {/* List of current Categories */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Active Categories ({categories.length})</h4>
                </div>

                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div
                      id={`admin-cat-row-${cat.id}`}
                      key={cat.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {editingCatId === cat.id ? (
                        <form
                          onSubmit={(e) => handleUpdateCategorySubmit(e, cat.id)}
                          className="w-full space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              className="w-full bg-zinc-950 border border-purple-500 text-xs text-white rounded-xl py-2 px-3 outline-none"
                              required
                            />
                            <input
                              type="text"
                              value={editingCatDesc}
                              onChange={(e) => setEditingCatDesc(e.target.value)}
                              className="w-full bg-zinc-950 border border-purple-500 text-xs text-white rounded-xl py-2 px-3 outline-none md:col-span-2"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatId(null)}
                              className="px-3 py-1.5 bg-zinc-800 text-zinc-300 font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{cat.name}</span>
                              <span className="text-[9px] font-mono bg-zinc-950 px-2 py-0.5 rounded-md text-zinc-500">
                                ID: {cat.id}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-sans">{cat.description || "No description provided."}</p>
                          </div>
                          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                            <button
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditingCatName(cat.name);
                                setEditingCatDesc(cat.description);
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategoryClick(cat.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. VIDEOS TAB */}
        {/* ======================================================== */}
        {activeTab === "videos" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Creator Upload Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Register New Workout Video</h4>
                <p className="text-xs text-zinc-400">Link streamable training tutorials to specific category directories</p>
              </div>

              <form onSubmit={handleAddVideoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Video Title *</label>
                  <input
                    id="admin-vid-title"
                    type="text"
                    placeholder="e.g. 15-Min Six Pack Shred"
                    value={vidTitle}
                    onChange={(e) => setVidTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Stream URL (YouTube, Vimeo, or MP4) *</label>
                  <input
                    id="admin-vid-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=... or .mp4 link"
                    value={vidUrl}
                    onChange={(e) => setVidUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Category Folder *</label>
                  <select
                    id="admin-vid-cat"
                    value={vidCatId}
                    onChange={(e) => setVidCatId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all"
                    required
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Duration (Minutes)</label>
                    <input
                      id="admin-vid-duration"
                      type="number"
                      min={1}
                      value={vidDuration}
                      onChange={(e) => setVidDuration(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">Coach / Trainer Name</label>
                    <input
                      id="admin-vid-trainer"
                      type="text"
                      placeholder="e.g. Marcus Sterling"
                      value={vidTrainer}
                      onChange={(e) => setVidTrainer(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400">Fallback Poster Image URL (Optional)</label>
                  <input
                    id="admin-vid-thumb"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={vidThumb}
                    onChange={(e) => setVidThumb(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-400">Video Walkthrough Description</label>
                  <textarea
                    id="admin-vid-desc"
                    rows={2}
                    placeholder="Outline specific physical conditioning cues or target repetitions..."
                    value={vidDesc}
                    onChange={(e) => setVidDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white rounded-xl py-3 px-4 outline-none transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    id="admin-vid-submit"
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl tracking-wide transition-all shadow-md shadow-purple-500/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    Upload & Add to Stream
                  </button>
                </div>
              </form>
            </div>

            {/* Video Listing & Management */}
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm">Active Video Library ({videos.length})</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((vid) => {
                  const categoryObj = categories.find((c) => c.id === vid.categoryId);
                  const isMp4 = vid.url.toLowerCase().includes(".mp4") || vid.url.toLowerCase().includes("mixkit.co");

                  return (
                    <div
                      id={`admin-video-row-${vid.id}`}
                      key={vid.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-zinc-700 transition-all"
                    >
                      {/* Mini Preview frame */}
                      <div className="w-24 aspect-video bg-zinc-950 rounded-xl overflow-hidden shrink-0 relative border border-zinc-800">
                        {vid.thumbnail ? (
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Mp4Thumbnail videoUrl={vid.url} className="w-full h-full" />
                        )}
                        <span className="absolute bottom-1 right-1 bg-zinc-950/80 text-[8px] font-mono px-1 rounded text-zinc-400">
                          {vid.duration}m
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black uppercase text-purple-400">
                            {categoryObj ? categoryObj.name : "Workout"}
                          </span>
                          <h5 className="font-bold text-white text-xs truncate" title={vid.title}>
                            {vid.title}
                          </h5>
                          <p className="text-[10px] text-zinc-500 truncate" title={vid.url}>
                            {isMp4 ? "Direct MP4 stream: " : "Embedded: "}{vid.url}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span>Coach: {vid.trainer}</span>
                          <button
                            onClick={() => {
                              onDeleteVideo(vid.id);
                              triggerFeedback("Workout video deleted successfully.");
                            }}
                            className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. USERS TAB (APPROVE / REJECT & ACTIVATE PLAN) */}
        {/* ======================================================== */}
        {activeTab === "users" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Filter segments */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-850 pb-4">
              <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
                {[
                  { id: "pending", label: `Pending Reviews (${pendingUsers.length})` },
                  { id: "approved", label: "Approved Customers" },
                  { id: "all", label: "All Registries" }
                ].map((seg) => (
                  <button
                    id={`user-seg-${seg.id}`}
                    key={seg.id}
                    onClick={() => setUserFilter(seg.id as any)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      userFilter === seg.id
                        ? "bg-purple-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {seg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users listing */}
            <div className="space-y-4">
              {users
                .filter((u) => {
                  if (userFilter === "pending") return u.status === "pending";
                  if (userFilter === "approved") return u.status === "approved";
                  return true; // "all"
                })
                .map((user) => {
                  const isPending = user.status === "pending";
                  const isRejected = user.status === "rejected";
                  const daysRemaining = calculateDaysLeft(user.subscription?.expiresAt || null);
                  const isExpanded = expandedUserId === user.id;

                  return (
                    <div
                      id={`admin-user-row-${user.id}`}
                      key={user.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 hover:border-purple-500/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono font-bold text-xs text-purple-400">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{user.name}</span>
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  user.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : user.status === "rejected"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                }`}
                              >
                                {user.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-4">
                              <span>Phone: {user.phone}</span>
                              <span className="text-zinc-500">Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  onApproveUser(user.id);
                                  triggerFeedback(`Approved ${user.name}! Now you can configure their subscription.`);
                                }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer shadow-lg shadow-purple-500/10"
                              >
                                <UserCheck className="w-4 h-4" />
                                Approve User
                              </button>
                              <button
                                onClick={() => {
                                  onRejectUser(user.id);
                                  triggerFeedback(`Rejected ${user.name}.`, "error");
                                }}
                                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer"
                              >
                                <UserX className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setEditingProfileUser(user)}
                            className="px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <Apple className="w-4 h-4" />
                            <span>Profile & AI Diet</span>
                          </button>

                          {user.status === "approved" && (
                            <button
                              id={`btn-manage-sub-${user.id}`}
                              onClick={() => {
                                setExpandedUserId(isExpanded ? null : user.id);
                              }}
                              className="px-4 py-2.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-750 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                            >
                              <CreditCard className="w-4 h-4 text-purple-400" />
                              <span>Manage Subscription</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subscription Request Info */}
                      {user.subscriptionRequest && (
                        <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-4 space-y-2.5 font-sans">
                          <div className="flex items-center justify-between border-b border-purple-950/50 pb-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400 font-mono flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Subscription Plan Request Details
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Submitted: {new Date(user.subscriptionRequest.submittedAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-purple-950/20 flex items-center justify-between">
                              <span className="text-zinc-400">Requested Plan:</span>
                              <span className="text-purple-300 font-black bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-[11px]">
                                {user.subscriptionRequest.plan}
                              </span>
                            </div>
                            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-purple-950/20 flex items-center justify-between">
                              <span className="text-zinc-400">Payment Reference / Transfer ID:</span>
                              <span className="text-emerald-400 font-mono font-black select-all">
                                {user.subscriptionRequest.paymentRef}
                              </span>
                            </div>
                          </div>
                          {user.subscriptionRequest.notes && (
                            <div className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-purple-950/20">
                              <span className="text-zinc-500 font-mono font-bold block mb-1">Customer Note:</span>
                              <p className="italic text-zinc-300">"{user.subscriptionRequest.notes}"</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Plan Information banner for approved users */}
                      {user.status === "approved" && !isExpanded && (
                        <div className="bg-zinc-950/60 rounded-xl p-3 border border-zinc-850 text-xs text-zinc-400 flex flex-wrap gap-x-6 gap-y-1">
                          <div>
                            <span className="text-zinc-500 font-mono">Plan:</span>{" "}
                            <span className="text-zinc-200 font-bold">{user.subscription?.plan || "None"}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 font-mono">Expires At:</span>{" "}
                            <span className="text-zinc-200 font-bold">
                              {user.subscription?.expiresAt
                                ? new Date(user.subscription.expiresAt).toLocaleDateString()
                                : "No Active Plan"}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 font-mono">Days Remaining:</span>{" "}
                            <span
                              className={`font-black ${
                                daysRemaining > 0 ? "text-emerald-400" : "text-red-400 animate-pulse"
                              }`}
                            >
                              {daysRemaining} Days
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Expanded Plan Modification interface */}
                      {isExpanded && (
                        <div className="bg-zinc-950 p-5 rounded-2xl border border-purple-500/20 space-y-4 animate-in slide-in-from-top-2 duration-150">
                          <h5 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">
                            Configure Subscription Plan & Days
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-1.5 sm:col-span-2">
                              <label className="text-xs font-bold text-zinc-400 block">Subscription Type</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { id: "Basic", desc: "Basic (1 Mo)" },
                                  { id: "Premium", desc: "Prem (3 Mo)" },
                                  { id: "Elite", desc: "Elite (1 Yr)" },
                                  { id: "Custom", desc: "Custom Date" }
                                ].map((p) => (
                                  <button
                                    type="button"
                                    key={p.id}
                                    onClick={() => setSelectedPlanType(p.id as any)}
                                    className={`py-2 px-1 text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                                      selectedPlanType === p.id
                                        ? "bg-purple-600 text-white"
                                        : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                                    }`}
                                  >
                                    {p.desc}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {selectedPlanType === "Custom" ? (
                              <>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-zinc-400 block">Or Select Specific Date</label>
                                  <input
                                    id="custom-expiry-date-picker"
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg p-2 outline-none focus:border-purple-500"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-zinc-400 block">Fallback Days</label>
                                  <input
                                    id="custom-expiry-days-picker"
                                    type="number"
                                    min={1}
                                    value={customDays}
                                    onChange={(e) => {
                                      setCustomDays(Number(e.target.value));
                                      setCustomDate(""); // Clear date picker if they type days
                                    }}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg p-2 outline-none focus:border-purple-500"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="sm:col-span-2 text-xs text-zinc-400 flex items-center pl-2 pt-5">
                                <Clock className="w-4 h-4 text-purple-400 shrink-0 mr-2" />
                                <span>
                                  {selectedPlanType === "Basic" && "Basic allocates exactly 30 days of library access."}
                                  {selectedPlanType === "Premium" && "Premium allocates exactly 90 days of library access."}
                                  {selectedPlanType === "Elite" && "Elite allocates exactly 365 days of library access."}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              id={`btn-activate-plan-${user.id}`}
                              onClick={() => handleActivatePlan(user.id)}
                              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md"
                            >
                              Activate Subscription
                            </button>
                            <button
                              onClick={() => setExpandedUserId(null)}
                              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              
              {users.filter((u) => {
                if (userFilter === "pending") return u.status === "pending";
                if (userFilter === "approved") return u.status === "approved";
                return true;
              }).length === 0 && (
                <div className="py-12 px-4 border border-zinc-850 rounded-2xl bg-zinc-900/40 text-center text-zinc-500 text-xs">
                  No customers found matching the filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. SUBSCRIPTIONS SUMMARY TAB */}
        {/* ======================================================== */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Active Subscription Registry</h4>
              <p className="text-xs text-zinc-400">Continuous ledger summarizing current active customer tokens and remaining access windows</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400 border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">User Name</th>
                    <th className="py-3.5 px-4 font-bold">Phone Number</th>
                    <th className="py-3.5 px-4 font-bold">Activated Plan</th>
                    <th className="py-3.5 px-4 font-bold">Registration Status</th>
                    <th className="py-3.5 px-4 font-bold">Days Left</th>
                    <th className="py-3.5 px-4 font-bold">Plan Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {users.map((u) => {
                    const days = calculateDaysLeft(u.subscription.expiresAt);
                    const isActive = days > 0 && u.status === "approved";

                    return (
                      <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                        <td className="py-4 px-4 font-mono">{u.phone}</td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-zinc-300">
                            {u.subscription.plan === "None" ? "No Active Plan" : u.subscription.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              u.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : u.status === "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono">
                          {isActive ? (
                            <span className="text-emerald-400 font-bold">{days} Days</span>
                          ) : u.status === "approved" ? (
                            <span className="text-red-400 font-bold">Expired</span>
                          ) : (
                            <span className="text-zinc-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-zinc-300">
                            {u.subscription.expiresAt
                              ? new Date(u.subscription.expiresAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admin Customer Profile Modal */}
      {editingProfileUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto relative space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                Admin Manager: Customer Profile & AI Diet ({editingProfileUser.name})
              </h3>
              <button
                onClick={() => setEditingProfileUser(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CustomerProfileView
              user={editingProfileUser}
              onUpdateUser={async (updated) => {
                if (onUpdateUser) {
                  await onUpdateUser(updated);
                }
                setEditingProfileUser(updated);
                triggerFeedback(`Saved profile and diet plan for ${updated.name}`);
              }}
              lang="en"
              isAdminView={true}
              t={translations.en}
            />
          </div>
        </div>
      )}
    </div>
  );
}
