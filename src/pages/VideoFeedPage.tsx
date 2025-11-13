import React, { useState, useEffect, useRef } from "react";
// Thêm icon Volume
import { LucideRotateCw, LucideUser, LucideVolume2, LucideVolumeX } from "lucide-react";
import { getApprovedVideos } from "../services/exploreVideoApi";
import type { IExploreVideo } from "../types/IExploreVideo";
// NHẬP KHẨU CÁC HÀM TỐI ƯU HÓA MỚI
import { optimizeCloudinaryUrl, getCloudinaryPosterUrl } from "../utiils/cloudinaryOptimizer";

// ========== COMPONENT ICON ==========
const InteractionIcon: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <div className="flex flex-col items-center">
    <button className="text-3xl p-2 bg-transparent transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full">
      {icon}
    </button>
    <span className="text-xs font-semibold">{label}</span>
  </div>
);

// ========== COMPONENT VIDEO ==========
// Thêm props isMuted và onToggleMute
const VideoPost: React.FC<{
  video: IExploreVideo;
  isMuted: boolean;
  onToggleMute: () => void;
}> = ({ video, isMuted, onToggleMute }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- TỐI ƯU HÓA ---
  // Biến đổi cho feed: tự động định dạng/chất lượng, giới hạn chiều cao 800px, tự động dpr
  const FEED_TRANSFORM = "f_auto,q_auto:good,h_800,c_limit,dpr_auto";
  const optimizedVideoUrl = optimizeCloudinaryUrl(video.videoUrl, FEED_TRANSFORM);
  // Tạo poster với cùng biến đổi
  const posterUrl = getCloudinaryPosterUrl(video.videoUrl, FEED_TRANSFORM);
  // --- KẾT THÚC TỐI ƯU HÓA ---

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Cập nhật trạng thái mute của video bất cứ khi nào prop isMuted thay đổi
    vid.muted = isMuted;

    // Dùng IntersectionObserver để play/pause và lazy load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Khi video sắp hiển thị, gán src (lazy load)
            if (!vid.src) {
              // Lấy src từ data-src đã được tối ưu
              vid.src = vid.dataset.src || "";

              // SỬA LỖI: Chỉ play() SAU KHI video đã sẵn sàng (sự kiện 'canplay')
              const onCanPlay = () => {
                vid.play().catch(() => {
                  // Cảnh báo này vẫn có thể xuất hiện nếu người dùng chưa tương tác,
                  // nhưng chúng ta đã giảm thiểu các lỗi do tải chậm.
                  console.warn("Autoplay bị chặn — chờ người dùng tương tác.");
                });
                // Xóa listener sau khi chạy
                vid.removeEventListener('canplay', onCanPlay);
              };
              vid.addEventListener('canplay', onCanPlay);

            } else {
              // Nếu video đã có src (ví dụ: quay lại video đã xem), play trực tiếp
              vid.play().catch(() => {
                console.warn("Autoplay bị chặn — chờ người dùng tương tác.");
              });
            }
          } else {
            // Khi video rời viewport, dừng và reset lại
            vid.pause();
            vid.currentTime = 0;
          }
        });
      },
      { threshold: 0.65 } // 65% video trong viewport mới play
    );

    observer.observe(vid);
    return () => {
      observer.unobserve(vid);
      observer.disconnect();
    };
  }, [isMuted]); // Thêm isMuted vào dependency array

  return (
    // 1. Xóa onClick={onToggleMute} và cursor-pointer khỏi div cha
    <div
      className="flex w-full snap-start h-screen bg-black relative"
    >
      {/* VIDEO ZONE */}
      <div className="flex-grow relative bg-black flex items-center justify-center">
        {video.videoUrl ? (
          <video
            ref={videoRef}
            key={video.id}
            data-src={optimizedVideoUrl} // Sử dụng URL tối ưu cho lazy load
            controls={true} // 2. BẬT controls để cho phép tua và tạm dừng
            loop
            // Bỏ 'muted' ở đây vì nó được kiểm soát bằng state
            playsInline
            preload="none" // Giữ preload="none" để feed lướt mượt
            className="w-full h-full object-contain"
            poster={posterUrl} // Sử dụng ảnh poster được tạo
          >
            Trình duyệt của bạn không hỗt trợ thẻ video.
          </video>
        ) : (
          <div className="text-white text-center p-4">
            Video URL không hợp lệ hoặc trống.
          </div>
        )}

        {/* 3. Biến icon mute thành một nút bấm riêng biệt */}
        {/* Đặt ở góc trên bên phải, z-10 để nổi lên trên video controls */}
        <button
          className="absolute z-10 top-4 right-4 bg-black/50 p-2 rounded-full text-white transition-opacity opacity-70 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click lan ra video (nếu có)
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

      {/* OVERLAY INFO */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-16 bg-gradient-to-t from-black/70 to-transparent text-white w-full max-w-md mx-auto">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2 text-white shadow-lg">
            <LucideUser className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">{video.uploaderUsername}</span>
        </div>
        <p className="text-base font-semibold line-clamp-1 mb-1">
          {video.title}
        </p>
        {video.description && (
          <p className="text-sm opacity-90 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ========== MAIN FEED ==========
const VideoFeedPage: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // THÊM: Trạng thái Mute/Unmute cho toàn bộ feed
  const [isMuted, setIsMuted] = useState(true);

  // Ẩn scrollbar
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Fetch videos
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getApprovedVideos();
        setVideos(res);
      } catch (e) {
        console.error(e);
        setError("Không thể tải video. Thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Hiển thị trạng thái tải
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <LucideRotateCw className="w-8 h-8 animate-spin mr-2" />
        Đang tải video...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-400">
        {error}
      </div>
    );

  if (videos.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-400">
        Chưa có video nào được duyệt để hiển thị.
      </div>
    );

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black font-['Inter']">
      <div
        ref={containerRef}
        className="w-full max-w-md h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
      >
        {/* Truyền trạng thái isMuted và hàm toggle xuống VideoPost */}
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