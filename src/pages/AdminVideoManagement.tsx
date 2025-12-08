import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  LucidePlus,
  LucideTrash2,
  LucidePenTool,
  LucidePlayCircle,
  LucideX,
  LucideUploadCloud,
  LucideRotateCw,
} from "lucide-react";
import {
  getApprovedVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
} from "../services/exploreVideoApi";
import { getAllTourNames, type ITourSelection } from "../services/tour.service"; // <-- IMPORT MỚI
import type { IExploreVideo, IExploreVideoRequest } from "../types/IExploreVideo";
import { uploadVideoToCloudinary } from "../utils/cloudinaryUploader";

// --- INTERNAL MODAL COMPONENT ---
interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoToEdit: IExploreVideo | null;
  onSave: (videoData: IExploreVideoRequest) => Promise<void>;
  isSaving: boolean;
  tours: ITourSelection[]; // <-- NHẬN DANH SÁCH TOUR TỪ CHA
}

const CrudModal: React.FC<CrudModalProps> = ({ isOpen, onClose, videoToEdit, onSave, isSaving, tours }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tourId, setTourId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isEditMode = !!videoToEdit;

  useEffect(() => {
    if (isOpen) {
      setTitle(videoToEdit?.title || "");
      setDescription(videoToEdit?.description || "");
      setTourId(videoToEdit?.tourId || ""); // Backend trả về tourId, Select sẽ tự mapping
      setFile(null);
      setUploadProgress(0);
    }
  }, [isOpen, videoToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }

    let videoUrl = videoToEdit?.videoUrl || "";
    if (file) {
      setIsUploading(true);
      try {
        videoUrl = await uploadVideoToCloudinary(file, (progress) => setUploadProgress(progress));
      } catch (error) {
        toast.error("Lỗi upload video"); setIsUploading(false); return;
      } finally { setIsUploading(false); }
    } else if (!isEditMode) {
      toast.error("Vui lòng chọn file video"); return;
    }

    await onSave({
      title: title.trim(),
      description: description.trim() || null,
      videoUrl,
      tourId: tourId || null, // Nếu rỗng thì gửi null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">{isEditMode ? "Sửa Video" : "Đăng Video"}</h2>
          <button onClick={onClose} disabled={isSaving || isUploading} className="p-2 hover:bg-gray-100 rounded-full"><LucideX /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" disabled={isSaving || isUploading} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" rows={3} disabled={isSaving || isUploading} />
          </div>

          {/* --- THAY ĐỔI Ở ĐÂY: INPUT -> SELECT --- */}
          <div>
            <label className="block text-sm font-semibold mb-2">Liên kết Tour (Tùy chọn)</label>
            <div className="relative">
                <select 
                    value={tourId} 
                    onChange={(e) => setTourId(e.target.value)} 
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    disabled={isSaving || isUploading}
                >
                    <option value="">-- Không liên kết --</option>
                    {tours.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.title}
                        </option>
                    ))}
                </select>
                {/* Custom Arrow Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Chọn Tour để hiển thị nút "Đặt vé" trên video.</p>
          </div>
          {/* --------------------------------------- */}

          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${file ? 'bg-green-50 border-green-400' : 'hover:bg-gray-50 border-gray-300'}`}>
             <label className="cursor-pointer block w-full h-full">
                <LucideUploadCloud className={`mx-auto mb-2 w-8 h-8 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-700">{file ? file.name : "Chọn Video tải lên"}</span>
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" disabled={isSaving || isUploading} />
             </label>
          </div>

          {isUploading && (
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500"><span>Uploading...</span><span>{Math.round(uploadProgress)}%</span></div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-300" style={{width: `${uploadProgress}%`}}/></div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 font-medium text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" disabled={isSaving || isUploading}>
              {(isSaving || isUploading) && <LucideRotateCw className="animate-spin mr-2" size={18} />}
              {isEditMode ? "Cập nhật" : "Đăng ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const AdminVideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<IExploreVideo[]>([]);
  const [tours, setTours] = useState<ITourSelection[]>([]); // <-- STATE LƯU DS TOUR
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<IExploreVideo | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Videos & Tours
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [videosData, toursData] = await Promise.all([
        getApprovedVideos(),
        getAllTourNames(), // Gọi API lấy tên tour
      ]);
      setVideos(videosData);
      setTours(toursData);
    } 
    catch (error) { 
        console.error(error);
        toast.error("Lỗi tải dữ liệu"); 
    } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: IExploreVideoRequest) => {
    setIsSaving(true);
    try {
      if (videoToEdit) { await updateVideo(videoToEdit.id, data); toast.success("Đã cập nhật"); }
      else { await uploadVideo(data); toast.success("Đã đăng"); }
      setIsModalOpen(false); setVideoToEdit(null); fetchData(); // Reload list
    } catch { toast.error("Lỗi lưu video"); } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa video này?")) return;
    try { await deleteVideo(id); toast.success("Đã xóa"); fetchData(); } 
    catch { toast.error("Lỗi xóa"); }
  };

  // Helper để lấy tên tour từ ID (cho hiển thị bảng)
  const getTourName = (id?: string | null) => {
      if (!id) return "-";
      const tour = tours.find(t => t.id === id);
      return tour ? tour.title : id;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Video Reels</h1>
            <p className="text-gray-500 text-sm mt-1">Danh sách video hiển thị trên ứng dụng</p>
        </div>
        <button onClick={() => { setVideoToEdit(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <LucidePlus size={20} /> Đăng Video Mới
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-600">
            <tr>
                <th className="p-4 border-b">Video Preview</th>
                <th className="p-4 border-b">Thông tin</th>
                <th className="p-4 border-b">Tour Liên Kết</th>
                <th className="p-4 border-b text-center">Tương tác</th>
                <th className="p-4 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Đang tải...</td></tr> : 
             videos.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chưa có video nào.</td></tr> :
             videos.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 w-32">
                    <div className="relative w-24 h-36 bg-black rounded-lg overflow-hidden shadow-sm group">
                        <video src={v.videoUrl} className="w-full h-full object-cover opacity-90" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors"><LucidePlayCircle className="text-white opacity-80" /></div>
                    </div>
                </td>
                <td className="p-4 align-top">
                    <p className="font-bold text-gray-800 line-clamp-1 text-base">{v.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{v.description || "Không có mô tả"}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{new Date(v.uploadedAt).toLocaleDateString('vi-VN')}</span>
                </td>
                <td className="p-4 align-top">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${v.tourId ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {getTourName(v.tourId)}
                    </span>
                </td>
                <td className="p-4 text-center font-medium text-gray-600">
                    ❤️ {v.likeCount || 0}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setVideoToEdit(v); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa"><LucidePenTool size={18}/></button>
                    <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"><LucideTrash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <CrudModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        videoToEdit={videoToEdit} 
        onSave={handleSave} 
        isSaving={isSaving} 
        tours={tours} // <-- Truyền tours vào Modal
      />
    </div>
  );
};
export default AdminVideoManagement;