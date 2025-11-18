import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  LucidePlus,
  LucidePenTool,
  LucideTrash2,
  LucideRotateCw,
  LucideCheck,
  LucideUploadCloud,
  LucideX,
} from "lucide-react";
import type {
  IExploreVideo,
  IExploreVideoRequest,
} from "../types/IExploreVideo";
import {
  getApprovedVideos,
  getPendingVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
  approveVideo,
} from "../services/exploreVideoApi";
import { uploadVideoToCloudinary } from "../utils/cloudinaryUploader";
import {
  optimizeCloudinaryUrl,
  getCloudinaryPosterUrl,
} from "../utils/cloudinaryOptimizer";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isEditMode = !!videoToEdit;

  useEffect(() => {
    if (isOpen) {
      setTitle(videoToEdit?.title || "");
      setDescription(videoToEdit?.description || "");
      setFile(null);
      setUploadProgress(0);
    }
  }, [isOpen, videoToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    let videoUrl = videoToEdit?.videoUrl || "";

    if (file) {
      setIsUploading(true);
      try {
        // TRUYỀN HÀM CẬP NHẬT TIẾN TRÌNH VÀO
        videoUrl = await uploadVideoToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });
        toast.success("Tải video lên thành công!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Tải video lên thất bại. Vui lòng thử lại.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else if (!isEditMode) {
      toast.error("Vui lòng chọn file video");
      return;
    }

    const data: IExploreVideoRequest = {
      title: title.trim(),
      description: description.trim() || null,
      videoUrl,
      tourId: null,
    };

    await onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa Video" : "Tải lên Video"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSaving || isUploading}
          >
            <LucideX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tiêu đề video..."
              required
              disabled={isSaving || isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Nhập mô tả video..."
              disabled={isSaving || isUploading}
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
            <label className="flex items-center justify-center text-sm font-semibold text-gray-700 mb-3 cursor-pointer">
              <LucideUploadCloud className="w-6 h-6 mr-2 text-blue-600" />
              {isEditMode
                ? "Chọn video mới (nếu muốn thay đổi)"
                : "Chọn File Video"}
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
              disabled={isSaving || isUploading}
            />
            {file && (
              <p className="mt-3 text-sm text-gray-600 flex items-center">
                <LucideCheck className="w-4 h-4 mr-1 text-green-600" />
                {file.name}
              </p>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Đang tải lên...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSaving || isUploading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-white font-semibold rounded-lg flex items-center transition-all ${
                isSaving || isUploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
              disabled={isSaving || isUploading}
            >
              {(isSaving || isUploading) && (
                <LucideRotateCw className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isUploading ? "Đang tải..." : isEditMode ? "Lưu" : "Tải lên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VideoCard: React.FC<{
  video: IExploreVideo;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (video: IExploreVideo) => void;
}> = ({ video, onApprove, onDelete, onEdit }) => {
  const optimizedVideoUrl = optimizeCloudinaryUrl(
    video.videoUrl,
    "f_auto,q_auto:good,w_400,c_scale"
  );
  const posterUrl = getCloudinaryPosterUrl(
    video.videoUrl,
    "f_auto,q_auto:good,w_400,c_scale"
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        <video
          key={video.id}
          src={optimizedVideoUrl}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          poster={posterUrl}
        />
        {!video.approved && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            Chờ Duyệt
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow mb-3">
          {video.description || "Không có mô tả"}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{video.uploaderUsername}</span>
          <span>{new Date(video.uploadedAt).toLocaleDateString("vi-VN")}</span>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
        {!video.approved && (
          <button
            onClick={() => onApprove(video.id)}
            className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition-all shadow-sm"
            title="Duyệt video"
          >
            <LucideCheck className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onEdit(video)}
          className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
          title="Chỉnh sửa"
        >
          <LucidePenTool className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(video.id)}
          className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-sm"
          title="Xóa"
        >
          <LucideTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ExplorePage: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">(
    "approved"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<IExploreVideo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        activeTab === "approved"
          ? await getApprovedVideos()
          : await getPendingVideos();
      setVideos(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Không thể tải video. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleOpenModal = (video: IExploreVideo | null = null) => {
    setVideoToEdit(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVideoToEdit(null);
  };

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
      handleCloseModal();
      await fetchVideos();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) return;

    try {
      await deleteVideo(id);
      toast.success("Xóa video thành công!");
      await fetchVideos();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Xóa video thất bại.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveVideo(id);
      toast.success("Duyệt video thành công!");
      await fetchVideos();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Duyệt video thất bại.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
          🎥 Quản lý Video
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <LucidePlus className="w-5 h-5 mr-2" />
          Tải lên Video
        </button>
      </header>

      <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-6 py-2.5 font-semibold rounded-md transition-all ${
            activeTab === "approved"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Đã Duyệt
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-2.5 font-semibold rounded-md transition-all ${
            activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Chờ Duyệt
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-md">
          <LucideRotateCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <span className="text-lg text-gray-700 font-medium">Đang tải...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-md">
          <p className="text-lg text-gray-500 font-medium">
            Không có video nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
