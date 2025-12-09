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
  LucideFilm,
  LucideMapPin,
  LucideSearch,
  LucideHeart,
  LucideChevronLeft,  // <-- Icon mới cho phân trang
  LucideChevronRight  // <-- Icon mới cho phân trang
} from "lucide-react";
import {
  getApprovedVideos,
  uploadVideo,
  updateVideo,
  deleteVideo,
} from "../services/exploreVideoApi";
import { getAllTourNames, type ITourSelection } from "../services/tour.service";
import type { IExploreVideo, IExploreVideoRequest } from "../types/IExploreVideo";
import { uploadVideoToCloudinary } from "../utils/cloudinaryUploader";

// --- CRUD MODAL (GIỮ NGUYÊN KHÔNG ĐỔI) ---
interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoToEdit: IExploreVideo | null;
  onSave: (videoData: IExploreVideoRequest) => Promise<void>;
  isSaving: boolean;
  tours: ITourSelection[];
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
      setTourId(videoToEdit?.tourId || "");
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
      tourId: tourId || null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {isEditMode ? <LucidePenTool className="text-purple-600" /> : <LucidePlus className="text-purple-600" />}
              {isEditMode ? "Chỉnh Sửa Video" : "Đăng Video Mới"}
            </h2>
          </div>
          <button onClick={onClose} disabled={isSaving || isUploading} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
            <LucideX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề Video <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50/50 focus:bg-white"
              placeholder="Nhập tiêu đề hấp dẫn..."
              disabled={isSaving || isUploading} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-gray-50/50 focus:bg-white resize-none"
              rows={3} 
              placeholder="Video này nói về điều gì..."
              disabled={isSaving || isUploading} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <LucideMapPin size={16} className="text-pink-500"/> Liên kết Tour
            </label>
            <div className="relative">
                <select 
                    value={tourId} 
                    onChange={(e) => setTourId(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white appearance-none cursor-pointer"
                    disabled={isSaving || isUploading}
                >
                    <option value="">-- Không liên kết --</option>
                    {tours.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">Video sẽ hiển thị nút "Đặt vé" dẫn đến tour này.</p>
          </div>

          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 group ${file ? 'bg-green-50 border-green-400' : 'hover:bg-purple-50 hover:border-purple-300 border-gray-200'}`}>
             <label className="cursor-pointer block w-full h-full">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${file ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-purple-100'}`}>
                    <LucideUploadCloud className={`w-8 h-8 ${file ? 'text-green-600' : 'text-gray-400 group-hover:text-purple-600'}`} />
                </div>
                <span className="font-bold text-gray-700 block">{file ? file.name : "Tải Video lên"}</span>
                <span className="text-xs text-gray-400 mt-1 block">{file ? "Nhấn để thay đổi" : "MP4, MOV, AVI (Max 50MB)"}</span>
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" disabled={isSaving || isUploading} />
             </label>
          </div>

          {isUploading && (
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-purple-600"><span>Đang tải lên...</span><span>{Math.round(uploadProgress)}%</span></div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out" style={{width: `${uploadProgress}%`}}/></div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 font-semibold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">Hủy bỏ</button>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl flex items-center hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed" disabled={isSaving || isUploading}>
              {(isSaving || isUploading) && <LucideRotateCw className="animate-spin mr-2" size={18} />}
              {isEditMode ? "Lưu Thay Đổi" : "Đăng Video Ngay"}
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
  const [tours, setTours] = useState<ITourSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<IExploreVideo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng video trên mỗi trang

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [videosData, toursData] = await Promise.all([
        getApprovedVideos(),
        getAllTourNames(),
      ]);
      setVideos(videosData);
      setTours(toursData);
    } 
    catch (error) { toast.error("Lỗi tải dữ liệu"); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSave = async (data: IExploreVideoRequest) => {
    setIsSaving(true);
    try {
      if (videoToEdit) { await updateVideo(videoToEdit.id, data); toast.success("Cập nhật video thành công! 🎉"); }
      else { await uploadVideo(data); toast.success("Đăng video mới thành công! 🚀"); }
      setIsModalOpen(false); setVideoToEdit(null); fetchData();
    } catch { toast.error("Đã xảy ra lỗi khi lưu"); } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa video này?")) return;
    try { await deleteVideo(id); toast.success("Đã xóa video"); fetchData(); } 
    catch { toast.error("Lỗi xóa video"); }
  };

  const getTourName = (id?: string | null) => {
      if (!id) return null;
      const tour = tours.find(t => t.id === id);
      return tour ? tour.title : "Tour không tồn tại";
  };

  // --- LOGIC LỌC & PHÂN TRANG ---
  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
              Quản Lý Video Reels
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Chia sẻ những khoảnh khắc tuyệt vời đến khách hàng</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm video..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white/80 backdrop-blur-sm"
                />
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors w-5 h-5" />
            </div>

            <button onClick={() => { setVideoToEdit(null); setIsModalOpen(true); }} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap">
              <LucidePlus size={20} />
              <span>Đăng Video</span>
            </button>
          </div>
        </div>

        {/* Content Table Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                <thead className="bg-purple-50/50 text-xs font-bold text-purple-900 uppercase tracking-wider border-b border-purple-100">
                    <tr>
                        <th className="p-6">Video Preview</th>
                        <th className="p-6">Thông tin chi tiết</th>
                        <th className="p-6">Tour Liên Kết</th>
                        <th className="p-6 text-center">Tương tác</th>
                        <th className="p-6 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                    {loading ? (
                         <tr><td colSpan={5} className="p-12 text-center"><div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                    ) : filteredVideos.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <LucideFilm size={48} className="mb-4 opacity-50"/>
                                    <p className="text-lg font-medium">Chưa có video nào</p>
                                </div>
                            </td>
                        </tr>
                    ) : currentVideos.map(v => ( // <-- Map qua currentVideos thay vì filteredVideos
                    <tr key={v.id} className="hover:bg-white/60 transition-colors group">
                        <td className="p-6 w-40">
                            <div className="relative w-28 h-40 bg-gray-900 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105">
                                <video src={v.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                        <LucidePlayCircle className="text-white fill-white" size={20} />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 align-top max-w-xs">
                            <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors">{v.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{v.description || "Chưa có mô tả"}</p>
                            <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-500 border border-gray-200">
                                {new Date(v.uploadedAt).toLocaleDateString('vi-VN')}
                            </div>
                        </td>
                        <td className="p-6 align-top">
                            {v.tourId ? (
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                                    <LucideMapPin size={16} className="mt-0.5 shrink-0" />
                                    <span className="text-sm font-semibold line-clamp-2">{getTourName(v.tourId)}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400 italic flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                    Chưa liên kết
                                </span>
                            )}
                        </td>
                        <td className="p-6 align-middle text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-600 font-bold border border-pink-100">
                                <LucideHeart size={18} className="fill-pink-600" />
                                <span>{v.likeCount || 0}</span>
                            </div>
                        </td>
                        <td className="p-6 align-middle text-center">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setVideoToEdit(v); setIsModalOpen(true); }} className="p-3 bg-white border border-gray-200 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-1 shadow-sm transition-all" title="Chỉnh sửa">
                                    <LucidePenTool size={18}/>
                                </button>
                                <button onClick={() => handleDelete(v.id)} className="p-3 bg-white border border-gray-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 hover:-translate-y-1 shadow-sm transition-all" title="Xóa video">
                                    <LucideTrash2 size={18}/>
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {filteredVideos.length > 0 && (
                <div className="p-6 border-t border-purple-100 bg-white/40 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                        Hiển thị <span className="text-purple-700 font-bold">{indexOfFirstItem + 1}</span> - <span className="text-purple-700 font-bold">{Math.min(indexOfLastItem, filteredVideos.length)}</span> trong tổng số <span className="text-purple-700 font-bold">{filteredVideos.length}</span> video
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <LucideChevronLeft size={18} />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                                // Logic hiển thị rút gọn (nếu quá nhiều trang) có thể thêm ở đây, hiện tại hiển thị hết
                                if (totalPages > 7 && Math.abs(currentPage - number) > 2 && number !== 1 && number !== totalPages) {
                                     if (Math.abs(currentPage - number) === 3) return <span key={number} className="text-gray-400 px-1">...</span>;
                                     return null;
                                }

                                return (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                            currentPage === number
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {number}
                                    </button>
                                );
                            })}
                        </div>

                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <LucideChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
            {/* --------------------------- */}
        </div>

        <CrudModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            videoToEdit={videoToEdit} 
            onSave={handleSave} 
            isSaving={isSaving} 
            tours={tours} 
        />
      </div>
    </div>
  );
};
export default AdminVideoManagement;