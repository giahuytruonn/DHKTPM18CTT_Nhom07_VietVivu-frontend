import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LucideRotateCw, LucideVolume2, LucideVolumeX, LucideHeart, LucideShare2, 
  LucideMoreHorizontal, LucidePlay, LucideMusic, LucideMapPin, LucideArrowLeft, LucideShoppingBag 
} from "lucide-react";
import { getApprovedVideos, toggleVideoLike } from "../services/exploreVideoApi";
import type { IExploreVideo } from "../types/IExploreVideo";
import { optimizeCloudinaryUrl, getCloudinaryPosterUrl } from "../utils/cloudinaryOptimizer";
import { toast } from "sonner";

// --- COMPONENT: VIDEO POST ---
const VideoPost: React.FC<{ 
  video: IExploreVideo; 
  isActive: boolean; 
  isMuted: boolean; 
  onToggleMute: () => void; 
}> = ({ video, isActive, isMuted, onToggleMute }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const FEED_TRANSFORM = "f_auto,q_auto:good,h_1080,c_limit,dpr_auto";
  const optimizedVideoUrl = optimizeCloudinaryUrl(video.videoUrl, FEED_TRANSFORM);
  const posterUrl = getCloudinaryPosterUrl(video.videoUrl, FEED_TRANSFORM);

  // --- LOGIC MEDIA ---
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) { 
      vid.currentTime = 0; 
      vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); 
    } else { 
      vid.pause(); setIsPlaying(false); 
    }
  }, [isActive]);

  useEffect(() => { if (videoRef.current) videoRef.current.muted = isMuted; }, [isMuted]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (vid && vid.duration) {
      setProgress((vid.currentTime / vid.duration) * 100);
      setCurrentTime(formatTime(vid.currentTime));
      setDuration(formatTime(vid.duration));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (vid && vid.duration) {
      const newTime = (Number(e.target.value) / 100) * vid.duration;
      vid.currentTime = newTime;
      setProgress(Number(e.target.value));
      setCurrentTime(formatTime(newTime));
    }
  };

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setIsPlaying(true); } 
    else { vid.pause(); setIsPlaying(false); }
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  // --- ACTIONS ---
  const handleLike = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newState = !isLiked;
    setIsLiked(newState);
    setLikeCount(prev => newState ? prev + 1 : prev - 1);
    try { await toggleVideoLike(video.id, newState); } 
    catch { setIsLiked(!newState); setLikeCount(prev => !newState ? prev + 1 : prev - 1); }
  }, [isLiked, video.id]);

  const handleDoubleTap = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHeartOverlay(true); setTimeout(() => setShowHeartOverlay(false), 800);
    if (!isLiked) handleLike();
  }, [isLiked, handleLike]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href; 
    const shareData = {
      title: video.title,
      text: `Xem video "${video.title}" trên VietVivu!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log("Closed share"); }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Đã sao chép liên kết! 📋");
      } catch (err) { toast.error("Lỗi sao chép"); }
    }
  };

  const handleNavigateToTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.tourId) navigate(`/tours/${video.tourId}`);
    else toast.error("Video chưa gắn Tour");
  };

  return (
    <div className="w-full h-full snap-start relative bg-black flex items-center justify-center select-none overflow-hidden group">
      
      {/* 1. LAYER VIDEO */}
      <div className="relative w-full h-full cursor-pointer bg-gray-900" onClick={togglePlay} onDoubleClick={handleDoubleTap}>
        <video ref={videoRef} src={optimizedVideoUrl} poster={posterUrl} className="w-full h-full object-contain" loop playsInline muted={isMuted} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} />
        {showHeartOverlay && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-bounce-in"><LucideHeart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" /></div>}
        {!isPlaying && <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 z-10"><div className="bg-black/30 p-4 rounded-full backdrop-blur-md border border-white/10 shadow-xl"><LucidePlay className="w-8 h-8 text-white fill-white ml-1" /></div></div>}
      </div>

      {/* 2. OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-50% to-black/90 pointer-events-none" />

      {/* 3. RIGHT SIDEBAR */}
      <div className="absolute bottom-32 right-3 flex flex-col items-center gap-5 z-40">
<div className="relative group cursor-pointer transition-transform hover:scale-110">
  <div className="w-10 h-10 rounded-full border border-white p-[1px] overflow-hidden">
    <img
      src="https://res.cloudinary.com/dpyshymwv/image/upload/v1765191105/ac5a28bd-fae8-49ae-84bb-b9698acf1bf6.png"
      alt="Avatar"
      className="w-full h-full rounded-full object-cover shadow-md"
    />
  </div>
</div>        
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleLike}><LucideHeart className={`w-8 h-8 drop-shadow-lg transition-all duration-200 ${isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-white group-hover:scale-110'}`} /><span className="text-white text-[12px] font-semibold drop-shadow-md">{likeCount}</span></div>
        
        <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={handleShare}><LucideShare2 className="w-8 h-8 text-white drop-shadow-lg transition-transform group-hover:scale-110" /><span className="text-white text-[12px] font-semibold drop-shadow-md">Share</span></div>

          <button onClick={(e) => { e.stopPropagation(); onToggleMute(); }} className="w-9 h-9 rounded-full bg-gray-800/60 backdrop-blur-md flex items-center justify-center text-white mt-2 border border-white/20 hover:bg-gray-700 transition-colors shadow-lg">{isMuted ? <LucideVolumeX size={16} /> : <LucideVolume2 size={16} />}</button>
      </div>

      {/* 4. BOTTOM INFO */}
      <div className="absolute bottom-0 left-0 w-full px-4 pb-6 z-30 text-white flex flex-col justify-end">
        {video.tourId && <div className="mb-3 flex animate-in slide-in-from-left duration-500"><button onClick={handleNavigateToTour} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-yellow-400/20"><LucideShoppingBag size={14} className="text-black" /><span className="text-[11px] font-bold uppercase tracking-wide">Đặt vé ngay</span><LucideMapPin size={12} className="text-black/70" /></button></div>}
        
        <div className="mb-4 pr-14 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}><div className="transition-all duration-300 relative"><p className={`text-[13px] leading-snug drop-shadow-sm opacity-95 ${!isExpanded ? 'line-clamp-2' : ''}`}><span className="font-semibold mr-1">{video.title}</span><span className="font-light opacity-80">{video.description}</span></p>{(video.description && video.description.length > 50 && !isExpanded) && <span className="text-[12px] font-bold text-gray-300 ml-1">xem thêm</span>}</div><div className="flex items-center gap-2 mt-2 opacity-70"><LucideMusic size={12} /><div className="text-[11px] w-40 overflow-hidden"><p className="whitespace-nowrap">Nhạc nền gốc - VietVivu Official</p></div></div></div>
        
        {/* --- THANH THỜI GIAN (ĐÃ SỬA THẲNG HÀNG) --- */}
        <div className="flex items-center gap-3 w-full pr-1 select-none py-2" onClick={(e) => e.stopPropagation()}>
            {/* Thanh Progress Bar: Dùng flex-1 để chiếm hết khoảng trống còn lại */}
            <div className="relative flex-1 h-6 flex items-center group cursor-pointer">
                <div className="absolute w-full h-[3px] bg-white/20 rounded-full group-hover:h-[5px] transition-all" />
                <div className="absolute h-[3px] bg-white rounded-full group-hover:h-[5px] transition-all shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${progress}%` }} />
                <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleSeek} className="absolute w-full h-full opacity-0 cursor-pointer z-20" />
            </div>
            
            {/* Thời gian: Dùng whitespace-nowrap để không xuống dòng */}
            <span className="text-[10px] font-medium text-right opacity-80 font-mono tracking-wider whitespace-nowrap shrink-0">
              {currentTime} / {duration}
            </span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const VideoFeedPage: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getApprovedVideos().then(res => { setVideos(res); if (res.length > 0) setActiveVideoId(res[0].id); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveVideoId(entry.target.getAttribute("data-id")); });
    }, { threshold: 0.6 });
    container.querySelectorAll(".video-post-container").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0; } } .animate-bounce-in { animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }`;
    document.head.appendChild(style); return () => { document.head.removeChild(style); }
  }, []);

  if (loading) return <div className="w-full h-screen bg-[#121212] flex items-center justify-center text-white flex-col gap-4"><LucideRotateCw className="w-8 h-8 animate-spin text-gray-400" /><span className="text-sm text-gray-500 font-medium">Đang tải trải nghiệm...</span></div>;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#121212] flex items-center justify-center overflow-hidden font-sans z-0">
      <button onClick={() => navigate('/')} className="fixed top-6 left-6 z-50 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition-all hidden md:block" title="Quay lại"><LucideArrowLeft size={20} /></button>
      <div className="relative w-full h-full md:w-[420px] md:h-[95%] md:max-h-[850px] md:rounded-[20px] md:border-[2px] md:border-[#333] md:shadow-2xl bg-black overflow-hidden">
        <div ref={containerRef} className="w-full h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar scroll-smooth">
            {videos.map((v) => <div key={v.id} className="video-post-container w-full h-full snap-start border-b border-gray-900/50" data-id={v.id}><VideoPost video={v} isActive={activeVideoId === v.id} isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} /></div>)}
        </div>
      </div>
    </div>
  );
};
export default VideoFeedPage;