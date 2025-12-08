import api from './api';
import type { IExploreVideo, IExploreVideoRequest } from '../types/IExploreVideo';

const EXPLORE_API_URL = '/api/explore';

// Lấy danh sách video
export const getApprovedVideos = async (): Promise<IExploreVideo[]> => {
  const response = await api.get<IExploreVideo[]>(`${EXPLORE_API_URL}/videos`);
  return response.data;
};

// Upload video (Admin)
export const uploadVideo = async (data: IExploreVideoRequest): Promise<IExploreVideo> => {
  const response = await api.post<IExploreVideo>(`${EXPLORE_API_URL}/admin/upload`, data);
  return response.data;
};

// Cập nhật video (Admin)
export const updateVideo = async (videoId: string, data: IExploreVideoRequest): Promise<IExploreVideo> => {
  const response = await api.put<IExploreVideo>(`${EXPLORE_API_URL}/admin/update/${videoId}`, data);
  return response.data;
};

// Xóa video (Admin)
export const deleteVideo = async (videoId: string): Promise<string> => {
  const response = await api.delete<string>(`${EXPLORE_API_URL}/admin/delete/${videoId}`);
  return response.data;
};

// --- QUAN TRỌNG: Hàm này đang bị thiếu gây ra lỗi ---
export const toggleVideoLike = async (videoId: string, isLike: boolean): Promise<IExploreVideo> => {
  // Gọi API: POST /api/explore/like/{videoId}?isLike=true/false
  const response = await api.post<IExploreVideo>(`${EXPLORE_API_URL}/like/${videoId}`, null, {
    params: { isLike }
  });
  return response.data;
};

