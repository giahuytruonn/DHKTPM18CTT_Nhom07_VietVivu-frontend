import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LucidePlus,
  LucidePenTool,
  LucideTrash2,
  LucideRotateCw,
  LucideCheck,
  LucideUploadCloud,
} from "lucide-react";
import type { IExploreVideo, IExploreVideoRequest } from "../types/IExploreVideo";
import {
  getApprovedVideos,
  getPendingVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
  approveVideo,
} from "../services/exploreVideoApi";
import { uploadVideoToCloudinary } from "../utiils/cloudinaryUploader";
import { optimizeCloudinaryUrl, getCloudinaryPosterUrl } from "../utiils/cloudinaryOptimizer";

// --- COMPONENT MODAL ---
interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoToEdit: IExploreVideo | null;
  onSave: (videoData: IExploreVideoRequest) => Promise<void>;
  isSaving: boolean;
}

const CrudModal: React.FC<CrudModalProps> = ({
  isOpen,
  onClose,
  videoToEdit,
  onSave,
  isSaving,
}) => {
  const [title, setTitle] = useState(videoToEdit?.title || "");
  const [description, setDescription] = useState(videoToEdit?.description || "");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = !!videoToEdit;

  useEffect(() => {
    if (isOpen) {
      setTitle(videoToEdit?.title || "");
      setDescription(videoToEdit?.description || "");
      setFile(null);
    }
  }, [isOpen, videoToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Vui lòng nhập Tiêu đề.");
      return;
    }

    let videoUrl = videoToEdit?.videoUrl || "";
    if (!isEditMode || file) {
      if (!file && !isEditMode) {
        toast.error("Vui lòng chọn file video để tải lên.");
        return;
      }
      if (file) {
        setIsUploading(true);
        try {
          videoUrl = await uploadVideoToCloudinary(file);
          toast.success("Tải video lên Cloudinary thành công!");
        } catch {
          toast.error("Tải video lên Cloudinary thất bại.");
          return;
        } finally {
          setIsUploading(false);
        }
      }
    }

    const data: IExploreVideoRequest = {
      title,
      description,
      videoUrl,
    };
    await onSave(data);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isEditMode ? "Chỉnh sửa Video" : "Tải lên Video Khám phá"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả (Tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6 border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <LucideUploadCloud className="w-5 h-5 mr-2 text-blue-600" />
              {isEditMode ? "Chọn file video mới (nếu muốn thay đổi)" : "Chọn File Video"}
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
              disabled={isSaving || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white font-semibold rounded-lg flex items-center ${
                isSaving || isUploading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isSaving || isUploading}
            >
              {(isSaving || isUploading) && (
                <LucideRotateCw className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isUploading ? "Đang tải..." : isEditMode ? "Lưu thay đổi" : "Tải lên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENT VIDEO CARD ---
const VideoCard: React.FC<{
  video: IExploreVideo;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (video: IExploreVideo) => void;
}> = ({ video, onApprove, onDelete, onEdit }) => {
  const optimizedVideoUrl = optimizeCloudinaryUrl(video.videoUrl, "f_auto,q_auto:good,w_600,c_scale");
  const posterUrl = getCloudinaryPosterUrl(video.videoUrl, "f_auto,q_auto:good,w_600,c_scale");

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="aspect-video bg-gray-900 relative">
        <video
          key={video.id}
          src={optimizedVideoUrl}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          poster={posterUrl}
        />
        {!video.approved && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Chờ Duyệt
          </span>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{video.description || "Không có mô tả."}</p>
        <p className="text-xs text-gray-500 mt-2">Ngày tải: {new Date(video.uploadedAt).toLocaleDateString()}</p>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end space-x-2">
        {!video.approved && (
          <button
            onClick={() => onApprove(video.id)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            <LucideCheck className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onEdit(video)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <LucidePenTool className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(video.id)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <LucideTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const ExplorePage: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<IExploreVideo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data =
        activeTab === "approved" ? await getApprovedVideos() : await getPendingVideos();
      setVideos(data);
    } catch (error) {
      toast.error("Lỗi khi tải video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const handleOpenModal = (video: IExploreVideo | null = null) => {
    setVideoToEdit(video);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = async (data: IExploreVideoRequest) => {
    setIsSaving(true);
    try {
      if (videoToEdit) {
        await updateVideo(videoToEdit.id, data);
        toast.success("Cập nhật video thành công!");
      } else {
        await uploadVideo(data);
        toast.success("Tải video thành công!");
      }
      fetchVideos();
    } catch {
      toast.error("Thao tác thất bại.");
    } finally {
      setIsSaving(false);
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa video này không?")) {
      try {
        await deleteVideo(id);
        toast.success("Xóa video thành công!");
        fetchVideos();
      } catch {
        toast.error("Xóa video thất bại.");
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveVideo(id);
      toast.success("Duyệt video thành công!");
      fetchVideos();
    } catch {
      toast.error("Duyệt video thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">🎥 Quản lý Video Khám phá</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700"
        >
          <LucidePlus className="w-5 h-5 mr-2" />
          Tải lên Video
        </button>
      </header>

      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "approved" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
        >
          Video Đã Duyệt
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "pending" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
        >
          Video Chờ Duyệt
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
          <LucideRotateCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-lg text-gray-700">Đang tải dữ liệu...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
          <p className="text-lg text-gray-500">Không có video nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              onApprove={handleApprove}
              onDelete={handleDelete}
              onEdit={handleOpenModal}
            />
          ))}
        </div>
      )}

      <CrudModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoToEdit={videoToEdit}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ExplorePage;
  