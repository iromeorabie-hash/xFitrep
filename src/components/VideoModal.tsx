import { X, Play, Info, Eye, Clock, Shield } from "lucide-react";
import { Video } from "../types";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
  lang: "en" | "ar";
}

export default function VideoModal({ video, onClose, lang }: VideoModalProps) {
  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Helper to extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const isYouTube = video.url.includes("youtube.com") || video.url.includes("youtu.be");
  const isVimeo = video.url.includes("vimeo.com");

  let embedUrl = "";
  if (isYouTube) {
    const ytId = getYouTubeId(video.url);
    if (ytId) {
      embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&modestbranding=1&rel=0`;
    }
  } else if (isVimeo) {
    const vimeoId = getVimeoId(video.url);
    if (vimeoId) {
      embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&byline=0&portrait=0`;
    }
  }

  const isRtl = lang === "ar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md">
      {/* Background overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        id="video-player-modal"
        className="bg-zinc-900 border border-zinc-800/80 rounded-2xl w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/60 border-b border-zinc-800/40">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {video.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {video.duration} {lang === "en" ? "minutes" : "دقيقة"}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                {video.views.toLocaleString()} {lang === "en" ? "views" : "مشاهدة"}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="relative bg-black aspect-video w-full flex-1">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // Custom Direct MP4 HTML5 Video Frame
            <video
              src={video.url}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full"
              poster={video.thumbnail}
            >
              {lang === "en" 
                ? "Your browser does not support the video tag." 
                : "متصفحك لا يدعم تشغيل هذا الفيديو."}
            </video>
          )}
        </div>

        {/* Details Footer */}
        <div className="p-6 bg-zinc-950/80 border-t border-zinc-800/40 overflow-y-auto max-h-[25vh]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3 h-3" />
                {lang === "en" ? "Trainer" : "المدرب"}: {video.trainer}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans pt-1">
                {video.description}
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3 md:w-64 shrink-0 text-xs text-zinc-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-200 block mb-1">
                  {lang === "en" ? "Fit Rep Tips" : "نصيحة فت ريب"}
                </span>
                {lang === "en" 
                  ? "Ensure clean form, keep hydrated, and pause if you experience sharp chest pain or joint pressure."
                  : "تأكد من دقة حركاتك، حافظ على رطوبة جسمك، وتوقف فوراً إذا شعرت بألم حاد في الصدر أو المفاصل."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
