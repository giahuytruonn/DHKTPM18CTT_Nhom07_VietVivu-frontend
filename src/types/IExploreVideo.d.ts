export interface IExploreVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploaderUsername: string;
  uploadedAt: string;
  likeCount: number;
  tourId?: string | null;
}

export interface IExploreVideoRequest {
  title: string;
  description: string | null;
  videoUrl: string;
  tourId: string | null;
}