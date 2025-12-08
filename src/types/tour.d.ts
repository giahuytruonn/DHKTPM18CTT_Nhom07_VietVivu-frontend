
export type TourStatus = "OPEN_BOOKING" | "IN_PROGRESS" | "COMPLETED";


export interface TourResponse {
    tourId: string;
    title: string;
    description: string;
    initialQuantity: number;
    quantity: number;
    priceAdult: number;
    priceChild: number;
    duration: string;
    destination: string;
    availability: boolean;
    startDate: string | null;
    endDate: string | null;
    tourStatus: TourStatus;
    itinerary: string[];
    imageUrls: string[];
    totalBookings: number;
    favoriteCount: number;
    isFavorited: boolean;
    manualStatusOverride?: boolean;
};