import { useState, useEffect, useRef } from "react";
import { Play, Dumbbell } from "lucide-react";

// Global in-memory cache to persist generated base64 thumbnails across component remounts
const THUMBNAIL_CACHE = new Map<string, string>();

interface Mp4ThumbnailProps {
  videoUrl: string;
  className?: string;
}

export default function Mp4Thumbnail({ videoUrl, className = "" }: Mp4ThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(() => THUMBNAIL_CACHE.get(videoUrl) || null);
  const [loading, setLoading] = useState<boolean>(!THUMBNAIL_CACHE.has(videoUrl));
  const [isInView, setIsInView] = useState<boolean>(THUMBNAIL_CACHE.has(videoUrl));
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Lazy load trigger via IntersectionObserver
  useEffect(() => {
    if (THUMBNAIL_CACHE.has(videoUrl)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" } // Preload when 250px near viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [videoUrl]);

  // 2. Video frame extraction logic
  useEffect(() => {
    if (!videoUrl || !isInView || THUMBNAIL_CACHE.has(videoUrl)) return;

    // Verify file type
    const isMp4 = videoUrl.toLowerCase().includes(".mp4") || videoUrl.toLowerCase().includes("mixkit.co");
    if (!isMp4) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const video = document.createElement("video");
    
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const handleLoadedMetadata = () => {
      if (!isMounted) return;
      try {
        if (video.duration && video.duration > 0) {
          video.currentTime = Math.min(1.5, video.duration / 2);
        } else {
          video.currentTime = 0.5;
        }
      } catch (err) {
        console.warn("Failed to set video currentTime:", err);
        setLoading(false);
      }
    };

    const handleSeeked = () => {
      if (!isMounted) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 225;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
          THUMBNAIL_CACHE.set(videoUrl, dataUrl);
          setThumbnail(dataUrl);
        }
      } catch (err) {
        console.warn("CORS limitation or failed canvas frame read:", err);
      } finally {
        setLoading(false);
        video.removeEventListener("seeked", handleSeeked);
      }
    };

    const handleError = () => {
      if (!isMounted) return;
      setLoading(false);
      video.removeEventListener("error", handleError);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", handleError);

    video.src = videoUrl;
    video.load();

    return () => {
      isMounted = false;
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", handleError);
      video.removeAttribute("src");
      video.load();
    };
  }, [videoUrl, isInView]);

  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt="Workout Thumbnail"
        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${className}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }

  // Fallback placeholder during loading or CORS restrictions
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center relative group overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay group-hover:bg-emerald-500/20 transition-all duration-300" />
      <div className="w-12 h-12 rounded-full bg-zinc-950/80 border border-zinc-800 flex items-center justify-center text-emerald-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-300 shadow-xl relative z-10">
        <Play className="w-5 h-5 fill-current translate-x-0.5" />
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] bg-zinc-950/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
        <Dumbbell className="w-3 h-3 text-emerald-500 animate-pulse" />
        <span>FIT REP VIDEO</span>
      </div>
    </div>
  );
}
