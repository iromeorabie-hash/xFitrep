import { Dumbbell, Play, ArrowRight, Activity, Users, ShieldAlert, Sparkles, Instagram, MessageCircle } from "lucide-react";
import { TranslationSet } from "../data/translations";

interface LandingViewProps {
  t: TranslationSet;
  lang: "en" | "ar";
  onNavigate: (view: "browse" | "login" | "register" | "admin-login") => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  stats: {
    activeMembers: number;
    totalViews: number;
    premiumVideos: number;
  };
}

export default function LandingView({ t, lang, onNavigate, isLoggedIn, isAdmin, stats }: LandingViewProps) {
  const isRtl = lang === "ar";

  return (
    <div className="space-y-16 animate-in fade-in duration-300" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/80 px-6 py-10 md:py-12 text-center shadow-2xl">
        {/* Decorative subtle ambient blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            {t.brandSub}
          </div>
          
          {/* Hero Video Container */}
          <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 aspect-video relative">
            <video
              src="https://www.image2url.com/r2/default/videos/1785245618761-e563642c-5ed7-4b69-ae31-79ee8674ef7a.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <button
                id="hero-browse-cta"
                onClick={() => onNavigate("browse")}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>{t.ctaBrowse}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            ) : isAdmin ? (
              <button
                id="hero-admin-cta"
                onClick={() => onNavigate("browse")}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/15 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>{t.navAdmin}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <>
                <button
                  id="hero-register-cta"
                  onClick={() => onNavigate("register")}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span>{t.ctaRegister}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                </button>
                <button
                  id="hero-login-cta"
                  onClick={() => onNavigate("login")}
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 transition-all duration-200 cursor-pointer"
                >
                  <span>{t.ctaLogin}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTERS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {stats.activeMembers}+
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
              {t.statsActiveMembers}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {stats.totalViews.toLocaleString()}+
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
              {t.statsTotalViews}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tight">
              {stats.premiumVideos}
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
              {t.statsPremiumVideos}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/60 rounded-3xl p-8 md:p-12 space-y-8 shadow-xl">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {t.aboutTitle}
          </h2>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed font-sans">
            <p>{t.aboutText1}</p>
            <p>{t.aboutText2}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.aboutFeature1Title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{t.aboutFeature1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-zinc-800/60 pt-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.aboutFeature2Title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{t.aboutFeature2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-zinc-800/60 pt-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.aboutFeature3Title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{t.aboutFeature3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOCIAL MEDIA & CONTACT LINKS */}
      <section className="border-t border-zinc-900 pt-10 text-center space-y-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono">
          {lang === "en" ? "Connect With Us" : "تواصل معنا"}
        </h3>
        <div className="flex justify-center items-center gap-4">
          <a
            href="https://www.instagram.com/fitrep_?igsh=MTI5NmZhbzJmb3N2dw=="
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-pink-500 flex items-center justify-center transition-all duration-200"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/201044186025"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="w-12 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-emerald-500 flex items-center justify-center transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>
        </div>
        <p className="text-xs text-zinc-500 font-sans max-w-md mx-auto">
          {t.footerContactUs}
        </p>
      </section>
    </div>
  );
}
