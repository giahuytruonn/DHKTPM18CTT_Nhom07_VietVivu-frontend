export interface IExploreVideo {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  uploaderUsername: string;
  tourId: string | null;
  approved: boolean;
  uploadedAt: string;
}

export interface IExploreVideoRequest {
  title: string;
  description: string | null;
  videoUrl: string;
  tourId: string | null;
}