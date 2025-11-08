export interface TourResponse {
  id: string;
  title: string;
  destination: string;
  price: number;   
  duration: string;  
  rating?: number;
  imageUrl?: string;
}