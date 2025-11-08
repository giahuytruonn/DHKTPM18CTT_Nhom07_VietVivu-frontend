export interface TourResponse {
  tourId: string;
  title: string;
  description?: string;
  destination: string;
  priceAdult: number;
  priceChild?: number;
  imageUrls?: string[];
}