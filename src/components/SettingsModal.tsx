import React, { useState } from "react";
import { X, Settings as SettingsIcon, Globe, Shield, Lock, Bell, Moon, User, Check, ChevronRight } from "lucide-react";
import { User as UserType } from "../types";
import { TranslationSet } from "../data/translations";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ar";
  onToggleLanguage: () => void;
  currentUser: UserType | null;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenProfile: () => void;
  t: TranslationSet;
}

export default function SettingsModal({
  isOpen,
  onClose,
  lang,
  onToggleLanguage,
  currentUser,
  isAdmin,
  onOpenAdminLogin,
  onOpenProfile,
  t,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const isRtl = lang === "ar";
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoplayVideo, setAutoplayVideo] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Settings</h3>
              <p className="text-xs text-zinc-400">
                {isRtl ? "تفضيلات التطبيق والإعدادات العامة" : "App preferences and configuration"}
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

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* User Profile Card inside Settings */}
          {currentUser && (
            <div
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="bg-zinc-950 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                {currentUser.profile?.profilePicture ? (
                  <img
                    src={currentUser.profile.profilePicture}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-zinc-950 font-extrabold text-lg flex items-center justify-center">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-zinc-400">{currentUser.phone}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {currentUser.subscription?.plan !== "None" ? `${currentUser.subscription?.plan} Plan Active` : "Registered Client"}
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-transform ${isRtl ? "rotate-180" : ""}`} />
            </div>
          )}

          {/* Preferences Group */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
              {isRtl ? "تفضيلات الواجهة" : "Display & Language"}
            </span>

            {/* Language Toggle */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Language / اللغة</span>
                  <span className="text-[10px] text-zinc-400">
                    {lang === "en" ? "Currently English" : "اللغة الحالية: العربية"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleLanguage}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {lang === "en" ? "العربية" : "English"}
              </button>
            </div>

            {/* Autoplay Videos Toggle */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isRtl ? "تشغيل الفيديو تلقائياً" : "Autoplay Workout Videos"}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isRtl ? "تشغيل التمرين مباشرة عند الاختيار" : "Play videos automatically when selected"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoplayVideo(!autoplayVideo)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoplayVideo ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-zinc-950 absolute top-1 transition-transform ${
                    autoplayVideo ? (isRtl ? "left-1" : "right-1") : (isRtl ? "right-1" : "left-1")
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Secure System Administration Section */}
          <div className="space-y-3 pt-3 border-t border-zinc-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
              {isRtl ? "الإدارة والأمان" : "Administration & Access"}
            </span>

            <div className="bg-zinc-950 border border-purple-900/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">
                    {isRtl ? "بوابة الإدارة والمدربين" : "Administrator Portal"}
                  </h5>
                  <p className="text-[10px] text-zinc-400">
                    {isRtl ? "منطقة مخصصة لإدارة المشتركين والفيديوهات" : "Authorized trainer management dashboard"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAdmin ? "Open Admin Dashboard" : "Admin Login"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
