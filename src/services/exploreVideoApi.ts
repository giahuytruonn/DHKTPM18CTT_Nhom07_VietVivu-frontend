import api from './api';
import type { IExploreVideo, IExploreVideoRequest } from '../types/IExploreVideo';

const EXPLORE_API_URL = '/api/explore';

export const getApprovedVideos = async (): Promise<IExploreVideo[]> => {
  const response = await api.get<IExploreVideo[]>(`${EXPLORE_API_URL}/videos`);
  return response.data;
};

export const getPendingVideos = async (): Promise<IExploreVideo[]> => {
  const response = await api.get<IExploreVideo[]>(`${EXPLORE_API_URL}/admin/pending`);
  return response.data;
};

export const uploadVideo = async (data: IExploreVideoRequest): Promise<IExploreVideo> => {
  const response = await api.post<IExploreVideo>(`${EXPLORE_API_URL}/upload`, data);
  return response.data;
};

export const updateVideo = async (videoId: string, data: IExploreVideoRequest): Promise<IExploreVideo> => {
  const response = await api.put<IExploreVideo>(`${EXPLORE_API_URL}/admin/update/${videoId}`, data);
  return response.data;
};

export const deleteVideo = async (videoId: string): Promise<string> => {
  const response = await api.delete<string>(`${EXPLORE_API_URL}/admin/delete/${videoId}`);
  return response.data;
};

export const approveVideo = async (videoId: string): Promise<IExploreVideo> => {
  const response = await api.post<IExploreVideo>(`${EXPLORE_API_URL}/admin/approve/${videoId}`);
  return response.data;
};