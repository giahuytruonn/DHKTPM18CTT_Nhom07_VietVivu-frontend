import React, { useState, useEffect, useRef } from "react";
import { LucideRotateCw, LucideUser, LucideVolume2, LucideVolumeX } from "lucide-react";
import { getApprovedVideos } from "../services/exploreVideoApi";
import type { IExploreVideo } from "../types/IExploreVideo";
import { optimizeCloudinaryUrl, getCloudinaryPosterUrl } from "../utiils/cloudinaryOptimizer";



const VideoPost: React.FC<{
  video: IExploreVideo;
  isMuted: boolean;
  onToggleMute: () => void;
}> = ({ video, isMuted, onToggleMute }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const FEED_TRANSFORM = "f_auto,q_auto:good,h_800,c_limit,dpr_auto";
  const optimizedVideoUrl = optimizeCloudinaryUrl(video.videoUrl, FEED_TRANSFORM);
  const posterUrl = getCloudinaryPosterUrl(video.videoUrl, FEED_TRANSFORM);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = isMuted;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!vid.src) {
              vid.src = vid.dataset.src || "";
              vid.load();
              vid.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
              });
            } else {
              vid.play().catch((err) => {
                console.warn("Autoplay blocked:", err);
              });
            }
          } else {
            vid.pause();
            vid.currentTime = 0;
          }
        });
      },
      { threshold: 0.65 }
    );

    observer.observe(vid);

    return () => {
      observer.unobserve(vid);
      observer.disconnect();
    };
  }, [isMuted]);

  return (
    <div className="flex w-full snap-start h-screen relative p-5">
      <div className="flex-grow relative flex items-center justify-center">
        {video.videoUrl ? (
          <video
            ref={videoRef}
            key={video.id}
            data-src={optimizedVideoUrl}
            controls={false}
            loop
            playsInline
            preload="none"
            className="w-full h-full object-contain"
            poster={posterUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-white text-center p-4">
            Invalid or empty video URL.
          </div>
        )}

        <button
          className="absolute z-10 top-6 right-6 bg-black/40 backdrop-blur-md p-3 rounded-full text-white transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
        >
          {isMuted ? (
            <LucideVolumeX className="w-6 h-6" />
          ) : (
            <LucideVolume2 className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-32 bg-gradient-to-t from-black via-black/80 to-transparent text-white pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg ring-2 ring-white/20">
              <LucideUser className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">{video.uploaderUsername}</span>
          </div>
          
          <div>
            <p className={`text-base font-semibold ${!isExpanded ? 'line-clamp-1' : 'whitespace-pre-wrap'}`}>
              {video.title}
            </p>
            
            {video.description && (
              <p className={`text-sm opacity-80 mt-1 ${!isExpanded ? 'line-clamp-2' : 'whitespace-pre-wrap'}`}>
                {video.description}
              </p>
            )}
            
            {(video.title.length > 50 || (video.description && video.description.length > 80)) && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-gray-300 hover:text-white transition-colors mt-2 font-medium"
              >
                {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoFeedPage: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getApprovedVideos();
        setVideos(res);
      } catch (e) {
        console.error(e);
        setError("Unable to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-white" style={{ background: 'white' }}>
      <LucideRotateCw className="w-8 h-8 animate-spin mr-2" />
      Loading videos...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-400" style={{ background: 'white' }}>
      {error}
    </div>
  );

  if (videos.length === 0) return (
    <div className="flex items-center justify-center h-screen text-gray-300" style={{ background: 'white' }}>
      No approved videos to display yet.
    </div>
  );

  return (
    <div className="h-screen w-full flex items-center justify-center font-['Inter']" style={{ background: 'white' }}>
      <div
        ref={containerRef}
        className="w-full max-w-md h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar bg-black shadow-2xl"
      >
        {videos.map((v) => (
          <VideoPost
            key={v.id}
            video={v}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeedPage;