/**
 * Response chứa thông tin tour
 */
export interface TourResponse {
  tourId: any;
  id: string;
  title: string;
  description: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  destination: string;
  availability: boolean;
  startDate: string; // ISO date string
  itinerary: string;
  imageUrls: string[];
  averageRating: number;
  reviewCount: number;
  isFavorite: boolean;
}

